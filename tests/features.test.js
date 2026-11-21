import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TERMS, fold, searchTerms, termsIn } from '../src/content/terminology.js';
import { CLINICAL_NOTES } from '../src/content/clinicalNotes.js';
import { pageHash, routeFromHash } from '../src/routing.js';

test('term search folds Turkish characters and matches Latin and Turkish spellings', () => {
  assert.equal(fold('Köprücük'), fold('KOPRUCUK'));
  assert.equal(fold('İstanbul Şişeli Ğğ'), 'istanbul siseli gg');
  const latin = searchTerms('clavicula');
  assert.ok(latin.length > 0);
  assert.match(latin[0].tr, /Köprücük/);
  const turkish = searchTerms('köprücük');
  assert.equal(turkish[0]?.la, 'Clavicula');
  const folded = searchTerms('koprucuk kemigi');
  assert.equal(folded[0]?.la, 'Clavicula');
  assert.deepEqual(searchTerms('a'), []);
});

test('terminology covers every lesson with unique Latin and Turkish entries', () => {
  const lessons = new Set(TERMS.map(term => term.lesson));
  for (let n = 1; n <= 11; n++) assert.ok(lessons.has(n), `lesson ${n}`);
  assert.ok(termsIn(4).some(term => term.la === 'Clavicula'));
  const la = TERMS.map(term => term.la);
  assert.equal(new Set(la).size, la.length);
  for (const term of TERMS) {
    assert.ok(term.la && term.tr && term.en, term.la);
  }
});

test('clinical correlation boxes exist trilingual for lessons 1-11', () => {
  for (let n = 1; n <= 11; n++) {
    const notes = CLINICAL_NOTES[n];
    assert.equal(notes.length, 2, `lesson ${n}`);
    for (const note of notes) for (const lang of ['tr', 'en', 'ar']) {
      assert.ok(note[lang].length > 40, `${n}/${lang}`);
    }
  }
});

test('shell html carries share card metadata, base-aware favicon and a CSS loading skeleton', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<meta property="og:title"/);
  assert.match(html, /<meta property="og:description"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/keykavus324-svg\.github\.io\/[^/]+\/brand\/og-card\.png"/);
  assert.match(html, /href="%BASE_URL%favicon\.svg"/);
  assert.match(html, /#root:empty::after/);
  assert.match(html, /ANATOMİ yükleniyor/);
});

test('build config derives the Pages base from the repository slug and registers the PWA', () => {
  const config = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
  assert.match(config, /REPO_SLUG/);
  assert.match(config, /VitePWA/);
  assert.match(config, /CacheFirst/);
});

test('review route resolves to the favorites page', () => {
  assert.equal(pageHash('review'), '#/tekrar');
  assert.equal(routeFromHash('#/tekrar').page, 'review');
});
