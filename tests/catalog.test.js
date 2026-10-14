import test from 'node:test';
import assert from 'node:assert/strict';
import { notes, categories, normalize, filterNotes } from '../src/data.js';

test('all 12 verified Drive documents have unique IDs and complete metadata', () => {
  assert.equal(notes.length, 12);
  assert.equal(new Set(notes.map(n => n.id)).size, 12);
  assert.deepEqual(notes.map(n => n.number).sort((a,b) => a-b), Array.from({length:12}, (_, i) => i));
  for (const note of notes) {
    assert.match(note.id, /^[\w-]+$/);
    assert.ok(categories.includes(note.category));
    assert.ok(note.title && note.latin && note.original.endsWith('.pdf'));
  }
});
test('default ordering keeps 11 lessons followed by the resource guide', () => {
  assert.equal(filterNotes()[0].number, 1);
  assert.equal(filterNotes().at(-1).number, 0);
});
test('search normalizes Turkish case, diacritics and ASCII input', () => {
  assert.equal(normalize('SİNİR SİSTEMİ'), 'sinir sistemi');
  assert.equal(filterNotes({query:'dolasim'})[0].title, 'Dolaşım Sistemi');
  assert.equal(filterNotes({query:'UROGENITAL'}).length, 1);
  assert.equal(filterNotes({query:'  sinir   sistemi  '}).length, 1);
});
test('search supports Latin names and original source filenames', () => {
  assert.equal(filterNotes({query:'arthrologia'})[0].number, 3);
  assert.equal(filterNotes({query:'myologia'})[0].number, 6);
  assert.equal(filterNotes({query:'KRANİUM VE VERTEBRA'}).length, 1);
});
test('category, search and saved filters compose', () => {
  assert.equal(filterNotes({category:'Hareket sistemi'}).length, 5);
  assert.equal(filterNotes({category:'Organ sistemleri'}).length, 5);
  assert.equal(filterNotes({category:'Kaynaklar'}).length, 1);
  assert.equal(filterNotes({category:'Hareket sistemi', query:'sindirim'}).length, 0);
  const saved = [notes[0].id, notes[3].id];
  assert.equal(filterNotes({savedOnly:true, saved}).length, 2);
  assert.equal(filterNotes({savedOnly:true, saved, category:'Hareket sistemi'}).length, 1);
  assert.equal(filterNotes({savedOnly:true}).length, 0);
});
test('sort is deterministic and does not mutate source data', () => {
  const original = notes.map(n=>n.id);
  assert.equal(filterNotes({sort:'reverse'})[0].number, 0);
  const sorted=filterNotes({sort:'az'});
  for(let i=1;i<sorted.length;i++) assert.ok(sorted[i-1].title.localeCompare(sorted[i].title,'tr') <= 0);
  assert.deepEqual(notes.map(n=>n.id), original);
});

test('source IDs match the instructor folder listing, not response position', () => {
  // Verified against the Drive folder list on 2026-10-14.
  const ids = {
    0:'17uPVDSN1Q0Dl9_0kJa09S7f-WuRT1jhD',
    1:'15OxNPqApSUJ2-rnQoui2EVshH-MdM_IC',
    2:'1EROXvatdJFgIuqLSAq1080PRIZYrmvgy',
    3:'1EV_rNsXJJT_rJatlDwPG8s0q18WOvjnp',
    4:'1ETxzf8aYw6TPmqfZ86iAQasfAPCYAG9g',
    5:'188CRP3E62PIJ1cP7cCmZFODIzTAiTJGL',
    6:'18C2JaGV5Wm7kXwMpgKm_lY7dU1PsOxRc',
    7:'185OzTu2BEO6gO-EQB1okCEuXNu7S9E-c',
    8:'12hn9pwsNtznMtEz1aPRDrdnkhui9eDgR',
    9:'1A11xUnKZUnLgplM0J961T96wLYMJ74_B',
    10:'1A5bZk8u6HiFIXukYCbnRizu3a8q_8lMI',
    11:'1A3NHH_BjunRlYqAATPruig4wOadjD4_3',
  };
  for (const note of notes) assert.equal(note.id, ids[note.number], note.title);
});
