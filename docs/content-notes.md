# Web konu anlatımları — editoryal kayıt

## 29 Ekim 2026: lisanslı kitapların kaldırılması, Arapça not ve arayüz dilleri

Üç değişiklik yapıldı:

1. **Lisanslı kitap/atlas kütüphanesi kaldırıldı.** `src/books.js`, `src/bookCollections.js`, `src/BooksPage.jsx` ve `src/components/BookCollections.jsx` silindi. Netter, Gray’s, Sobotta, Moore, BD Chaurasia, Clemente, McMinn gibi telifli PDF’ler ve bunlara köprü veren paylaşılan Drive/MEGA klasörleri artık sitede listelenmiyor. Gerekçe telif: bu dosyalar hak sahiplerinin izni olmadan çoğaltılamaz, önizlenemez veya dağıtılamaz. Eski `#/kitaplar` bağlantıları `#/kaynaklar` sayfasına yönlenir (404 üretilmez).
2. **Arapça ders notu eklendi.** Hocamızın ders notlarının Arapça çevirisi (`1syfu-piLHAh3dPNlnqRuB2q3GfmURTu6`) Kaynaklar sayfasında gömülü Google Drive okuyucusunda açılır. Dosya kopyalanmaz, yeniden yüklenmez; kimlik ve bağlantılar `src/resources.js` içinde tek yerde tutulur. Notun Türkçe/İngilizce/Arapça başlık ve açıklaması vardır.
3. **Arayüz üç dilli.** Türkçe (varsayılan), English ve العربية. Menü, ana sayfa, ders başlıkları ve kısa açıklamaları, kategoriler, atlas sahne adları, quiz ve alıştırma arayüzü, PDF okuyucu, kaynak ve hakkında sayfaları ile yardım metinleri çevrildi. Arapça seçildiğinde `dir="rtl"` uygulanır, kenar çubuğu ve yerleşim aynalanır.

### Ders gövdelerinin çevirisi (29 Ekim 2026, ikinci aşama)

Kullanıcı isteği üzerine "metin Türkçe kalır" sınırı kaldırıldı: ders gövdesi de çevriliyor.

- **Yöntem:** her ders için `src/content/lessons/i18n/en/<no>.js` ve `.../ar/<no>.js` dosyaları, Türkçe dersin *yerine geçen* bir yama tutar (alt başlık, giriş, kapsam, bölüm başlıkları, paragraflar, tablolar, uyarı, alt bölümler, sözlük, tekrar soruları, çalışma rehberi ve o dersin sınav anlatımları). `src/content/lessonI18n.js` yamayı Türkçe derse uygular; bölüm `id`'leri, `sourcePages`, şema anahtarları ve renkler Türkçe asıldan gelir.
- **Makine çevirisi kullanılmadı.** Çeviriler doğrudan yazıldı; tıbbi anlatımda yanlış sözcük anlamı değiştirdiği için otomatik çeviri kabul edilmedi.
- **Sessiz kayma yok:** dizi uzunlukları (paragraf, alt bölüm, tablo satırı, kontrol sorusu) uyuşmazsa birleştirme hata verir; `tests/lesson-i18n.test.js` bunu ve İngilizce gövdede Türkçe cümle kalmadığını doğrular. `tests/browser.spec.js` içindeki "lesson reading body" testi dil değişimini tarayıcıda kontrol eder.
- **Durum:** ders 0–3 İngilizce ve Arapça olarak tamamlandı. Kalan dersler (4–11) ile sınav anlatımı, şema başlıkları, quiz ve alıştırma bankaları aynı yöntemle sırayla çevrilecek; çevirisi olmayan ders Türkçe gösterilir ve sayfada kaç dersin çevrildiğini söyleyen bir not çıkar.
- **Arayüz çevirileri** hocanın onayladığı bir çeviri değildir; yayın öncesi Arapça ve İngilizce metinlerin ana dili konuşuru tarafından okunması önerilir.
- Arayüz çevirileri, hocanın onayladığı bir çeviri değildir; yayın öncesi Arapça ve İngilizce metinlerin ana dili konuşuru tarafından okunması önerilir.

### Kaynaklar sayfasındaki açık lisanslı kaynaklar

Liste `src/resources.js` içindedir ve her satırda lisans etiketi gösterilir: OpenStax *Anatomy and Physiology 2e* (CC BY 4.0), Wikimedia Commons anatomi kategorisi (dosya bazında lisans), kamu malı Gray’s Anatomy 1918 baskısı (Bartleby) ve yalnızca bağlantı verilen ücretsiz makale siteleri (TeachMeAnatomy, Kenhub). Bu sitelerin içeriği teliflidir; yalnızca bağlantı verilir, kopyalanmaz. Lisans bilgisi kaynağın kendi sayfasına aittir ve periyodik olarak yeniden doğrulanmalıdır.

### Doğrulama notları

- Arapça notun Drive paylaşım ayarı (bağlantıya sahip herkes görüntüleyebilir) bu depodan doğrulanamaz; anonim erişim tarayıcıda kontrol edilmelidir. Erişim yoksa okuyucu Drive girişi ister ve sayfa bunu kullanıcıya söyler.
- `tests/i18n.test.js` sözlükteki her satırın İngilizce ve Arapça karşılığı olduğunu, yinelenen anahtar bulunmadığını, her ders ve atlas sahnesinin çevrilmiş başlığı olduğunu ve bileşenlerdeki tüm `tr()` anahtarlarının tanımlı olduğunu doğrular.
- `tests/resources.test.js` Arapça notun dosya kimliğini, lisanslı kitap dosyalarının silinmiş olduğunu ve açık kaynak listesinin HTTPS + lisans bilgisi taşıdığını doğrular.
- Telif kararı hukuki danışmanlık değildir; kaldırma, hak sahiplerinin talebi veya kurumsal yayın politikası doğrultusunda yapılmıştır.

## 14 Ekim 2026: slayt aktarımı yerine yazılmış dersler

Kullanıcı, PDF sayfalarının metin ve görüntülerini art arda gösteren önceki okuyucuyu açıkça reddetti. Bu sürümde `FullCourseContent` ve “Kaynağın tamamı / Hızlı tekrar” seçimi kaldırıldı. `Sitede oku` doğrudan kendi cümleleriyle yazılmış, tematik olarak düzenlenen açıklamaları gösterir. Özgün PDF ayrı seçenek olarak korunur.

Genişletilmiş sürümde 11 ders ve kaynak rehberinde 119 ana başlık, 230 açıklayıcı alt başlık ve 58 tekrar sorusu vardır. Şema dışı anlatım 43.680 kelime; 26 şemanın başlıkları ve numaralı açıklamalarıyla 45.510 kelimedir. Sayım giriş, bölüm/alt bölüm metinleri, tablo başlık ve hücreleri, akışlar ve çağrı kutularını içerir; tekrar soruları, gezinme ve diyalogda yinelenen etiketler dahil değildir. Sayılar ürünün büyüklüğünü tarif eder; içerik doğruluğu veya her şekil etiketinin eksiksiz açıklanması hakkında bir sertifika değildir.

