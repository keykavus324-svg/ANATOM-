import { notes } from './data.js';
const paths = { home: '/', library: '/kutuphane', saved: '/kaydedilenler', about: '/hakkinda' };
export function routeFromHash(hash) {
  const path = hash.replace(/^#/, '');
  const match = /^\/ders\/(\d+)$/.exec(path);
  if (match) {
    const lesson = notes.find(note => note.number === Number(match[1]));
    if (lesson) return { page: 'lesson', lesson };
  }
  const page = Object.keys(paths).find(key => paths[key] === path) || 'home';
  return { page, lesson: null };
}
export const pageHash = page => `#${paths[page] || '/'}`;
export const lessonHash = note => `#/ders/${note.number}`;
