import test from 'node:test';
import assert from 'node:assert/strict';
import { examSources, examReviewDate } from '../src/content/exam/index.js';
import { examVisuals } from '../src/content/exam/visuals.js';
import { examSourcesIn, examReviewDateIn, examLocatorIn, examVisualsIn, examVisualIn } from '../src/content/examI18n.js';
import { loadTranslationPack } from '../src/content/packs/index.js';
await Promise.all([loadTranslationPack('en'), loadTranslationPack('ar')]); // translation packs load on demand

test('the archive review notes and the review date switch language', () => {
  for (const lang of ['en', 'ar']) {
    const sources = examSourcesIn(lang);
    assert.deepEqual(Object.keys(sources).sort(), Object.keys(examSources).sort());
    for (const [key, source] of Object.entries(sources)) {
      assert.equal(source.id, examSources[key].id);
      assert.notEqual(source.review, examSources[key].review, `${lang} ${key} review`);
    }
    assert.notEqual(examReviewDateIn(lang), examReviewDate, `${lang} review date`);
  }
});

test('the exam figure captions and numbered keys are translated', () => {
  for (const lang of ['en', 'ar']) {
    const visuals = examVisualsIn(lang);
    assert.deepEqual(Object.keys(visuals), Object.keys(examVisuals));
    for (const [id, visual] of Object.entries(visuals)) {
      assert.notEqual(visual.title, examVisuals[id].title, `${lang} ${id} title`);
      assert.equal(visual.labels.length, examVisuals[id].labels.length, `${lang} ${id} label count`);
      visual.labels.forEach((label, i) => assert.notEqual(label, examVisuals[id].labels[i], `${lang} ${id} label ${i}`));
    }
    assert.equal(examVisualIn(lang, 'carpal-map').labels.length, 8);
  }
});

test('evidence locators are translated and unknown ones fall through', () => {
  assert.equal(examLocatorIn('en', 'şekil tanıma'), 'figure recognition');
  assert.equal(examLocatorIn('ar', 'kas tanıma'), 'تعرّف العضلة');
  assert.equal(examLocatorIn('en', '3–4, 8'), '3–4, 8');
  assert.equal(examLocatorIn('xx', 'kas tanıma'), 'kas tanıma');
});

test('Turkish and unknown languages keep the Turkish exam text', () => {
  assert.equal(examSourcesIn('xx').summary.review, examSources.summary.review);
  assert.equal(examReviewDateIn('xx'), examReviewDate);
  assert.equal(examVisualsIn('xx'), examVisuals);
});