## Kaynak incelemesi

12 PDF’nin yerel tam metin çıkarımları okundu; eski bağlayıcı yanıtlarının karakter sınırına dayanılmadı. Kaynakların toplamı 697 sayfadır. Metinsiz veya şekil ağırlıklı sayfalardan aşağıdaki görseller ayrıca incelendi:

| Ders | Görsel incelemenin başlıca sayfaları |
|---|---|
| 0 | 5: Prometheus kapağı; metin katmanında bulunmayan atlas önerisi anlatıma eklendi |
| 1 | 24, 26, 33–36, 38, 40, 42, 47: düzlem, eksen, hareket, yön ve bölgeler |
| 2 | 17–18, 27, 38, 53: iskelet sayımı, omuz, pelvis ve göğüs kafesi |
| 3 | 15, 34, 48: kıkırdak bağlantılar, eklem tipleri ve deltoid bağ |
| 4 | 4, 8, 32, 34, 38, 48: appendiküler iskelet, glenoid çevresi, pelvis, femur, kemerler |
| 5 | 23–24, 26–27, 29, 43–47, 49, 60: orbita, maxilla, mandibula, kafa tabanı, omurga ve kaburga ilişkileri |
| 6 | 17, 40–41, 61, 65–66, 72, 85–86: kasılma, mimik, subscapularis, el kasları ve şekil soruları |
| 7 | 6, 20, 31, 37, 40, 43–44: devreler, arter ağacı, yüzeyel ve derin venler |
| 8 | 11, 32, 40, 43, 52, 61, 66, 75, 80–81, 98, 111, 129, 137: ağız/dil, çiğneme, tonsiller, yutak, mide, duodenum, bağırsak damarları, anal kanal ve portal sistem |
| 9 | 26, 32, 38, 40: beyin bölümlemesi, loblar, omurilik kesiti, meninksler |
| 10 | 12, 18, 21: prostat komşuluğu, genital yapılar ve vulva |
| 11 | 4, 11, 27, 31, 39: solunum yolu, mediastinum, larynx ve hilum |

Bu liste **697 şeklin her küçük etiketinin tek tek uzman denetiminden geçirildiği** iddiasını içermez. Kapak/kapanışlar ve tekrarlanan slaytlar ders paragrafına dönüştürülmedi. Referans arşivi kapsam kontrolüne yardım eder; otomatik kaynak varlık testi anlamsal eksiksizlik ölçmez.

## Konu kapsamı

| Dosya | Yazılan ders örgüsü |
|---|---|
| 0 · 7 sayfa | Zorunlu olmayan kaynak önerileri; Sobotta, Netter, Prometheus; Mehmet Yıldırım ve Kaplan Arıncı; atlasla çalışma |
| 1 · 55 sayfa | Tanım/tarih, bütün ana anatomi yaklaşımları, sistemler, duruş, düzlem/eksen, yön/hareket, bölge/boşluk ve Latince |
| 2 · 69 sayfa | Kemik görevi/yapısı/şekli/yüzey terimleri, iskelet organizasyonu, üst-alt taraf, pelvis ölçü yönleri, aksiyel harita |
| 3 · 58 sayfa | Yapısal ve fonksiyonel sınıflama, sinoviyal yardımcı yapılar, yedi yüzey tipi, bölgesel eklemler, klinik terimler |
| 4 · 49 sayfa | Omuz kuşağı, humerus, radius-ulna, 8 karpal, tarak/falanks, pelvis, femur-patella, tibia-fibula, 7 tarsal ve kemerler |
| 5 · 67 sayfa | Kafa kemikleri/bölümleri, orbita, yüz ve kafa tabanı işaretleri, beş bakış yönü, vertebralar, diskler, sacrum-coccyx, kaburga/sternum |
| 6 · 86 sayfa | Doku/yapı/fasya/roller/kasılma; baş-boyun, sırt, göğüs, karın, omuz-kol-el, kalça-uyluk-bacak grupları |
| 7 · 51 sayfa | Kalp boşlukları/kapakları/duvarı, koroner ve ileti sistemi, iki devre, aorta/arterler, venler, nabız/varis ve lenf |
| 8 · 138 sayfa | Ağızdan anal kanala bütün organ sırası; dil innervasyonu, tükürük, pharynx/oesophagus, mide/bağırsaklar, karaciğer/safra/pankreas ve portal dolaşım |
| 9 · 44 sayfa | Hücreler, sınıflamalar, beyin bölümleri/loblar, omurilik segment-kök-kesit, meninks/BOS ve 12 çift kraniyal sinir |
| 10 · 31 sayfa | Erkek/kadın üreme organları, yollar, bezler, komşuluklar; kaynak ayrı bir üriner sistem dersi içermiyor |
| 11 · 42 sayfa | Gaz değişimi, terimler, toraks/mediastinum, burun/sinüs, pharynx/larynx, bronş ağacı, akciğer ve diaphragma |

## Yeniden yazım ilkeleri

- Başlıklar slayt numaralarına göre değil öğrenme sırasına göre birleştirildi. Tekrarlar ayıklandı; yapı–konum–komşuluk–işlev ilişkileri açıklandı.
- Tablolar karşılaştırma, akışlar geçiş sırası, kısa çağrı kutuları kavramsal ayrım için kullanıldı. Aynı bilgi sırf kelime sayısını artırmak için tekrarlanmadı.
- Bölüm kaynak aralıkları `sourcePages` alanında saklanır. Bunlar ilgili konuya dönüş referanslarıdır; yeni açıklamaları hocadan yapılmış doğrudan alıntıya dönüştürmez.
- Terim açıklamaları ve bağlantı kuran genel anatomi bilgileri editoryal olarak eklendi. Güncel, lisanslı atlas ve öğretim elemanı denetimi yerine geçmez.
- Tekrar soruları proje için yazıldı; hocanın sınav soruları olarak tanıtılmaz.
- Metinlerin hocanın kendi yazdığı veya onayladığı yayınlar olduğu iddia edilmez.

## Kaynakta görülen hataları aynen tekrarlamamak için korunan ayrımlar

