import { findQuizSet } from './content/quizBank.js';
import { notes } from './data.js';
import { findAtlasScene, defaultAtlasScene } from './atlas.js';
const paths = { home: '/', library: '/kutuphane', sources: '/kaynaklar', atlas: '/atlas', practice: '/calis', quizzes: '/quizler', saved: '/kaydedilenler', about: '/hakkinda' };
// Licensed book/atlas collections were removed; old links land on the resource page.
const legacyPaths = { '/kitaplar': 'sources' };
export function routeFromHash(hash) {
  const path = hash.replace(/^#/, '');
  const quizMatch = /^\/quizler(?:\/([\w-]+))?$/.exec(path);
  if (quizMatch) return { page: 'quizzes', lesson: null, atlasSceneId: null, atlasScene: null, quiz: findQuizSet(quizMatch[1]) || null };
  const lessonMatch = /^\/ders\/(\d+)$/.exec(path);
  if (lessonMatch) {
    const lesson = notes.find(note => note.number === Number(lessonMatch[1]));
    if (lesson) return { page: 'lesson', lesson, atlasSceneId: null, atlasScene: null };
  }
  const atlasMatch = /^\/atlas(?:\/([\w-]+))?$/.exec(path);
  if (atlasMatch) return { page: 'atlas', lesson: null, atlasSceneId: atlasMatch[1] || null, atlasScene: findAtlasScene(atlasMatch[1]) || defaultAtlasScene };
  const page = Object.keys(paths).find(key => paths[key] === path) || legacyPaths[path] || 'home';
  return { page, lesson: null, atlasSceneId: null, atlasScene: null };
}
export const pageHash = page => `#${paths[page] || '/'}`;
export const lessonHash = note => `#/ders/${note.number}`;
export const atlasHash = scene => `#/atlas/${scene.id}`;

export const quizHash = quiz => `#/quizler/${quiz.id}`;
