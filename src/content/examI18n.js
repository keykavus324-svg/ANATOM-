// Localised text for the archive notes and teaching figures that sit next to the
// exam explanations.
//
// The Turkish body of every exam-teaching item already travels with its lesson
// translation (src/content/lessonI18n.js), so this module only covers what stayed
// outside that path: the review notice for each source file, the review date, the
// evidence locators and the six teaching figures.
import { examSources, examReviewDate } from './exam/index.js';
import { examVisuals } from './exam/visuals.js';
import { translationPack } from './packs/index.js';

// Exam archive text for each language comes from its pack (src/content/packs), loaded on demand.
const registry = {
  get en() { return translationPack('en')?.exam; },
  get ar() { return translationPack('ar')?.exam; },
};

function sameLength(base, patch, where) {
  if (!Array.isArray(patch) || patch.length !== base.length) {
    throw new Error(`exam translation drift at ${where}: expected ${base.length}, got ${patch?.length}`);
  }
}

export function examSourcesIn(lang) {
  const patch = registry[lang]?.sources;
  if (!patch) return examSources;
  const merged = {};
  for (const [key, source] of Object.entries(examSources)) {
    merged[key] = { ...source, review: patch[key]?.review || source.review };
  }
  return merged;
}

export function examReviewDateIn(lang) {
  return registry[lang]?.reviewDate || examReviewDate;
}

export function examLocatorIn(lang, locator) {
  return registry[lang]?.locators?.[locator] || locator;
}

export function examVisualsIn(lang) {
  const patch = registry[lang]?.visuals;
  if (!patch) return examVisuals;
  const merged = {};
  for (const [id, visual] of Object.entries(examVisuals)) {
    const text = patch[id];
    if (!text) { merged[id] = visual; continue; }
    sameLength(visual.labels, text.labels, `${id}.labels`);
    merged[id] = {
      title: text.title || visual.title,
      caption: text.caption || visual.caption,
      labels: text.labels,
    };
  }
  return merged;
}

export function examVisualIn(lang, id) {
  return examVisualsIn(lang)[id] || null;
}

const keysOf = (lang, part) => Object.keys(registry[lang]?.[part] || {});
export const TRANSLATED_EXAM = {
  get en() { return { sources: keysOf('en', 'sources'), visuals: keysOf('en', 'visuals'), locators: keysOf('en', 'locators') }; },
  get ar() { return { sources: keysOf('ar', 'sources'), visuals: keysOf('ar', 'visuals'), locators: keysOf('ar', 'locators') }; },
};
