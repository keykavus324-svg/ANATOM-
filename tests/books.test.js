import test from 'node:test';
import assert from 'node:assert/strict';
import { books, bookKinds, bookLanguages, filterBooks, BOOKS_FOLDER_URL } from '../src/books.js';
import { notes } from '../src/data.js';
import { routeFromHash, pageHash } from '../src/routing.js';

// Verified against the instructor-shared Drive folder listing on 2026-10-15:
// English subfolder 24 files, Türkçe subfolder 10 files + "Prometheus Anatomi Atlası" subfolder (3 files).
test('all 37 book PDFs from the shared folder are present with unique Drive IDs', () => {
  assert.equal(books.length, 37);
  assert.equal(new Set(books.map(b => b.id)).size, 37);
  assert.equal(books.filter(b => b.lang === 'en').length, 24);
  assert.equal(books.filter(b => b.lang === 'tr').length, 13);
  for (const book of books) {
    assert.match(book.id, /^[\w-]+$/);
    assert.ok(book.title && book.original.endsWith('.pdf'), book.original);
    assert.ok(bookKinds.includes(book.kind), book.kind);
    assert.ok(bookLanguages.some(l => l.id === book.lang && l.id !== 'all'));
  }
});

test('book IDs are disjoint from the 12 lesson/guide documents', () => {
  const lessonIds = new Set(notes.map(n => n.id));
  for (const book of books) assert.equal(lessonIds.has(book.id), false, book.title);
});

test('book catalog does not change the 12-lesson structure', () => {
  assert.equal(notes.length, 12);
  assert.equal(routeFromHash('#/kitaplar').page, 'books');
  assert.equal(pageHash('books'), '#/kitaplar');
});

test('folder link points to the shared book folder', () => {
  assert.equal(BOOKS_FOLDER_URL, 'https://drive.google.com/drive/folders/1JYjritmTvYAvn4POpWy6IP8LnISvTRFu');
});

test('search normalizes Turkish case and diacritics across titles and file names', () => {
  assert.equal(filterBooks({ query: 'NOROANATOMI' }).length, 5);
  assert.equal(filterBooks({ query: 'nöroanatomi' }).length, 5);
  assert.equal(filterBooks({ query: 'sobotta' }).length, 5);
  assert.ok(filterBooks({ query: 'Prometheus' }).every(b => b.title.startsWith('Prometheus')));
  assert.equal(filterBooks({ query: 'Kadavra' })[0].title, 'Kadavra Atlası');
});

test('language and kind filters compose', () => {
  assert.equal(filterBooks({ language: 'tr' }).length, 13);
  assert.equal(filterBooks({ language: 'en' }).length, 24);
  assert.equal(filterBooks({ kind: 'Atlaslar' }).length, 16);
  assert.equal(filterBooks({ kind: 'Ders kitapları' }).length, 8);
  assert.equal(filterBooks({ kind: 'Nöroanatomi', language: 'tr' }).length, 3);
  assert.equal(filterBooks({ kind: 'Nöroanatomi', language: 'en', query: 'glance' }).length, 1);
  assert.equal(filterBooks({ query: 'zzz-yok' }).length, 0);
});