1. Önkol pronasyon/supinasyonu, omuz iç/dış rotasyonuyla eş anlamlı değildir.
2. Fibröz eklem ile hiyalin kıkırdak bağlantısı farklıdır; distal radioulnar eklem sinoviyal, interosseöz membran syndesmosistir. Plana eklemler küresel eklem gibi serbest dönme modeliyle açıklanmadı.
3. Hyoid yüz iskeletinin 14 kemiğine katılmadı. Omurga kemikleriyle omurilik segmentleri ayrıldı: spinal segment sayısı **31**.
4. Kasların tümünün mutlaka iki kemiğe tutunması, kalp kasının her atım için dış sinir uyarısına ihtiyaç duyması gibi mutlak ifadeler kullanılmadı. Eksantrik kasılma gevşeme olarak anlatılmadı.
5. Arter/ven tanımı oksijenle değil akım yönüyle yapıldı. Pulmoner devrenin başlangıç-bitişi ve kapak sırası düzeltildi. İstirahat taşikardisi için eski >90 eşiği veya evrensel bir “normal tansiyon” aralığı tekrarlanmadı.
6. Kesin bölgelere ayrılmış tat haritası reddedildi. Dilin epiglottis çevresi için vagusun superior laryngeal sinirinin internal dalı belirtildi. Sert damakta palatin kemiğin horizontal laminası kullanıldı.
7. Bütün kalın bağırsağa tek periton yerleşimi atfedilmedi. Portal sistem iki kapiller yatak ilişkisiyle açıklandı; karaciğer glikojen metabolizması tek başına “iç salgı” diye sınıflanmadı.
8. Beyinde derin gri çekirdekler de bulunduğu, BOS’un subaraknoid aralık/ventrikül ilişkisi ve lateral boynuzun düzey özelliği korundu.
9. Hymenin görünümünden cinsel geçmiş çıkarılamayacağı açıklandı; zorunlu ilk ilişki yırtılması/kanaması miti aktarılmadı. Skene/paraüretral bezlerle küçük vestibüler bezler eşitlenmedi. Eski semen değerleri tanı eşiği yapılmadı.
10. Pharynx yutak, larynx gırtlak olarak ayrıldı. Havanın toraksın serbest boşluğuna değil akciğer hava yollarına girdiği anlatıldı. Oksijen yüzdesi farkı yanlış bir kullanım oranına dönüştürülmedi.
11. Pelvik çaplar, kaslar veya damar bölgeleri klinik karar ya da girişim talimatı olarak sunulmadı. Özellikle gluteal enjeksiyon yönlendirmesi yapılmadı.

## Dosyalar ve yayın

- `src/content/lessons/`: Düzenlenebilir, yazılmış asıl ders metni. Artık eski kısa özetler üzerine runtime yama uygulanmaz.
- `reference/course-content/`: Kaynak metin ve bütün sayfa görselleri. Eski `public/course-content/` buraya taşındı; production build’de bulunmaz. Ham PDF’ler `google_drive/` içinde git tarafından yok sayılır.
- `scripts/import-course-content.py`: Yalnız referans arşivi üretir; kaynak metni okuyucuya otomatik aktaran bir süreç değildir.
- `src/courseManifest.json`: PDF kimlik ve bütünlük bilgileri.
- Kapaklar evvelki atlas estetiğinde bırakıldı. Yapay zekâ ile üretilmiş dekoratif çizimlerdir; kaynak görseller gibi anatomik doğruluk iddiası taşımaz.

Kalıcı yayın öncesi hocanın konu kapsamı ve doğruluk kontrolü, PDF/web yeniden kullanım izinleri, üçüncü taraf atlas görsellerinin hakları ve anonim Drive erişimi doğrulanmalıdır. Statik barındırmada yalnız `dist` yayımlanmalıdır; referans arşivini veya depo kökünü yanlışlıkla web kökü olarak kullanmayın. Testler bu editoryal/izin incelemesinin yerine geçmez.

## Son düzenleme ve kaynak kimliği kontrolü

- Anlatım 119 tematik bölüme ayrıldı. Bölgesel ayrıntılar akıcı paragraflarla genişletildi; elin intrinsik kasları ve karın–alt ekstremite arterleri ayrı başlıklar oldu. 58 proje sorusu gerekçeli cevaplarla sunuluyor.
- 14 Ekim 2026 tarihli Drive klasör listesi dosya adı–kimlik eşleşmelerini tekrar doğruladı. Mevcut katalog doğrudur: örneğin giriş `15OxNPqApSUJ2-rnQoui2EVshH-MdM_IC`, eklem `1EV_rNsXJJT_rJatlDwPG8s0q18WOvjnp`, dolaşım `185OzTu2BEO6gO-EQB1okCEuXNu7S9E-c`. Dosya sırasından çıkarılan alternatif eşleştirme kullanılmadı. Bu kontrol erişim izinlerini değiştirmez veya anonim erişimi kanıtlamaz.
- Yeni kontroller, 320 px ekranda en büyük yazı boyutuyla kranial sinir tablosunu ve içindekiler odağını; arşiv istekleri engellenmişken sindirim dersinin son başlıklarına erişimi kapsar.


## Birleştirme sonrası genişletme: konu içi açıklamalar ve çizimler

Önceki 119 bölümlük sürüm kullanıcı tarafından hâlâ kısa ve metin ağırlıklı bulundu. Yeni düzenleme bütün 115 anatomi bölümüne iki veya daha fazla paragraftan oluşan açıklayıcı alt bölümler ekler. Kaynak rehberindeki dört bölüm korunur. Bunlar kaynak sayfalardan çıkarılmış bir metin akışı değil, yapısal ilişkileri açıklayan editoryal anlatımlardır. `sourcePages` ve mevcut bölüm bağlantıları korunmuştur; sayfa referansı eklenen her cümlenin slaytta birebir bulunduğu anlamına gelmez.

- Temel konular: düzlem–eksen ilişkisi, katmanlar, büyüme, bağ/kapsül ve eklem biçimi.
- Hareket sistemi: bölgesel kemik işaretleri, kemerler, kas grupları ve karşılaştırma tabloları.
- Organ sistemleri: odacık/kapak sırası, damar devamlılığı, kanal duvarları, salgı–emilim ilişkisi, sinir kökü/dalı ayrımı, üreme kanalları ve solunum mekaniği.
- Sinir sistemi tekrar sorularında aynı beyin sapı sorusunun ikinci bir biçimi yerine somatik–otonom yol karşılaştırması kullanıldı; toplam soru sayısı değişmedi.

### Konu içi görsel dağılımı

| Ders | Özgün SVG şemalar |
|---|---|
| 1 | Anatomik düzlemler; vücut boşlukları |
| 2 | Uzun kemik kesiti; büyüme plağının düzeni |
| 3 | Sinoviyal eklem kesiti; menteşe–pivot mekanik modelleri |
| 4 | Supinasyon/pronasyonda radius–ulna; medial ayak kemeri |
| 5 | Kafatasının yandan kemik haritası; omurganın bölge ve eğrilikleri |
| 6 | Kas–demet–lif–miyofibril; dirsekte antagonist ilişki |
| 7 | İki dolaşım devresi ve dört odacık; aortanın ana dalları |
| 8 | Sindirim kanalı; diş kesiti; villus; portal yol |
| 9 | Nöron; omurilik kök ve dalları; meningeal katmanlar |
| 10 | Sperm iletim yolu; over–tuba–uterus ilişkisi |
| 11 | Trachea ve lober dallanma; alveoler gaz geçişi; diaphragma hareketi |

SVG geometrileri `scripts/build-diagrams.mjs` içinde elle tanımlandı. Başlık, açıklama, numara ve metin anahtarı `src/content/diagrams.js` içindedir. Görseller hocanın şekillerinin kopyası değildir; kapak resimlerinden farklı olarak belirli bir ilişkiyi öğretmek için çizilmiştir. Her figürün yönü/kesit türü, sadeleştirme sınırı ve metinsel anahtarı görünür. Renkler şematiktir; venöz kanın mavi olduğu izlenimi verilmez. Omurga eğrilikleri anterior/posterior yönlerine göre, deferens bağlantısı epididymis kuyruğuna göre kontrol edilmiştir.

