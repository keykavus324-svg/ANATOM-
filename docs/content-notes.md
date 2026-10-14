# Web çalışma notlarının kapsamı ve yayın kontrolü

## Son sürüm: 697 sayfanın tamamının aktarımı

İlk özet çalışmasının ardından, “konu anlatımları eksiksiz olsun” isteği üzerine 12 PDF’nin tamamı yerelde indirildi ve PyMuPDF ile **bütün sayfalar** işlendi. Güncel web görünümü varsayılan olarak “Kaynağın tamamı” seçeneğini açar. İlk turdaki özetler yalnızca ayrı “Hızlı tekrar” seçeneğinde kullanılır.

- Kaynak rehberi: 7; anatomiye giriş: 55; hareket sistemi: 69; arthrologia: 58; ekstremite kemikleri: 49; kranium/vertebra: 67; myologia: 86; dolaşım: 51; sindirim: 138; sinir sistemi: 44; ürogenital: 31; solunum: 42 sayfa. **Toplam 697.**
- Her sayfanın metin katmanı tam olarak çıkarılır; her sayfanın özgün renkleri ve etiketleri korunan görüntüsü de sunulur. Metin katmanı olmayan sayfalar atlanmaz, görsel olarak gösterilir.
- Her kayıt gerçek kaynak sayfa numarasına bağlıdır. Dosya SHA-256 özetleri ve sayfa sayıları `src/courseManifest.json` içinde kaydedilir.
- Yazı çıkarımı otomatik olduğundan dizilim, karakter ve tablo hatası ihtimali vardır. Görseldeki yazılar OCR yapılmadığından metin aramasına dahil değildir. Görsel büyütme ile kaynaktan okunabilirler.
- Tüm kaynak sayfalarının dahil olması, metinlerin tıbbi açıdan yeniden doğrulandığı anlamına gelmez. Ham kaynak içeriğindeki hatalar aktarımda da bulunabilir; öğretim elemanı denetimi gerekir. Hızlı tekrardaki editoryal düzeltmeler tam kaynak metnine sessizce uygulanmamıştır.
- Ham PDF dosyaları git tarafından yok sayılan `google_drive/` içinde tutulur. Metinler ve özgün sayfa görselleri kullanıcı isteği doğrultusunda web çıktısına eklenmiştir; yayında Drive izinlerinden bağımsız erişilebilir olur.

## İlk turdaki hızlı tekrar özetlerinin kökeni

14 Ekim 2026 tarihinde kullanıcı tarafından paylaşılan Drive klasörünün 12 dosyasındaki metinler Google Drive `read_file_text` aracıyla okundu. Metinler birebir kopyalanmış tam ders dökümleri olarak değil, seçilmiş konuların yeniden düzenlenmiş öğrenci çalışma özetleri olarak işlendi. Kaynak sahibi Öğr. Gör. Bekir Dağdeviren, web düzenlemesi ise ANATOMİ öğrenci projesi olarak ayrı belirtilir.

Sayfa numarası eşlemesi elde edilmedi. Bu nedenle web bölümlerinde yalnızca okunan kaynak başlıkları kullanılır; sayfa numarası uydurulmaz. PDF içindeki resimlerin metin çıkarımında yer almaması, görsel anlatımların tam aktarımını engeller.

## Yalnızca hızlı tekrar özetleri için ilk okuma sınırları

