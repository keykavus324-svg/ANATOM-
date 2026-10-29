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
import en0 from './lessons/i18n/en/0.js';
import en1 from './lessons/i18n/en/1.js';
import en2 from './lessons/i18n/en/2.js';
import en3 from './lessons/i18n/en/3.js';
import en4 from './lessons/i18n/en/4.js';
import en5 from './lessons/i18n/en/5.js';
import en6 from './lessons/i18n/en/6.js';
import ar0 from './lessons/i18n/ar/0.js';
import ar1 from './lessons/i18n/ar/1.js';
import ar2 from './lessons/i18n/ar/2.js';
import ar3 from './lessons/i18n/ar/3.js';
import ar4 from './lessons/i18n/ar/4.js';
import ar5 from './lessons/i18n/ar/5.js';
import ar6 from './lessons/i18n/ar/6.js';

const registry = {
  en: { 0: en0, 1: en1, 2: en2, 3: en3, 4: en4, 5: en5, 6: en6 },
  ar: { 0: ar0, 1: ar1, 2: ar2, 3: ar3, 4: ar4, 5: ar5, 6: ar6 },
};

export const TRANSLATED_LESSONS = {
  en: Object.keys(registry.en).map(Number),
  ar: Object.keys(registry.ar).map(Number),
};

export function hasLessonTranslation(lang, number) {
  return Boolean(registry[lang]?.[number]);
}

export function lessonTranslation(lang, number) {
  return registry[lang]?.[number] || null;
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
export function lessonIn(lang, number, base) {
  const patch = lessonTranslation(lang, number);
  if (!patch || !base) return base;
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
  return merged;
}

export function guideIn(lang, number, base) {
  const guide = lessonTranslation(lang, number)?.guide;
  return guide ? { ...base, ...guide } : base;
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
