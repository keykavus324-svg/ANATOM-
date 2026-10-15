import { normalize } from './data.js';
export const QUIZ_SOURCE = { name: 'Free Anatomy Quiz', url: 'https://www.free-anatomy-quiz.com/' };
// Link metadata checked against the source category pages on 2026-10-15.
// Question text, answer keys, images and scripts remain on the publisher's site.
export const quizCategories = [
  { id: 'general', title: 'Temel anatomi', description: 'Düzlemler, yönler, hareketler ve temel kavramlar.', source: 'generalterminology.html', lesson: 1, art: 'book' },
  { id: 'skeleton', title: 'İskelet sistemi', description: 'Kemikleri, eklemleri ve bölgesel iskeleti tanı.', source: 'skeletalsystem.html', lesson: 2, art: 'bone' },
  { id: 'muscles', title: 'Kas sistemi', description: 'Kasların yerleri, işlevleri, başlangıç ve tutunma noktaları.', source: 'muscularsystem.html', lesson: 6, art: 'muscle' },
  { id: 'organs', title: 'Organ sistemleri', description: 'İç organlar, dolaşım, solunum ve diğer sistemler.', source: 'internalorgans.html', lesson: 7, art: 'heart' },
  { id: 'surface', title: 'Yüzey anatomisi', description: 'Vücut bölgeleri ve yüzeydeki anatomik işaretler.', source: 'surfaceanatomy.html', lesson: 1, art: 'torso' },
  { id: 'senses', title: 'Duyu organları', description: 'Gözün ve kulağın anatomik yapılarını keşfet.', source: 'senses.html', lesson: null, art: 'eye' },
  { id: 'brain', title: 'Beyin', description: 'Beyin bölgeleri ve serebral korteks.', source: 'brain.html', lesson: 9, art: 'brain' },
];
const entries = [];
function add(category, topic, paths, kind = 'Anatomi', lesson) {
  const parent = quizCategories.find(c => c.id === category);
  paths.split(' ').forEach((path, index, all) => entries.push({
    id: path, category, topic, title: `${topic}${all.length > 1 ? ` · Quiz ${index + 1}` : ''}`,
    url: `${QUIZ_SOURCE.url}${path}.html`, kind, lesson: lesson === undefined ? parent.lesson : lesson,
    sourcePage: `${QUIZ_SOURCE.url}${parent.source}`, language: 'en',
  }));
}
add('general', 'Anatomik düzlemler ve yönler', 'generalterminology1 generalterminology2');
add('general', 'Vücut hareketleri', 'general-movements-1');
add('general', 'Eklemler', 'joints-q1 joints-q2', 'Anatomi', 3);
add('general', 'Genel anatomi bilgisi', 'general1 general2 general3');
add('general', 'Hücre anatomisi', 'generalcell1 generalcell2');
add('general', 'Deri yapısı', 'integumentary2IDQs1');
add('general', 'Kemik anatomisi', 'generalbones1 generalbones2 generalbones3 generalbones4 generalbones5', 'Anatomi', 2);
add('general', 'Kas anatomisi', 'genmus1 genmus2 genmus3', 'Anatomi', 6);
add('general', 'Tıbbi terim kökleri', 'roots1 roots2 roots3 roots21');
add('skeleton', 'İskelet · önden görünüm', 'skeletonIDQ1 skeletonIDQ2 skeletonIDQ3');
add('skeleton', 'İskelet · arkadan görünüm', 'skeletonIDQ4 skeletonIDQ42');
add('skeleton', 'İskelet · yandan görünüm', 'skeletonIDQ5 skeletonIDQ52');
add('skeleton', 'Aksiyal iskelet · önden', 'axialskeletonIDQ1');
add('skeleton', 'Aksiyal iskelet · yandan', 'axialskeletonIDQ2');
add('skeleton', 'Kafatası', 'skullIDQ1', 'Anatomi', 5);
add('skeleton', 'Omurga', 'spineidq1', 'Anatomi', 5);
add('skeleton', 'Lomber omur', 'vertebraIDQ1', 'Anatomi', 5);
add('skeleton', 'Dişler', 'dental_q1');
add('skeleton', 'Appendiküler iskelet', 'appendicularskeletonIDQ1 appendicularskeletonIDQ2', 'Anatomi', 4);
add('skeleton', 'El kemikleri', 'handandfootbonesIDQ1', 'Anatomi', 4);
add('skeleton', 'Pelvis kemikleri', 'pelvisIDQ1', 'Anatomi', 4);
add('skeleton', 'Ayak kemikleri', 'handandfootbonesIDQ2', 'Anatomi', 4);
add('skeleton', 'El ve ayak kemikleri', 'handandfootbonesIDQ3', 'Anatomi', 4);
add('skeleton', 'Kemik yapısı', 'bones1 bones2 bones3 bones4 bones5');
add('muscles', 'Vücut kasları · önden', 'bodymusclesIDQ1 bodymusclesIDQ2');
add('muscles', 'Vücut kasları · arkadan', 'bodymusclesIDQ3');
add('muscles', 'Vücut kasları · yandan', 'bodymusclesIDQ4 bodymusclesIDQ5');
add('muscles', 'Yüz kasları', 'head_face_musclesIDQ1 head_face_musclesIDQ2');
add('muscles', 'Baş ve boyun · kas yerleri', 'headmusclesIDQ1 headmusclesIDQ2 headmusclesIDQ3');
add('muscles', 'Baş ve boyun · kas işlevleri', 'headmusclesact1 headmusclesact2 headmusclesact3');
add('muscles', 'Baş ve boyun · origo ve insertio', 'headneckoriginsQs1 headneckoriginsQs2 headneckoriginsQs3');
add('muscles', 'Gövde kasları · önden', 'torsoIDQ1 torsoIDQ2');
add('muscles', 'Gövde kasları · arkadan', 'torsoIDQ3 torsoIDQ4');
add('muscles', 'Gövde · kas işlevleri', 'torsoactionIDQs1 torsoactionIDQs2 torsoactionIDQs3 torsoactionIDQs4 torsoactionIDQs5 torsoactionIDQs6');
add('muscles', 'Gövde · origo ve insertio', 'torsooriginsIDQs1 torsooriginsIDQs2 torsooriginsIDQs3');
add('muscles', 'Üst ekstremite · kas yerleri', 'upperlimbIDQ1 upperlimbIDQ2 upperlimbIDQ3');
add('muscles', 'Üst ekstremite · kas işlevleri', 'upperlimbactions1 upperlimbactions2 upperlimbactions3 upperlimbactions4');
add('muscles', 'Üst ekstremite · origo ve insertio', 'upperlimborigins1 upperlimborigins2');
add('muscles', 'Alt ekstremite kasları · önden', 'lowerlimbIDQ1 lowerlimbIDQ2');
add('muscles', 'Alt ekstremite kasları · arkadan', 'lowerlimbIDQ3 lowerlimbIDQ4');
add('muscles', 'Alt ekstremite · kas işlevleri', 'lowerlimbactions1 lowerlimbactions2 lowerlimbactions3 lowerlimbactions4');
add('muscles', 'Alt ekstremite · origo ve insertio', 'lowerlimborigins1 lowerlimborigins2 lowerlimborigins3');
add('organs', 'İç organların yerleri', 'InternalIDQs1 InternalIDQs2 InternalIDQs3');
add('organs', 'Kalbin yapısı', 'heartQs1 heartQs2 heartQs3');
add('organs', 'Kalp ve damar anatomisi', 'circulatoryQs1');
add('organs', 'Dolaşım fizyolojisi', 'circulatoryPQs1', 'Fizyoloji');
add('organs', 'Dolaşım hastalıkları', 'circulatoryDisQs1', 'Patoloji');
add('organs', 'Sindirim anatomisi', 'DigestiveQs1', 'Anatomi', 8);
add('organs', 'Sindirim fizyolojisi', 'digestivePQs1', 'Fizyoloji', 8);
add('organs', 'Sindirim hastalıkları', 'digestiveDisQs1', 'Patoloji', 8);
add('organs', 'Endokrin anatomi', 'endocrineQs1', 'Anatomi', null);
add('organs', 'Endokrin fizyoloji', 'endocrinePQs1', 'Fizyoloji', null);
add('organs', 'Deri anatomisi', 'integumentaryIDQs1', 'Anatomi', 1);
add('organs', 'Deri fizyolojisi', 'integumentaryPQs1', 'Fizyoloji', 1);
add('organs', 'Lenfatik anatomi', 'lymphatic_Qs1');
add('organs', 'Lenfatik fizyoloji', 'lymphatic_pQs1', 'Fizyoloji');
add('organs', 'Sinir sistemi anatomisi', 'nervoussysQs1', 'Anatomi', 9);
add('organs', 'Sinir sistemi fizyolojisi', 'nervouspQs1', 'Fizyoloji', 9);
add('organs', 'Kadın üreme anatomisi', 'femalereproductive1 femalereproductive2', 'Anatomi', 10);
add('organs', 'Erkek üreme anatomisi', 'malereproductive1 malereproductive2', 'Anatomi', 10);
add('organs', 'Üreme fizyolojisi', 'reproductivePQs1 reproductivePQs2', 'Fizyoloji', 10);
add('organs', 'Gebelik', 'reproductivePregQs1 reproductivePregQs2', 'Fizyoloji', 10);
add('organs', 'Kadın üreme sistemi hastalıkları', 'reproductivefemaledisQs1 reproductivefemaledisQs2', 'Patoloji', 10);
add('organs', 'Erkek üreme sistemi hastalıkları', 'reproductivemaledisQs1 reproductivemaledisQs2', 'Patoloji', 10);
add('organs', 'Solunum anatomisi', 'RespiratoryQs1', 'Anatomi', 11);
add('organs', 'Solunum fizyolojisi', 'respirationp1', 'Fizyoloji', 11);
add('organs', 'Solunum hastalıkları', 'respiratoryDisQs1', 'Patoloji', 11);
// No standalone urinary lesson exists in this course; link to the general library instead.
add('organs', 'Üriner anatomi', 'urinary1', 'Anatomi', null);
add('organs', 'Üriner fizyoloji', 'urinaryPQs1', 'Fizyoloji', null);
add('surface', 'Karın yüzeyi', 'surfacetorso1 surfacetorso2 surfacetorso3');
add('surface', 'Gövde yüzeyi · önden', 'surfacetorso21 surfacetorso22 surfacetorso23');
add('surface', 'Gövde yüzeyi · arkadan', 'surfacetorso31 surfacetorso32 surfacetorso33');
add('surface', 'Baş ve boyun yüzeyi', 'surfacehead1 surfacehead2 surfacehead3');
add('surface', 'Kol yüzeyi', 'surfacearm1 surfacearm2 surfacearm3');
add('surface', 'Bacak yüzeyi', 'surfaceleg1 surfaceleg2 surfaceleg3');
add('senses', 'Kulak anatomisi', 'ear1 ear2 ear3');
add('senses', 'Göz anatomisi', 'eye1 eye2 eye3');
add('brain', 'Beynin ana bölgeleri', 'brain1');
add('brain', 'Serebral korteks', 'brain2');
export const externalQuizzes = entries;
export const findExternalQuiz = id => externalQuizzes.find(q => q.id === id) || null;
export function filterExternalQuizzes({ query = '', category = 'all', kind = 'all', savedOnly = false, saved = [] } = {}) {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return externalQuizzes.filter(q => (category === 'all' || q.category === category) && (kind === 'all' || q.kind === kind) && (!savedOnly || saved.includes(q.id)) && words.every(word => normalize(`${q.title} ${q.kind} ${quizCategories.find(c => c.id === q.category).title}`).includes(word)));
}
export function validQuizIds(value) {
  return Array.isArray(value) ? [...new Set(value.filter(id => typeof id === 'string' && findExternalQuiz(id)))] : [];
}
