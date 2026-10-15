import { test, expect } from '@playwright/test';

test('catalog, Turkish/Latin search, filtering, sorting and view controls', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto('/');
  await expect(page.locator('.note-card')).toHaveCount(12);
  await page.getByRole('searchbox').fill('DOLASIM');
  await expect(page.locator('.note-card')).toHaveCount(1);
  await expect(page.locator('.note-card h3')).toHaveText('Dolaşım Sistemi');
  await page.getByRole('searchbox').fill('arthrologia');
  await expect(page.locator('.note-card h3')).toHaveText('Eklem Bilimi');
  await page.getByRole('button', {name:'Aramayı temizle'}).click();
  await page.locator('.category-filters').getByRole('button', {name:'Hareket sistemi'}).click();
  await expect(page.locator('.note-card')).toHaveCount(5);
  await page.getByRole('searchbox').fill('xyznotfound');
  await expect(page.locator('.empty-state')).toBeVisible();
  await page.getByRole('button', {name:'Filtreleri temizle'}).click();
  await expect(page.locator('.note-card')).toHaveCount(12);
  await page.getByLabel('Notları sırala').selectOption('reverse');
  await expect(page.locator('.note-card h3').first()).toHaveText('Önerilen Atlaslar ve Kitaplar');
  await page.getByLabel('Liste görünümü').click();
  await expect(page.locator('.notes-grid')).toHaveClass(/list-view/);
  expect(errors).toEqual([]);
});

test('saved collection persists across reloads and can be cleared', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button',{name:'Anatomiye Giriş: kaydet',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('kaydedildi');
  await page.reload();
  await page.getByRole('button',{name:'Kaydedilenler 1',exact:true}).click();
  await expect(page.locator('.note-card')).toHaveCount(1);
  await page.getByRole('button',{name:'Anatomiye Giriş: kaydedilenlerden kaldır',exact:true}).click();
  await expect(page.locator('.empty-state')).toContainText('Kendi koleksiyonunu oluştur.');
});

test('reader uses exact source IDs, next/previous, completion, and Escape', async ({ page }) => {
  // Only the embedded third-party document is stubbed. This tests UI, not Drive access.
  await page.route('https://drive.google.com/file/d/**/preview', route => route.fulfill({contentType:'text/html',body:'<html><body>PDF test fixture</body></html>'}));
  await page.goto('/');
  await page.getByRole('button',{name:'Anatomiye Giriş: PDF’yi aç',exact:true}).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('iframe')).toHaveAttribute('src','https://drive.google.com/file/d/15OxNPqApSUJ2-rnQoui2EVshH-MdM_IC/preview');
  await expect(dialog).toContainText('Öğr. Gör. Bekir Dağdeviren');
  await expect(dialog.getByRole('button',{name:'Önceki not'})).toBeDisabled();
  await dialog.getByRole('button',{name:'Okundu olarak işaretle',exact:true}).click();
  await expect(dialog.getByRole('button',{name:'Okundu olarak işaretlendi'})).toBeVisible();
  await dialog.getByRole('button',{name:'Sonraki not'}).click();
  await expect(dialog.locator('h2')).toHaveText('Hareket Sistemi');
  await dialog.getByRole('button',{name:'Önceki not'}).click();
  await expect(dialog.getByRole('button',{name:'Okundu olarak işaretlendi'})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.study-note')).toContainText('1 / 12');
  await page.getByRole('button',{name:'Okumaya devam et'}).click();
  await expect(page.getByRole('dialog').locator('h2')).toHaveText('Anatomiye Giriş');
});

