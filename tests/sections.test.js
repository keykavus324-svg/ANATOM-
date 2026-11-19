import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  volumeShape,
  offset,
  planes,
  project,
  pick,
  world,
  initialPoint,
  distance,
  sectionHash,
  readSection,
  volumeId,
  validPoint,
} from '../src/sectionSpace.js';
import { routeFromHash } from '../src/routing.js';
import { readDossier, exportDossier } from '../src/researchLens.js';
test('all three views and display picks select the same underlying voxel, including edges', () => {
  const data = readFileSync(
    new URL(`../public/sections/${volumeId}.u8`, import.meta.url),
  );
  assert.equal(
    data.length,
    volumeShape.reduce((a, b) => a * b),
  );
  assert.ok(data[offset(initialPoint)] > 0);
  for (const p of [[0, 0, 0], initialPoint, volumeShape.map((x) => x - 1)])
    for (const plane of planes) {
      assert.deepEqual(pick(p, plane, ...project(p, plane)), p);
    }
  assert.deepEqual(world(initialPoint), [0, -18, 16]);
  assert.deepEqual(project([0, 0, 0], planes[0]), [0, 116]);
  assert.deepEqual(project([0, 0, 0], planes[2]), [116, 94]);
});
test('versioned section links round-trip coordinates and measurement origins, reject off-grid points', () => {
  const p = [52, 62, 44],
    a = initialPoint;
  assert.equal(distance(p, a), 10);
  const hash = sectionHash(p, a);
  assert.equal(routeFromHash(hash).page, 'sections');
  assert.deepEqual(readSection(hash), { point: p, anchor: a });
  for (const bad of ['p=99,99,99', 'p=,,', 'p=-98,-134,-700', 'p=NaN,0,0'])
    assert.deepEqual(readSection('#/kesit/v1?' + bad), {
      point: initialPoint,
      anchor: null,
    });
  assert.equal(validPoint([1.1, 1, 1]), false);
});
test('MRI dossier records export reproducible coordinates and actual template source', () => {
  const c = {
    id: 'mri/1',
    kind: 'mri',
    lesson: 'MNI152 · T1',
    volume: volumeId,
    point: [52, 62, 44],
    anchor: initialPoint,
    lang: 'tr',
    heading: 'Seminer',
    text: 'RAS',
    comment: 'Bir not',
  };
  assert.deepEqual(
    readDossier(JSON.stringify([c, { ...c, point: [3000, 1, 2] }])),
    [c],
  );
  const out = exportDossier([c], [], 'https://example.org/ANATOM-/', (s) => s);
  for (const token of [
    'Bir not',
    '10.0 mm',
    'https://example.org/ANATOM-/#/kesit/v1?',
    'nilearn/nilearn',
  ])
    assert.ok(out.includes(token));
  assert.ok(!out.includes('drive.google'));
});

test('exercise links preserve a bounded teacher prompt and tolerate only supported radii', async () => {
  const { readExercise, exerciseHash } = await import('../src/sectionSpace.js');
  const p = [59, 58, 44],
    prompt = 'Sağ yarıkürede A & B?';
  const url = exerciseHash(p, prompt, 6);
  assert.deepEqual(readExercise(url), { target: p, prompt, radius: 6 });
  assert.deepEqual(readSection(url).point, initialPoint);
  assert.equal(readExercise(url.replace('r=6', 'r=-1')), null);
  assert.equal(readExercise('#/kesit/v1?task=NoTarget&r=10'), null);
});
