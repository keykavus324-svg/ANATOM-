# ANATOMİ — Anatomi Ders Kütüphanesi

Dr. Öğr. Gör. **Bekir Dağdeviren**’in kaynak notları temel alınarak hazırlanmış bağımsız öğrenci projesi. Fırat Üniversitesi’nin resmî sitesi değildir; hocanın veya üniversitenin onay verdiği iddia edilmez.

**Site tasarım ve geliştirme:** Muhammet TUĞRUL. Ders notlarının kaynak atfı Dr. Öğr. Gör. Bekir Dağdeviren olarak korunur.

## Çalıştırma

Node.js 22+ önerilir.

```sh
npm ci
npm run dev          # 0.0.0.0:5173
npm run build        # dist/
npm run preview
```

React 19 + Vite, yerel fontlar ve Lucide ikonları. Backend, API anahtarı veya ziyaretçi hesabı gerekmez.

## İki okuma biçimi

- **Sitede oku:** Kaynaklar okunarak, kavramları ve ilişkileri açıklayacak şekilde yeniden yazılmış Türkçe konu anlatımı. 11 ders + 1 kaynak rehberi; 119 ana bölüm, 230 açıklayıcı alt bölüm, yaklaşık 43.700 kelimelik anlatım (şema açıklamalarıyla yaklaşık 45.500) ve 58 açılır tekrar sorusu. İçindekiler, karşılaştırma tabloları, akışlar, terim kartları ve konu içine yerleştirilmiş 26 numaralı öğretici şema içerir. Atlas tarzı temsili kapaklar da korunur. **Otomatik slayt metni veya sayfa görüntüsü göstermez.** Google isteği gerekmez.
- **PDF’yi aç:** Hocanın özgün belgesi Google Drive `/preview` iframe’inde görüntülenir; indirme zorunluluğu yoktur. Erişim dosyanın mevcut paylaşım izinlerine bağlıdır. Anonim erişim ayrıca doğrulanmalıdır.

İlk sürümdeki “Kaynağın tamamı / Hızlı tekrar” seçimi kaldırılmıştır. Web okuyucusunun tek ana içeriği artık yazılmış ders anlatımıdır. PDF bağımsız bir okuma seçeneğidir. Kaynak sahibi ile web metninin hazırlayanı ayrı belirtilir; yeniden yazılan metin hocanın kendi eseri veya onayladığı ders kitabı olarak sunulmaz.

## Dil desteği (Türkçe · English · العربية)

Arayüz üç dilde çalışır: **Türkçe**, **English** ve **العربية**. Dil seçici masaüstünde üst çubukta, mobilde menünün içinde (TR/EN/AR) yer alır; seçim `anatomi-language` anahtarıyla cihazda saklanır ve Arapça seçildiğinde belge yönü `dir="rtl"` olur.