Büyütme penceresi yerel SVG'yi %100–200 ölçekte gösterir; dar ekranlarda çizim kendi alanı içinde kaydırılır. Metinsel açıklamalar mobilde tek sütuna döner ve okuyucunun yazı boyutu ayarına uyar. Klavye odağı pencere içinde tutulur; Escape veya kapat düğmesiyle tetikleyiciye döner. Şemalar, kaynak PDF'yi veya editoryal arşivi indirmeden yüklenir.

### Doğrulama ve yayın durumu

- 20 birim/içerik testi ve 16 tarayıcı senaryosu geçti; üretim derlemesi başarılı.
- 26 SVG'nin XML yapısı ve yüklenmesi, numara–açıklama eşleşmesi, masaüstü yerleşimi, mobil taşma, yakınlaştırma ve odak dönüşü kontrol edildi.
- Şemalar sadeleştirilmiş ve ölçeksizdir. Bu kontroller tıbbi uzman denetimi veya PDF'deki her küçük şekil etiketinin birebir eşdeğerliği anlamına gelmez. Öğretim elemanı kapsam/doğruluk incelemesi hâlâ gereklidir.
- PR #1 önceki sürüm için birleştirildi. Bu genişletme **sonraki yerel çalışma**dır; kapanmış kodlama oturumundan yeni bir uzak işlem veya kalıcı yayın yapılmadı. Yayına devam etmek için yeni kodlama oturumu gerekir.


## Son kapsamlı anlatım düzenlemesi — 14 Ekim 2026

Kullanıcı önceki genişletmeyi de fazla özet buldu. Bu çalışmada kaynak sayfaların başlıkları mevcut bölümlerle karşılaştırıldı; özellikle dolaşım ve sindirimin ilgili sayfalarındaki ayrıntılar yeniden okundu. Bütün 115 anatomi bölümüne ayrı ayrı yazılmış yeni anlatım eklendi. Kaynak rehberinin dört bölümü değiştirilmedi. Metinler slayt çıkarımı veya tekrarlanan paragraf şablonu değildir; canonical ders dosyalarına statik, düzenlenebilir içerik olarak işlendi.

Toplam: **119 ana bölüm, 230 alt bölüm, 43.680 anlatım kelimesi, şema açıklamaları dahil 45.510 kelime, 53 karşılaştırma tablosu, 26 öğretici şema ve 58 tekrar sorusu.** Önceki sürüme 16.215 kelimelik başlık/anlatım/tablo içeriği eklendi. Sayım yöntemi `lessonWords` ile aynı; arayüz, yinelenen diyalog metni ve tekrar soruları dahil değil.

| Ders | Bu düzenlemede ayrıntılandırılan ilişkiler |
|---|---|
| 1 | Anatominin yöntem ve ölçekleri; yön/duruş/kesit ayrımları; özel hareketler; seröz boşluklar ve karın bölgeleri; Latin ad yapıları |
| 2 | Kuvvet–moment kolu; kemik hücreleri ve matriks; kemikleşme; kemik yüzey işaretleri; ekstremitelerde yük aktarımı |
| 3 | Kapsül–sinovya–kıkırdak; disk/menisküs/labrum; kuşak ve ekstremite bağları; aksiyel eklemler; klinik terimlerin doku karşılıkları |
| 4 | Kuşak tutunmaları, humerus tüberkülleri, önkol membranı, karpal sıra ve tünel, pelvis geçitleri, femur torsiyonu, ayak kemik ve kemer bağlantıları |
| 5 | Kafa kemiklerinin boşluklara katkısı; foraminal geçişler; sutura/fontanel; temporal-ethmoid ayrıntıları; vertebra, sacrum ve kaburga özellikleri |
| 6 | Kasılma mekanizması, motor ünite ve pennasyon; bölgesel kasların tutunma–sinir–hareket ilişkileri; el ve bacak kompartmanları |
| 7 | Damar katmanları ve lenf; kalp iç yüzleri; kapakların basınçla çalışması; koroner ve büyük damar dalları; fetal yollar; venöz dönüş |
| 8 | Duvar katları ve enterik ağlar; ağız/yutak kasları; diş formülü; dil papillaları ve sinirler; bez kanalları; mide hücreleri; duodenum, emilim, kolon, safra ve portal sistem |
| 9 | Transdüksiyon ve refleks; sinaps ve glia; merkezi yollar; gelişimsel beyin bölümleri; lob, çekirdek ve peduncleler; spinal kök/pleksus; BOS ve kranial bileşenler |
| 10 | Testis üretim yolu ve örtüler; kordon–deferens ayrımı; bez açıklıkları; urethra; over askıları; uterus katman/destekleri; vagina ve vulvanın ayrı yapıları |
| 11 | Alveol hücreleri ve surfactant; mediastinal bölümler; burun-sinüs komşulukları; laryngeal eklemler; hava yolu duvar değişimi; pleura ve solunum kasları |

`docs/full-course-coverage.json`, 115 bölümün eklenen başlığını ilgili kaynak sayfa aralığıyla eşleştirir. Bu bir editoryal yerleşim kaydıdır; kaynak şekillerdeki her küçük etiketin uzman onaylı, birebir eşdeğer anlatıldığına dair sertifika değildir. Ek açıklamalardaki ayrıntıların tümü kaynakta kelimesi kelimesine bulunmaz; hocanın yazdığı/onayladığı yayın olduğu iddia edilmez.

### Okuyucu ve doğrulama

- Alt başlıklar odaklanabilir bağlantı hedefleridir. Masaüstünde etkin bölümün alt başlıkları, mobil içindekilerde tüm bölümlerin alt başlıkları erişilebilirdir. Mobil listeye dönmek için yukarı kaydırmanın etkin bölümü değiştirmesi, alt başlıkları artık listeden kaldırmaz.
- **22 içerik/birim testi + 17 tarayıcı senaryosu** geçti; üretim build'i başarılı. Yeni kontroller 115 bölüm eşleştirmesini, somut bölgesel terimlerin varlığını, uzun kas/sindirim anlatımlarının render edilmesini, 320 px ve 20 px yazı boyutunda alt başlık gezinmesini kapsar.
- Önceki 26 şema, PDF kimlikleri, kaynak sayfa referansları, tasarım ve okuma araçları korunmuştur.
- Çalışma yerel önizleme sürümüdür. Kapanmış oturumda uzak GitHub işlemi veya kalıcı yayın yapılmadı; yayın için yeni kodlama oturumu gerekir.


## Resmî profil fotoğrafı — 14 Ekim 2026

Kullanıcının isteğiyle “Hocamız Hakkında” sayfasındaki büyük BD monogramı yerine `InstructorPortrait` bileşeni eklendi. Kaynak, https://abs.firat.edu.tr/tr/bdagdeviren sayfasında yayımlanan şu fotoğraf URL'sidir:

