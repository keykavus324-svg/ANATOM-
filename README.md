# ANATOMİ — Anatomi Ders Kütüphanesi

Öğr. Gör. **Bekir Dağdeviren**'in anatomi notlarına erişim için hazırlanmış bağımsız öğrenci projesi. Fırat Üniversitesi'nin resmî sitesi değildir. Hocanın veya üniversitenin onay verdiği iddia edilmez.

## Çalıştırma

Node.js 22+ önerilir.

```sh
npm ci
npm run dev          # 0.0.0.0:5173
npm run build        # production çıktısı: dist/
npm run preview      # production çıktısını yerelde görüntüle
```

React 19 + Vite, yerel fontlar, Lucide ikonları. Backend, API anahtarı veya ziyaretçi hesabı gerektirmez. Görseller ve yazı tipleri uygulamayla birlikte sunulur.

## İki okuma biçimi

Her ders kartında iki ayrı seçenek bulunur:

- **Sitede oku:** 12 kaynak dosyanın her biri için hazırlanmış, seçilmiş konuları kapsayan web çalışma özeti. Başlıklar, karşılaştırma tabloları, terim rehberi, tekrar soruları ve temsili atlas illüstrasyonu içerir. PDF/Google iframe'i yüklenmez.
- **PDF’yi aç:** Hocanın özgün dosyası, Google Drive `/preview` iframe'i ile görüntülenir. İndirme işlemi başlatılmaz; erişim mevcut Drive izinlerine bağlıdır.

“Kaynağın tamamı” otomatik bir kaynak aktarımıdır; kaynak metnin tıbben doğrulandığı veya yeniden yazılmış eksiksiz bir ders kitabı olduğu anlamına gelmez. PDF’den yazı çıkarımında dizilim, karakter ve tablo sorunları olabilir. Bu yüzden **her kaynak sayfasının görüntüsü de korunur**. Metin katmanı olmayan sayfalar da atlanmaz. Ayrı “Hızlı tekrar” özeti tam aktarım değildir. İki görünümde de kaynak sahibi, düzenleyen proje ve sınırlar belirtilir; hocanın onayladığı yeni bir yayın iddiası yoktur. PDF okuyucusundan web görünümüne, web sayfasından orijinal PDF’ye geçilebilir.

## Özellikler

- Kaynak klasöründeki 12 PDF: 11 ders notu ve 1 atlas/kitap öneri rehberi.
- Türkçe karakterleri ve ASCII karşılıklarını destekleyen Türkçe/Latince katalog araması.
- Konu filtreleri, ders sırası / alfabetik sıralama, kart ve liste görünümü.
- Web okuyucusunda içindekiler, yazı boyutu ayarı, okuma ilerleme çubuğu, açılır tekrar cevapları.
- Paylaşılabilir ve yenilenebilir web notu adresleri: `/#/ders/1` … `/#/ders/11`; kaynak rehberi `/#/ders/0`.
- Tarayıcının geri/ileri gezinmesi; `/#/kutuphane`, `/#/kaydedilenler`, `/#/hakkinda` adresleri.
- PDF okuyucusunda önceki/sonraki belge, kaydetme, okundu işareti, masaüstü tam ekran.
- Web/PDF modları arasında ortak kaydedilen notlar ve okundu durumu.
- Son açılan belge ve okuma biçimine dönüş. PDF sayfa veya web kaydırma konumu saklanmaz.
- Mobil menü, klavye ile kullanılan diyaloglar, Escape ile kapatma, arama için Ctrl/⌘ K.

## Kaynak, kapsam ve haklar

