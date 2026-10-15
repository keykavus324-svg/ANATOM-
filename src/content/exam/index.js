import foundations from './foundations.js';
import bones from './bones.js';
import muscles from './muscles.js';
import organs from './organs.js';

export const examSources = {
  summary: { name: '4_5765086940168718757.pdf', id: '1i9lAh-GHznoEF_-crWgznj5SINhUciN0', review: 'Metin çıkarımı incelendi; şekil cevapları bağımsız cevap anahtarı sayılmadı.' },
  sorular: { name: 'Anatomi sorular.pdf', id: '1hxdk5Y_fxwiJ_beFycoJ73tf7KVcJaiv', review: 'Tam metin incelendi. Yinelenen, hatalı ve belirsiz cevaplar işaretlendi.' },
  b: { name: 'anatomi (b).pdf', id: '1i66ISUHT5aDB3O09b8EM4AAUCPOC9Z7r', pages: 39, review: 'Görüntü sayfaları incelendi. Bazı ekran görüntüleri Çankırı Karatekin Üniversitesi adını taşıyor; tamamı bu hocanın sınavı diye sunulmaz.' },
  sinav: { name: 'anatomisinavv.pdf', id: '1hxw148anILz52OxgTbb9swXDW5UT7MYj', pages: 26, review: 'Görüntü sayfaları incelendi. Sayfa 3teki çok sorulu fotoğrafın bazı satırları okunaksız; bu satırlardan kesin cevap üretilmedi.' },
  vize: { name: 'ANATOMİ VİZE SINAV SORULARI.pdf', id: '1hoNSf02MBayHBouryknIwQfr6jxAs4WA', pages: 25, review: 'Görüntüler incelendi; el yazısı işaretleri doğrulanmış cevap anahtarı kabul edilmedi.' },
  final1: { name: 'IMG-20240201-WA0000.jpg', id: '1ab1XseaIrDZpDcWgaF4vez3P5WSnZa_-', review: 'Fotoğrafta okunabilen korteks, kranial sinir ve meninks konuları incelendi. Üzeri karalanmış / bulanık satırlar ve bazı ok hedefleri belirsiz.' },
  final2: { name: 'IMG-20240201-WA0001.jpg', id: '1abE3cZ24TO7AEEjR1z_HGyhpKnJM7jTU', review: 'Okunabilen dil, jejunum, portal dolaşım, kolon, pankreas ve kıkırdak konuları incelendi; küçük damar numaralarının tümü kesin etiketlenmedi.' },
  ornek5: { name: 'IMG-20231106-WA0005.jpg', id: '1EcjRS6yuqb3tnaFOdhH0w2Q-zOZzgxy-', review: 'İki eklemli kaslar, rectus femoris ve bacak kasları şekli incelendi.' },
  ornek6: { name: 'IMG-20231106-WA0006.jpg', id: '1EbhxXP19pzFKMLn3pc50wWSdZFiFQCnv', review: 'Iliopsoas, levator scapulae ve rhomboid şekilleri incelendi.' },
  ornek7: { name: 'IMG-20231106-WA0007.jpg', id: '1EjleG11F47WhEDqE-Ysefb09ewh47XLO', review: 'Subscapularis ve orbicularis kaslarının şekilleri incelendi.' },
};
export const examTeaching = [...foundations, ...bones, ...muscles, ...organs];
export const teachingForLesson = number => examTeaching.filter(item => item.lesson === Number(number));
export const teachingForSection = (number, section) => teachingForLesson(number).filter(item => item.section === section);
// Editorial record only. It is not a numeric guarantee of exam coverage or a grade.
export const examReviewDate = '15 Ekim 2026';
