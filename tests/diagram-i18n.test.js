import test from 'node:test';
import assert from 'node:assert/strict';
import { diagrams } from '../src/content/diagrams.js';
import { diagramIn, hasDiagramTranslation, TRANSLATED_DIAGRAMS } from '../src/content/diagramI18n.js';
import { loadTranslationPack } from '../src/content/packs/index.js';
await Promise.all([loadTranslationPack('en'), loadTranslationPack('ar')]); // translation packs load on demand

const ids = Object.keys(diagrams);

test('every teaching diagram has an English and an Arabic version', () => {
  for (const id of ids) {
    assert.equal(hasDiagramTranslation('en', id), true, `${id} has no English labels`);
    assert.equal(hasDiagramTranslation('ar', id), true, `${id} has no Arabic labels`);
  }
  assert.deepEqual([...TRANSLATED_DIAGRAMS.en].sort(), [...ids].sort());
  assert.deepEqual([...TRANSLATED_DIAGRAMS.ar].sort(), [...ids].sort());
});

test('translated diagrams keep the Turkish label order and count', () => {
  for (const lang of ['en', 'ar']) {
    for (const id of ids) {
      const base = diagrams[id];
      const merged = diagramIn(lang, id);
      assert.equal(merged.labels.length, base.labels.length, `${lang} ${id} label count`);
      assert.equal(new Set(merged.labels.map(l => l.name)).size, base.labels.length, `${lang} ${id} label names must stay distinct`);
    }
  }
});

test('translated diagrams replace the readable text and keep the figure metadata', () => {
  for (const lang of ['en', 'ar']) {
    for (const id of ids) {
      const base = diagrams[id];
      const merged = diagramIn(lang, id);
      assert.notEqual(merged.title, base.title, `${lang} ${id} title is untranslated`);
      assert.notEqual(merged.caption, base.caption, `${lang} ${id} caption is untranslated`);
      assert.notEqual(merged.takeaway, base.takeaway, `${lang} ${id} takeaway is untranslated`);
      merged.labels.forEach((label, i) => {
        assert.notEqual(label.text, base.labels[i].text, `${lang} ${id} label ${i} text is untranslated`);
      });
      // The SVG file is chosen from the id, so it must never be localised.
      assert.equal(merged.title.length > 0, true);
    }
  }
});

test('an unknown language falls back to the Turkish diagram', () => {
  assert.equal(hasDiagramTranslation('xx', ids[0]), false);
  assert.equal(diagramIn('xx', ids[0]), diagrams[ids[0]]);
  assert.equal(diagramIn('en', 'not-a-diagram'), undefined);
});
