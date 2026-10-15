# Soru odaklı konu anlatımı — editoryal denetim

Tarih: 15 Ekim 2026. Bu sürüm yalnızca **Sitede oku** okuyucusunu genişletir. PDF katalog verileri, PDF okuyucu ve Drive üzerindeki orijinaller değiştirilmedi.

## Ne eklendi?

42 özgün ayrıntılı konu anlatımı, 42 gerekçeli yeni alıştırma ve 6 yerel SVG şema. Bunlar 119 ana bölümün ilgili yerlerine bağlanır; var olan anlatımın yerine soru listesi konulmaz. Her ek blok en az iki açıklama paragrafı ve bir karşılaştırma tablosu içerir. 26 önceki şemayla birlikte 32 öğretici şema vardır.

Konular tek başına puan garantisi değildir. Programatik testler; içerik yapısını, bağlantıları, kaynak kimliklerini ve arayüz davranışını doğrular. Anatomik uzman incelemesi veya gelecekteki bir sınavın bütün sorularını karşılama belgesi değildir.

## Kaynakların okunabilirliği ve kökeni

Drive klasörü: https://drive.google.com/drive/folders/17nZiCxGBHXv7JLyKg5aJCjG1BlTHEWPG

Ders notlarının 697 sayfalık editoryal metin arşivi `reference/course-content/` içindedir. Soru arşivindeki iki PDF metin olarak, üç taranmış PDF (39 + 26 + 25 sayfa) ve beş JPG görüntü olarak incelendi. Küçük/karalanmış satırların her biri kesin okunabildi diye bir iddia yoktur. Yerel indirilen orijinaller ve geçici görseller `.gitignore` altındadır; uygulamaya, Git’e veya production dizinine eklenmez.

