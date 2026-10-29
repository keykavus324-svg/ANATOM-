import test from 'node:test';
import assert from 'node:assert/strict';
import { atlasScenes, atlasGroups, ATLAS_SOURCE } from '../src/atlas.js';
import { atlasSceneIn, atlasScenesIn, atlasGroupsIn, atlasSourceIn, TRANSLATED_ATLAS } from '../src/content/atlasI18n.js';
import { examSources, examReviewDate } from '../src/content/exam/index.js';
import { examVisuals } from '../src/content/exam/visuals.js';
import { examSourcesIn, examReviewDateIn, examLocatorIn, examVisualsIn, examVisualIn } from '../src/content/examI18n.js';

const sceneIds = atlasScenes.map(scene => scene.id);

test('every 3D atlas scene is written in English and Arabic', () => {
  for (const lang of ['en', 'ar']) {
    assert.deepEqual([...TRANSLATED_ATLAS[lang]].sort(), [...sceneIds].sort(), `${lang} scene list`);
    const scenes = atlasScenesIn(lang);
    assert.deepEqual(scenes.map(scene => scene.id), sceneIds);
    scenes.forEach((scene, i) => {
      assert.notEqual(scene.summary, atlasScenes[i].summary, `${lang} ${scene.id} summary`);
      assert.notEqual(scene.observe, atlasScenes[i].observe, `${lang} ${scene.id} observe`);
      assert.equal(scene.steps.length, atlasScenes[i].steps.length, `${lang} ${scene.id} step count`);
      scene.steps.forEach((step, s) => assert.notEqual(step, atlasScenes[i].steps[s], `${lang} ${scene.id} step ${s}`));
      assert.equal(scene.lesson, atlasScenes[i].lesson);
      assert.equal(scene.source, atlasScenes[i].source);
    });
  }
});

test('the atlas shell is translated but keeps its links', () => {
  for (const lang of ['en', 'ar']) {
    const groups = atlasGroupsIn(lang);
    assert.deepEqual(groups.map(group => group.id), atlasGroups.map(group => group.id));
    groups.forEach((group, i) => assert.notEqual(group.label, atlasGroups[i].label, `${lang} ${group.id}`));

    const source = atlasSourceIn(lang);
    assert.equal(source.url, ATLAS_SOURCE.url);
    assert.equal(source.termsUrl, ATLAS_SOURCE.termsUrl);
    assert.notEqual(source.viewerLabel, ATLAS_SOURCE.viewerLabel);
    assert.notEqual(source.licence, ATLAS_SOURCE.licence);
  }
});

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

test('Turkish and unknown languages keep the Turkish atlas text', () => {
  assert.equal(atlasSceneIn('tr', atlasScenes[0]), atlasScenes[0]);
  assert.equal(atlasSceneIn('xx', atlasScenes[0]).title, atlasScenes[0].title);
  assert.equal(examSourcesIn('xx').summary.review, examSources.summary.review);
  assert.equal(examReviewDateIn('xx'), examReviewDate);
  assert.equal(examVisualsIn('xx'), examVisuals);
});
