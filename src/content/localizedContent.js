import { atlasSceneIn } from './atlasI18n.js';

// Localised metadata for the course notes and 3D atlas scenes.
// Only titles, short descriptions and navigation labels are translated here;
// the authored lesson bodies (src/content/lessons/*) stay in Turkish, and the
// interface states that explicitly when another language is selected.

export const noteTranslations = {
  0: {
    en: { title: 'Recommended atlases and books', description: 'Resources recommended to support anatomy learning.' },
    ar: { title: 'الأطالس والكتب الموصى بها', description: 'مصادر موصى بها لدعم تعلّم التشريح.' },
  },
  1: {
    en: { title: 'Introduction to anatomy', description: 'The first step into human anatomy: core concepts, the anatomical position and terminology.' },
    ar: { title: 'مقدمة في علم التشريح', description: 'الخطوة الأولى في تشريح الإنسان: المفاهيم الأساسية والوضع التشريحي والمصطلحات.' },
  },
  2: {
    en: { title: 'Locomotor system', description: 'The supporting and moving structures of the body.' },
    ar: { title: 'الجهاز الحركي', description: 'بنى الدعم والحركة في الجسم.' },
  },
  3: {
    en: { title: 'Arthrology', description: 'The joints that connect bones and the anatomy of movement.' },
    ar: { title: 'علم المفاصل', description: 'المفاصل التي تربط العظام وتشريح الحركة.' },
  },
  4: {
    en: { title: 'Bones of the upper and lower limbs', description: 'The bony structure of the upper and lower limbs.' },
    ar: { title: 'عظام الطرفين العلوي والسفلي', description: 'البنية العظمية للطرفين العلوي والسفلي.' },
  },
  5: {
    en: { title: 'Skull and vertebral bones', description: 'Anatomical organisation of the skull and the vertebral column.' },
    ar: { title: 'عظام الجمجمة والفقار', description: 'التنظيم التشريحي للجمجمة والعمود الفقري.' },
  },
  6: {
    en: { title: 'Myology', description: 'The structure of the muscular system and its distribution in the body.' },
    ar: { title: 'علم العضلات', description: 'بنية الجهاز العضلي وتوزّعه في الجسم.' },
  },
  7: {
    en: { title: 'Cardiovascular system', description: 'The circulatory network formed by the heart and the vessels.' },
    ar: { title: 'الجهاز القلبي الوعائي', description: 'شبكة الدوران التي يشكّلها القلب والأوعية.' },
  },
  8: {
    en: { title: 'Digestive system', description: 'Anatomy of the digestive tract and its accessory organs.' },
    ar: { title: 'الجهاز الهضمي', description: 'تشريح القناة الهضمية والأعضاء الملحقة بها.' },
  },
  9: {
    en: { title: 'Nervous system', description: 'Structural foundations of the central and peripheral nervous systems.' },
    ar: { title: 'الجهاز العصبي', description: 'الأسس البنيوية للجهاز العصبي المركزي والمحيطي.' },
  },
  10: {
    en: { title: 'Urogenital system', description: 'Anatomy of the male and female reproductive organs.' },
    ar: { title: 'الجهاز البولي التناسلي', description: 'تشريح الأعضاء التناسلية عند الرجل والمرأة.' },
  },
  11: {
    en: { title: 'Respiratory system', description: 'The anatomical structure of the airways and the lungs.' },
    ar: { title: 'الجهاز التنفسي', description: 'البنية التشريحية للمجاري التنفسية والرئتين.' },
  },
};

export const categorySlugs = {
  'Tüm notlar': 'all',
  'Temel anatomi': 'basic',
  'Hareket sistemi': 'locomotor',
  'Organ sistemleri': 'organs',
  Kaynaklar: 'resources',
};

export { atlasSceneTitles } from './atlas/titles.js';

export function localizedNote(note, lang) {
  const translated = noteTranslations[note.number]?.[lang];
  return translated ? { ...note, title: translated.title, description: translated.description } : note;
}

export function localizedNotes(notes, lang) {
  return lang === 'tr' ? notes : notes.map(note => localizedNote(note, lang));
}

export function localizedScene(scene, lang) {
  if (!scene) return scene;
  // atlasSceneIn already replaces title, summary, observe and steps in one step.
  return atlasSceneIn(lang, scene);
}


const categoryNames = {
  en: { all: 'All notes', basic: 'Basic anatomy', locomotor: 'Locomotor system', organs: 'Organ systems', resources: 'Resources' },
  ar: { all: 'كل المحاضرات', basic: 'التشريح الأساسي', locomotor: 'الجهاز الحركي', organs: 'أجهزة الجسم', resources: 'المصادر' },
};

// Category keys stay in Turkish internally (saved filters, localStorage); only the
// displayed label changes with the interface language.
export function localizedCategory(value, lang) {
  const slug = categorySlugs[value];
  if (!slug || lang === 'tr') return value;
  return categoryNames[lang]?.[slug] || value;
}