- **Çevrilen:** menü ve gezinme, ana sayfa bölümleri, ders başlıkları ve kısa açıklamaları, kategori etiketleri, 18 atlas sahnesinin adı, quiz/alıştırma arayüz metinleri, PDF okuyucu, kaynak sayfası, yardım penceresi, atıf ve erişilebilirlik etiketleri (~470 sözlük satırı).
- **Ders gövdesi de çevriliyor:** her dersin İngilizce ve Arapça metni `src/content/lessons/i18n/{en,ar}/<no>.js` altında, Türkçe kaynağın bölüm kimlikleriyle eşleşen bir yama olarak durur. `src/content/lessonI18n.js` bu yamayı Türkçe derse aktarır: paragraf, alt bölüm, tablo, uyarı, sözlük ve tekrar soruları yerinde değişir; bölüm `id`'leri, kaynak sayfaları ve şema anahtarları Türkçe asıldan gelir. Aynı dosya çalışma rehberini (`guide`) ve o dersin sınav anlatımlarını (`teaching`) da çevirir.
- **Eksik çeviri güvenli düşer:** bir ders için yama yoksa sayfa Türkçe metni gösterir ve "bu ders henüz çevrilmedi" notu (çevrilen ders sayısıyla) görünür.
- **Tutarlılık denetimi:** `tests/lesson-i18n.test.js` her çevirinin paragraf/alt bölüm/tablo satırı sayısının Türkçe asılla aynı olduğunu, İngilizce gövdede Türkçe cümle kalmadığını ve sınav anlatımlarının da çevrildiğini doğrular. Sayı uyuşmazsa birleştirme sessizce kaymaz, test kırılır.
- **Çevrilmeyen (henüz):** yerel quiz/alıştırma soru bankası, şema başlıkları ve şema içi etiketler. Bunlar da aynı yöntemle sırayla çevrilecek.
- Arapça ders notu ve özgün PDF’ler **Kaynaklar** bölümündedir.
- **İngilizce ve Arapça metinler isteğe bağlı yüklenir:** çeviri verileri (`src/content/packs/{en,ar}.js`, her dil ayrı bir parça) yalnızca o dil seçildiğinde indirilir; Türkçe ziyaretçi bunları indirmez. Dil değiştirilirken yeni dilin paketi hazır olana kadar ekran eski dilde kalır, sonra tüm metinler birlikte değişir.
- Sözlük `src/i18nPhrases.js` (düz JS), dil meta verisi `src/i18nMeta.js`, ders/sahne başlıkları `src/content/localizedContent.js` içinde. `tests/i18n.test.js` her Türkçe satırın İngilizce ve Arapça karşılığı olduğunu, her dersin ve sahnenin çevrilmiş başlığı bulunduğunu ve bileşenlerdeki tüm `tr()` anahtarlarının sözlükte tanımlı olduğunu doğrular.

## Kaynaklar sayfası ve telif

Lisanslı kitap/atlas arşivi (**Netter, Gray’s, Sobotta, Moore, BD Chaurasia, Clemente, McMinn** vb.) ve paylaşılan Drive/MEGA klasör bağlantıları siteden **kaldırıldı**: bunlar telif hakkı korunan eserlerdir ve yeniden dağıtılamaz. `#/kitaplar` adresi geriye dönük uyumluluk için `#/kaynaklar` sayfasına yönlenir.

Kaynaklar sayfasında yalnızca şunlar listelenir:

- **Arapça ders notu** — hocamızın ders notlarının Arapça çevirisi, Google Drive dosya kimliği `1syfu-piLHAh3dPNlnqRuB2q3GfmURTu6` ile sitede gömülü okuyucuda açılır (`src/resources.js`).
- **Açık lisanslı / ücretsiz kaynaklar** — OpenStax *Anatomy and Physiology 2e* (CC BY 4.0), Wikimedia Commons anatomi kategorisi (dosya bazında lisans), kamu malı Gray’s Anatomy (1918) ve yalnızca bağlantı verilen ücretsiz makale siteleri. Her kartta lisans etiketi görünür, dosya barındırılmaz.
- **Hocamızın Drive arşivi** bağlantısı ve telif notu.

## 3D Anatomi Atlası (gömülü görünüm)

