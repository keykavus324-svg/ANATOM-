import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { ATLAS_SOURCE, atlasUrl } from '../src/atlas.js';
import { pageHash, routeFromHash } from '../src/routing.js';

test('the atlas page embeds the author’s TUĞRUL ATLAS', () => {
  assert.equal(ATLAS_SOURCE.url, 'https://keykavus324-svg.github.io/anatomyATLAS/');
  assert.equal(atlasUrl(), ATLAS_SOURCE.url);
  assert.equal(ATLAS_SOURCE.title, 'TUĞRUL ATLAS');
  assert.equal(ATLAS_SOURCE.author, 'Muhammet TUĞRUL');
});

test('the atlas route opens the single atlas page, including old scene links', () => {
  assert.equal(pageHash('atlas'), '#/atlas');
  assert.equal(routeFromHash('#/atlas').page, 'atlas');
  assert.equal(routeFromHash('#/atlas/iskelet').page, 'atlas');
  assert.equal(routeFromHash('#/atlas/bilinmeyen').page, 'atlas');
  assert.equal(routeFromHash('#/ders/9').page, 'lesson');
});

test('no ZygoteBody link, licence or credit remains in the site source', () => {
  const offenders = [];
  const walk = dir => {
    for (const name of readdirSync(dir)) {
      const file = path.join(dir, name);
      if (statSync(file).isDirectory()) walk(file);
      else if (/\.(js|jsx|css|json)$/.test(name) && /zygotebody|zygote 3d|zygote\.com/i.test(readFileSync(file, 'utf8'))) offenders.push(file);
    }
  };
  walk('src');
  assert.deepEqual(offenders, []);
});
