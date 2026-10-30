import test from 'node:test';
import assert from 'node:assert/strict';
import { isTranslationReady, loadTranslationPack, translationPack } from '../src/content/packs/index.js';

// Each test file runs in its own process, so this file sees the packs before any load.
test('Turkish is ready at once; English and Arabic packs load only when requested', async () => {
  assert.equal(isTranslationReady('tr'), true);
  assert.equal(translationPack('tr'), null, 'Turkish is the source text and has no pack');
  assert.equal(isTranslationReady('en'), false);
  assert.equal(isTranslationReady('ar'), false);

  const en = await loadTranslationPack('en');
  assert.equal(isTranslationReady('en'), true);
  assert.equal(translationPack('en'), en);
  for (const part of ['lessons', 'gaps', 'quizBank', 'quizFigures', 'diagrams', 'exam']) {
    assert.ok(en[part], `English pack has ${part}`);
  }
  assert.equal(isTranslationReady('ar'), false, 'loading English does not load Arabic');
});

test('an unsupported language resolves to no pack instead of failing', async () => {
  assert.equal(await loadTranslationPack('xx'), null);
  assert.equal(isTranslationReady('xx'), true, 'nothing to wait for: the Turkish text is shown');
});
