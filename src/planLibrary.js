// Read-only migration: keep the previous single-plan record until a library write succeeds.
export const PLAN_LIBRARY_KEY = 'anatomi-plan-library-v2';
export const LEGACY_PLAN_KEY = 'anatomi-lesson-plan-v1';
export const emptyPlan = () => ({ id: '', title: '', goal: '', ids: [] });

function cleanPlan(raw, id, notes) {
  if (!raw || typeof raw.title !== 'string' || !Array.isArray(raw.ids))
    return null;
  const ids = [...new Set(raw.ids)].filter((key) =>
    notes.some((note) => note.id === key),
  );
  if (!raw.title.trim() || !ids.length) return null;
  return {
    id,
    title: raw.title.slice(0, 160),
    goal: typeof raw.goal === 'string' ? raw.goal.slice(0, 3000) : '',
    ids,
  };
}

export function loadLibrary(storage, notes) {
  const raw = storage.getItem(PLAN_LIBRARY_KEY);
  if (raw !== null) {
    const data = JSON.parse(raw);
    if (!Array.isArray(data?.plans)) throw new Error('Invalid plan library');
    const plans = [];
    for (const item of data.plans) {
      if (
        typeof item?.id !== 'string' ||
        !item.id ||
        plans.some((p) => p.id === item.id)
      )
        continue;
      const plan = cleanPlan(item, item.id, notes);
      if (plan) plans.push(plan);
    }
    return {
      plans,
      activeId:
        plans.find((p) => p.id === data.activeId)?.id || plans[0]?.id || '',
    };
  }
  const legacy = cleanPlan(
    JSON.parse(storage.getItem(LEGACY_PLAN_KEY)),
    'legacy',
    notes,
  );
  return { plans: legacy ? [legacy] : [], activeId: legacy?.id || '' };
}

// Merge one edit with the most recently stored list, not a stale copy from this tab.
function writeLibrary(storage, library) {
  storage.setItem(PLAN_LIBRARY_KEY, JSON.stringify(library));
  try {
    storage.removeItem(LEGACY_PLAN_KEY);
  } catch {
    /* v2 takes precedence. */
  }
  return library;
}
export function storePlan(storage, notes, plan) {
  const { plans } = loadLibrary(storage, notes);
  const saved = cleanPlan(plan, plan.id || crypto.randomUUID(), notes);
  if (!saved) throw new Error('Incomplete plan');
  const library = {
    plans: [saved, ...plans.filter((p) => p.id !== saved.id)],
    activeId: saved.id,
  };
  return writeLibrary(storage, library);
}
export function deletePlan(storage, notes, id) {
  const plans = loadLibrary(storage, notes).plans.filter((p) => p.id !== id);
  const library = { plans, activeId: plans[0]?.id || '' };
  return writeLibrary(storage, library);
}