| Ders | Okunan metin | Web kapsamı |
|---|---|---|
| 0 — Kaynak rehberi | Metin çıkarımı tamamlandı | Girişteki öneri yaklaşımı, Sobotta, Netter, Mehmet Yıldırım, Kaplan Arıncı ve kurumsal iletişim |
| 1 — Anatomiye giriş | Çıkarım başarılı; araç yanıtının orta kısmı sunumda kısaltıldı | Görülebilen tanım, dallar, duruş, düzlemler, eksenler, yön ve hareket terimleri |
| 2 — Hareket sistemi | Metin çıkarımı tamamlandı | Temel bileşenler, kemik görev/yapı/tipleri, yüzey terimleri ve genel iskelet haritası |
| 3 — Arthrologia | Metin çıkarımı tamamlandı | Sınıflama, sinoviyal yapı, eklem tipleri ve seçilmiş bölgesel örnekler |
| 4 — Ekstremite kemikleri | Metin çıkarımı tamamlandı | Omuz/kalça kuşakları, kol/önkol, uyluk/bacak, el ve ayak |
| 5 — Kranium ve vertebra | Metin çıkarımı tamamlandı | Neurocranium, yüz iskeleti, omurga, tipik/özel vertebralar, göğüs iskeleti |
| 6 — Myologia | İlk 10.000 karakter okundu, devamı kısaltıldı | Temel kas yapısı ve işlevi ile seçilmiş baş–boyun kasları; tüm bölgesel kaslar kapsanmaz |
| 7 — Dolaşım | İlk 8.500 karakter okundu, devamı kısaltıldı | Görevler, kalp, boşluklar, kapaklar, büyük damarlar, tabakalar, koroner dolaşım ve lenfe giriş |
| 8 — Sindirim | İlk 9.000 karakter okundu, devamı kısaltıldı | Genel kanal haritası ve ağız, damak, diş, dil, büyük tükürük bezleri; distal organ ayrıntıları kapsanmaz |
| 9 — Sinir sistemi | İlk 9.000 karakter okundu, devamı kısaltıldı | Temel hücreler/yollar, sınıflandırma, beyin sapı, beyincik, diencephalon ve serebral loblara giriş |
| 10 — Ürogenital | Metin çıkarımı tamamlandı | Dosyanın çıkarılan metni üreme organlarını içerir; ayrı üriner/böbrek anlatımı varsayılmaz |
| 11 — Solunum | Metin çıkarımı tamamlandı | İç/dış solunum, burun/sinüs, yutak/gırtlak, trachea/bronşlar, akciğerler ve diaphragma |

“Çıkarım tamamlandı” ifadesi bütün slaytların görsel içeriğinin incelendiği veya web sayfasına eksiksiz aktarıldığı anlamına gelmez. Tüm web sayfaları, kapsam kutularında belirtildiği gibi özet niteliğindedir.

## Editoryal yaklaşım

- Tekrarlanan slayt başlıkları birleştirildi; yazım ve okunabilirlik için metin yeniden düzenlendi.
- Tekrar soruları bu proje için yazıldı; hocanın sınav soruları olduğu iddia edilmez.
- Kaynaklarda görülebilen bariz terminoloji karışıklıkları web metninde yeniden üretilmedi. Örneğin pharynx “yutak”, larynx “gırtlak” olarak ayrılır; arter/ven tanımı akım yönüne göre verilir.
- Ürogenital kaynak metnindeki hymen üzerinden cinsel geçmişe ilişkin genelleme web özetine aktarılmadı. Klinik değerlendirme ve kişiye özel tıbbi öneri verilmez.
- Web metni ve tekrar cevapları henüz dersin öğretim görevlisi tarafından doğrulanmış/onaylanmış olarak sunulmaz.

## Görseller

Ana sayfadaki mevcut göğüs kafesi görseli stil referansı olarak kullanıldı. Dokuz ayrı yeni konu görseli üretildi: iskelet, diz, kafatası, kol kasları, kalp, sindirim organları, beyin, üreme organları, akciğerler.

Bunlar yapay zekâ ile üretilmiş **dekoratif, temsili kapak illüstrasyonlarıdır**. Etiketli anatomik diyagram veya uzman denetiminden geçmiş atlas görüntüsü değildir; yapı, oran ve bağlantılarda hata içerebilir. Her web notunda bu durum görünür biçimde belirtilir. Görseller hocanın PDF’sinden alınmamıştır. Eğitimde doğru etiketli PDF/atlas çizimlerinin yerini almamalıdır.

## Kalıcı yayın öncesi

1. Hocadan hem PDF bağlantıları hem web özetleri için paylaşım ve düzenleme onayı alın.
2. Her web notunu kaynak PDF ve güncel, güvenilir atlasla karşılaştırarak öğretim elemanı denetiminden geçirin.
3. Tam aktarımın sayfa eşlemelerini kontrol edin. Hızlı tekrar özetleri genişletilecekse eklenen anlatımları kaynak ve güncel atlaslarla tek tek doğrulayın.
4. Kaynak görsellerin birebir kullanımı istenirse üçüncü taraf atlas/telif haklarını ayrıca kontrol edin.
5. Gizli tarayıcıyla PDF erişimini kontrol edin; web özetlerinin statik yayın sonrasında Drive izinlerinden bağımsız erişilebilir olduğunu unutmayın.
6. Hak sahibi kaldırma talep ederse ilgili web metnini ve PDF bağlantısını kaldırıp yeniden derleyin/yayımlayın.
