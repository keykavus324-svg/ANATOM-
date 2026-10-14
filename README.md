# ANATOMİ — Anatomi Ders Kütüphanesi

Öğr. Gör. **Bekir Dağdeviren**’in kaynak notları temel alınarak hazırlanmış bağımsız öğrenci projesi. Fırat Üniversitesi’nin resmî sitesi değildir; hocanın veya üniversitenin onay verdiği iddia edilmez.

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

- **Sitede oku:** Kaynaklar okunarak, kavramları ve ilişkileri açıklayacak şekilde yeniden yazılmış Türkçe konu anlatımı. 11 ders + 1 kaynak rehberi; 109 bölüm, yaklaşık 14.700 kelime (ana anlatım) ve 49 açılır tekrar sorusu. İçindekiler, karşılaştırma tabloları, akışlar, terim kartları ve atlas tarzı temsili kapaklar içerir. **Otomatik slayt metni veya sayfa görüntüsü göstermez.** Google isteği gerekmez.
- **PDF’yi aç:** Hocanın özgün belgesi Google Drive `/preview` iframe’inde görüntülenir; indirme zorunluluğu yoktur. Erişim dosyanın mevcut paylaşım izinlerine bağlıdır. Anonim erişim ayrıca doğrulanmalıdır.

İlk sürümdeki “Kaynağın tamamı / Hızlı tekrar” seçimi kaldırılmıştır. Web okuyucusunun tek ana içeriği artık yazılmış ders anlatımıdır. PDF bağımsız bir okuma seçeneğidir. Kaynak sahibi ile web metninin hazırlayanı ayrı belirtilir; yeniden yazılan metin hocanın kendi eseri veya onayladığı ders kitabı olarak sunulmaz.

## Özellikler

- Türkçe/Latince katalog araması; Türkçe karakterlerin ASCII karşılıklarını da destekler.
- Konu filtreleri, sıralama, kart ve liste görünümü.
- Masaüstü ve mobil içindekiler; uzun derslerde kaydırılabilir konu listesi.
- Yazı boyutu ayarı, okuma ilerlemesi, terim kartları ve açılır cevaplar.
- `/#/ders/0` … `/#/ders/11` adresleri; yenileme, geri/ileri gezinme.
- Web ve PDF arasında ortak kaydetme ve okundu durumu.
- Son açılan belgeye ve okuma biçimine dönüş; sayfa/scroll konumu saklanmaz.
- Mobil menü, klavyeyle kullanılabilen diyaloglar, Escape ile kapatma.
- Ana sayfanın parşömen, adaçayı ve gül tonlarındaki atlas tasarımı korunur.

## İçerik ve kaynak düzeni

| Yol | Amaç |
|---|---|
| `src/data.js` | Doğrulanan 12 Drive kimliği, özgün adlar, kategori bilgileri |
| `src/content/lessons/{0..11}.js` | Elle yazılmış açıklamalar; tek ders / tek dosya |
| `src/lessons.js` | İçerik kataloğu ve okuma süresi hesabı |
| `src/LessonPage.jsx` | Tek sürümlü, yerel konu anlatımı okuyucusu |
| `src/courseManifest.json` | Kaynak PDF sayfa sayıları ve SHA-256 kimlikleri |
| `reference/course-content/` | Editoryal kontrol için 697 kaynak sayfanın metin ve görsel arşivi; **public değildir, production build’e kopyalanmaz** |
| `public/atlas/` | Dokuz temsili kapak; özgün atlas şekilleri değildir |
| `docs/content-notes.md` | Kapsam, düzeltmeler, inceleme sınırları ve yayın kontrolü |

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
- 12 kaynak dosya 14 Ekim 2026 tarihinde incelenmiştir. Akademik unvan ve atıf: Öğr. Gör. Bekir Dağdeviren, Fırat Üniversitesi Sağlık Bilimleri Fakültesi, Fizyoterapi ve Rehabilitasyon.
- Derslerin ana konu grupları anlatıma alınmıştır; bir sayfa veya kelime sayısı tıbbi doğruluk/eksiksizlik kanıtı olarak kullanılmaz. Öğretim elemanı denetimi henüz yapılmış değildir.
- Yapay zekâ ile üretilmiş kapaklar dekoratiftir; etiketli, uzman denetiminden geçmiş atlasların yerini almaz.
- `reference/` production’a alınmasa da Git deposunda bulunur. Depoyu veya arşivi paylaşmadan önce üçüncü taraf görseller dahil hak sahiplerinin izinlerini doğrulayın.
- Orijinal PDF’ler değiştirilmez veya uygulamayla yeniden yayımlanmaz. Kalıcı yayın öncesi kaynak ve web metinleri için paylaşım/düzenleme onayı alın.

## Gizlilik

`anatom-saved`, `anatom-completed`, `anatom-last`, `anatomi-last-mode` ve `anatomi-reading-size` yalnız tarayıcıda saklanır. Hesap, analiz kodu veya çalışma kaydını sunucuya gönderen mekanizma yoktur. Cihazlar arasında eşitleme yapılmaz. PDF açıldığında Google’ın üçüncü taraf hizmetine istek gönderilir; web derslerini okumak Google isteği oluşturmaz.

## Testler

```sh
npm test             # 15 katalog/içerik/kaynak/gezinme testi
npm run test:ui      # 13 Playwright senaryosu
npm run build
```

UI testleri 5175 portunda ayrı Vite sunucusu açıp kapatır. Kısıtlı Linux ortamında `@sparticuz/chromium` ve `tar` kullanılır; geçici dosyalar `.playwright/` içinde tutulur. Standart Playwright kurulumunda `npx playwright test` de kullanılabilir.

Testler yazılmış derslerin varsayılan açılmasını, slayt isteklerinin olmamasını, daha önce eksik olan kas/sindirim/sinir başlıklarını, kaynak sayfa sınırlarını, PDF geçişini, klavye odağını, font/kaydetme/okundu durumunu ve 320/390/768 piksel genişlikleri kontrol eder. PDF iframe gerektiğinde fixture ile taklit edilir; test başarısı anonim Drive erişimi veya tıbbi denetim anlamına gelmez.

## Yayınlama

Statik barındırıcı: kurulum `npm ci`, build `npm run build`, yayın dizini **`dist`**. Depo kökünü veya `reference/` klasörünü web kökü olarak yayımlamayın. Alt dizine yayın için Vite `base` ve public görsel yolları uyarlanmalıdır. CSP kullanılıyorsa `frame-src` içinde `https://drive.google.com` görüntülemesine izin verilmelidir.

Canlı geliştirme önizlemesi kalıcı dağıtım değildir. PR açılması siteyi otomatik yayımlamaz.
