# Yerel Anatomi Quizleri ve Sınav Simülasyonu

## Rotasyon ve rotalar

- Quiz merkezi: `#/quizler`; sabit detay rotası: `#/quizler/<set-id>` (ör. `#/quizler/sindirim`).
- Sınav simülasyonu: `#/sinav`. Kapsam adreste taşınır ve paylaşılabilir: `#/sinav` (tüm setlerden karışık kâğıt), `#/sinav?k=weak` (zayıf konu kâğıdı), `#/sinav?k=<set-id>` (tek setlik zamanlı kâğıt). Bilinmeyen bir anahtar karışık kâğıda düşer, boş ekran açmaz.
- Menüde iki ayrı giriş vardır: **Anatomi Quizleri** ve **Sınav Simülasyonu**. Ana sayfadaki quiz şeridi ikisini de sunar.
- Ders anlatımı sayfası (`#/ders/<no>`) tekrar sorularının hemen altında bir köprü taşır: o derse bağlı set(ler) kapak şekli, soru sayısı, şekilli soru sayısı ve mevcut ustalığıyla listelenir; “Adım adım çöz” `#/quizler/<set-id>` rotasına, “Sınav modunda çöz” `#/sinav?k=<set-id>` rotasına gider. Seti olmayan derslerde (kaynak rehberi, ders 0) köprü çizilmez.

## Soru bankası

- `src/content/quizBank.js`: **12 konu seti × 10 soru = 120 özgün soru.** Sorular, seçenekler ve açıklamalar bu proje için yazıldı; yayıncı soru metni, görseli veya cevap anahtarı kullanılmaz.
- Setler ders kütüphanesine bağlıdır: `temel` (1), `hareket` (2), `eklem` (3), `ekstremite` (4), `iskelet` (5), `kas` (6), `dolasim` (7), `sindirim` (8), `sinir` (9), `urogenital` (10), `solunum` (11) ve ders numarası olmayan `duyu` (duyu organları). Böylece 1–11 arasındaki her ders en az bir setle kapsanır.
- Katalog grupları (`quizCategories`): Temel anatomi (1 set), Hareket sistemi (5 set), Organ sistemleri (6 set). Her setin kategorisi bağlı olduğu dersin kategorisiyle aynıdır; `duyu` Organ sistemleri içinde durur.
- **Dört yanıt biçimi:** 104 çoktan seçmeli (`choice`, 4 seçenek, tek doğru), 5 doğru/yanlış (`truefalse`, sabit `Doğru`/`Yanlış` etiketleri), 5 çoklu seçim (`multi`, en az 2 doğru, hepsi birden istenir), 6 sıralama (`order`, seçenekler kaynak sırasındadır ve karıştırılarak sorulur; sıra konuma göre puanlanır). Yeni beş setin her birinde birer doğru/yanlış, çoklu seçim ve sıralama sorusu vardır.
- 86 soru şekillidir; 30 ayrı şekil kullanılır: 24'ü ders şemalarından, 6'sı quiz plakalarından (vertebra, sarcomere, heart, eye, ear, brain). Yedinci plaka (nephron) çizilmiş ve üç dile çevrilmiş olarak durur; ürogenital set kaynak derste üreme anatomisini işlediği için bu bankada henüz bir soruya bağlanmaz.

## Şekiller

