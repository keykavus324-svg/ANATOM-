import test from 'node:test';
import assert from 'node:assert/strict';
import { studyGuides } from '../src/content/studyGuides.js';
import { lessons } from '../src/lessons.js';
test('all 11 anatomy lessons have distinct guided learning and visual practice', () => {
  assert.equal(Object.keys(studyGuides).length, 11);
  for (let n = 1; n <= 11; n++) {
    for (const key of ['goal', 'explanation', 'task', 'answer', 'mistake']) {
      assert.ok(studyGuides[n][key].length > 30, `${n}/${key}`);
    }
    assert.ok(lessons[n].sections.filter(s => s.diagram).length >= 2);
  }
  assert.equal(new Set(Object.values(studyGuides).map(g => g.explanation)).size, 11);
});