`https://apiabs.firat.edu.tr/images/userProfilePicture/6771957e-d99c-4285-a146-5f646d594830.jpeg`

Fotoğraf üretilmedi veya başka kişiye ait arama görseli kullanılmadı. Resmî profil sayfasından URL doğrulandı; çalışma ortamında görüntünün kendisini indirme girişimi SSL bağlantı hatasıyla sonuçlandı. Bu nedenle portre resmî sunucudan ziyaretçinin tarayıcısında doğrudan yüklenir, yerel kopyası yoktur. Gerçek sunucunun tarayıcıdan yüklenmesi bu ortamda doğrulanmış değildir. Ağ hatasında kırık resim yerine baş harfler ve resmî profile bağlantı görünür. Kaynak bağlantısı fotoğraf altında yer alır; üniversite onayı veya yeniden kullanım izni iddiası oluşturmaz.

22 birim testi, 19 tarayıcı senaryosu ve üretim build'i başarılı. Yeni fotoğraf testleri doğru kaynak URL'sini, mobil yerleşimi ve hata davranışını kontrollü görüntü fixture'ı/engellenmiş ağ isteğiyle sınar; gerçek fotoğraf sunucusunun erişilebilirliğini kanıtlamaz. Değişiklik önizlemededir; uzak yayın yapılmadı.


## 30 Ekim 2026: ZygoteBody kaldırıldı, TUĞRUL ATLAS eklendi

Gömülü ZygoteBody atlası, sahne kataloğu, ders eşleşmeleri, Zygote telif satırı ve sahne kayıtları kaldırıldı. Yerine, Muhammet TUĞRUL’un yayımladığı **TUĞRUL ATLAS — İnteraktif Anatomi Atlası** (`https://keykavus324-svg.github.io/anatomyATLAS/`) gömülü pencere olarak açılır.

- Sayfa başlığı “TUĞRUL ATLAS — İnteraktif Anatomi Atlası” ve künye “Bir Muhammet TUĞRUL projesi.” olarak belirtilir.
- `#/atlas` tek atlas sayfasıdır; eski `#/atlas/<sahne>` bağlantıları aynı sayfayı açar.
- Atlasın adresine ulaşılamazsa uyarı ve “Yeni sekmede aç” seçeneği gösterilir.
- Gömülü pencere ile site arasında durum senkronizasyonu yoktur; kullanıcının atlas içindeki etkileşimi adres çubuğuna yazılmaz.
- Çevirisi: TR/EN/AR metinleri `src/i18nPhrases.js` içindedir; atlas çeviri paketi ve `src/content/atlas/` klasörü kaldırıldı.

## 15 Ekim 2026: görsel çalışma rehberi ve aktif hatırlama

11 anatomi dersine projeye ait ayrı öğrenme hedefi, yapı–işlev açıklaması, şema inceleme görevi, açılır örnek yanıt ve kavram yanılgısı notu eklendi (`src/content/studyGuides.js`). Kaynak rehberine anatomik görev eklenmedi. Yeni metinler hocanın doğrudan alıntısı veya sınav sorusu değildir; bu turda kaynak PDF'lerin yeniden tıbbi incelemesi yapılmadı.

Ders başındaki yerel şema kartları ilgili şekle kaydırır ve klavye odağını taşır. 26 mevcut çizim korunur; yeni anatomik çizim üretilmedi. Şema altında numara seçerek tek bir yapının açıklamasını inceleme ve metin açıklamalarını ayrı ayrı açarak aktif hatırlama araçları bulunur. Çizimin kendisindeki etiketler gizlenmez; bu nedenle araç bir kör etiket sınavı olarak sunulmaz. İşlem puan veya çalışma kaydı tutmaz; ağ isteği veya yeni depolama anahtarı eklenmedi.

Doğrulama: 30 birim/içerik testi, 25 Playwright senaryosu ve üretim build'i başarılı. Yeni tarayıcı testi görsel kart odağını, yanıt açmayı, yapı seçimini, bağımsız açıklama açmayı ve 320 px taşma kontrolünü kapsar. Uzman doğruluk denetiminin yerini almaz.

## Soru odaklı anlatım genişlemesi — 15 Ekim 2026

Yalnız Sitede oku içeriğine `src/content/exam/` altında 42 özgün açıklama/karşılaştırma/alıştırma bloğu ve 6 etiketli şema eklendi. Ek bloklar doğrudan ilgili 119 ana bölümün içine bağlanır. Arşivdeki işaretler resmî cevap anahtarı sayılmadı; farklı kurum ve okunaksız satır sınırlamaları gizlenmedi. PDF kataloğu, PDF okuyucu ve Drive orijinalleri değiştirilmedi. Ayrıntılı kaynak incelemesi ve konu–soru eşleştirmesi için [exam-content-audit.md](exam-content-audit.md). Test başarısı tıbbi uzman denetimi veya 100 puan garantisi değildir.

## 15 Ekim 2026: gömülü quizde “Next” çalışmıyor sorunu

**Belirti.** Kullanıcı, Quizler bölümünde gömülü Free Anatomy Quiz penceresinde soruları ilerletemediğini bildirdi: düğme normal görünüyordu ama tıklayınca aynı soruda kalıyordu.

**Kök neden (kaynak koddan doğrulandı).** Yayıncının quiz motoru (`quizrun.js` ve `quizrun2.js`; her quizin soru verisi ayrı `.js` dosyasındadır) `nextQuestion()` içinde `top.location = <quiz sayfası>?questNum=N&cor=N` ile **üst düzey pencereyi** yenileyerek ilerler. Gömülü çerçeve `sandbox` sayesinde üst pencere gezinmesine izin vermez; tarayıcı bu geçişi sessizce engeller ve düğme ölü görünür. Yanlış yanıtlar sayfa içinde geri bildirim panelinde kalır, yalnızca doğru yanıt ilerleme tetikler; “yanıt seçin” uyarısı bir `window.alert`tir ve `allow-modals` olmadan o da engellenir. Motor her yüklemede kalan soruları yeniden karıştırır (`randQuiz`), bu yüzden dışarıdan `?questNum=` bağlantısıyla ilerletme yayıncının soru setini ve puanını bozar; kullanılmadı.

**Karar.** Sekmeyi her soru geçişinde yayıncıya devretmek (`allow-top-navigation-by-user-activation`) değerlendirildi ve reddedildi: gömülü pencereden sessiz tam sayfa devri, yönlendirilmiş yeni sekme yolundan daha kötü bir arıza modudur. Proxy/kopya ise proje ilkesine aykırı. Buna göre: kaynak görünüm birincil eylem oldu (onay ekranında “Quizi kaynağında çöz”); gömülü pencerenin yalnızca ilk soruyu önizlediği onay metninde, durum satırında ve soru alanının hemen üstündeki kalıcı bilgi kartında (“Sorular bu pencerede ilerlemiyor mu?”) açıkça yazılı. Sandbox’a `allow-modals` eklendi; üst pencere gezinmesi yasak kaldı. Hiçbir soru metni, görsel veya puan kopyalanmadı; iframe adresi değişmedi.