test('profile and help correctly attribute materials and explain permissions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button',{name:'Hocamız Hakkında',exact:true}).click();
  await expect(page.locator('.profile-panel')).toContainText('Bekir Dağdeviren');
  await expect(page.locator('.about-page')).toContainText('resmî web sitesi değildir');
  await expect(page.getByRole('link',{name:'Akademik profilini incele'})).toHaveAttribute('href','https://abs.firat.edu.tr/tr/bdagdeviren');
  await page.getByRole('button',{name:'Nasıl kullanılır?'}).click();
  await expect(page.getByRole('dialog')).toContainText('yalnızca bu cihazın tarayıcısında');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('narrow mobile layout has no horizontal overflow and navigation works', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  await expect(page.getByRole('button',{name:'Menüyü aç'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await expect(page.locator('.sidebar')).not.toBeVisible();
  await page.screenshot({path:'.playwright/mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Menüyü aç'}).click();
  await page.getByRole('button',{name:'Ders Kütüphanesi 12',exact:true}).click();
  await expect(page.locator('.hero')).toHaveCount(0);
  await expect(page.locator('.note-card')).toHaveCount(12);
  await page.getByRole('button',{name:'Menüyü aç'}).click();
  await page.getByRole('button',{name:'Hocamız Hakkında',exact:true}).click();
  await expect(page.locator('.profile-panel')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});

test('desktop screenshot and corrupt-storage recovery', async ({ page }) => {
  await page.addInitScript(()=>{ localStorage.setItem('anatom-saved','broken JSON'); localStorage.setItem('anatom-completed','{"bad":true}'); });
  await page.goto('/');
  await expect(page.locator('.note-card')).toHaveCount(12);
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:'.playwright/desktop.png',fullPage:true});
});

test('web and PDF readers are separate modes with consistent source attribution', async ({ page }) => {
  await page.route('https://drive.google.com/file/d/**/preview', route => route.fulfill({contentType:'text/html',body:'<html><body>PDF fixture</body></html>'}));
  await page.goto('/');
  await expect(page).toHaveTitle(/ANATOMİ/);
  await expect(page.locator('.card-web-button')).toHaveCount(12);
  await expect(page.locator('.card-pdf-button')).toHaveCount(12);
  await page.getByRole('button',{name:'Dolaşım Sistemi: sitede oku',exact:true}).click();
  await expect(page).toHaveURL(/#\/ders\/7$/);
  await expect(page.locator('.lesson-hero h1')).toHaveText('Dolaşım Sistemi');
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('.lesson-content')).toContainText('Aorta ve üst ekstremite arterlerinin yolu');
  await expect(page.locator('.source-page')).toHaveCount(0);
  await expect(page.locator('.lesson-credit')).toContainText('Bekir Dağdeviren');
  await expect(page.locator('.web-edition-note')).toContainText('yeniden yazıldı');
  await page.locator('.reading-modes').getByRole('button',{name:'Orijinal PDF'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('iframe')).toHaveAttribute('src','https://drive.google.com/file/d/185OzTu2BEO6gO-EQB1okCEuXNu7S9E-c/preview');
  await page.getByRole('dialog').getByRole('button',{name:'Sitede oku'}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.lesson-hero h1')).toHaveText('Dolaşım Sistemi');
  await page.reload();
  await expect(page.locator('.lesson-hero h1')).toHaveText('Dolaşım Sistemi');
  await expect(page).toHaveTitle(/Dolaşım Sistemi.*ANATOMİ/);
});

test('web reading tools, table of contents, review answers and shared saved state', async ({ page }) => {
  await page.goto('/#/ders/1');
  await page.getByRole('button',{name:'Yazıyı büyüt'}).click();
  await expect(page.locator('.lesson-page')).toHaveAttribute('style', /18px/);
  await page.reload();
  await expect(page.locator('.lesson-page')).toHaveAttribute('style', /18px/);
  await page.getByRole('navigation',{name:'Ders içindekiler'}).getByRole('button',{name:'Düzlemler, eksenler ve hareket ilişkisi'}).click();
  await expect(page.locator('#lesson-duzlemler')).toBeInViewport();
  await expect(page.locator('#lesson-duzlemler')).toBeFocused();
  await page.locator('.lesson-save').click();
  await expect(page.locator('.lesson-save')).toContainText('Kaydedildi');
  const question = page.locator('.review-section details').first();
  await question.locator('summary').click();
  await expect(question.locator('p')).toBeVisible();
  await expect(question.locator('p')).toContainText('Ön ve arka');
  await page.locator('.lesson-completion').getByRole('button',{name:'Okundu olarak işaretle',exact:true}).click();
  await expect(page.locator('.study-note')).toContainText('1 / 12');
  await page.getByRole('button',{name:'Kütüphaneye dön'}).click();
  await expect(page.locator('.note-card').first().locator('.bookmark-button')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.note-card').first()).toContainText('Okundu');
});

test('web routes support browser back/forward and invalid links safely', async ({ page }) => {
  await page.goto('/#/kutuphane');
  await page.getByRole('button',{name:'Anatomiye Giriş: sitede oku',exact:true}).click();
  await page.locator('.lesson-next-prev').getByRole('button',{name:/SONRAKİ NOT/}).click();
  await expect(page.locator('.lesson-hero h1')).toHaveText('Hareket Sistemi');
  await page.goBack();
  await expect(page.locator('.lesson-hero h1')).toHaveText('Anatomiye Giriş');
  await page.goBack();
  await expect(page.locator('.note-card')).toHaveCount(12);
  await page.goForward();
  await expect(page.locator('.lesson-hero h1')).toHaveText('Anatomiye Giriş');
  await page.goto('/#/ders/99');
  await expect(page.locator('.hero')).toBeVisible();
});

test('all 12 web notes and illustrations load without Google requests', async ({ page }) => {
  const googleRequests = [];
  page.on('request',request=>{if(request.url().includes('google.com')) googleRequests.push(request.url());});
  const errors = [];
  page.on('pageerror',error=>errors.push(error.message));
  for(let number=0; number<12; number++) {
    await page.goto(`/#/ders/${number}`);
    await expect(page.locator('.lesson-hero h1')).toBeVisible();
    await expect(page.locator('.lesson-content')).toBeVisible();
    await expect(page.locator('.source-page')).toHaveCount(0);
    await expect(page.locator('.lesson-illustration img')).toBeVisible();
    await expect.poll(()=>page.locator('.lesson-illustration img').evaluate(img=>img.complete && img.naturalWidth>0)).toBeTruthy();
    await expect(page.locator('iframe')).toHaveCount(0);
  }
  expect(googleRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('mobile web notes stay within the viewport, including long titles and tables', async ({ page }) => {
  for(const width of [320,390,768]) {
    await page.setViewportSize({width,height:844});
    for(const number of [1,4,5,7,8,9,10,11]) {
      await page.goto(`/#/ders/${number}`);
      await page.evaluate(()=>document.fonts.ready);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}, lesson ${number}`).toBeTruthy();
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto('/#/ders/7');
  await page.screenshot({path:'.playwright/web-mobile.png',animations:'disabled'});
  await page.locator('.mobile-toc summary').click();
  await page.getByRole('navigation',{name:'Mobil içindekiler'}).getByRole('button',{name:'Dört boşluk ve aralarındaki bölmeler'}).click();
  await expect(page.locator('#lesson-odaciklar')).toBeInViewport();
  await expect(page.locator('.mobile-toc')).not.toHaveAttribute('open','');
});

test('authored lessons cover distal topics with no dependency on source extraction requests', async ({ page }) => {
  const sourceRequests=[];
  page.on('request', request=>{if(request.url().includes('/course-content/')) sourceRequests.push(request.url());});
  await page.route('**/course-content/**', route=>route.abort());
  await page.goto('/#/ders/8');
  await expect(page.locator('.lesson-section')).toHaveCount(19);
  await expect(page.locator('.edition-switch, .source-page')).toHaveCount(0);
  const toc=page.getByRole('navigation',{name:'Ders içindekiler'});
  await toc.getByRole('button',{name:'Portal dolaşım: bağırsaktan önce karaciğere'}).click();
  await expect(page.locator('#lesson-portal')).toBeFocused();
  await expect(page.locator('#lesson-portal')).toBeInViewport();
  await expect(page.locator('#lesson-portal').locator('..').locator('..')).toContainText('iki kapiller yatak');
  await expect(page.locator('.lesson-content')).toContainText('Mezenterik venler');
  await page.reload();
  await expect(page.locator('#lesson-pankreas')).toHaveText('Pankreasın dış ve iç salgısı');
  expect(sourceRequests).toEqual([]);
  await page.screenshot({path:'.playwright/authored-digestive.png',animations:'disabled'});
});

test('maximum reading size remains usable in long tables and mobile contents', async ({ page }) => {
  await page.setViewportSize({width:320,height:844});
  await page.goto('/#/ders/9');
  await page.getByRole('button',{name:'Yazıyı büyüt'}).click();
  await page.getByRole('button',{name:'Yazıyı büyüt'}).click();
  await expect(page.getByRole('button',{name:'Yazıyı büyüt'})).toBeDisabled();
  await page.locator('.mobile-toc summary').click();
  await page.getByRole('navigation',{name:'Mobil içindekiler'}).getByRole('button',{name:'On iki çift kranial sinir'}).click();
  await expect(page.locator('#lesson-kranial')).toBeFocused();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await expect(page.locator('.reading-progress')).toHaveAttribute('aria-valuenow',/^[0-9]{1,3}$/);
});

test('all 26 inline diagrams load locally with captions and no console errors', async ({ page }) => {
  test.setTimeout(60000);
  const errors = [];
  const external = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith('http://localhost:5175')) external.push(request.url()); });
  let count = 0;
  for (let number = 1; number <= 11; number++) {
    await page.goto(`/#/ders/${number}`);
    await expect(page.locator('.lesson-subsection').first()).toBeAttached();
    const figures = page.locator('.instructional-figure');
    const figureCount = await figures.count();
    expect(figureCount).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < figureCount; i++) {
      const figure = figures.nth(i);
      const image = figure.locator('.figure-plate>img');
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
      await expect(figure.locator('figcaption h3')).toBeVisible();
      expect(await figure.locator('.figure-legend dt').count()).toBeGreaterThanOrEqual(3);
      count++;
    }
  }
  expect(count).toBe(26);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('diagram dialog traps focus, zooms, closes on Escape and restores reader focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/ders/8');
  const figure = page.locator('[data-diagram="tooth"]');
  const trigger = figure.getByRole('button', {name:/Şemayı büyüt/});
  await trigger.click();
  const dialog = page.getByRole('dialog', {name:'Bir dişin katmanları'});
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole('button', {name:'Şemayı kapat'});
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => !!document.activeElement.closest('dialog'))).toBeTruthy();
  await dialog.getByRole('button', {name:'Şemayı yakınlaştır'}).click();
  await expect(dialog.locator('output')).toHaveText('%125');
  expect(await dialog.locator('.figure-zoom-viewport img').evaluate(img => img.getBoundingClientRect().width)).toBe(950);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await trigger.click();
  await expect(page.getByRole('dialog').locator('output')).toHaveText('%100');
  await page.getByRole('button', {name:'Şemayı kapat'}).click();
  await expect(trigger).toBeFocused();
  // This figure is taller than the original viewport. Give the screenshot a full
  // viewport rather than relying on Chromium's temporary resize at a fractional Y.
  await page.setViewportSize({width:1440,height:1400});
  await figure.screenshot({path:'.playwright/inline-tooth-desktop.png',animations:'disabled'});
});

test('mobile figures keep readable legends and contain zoom scrolling at maximum reading size', async ({ page }) => {
  await page.setViewportSize({width:320,height:844});
  await page.goto('/#/ders/7');
  await page.getByRole('button',{name:'Yazıyı büyüt'}).click();
  await page.getByRole('button',{name:'Yazıyı büyüt'}).click();
  const figure = page.locator('[data-diagram="heart-flow"]');
  await figure.scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  expect(await figure.locator('.figure-legend dd').first().evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(17);
  await figure.getByRole('button', {name:/Şemayı büyüt/}).click();
  const viewport = page.getByRole('region', {name:'Büyütülmüş şema; kaydırarak incele'});
  expect(await viewport.evaluate(el => el.scrollWidth > el.clientWidth)).toBeTruthy();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.getByRole('button',{name:'Şemayı kapat'}).click();
  await figure.screenshot({path:'.playwright/inline-heart-mobile.png',animations:'disabled'});
});

test('full chapter explanations and nested topic navigation render on desktop and mobile', async ({ page }) => {
  await page.goto('/#/ders/6');
  await expect(page.locator('.lesson-subsection')).toHaveCount(28);
  const toc = page.getByRole('navigation', {name:'Ders içindekiler'});
  await toc.getByRole('button', {name:'Kol kompartmanları ve el kas grupları'}).click();
  await toc.getByRole('button', {name:'Ayrıntı: Kol kaslarında başlangıç, tutunma ve sinir',exact:true}).click();
  await expect(page.locator('#lesson-kol-el-detail-2')).toBeFocused();
  await expect(page.locator('#lesson-kol-el-detail-2')).toBeInViewport();
  const detail = page.locator('#lesson-kol-el-detail-2').locator('..');
  await expect(detail.locator('p')).toHaveCount(2);
  await expect(detail.locator('table')).toContainText('Musculocutaneous');
  await page.screenshot({path:'.playwright/full-course-muscles.png',animations:'disabled'});

  await page.setViewportSize({width:320,height:844});
  await page.goto('/#/ders/8');
  await expect(page.locator('.lesson-subsection')).toHaveCount(38);
  await page.getByRole('button',{name:'Yazıyı büyüt'}).click();
  await page.getByRole('button',{name:'Yazıyı büyüt'}).click();
  await page.locator('.mobile-toc summary').click();
  const mobile = page.getByRole('navigation', {name:'Mobil içindekiler'});
  await mobile.getByRole('button',{name:'Jejunum ve ileum; emilim yüzeyinin düzeni'}).click();
  await page.locator('.mobile-toc summary').click();
  await mobile.getByRole('button',{name:'Ayrıntı: Emilim yüzeyinin üç ölçeği ve mezenterin içeriği',exact:true}).click();
  await expect(page.locator('#lesson-jejunum-ileum-detail-2')).toBeFocused();
  await expect(page.locator('.mobile-toc')).not.toHaveAttribute('open','');
  await expect(page.locator('#lesson-jejunum-ileum-detail-2').locator('..')).toContainText('B12');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});

test('instructor profile uses the official portrait URL with responsive framing', async ({ page }) => {
  const source='https://apiabs.firat.edu.tr/images/userProfilePicture/6771957e-d99c-4285-a146-5f646d594830.jpeg';
  // A neutral fixture verifies rendering; it does not stand in for a real identity photo.
  await page.route(source, route => route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="180" height="240"><rect width="180" height="240" fill="#a8b69a"/></svg>'}));
  await page.goto('/#/hakkinda');
  const photo=page.getByRole('img',{name:'Öğr. Gör. Bekir Dağdeviren’in portresi'});
  await expect(photo).toBeVisible();
  await expect(photo).toHaveAttribute('src',source);
  await expect(photo).toHaveAttribute('referrerpolicy','no-referrer');
  await expect.poll(()=>photo.evaluate(img=>img.complete && img.naturalWidth>0)).toBeTruthy();
  await expect(page.getByRole('link',{name:'Fotoğraf: Akademik Bilgi Sistemi'})).toHaveAttribute('href','https://abs.firat.edu.tr/tr/bdagdeviren');
  for(const width of [320,390,768]) {
    await page.setViewportSize({width,height:844});
    await expect(photo).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  }
});

test('unavailable official photo falls back without a broken image or invented portrait', async ({ page }) => {
  await page.route('https://apiabs.firat.edu.tr/images/userProfilePicture/**',route=>route.abort());
  await page.goto('/#/hakkinda');
  await expect(page.getByRole('img',{name:'Bekir Dağdeviren — fotoğraf yüklenemedi'})).toBeVisible();
  await expect(page.locator('.instructor-portrait img')).toHaveCount(0);
  await expect(page.getByRole('link',{name:'Fotoğrafı akademik profilde gör'})).toHaveAttribute('href','https://abs.firat.edu.tr/tr/bdagdeviren');
  await expect(page.getByRole('link',{name:'Akademik profilini incele'})).toBeVisible();
});

test('site creator credit is shared across pages and distinct from the instructor attribution', async ({ page }) => {
  await page.route('https://apiabs.firat.edu.tr/**',route=>route.abort());
  for(const width of [1440,320]) {
    await page.setViewportSize({width,height:900});
    for(const route of ['/', '/#/hakkinda', '/#/ders/1']) {
      await page.goto(route);
      const credit=page.locator('.site-footer .site-maker');
      await expect(credit).toHaveText('Tasarım ve geliştirme: Muhammet TUĞRUL');
      await expect(credit.locator('strong')).toHaveText('Muhammet TUĞRUL');
      await credit.scrollIntoViewIfNeeded();
      await expect(credit).toBeInViewport();
      await page.evaluate(()=>document.fonts.ready);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
      if(route.includes('hakkinda')) await expect(page.locator('.profile-panel')).toContainText('Bekir Dağdeviren');
      if(route.includes('ders')) await expect(page.locator('.lesson-credit')).toContainText('Kaynak: Öğr. Gör. Bekir Dağdeviren');
    }
  }
});

test('anatomy logo is local, crisp and shared by desktop, mobile and footer navigation', async ({ page }) => {
  await page.goto('/');
  const primary = page.locator('.brand-button .brand-symbol');
  await expect(primary).toHaveAttribute('src','/brand/anatomi-mark.svg');
  await expect.poll(()=>primary.evaluate(img=>img.complete && img.naturalWidth>0)).toBeTruthy();
  await expect(page.locator('.site-footer .brand-symbol')).toHaveAttribute('src','/brand/anatomi-mark-small.svg');
  const favicon=await page.request.get('/favicon.svg');
  expect(favicon.ok()).toBeTruthy();
  expect(await favicon.text()).not.toContain('<ellipse');
  await page.locator('.brand-button').screenshot({path:'.playwright/anatomi-brand-desktop.png'});
  await page.goto('/#/ders/1');
  await page.locator('.brand-button').click();
  await expect(page.locator('.hero')).toBeVisible();
  for(const width of [320,390]) {
    await page.setViewportSize({width,height:844});
    const mobile=page.locator('.mobile-brand img');
    await expect(mobile).toBeVisible();
    await expect.poll(()=>mobile.evaluate(img=>img.complete && img.naturalWidth>0)).toBeTruthy();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  }
  await page.screenshot({path:'.playwright/anatomi-brand-mobile.png'});
});

test('3D atlas embeds the licensed viewer, switches scenes and stays synced with the lessons', async ({ page }) => {
  // Only the third-party 3D viewer is stubbed; this verifies our own UI, deep links and routing.
  await page.route('https://www.zygotebody.com/**', route => route.abort());
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto('/#/atlas');
  await expect(page.locator('.atlas-page')).toBeVisible();
  await expect(page.locator('.atlas-hero h1')).toHaveText('3D Anatomi Atlası');
  // Sağlayıcının marka adı arayüz metninde görünmez; yalnızca ince telif satırı kalır.
  const atlasText = await page.locator('.atlas-page').innerText();
  expect(atlasText).not.toMatch(/ZygoteBody/i);
  await expect(page.locator('.atlas-credit-line')).toHaveText('3B anatomik model ve veriler © Zygote 3D.');
  await expect(page.locator('.atlas-viewer iframe')).toHaveAttribute('src', 'https://www.zygotebody.com/');
  await expect(page.locator('.atlas-scene')).toHaveCount(18);
  await page.locator('.atlas-groups').getByRole('button', { name: 'Tek yapı odağı' }).click();
  await expect(page.locator('.atlas-scene')).toHaveCount(6);
  await page.locator('.atlas-groups').getByRole('button', { name: 'Tüm görünümler' }).click();
  await expect(page.locator('.atlas-scene')).toHaveCount(18);
  await expect(page.locator('.atlas-overlay-slow')).toContainText('ulaşılamıyor');
  await expect(page.locator('.atlas-status')).toContainText('açılamadı');
  await page.getByRole('button', { name: 'Pencereyi yine de göster' }).click();
  await expect(page.locator('.atlas-overlay-slow')).toHaveCount(0);
  await page.locator('.atlas-scene', { hasText: 'Beyin' }).click();
  await expect(page).toHaveURL(/#\/atlas\/beyin$/);
  await expect(page.locator('.atlas-viewer iframe')).toHaveAttribute('src', /zygotebody\.com\/#nav=.*sel=p:;h:;s:1754;c:-0\.6;o:-0\.75/);
  await expect(page.locator('.atlas-hero-card strong')).toHaveText('Beyin');
  await expect(page.locator('.atlas-guide-main h2')).toContainText('Beyin');
  await expect(page.locator('.atlas-lesson-link')).toContainText('Ders 09');
  await page.locator('.atlas-lesson-link').click();
  await expect(page).toHaveURL(/#\/ders\/9$/);
  await expect(page.locator('.lesson-atlas-note')).toContainText('Sinir sistemi');
  expect(await page.locator('body').innerText()).not.toMatch(/ZygoteBody/i);
  await page.locator('.reading-modes').getByRole('button', { name: '3D atlas' }).click();
  await expect(page).toHaveURL(/#\/atlas\/sinir$/);
  await expect(page.locator('.atlas-hero-card strong')).toHaveText('Sinir sistemi');
  await page.locator('.atlas-breadcrumb').getByRole('button', { name: 'Kütüphaneye dön' }).click();
  await expect(page.locator('.note-card')).toHaveCount(12);
  expect(errors).toEqual([]);
});

test('atlas scenes survive reloads, keep their saved state and offer a working fallback', async ({ page }) => {
  await page.route('https://www.zygotebody.com/**', route => route.abort());
  await page.goto('/#/atlas/iskelet');
  await expect(page.locator('.atlas-hero-card strong')).toHaveText('İskelet sistemi');
  await expect(page.locator('.atlas-scene.active')).toContainText('İskelet sistemi');
  await page.locator('.atlas-tools').getByRole('button', { name: 'Sahneyi kaydet' }).click();
  await expect(page.locator('.atlas-tools').getByRole('button', { name: 'Sahneyi kaydedilenlerden kaldır' })).toBeVisible();
  await page.reload();
  await expect(page.locator('.atlas-hero-card strong')).toHaveText('İskelet sistemi');
  await expect(page.locator('.atlas-saved-scenes')).toContainText('İskelet sistemi');
  await expect(page.locator('.atlas-open')).toHaveAttribute('href', /^https:\/\/www\.zygotebody\.com\/#nav=.*s:5;/);
  await page.goto('/');
  await expect(page.locator('.atlas-band')).not.toContainText('ZygoteBody');
  await expect(page.locator('.atlas-band-foot a')).toHaveText('Atlası kaynağında aç');
  expect((await page.locator('.atlas-band').innerText()).trim()).not.toMatch(/^sitesi|\| sitesi/);
  await page.goto('/#/atlas/tum-vucut');
  await page.locator('.nav-item', { hasText: '3D Anatomi Atlası' }).click();
  await expect(page.locator('.atlas-hero-card strong')).toHaveText('Tüm vücut');
});

test('atlas layout keeps narrow screens free of horizontal overflow', async ({ page }) => {
  await page.route('https://www.zygotebody.com/**', route => route.abort());
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/atlas/akcigerler');
    await expect(page.locator('.atlas-guide-main h2')).toContainText('Akciğerler');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/#/atlas/iskelet');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: '.playwright/atlas-desktop.png' });
});

test('visual study links, guided explanation and independent recall controls work', async ({ page }) => {
  await page.goto('/#/ders/7');
  const study = page.getByRole('region', { name: 'Görerek öğren çalışma alanı' });
  await expect(study).toContainText('Kanı bir tam devre');
  await study.getByText('Örnek yanıtı karşılaştır').click();
  await expect(study.locator('details')).toContainText('triküspit');
  await study.locator('.visual-study-grid button').first().click();
  const figure = page.locator('.instructional-figure').first();
  await expect(figure).toBeFocused();
  await figure.getByRole('button', {name:'Yapıları tek tek incele',exact:true}).click();
  await figure.locator('.figure-explorer').getByRole('button', {name:'2',exact:true}).click();
  await expect(figure.locator('.figure-explorer button').nth(1)).toHaveAttribute('aria-pressed','true');
  await figure.getByRole('button', {name:'Açıklamaları gizle / hatırla',exact:true}).click();
  await expect(figure.getByRole('button', {name:'1. açıklamayı göster',exact:true})).toBeVisible();
  await figure.getByRole('button', {name:'1. açıklamayı göster',exact:true}).click();
  await expect(figure.locator('.figure-legend dd').first().locator('button')).toHaveCount(0);
  await expect(figure.getByRole('button', {name:'2. açıklamayı göster',exact:true})).toBeVisible();
  await page.setViewportSize({width:320,height:740});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test('exam-oriented explanations teach distinctions and give accessible corrective feedback', async ({ page }) => {
  await page.goto('/#/ders/4');
  const map = page.getByRole('region', {name:'Soru konularına göre ayrıntılı anlatım'});
  await expect(map).toContainText('6 açıklamalı konu');
  await map.getByRole('button', {name:/Distal humerusta yüz mü/}).click();
  const heading = page.locator('#teaching-humerus-distal-tanima');
  await expect(heading).toBeFocused();
  const teaching = page.locator('.exam-teaching').filter({has:heading});
  await expect(teaching).toContainText('capitulum distal humerusta gerçekten vardır');
  const check = teaching.locator('.teaching-check');
  await expect(check.getByRole('button', {name:'Yanıtı kontrol et'})).toBeDisabled();
  await check.getByRole('radio').nth(0).check();
  await check.getByRole('button', {name:'Yanıtı kontrol et'}).click();
  await expect(check.getByRole('status')).toContainText('Henüz değil. Doğru yanıt: C');
  await expect(check.getByRole('status')).toContainText('Processus coronoideus ulnadaki');
  await expect(check.getByRole('radio').nth(2)).toBeDisabled();
  await check.getByRole('button', {name:'Yeniden dene'}).click();
  await check.getByRole('radio').nth(2).check();
  await check.getByRole('button', {name:'Yanıtı kontrol et'}).click();
  await expect(check.getByRole('status')).toContainText('Doğru. Şimdi gerekçeyi karşılaştır.');
  await expect(teaching.getByRole('img', {name:/Distal humerusta eklem/})).toHaveJSProperty('naturalWidth',760);
  await teaching.getByRole('button', {name:'Geniş görünümde incele'}).click();
  await expect(teaching.getByRole('region', {name:'Geniş şemayı yatay kaydırarak incele'})).toHaveAttribute('tabindex','0');
});

test('all added reading material and diagrams render locally; no PDF or exam archive is fetched', async ({ page }) => {
  const { teachingForLesson } = await import('../src/content/exam/index.js');
  const externalRequests = [];
  const errors = [];
  page.on('request', request => { if (/drive\.google|googleusercontent|course-content\/\d+\.json/.test(request.url())) externalRequests.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  let total = 0;
  let visuals = 0;
  for (let n = 1; n <= 11; n++) {
    await page.goto(`/#/ders/${n}`);
    const items = teachingForLesson(n);
    await expect(page.locator('.exam-teaching')).toHaveCount(items.length);
    await expect(page.locator('.teaching-check')).toHaveCount(items.length);
    for (const item of items) {
      await expect(page.locator(`#teaching-${item.id}`)).toHaveText(item.title);
      total++;
      if (item.visual) {
        const img = page.locator(`img[src$="/exam/${item.visual}.svg"]`);
        await img.scrollIntoViewIfNeeded();
        await expect(img).toHaveJSProperty('naturalWidth',760);
        visuals++;
      }
    }
  }
  expect(total).toBe(42);
  expect(visuals).toBe(6);
  expect(externalRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('added long-form tables, quizzes and visual navigation work at 320px and largest font', async ({ page }) => {
  const { teachingForLesson } = await import('../src/content/exam/index.js');
  await page.setViewportSize({width:320,height:800});
  await page.addInitScript(() => localStorage.setItem('anatomi-reading-size','20'));
  for (const n of [1,2,3,4,5,6,7,8,9,10,11]) {
    await page.goto(`/#/ders/${n}`);
    const map = page.getByRole('region', {name:'Soru konularına göre ayrıntılı anlatım'});
    await map.getByRole('button').last().click();
    await expect(page.locator(`#teaching-${teachingForLesson(n).at(-1).id}`)).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    if (n === 4) {
      const figure = page.locator('.teaching-figure').first();
      await figure.getByRole('button', {name:'Geniş görünümde incele'}).click();
      const region = figure.getByRole('region');
      expect(await region.evaluate(el => el.scrollWidth > el.clientWidth)).toBeTruthy();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    }
  }
  await page.goto('/#/ders/4');
  await page.getByRole('region', {name:'Soru konularına göre ayrıntılı anlatım'}).getByText('Kaynak kontrolü ve bilmen gereken sınırlar').click();
  await expect(page.locator('.exam-source-audit')).toContainText('Çankırı');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

const choosePracticeAnswer = async (page, correct = true) => {
  const {questionBank} = await import('../src/practice.js');
  const text = await page.locator('.practice-session h2').innerText();
  const topic = await page.locator('.practice-topic').innerText();
  const question = questionBank.find(q => q.q === text && topic.endsWith(q.topic));
  expect(question).toBeTruthy();
  const answer = question.options[correct ? question.correct : (question.correct+1)%question.options.length];
  const labels = page.locator('.practice-options label');
  const texts = await labels.locator('span').allTextContents();
  const index = texts.findIndex(s => s.endsWith(answer));
  expect(index).toBeGreaterThanOrEqual(0);
  await labels.nth(index).getByRole('radio').check();
  return question;
};

test('visual practice gives feedback, local numbered diagrams and a persistent spaced-repeat notebook', async ({page}) => {
  await page.goto('/#/calis');
  await expect(page.getByRole('heading',{name:'Kendini sına.'})).toBeVisible();
  await page.getByLabel('Konu',{exact:true}).selectOption('8');
  await page.getByLabel('Soru sayısı').selectOption('5');
  await page.getByRole('button',{name:'Çalışmaya başla'}).click();
  await expect(page.locator('.practice-session h2')).toBeFocused();
  await expect(page.getByRole('button',{name:'Yanıtı kontrol et'})).toBeDisabled();
  const question = await choosePracticeAnswer(page,false);
  await expect(page.locator('.practice-figure img')).toHaveJSProperty('complete',true);
  await page.getByRole('button',{name:'Metin ipucunu göster'}).click();
  await expect(page.locator('.practice-figure')).toContainText(question.hint);
  await page.getByRole('button',{name:'Yanıtı kontrol et'}).click();
  await expect(page.getByRole('status')).toContainText('Henüz değil.');
  await expect(page.getByRole('status')).toContainText(question.options[question.correct]);
  await expect(page.locator('.practice-options input').first()).toBeDisabled();
  await page.getByRole('button',{name:'Çalışmayı bitir',exact:true}).click();
  await page.getByRole('button',{name:'Çalışmaya devam et'}).click();
  await expect(page.locator('.practice-results')).toHaveCount(0);
  await page.getByRole('button',{name:'Çalışmayı bitir',exact:true}).click();
  await page.getByRole('button',{name:'Evet, sonuçları göster'}).click();
  await expect(page.locator('.practice-result-header')).toContainText('1 yanlış');
  await expect(page.locator('.practice-result-header')).toContainText('4 boş');
  await page.getByRole('button',{name:'Tekrar defterime git'}).click();
  await expect(page.locator('.practice-review-list li')).toHaveCount(5);
  await page.reload();
  await page.getByRole('button',{name:/Tekrar defterim/}).click();
  await expect(page.locator('.practice-review-list li')).toHaveCount(5);
  await expect(page.getByRole('button',{name:'Zamanı gelenleri çalış (0)'})).toBeDisabled();
  await page.getByRole('button',{name:'Tekrar çalış',exact:false}).first().click();
  await choosePracticeAnswer(page,true);
  await page.getByRole('button',{name:'Yanıtı kontrol et'}).click();
  await expect(page.getByRole('status')).toContainText('Doğru.');
  await page.getByRole('button',{name:'Çalışmayı bitir',exact:true}).click();
  await page.getByRole('button',{name:'Evet, sonuçları göster'}).click();
  await page.getByRole('button',{name:'Tekrar defterime git'}).click();
  await expect(page.locator('.practice-review-list li').first()).toContainText('1 ardışık doğru');
  await page.getByRole('button',{name:'Defteri temizle',exact:true}).click();
  await page.getByRole('button',{name:'Vazgeç',exact:true}).click();
  await expect(page.locator('.practice-review-list li')).toHaveCount(5);
  await page.getByRole('button',{name:'Defteri temizle',exact:true}).click();
  await page.getByRole('button',{name:'Evet, defteri temizle'}).click();
  await expect(page.getByText('Temiz bir başlangıç.')).toBeVisible();
});

test('exam mode hides explanations until finishing and links incorrect answers to their actual lesson section',async({page})=>{
  await page.goto('/#/calis');
  await page.getByRole('button',{name:/Deneme sınavı Konunu/}).click();
  await page.getByLabel('Konu',{exact:true}).selectOption('4');
  await page.getByLabel('Soru sayısı').selectOption('5');
  await page.getByLabel('Süre',{exact:true}).selectOption('0');
  await page.getByRole('button',{name:'Çalışmaya başla'}).click();
  const question=await choosePracticeAnswer(page,false);
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.locator('.practice-feedback')).toHaveCount(0);
  await page.getByRole('button',{name:'Sonraki soru'}).click();
  await choosePracticeAnswer(page,true);
  await page.getByRole('button',{name:/Soru 1 — yanıtlandı/}).click();
  await expect(page.locator('.practice-options input:checked')).toHaveCount(1);
  await page.getByRole('button',{name:'Çalışmayı bitir',exact:true}).click();
  await page.getByRole('button',{name:'Evet, sonuçları göster'}).click();
  await expect(page.locator('.practice-result-header')).toContainText('1 yanlış');
  await expect(page.locator('.practice-result-header')).toContainText('3 boş');
  const item=page.locator('.practice-result-item').first();
  await item.locator('summary').click();
  await expect(item).toContainText(question.why);
  await item.getByRole('button',{name:'İlgili konu anlatımına git'}).click();
  await expect(page).toHaveURL(/#\/ders\/4$/);
  await expect(page.locator(`#lesson-${question.section}`)).toBeFocused();
});

test('timed exam uses elapsed wall time and automatically grades blank answers on expiry',async({page})=>{
  await page.clock.install();
  await page.goto('/#/calis');
  await page.getByRole('button',{name:/Deneme sınavı Konunu/}).click();
  await page.getByLabel('Soru sayısı').selectOption('5');
  await page.getByLabel('Süre',{exact:true}).selectOption('10');
  await page.getByRole('button',{name:'Çalışmaya başla'}).click();
  await expect(page.getByRole('timer')).toContainText('10:00');
  await page.clock.fastForward(601000);
  await expect(page.locator('.practice-results')).toContainText('Süre doldu');
  await expect(page.locator('.practice-result-header')).toContainText('5 boş');
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('anatomi-practice-v1')));
  expect(Object.keys(stored)).toHaveLength(5);
  expect(Object.values(stored).every(item=>item.misses===1)).toBeTruthy();
});

test('practice is responsive, handles corrupt or unavailable storage and is reachable through navigation',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>localStorage.setItem('anatomi-practice-v1','broken json'));
  await page.setViewportSize({width:320,height:800});
  await page.goto('/');
  await page.locator('.practice-entry').getByRole('button',{name:'Kendini sına'}).click();
  await expect(page).toHaveURL(/#\/calis$/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.getByRole('button',{name:'Çalışmaya başla'}).click();
  await page.getByRole('button',{name:'Görseli büyüt'}).click();
  const region=page.getByRole('region',{name:'Geniş görseli kaydırarak incele'});
  expect(await region.evaluate(el=>el.scrollWidth>el.clientWidth)).toBeTruthy();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.goto('/#/calis');
  await page.evaluate(()=>Object.defineProperty(Storage.prototype,'setItem',{value(){throw new Error('blocked');}}));
  await page.reload();
  // Install the unavailable-storage condition before React mounts on the next page.
  await page.addInitScript(()=>Object.defineProperty(Storage.prototype,'setItem',{value(){throw new Error('blocked');}}));
  await page.reload();
  await expect(page.getByRole('status')).toContainText('Tarayıcı depolaması kullanılamıyor');
  await page.getByRole('button',{name:'Çalışmaya başla'}).click();
  await expect(page.locator('.practice-session')).toBeVisible();
  expect(errors).toEqual([]);
});