Siteye, sayfadan ayrılmadan kullanılan **3B anatomi atlası bölümü** eklendi. Gömülü pencere, Zygote’un kendi web sitesinde duyurduğu **ücretsiz iframe gömme** yöntemiyle [ZygoteBody](https://www.zygotebody.com/) üzerinden yüklenir: `https://www.zygotebody.com/`.

- **Senkronize çalışma:** Atlas, uygulamanın kendi hash durumunu kullanır. `nav=` kamera konumu, `sel=` seçim/vurgu, `layers=` katman opaklığıdır. Sahne seçtiğinde çerçeve adresi güncellenir; yenileme, geri/ileri gezinme ve `#/atlas/<sahne>` bağlantı paylaşımı çalışır.
- **18 sahne:** 4 bölge görünümü (tüm vücut, baş-boyun, göğüs, karın), 8 sistem görünümü (iskelet, kas, sinir, dolaşım, sindirim, ürogenital, lenfatik, deri) ve 6 tek yapı odağı (kafatası, beyin, akciğerler, karaciğer, mide, kalp).
- **Doğrulanmış izole bağlantılar:** İskelet, kafatası, beyin, akciğer, karaciğer ve mide görünümleri, kamuya açık paylaşılmış ZygoteBody derin bağlantılarından alınmıştır: yapı seçili gelir, diğer katmanlar soldurulur. Kalan sahneler yalnızca kamerayı konumlandırır; katman denetimi gömülü arayüzde, kullanıcıya bırakılır.
- **Ders eşleşmesi:** 12 dersin her biri kendi atlas sahnesine bağlıdır. Ders sayfasındaki “3D atlas” düğmesi ve ders altındaki eşleşme kartı ilgili sahneyi açar.
- **Rehberli kullanım:** Her sahne için kısa özet, “neye bakmalı?” notu ve gömülü Zygote araçlarını (opaklık kaydırıcısı, katman düğmesi, arama, `Zoom to`, gizle/pin, model seçimi) anlatan üç adım bulunur.
- **Kaydedilen sahneler, tam ekran, bağlantı kopyalama ve yenileme** atlas araç çubuğundadır. Kaydedilen sahneler `anatomi-atlas-scenes`, son açılan sahne `anatomi-atlas-last` anahtarıyla yalnızca bu cihazda saklanır.
- **Erişilemeyen ağ durumu:** Zygote alan adına ulaşılamazsa boş bir çerçeve bekletmek yerine uyarı gösterilir ve “Yeni sekmede aç” seçeneği sunulur. Site atlas olmadan da çalışır.
- **Arayüzde marka adı gösterilmez:** Kullanıcıya görünen metinlerde sağlayıcının ürün adı geçmez; “gömülü 3B atlas”, “3D anatomi atlası” ve “kaynak sağlayıcı” gibi nötr ifadeler kullanılır. Yalnızca kaynak kartında tek satır telif atfı bulunur: **3B anatomik model ve veriler © Zygote 3D.** Marka adı, teknik atıf ve doğrulama kaydı bu README ile `docs/content-notes.md` içinde tutulur. Gömülü pencerenin **içindeki** arayüz sağlayıcının kendi sayfasıdır ve oradaki marka görünümü iframe ile değiştirilemez (ZygoteBody’nin ücretsiz sürümü DOM erişimi vermez).
- **Gömülü görünümün sınırı:** ZygoteBody’nin ücretsiz sürümünde ön yüz, `Fullscreen` dışında üst pencereyle konuşmaz (gömme için API satılmaktadır). Bu nedenle kamera/katman senkronizasyonu, kullanıcı bir sahne seçtiğinde yönlüdür: atlas içindeki her döndürme adres çubuğuna yazılmaz ve dış arayüzden sahne durumu okunamaz.

## Özellikler

- Türkçe/Latince katalog araması; Türkçe karakterlerin ASCII karşılıklarını da destekler.
- Konu filtreleri, sıralama, kart ve liste görünümü.
- Masaüstü ve mobil içindekiler; uzun derslerde kaydırılabilir konu listesi ve ayrıntılı alt başlıklara odaklanarak geçiş.
- Yazı boyutu ayarı, okuma ilerlemesi, terim kartları ve açılır cevaplar.
- 26 yerel SVG: kesitler, hareket modelleri ve akış haritaları; metin olarak okunabilen numaralı açıklamalar.
- Şemalarda büyütme, %100–200 yakınlaştırma, mobil kaydırma, odak sınırlandırma ve Escape ile okuyucuya dönüş.
- `/#/ders/0` … `/#/ders/11` adresleri; yenileme, geri/ileri gezinme.
- Web ve PDF arasında ortak kaydetme ve okundu durumu.
- Son açılan belgeye ve okuma biçimine dönüş; sayfa/scroll konumu saklanmaz.
- Mobil menü, klavyeyle kullanılabilen diyaloglar, Escape ile kapatma.
- Ana sayfanın parşömen, adaçayı ve gül tonlarındaki atlas tasarımı korunur.
- Kullanıcının seçtiği kaburga–sternum amblemi; ana menüde detaylı SVG, mobil/altbilgide sadeleştirilmiş simge ve uyumlu favicon.
- 3B anatomi atlası: `#/atlas` ve `#/atlas/<sahne>` adresleri, 18 sahne, grup filtresi, ders eşleşmesi, kaydedilen sahneler, tam ekran ve ağ engeli için yedek açılış.
- Atlas sahneleri derin bağlantıyla paylaşılabilir; ana sayfa bandındaki hızlı sahne çipleri ve kenar çubuğundaki “3D atlas sahneleri” listesi aynı bölüme gider.

## İçerik ve kaynak düzeni

| Yol | Amaç |
|---|---|
| `src/data.js` | Doğrulanan 12 Drive kimliği, özgün adlar, kategori bilgileri |
| `src/content/lessons/{0..11}.js` | Elle yazılmış açıklamalar; tek ders / tek dosya |
| `src/lessons.js` | Alt bölümleri, tabloları ve şema açıklamalarını içeren okuma süresi hesabı |
| `src/content/diagrams.js` | Şema başlıkları, erişilebilir açıklamalar ve numaralı anahtarlar |
| `src/components/InstructionalFigure.jsx` | Konu içi şekil ve klavyeyle kullanılabilen büyütme penceresi |
| `public/diagrams/` | Proje için çizilen 26 SVG; slayt görüntüsü veya atlas kopyası değildir |
| `scripts/build-diagrams.mjs` | Elle tanımlanan SVG geometrisinden yerel şekilleri yeniden üretir |
| `src/LessonPage.jsx` | Tek sürümlü, yerel konu anlatımı okuyucusu |
| `src/i18nPhrases.js` | Arayüz sözlüğü: her satır `[Türkçe, English, العربية]`; eksik çeviri Türkçeye düşer |
| `src/i18n.jsx` · `src/i18nMeta.js` | `LanguageProvider`, `useI18n`, `tr()`, `useLocalizedContent`; dil listesi ve `dir` bilgisi |
| `src/content/packs/` | Dil başına çeviri paketi (`en.js`, `ar.js`) ve `loadTranslationPack` yükleyicisi; paketler tembel yüklenir |
| `src/content/localizedContent.js` | Ders başlıkları/açıklamaları, kategori ve atlas sahnesi adlarının EN/AR karşılıkları |
| `src/components/LanguageSwitch.jsx` | Üst çubuk ve menüdeki TR/EN/AR dil seçici |
| `src/resources.js` | Arapça not kimliği ve açık lisanslı kaynak listesi |
| `src/ResourcesPage.jsx` · `src/resources.css` | Kaynaklar sayfası, gömülü Arapça PDF okuyucusu ve lisans notları |
| `src/atlas.js` | Atlas sahne kataloğu, ZygoteBody adres üretimi ve ders ↔ sahne eşleşmesi |
| `src/AtlasPage.jsx` | Gömülü 3B atlas sayfası: araç çubuğu, sahne listesi, rehber panelleri, erişim uyarısı |
| `src/atlas.css` | Atlas sayfası, ana sayfa atlas bandı ve ders atlas bağlantısının biçimi |
| `tests/atlas.test.js` | Sahne bütünlüğü, bağlantı biçimi, ders eşleşmesi ve yol çözümleme testleri |
| `src/courseManifest.json` | Kaynak PDF sayfa sayıları ve SHA-256 kimlikleri |
| `reference/course-content/` | Editoryal kontrol için 697 kaynak sayfanın metin ve görsel arşivi; **public değildir, production build’e kopyalanmaz** |
| `public/brand/` | Seçilen logo, şeffaf SVG amblem ve tam logo, PNG sunum dosyası ve küçük boyut amblemi |
| `public/atlas/` | Dokuz temsili kapak; özgün atlas şekilleri değildir |
| `docs/content-notes.md` | Kapsam, düzeltmeler, inceleme sınırları ve yayın kontrolü |
| `docs/full-course-coverage.json` | 115 anatomi bölümünün son ayrıntılı anlatım başlıkları ve ilgili kaynak sayfa aralıkları |

Her bölüm `sourcePages` alanıyla kaynak PDF’nin gerçek sayfalarına bağlanır. Sayfa aralığı konu ilişkisini gösterir; her cümlenin kaynakta birebir bulunduğu anlamına gelmez. Açıklama, örnek ve düzeltmeler editoryal çalışmadır. Katalog ve yazılı içerikler statiktir; Drive değişiklikleri otomatik içeri alınmaz.

### Referans arşivini yeniden üretme

```sh
# Hak sahibinin sağladığı özgün PDF’leri git tarafından yok sayılan google_drive/ içine koyun.
python -m venv .venv
.venv/bin/pip install -r scripts/requirements-content.txt
.venv/bin/python scripts/import-course-content.py
```

Bu araç **ders anlatımı yazmaz**. Yalnızca `reference/course-content/` altındaki kaynak karşılaştırma arşivini yeniler. OCR veya tıbbi doğrulama yapmaz. Arşiv kayıtlarındaki `image` yolları arşiv köküne göredir; uygulama bu dosyaları istemez. Ham PDF ve sanal ortam commit edilmez.

## Haklar ve doğruluk

- [Akademik profil](https://abs.firat.edu.tr/tr/bdagdeviren)
- [Kaynak Drive klasörü](https://drive.google.com/drive/folders/1iAuY6LhNDTXsT6exyIzJiojeB_CLaeSz)
- **Lisanslı kitap ve atlas PDF’leri kaldırıldı.** Site artık Netter, Gray’s, Sobotta, Moore ve benzeri telifli eserleri listelemez, önizlemez veya bağlantılamaz. Yerine yalnızca hocanın Arapça ders notu ve açık lisanslı kaynaklar sunulur. Lisans etiketleri kaynağın kendi beyanına dayanır; yayın öncesi her bağlantı yeniden doğrulanmalıdır.
- 12 kaynak dosya 14 Ekim 2026 tarihinde incelenmiştir. Akademik unvan ve atıf: Dr. Öğr. Gör. Bekir Dağdeviren, Fırat Üniversitesi Sağlık Bilimleri Fakültesi, Fizyoterapi ve Rehabilitasyon.
- Derslerin ana konu grupları anlatıma alınmıştır; bir sayfa veya kelime sayısı tıbbi doğruluk/eksiksizlik kanıtı olarak kullanılmaz. Öğretim elemanı denetimi henüz yapılmış değildir.
- 3B anatomi modeli ve verileri **© Zygote 3D** (ZygoteBody™) şirketine aittir. Site bu modelleri kopyalamaz, indirmez, yeniden barındırmaz veya değiştirmez; yalnızca Zygote’un ücretsiz iframe gömme yöntemiyle kendi sunucusundan gösterir. Zygote markası ve logosu proje tarafından kullanılmaz; yalnızca metin olarak atıf yapılır.
- Atlas bölümü tıbbi tanı veya tedavi amacı taşımaz; ders çalışmasına yardımcı bir inceleme aracıdır. Gömülü görünümün çalışması Zygote’un servisinin erişilebilirliğine bağlıdır.
- Yapay zekâ ile üretilmiş kapaklar dekoratiftir. Konu içi SVG şemalar özgün ve numaralıdır, fakat sadeleştirilmiş/ölçeksizdir; uzman denetiminden geçmiş atlasların yerini almaz.
- `reference/` production’a alınmasa da Git deposunda bulunur. Depoyu veya arşivi paylaşmadan önce üçüncü taraf görseller dahil hak sahiplerinin izinlerini doğrulayın.
- Orijinal PDF’ler değiştirilmez veya uygulamayla yeniden yayımlanmaz. Kalıcı yayın öncesi kaynak ve web metinleri için paylaşım/düzenleme onayı alın.

## Gizlilik

`anatom-saved`, `anatom-completed`, `anatom-last`, `anatomi-last-mode`, `anatomi-reading-size`, `anatomi-atlas-scenes`, `anatomi-atlas-last`, `anatomi-quiz-saved`, `anatomi-quiz-studied` ve `anatomi-language` yalnız tarayıcıda saklanır. Hesap, analiz kodu veya çalışma kaydını sunucuya gönderen mekanizma yoktur. Cihazlar arasında eşitleme yapılmaz. PDF açıldığında Google’ın üçüncü taraf hizmetine istek gönderilir; web derslerini okumak Google isteği oluşturmaz. “Hocamız Hakkında” sayfasında resmî portre `apiabs.firat.edu.tr` üzerinden yüklenir; bu sayfa üniversitenin fotoğraf sunucusuna istek gönderir. Fotoğrafta `no-referrer` kullanılır. Fotoğraf yüklenemezse baş harfler ve resmî profile bağlantı gösterilir. Ders okuyucusu ve ana sayfa bu fotoğrafı istemez. 3B atlas bölümünde `www.zygotebody.com` adresine iframe isteği gönderilir ve erişilebilirlik ön kontrolü için aynı alan adına `no-cors` bir istek yapılır; web derslerini okumak bu isteği oluşturmaz.

## Testler

```sh
npm test             # 56 katalog/içerik/kaynak/dil/gezinme/atlas/alıştırma testi
npm run test:ui      # 40 Playwright senaryosu
npm run build
```

UI testleri 5175 portunda ayrı Vite sunucusu açıp kapatır. Kısıtlı Linux ortamında `@sparticuz/chromium` ve `tar` kullanılır; geçici dosyalar `.playwright/` içinde tutulur. Standart Playwright kurulumunda `npx playwright test` de kullanılabilir.

Yeni şekilleri yeniden üretmek için `node scripts/build-diagrams.mjs` çalıştırılır. Çıktılar `public/diagrams/` içinde sürümlenir; ağ veya görsel üretim servisi gerekmez.

Testler her anatomi bölümündeki ayrıntılı anlatımın varlığını ve kaynak-konu eşleşmesini, alt başlıklara masaüstü/mobil erişimi, 26 şemanın yüklenmesini, büyütme ve odak döngüsünü, mobil şekil taşmalarını, yazılmış derslerin varsayılan açılmasını, slayt isteklerinin olmamasını, daha önce eksik olan kas/sindirim/sinir başlıklarını, kaynak sayfa sınırlarını, PDF geçişini, klavye odağını, font/kaydetme/okundu durumunu ve 320/390/768 piksel genişlikleri kontrol eder. PDF iframe gerektiğinde fixture ile taklit edilir; test başarısı anonim Drive erişimi veya tıbbi denetim anlamına gelmez.

## Yayınlama

Statik barındırıcı: kurulum `npm ci`, build `npm run build`, yayın dizini **`dist`**. Depo kökünü veya `reference/` klasörünü web kökü olarak yayımlamayın. Alt dizine yayın için Vite `base` ve public görsel yolları uyarlanmalıdır. CSP kullanılıyorsa `frame-src` içinde `https://drive.google.com` ve `https://www.zygotebody.com`, `connect-src` içinde de `https://www.zygotebody.com` (atlas erişilebilirlik ön kontrolü) izinli olmalıdır. Gömülü atlas WebGL gerektirir; `iframe` için `allow="fullscreen; xr-spatial-tracking"` kullanılır.

Canlı geliştirme önizlemesi kalıcı dağıtım değildir. PR açılması siteyi otomatik yayımlamaz.

### Görerek öğren çalışma alanı

11 anatomi dersinin başında konuya özgü açıklama, şemaya geçiş kartları, görsel çalışma görevi, açılır örnek yanıt ve sık karıştırılan nokta bulunur. 26 mevcut şemada numaralı yapılar tek tek incelenebilir; alt açıklamalar aktif hatırlama için gizlenip ayrı ayrı açılabilir. Çizimin üzerindeki etiketler gizlenmez. Bu araçlar puanlı sınav değildir ve yeni kişisel veri kaydetmez. İçerik `src/content/studyGuides.js` dosyasında düzenlenir. Bu ekle birlikte 30 birim/içerik testi ve 25 tarayıcı senaryosu geçmektedir.

## Soru odaklı ayrıntılı anlatım

“Sitede oku”daki 11 anatomi dersine, notlar ve paylaşılan soru arşivi karşılaştırılarak 42 ayrıntılı açıklama, karşılaştırma tablosu, 42 gerekçeli alıştırma ve 6 özgün şema eklendi. PDF ders notları ve orijinalleri değişmedi. Kaynak/okunabilirlik sınırları okuyucuda görülebilir; puan veya eksiksiz sınav kapsamı garantisi verilmez. Konu bazında eşleşme ve editoryal sınırlar: [`docs/exam-content-audit.md`](docs/exam-content-audit.md). Ek şemaları üretmek için `node scripts/build-exam-diagrams.mjs` çalıştırılır.

## Kendini sına — görsel çalışma, deneme ve tekrar defteri

Menüden **Kendini sına** (`#/calis`) veya ana sayfadaki çalışma kartından açılır. Ders anlatımları ve PDF okuyucu değiştirilmeden ayrı çalışma alanı eklenmiştir.

- **Görsel yapı tanıma:** Mevcut 26 numaralı öğretici şemanın 125 yapı/kavram etiketinden üretilen çoktan seçmeli alıştırmalar. İsteğe bağlı sözel ipucu ve yalnız görsel alanında yatay büyütme. Şemalar ölçekli atlas veya bağımsız uzman doğrulaması olarak sunulmaz.
- **Deneme:** Daha önce yazılmış 42 gerekçeli konu sorusundan konuya ve sayıya göre örnekleme. Soru ve seçenek sırası karıştırılır; cevap anahtarı seçim sırasıyla birlikte taşınır. 10/20/30 dakika veya süresiz çalışma. Zamanlayıcı gerçek bitiş anını kullanır; sekme arka planda kalsa bile sonraki kontrolde süre aşımı işlenir. Yanıt gerekçeleri denemeden sonra açılır.
- **Sonuç:** Doğru, yanlış, boş ve ders bazında özet; her sorudan ilgili web dersinin gerçek bölüm başlığına odaklı dönüş. Gerçek sınav notu veya vize/final kapsamı garantisi verilmez.
- **Tekrar:** Kontrol edilen yanlış görseller, tamamlanan denemedeki yanlışlar ve boşlar tarayıcıdaki `anatomi-practice-v1` kaydına eklenir. İlk tekrar 24 saat sonra; sonraki doğru hatırlamalarda 1/3/7/14/30 günlük aralıklar uygulanır. Zamanı gelmeden manuel tekrar mümkündür. Temizleme işlemi ayrıca onay ister.

Tekrar verisi yalnız bu tarayıcıdadır, sunucuya gönderilmez ve cihazlar arasında eşitlenmez. Depolama kapalıysa uyarı gösterilir ve oturum içinde çalışma sürer. Devam eden sınav/çalışma sayfa yenilendiğinde saklanmaz; arayüz bunu açıkça belirtir. Bu oturumdan henüz kontrol edilmemiş yanıtlar yenilemede deftere yazılmaz. Soru bankasında kaynak sorularının birebir kopyaları veya yeni bir resmî cevap anahtarı yoktur.