- [Fırat Üniversitesi akademik profil](https://abs.firat.edu.tr/tr/bdagdeviren)
- [Kaynak Google Drive klasörü](https://drive.google.com/drive/folders/1iAuY6LhNDTXsT6exyIzJiojeB_CLaeSz)
- Dosya kimlikleri ve web özetleri için kaynak metinler 14 Ekim 2026 tarihinde bu klasördeki PDF’lerden okundu.
- Doğrulanan profil bilgileri: Öğr. Gör. Bekir Dağdeviren; Sağlık Bilimleri Fakültesi; Fizyoterapi ve Rehabilitasyon; uzmanlık alanı Tıp Anatomi.
- Tam aktarım için özgün PDF dosyaları yerelde `google_drive/` klasörüne indirildi; bu klasör Git tarafından yok sayılır. Özgün PDF dosyaları uygulamaya eklenmez veya değiştirilmez. Tam metin aktarımı ve 697 kaynak sayfasının WebP karşılıkları yayın dosyalarına dahildir.
- Tam aktarım, kaynak PDF’deki gerçek sayfa numarasıyla birebir eşleştirilmiştir. Hızlı tekrar bölümlerinde ise kaynak başlığı verilir; bu özetlerde sayfa numarası eşlemesi yapılmamıştır.
- İlk turda metin okuması kısaltıldığı için hızlı tekrar özetleri seçilmiş konuları kapsar. Daha sonra tüm PDF’ler yerelde işlenmiştir: **tam aktarımda kısaltma veya kaynak sayfası atlama yoktur**. Görsel içindeki yazılar OCR yapılmadığı için aranabilir değildir; sayfa görselinden okunabilir. [İçerik notları](docs/content-notes.md) iki görünümün farkını açıklar.
- Özellikle “Ürogenital sistem” PDF’sinin metni üreme organlarını kapsar. Dosya adı üzerinden böbrek/üriner sistem içeriği varsayılmamıştır.
- Tekrar soruları proje için hazırlanmıştır; hocanın sınav soruları değildir.
- Ana kapak ve 9 yeni atlas illüstrasyonu yapay zekâ ile üretilmiştir. Dekoratiftir, anatomik hata içerebilir; uzman denetiminden geçmiş atlasların veya PDF’deki etiketli şekillerin yerine geçmez. Görseller WebP olarak optimize edilmiştir.
- Materyallerin hakları ilgili hak sahiplerine aittir. **Kalıcı yayın öncesinde hocanın hem özgün PDF bağlantıları hem de yeniden düzenlenmiş web özetlerinin paylaşılması için onayını alın.**

## Önemli: PDF erişimi ve web yayını

Klasör içeriği listelenebildi ve dosya metinleri okunabildi; ancak Drive paylaşım izinlerini inceleme çağrısı **403** ile reddedildi. Oturum açmamış kullanıcıların tüm PDF’lere erişebildiği doğrulanmış değildir.

Yayın öncesinde:

1. Dosya sahibi, hocanın onayıyla Drive erişimini kontrol etmeli. Anonim PDF erişimi amaçlanıyorsa “Bağlantıya sahip olan herkes → Görüntüleyici” ayarı gerekebilir; kurumsal politikalar buna izin vermeyebilir.
2. Gizli tarayıcı penceresinde her PDF’yi site içindeki okuyucuda ve “Drive’da aç” bağlantısından kontrol edin.
3. Okuyucu izin istiyorsa dosya sahibi erişim vermelidir. Google oturumu, çerez kısıtlamaları ve gömme politikaları görüntülemeyi etkileyebilir.
4. Cross-origin iframe nedeniyle uygulama Google’ın hata/izin ekranını okuyamaz; `load` olayı başarılı belge erişimi kanıtı değildir. Özgün Drive bağlantısı ve erişim açıklaması her zaman sunulur.
5. **Tam web aktarımı, kaynak görselleri ve özetler statik uygulamanın içindedir.** Yayına alındığında sitenin ziyaretçileri bunları Google hesabı olmadan okuyabilir; Google Drive’daki izin değişiklikleri web içeriğini otomatik kaldırmaz. Bu yüzden yayın onayı ve içerik kaldırma süreci ayrıca kontrol edilmelidir.

“İndirmeden” ifadesi ziyaretçinin ayrıca dosya kaydetmesine gerek olmamasını anlatır. Tarayıcı belgeyi görüntülemek için verisini aktarır; kopyalama veya indirmeyi engelleme garantisi verilmez.

## İçerik geliştirme

- `src/data.js`: Orijinal dosya kimlikleri, başlıklar, kategoriler ve katalog metadatası.
- `src/lessons.js`: Web özetlerinin metni, kapsamı, kaynak başlıkları, tabloları, terimleri, soruları ve görselleri.
- `src/LessonPage.jsx` / `src/lesson.css`: Web okuyucusu ve tam aktarım/hızlı tekrar seçimi.
- `src/FullCourseContent.jsx`: Tam metin/görsel okuyucusu, ders içi arama ve sayfalama.
- `src/courseManifest.json`: Dosya kimliği, kaynak SHA-256 özeti ve 697 sayfanın sayım bilgileri.
- `public/course-content/`: 12 metin JSON dosyası ve 697 kaynak sayfası WebP görüntüsü (yaklaşık 76 MB; bütün ders bilgisi korunsun diye gereklidir). Görseller tembel yüklenir, dersler altışar sayfa halinde gösterilir.
- `scripts/import-course-content.py`: Yeniden üretilebilir tam sayfa aktarımı; orijinal renkleri korur.
- `src/routing.js`: Hash tabanlı gezinme; statik sunucuda özel URL yeniden yazma gerekmez.
- `public/atlas/`: 9 yeni, optimize edilmiş temsili görsel.

Katalog statik bir anlık görüntüdür; Drive klasörünü otomatik taramaz. Dosya ekleme/kaldırma ve web özetleri elle güncellenmelidir. Dosya sayısı değişirse arayüzdeki sabit 12 etiketlerini de güncelleyin. Google kimlik bilgilerini istemci koduna eklemeyin.

### Tam aktarımı yeniden üretme

Kaynak dosyaların hak sahibi tarafından sağlanan kopyalarını git tarafından yok sayılan `google_drive/` klasörüne koyun. Ardından:

```sh
python -m venv .venv
.venv/bin/pip install -r scripts/requirements-content.txt
.venv/bin/python scripts/import-course-content.py
npm test
```

İçe aktarıcı her dosyanın tüm sayfalarını işler; metni olmayan sayfalar dahil her sayfa için 1600 piksel uzun kenarlı, renkleri korunmuş WebP görüntüsü üretir. Ham PDF’leri veya sanal ortamı commit etmeyin. İçerik testleri sayfa sırasını, kaynak kimliğini ve tüm görsel karşılıklarının varlığını denetler.

## Gizlilik

Tarayıcıda saklanan anahtarlar:

- `anatom-saved`, `anatom-completed`, `anatom-last`: Eski sürümle uyumluluk için adları korunmuştur; yalnızca belge kimlikleri saklanır.
- `anatomi-last-mode`: Son okuma biçimi (`web` / `pdf`).
- `anatomi-reading-size`: Web metni boyutu.

Hesap, analiz kodu veya sunucuya gönderilen çalışma kaydı yoktur. Tercihler cihazlar arasında eşitlenmez; site verileri silindiğinde kaybolur. PDF açıldığında Google’ın üçüncü taraf hizmetine istek gönderilir ve Google’ın oturum/gizlilik politikaları uygulanır. Web notlarını okumak Google isteği oluşturmaz.

## Testler

```sh
npm test             # 12 katalog, içerik, 697 sayfa bütünlüğü ve gezinme testi
npm run test:ui      # 12 Playwright senaryosu (Linux, bağımsız Chromium)
npm run build
```

UI testleri ayrı Vite sunucusunu 5175 portunda başlatır ve test sonunda kapatır. Linux ortamında npm üzerinden gelen `@sparticuz/chromium` paketi ve `tar` kullanılır; geçici dosyalar git’e alınmayan `.playwright/` içinde açılır. Standart Playwright kurulumu olan diğer sistemlerde `npx playwright install chromium` ardından `npx playwright test` kullanılabilir.

UI testlerinde Google Drive iframe’i gerektiğinde yerel fixture ile taklit edilir; gerçek PDF içeriği ve anonim Drive erişimi doğrulanmaz. Testler:

- Arama, filtreleme, sıralama, kart/liste görünümü.
- Kaydetme, kalıcılık, kaynak URL’leri, önceki/sonraki belge, okundu işaretleme.
- Web/PDF geçişi, tam aktarım/hızlı tekrar, içindekiler, yazı boyutu, tekrar cevapları.
- 138 sayfalık sindirim notunun son sayfasına geçiş, tam metin araması, bölümleme ve içerik yükleme hatasından kurtarma.
- Web adreslerinin yenilenmesi, geri/ileri gezinme ve geçersiz bağlantılar.
- 12 web notunun ve yerel görsellerin yüklenmesi; Google isteği olmaması.
- Mobil görünüm; 320, 390 ve 768 pikselde uzun başlıklar ve tabloların taşmaması.

## Yayınlama

Statik barındırıcılar kullanılabilir (ör. Vercel, Netlify, Cloudflare Pages):

- Kurulum: `npm ci`
- Build: `npm run build`
- Yayın dizini: `dist`
- Ortam değişkeni: gerekmez

Uygulama kök alan adına göre yapılandırılmıştır. Alt dizine yayın için Vite `base` ve `public` görsel bağlantıları uyarlanmalıdır. Güvenlik başlıkları eklenirse `frame-src` politikasında `https://drive.google.com` görüntülemesine izin verin.

Canlı geliştirme önizlemesi kalıcı dağıtım değildir. Pull request açılması da siteyi otomatik olarak yayımlamaz.
