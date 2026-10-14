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
  await expect(page.locator('.lesson-content')).toContainText('Sinoatriyal düğüm');
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
  await page.getByRole('navigation',{name:'Ders içindekiler'}).getByRole('button',{name:'Düzlemler ve eksenler'}).click();
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
    await expect(page.locator('.edition-switch')).toHaveCount(0);
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
    for(const number of [1,4,5,6,7,8,9,10,11]) {
      await page.goto(`/#/ders/${number}`);
      await page.evaluate(()=>document.fonts.ready);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}, lesson ${number}`).toBeTruthy();
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto('/#/ders/7');
  await page.screenshot({path:'.playwright/web-mobile.png',animations:'disabled'});
  await page.locator('.mobile-toc summary').click();
  await page.getByRole('navigation',{name:'Mobil içindekiler'}).getByRole('button',{name:'Dört boşluklu merkez'}).click();
  await expect(page.locator('#lesson-kalp')).toBeInViewport();
  await expect(page.locator('.mobile-toc')).not.toHaveAttribute('open','');
});

test('authored digestive lesson covers the whole organ sequence without loading slide dumps', async ({ page }) => {
  const sourceRequests=[];
  page.on('request', r=>{ if(r.url().includes('course-content')) sourceRequests.push(r.url()); });
  await page.route('**/course-content/**', route=>route.abort());
  await page.goto('/#/ders/8');
  await expect(page.locator('.lesson-content')).toContainText('Peyer plakları');
  await expect(page.locator('.lesson-content')).toContainText('Langerhans adacıkları');
  await expect(page.locator('#lesson-mide')).toHaveText(/Mide:/);
  await expect(page.locator('#lesson-portal')).toHaveText(/Portal dolaşım/);
  await expect(page.locator('.coverage-seal, .source-page, .edition-switch')).toHaveCount(0);
  const toc=page.getByRole('navigation',{name:'Ders içindekiler'});
  await toc.getByRole('button',{name:/Pankreas: bir organda/}).click();
  await expect(page.locator('#lesson-pankreas')).toBeInViewport();
  await expect(page.locator('#lesson-pankreas')).toBeFocused();
  await page.reload();
  await expect(page.locator('.lesson-content')).toContainText('Karaciğer sinüzoidleri');
  expect(sourceRequests).toEqual([]);
});

test('expanded muscles and nervous lessons have regional explanations and readable tables', async ({ page }) => {
  await page.goto('/#/ders/6');
  await expect(page.locator('.lesson-content')).toContainText('semitendinosus');
  await expect(page.locator('#lesson-sirt')).toHaveText(/Sırt kasları/);
  await expect(page.locator('#lesson-bacak')).toHaveText(/Bacak kasları/);
  await page.goto('/#/ders/9');
  await expect(page.locator('#lesson-omurilik')).toHaveText(/Omurilik/);
  await expect(page.locator('#lesson-kraniyal')).toHaveText(/On iki çift/);
  await expect(page.getByRole('rowheader',{name:'XII · N. hypoglossus',exact:true})).toBeVisible();
  await page.setViewportSize({width:320,height:844});
  await page.getByRole('button',{name:'Yazıyı büyüt'}).click();
  await page.getByRole('button',{name:'Yazıyı büyüt'}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
