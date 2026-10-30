// Attaches the English and Arabic labels to the original Turkish diagrams.
//
// A diagram patch mirrors the shape of the authored diagram but only replaces
// text: { title, view, caption, labels: [[name, text], ...], takeaway }.
// The label array must keep the Turkish order and length, because the numbering
// printed on the figure SVG is generated from that order.
import { diagrams } from './diagrams.js';
import { translationPack } from './packs/index.js';

// Diagram labels for each language come from its pack (src/content/packs), loaded on demand.
const registry = {
  get en() { return translationPack('en')?.diagrams || {}; },
  get ar() { return translationPack('ar')?.diagrams || {}; },
};

function sameLength(base, patch, where) {
  if (!Array.isArray(patch) || patch.length !== base.length) {
    throw new Error(`diagram translation drift at ${where}: expected ${base.length}, got ${patch?.length}`);
  }
}

export function hasDiagramTranslation(lang, id) {
  return Boolean(registry[lang]?.[id]);
}

export function diagramIn(lang, id) {
  const base = diagrams[id];
  const patch = registry[lang]?.[id];
  if (!base) return base;
  if (!patch) return base;
  sameLength(base.labels, patch.labels, `${id}.labels`);
  return {
    ...base,
    title: patch.title || base.title,
    view: patch.view || base.view,
    caption: patch.caption || base.caption,
    takeaway: patch.takeaway || base.takeaway,
    labels: base.labels.map((label, i) => ({
      ...label,
      name: patch.labels[i][0] || label.name,
      text: patch.labels[i][1] || label.text,
    })),
  };
}

export const TRANSLATED_DIAGRAMS = {
  get en() { return Object.keys(registry.en); },
  get ar() { return Object.keys(registry.ar); },
};
