import { findQuizSet } from './content/quizBank.js';
import { notes } from './data.js';
const paths = { home: '/', sections: '/kesit/v1', lens: '/mercek', planner: '/ders-planlayici', library: '/kutuphane', videos: '/videolar', exam: '/sinav', sources: '/kaynaklar', atlas: '/atlas', practice: '/calis', quizzes: '/quizler', saved: '/kaydedilenler', review: '/tekrar', community: '/topluluk', about: '/hakkinda' };
// Licensed book/atlas collections were removed; old links land on the resource page.
const legacyPaths = { '/kitaplar': 'sources' };

// The exam simulator is shareable: `#/sinav?k=weak` drills the weak topics and
// `#/sinav?k=<set-id>` runs one set as a timed paper. Unknown keys fall back to the
// mixed exam over every set, so a stale link never opens an empty page.
export function parseExamScope(search = '') {
  const key = new URLSearchParams(search).get('k') || '';
  if (key === 'weak') return { scope: 'weak', setId: null, key };
  if (findQuizSet(key)) return { scope: 'set', setId: key, key };
  return { scope: 'all', setId: null, key: '' };
}

export function routeFromHash(hash) {
  const path = hash.replace(/^#/, '');
  const [bare, search = ''] = path.split('?');
  if (bare === paths.sections) return { page: 'sections', lesson: null, quiz: null, exam: null };
  if (bare === paths.lens) return { page: 'lens', lesson: null, quiz: null, exam: null };
  if (bare === paths.exam) return { page: 'exam', lesson: null, quiz: null, exam: parseExamScope(search) };
  const quizMatch = /^\/quizler(?:\/([\w-]+))?$/.exec(path);
  if (quizMatch) return { page: 'quizzes', lesson: null, quiz: findQuizSet(quizMatch[1]) || null, exam: null };
  const lessonMatch = /^\/ders\/(\d+)(?:\/([\w-]+))?$/.exec(path);
  if (lessonMatch) {
    const lesson = notes.find(note => note.number === Number(lessonMatch[1]));
    if (lesson) return { page: 'lesson', lesson, quiz: null, exam: null, ...(lessonMatch[2] ? { section: lessonMatch[2] } : {}) };
  }
  // Older atlas links carried a scene id (/atlas/<id>); they all open the single atlas page now.
  if (/^\/atlas(?:\/[\w-]+)?$/.test(path)) return { page: 'atlas', lesson: null, quiz: null, exam: null };
  const page = Object.keys(paths).find(key => paths[key] === path) || legacyPaths[path] || 'home';
  return { page, lesson: null, quiz: null, exam: null };
}
export const pageHash = page => `#${paths[page] || '/'}`;
export const lessonHash = note => `#/ders/${note.number}`;

export const quizHash = quiz => `#/quizler/${quiz.id}`;
// Scope key for a mixed exam (''), the weak-topic drill ('weak') or one set id.
export const examHash = key => (key ? `#/sinav?k=${encodeURIComponent(key)}` : '#/sinav');
