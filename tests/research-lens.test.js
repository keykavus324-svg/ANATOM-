import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildResearchIndex,
  findPassages,
  findFigure,
  clipPassage,
  readDossier,
  exportDossier,
  readResearchQuery,
  researchHash,
} from '../src/researchLens.js';
import { notes } from '../src/data.js';
import { lessons } from '../src/lessons.js';
import { loadTranslationPack } from '../src/content/packs/index.js';
import { routeFromHash } from '../src/routing.js';
const index = buildResearchIndex('tr', notes);
test('lens evidence has unique stable IDs, real source sections, and shared hits within a single passage', () => {
  assert.equal(index.figures.length, 26);
  assert.equal(new Set(index.rows.map((r) => r.id)).size, index.rows.length);
  for (const row of index.rows)
    assert.equal(
      lessons[row.number].sections.find((s) => s.id === row.section)
        ?.sourcePages,
      row.pages,
    );
  const shared = findPassages(index.rows, 'RADIUS', 'ulna');
  assert.ok(shared.length > 0);
  assert.ok(
    shared.every((r) => r.body.includes('radius') && r.body.includes('ulna')),
  );
  assert.equal(findFigure(index.figures, 'ulna').label.name, 'Ulna');
  assert.equal(findPassages(index.rows, 'nonsensezzz').length, 0);
  assert.ok(findPassages(index.rows, 'DOLASIM').length > 0);
});
test('translated labels and texts keep stable source IDs; Turkish/Latin searches still work', async () => {
  for (const lang of ['en', 'ar']) {
    await loadTranslationPack(lang);
    const idx = buildResearchIndex(lang, notes);
    assert.deepEqual(
      idx.rows.map((r) => r.id),
      index.rows.map((r) => r.id),
    );
    const fig = findFigure(idx.figures, 'Radius');
    assert.equal(fig.fig.key, 'forearm');
    assert.ok(findPassages(idx.rows, 'Radius', 'Ulna').length);
    assert.notEqual(
      fig.label.text,
      findFigure(index.figures, 'Radius').label.text,
    );
  }
});
test('reproducible URLs and exported dossier preserve section, attribution, page range and user note', () => {
  const hash = researchHash('Dura mater', 'Pia mater');
  assert.equal(routeFromHash(hash).page, 'lens');
  assert.deepEqual(readResearchQuery(hash), ['Dura mater', 'Pia mater']);
  const clip = {
    ...clipPassage(findPassages(index.rows, 'Radius', 'Ulna')[0]),
    comment: 'Seminerde karşılaştır',
  };
  assert.deepEqual(readDossier(JSON.stringify([clip, {}])), [clip]);
  const output = exportDossier(
    [clip],
    notes,
    'https://example.org/ANATOM-/#/mercek',
    (s) => s,
  );
  for (const t of [
    'https://example.org/ANATOM-/#/ders/4/onkol',
    clip.text,
    clip.comment,
    '15–21',
    'Bekir Dağdeviren',
    notes.find((n) => n.number === 4).id,
  ])
    assert.ok(output.includes(t));
  assert.equal(routeFromHash('#/ders/4/onkol').section, 'onkol');
});

test('publication records keep source links and RIS metadata separate from course citations', async()=>{
  const {parsePaper,papersRIS}=await import('../src/literature.js');
  const p=parsePaper({source:'MED',id:'123',title:'Fixture paper',authorList:{author:[{fullName:'Sample J'}]},doi:'10.0000/example',pubYear:'2001',journalInfo:{journal:{title:'Fixture journal'}}});
  assert.equal(parsePaper({title:'Invalid ID',source:'MED',id:'..'}),null);
  assert.deepEqual(readDossier(JSON.stringify([p])),[p]);const ris=papersRIS([p]);for(const tag of ['TY  - JOUR','AU  - Sample J','PY  - 2001','UR  - https://europepmc.org/article/MED/123','ER  - '])assert.ok(ris.includes(tag));
  const out=exportDossier([p],notes,'https://example.org',s=>s);assert.ok(out.includes('Fixture journal'));assert.ok(!out.includes('Bekir Dağdeviren'));assert.ok(!out.includes('#/ders/'));
});
