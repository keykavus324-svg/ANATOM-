import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { arabicNote, arabicNotePreviewUrl, arabicNoteViewUrl, openResources } from '../src/resources.js';

test('the Arabic lecture note points at the exact shared Drive file', () => {
  assert.equal(arabicNote.id, '1syfu-piLHAh3dPNlnqRuB2q3GfmURTu6');
  assert.equal(arabicNotePreviewUrl(arabicNote), 'https://drive.google.com/file/d/1syfu-piLHAh3dPNlnqRuB2q3GfmURTu6/preview');
  assert.equal(arabicNoteViewUrl(arabicNote), 'https://drive.google.com/file/d/1syfu-piLHAh3dPNlnqRuB2q3GfmURTu6/view');
});

test('the Arabic note is titled in all three interface languages', () => {
  for (const lang of ['tr', 'en', 'ar']) {
    assert.ok(arabicNote.title[lang].length > 3, `missing ${lang} title`);
    assert.ok(arabicNote.description[lang].length > 10, `missing ${lang} description`);
  }
  assert.match(arabicNote.title.ar, /[\u0600-\u06FF]/, 'Arabic title must be written in Arabic');
});

test('open resources are https links with a stated licence and three descriptions', () => {
  assert.ok(openResources.length >= 5);
  assert.equal(new Set(openResources.map(item => item.id)).size, openResources.length);
  for (const item of openResources) {
    assert.match(new URL(item.url).protocol, /^https:$/);
    assert.ok(item.title && item.provider && item.licence);
    for (const lang of ['tr', 'en', 'ar']) assert.ok(item.note[lang].length > 10, `${item.id} missing ${lang}`);
  }
  const licences = openResources.map(item => item.licence).join(' ');
  assert.match(licences, /CC BY/);
});

test('licensed book catalogues are removed from the source tree', () => {
  for (const file of [
    '../src/books.js',
    '../src/bookCollections.js',
    '../src/BooksPage.jsx',
    '../src/components/BookCollections.jsx',
    '../src/components/bookCollections.css',
  ]) assert.equal(existsSync(new URL(file, import.meta.url)), false, `${file} should be deleted`);
});
