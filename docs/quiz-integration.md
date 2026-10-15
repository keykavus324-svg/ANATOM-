# Yerel Anatomi Quizleri

- Giriş: `#/quizler`; sabit detay rotası: `#/quizler/<set-id>` (ör. `#/quizler/dolasim`).
- Soru bankası: `src/content/quizBank.js`. 7 konu seti × 10 soru = 70 özgün, Türkçe soru. Sorular ve açıklamalar bu proje için yazıldı; yayıncı soru metni, görseli veya cevap anahtarı kullanılmaz.
- Şekiller: `src/content/quizDiagrams.js` (meta) + `scripts/build-quiz-diagrams.mjs` (geometri) → `public/diagrams/quiz/*.svg`. 7 yeni şekil (vertebra, sarcomere, heart, nephron, eye, ear, brain) projeye ait sadeleştirilmiş öğretim çizimleridir; ölçeksizdir, ders şekilleriyle aynı kâğıt/pin dilini kullanır. 56 soru; 26 mevcut ders şekli de sorularda yeniden kullanılır (toplam 56 soru şekillidir).
- Motor: `src/quiz.js` — saf fonksiyonlar (`shuffle`, `buildAttempt`, `gradeAttempt`). Her denemede soru sırası ve seçenek sırası karışır; testler tohumlanmış rastgelelik kaynakıyla determinizmi doğrular.
- Akış: giriş (kapak şekli + ders bağlantısı) → kontrol edilmiş ilerleme (her yanıtta doğru yanıt + açıklama) → sonuç (puan + soru soru döküm). Zamanlayıcı ve tekrar defteri “Kendini sına” bölümünde bırakıldı; iki bölüm birbirinin kopyası değildir.
- Favoriler ve “çalıştım” işaretleri `anatomi-quiz-saved` / `anatomi-quiz-studied` anahtarlarında tutulur; ID doğrulaması ve depolama yokluğuna tolerans korunur. Son açılan quiz `anatomi-quiz-last` ile “son açtığın quiz” şeridini doldurur.
- Harici Free Anatomy Quiz gömmesi bu bölümden kaldırıldı: yayıncı motoru `top.location` ile üst pencereyi yeniden yüklediğinden gömülü pencerede soru ilerlemesi tarayıcı tarafından engelleniyordu (kök neden analizi git geçmişindeki 182f4d9 işlemindedir). Hiçbir yayıncı isteği artık bu bölümden yapılmaz.
- Öğrenciye karşı iddia sınırı: sorular hocanın sınav sorusu veya resmî banka değildir; şemalar atlas/ders kitabı yerine geçmez; başarı gerçek sınav notunu garanti etmez (arayüzde ve soru alanı altında yazar).

## Doğrulama

- Birim testler (`tests/quiz-bank.test.js`): set/soru sayıları, tekil ID, 4 seçenek, tek doğru, açıklama uzunluğu, ders eşlemesi, şekil SVG'lerinin diskte varlığı ve pin/etiket sayı tutarlılığı, deterministik karıştırma, konu bazlı puanlama, rota dönüşleri.
- Tarayıcı senaryoları: katalog (7 kart, arama, favoriler + yeniden yükleme), tam çevrimdışı çözüm akışı (giriş → 10 kontrol → sonuç → yeniden), tercihler/son quiz/geri tuşu/ders bağlantısı, boş durum ve 320 px taşma, bozuk/kapalı depolama, şekil büyütme.
