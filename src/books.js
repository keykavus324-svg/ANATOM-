import { normalize } from './data.js';

// Kitap rafı: "Anatomy - Anatomi" Drive klasöründeki alt klasörlerden (Türkçe / English)
// elle derlenmiştir ve 15 Ekim 2026 tarihinde listelenerek doğrulanmıştır.
// PDF’ler depoya kopyalanmaz; Google Drive önizlemesi üzerinden gösterilir.
export const BOOKS_FOLDER_URL = 'https://drive.google.com/drive/folders/1JYjritmTvYAvn4POpWy6IP8LnISvTRFu';

export const bookLanguages = [
  { id: 'all', label: 'Tüm diller' },
  { id: 'tr', label: 'Türkçe' },
  { id: 'en', label: 'İngilizce' },
];
export const bookKinds = ['Tüm konular', 'Atlaslar', 'Ders kitapları', 'Nöroanatomi', 'Pratik ve klinik', 'Özet ve sözlük'];

// lang: 'tr' = Türkçe klasörü, 'en' = English klasörü. original = Drive’daki dosya adı.
export const books = [
  // English klasörü (24)
  { id: '1eL2SUDoLL22GSMBnDT3CJ_gSAsfL0N_r', title: 'Sobotta Atlas of Human Anatomy', detail: '14. baskı · Cilt 2', lang: 'en', kind: 'Atlaslar', original: 'Sobotta Atlas of Human Anatomy (14th Ed - Volume 2).pdf' },
  { id: '1lk-goxLm0SXWOJed6j6itgaca_exLyIr', title: 'Sobotta Atlas of Human Anatomy', detail: '14. baskı · Cilt 1', lang: 'en', kind: 'Atlaslar', original: 'Sobotta Atlas of Human Anatomy (14th Ed - Volume 1).pdf' },
  { id: '1hBaXF0Ul37Z1g187pt4z6s3yaEK17auB', title: 'Sobotta Atlas of Anatomy', detail: '15. baskı', lang: 'en', kind: 'Atlaslar', original: 'Sobotta Atlas of Anatomy 15th edition.pdf' },
  { id: '1ni2TLsovmMehZ315HVt25-hT902wPb2x', title: "McMinn's and Abrahams' Clinical Atlas of Human Anatomy", detail: '7. baskı', lang: 'en', kind: 'Atlaslar', original: "McMinn's and Abrahams' Clinical Atlas of Human Anatomy, 7th Edition.pdf" },
  { id: '1dzRs01u6pIy_gEmSBc_uuRww_fziefND', title: 'Anatomy: A Photographic Atlas', detail: '', lang: 'en', kind: 'Atlaslar', original: 'Anatomy - a Photographic Atlas .pdf' },
  { id: '1Pwkm0ezddzkFhvm-6DS5oPhFBnS0BHv7', title: 'The Netter Collection of Medical Illustrations: Respiratory System', detail: 'Cilt 3', lang: 'en', kind: 'Atlaslar', original: 'The Netter Collection of Medical Illustrations Respiratory System Volume 3.pdf' },
  { id: '1pZ6dIpHvaKwAsShQoWl5yT39eJ7JhH5-', title: 'Atlas of Human Anatomy (Netter)', detail: '6. baskı', lang: 'en', kind: 'Atlaslar', original: 'Atlas of Human Anatomy, 6th Edition- Frank H. Netter, M.D.pdf' },
  { id: '1FMl6OtVLEFl7DWLEhctT3bPoDS4Vp7td', title: "Gray's Atlas of Anatomy", detail: '2. baskı', lang: 'en', kind: 'Atlaslar', original: 'Grays Atlas of Anatomy 2nd Edition.pdf' },
  { id: '1AlgpDDCVW574v2t1dBPO6P-sZq33ieZ4', title: 'BD Human Anatomy: Upper Limb and Thorax', detail: 'Cilt 1', lang: 'en', kind: 'Ders kitapları', original: 'BD Human Anatomy - Upper Limb and Thorax (Volume 1).pdf' },
  { id: '1lCWhNpNpZV5w2k5q7O_nwGUL2RhuUC7X', title: 'BD Human Anatomy: Lower Limb, Abdomen and Pelvis', detail: 'Cilt 2', lang: 'en', kind: 'Ders kitapları', original: 'BD Human Anatomy - Lower Limb, Abdomen and Pelvis (Volume 2).pdf' },
  { id: '1nRjNTsyMgilEdzxSY6rTKBl0FnT6Gm0z', title: 'BD Human Anatomy: Head, Neck and Brain', detail: 'Cilt 3', lang: 'en', kind: 'Ders kitapları', original: 'BD Human Anatomy - Head, Neck and Brain (Volume 3).pdf' },
  { id: '1cphi15trcLAXU7o733URPJYAzl3HyGJ4', title: "BD Chaurasia's Handbook of General Anatomy", detail: '4. baskı', lang: 'en', kind: 'Özet ve sözlük', original: "BD Chaurasia's Handbook of General Anatomy, 4th Edition.pdf" },
  { id: '1KruVm5MFLOVUfbm6pQDD70OShHE4Va91', title: "Gray's Anatomy: The Anatomical Basis of Clinical Practice", detail: '41. baskı', lang: 'en', kind: 'Ders kitapları', original: 'Grays Anatomy-The Anatomical Basis of Clinical Practice -41 E.pdf' },
  { id: '1oRN1IhhCS6LKRER6C5yh5liHKEvbfXwH', title: "Gray's Anatomy", detail: '40. baskı', lang: 'en', kind: 'Ders kitapları', original: "Gray's Anatomy - 40th Ed.pdf" },
  { id: '1Us2SHHn012eUKap4-fGqY4M3-H8Lwps8', title: "Moore's Clinically Oriented Anatomy", detail: '7. baskı', lang: 'en', kind: 'Ders kitapları', original: "Moore's Clinically Oriented Anatomy 7E.pdf" },
  { id: '1IQSbdutH3rJt2aXaSVMLVjm-5z0LlduA', title: 'The Big Picture: Gross Anatomy', detail: '2011', lang: 'en', kind: 'Özet ve sözlük', original: 'The Big Picture - Gross Anatomy (2011).pdf' },
  { id: '13eBM7EO0kIjOnaoc7w60gdUftGlRC-26', title: 'Appleton & Lange Review of Anatomy', detail: '6. baskı', lang: 'en', kind: 'Özet ve sözlük', original: 'Appleton & Lange Review of Anatomy, 6th Ed .pdf' },
  { id: '1CcnycIHQoG0FTyIiIrpY0vcCskggrTlA', title: 'BRS Pelvis', detail: '', lang: 'en', kind: 'Özet ve sözlük', original: 'BRS Pelvis.pdf' },
  { id: '1Lj7w2QxTuB9Lqc1IgA3zEBdaKx-97x2c', title: 'Clinical Neuroanatomy', detail: '7. baskı', lang: 'en', kind: 'Nöroanatomi', original: 'Clinical Neuroanatomy (7th Ed.).pdf' },
  { id: '1uADYQYBuweaoDhZn0BUSijPrv9GorNE4', title: 'Neuroanatomy and Neuroscience at a Glance', detail: '', lang: 'en', kind: 'Nöroanatomi', original: 'Neuroanatomy and Neuroscience at a Glance.pdf' },
  { id: '1i2uSOxNIxlYE5iBiwYj25OUoi7Z03lN8', title: "Cunningham's Manual of Practical Anatomy", detail: '', lang: 'en', kind: 'Pratik ve klinik', original: "Cunningham's Manual Of Practical Anatomy .pdf" },
  { id: '1UM_ErV6sT3C37JXmmgbBHdLkGpqW0QPD', title: 'Clinical Anatomy: Applied Anatomy for Students and Junior Doctors', detail: '11. baskı', lang: 'en', kind: 'Pratik ve klinik', original: 'Clinical Anatomy Applied Anatomy for Students and Junior Doctors (11th Edition) .pdf' },
  { id: '1SzoaPonxSIp3zqlhpwrreGu3ySD_bJ0R', title: "Clemente's Anatomy Dissector", detail: '3. baskı', lang: 'en', kind: 'Pratik ve klinik', original: "Clemente's Anatomy Dissector (3rd Ed) .pdf" },
  { id: '1KqLpeEH4WJ-3JrPGXy-zGkUmGaaXlfxN', title: 'Epicteto Dictionary of Medical Eponymous', detail: 'Tıbbi eponim sözlüğü', lang: 'en', kind: 'Özet ve sözlük', original: 'Epicteto Dictionary of Medical Eponymous.pdf' },
  // Türkçe klasörü (10 dosya + "Prometheus Anatomi Atlası" alt klasörü 3 dosya)
  { id: '15DS42fWXLQgtk3vuxFGWLLHC5IeEh3N_', title: 'Netter İnsan Anatomisi Atlası', detail: '', lang: 'tr', kind: 'Atlaslar', original: 'Netter İnsan Anatomisi Atlası .pdf' },
  { id: '1xx_6__oQbwpwtro8kAmrhSCawriD9j6o', title: 'Anatomi', detail: '1. Cilt', lang: 'tr', kind: 'Ders kitapları', original: 'Anatomi - 1. Cilt .pdf' },
  { id: '1xIqXhkagO5h_g-HGejGTRV6fFRRKHoiR', title: 'Sobotta İnsan Anatomisi Atlası', detail: '1. Cilt', lang: 'tr', kind: 'Atlaslar', original: 'Sobotta - İnsan Anatomisi Atlası (1. Cilt) .pdf' },
  { id: '1tPXDlMShDbRy0vHJGZ1En6yUICVxVU3p', title: 'Sobotta İnsan Anatomisi Atlası', detail: '2. Cilt', lang: 'tr', kind: 'Atlaslar', original: 'Sobotta - İnsan Anatomisi Atlası (2. Cilt) .pdf' },
  { id: '1pNlklnJVADNpruqTYb8vt_jeWAhc2Ftz', title: 'Fonksiyonel Nöroanatomi', detail: '', lang: 'tr', kind: 'Nöroanatomi', original: 'Fonksiyonel Nöroanatomi.pdf' },
  { id: '1utsC5ER1kB77fLKts2XpriZw87dw0wNI', title: 'Kadavra Atlası', detail: '', lang: 'tr', kind: 'Atlaslar', original: 'Kadavra Atlası .pdf' },
  { id: '1xyYyQSd7mr8GoHK3DJ4_2mOnwBZfV16D', title: 'Anatomi', detail: '2. Cilt', lang: 'tr', kind: 'Ders kitapları', original: 'Anatomi - 2. Cilt .pdf' },
  { id: '1g5RNWa7eMdKULkw8-BVVHrDSs8JdprT7', title: 'Klinik Nöroanatomi', detail: '', lang: 'tr', kind: 'Nöroanatomi', original: 'Klinik Nöroanatomi.pdf' },
  { id: '1krMtvAxAaYzOZxvb825Tayx4wDef1iAX', title: 'Netter Nöroanatomi Atlası', detail: '', lang: 'tr', kind: 'Nöroanatomi', original: 'Netter Nöroanatomi Atlası.pdf' },
  { id: '1iJOhbWciCtXH7AUP5OWCB5WuFg0p6UTI', title: 'Anatomi Atlası', detail: 'SMT 2010', lang: 'tr', kind: 'Atlaslar', original: 'Anatomi Atlası SMT 2010.pdf' },
  { id: '1qH199TeB0WJCyVwckNpioh_OVM55_iXw', title: 'Prometheus Anatomi Atlası', detail: 'Kısım 1', lang: 'tr', kind: 'Atlaslar', original: 'Prometheus 1.pdf' },
  { id: '1FOqdIn4n9hMvizWQJrt26ik1w6kSErZ_', title: 'Prometheus Anatomi Atlası', detail: 'Kısım 2', lang: 'tr', kind: 'Atlaslar', original: 'Prometheus 2.pdf' },
  { id: '14QhVRro5G89mgSzFZedfyIiQs7bUf8bR', title: 'Prometheus Anatomi Atlası', detail: 'Kısım 3', lang: 'tr', kind: 'Atlaslar', original: 'Prometheus 3.pdf' },
];

export const languageLabel = lang => (bookLanguages.find(l => l.id === lang)?.label ?? lang);

// Arama Türkçe karakter ve büyük/küçük harf farkını yok sayar (data.js ile aynı normalizasyon).
export function filterBooks({ query = '', language = 'all', kind = 'Tüm konular' } = {}) {
  const words = normalize(query.trim()).split(/\s+/).filter(Boolean);
  return books.filter(book =>
    (language === 'all' || book.lang === language) &&
    (kind === 'Tüm konular' || book.kind === kind) &&
    words.every(word => normalize(`${book.title} ${book.detail} ${book.kind} ${languageLabel(book.lang)} ${book.original}`).includes(word)));
}
