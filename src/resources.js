// Instructor material and open resources.
//
// Licensed textbooks and atlases (Netter, Gray’s, Sobotta, Moore, BD Chaurasia,
// Clemente, McMinn …) were removed from the site: they are copyrighted works and
// cannot be redistributed. Nothing copyrighted is hosted here — only links to the
// rights holders’ own publications and openly licensed material.
export const arabicNote = {
  id: '1syfu-piLHAh3dPNlnqRuB2q3GfmURTu6',
  title: {
    tr: 'Ders Notları — Arapça Çeviri',
    en: 'Course Notes — Arabic Translation',
    ar: 'محاضرات المقرر — الترجمة العربية',
  },
  latin: 'Notae anatomicae — versio arabica',
  description: {
    tr: 'Hocamızın ders notlarının Arapça çevirisi. Aynı içerik, Arapça okuyan öğrenciler için.',
    en: 'The Arabic translation of our lecturer’s course notes. Same content, for Arabic-speaking students.',
    ar: 'الترجمة العربية لمحاضرات محاضرنا. المحتوى نفسه، للطلاب الناطقين بالعربية.',
  },
  access: 'Google Drive',
};

export const arabicNotePreviewUrl = note => `https://drive.google.com/file/d/${note.id}/preview`;
export const arabicNoteViewUrl = note => `https://drive.google.com/file/d/${note.id}/view`;

// Openly licensed or freely readable resources. Every entry links out; nothing is
// copied, re-hosted or converted. `licence` is shown exactly as the source states.
export const openResources = [
  {
    id: 'openstax-ap',
    title: 'OpenStax — Anatomy and Physiology 2e',
    provider: 'OpenStax (Rice University)',
    url: 'https://openstax.org/details/books/anatomy-and-physiology-2e',
    licence: 'CC BY 4.0',
    note: {
      tr: 'Ücretsiz, açık lisanslı ders kitabı. Anatomi ve fizyolojiyi birlikte anlatan 28 bölüm.',
      en: 'A free, openly licensed textbook: 28 chapters covering anatomy and physiology together.',
      ar: 'كتاب مجاني مفتوح الترخيص: 28 فصلًا يجمع بين التشريح والفيزيولوجيا.',
    },
  },
  {
    id: 'openstax-ap-lab',
    title: 'OpenStax — Anatomy and Physiology Laboratory Manual',
    provider: 'OpenStax (Rice University)',
    url: 'https://openstax.org/details/books/anatomy-and-physiology-2e',
    licence: 'CC BY 4.0',
    note: {
      tr: 'Aynı kitabın laboratuvar eşlikçisi; pratik dersleri ve gözlem listeleri için.',
      en: 'The laboratory companion to the same textbook, useful for practical sessions and observation lists.',
      ar: 'المرافق العملي للكتاب نفسه، مفيد للدروس العملية وقوائم الملاحظة.',
    },
  },
  {
    id: 'wikimedia-anatomy',
    title: 'Wikimedia Commons — Human anatomy',
    provider: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/Category:Human_anatomy',
    licence: 'CC BY-SA / public domain (her dosyada ayrı)',
    note: {
      tr: 'Ders sunumlarına eklenebilecek, lisansı dosya bazında belirtilmiş anatomik görseller.',
      en: 'Anatomical images you can add to presentations, each with its licence stated per file.',
      ar: 'صور تشريحية يمكن إضافتها إلى العروض، مع بيان ترخيص كل ملف على حدة.',
    },
  },
  {
    id: 'grays-1918',
    title: 'Gray’s Anatomy (1918) — public domain',
    provider: 'Bartleby',
    url: 'https://www.bartleby.com/lit/medical/anatomy-of-the-human-body',
    licence: 'Public domain',
    note: {
      tr: 'Telif süresi dolmuş tarihî baskı. Güncel klinik bilgi için değil, terminoloji ve klasik çizimler için.',
      en: 'A historic edition whose copyright has expired. Use it for terminology and classic illustrations, not current clinical guidance.',
      ar: 'طبعة تاريخية انتهت مدة حقوقها. تُستخدم للمصطلحات والرسوم الكلاسيكية لا للمعلومات السريرية الحديثة.',
    },
  },
  {
    id: 'teachmeanatomy',
    title: 'TeachMeAnatomy',
    provider: 'TeachMeSeries',
    url: 'https://teachmeanatomy.info/',
    licence: 'Ücretsiz erişim (telifli)',
    note: {
      tr: 'Ücretsiz okunabilen konu anlatımları. İçerik teliflidir; kopyalanamaz, yalnızca bağlantı verilir.',
      en: 'Free-to-read topic articles. The content is copyrighted: it may not be copied, only linked.',
      ar: 'مقالات مجانية القراءة. المحتوى محمي بحقوق النشر ولا يجوز نسخه، ويُشار إليه بالرابط فقط.',
    },
  },
  {
    id: 'kenhub-library',
    title: 'Kenhub — Free anatomy articles',
    provider: 'Kenhub',
    url: 'https://www.kenhub.com/en/library',
    licence: 'Ücretsiz makaleler (telifli)',
    note: {
      tr: 'Latince terimler ve yapı ilişkileri için kısa, ücretsiz makaleler.',
      en: 'Short free articles on Latin terminology and structural relationships.',
      ar: 'مقالات قصيرة مجانية عن المصطلحات اللاتينية وعلاقات البنى.',
    },
  },
];

// Licence labels are short Turkish phrases in the data. Other languages get their own
// wording here, keyed by the Turkish value so the data shape stays unchanged.
const licenceLabels = {
  'CC BY-SA / public domain (her dosyada ayrı)': {
    en: 'CC BY-SA / public domain (licence stated per file)',
    ar: 'CC BY-SA / ملك عام (يُذكر الترخيص لكل ملف)',
  },
  'Public domain': { en: 'Public domain', ar: 'ملك عام' },
  'Ücretsiz erişim (telifli)': { en: 'Free access (copyrighted)', ar: 'وصول مجاني (محمي بحقوق النشر)' },
  'Ücretsiz makaleler (telifli)': { en: 'Free articles (copyrighted)', ar: 'مقالات مجانية (محمية بحقوق النشر)' },
};

export function licenceIn(lang, value) {
  return licenceLabels[value]?.[lang] || value;
}
