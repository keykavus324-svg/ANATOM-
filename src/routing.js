import { findQuizSet } from './content/quizBank.js';
import { notes } from './data.js';
const paths = { home: '/', sections: '/kesit/v1', lens: '/mercek', planner: '/ders-planlayici', library: '/kutuphane', videos: '/videolar', sources: '/kaynaklar', atlas: '/atlas', practice: '/calis', quizzes: '/quizler', saved: '/kaydedilenler', about: '/hakkinda' };
// Licensed book/atlas collections were removed; old links land on the resource page.
const legacyPaths = { '/kitaplar': 'sources' };
export function routeFromHash(hash) {
  const path = hash.replace(/^#/, '');
  if (path.split('?')[0] === paths.sections) return { page: 'sections', lesson: null, quiz: null };
  if (path.split('?')[0] === paths.lens) return { page: 'lens', lesson: null, quiz: null };
  const quizMatch = /^\/quizler(?:\/([\w-]+))?$/.exec(path);
  if (quizMatch) return { page: 'quizzes', lesson: null, quiz: findQuizSet(quizMatch[1]) || null };
  const lessonMatch = /^\/ders\/(\d+)(?:\/([\w-]+))?$/.exec(path);
  if (lessonMatch) {
    const lesson = notes.find(note => note.number === Number(lessonMatch[1]));
    if (lesson) return { page: 'lesson', lesson, quiz: null, ...(lessonMatch[2] ? { section: lessonMatch[2] } : {}) };
  }
  // Older atlas links carried a scene id (/atlas/<id>); they all open the single atlas page now.
  if (/^\/atlas(?:\/[\w-]+)?$/.test(path)) return { page: 'atlas', lesson: null, quiz: null };
  const page = Object.keys(paths).find(key => paths[key] === path) || legacyPaths[path] || 'home';
  return { page, lesson: null, quiz: null };
}
export const pageHash = page => `#${paths[page] || '/'}`;
export const lessonHash = note => `#/ders/${note.number}`;

export const quizHash = quiz => `#/quizler/${quiz.id}`;