| Anahtar | Dosya | İnceleme / sınır |
| --- | --- | --- |
| summary | [4_5765086940168718757.pdf](https://drive.google.com/file/d/1i9lAh-GHznoEF_-crWgznj5SINhUciN0/view) | Metin çıkarımı incelendi; şekil cevapları bağımsız cevap anahtarı sayılmadı. |
| sorular | [Anatomi sorular.pdf](https://drive.google.com/file/d/1hxdk5Y_fxwiJ_beFycoJ73tf7KVcJaiv/view) | Tam metin incelendi. Yinelenen, hatalı ve belirsiz cevaplar işaretlendi. |
| b | [anatomi (b).pdf](https://drive.google.com/file/d/1i66ISUHT5aDB3O09b8EM4AAUCPOC9Z7r/view) | Görüntü sayfaları incelendi. Bazı ekran görüntüleri Çankırı Karatekin Üniversitesi adını taşıyor; tamamı bu hocanın sınavı diye sunulmaz. |
| sinav | [anatomisinavv.pdf](https://drive.google.com/file/d/1hxw148anILz52OxgTbb9swXDW5UT7MYj/view) | Görüntü sayfaları incelendi. Sayfa 3teki çok sorulu fotoğrafın bazı satırları okunaksız; bu satırlardan kesin cevap üretilmedi. |
| vize | [ANATOMİ VİZE SINAV SORULARI.pdf](https://drive.google.com/file/d/1hoNSf02MBayHBouryknIwQfr6jxAs4WA/view) | Görüntüler incelendi; el yazısı işaretleri doğrulanmış cevap anahtarı kabul edilmedi. |
| final1 | [IMG-20240201-WA0000.jpg](https://drive.google.com/file/d/1ab1XseaIrDZpDcWgaF4vez3P5WSnZa_-/view) | Fotoğrafta okunabilen korteks, kranial sinir ve meninks konuları incelendi. Üzeri karalanmış / bulanık satırlar ve bazı ok hedefleri belirsiz. |
| final2 | [IMG-20240201-WA0001.jpg](https://drive.google.com/file/d/1abE3cZ24TO7AEEjR1z_HGyhpKnJM7jTU/view) | Okunabilen dil, jejunum, portal dolaşım, kolon, pankreas ve kıkırdak konuları incelendi; küçük damar numaralarının tümü kesin etiketlenmedi. |
| ornek5 | [IMG-20231106-WA0005.jpg](https://drive.google.com/file/d/1EcjRS6yuqb3tnaFOdhH0w2Q-zOZzgxy-/view) | İki eklemli kaslar, rectus femoris ve bacak kasları şekli incelendi. |
| ornek6 | [IMG-20231106-WA0006.jpg](https://drive.google.com/file/d/1EbhxXP19pzFKMLn3pc50wWSdZFiFQCnv/view) | Iliopsoas, levator scapulae ve rhomboid şekilleri incelendi. |
| ornek7 | [IMG-20231106-WA0007.jpg](https://drive.google.com/file/d/1EjleG11F47WhEDqE-Ysefb09ewh47XLO/view) | Subscapularis ve orbicularis kaslarının şekilleri incelendi. |

**Önemli:** Arşivde Çankırı Karatekin Üniversitesi adını taşıyan ekran görüntüleri bulunduğundan arşivin tamamı “hocanın geçmiş sınavları” olarak etiketlenmez. Resmî cevap anahtarı varmış gibi davranılmaz. Öğrenci işaretleriyle anatomik bilgi çatıştığında neden anlatılır. Tam okunamayan soru seçenekleri, ok uçları ve şekil numaraları uydurulmaz.

## Konu düzeyinde izlenebilirlik

Aşağıdaki ders sayfa aralığı mevcut ana bölümün konu aralığıdır; yeni paragrafın orijinal belgede birebir bulunduğu iddiası değildir. Soru dosyalarındaki sayfa/soru numarası açıklamanın hangi soru ailesine yanıt verdiğini gösterir. “Ders notundan tamamlayıcı” satırlarında doğrudan çıkmış soru eşleşmesi yapılmadı. Her yeni alıştırma proje için yazıldı.

| Ders | Ek konu | Dersin konu sayfa aralığı | Soru ailesi / dayanak |
| --- | --- | --- | --- |
| 1 | Bir soruda düzlem ile ekseni ayrı ayrı çözmek | 19–27 | vize: 7; sinav: 2 |
| 1 | Hareket çiziminde başlangıç konumu, yön ve özel ad | 28–36 | b: 24, 36 |
| 2 | Kemik sınıflamasında boyut değil biçim ve iç düzen | 5–13 | b: 34; sorular: Patella sorusu |
| 2 | Fossa, processus ve tuberositas: ad ile bulunduğu kemiği birlikte öğren | 14–18 | vize: 8; sinav: 14, 25 |
| 3 | Fibröz, kartilaginöz ve sinoviyal bağlantıyı doku üzerinden ayır | 8–15 | sorular: Syndesmosis ve sinoviyal eklem soruları; sinav: 16 |
| 3 | Aynı seçeneklerde geçen yedi eklem tipini ayırt etmek | 25–34 | vize: 1, 20, 22; b: 13, 18, 30, 31 |
| 3 | Dirsek kompleksi ile el bileğini birbirine karıştırmamak | 35–41 | sorular: Art. cubiti sorusu; vize: 1 |
| 3 | Kalça ve diz bağlarını tutundukları iki uçla tanımak | 42–48 | b: 1, 11, 14, 23; vize: 21 |
| 3 | Omurgada aynı anda üç farklı bağlantı düzeni | 49–53 | b: 2, 10, 19, 25–26, 29 |
| 4 | Scapulayı görünüş yönünden ve üç çıkıntısından tanımak | 6–9 | b: 3; ornek7: şekil tanıma |
| 4 | Distal humerusta yüz mü, çukur mu, çıkıntı mı? | 10–14 | vize: 3–4, 8; sinav: 14, 18 |
| 4 | Radius ve ulna: geniş uç, çentik ve doğrudan eklemleşme | 15–21 | vize: 9; sinav: 5 |
| 4 | Sekiz karpal kemiği bir şekle yeniden yerleştirmek | 22–27 | vize: 12; b: 27, 32 |
| 4 | Pelvis–femur–tibia zincirinde benzer adlı işaretler | 28–34 | vize: 8, 21; sorular: Linea terminalis sorusu; b: 6, 22 |
| 4 | Tarsal sıra ile ayak kemerini ayrı haritalarda düşün | 44–48 | vize: 24; b: 4, 8, 16, 35 |
| 5 | Sutura ve fontaneller: iki kemik adıyla yerini doğrula | 7–11, 38, 47 | vize: 6, 14; sinav: 11, 20; b: 21 |
| 5 | Kafatasında “hangi kemik?” ve “hangi görünüm?” ayrı sorulardır | 23–29, 37–47 | vize: 17, 25; sinav: 15, 24–25; b: 15, 20, 37 |
| 5 | Atlas–axis ilişkisi ve bölgesel vertebra tanıma | 55–61 | vize: 11, 13; sinav: 4, 7, 9 |
| 6 | Hareketi yapan, yardımcı olan ve sabitleyen kas aynı rol değildir | 15–17 | sorular: Sinerjist, kontraksiyon ve retinaculum soruları |
| 6 | Mimik ile çiğneme: bölgeleri yakın, motor sinirleri farklı | 29–34, 39–41 | sorular: Mimik, çiğneme, buccinator ve trigeminus soruları; ornek7: şekil tanıma |
| 6 | Suprahyoid–infrahyoid ayrımını eksiksiz kurmak | 35–38 | sorular: Suprahyoid ve infrahyoid tekrarları; vize: 16 |
| 6 | Scapula hareketi ile humerus hareketini ayrı söylemek | 42–47 | sorular: Scapula elevasyonu, erector spinae ve accessorius; ornek6: kas tanıma |
| 6 | Rotator cuff: dört kas, iki tüberkül ve üç sinir yolu | 56–62 | vize: 18, 23; sorular: Cuff ve teres minor soruları; ornek7: şekil tanıma |
| 6 | Önkol tabakaları, tenar–hipotenar ve elin ince hareketleri | 65–66 | sorular: Önkol yüzeyel tabaka ve tenar soruları |
| 6 | Kalça stabilitesi, dış rotatorler ve iliopsoas | 67–70 | vize: 10; sinav: 23; ornek6: iliopsoas şekli |
| 6 | Uylukta hangi kas iki eklemi çaprazlar? | 71–77 | ornek5: iki eklem ve bacak; vize: 15 |
| 6 | Ön, lateral ve arka bacak kompartmanlarını hareketle kur | 78–86 | vize: 10; sorular: Ayağın ekstansörü sorusu; ornek5: iki eklem ve bacak |
| 7 | Kalbin kendi venleri ile vena cavaları ayırmak | 18, 27–29 | vize: 2, 5; sinav: 6 |
| 7 | Damarın adı hangi sınırda değişir; nabız nerede düşünülür? | 30–37 | vize: 5, 19 |
| 8 | Dilde genel duyu, tat ve motor işlevi üç ayrı sütunda öğren | 29–35 | final2: 20 |
| 8 | Üç büyük tükürük bezini kanalın açıldığı yere göre tanı | 46–52 | final2: 20 |
| 8 | Jejunum–ileum ayrımı tek bir kıvrıma bakılarak yapılmaz | 102–111 | final2: 23 |
| 8 | Portal kanın karaciğere girişi ile hepatik venlerin çıkışını ayır | 136–137 | final2: 24 |
| 8 | Organların devamlılığı, periton ilişkisi ve özel komşulukları | 118–123 | final2: 17–18, 22 |
| 8 | Rectum ile anal kanalda kas, epitel ve venöz yol sınırları | 124–129 | final2: 18 |
| 9 | Beyin fotoğrafında sulcus centralis çevresini okumak | 27–32 | final1: 11 |
| 9 | Meninks sırası ile BOS boşluğunu aynı resimde yerleştirmek | 39–41 | final1: 13 |
| 9 | Kranial sinirlerde parasempatik, duyu ve motor bileşenler | 42–44 | final2: 14; sorular: Trigeminus ve accessorius soruları |
| 9 | Beyin sapını sagittal görünümde tanımak | 16–20 | final1: 8 |
| 9 | Thalamus, hypothalamus ve hipofiz aynı görevi yapmaz | 21–26 | Ders notundan tamamlayıcı |
| 10 | Üreme sisteminde yol, duvar ve destek ayrı başlıklardır | 24 | Ders notundan tamamlayıcı |
| 11 | Larynx kıkırdakları, gerçek ses kıvrımı ve diaphragma açıklıkları | 24–31 | final2: 16 |

## Bilinçli düzeltmeler

- Capitulum distal humerusta bulunur; processus coronoideus ulnadadır. Kaynak üzerindeki işaret bu bilgiyi tersine çeviremez.
- Dens, atlasın ön arkusunun arka yüzündeki fovea dentisle eklemleşir.
- Thyrohyoideus infrahyoid gruptadır. Teres minorun siniri axillaris; teres majorunki alt subscapular yoldur.
- Portal giriş ve hepatik venöz çıkış ayrı öğretilir. Filiform papillalarda tipik tat tomurcuğu yoktur.
- Jejunum ile ileumun arkad/vasa recta/Peyer plağı ayrımı birlikte açıklanır.
- Ana sinir dersi zaten kaynakta yanlış geçen 33 segmenti düzeltir: standart 31 segment ve 31 çift spinal sinir. PDF orijinali değiştirilmez.

## Şemalar

`scripts/build-exam-diagrams.mjs` ağ bağlantısı olmadan 6 özgün şemayı yeniden üretir: distal humerus, karpal yerleşim, rotator cuff, hyoid kas grupları, portal akış ve korteks yön haritası. Figürlerde şemanın yönü ve sınırları açıkça yazılıdır. Hyoid şeması bir sınıflama haritası, portal şema bir akış diyagramıdır; anatomik atlas görüntüsü gibi sunulmaz. Her SVG kendi title/desc etiketlerini ve metin anahtarını taşır. Mobilde yatay genişletme yalnız figürün kendi alanında gerçekleşir.

## Doğrulama

- İçerik testi: her ek bloğun gerçek bir ders ve bölüm kimliğine bağlı olması, bilinen dosya/sayfa sınırları, tablo boyutları, alıştırma seçenekleri, SVG varlığı.
- Tarayıcı testi: 42 açıklamanın ve 6 yeni şemanın gerçekten render edilmesi; hatalı/doğru yanıt gerekçesi, yeniden deneme, hedefe klavye odağı, yerel görseller, 320px / en büyük yazı boyutunda taşma olmaması.
- Okuma süresi yeni paragrafları, tabloları ve görsel açıklamalarını bir kez sayar; quiz arayüzü ve tekrarlanan kaynak notları süreyi yapay artırmaz.
- Orijinal PDF akışının mevcut testleri çalıştırılır; Sitede oku sayfalarında Drive/PDF talebi yapılmaz. Kaynak bağlantısına tıklamak kullanıcının bilinçli harici gezintisidir.
