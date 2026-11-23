// Topluluk panosunun arka uç akışını uçtan uca sınaması.
//
//   npm run test:forum
//
// PostgREST taklitini (scripts/forum-mock-server.mjs) 8799 portunda açar, Vite'ı
// bu adrese yöneltir ve iki ayrı tarayıcıyla paylaşılan panoyu, beğeni/yorum
// işlemlerini ve canlı yenilemeyi doğrular. Gerçek Supabase projesi için
// VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY ortam değişkenleri aynı
// senaryoyu üretim adresine yönlendirir.
import { spawn, spawnSync } from 'node:child_process';
import { brotliDecompressSync } from 'node:zlib';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { chromium as pw } from '@playwright/test';
import { expect } from '@playwright/test';
import chromium from '@sparticuz/chromium';
import { createForumMock } from './forum-mock-server.mjs';

const root = path.dirname(path.dirname(import.meta.url.replace('file://', '')));
const mockPort = 8799;
const appPort = 5178;
const apiUrl = process.env.VITE_SUPABASE_URL || `http://localhost:${mockPort}`;
const target = process.env.VITE_SUPABASE_URL ? null : `http://localhost:${appPort}`;

async function waitFor(url, timeout = 60000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try { const response = await fetch(url); if (response.ok || response.status === 200 || response.status === 404) return; } catch { /* henüz değil */ }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Sunucu hazır değil: ${url}`);
}

async function waitForBoard(page, timeout = 15000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const pending = await page.getByText('Pano yükleniyor…').count();
    if (!pending) return;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error('Pano API yanıtı gelmedi');
}

const cache = path.resolve(root, '.playwright');
mkdirSync(`${cache}/libs`, { recursive: true });
const packageRoot = path.dirname(path.dirname(import.meta.resolve('@sparticuz/chromium').replace('file://', '')));
writeFileSync(`${cache}/al2023.tar`, brotliDecompressSync(readFileSync(`${packageRoot}/bin/al2023.tar.br`)));
spawnSync('tar', ['-xf', `${cache}/al2023.tar`, '-C', `${cache}/libs`], { stdio: 'ignore' });

const mock = process.env.VITE_SUPABASE_URL ? null : await createForumMock({ port: mockPort });
await mock?.listen();
console.log(`• pano adresi: ${apiUrl}`);

const viteBin = path.join(root, 'node_modules', '.bin', 'vite');
const vite = spawn(process.execPath, [viteBin, '--port', String(appPort), '--strictPort', '--host', '0.0.0.0'], {
  cwd: root,
  env: { ...process.env, VITE_SUPABASE_URL: apiUrl, VITE_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'mock-key' },
  stdio: 'inherit',
});
await waitFor(target);
console.log('• Vite önyüklemesi hazır');

// @sparticuz/chromium için ayıklanan paylaşımlı kütüphaneler işlem ortamından okunur.
process.env.LD_LIBRARY_PATH = `${cache}/libs/lib${process.env.LD_LIBRARY_PATH ? ':' + process.env.LD_LIBRARY_PATH : ''}`;
const browser = await pw.launch({ executablePath: await chromium.executablePath(), args: chromium.args.filter(arg => arg !== '--single-process') });
const errors = [];
try {
  // Cihaz A: adını kur, gönderi paylaş, beğen, yorum yap.
  const a = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  a.on('pageerror', error => errors.push('A: ' + error.message));
  await a.goto(`${target}/#/topluluk`);
  await waitForBoard(a);
  await a.locator('.profile-card input').click();
  await a.locator('.profile-card input').pressSequentially('Elif Yılmaz', { delay: 5 });
  await a.locator('.profile-card input').blur();
  await expect(a.locator('.profile-hint')).toContainText('Elif Yılmaz');
  await a.locator('.community-new').click();
  const composer = a.getByRole('dialog');
  await composer.getByRole('button', { name: 'Soru sor' }).click();
  await composer.getByLabel('İlgili ders (isteğe bağlı)').selectOption('9');
  await composer.getByLabel('Başlık (isteğe bağlı)').fill('Piramidal tractus mu yoksa extrapiramidal mı?');
  await composer.getByLabel('İçerik').fill('Bu iki sistemi ayırt eden en temel klinik bulgu hangisidir?');
  await composer.locator('.primary-button').click();
  await expect(a.locator('.post-card', { hasText: 'Piramidal tractus mu' })).toBeVisible();
  const mineA = a.locator('.post-card', { hasText: 'Piramidal tractus mu' });
  await expect(mineA.locator('.post-lesson')).toContainText('Ders 9');
  await mineA.locator('.like-button').click();
  await mineA.getByRole('button', { name: /yorum/ }).click();
  await mineA.getByPlaceholder('Yorum yaz…').fill('Çapraz buluş medial lemniskustan sonra olur.');
  await mineA.getByRole('button', { name: 'Yorumu gönder' }).click();
  await expect(mineA.getByRole('button', { name: /yorum/ })).toContainText('1 yorum');
  console.log('• cihaz A gönderi, beğeni ve yorum ekledi');

  // Cihaz B: farklı tarayıcı aynı panoyu görür.
  const b = await browser.newPage({ viewport: { width: 390, height: 844 } });
  b.on('pageerror', error => errors.push('B: ' + error.message));
  await b.goto(`${target}/#/topluluk`);
  await waitForBoard(b);
  const mineB = b.locator('.post-card', { hasText: 'Piramidal tractus mu' });
  await expect(mineB).toBeVisible();
  await expect(mineB.locator('.post-author strong')).toHaveText('Elif Yılmaz');
  await expect(mineB.locator('.like-button span')).toHaveText('1');
  expect(await b.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  console.log('• cihaz B ortak panoyu ve beğeniyi gördü');

  // Cihaz B adını kurup yorum ekler; A odaklanınca canlı yenilenmeli.
  await mineB.getByRole('button', { name: /yorum/ }).click();
  await b.locator('.comment-gate').click();
  const profileB = b.locator('#community-profile-input');
  await profileB.pressSequentially('Kerem', { delay: 5 });
  await profileB.blur();
  const commentB = mineB.getByPlaceholder('Yorum yaz…');
  await expect(commentB).toBeVisible();
  await commentB.fill('Benim notumda betonleşme örneği var.');
  await mineB.getByRole('button', { name: 'Yorumu gönder' }).click();
  await a.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(mineA.getByRole('button', { name: /yorum/ })).toContainText('2 yorum', { timeout: 10000 });
  console.log('• canlı pano diğer cihazın yorumunu getirdi');
} finally {
  await browser.close();
  vite?.kill();
  await mock?.close();
}
if (errors.length) { console.error('sayfa hataları:', errors); process.exit(1); }
console.log('tüm arka uç senaryoları geçti');