**Testler.** Tarayıcı senaryosu; onay ekranındaki kaynak bağlantısını, gömülü önizleme başlatıldığında iframe adresini, `allow-modals` varlığını, `allow-top-navigation` yokluğunu, durum satırı ve bilgi kartı metnini doğrular. Birim testler ve üretim build bu değişiklikle yeniden koşuldu.

## 15 Ekim 2026: Anatomi Quizleri bölümü yerel soru bankasına çevrildi

**Bağlam.** Gömülü Free Anatomy Quiz penceresinde soru ilerlemesi, yayıncı motorunun üst pencereyi yeniden yüklemesi nedeniyle tarayıcı tarafından engelleniyordu (bkz. önceki kayıt). Kullanıcı bölümün tümüyle yerel, özgün sorularla yeniden kurulmasını istedi; şekillerin de güzel çizilmiş olmasını öğrendi.

**Yapılanlar.** (Bu banka 21 Kasım 2026'da 12 set × 10 = 120 soruya ve dört yanıt biçimine genişletildi; bkz. dosyanın sonundaki kayıt.) `src/content/quizBank.js` içinde 7 set × 10 = 70 özgün Türkçe soru yazıldı (temel terminoloji, iskelet, kas, dolaşım, sinir, solunum, duyu). Her soruda 4 seçenek, tek doğru, en az 40 karakterlik açıklama; çeldiriciler gerçek komşu yapı/kavramlardan kuruldu. Sorular ders kütüphanesine (1–11) ve “Kendini sına” bankasından farklı açılara bağlandı; iki bölümün soruları çakışmaz. `scripts/build-quiz-diagrams.mjs` ile 7 yeni şekil çizildi (lomber omur, sarkomer, kalp kesiti, nefron, göz kesiti, kulak, beyin lobları); hepsi numaralı pinli, kâğıt dokulu, projenin mevcut şekil diliyle uyumlu ve `public/diagrams/quiz/` altında derleme zamanında üretilir. 56 soru şekillidir; 26 mevcut ders şekli de yeniden kullanılır. Motor `src/quiz.js`: saf karıştırma/puanlama fonksiyonları, her denemede yeni sıra. `QuizPage.jsx` baştan yazıldı: katalog kartlarında kapak şekli ve anahtar kelime araması (Türkçe yumuşama sorununa karşı “kalp→kalbin” gibi eşleşmeler set anahtar kelimeleriyle çözülür), giriş ekranı, kontrol edilmiş ilerleme, konu konu sonuç dökümü. Harici katalog (`src/quizCatalog.js`), gömme akışı ve `docs/quiz-integration.md` eski haliyle kaldırıldı; hiçbir yayıncı isteği kalmadı.

**Editoryal sınırlar.** Sorular hocanın sınav sorusu veya resmî banka değildir; tıbbi yeniden gözden geçirme yapılmadı. Şemalar sadeleştirilmiş, ölçeksiz öğretim çizimleridir; atlas yerine geçmez. Arayüzde bu sınır açıkça yazılıdır.

**Doğrulama.** 50 birim/içerik testi (şekil SVG'lerinin diskte varlığı + pin/etiket sayı tutarlılığı dahil), 39 Playwright senaryosu ve üretim build'i başarılı. Masaüstü görüntü kontrolleri: katalog, giriş, soru akışı, geri bildirim ve sonuç ekranları.


## 15 Ekim 2026: quiz şekilleri anatomik plakalara yükseltildi

İlk turda elle kodlanmış SVG şemalar kullanıcıya “yetersiz” göründü; şekiller gerçek atlas plakası kalitesinde yeniden üretildi. Yeni akış: `art-src/` altındaki (git dışı) kaynak illüstrasyonlar gözden geçirildi — vertebra (üstten), sarkomer, kalp frontal kesiti, nefron, göz kesiti, kulak, beyin lobları — her plaka tek tek anatomik doğruluk kontrolünden geçti; pin hedefleri kodda (`scripts/build-quiz-plates.py`) tutulduğu için etiket yanlışı üretemez. Plakalar site paletine uydurulup (72 renk nicemleme → JPEG q82) SVG sarmalına gömüldü; dosya başına ~300–430 KB. `quizDiagrams.js` meta verileri plaka diline (“ANATOMİK PLAKA”) uyarlandı; görüntü boyutu 460→507 (3:2) olarak güncellendi. 50 birim + 39 tarayıcı testi ve üretim build yeniden geçti.

### Çeviri paketleri (30 Ekim 2026)

- İngilizce ve Arapça çeviri verileri `src/content/packs/{en,ar}.js` altında toplandı ve yalnızca dil seçildiğinde yüklenir (`loadTranslationPack`). Türkçe ziyaretçinin ilk açılış JS yükü (gzip) ~741 kB'tan ~332 kB'a düştü; içerik parçası 562 kB'tan 158 kB'a indi.
- `LanguageProvider` yeni dilin paketi hazır olmadan dili değiştirmez; geçiş sırasında açık okuyucu veya quiz kaybolmaz.
- `tests/translation-packs.test.js` Türkçenin hemen hazır olduğunu ve EN/AR paketinin istenmeden yüklenmediğini doğrular.


## 21 Kasım 2026: quiz bankası 12 sete çıktı; dört soru tipi, ustalık haritası ve sınav simülasyonu eklendi

**Bağlam.** Kullanıcı ürünün bütününde (konu anlatımından sorulara ve quizlere) gerçek bir genişleme istedi. Quiz bölümü 7 set/70 soruyla ve tek bir yanıt biçimiyle (çoktan seçmeli) sınırlıydı; ders kütüphanesindeki 2 (hareket), 3 (eklem), 4 (ekstremite), 8 (sindirim) ve 10 (ürogenital) derslerin hiçbiri bir setle kapsanmıyordu. Zamanlı deneme, kişisel ilerleme kaydı ve “hangi konuda zayıfım” sorusuna cevap veren bir ekran yoktu; çözülen quizler yalnız favori/“çalıştım” işareti bırakıyordu.

**Yapılanlar.**

- **Banka 120 soruya çıktı.** Beş yeni set yazıldı: `hareket` (hareket sistemi ve kemik dokusu), `eklem` (artroloji), `ekstremite` (üst/alt ekstremite kemikleri), `sindirim`, `urogenital`; her biri 10 özgün soru, konu etiketi ve en az 40 karakterlik gerekçe (`why`) içerir. Böylece 1–11 arasındaki her ders en az bir setle kapsanıyor (`duyu` ders numarası olmadan durur). Setlere katalog grubu eklendi (`category` + `quizCategories`: Temel anatomi 1, Hareket sistemi 5, Organ sistemleri 6) ve hub'da kategori filtresi açıldı.
- **Dört yanıt biçimi.** `quizBank.js` içinde `q` (çoktan seçmeli), `tf` (doğru/yanlış), `multi` (çoklu seçim) ve `order` (sıralama) fabrikaları var; biçim soruda `type` alanıyla taşınır. Dağılım: 104 çoktan seçmeli, 5 doğru/yanlış, 5 çoklu seçim, 6 sıralama. Yeni beş setin her birinde birer doğru/yanlış, çoklu seçim ve sıralama sorusu bulunur; çeldirıcılar komşu yapı ve kavramlardan kurulur, sıralama soruları gerçek anatomik dizileri (kuvvet aktarımı, besin yolu, sperm yolu, eklem katmanları, el zinciri, yumurta yolu) sorar.
- **Motor biçim-duyarlı.** `src/quiz.js` saf fonksiyonlar olarak kaldı ve rastgelelik kaynağı dışarıdan verilebilir: doğru/yanlışta iki etiketin yeri asla değişmez; sıralamada seçenekler karıştırılır ve `correct`, kaynak sırasını ekranda yeniden kuran konum listesidir; çoklu seçim ve sıralama hep-ya-hiç puanlanır (sıralama konuma duyarlı). `pickBalanced` kâğıdı set set dengeli çeker, `gradeBySet` set bazlı döküm verir, `examSeconds(n)=n×45` ve `formatClock` sınav saatini kurar.
- **Çalışma kaydı.** `src/quizProgress.js` (saf) + `src/useQuizProgress.js` (`anatomi-quiz-history-v1`, en fazla 80 deneme, en yeni başta). Ustalık bir set için son ve en iyi denemenin karışımıdır: `round((0.6×son + 0.4×en iyi)×100)`; zayıf konu doğruluk <%85 ve en az 2 soru kanıtıyla seçilir; ayrıca kapsam, seri günü, doğruluk seyri ve toplamalar hesaplanır. Bozuk kayıtlar alan alan onarılır veya düşürülür, `NaN` arayüze ulaşmaz. Depolama kapalıysa uyarı gösterilir, oturum içinde çalışma sürer.
- **Sınav simülasyonu (`#/sinav`).** `src/ExamPage.jsx` ve `src/routing.js` içindeki `parseExamScope`/`examHash` ile kapsam adreste taşınır: `#/sinav` (tüm setler), `#/sinav?k=weak` (zayıf konu kâğıdı), `#/sinav?k=<set-id>` (tek set). Kurulumda kapsam, kâğıt uzunluğu (10/20/30) ve süre sayacı seçilir, havuz set set listelenir. Koşu sırasında yanıtlar açıklanmaz; soru paleti, Alt+ok geçişi, boş sayısı ve boş bırakırken onay vardır, süre bitince kâğıt kendiliğinden teslim edilir. Rapor: puan halkası, set set ve konu konu doğruluk çubukları, kalan/harcanan süre, boş sayısı, “bundan sonra” listesi (zayıf konudan ilgili sete ve dersi anlatan web dersine bağlantı) ve soru soru döküm. Kapsam değişince ekran kuruluma döner.
- **Ders anlatımından soruya köprü.** `LessonPage.jsx` tekrar sorularının altına `.lesson-quiz-bridge` bölümü aldı: o derse bağlı quiz seti kapak şekli, soru sayısı, şekilli soru sayısı ve `setMastery` ile gelen ustalık satırıyla durur; “Adım adım çöz” quizi, “Sınav modunda çöz” o setin zamanlı kâğıdını açar, alt satır karışık sınava götürür. Köprü `quiz.css` yüklenmeden de doğru görünsün diye `lesson.css` içinde stillendi; seti olmayan derslerde (kaynak rehberi) çizilmez.
- **Ortak parçalar ve hub.** `src/components/QuizQuestion.jsx` figür görüntüleyiciyi, dört biçimin yanıt girişini, puan halkasını ve ölçü çubuklarını tek yerde tutar; hem quiz koşucusu hem sınav bunları kullanır. `QuizPage.jsx` hero, sınav şeridi, ustalık paneli, sekmeler/kategori/arama, kartlarda ustalık halkası + sınav kısayolu ve iki düğmeli alt şeritle yeniden düzenlendi; ana sayfa şeridi de `#/sinav` kısayolunu aldı.
- **Çok dillilik korundu.** 12 setin ve 120 sorunun tamamı (konu, metin, seçenekler, gerekçe) İngilizce ve Arapça olarak `src/content/quizBank/i18n/{en,ar}.js` içinde; çeviriler seçenek sayısını, doğru indeksi, soru tipini ve şekil anahtarını birebir korur, metinler gerçekten farklıdır. `src/i18nPhrases.js` yeni arayüz satırlarıyla (yanıt biçimleri, ustalık haritası, sınav kurulumu/koşusu/raporu, ana sayfa şeridi) genişletildi ve bayatlayan “7 konu alanı, 70 özgün soru” satırı kaldırıldı.
- **Şekiller.** Yeni set ve sorular mevcut proje çizimlerini kullanır (long-bone, growth-plate, spine, foot-arch, forearm, synovial, joint-motion, digestive-tract, villus, portal, male-path, uterus). 86 soru şekillidir; 30 ayrı şekil (24 ders şeması + 6 quiz plakası). Yeni görsel dosya üretilmedi, hiçbir yayıncı görseli eklenmedi.

**Editoryal sınırlar.** Sorular ve gerekçeler bu proje için yazıldı; hocanın sınav sorusu veya resmî bir soru bankası değildir, tıbbi yeniden gözden geçirme yapılmadı. Sınav simülasyonu resmî sınav, gözetim veya not değildir; ustalık haritası kişisel çalışma izlenimidir ve gerçek sınav notunu garanti etmez. Şemalar sadeleştirilmiş, ölçeksiz öğretim çizimleridir; atlas veya ders kitabı yerine geçmez. Bu sınırlar hub'da, sınav kurulumunda, soru alanı altında ve raporda açıkça yazar.

**Doğrulama.** 121 birim/içerik testi (yeni: `tests/quiz-engine.test.js` dört biçimin karıştırma ve puanlama davranışı, `tests/quiz-progress.test.js` kayıt temizleme/ustalık/zayıf konu/seri/kapsam rotası; güncellenen: `tests/quiz-bank.test.js` biçime göre kurallar ve ders kapsamı, `tests/quiz-i18n.test.js` 12 set/120 soru) ve 63 Playwright senaryosu (yeni: dört yanıt biçiminin koşucuda puanlanması, biten setin geçmişi yazıp ustalık haritasını doldurması, sınav simülasyonunun tam akışı, adreslenebilir kapsam, ders sayfasındaki quiz köprüsü, üç dilde merkez ve sınav) başarılı; üretim build'i geçti. Quiz bölümü hiçbir harici istek yapmaz; bu, senaryolarda istek dinlenerek doğrulanır.


## 21 Kasım 2026 (devam): şematik ders şekilleri gerçekçi anatomi plakalarına yükseltiliyor

**Bağlam.** Kullanıcı soru görsellerinin “uyduruk” görünmemesini, tüm figürlerin gerçek hali gibi çizilmesini istedi. Ders şekilleri (`public/diagrams/*.svg`) bugüne dek ilişkileri anlatan sade vektör şemalardı; quiz plakaları (`public/diagrams/quiz/*.svg`) ise zaten gömülü raster illüstrasyon taşıyordu. İstek, ders şekillerini de plaka kalitesine çıkarmak olarak alındı.

**Yapılanlar (1. dalga, 9 plaka).** `long-bone`, `growth-plate`, `synovial`, `joint-motion`, `foot-arch`, `spine`, `skull`, `cavities`, `planes` için gerçekçi anatomi illüstrasyonları çizildi, her biri tek tek ekranda doğrulandı ve 760×460 plaka oranına kırptı. `scripts/build-quiz-plates.py` genişletildi: kaynak PNG'yi plaka oranına kırparak JPEG sıkıştırmasıyla SVG'ye base64 gömer, numaralı pinleri (halka + kesikli lider + hedef nokta) kodda sabitlenen hedeflere çizer, `<title>/<desc>` efsanesini `src/content/diagrams.js` metninden üretir ve `src/content/diagramPins.js` hedeflerini plakayla eşitler (ResearchLens bindirmesi aynı koordinatları kullanır). `scripts/build-diagrams.mjs` artık `art-src/plated.json` bildirimindeki id'leri atlar; kaynak PNG'si olmayan çekimlerde quiz plakası döngüsü de hata vermek yerine mevcut committed plakayı korur.

**Doğrulama ve sınır.** `forearm` illüstrasyonu doğrulamada reddedildi (ekstra kemik/hatalı çaprazlama); bu id vektörde kaldı, sonraki dalgada yeniden çizilecek. Kalan 16 ders şekli ve 6 sınav haritası da sırayla plakalaşacak. `tests/enrichment.test.js` sözleşmesi bilinçli güncellendi: vektör şartı olan “`<image` yok” kuralı, yalnız kendi sanatını base64 data-URI olarak gömen plakalara izin verecek şekilde daraltıldı; `<script>`, `<foreignObject>` ve her türlü uzak `href` yasağı aynen sürer. Pin halkası sayısı etiket sayısına eşit kalır; 121 birim testi ve şekil senaryoları yeşil.

**Editoryal sınır.** Plakalar gerçekçi öğretim çizimleridir; ölçeksizdir, bağımsız uzman doğrulaması değildir ve atlas veya ders kitabı yerine geçmez. Bu sınır arayüzde ve bu belgede yazılı kalır.


## 21 Kasım 2026 (2. dalga): 7 plaka daha; üç çizim doğrulamada reddedildi

**Yapılanlar.** `muscle-bundle`, `antagonists`, `airways`, `diaphragm`, `neuron`, `spinal-roots`, `meninges` plakalaştı (toplam 16 plaka / 10 vektör). Her çizim ekranda tek tek doğrulandı: akciğerde sağ üç-sol iki lob ve kalp çentiği, diyaphragmada gevşek kubbe + kasılmış kubbe ve alçalma okları, omurilik enine kesitinde ganglionlu arka kök ve karma sinir dalları, meninkste dura–araknoid–subaraknoid–pia katman sırası pin hedefleriyle birebir eşleşti.

**Reddedilenler (vektörde kaldı, sıradaki dalgada yeniden çizilecek).** `forearm` ikinci denemede de panel başına iki yerine üç kemik üretti; `alveolus`ta O₂ ve CO₂ okları aynı yöne çizildi (gaz değişimi çift yönlüdür); `heart-flow`da pulmoner devre iki ayrı akciğer durağıyla çift halka olarak çıktı. Üçü de öğretim açısından yanıltıcı olduğundan plakalaştırılmadı.

**Doğrulama.** 121 birim testi yeşil; pin halkası sayısı her plakada etiket sayısına eşit; `diagramPins.js` hedefleri plakalarla eşitlendi (Mercek bindirmesi aynı koordinatları kullanır). Görsel üretim sınırının (tur başına 10) getirdiği dalga düzeni bu kayıtlarda izlenir.


## 21 Kasım 2026 (3. dalga): 9 plaka daha — ders şekillerinde son vektör forearm

**Plakalaşanlar (25/26).** `alveolus` (oklar artık çapraz ve karşıt yönlü: O₂ kana, CO₂ alveole), `heart-flow` (tek pulmoner + tek sistemik halka; venöz dönüş fizyolojik olarak mavi-gri), `aorta` (arkustan üç dal: brachiocephalicus → sağ çift, sol carotis, sol subclavia; descendens ve iliak çatallanma), `digestive-tract` (mide izleyicinin sağında, caecum-appendix sol altta, kolon çerçevesi tam), `tooth` (mine–dentin–pulpa–sement/apikal açıklık), `villus` (fırçamsı kenarlı epitel, kapiller ağ, santral lakteal), `portal` (mezenterik + splenik → portal ven → sinüzoidler → hepatik venler/cava), `uterus` (fimbria–over aralığı korunmuş koronal kesit), `male-path` (epididymis–deferens–seminal vesicle–prostat–urethra sürekliliği).

**forearm dördüncü kez reddedildi:** sol panelde yine üç kemik üredi. Sıradaki dalgada iki ayrı tek-konum görseli (yalnız supinasyon / yalnız pronasyon) üretilip kodda yan yana birleştirilecek; böylece kemik sayısı üretim değil kod garantisi olacak.

**Doğrulama.** Her çizim kırpılmış 760×460 görünümde tek tek incelendi; pin halkaları `plate-shots` ile canlı plakada doğrulandı (aorta ve male-path örnekleri bu girdide). 121 birim testi yeşil; `diagramPins.js` 25 plaka ile eşitli.


## 21 Kasım 2026 (4. ve son dalga): forearm çözüldü, 6 sınav haritası plakalaştı — %100 gerçekçi

**forearm.** Tek görselde kemik sayısını tutturamayan üretim yerine iki ayrı tek-konum illüstrasyonu (yalnız supinasyon / yalnız pronasyon, her biri kesin iki kemik) üretilip `PIL` ile yan yana birleştirildi; kemik sayısı artık kod garantisi. Pinler: radius, ulna, distal radius (pronasyon panelinde).

**Sınav haritaları.** `carpal-map` (8 karpal, palmar yerleşim), `distal-humerus` (ön/arka yüz + proksimal ulna insetsi), `cuff-map` (posterior+kostal scapula, başlangıç fossaları), `hyoid-map` (supra/infrahyoid gruplar + thyrohyoideus), `portal-map` (çift giriş–tek çıkış, hepatik arter dahil), `cortex-map` (central oluk, pre/postcentral bantlar, lateral sulkus) plakalaştı. Görüş alanı 760×480 sözleşmesi korundu.

**Kalıcılık düzeltmesi.** Plaka bildirimi (`plated.json`) git-yoksayılan `art-src/` içindeydi; taze checkout'ta vektöre geri dönüş riski vardı. Bildirimler artık sürümlenen `scripts/plated-lessons.json` ve `scripts/plated-exam.json`; üç üretici de bunları okuyor.

**Son durum.** 26/26 ders şekli + 6/6 sınav haritası + 7 quiz plakası = tüm görseller gerçekçi raster plaka. 121 birim testi yeşil (exam-teaching sözleşmesi plaka veri-URI'sine güncellendi), build 3.8 s.
