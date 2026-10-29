export const PROFILE_URL = 'https://abs.firat.edu.tr/tr/bdagdeviren';
// Portrait URL published on the instructor's official ABS profile, checked 2026-10-14.
// Loaded only on the About page; no generated or unverified substitute is used.
export const INSTRUCTOR_PHOTO_URL = 'https://apiabs.firat.edu.tr/images/userProfilePicture/6771957e-d99c-4285-a146-5f646d594830.jpeg';
export const DRIVE_URL = 'https://drive.google.com/drive/folders/1iAuY6LhNDTXsT6exyIzJiojeB_CLaeSz';
export const categories = ['Tüm notlar', 'Temel anatomi', 'Hareket sistemi', 'Organ sistemleri', 'Kaynaklar'];
// Metadata from the instructor's linked Drive folder. Original PDFs are not copied.
export const notes = [
  { id: '15OxNPqApSUJ2-rnQoui2EVshH-MdM_IC', number: 1, title: 'Anatomiye Giriş', latin: 'Introductio ad anatomiam', category: 'Temel anatomi', description: 'İnsan anatomisine ilk adım. Temel kavramlar, anatomik duruş ve terminoloji.', art: 'body', color: 'rose', original: '1-Anatomiye-giriş-B.-D..pdf' },
  { id: '1EROXvatdJFgIuqLSAq1080PRIZYrmvgy', number: 2, title: 'Hareket Sistemi', latin: 'Systema locomotorium', category: 'Hareket sistemi', description: 'Vücudun destek ve hareket yapısını keşfedin.', art: 'bone', color: 'sand', original: '2. HAREKET SİSTEMİ B.D..pdf' },
  { id: '1EV_rNsXJJT_rJatlDwPG8s0q18WOvjnp', number: 3, title: 'Eklem Bilimi', latin: 'Arthrologia', category: 'Hareket sistemi', description: 'Kemikleri birleştiren eklemler ve hareketin anatomisi.', art: 'joint', color: 'sage', original: '3-Hem, Ebe, B.D. Arthrologia dersi.pdf' },
  { id: '1ETxzf8aYw6TPmqfZ86iAQasfAPCYAG9g', number: 4, title: 'Üst ve Alt Ekstremite Kemikleri', latin: 'Ossa membri superioris et inferioris', category: 'Hareket sistemi', description: 'Üst ve alt ekstremitelerin kemik yapıları.', art: 'bone', color: 'sand', original: '4-hem, ebe ÜST VE ALT EKST. Kemikler.pdf' },
  { id: '188CRP3E62PIJ1cP7cCmZFODIzTAiTJGL', number: 5, title: 'Kranium ve Vertebra Kemikleri', latin: 'Cranium et columna vertebralis', category: 'Hareket sistemi', description: 'Kafatası ve omurganın anatomik organizasyonu.', art: 'skull', color: 'lavender', original: '5-hem, ebe KRANİUM VE VERTEBRA kemikleri.pdf' },
  { id: '18C2JaGV5Wm7kXwMpgKm_lY7dU1PsOxRc', number: 6, title: 'Kas Bilimi', latin: 'Myologia', category: 'Hareket sistemi', description: 'Kas sisteminin yapısı ve vücuttaki yerleşimi.', art: 'muscle', color: 'rose', original: '6-Hem, Ebe, B.D. myologia dersi pdf.pdf' },
  { id: '185OzTu2BEO6gO-EQB1okCEuXNu7S9E-c', number: 7, title: 'Dolaşım Sistemi', latin: 'Systema cardiovasculare', category: 'Organ sistemleri', description: 'Kalp ve damarların oluşturduğu dolaşım ağı.', art: 'heart', color: 'rose', original: '7-DOLAŞIM SİSTEMİ B.D hem, ebe.pdf' },
  { id: '12hn9pwsNtznMtEz1aPRDrdnkhui9eDgR', number: 8, title: 'Sindirim Sistemi', latin: 'Systema digestorium', category: 'Organ sistemleri', description: 'Sindirim kanalının ve yardımcı organların anatomisi.', art: 'stomach', color: 'sand', original: '8-Sindirim Sistemi B.D..pdf' },
  { id: '1A11xUnKZUnLgplM0J961T96wLYMJ74_B', number: 9, title: 'Sinir Sistemi', latin: 'Systema nervosum', category: 'Organ sistemleri', description: 'Merkezi ve periferik sinir sisteminin yapısal temelleri.', art: 'brain', color: 'lavender', original: '9-Systema nervosum B.D..pdf' },
  { id: '1A5bZk8u6HiFIXukYCbnRizu3a8q_8lMI', number: 10, title: 'Ürogenital Sistem', latin: 'Systema urogenitale', category: 'Organ sistemleri', description: 'Erkek ve kadın üreme organlarının anatomisi.', art: 'reproductive', color: 'sage', original: '10-Ürogenital sistem anatomisi B.D..pdf' },
  { id: '1A3NHH_BjunRlYqAATPruig4wOadjD4_3', number: 11, title: 'Solunum Sistemi', latin: 'Systema respiratorium', category: 'Organ sistemleri', description: 'Solunum yolları ve akciğerlerin anatomik yapısı.', art: 'lungs', color: 'sage', original: '11-Systema. respiratorium (B.D ).pdf' },
  { id: '17uPVDSN1Q0Dl9_0kJa09S7f-WuRT1jhD', number: 0, title: 'Önerilen Atlaslar ve Kitaplar', latin: 'Bibliotheca anatomica', category: 'Kaynaklar', description: 'Anatomi öğrenimini desteklemek için önerilen kaynaklar.', art: 'book', color: 'sand', original: '0-Önerilebilir-atlaslar-ve-kitaplar.pdf' },
];
export const normalize = (text) => text.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
// Same filtering rules, but over any list of notes. The interface passes the
// language-specific note metadata (see content/localizedContent.js), so search works
// in Turkish, English and Arabic while the stored category keys stay stable.
export function filterNotesList(list, { query = '', category = 'Tüm notlar', savedOnly = false, saved = [], sort = 'course', locale = 'tr' } = {}) {
  const words = normalize(query.trim()).split(/\s+/);
  const result = list.filter(n => (category === 'Tüm notlar' || n.category === category) && (!savedOnly || saved.includes(n.id)) && words.every(word => normalize(`${n.title} ${n.latin} ${n.category} ${n.original}`).includes(word)));
  if (sort === 'az') result.sort((a,b) => a.title.localeCompare(b.title, locale));
  if (sort === 'reverse') result.reverse();
  return result;
}
export function filterNotes(options = {}) {
  return filterNotesList(notes, options);
}
