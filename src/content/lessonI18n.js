// Localised lesson bodies.
//
// The authored lessons (src/content/lessons/*) are written in Turkish. A lesson is
// only shown in another language when a complete, human-written translation exists
// here — never a machine translation, because these texts carry anatomical
// reasoning where a wrong word changes the meaning.
//
// A patch file mirrors the shape of the original lesson but only replaces text:
//   { subtitle, intro, imageAlt, scope,
//     sections: { [sectionId]: { title, paragraphs: [...], table: {headers, rows},
//                                callout, flow: [...], subsections: [{title, paragraphs, table}] } },
//     glossary: [[term, definition], ...], review: [{q, a}, ...],
//     guide: { goal, explanation, task, answer, mistake },
//     teaching: { [examItemId]: { title, paragraphs, headers, rows, trap } } }
//
// Arrays must keep the same length and order as the Turkish source, otherwise the
// merge fails loudly instead of silently shifting a paragraph under the wrong
// heading. tests/lesson-i18n.test.js enforces this.
import { translationPack } from './packs/index.js';

// Translation patches live in the language packs (src/content/packs), which are loaded
// on demand. These helpers read the cached pack and fall back to Turkish when it is
// not loaded, so they stay synchronous for the renderer.
function patchesFor(lang) {
  return translationPack(lang)?.lessons || {};
}

export const TRANSLATED_LESSONS = {
  get en() { return Object.keys(patchesFor('en')).map(Number); },
  get ar() { return Object.keys(patchesFor('ar')).map(Number); },
};

export function hasLessonTranslation(lang, number) {
  return Boolean(patchesFor(lang)[number]);
}

export function lessonTranslation(lang, number) {
  return patchesFor(lang)[number] || null;
}

function sameLength(a, b, where) {
  if (!Array.isArray(b)) return;
  if (!Array.isArray(a) || a.length !== b.length) {
    throw new Error(`lesson translation drift at ${where}: expected ${a?.length} items, got ${b?.length}`);
  }
}

function mergeTable(base, patch) {
  if (!patch) return base;
  if (base) sameLength(base.rows, patch.rows, 'table.rows');
  return patch;
}

function mergeSection(base, patch) {
  if (!patch) return base;
  const merged = { ...base };
  if (patch.title) merged.title = patch.title;
  if (patch.paragraphs) { sameLength(base.paragraphs, patch.paragraphs, `${base.id}.paragraphs`); merged.paragraphs = patch.paragraphs; }
  if (patch.callout) merged.callout = patch.callout;
  if (patch.flow) { sameLength(base.flow, patch.flow, `${base.id}.flow`); merged.flow = patch.flow; }
  if (patch.table) merged.table = mergeTable(base.table, patch.table);
  if (patch.subsections) {
    sameLength(base.subsections, patch.subsections, `${base.id}.subsections`);
    merged.subsections = base.subsections.map((sub, i) => {
      const subPatch = patch.subsections[i] || {};
      const next = { ...sub };
      if (subPatch.title) next.title = subPatch.title;
      if (subPatch.paragraphs) { sameLength(sub.paragraphs, subPatch.paragraphs, `${base.id}.subsections[${i}]`); next.paragraphs = subPatch.paragraphs; }
      if (subPatch.table) next.table = mergeTable(sub.table, subPatch.table);
      return next;
    });
  }
  return merged;
}

// Replaces the text of a lesson with its translation while keeping IDs, source
// page references, diagrams and colours from the Turkish original.
// Replaces any leaf string that is still exactly one of the Turkish source strings
// listed in ./lessons/i18n/gaps (sub-section paragraphs and table cells that the
// structural patch does not reach). Strings already translated never match a key.
function applyGaps(lang, number, value) {
  const gaps = translationPack(lang)?.gaps?.[number];
  if (!gaps || lang === 'tr') return value;
  const replace = v => {
    if (typeof v === 'string') return gaps[v]?.[lang] ?? v;
    if (Array.isArray(v)) return v.map(replace);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, replace(x)]));
    return v;
  };
  return replace(value);
}

export function lessonIn(lang, number, base) {
  const patch = lessonTranslation(lang, number);
  if (!base) return base;
  if (!patch) return applyGaps(lang, number, base);
  const merged = { ...base };
  for (const key of ['subtitle', 'intro', 'imageAlt', 'scope']) {
    if (patch[key]) merged[key] = patch[key];
  }
  merged.sections = base.sections.map(section => {
    const sectionPatch = patch.sections?.[section.id];
    if (!sectionPatch) return section;
    return mergeSection(section, sectionPatch);
  });
  if (patch.glossary) { sameLength(base.glossary, patch.glossary, 'glossary'); merged.glossary = patch.glossary; }
  if (patch.review) { sameLength(base.review, patch.review, 'review'); merged.review = patch.review; }
  return applyGaps(lang, number, merged);
}

export function guideIn(lang, number, base) {
  const guide = lessonTranslation(lang, number)?.guide;
  return applyGaps(lang, number, guide ? { ...base, ...guide } : base);
}

export function teachingIn(lang, number, baseItems) {
  const teaching = lessonTranslation(lang, number)?.teaching;
  if (!teaching) return baseItems;
  return baseItems.map(item => {
    const patch = teaching[item.id];
    if (!patch) return item;
    const next = { ...item };
    if (patch.title) next.title = patch.title;
    if (patch.paragraphs) { sameLength(item.paragraphs, patch.paragraphs, `${item.id}.paragraphs`); next.paragraphs = patch.paragraphs; }
    if (patch.trap) next.trap = patch.trap;
    if (patch.headers) next.headers = patch.headers;
    if (patch.rows) { sameLength(item.rows, patch.rows, `${item.id}.rows`); next.rows = patch.rows; }
    if (patch.checks) {
      sameLength(item.checks, patch.checks, `${item.id}.checks`);
      next.checks = item.checks.map((check, i) => {
        const checkPatch = patch.checks[i] || {};
        const mergedCheck = { ...check };
        if (checkPatch.q) mergedCheck.q = checkPatch.q;
        if (checkPatch.options) { sameLength(check.options, checkPatch.options, `${item.id}.checks[${i}]`); mergedCheck.options = checkPatch.options; }
        if (checkPatch.why) mergedCheck.why = checkPatch.why;
        return mergedCheck;
      });
    }
    return next;
  });
}
