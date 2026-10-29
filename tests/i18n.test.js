import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PHRASES, DICTIONARIES, translate } from '../src/i18nPhrases.js';
import { LANGUAGES, DEFAULT_LANGUAGE, languageMeta } from '../src/i18nMeta.js';
import { noteTranslations, atlasSceneTitles, localizedNote, localizedScene } from '../src/content/localizedContent.js';
import { notes } from '../src/data.js';
import { atlasScenes } from '../src/atlas.js';

test('three interface languages are offered with the right document direction', () => {
  assert.deepEqual(LANGUAGES.map(l => l.code), ['tr', 'en', 'ar']);
  assert.equal(languageMeta('ar').dir, 'rtl');
  assert.equal(languageMeta('en').dir, 'ltr');
  assert.equal(languageMeta('xx').code, DEFAULT_LANGUAGE);
});

test('every Turkish phrase has a non-empty English and Arabic line', () => {
  const seen = new Set();
  for (const row of PHRASES) {
    assert.equal(row.length, 3, `row is incomplete: ${row[0]}`);
    const [tr, en, ar] = row;
    assert.ok(tr.trim().length > 0);
    assert.ok(en.trim().length > 0, `missing English for: ${tr}`);
    assert.ok(ar.trim().length > 0, `missing Arabic for: ${tr}`);
    assert.ok(!seen.has(tr), `duplicate phrase: ${tr}`);
    seen.add(tr);
  }
  assert.ok(seen.size > 400, 'the interface dictionary should stay comprehensive');
  assert.equal(Object.keys(DICTIONARIES.en).length, seen.size);
  assert.equal(Object.keys(DICTIONARIES.ar).length, seen.size);
});

test('translation keeps unknown strings intact and fills placeholders', () => {
  assert.equal(translate('en', 'Ders notlarını keşfet'), 'Explore course notes');
  assert.match(translate('ar', '{count} not listeleniyor', { count: 3 }), /3/);
  assert.equal(translate('en', 'Tanımsız bir cümle'), 'Tanımsız bir cümle');
  assert.equal(translate('de', 'Ders Kütüphanesi'), 'Ders Kütüphanesi');
  // Turkish source is returned unchanged in Turkish mode.
  assert.equal(translate('tr', 'Ders Kütüphanesi'), 'Ders Kütüphanesi');
});

test('every lesson and 3D scene has English and Arabic metadata', () => {
  for (const note of notes) {
    for (const lang of ['en', 'ar']) {
      const translated = localizedNote(note, lang);
      assert.notEqual(translated.title, note.title, `missing ${lang} title for lesson ${note.number}`);
      assert.ok(translated.description.length > 10);
    }
    assert.equal(localizedNote(note, 'tr'), note);
  }
  assert.deepEqual(Object.keys(noteTranslations).sort(), notes.map(n => String(n.number)).sort());
  for (const scene of atlasScenes) {
    for (const lang of ['en', 'ar']) {
      assert.ok(atlasSceneTitles[scene.id]?.[lang], `missing ${lang} title for scene ${scene.id}`);
      assert.ok(localizedScene(scene, lang).title);
    }
  }
});

test('every component string passed to tr() exists in the dictionary', () => {
  const { readdirSync, statSync } = awaitImportFs();
  const keys = new Set(PHRASES.map(([tr]) => tr));
  const files = [];
  const walk = dir => { for (const entry of readdirSync(dir)) { const full = `${dir}/${entry}`; if (statSync(full).isDirectory()) walk(full); else if (/\.jsx?$/.test(full) && !full.includes('i18nPhrases')) files.push(full); } };
  walk(new URL('../src', import.meta.url).pathname);
  const missing = [];
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/\btr\(\s*(["'])((?:\\.|(?!\1).)*)\1/g)) {
      const key = match[2].replace(/\\'/g, "'");
      if (!keys.has(key)) missing.push(`${file.split('/src/')[1]}: ${key.slice(0, 60)}`);
    }
  }
  assert.deepEqual(missing, []);
});

function awaitImportFs() {
  const fs = process.getBuiltinModule ? process.getBuiltinModule('node:fs') : null;
  return fs;
}