- `src/content/quizDiagrams.js` (meta) + `scripts/build-quiz-diagrams.mjs` ve `scripts/build-quiz-plates.py` (geometri/plaka) → `public/diagrams/quiz/*.svg`. Yedi plaka (vertebra, sarcomere, heart, nephron, eye, ear, brain) projeye ait öğretim çizimleridir; ölçeksizdir ve ders şekilleriyle aynı kâğıt/pin dilini kullanır.
- Ders şekilleri (`public/diagrams/*.svg`) iki katmandan oluşur: gözden geçirilmiş gerçekçi anatomi plakaları (kaynak illüstrasyon `art-src/<id>.png`, SVG içine base64 gömülü; `scripts/build-quiz-plates.py` üretir, pin hedefleri aynı dosyada kodla sabitlenir ve `src/content/diagramPins.js` eşitlenir) ve henüz plakalaşmamış ilişki şemaları (`scripts/build-diagrams.mjs` vektör). Hangi id'lerin plaka olduğu `art-src/plated.json` bildiriminde durur; vektör üreteci bu id'leri yeniden yazmaz.
- Soru şekilleri `figureSrc()` ile çözülür: önce `diagrams/quiz/<id>.svg`, yoksa `diagrams/<id>.svg`. Dosya adları diller arasında aynı kalır; yalnız meta veri (başlık, görünüş, alt yazı, etiketler) çevrilir.

## Motor

- `src/quiz.js` saf fonksiyonlardan oluşur ve rastgelelik kaynağı dışarıdan verilebilir: `questionType`, `shuffle`, `buildQuestion`, `buildAttempt`, `pickBalanced`, `isAnswerCorrect`, `isAnswered`, `answerText`, `correctText`, `gradeAttempt`, `gradeBySet`, `examSeconds`, `formatClock`.
- Doğru/yanlış sorularında iki etiketin yeri asla değişmez. Sıralama sorularında seçenekler karıştırılır ve `correct`, kaynak sırasını ekranda yeniden kuran konum listesi olur. Çoklu seçimde ve sıralamada puanlama hep-ya-hiçtir; sıralamada konum duyarlıdır.
- Sınav kâğıdı `pickBalanced` ile set set dengeli çekilir: kısa bir kâğıt bile tek sete yığılmaz. Süre `examSeconds(n) = n × 45` saniyedir; kâğıt uzunlukları 10, 20, 30.
- Testler tohumlanmış rastgelelik kaynağıyla determinizmi doğrular.

## Çalışma kaydı (ustalık haritası)

- `src/quizProgress.js` saf hesaptır, depolamaya dokunmaz; `src/useQuizProgress.js` aynı hesabı `anatomi-quiz-history-v1` anahtarında tutar (en fazla 80 deneme, en yeni başta). Kayıt bozuksa alan alan onarılır veya düşürülür; `NaN` üreten bir değer ustalık çubuklarına ulaşmaz.
- Ustalık bir set için son deneme ile en iyi denemenin karışımıdır: `round((0.6 × son + 0.4 × en iyi) × 100)`. Böylece tek kötü deneme öğrenilmiş bir konuyu silmez, tek şanslı deneme de konuyu “öğrenildi” saymaz.
- Merkezdeki panel: genel ustalık halkası, çözülen set / yanıtlanan soru / doğru oranı / çalışma serisi, son denemelerin doğruluk seyri, çalışman gereken konular (doğruluk < %85 ve en az 2 soru kanıtı), en düşük ustalıklı setler, başlanmamış setler ve geçmişi temizleme.
- Set kartlarında küçük ustalık halkası ve deneme sayısı görünür; çözülmeyen set “Henüz çözülmedi” der.
- Sınav raporunda puan halkası, set set ve konu konu doğruluk çubukları, kalan/harcanan süre, boş sayısı, “bundan sonra” listesi (zayıf konudan ilgili sete ve dersi anlatan web dersine bağlantı) ve soru soru döküm vardır. Sınav sürerken doğru yanıt gösterilmez; süre biterse kâğıt kendiliğinden teslim edilir, boş bırakırken onay sorulur.

## Ortak arayüz parçaları

- `src/components/QuizQuestion.jsx`: `QuizFigure` (büyütme + numaralı etiket anahtarı), `QuestionInput` (dört yanıt biçiminin girişi), `ScoreRing`, `MeterBars`. Quiz koşucusu ile sınav simülasyonu aynı parçaları kullanır; çözülmüş kâğıt ile alıştırma aynı görünür.

## Çok dillilik

