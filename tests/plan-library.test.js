import test from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyPlan,
  loadLibrary,
  storePlan,
  deletePlan,
  LEGACY_PLAN_KEY,
  PLAN_LIBRARY_KEY,
} from '../src/planLibrary.js';
const notes = [{ id: 'brain' }, { id: 'heart' }];
function memory() {
  const data = new Map();
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => data.set(k, v),
    removeItem: (k) => data.delete(k),
  };
}
const lecture = {
  ...emptyPlan(),
  title: 'Seminer',
  goal: 'Tekrar',
  ids: ['heart', 'brain', 'heart', 'old'],
};
test('opening a v1 plan preserves it, deduplicates topics, and migrates on successful save', () => {
  const storage = memory();
  storage.setItem(LEGACY_PLAN_KEY, JSON.stringify(lecture));
  const { plans } = loadLibrary(storage, notes);
  assert.deepEqual(plans[0].ids, ['heart', 'brain']);
  assert.equal(storage.getItem(PLAN_LIBRARY_KEY), null);
  const library = storePlan(storage, notes, { ...lecture, title: 'Yeni plan' });
  assert.equal(library.plans.length, 2);
  assert.equal(storage.getItem(LEGACY_PLAN_KEY), null);
  const updated = storePlan(storage, notes, {
    ...plans[0],
    title: 'Düzenlendi',
  });
  assert.equal(updated.plans.length, 2);
  assert.equal(updated.plans[0].id, 'legacy');
  deletePlan(storage, notes, 'legacy');
  deletePlan(storage, notes, library.activeId);
  assert.deepEqual(loadLibrary(storage, notes), { plans: [], activeId: '' });
});
test('failed migration preserves v1; unreadable library is never overwritten', () => {
  const s = memory();
  s.setItem(LEGACY_PLAN_KEY, JSON.stringify(lecture));
  assert.throws(() =>
    storePlan(
      {
        ...s,
        setItem: () => {
          throw Error('full');
        },
      },
      notes,
      lecture,
    ),
  );
  assert.equal(loadLibrary(s, notes).plans.length, 1);
  s.setItem(PLAN_LIBRARY_KEY, 'invalid');
  assert.throws(() => storePlan(s, notes, lecture));
  assert.equal(s.getItem(PLAN_LIBRARY_KEY), 'invalid');
});
