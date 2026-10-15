import test from 'node:test';
import assert from 'node:assert/strict';
import { ATLAS_SOURCE, atlasGroups, atlasLessonSceneMap, atlasSceneForLesson, atlasSceneGroups, atlasScenes, atlasUrl, defaultAtlasScene, findAtlasScene } from '../src/atlas.js';
import { atlasHash, pageHash, routeFromHash } from '../src/routing.js';

test('atlas scenes are unique, grouped and fully described', () => {
  assert.ok(atlasScenes.length >= 12);
  assert.equal(new Set(atlasScenes.map(scene => scene.id)).size, atlasScenes.length);
  for (const scene of atlasScenes) {
    assert.match(scene.id, /^[a-z0-9-]+$/);
    assert.ok(atlasGroups.some(group => group.id === scene.group), `${scene.id}: bilinmeyen grup`);
    assert.ok(['zygote', 'view'].includes(scene.source), `${scene.id}: bilinmeyen kaynak türü`);
    assert.ok(scene.title.length > 2, `${scene.id}: başlık eksik`);
    assert.ok(scene.latin.length > 2, `${scene.id}: Latince ad eksik`);
    assert.ok(scene.summary.length > 40, `${scene.id}: özet çok kısa`);
    assert.ok(scene.observe.length > 20, `${scene.id}: gözlem notu eksik`);
    assert.ok(Array.isArray(scene.steps) && scene.steps.length >= 3, `${scene.id}: adımlar eksik`);
    assert.ok(scene.steps.every(step => step.length > 15), `${scene.id}: adım metni çok kısa`);
    assert.ok(Number.isInteger(scene.lesson) && scene.lesson >= 0 && scene.lesson <= 11, `${scene.id}: ders eşleşmesi geçersiz`);
  }
  assert.equal(atlasSceneGroups.reduce((total, group) => total + group.scenes.length, 0), atlasScenes.length);
  assert.deepEqual(atlasSceneGroups.map(group => group.id), atlasGroups.map(group => group.id));
});

test('scene links only point at the official ZygoteBody embed and carry the app state hash', () => {
  for (const scene of atlasScenes) {
    const url = atlasUrl(scene);
    assert.ok(url.startsWith('https://www.zygotebody.com/'), `${scene.id}: alan adı dışı bağlantı`);
    assert.ok(!/\s/.test(url), `${scene.id}: bağlantıda boşluk var`);
    if (!scene.hash) {
      assert.equal(url, ATLAS_SOURCE.url, `${scene.id}: hash beklenmiyordu`);
      continue;
    }
    assert.match(scene.hash, /^nav=-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,0,0,0,0&sel=p:;h:;s:/, `${scene.id}: kamera/сеçim biçimi bozuk`);
    assert.ok(!scene.hash.includes(' '), `${scene.id}: hash boşluk içeriyor`);
    assert.equal(url, `${ATLAS_SOURCE.url}#${scene.hash}`);
  }
});

test('only verified deep links isolate an entity; camera views keep the selection empty', () => {
  const isolated = atlasScenes.filter(scene => scene.source === 'zygote');
  assert.ok(isolated.length >= 5, 'izole görünüm sayısı beklenenden az');
  for (const scene of isolated) {
    assert.match(scene.hash, /sel=p:;h:;s:\d+(,\d+)*;c:-0\.6;o:-0\.75&layers=[\d,]+$/, `${scene.id}: izole bağlantı bekleniyordu`);
    assert.match(scene.hash, /&layers=(\d+,)*\d+$/, `${scene.id}: katman dizisi bozuk`);
  }
  for (const scene of atlasScenes.filter(item => item.source === 'view' && item.hash)) {
    assert.match(scene.hash, /sel=p:;h:;s:;c:0;o:0$/, `${scene.id}: kamera görünümünde seçim yapılmamalı`);
  }
});

test('every course document maps to an existing atlas scene', () => {
  const mapped = Object.keys(atlasLessonSceneMap).map(Number).sort((a, b) => a - b);
  assert.deepEqual(mapped, Array.from({ length: 12 }, (_, index) => index));
  for (const id of Object.values(atlasLessonSceneMap)) {
    assert.ok(findAtlasScene(id), `eşleşme tablosundaki "${id}" sahnesi katalogda yok`);
  }
  for (const number of mapped) {
    const scene = atlasSceneForLesson(number);
    assert.ok(scene, `ders ${number}: sahne bulunamadı`);
    assert.equal(findAtlasScene(scene.id), scene, `ders ${number}: sahne kataloğu ile uyuşmuyor`);
  }
  assert.equal(atlasSceneForLesson(99), defaultAtlasScene);
});

test('atlas routes resolve scenes and fall back safely', () => {
  const base = routeFromHash('#/atlas');
  assert.equal(base.page, 'atlas');
  assert.equal(base.atlasSceneId, null);
  assert.equal(base.atlasScene.id, defaultAtlasScene.id);
  assert.equal(routeFromHash('#/atlas/iskelet').atlasScene.id, 'iskelet');
  assert.equal(routeFromHash('#/atlas/beyin').atlasScene.title, 'Beyin');
  assert.equal(routeFromHash('#/atlas/boyle-bir-sahne-yok').atlasScene.id, defaultAtlasScene.id);
  assert.equal(routeFromHash('#/kutuphane').page, 'library');
  assert.equal(routeFromHash('#/ders/7').lesson.title, 'Dolaşım Sistemi');
  assert.equal(pageHash('atlas'), '#/atlas');
  assert.equal(atlasHash(findAtlasScene('akcigerler')), '#/atlas/akcigerler');
});

test('source attribution keeps Zygote’s ownership and terms visible', () => {
  assert.equal(ATLAS_SOURCE.name, 'ZygoteBody');
  assert.match(ATLAS_SOURCE.credit, /© Zygote 3D/);
  assert.equal(ATLAS_SOURCE.termsUrl, 'https://www.zygotebody.com/terms');
  assert.match(ATLAS_SOURCE.licence, /yeniden barındırılmaz/);
});