- Set başlıkları/açıklamaları/anahtar kelimeleri ve 120 sorunun tamamı (konu, soru metni, seçenekler, açıklama) İngilizce ve Arapça olarak `src/content/quizBank/i18n/{en,ar}.js` içinde durur ve yalnız ilgili dil seçildiğinde yüklenir.
- Çeviri, Türkçe aslın yapısını bozamaz: aynı soru sayısı, aynı seçenek sayısı, aynı `correct`, aynı `type` ve aynı `figure`; metinler ise gerçekten farklı olmak zorundadır. Arapçada soru metni ve seçenekler `dir="auto"` ile yazılır, belge yönü `rtl` olur.

## Depolama ve dürüstlük sınırları

- Yalnız cihazda tutulan anahtarlar: `anatomi-quiz-saved` (favoriler), `anatomi-quiz-studied` (“çalıştım” işaretleri), `anatomi-quiz-last` (son açılan quiz), `anatomi-quiz-history-v1` (deneme geçmişi). Depolama kapalıysa uyarı gösterilir, oturum içinde çalışma sürer; sunucuya kayıt gönderilmez, hesap ve eşitleme yoktur.
- Harici Free Anatomy Quiz gömmesi bu bölümden kaldırıldı: yayıncı motoru `top.location` ile üst pencereyi yeniden yüklediğinden gömülü pencerede soru ilerlemesi tarayıcı tarafından engelleniyordu (kök neden analizi git geçmişindeki 182f4d9 işlemindedir). Hiçbir yayıncı isteği artık bu bölümden yapılmaz.
- Öğrenciye karşı iddia sınırı: sorular hocanın sınav sorusu veya resmî banka değildir; şemalar atlas/ders kitabı yerine geçmez; sınav simülasyonu resmî sınav, gözetim veya not değildir; ustalık haritası kişisel çalışma izlenimidir ve gerçek sınav notunu garanti etmez. Bu sınır arayüzde, sınav kurulumunda ve soru alanı altında yazar.

## Doğrulama

- `tests/quiz-bank.test.js`: 12 set × 10 soru, tekil ID, biçime göre seçenek/doğru kuralları, açıklama uzunluğu, ders ve kategori eşlemesi, her dersin kapsanması, biçim dağılımı, şekil SVG'lerinin diskte varlığı ve pin/etiket tutarlılığı, deterministik karıştırma, konu bazlı puanlama, rota dönüşleri.
- `tests/quiz-engine.test.js`: dört biçimin karıştırma ve puanlama davranışı (doğru/yanlış etiketleri sabit, çoklu seçim küme olarak ve hep-ya-hiç, sıralama konuma duyarlı ve kaynak sırasını geri verir), dengeli çekim, boş yanıtlar, saat biçimi.
- `tests/quiz-progress.test.js`: kayıt temizleme/onarma, 80 deneme sınırı, set puanlarının karışık sınavdan beslenmesi, ustalık karışımı, kapsam/zayıf konu/zayıf set sıralaması, çalışma serisi, deneme kaydının üretimi ve sınav kapsamının adreste taşınması.
- `tests/quiz-i18n.test.js`: EN/AR bankasının 12 seti ve 120 soruyu kapsadığı, yapı alanlarının aynı, metin alanlarının farklı olduğu.
- Tarayıcı senaryoları (`tests/browser.spec.js`, 63 senaryo): katalog (12 kart, kategori filtresi, arama, favoriler + yeniden yükleme), tam çevrimdışı çözüm akışı, dört yanıt biçiminin koşucuda puanlanması ve dökümde adlandırılması, biten setin geçmişi yazması ve ustalık haritasını doldurması (yeniden yükleme + temizleme), sınav simülasyonu (kurulum → zamanlı kâğıt → yanıt gizliliği → paleti/Alt+ok → boş onayı → rapor → harici istek yok → 320 px), adreslenebilir kapsam ve bayat anahtar, ders sayfasındaki quiz köprüsü, üç dilde merkez ve sınav.
