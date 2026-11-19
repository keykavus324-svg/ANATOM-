// A deterministic index of the project's authored material; no external search or generated answers.
import {
  validSectionClip,
  sectionHash,
  sourceURL,
  coordText,
} from './sectionSpace.js';
import { validPaper, paperUrl } from './literature.js';
import { normalize } from './data.js';
import { lessons } from './lessons.js';
import { lessonIn } from './content/lessonI18n.js';
import { diagramIn } from './content/diagramI18n.js';

export const dossierKey = 'anatomi-research-dossier-v1';
export const fold = (value) =>
  normalize(value)
    .replace(/[\u064b-\u065f\u0670]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const terms = (value) => fold(value).split(' ').filter(Boolean);
export function buildResearchIndex(lang, notes) {
  const rows = [],
    figures = [];
  for (const note of notes) {
    const base = lessons[note.number];
    const lesson = lessonIn(lang, note.number, base);
    for (const [i, section] of lesson.sections.entries()) {
      const origin = base.sections[i];
      const ref = {
        number: note.number,
        lesson: note.title,
        section: section.id,
        title: section.title,
        pages: section.sourcePages,
      };
      function add(
        suffix,
        text,
        original,
        heading = section.title,
        kind = 'passage',
      ) {
        rows.push({
          ...ref,
          id: `${note.number}/${section.id}/${suffix}`,
          heading,
          text,
          lang,
          kind,
          body: fold(text),
          original: fold(original),
          head: fold(heading),
        });
      }
      function indexBlock(block, original, prefix) {
        block.paragraphs?.forEach((p, j) =>
          add(`${prefix}p${j}`, p, original.paragraphs[j], block.title),
        );
        block.table?.rows.forEach((row, j) => {
          const format = (cols, vals) =>
            vals.map((v, k) => `${cols[k]}: ${v}`).join(' · ');
          add(
            `${prefix}t${j}`,
            format(block.table.headers, row),
            format(original.table.headers, original.table.rows[j]),
            block.title,
            'table',
          );
        });
      }
      indexBlock(section, origin, '');
      section.subsections?.forEach((block, j) =>
        indexBlock(block, origin.subsections[j], `s${j}-`),
      );
      if (section.diagram) {
        const key = section.diagram,
          d = diagramIn(lang, key),
          orig = diagramIn('tr', key);
        const labels = d.labels.map((label, j) => {
          add(
            `fig${j}`,
            `${label.name}: ${label.text}`,
            `${orig.labels[j].name}: ${orig.labels[j].text}`,
            d.title,
            'label',
          );
          return { ...label, row: rows.at(-1), canonical: orig.labels[j].name };
        });
        figures.push({ ...ref, key, diagram: d, labels });
      }
    }
  }
  return { rows, figures };
}
export function findPassages(rows, query, second = '') {
  const a = terms(query),
    b = terms(second);
  if (!a.length) return [];
  const match = (row, words) =>
    words.every((w) => row.body.includes(w)) ||
    words.every((w) => row.original.includes(w));
  return rows
    .filter((r) => match(r, a) && match(r, b))
    .sort((x, y) => {
      const score = (r) =>
        (r.kind === 'label' ? 8 : 0) +
        [...a, ...b].filter((w) => r.head.includes(w)).length * 3 +
        (r.body.startsWith(a.join(' ')) ? 2 : 0);
      return score(y) - score(x);
    });
}
export function findFigure(figures, query) {
  const q = fold(query),
    words = terms(q);
  if (!q) return null;
  let best = null,
    highest = 0;
  for (const fig of figures) {
    for (const label of fig.labels) {
      const names = [fold(label.name), fold(label.canonical)];
      const score = names.includes(q)
        ? 10
        : names.some((n) => words.every((w) => n.includes(w)))
          ? 6
          : 0;
      if (score > highest) {
        best = { fig, label };
        highest = score;
      }
    }
    if (
      !highest &&
      words.every((w) => fold(fig.diagram.title + ' ' + fig.key).includes(w))
    )
      best = { fig, label: null };
  }
  return best;
}
export const researchHash = (q, b = '') =>
  `#/mercek?${new URLSearchParams({ q, ...(b ? { b } : {}) })}`;
export function readResearchQuery(hash, initial = 'Radius') {
  const params = new URLSearchParams(hash.split('?')[1] || '');
  return [params.get('q') ?? initial, params.get('b') || ''].map((s) =>
    s.trim().slice(0, 100),
  );
}
export function readDossier(raw) {
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw Error('Invalid dossier');
  return parsed.filter(
    (p) =>
      validSectionClip(p) ||
      validPaper(p) ||
      (p &&
        !p.kind &&
        Number.isInteger(p.number) &&
        [
          'id',
          'text',
          'heading',
          'section',
          'lesson',
          'pages',
          'lang',
          'comment',
        ].every((k) => typeof p[k] === 'string') &&
        lessons[p.number]?.sections.some((s) => s.id === p.section)),
  );
}
export function clipPassage(row) {
  const { id, number, section, lesson, heading, text, pages, lang } = row;
  return {
    id,
    number,
    section,
    lesson,
    heading,
    text,
    pages,
    lang,
    comment: '',
  };
}
export function exportDossier(clips, notes, baseUrl, tr) {
  return [
    'ANATOMİ — ' + tr('Araştırma dosyam'),
    tr(
      'Pasajlar sitenin editoryal anlatımıdır. PDF sayfaları ilgili konuyu gösterir; birebir alıntı değildir.',
    ),
    ...clips.map((c, i) => {
      if (validSectionClip(c))
        return [
          `${i + 1}. ${c.heading} [MNI152 · T1 · 2 mm]`,
          coordText(c.point, c.anchor),
          c.comment && `${tr('Araştırmacı notu')}: ${c.comment}`,
          new URL(sectionHash(c.point, c.anchor), baseUrl).href,
          sourceURL,
        ]
          .filter(Boolean)
          .join('\n');
      if (validPaper(c))
        return [
          `${i + 1}. ${c.heading} [Europe PMC]`,
          c.text,
          c.doi && `DOI: ${c.doi}`,
          paperUrl(c),
          c.comment && `${tr('Araştırmacı notu')}: ${c.comment}`,
        ]
          .filter(Boolean)
          .join('\n');
      const note = notes.find((n) => n.number === c.number);
      return [
        `${i + 1}. ${c.heading} [${c.lang.toUpperCase()}]`,
        c.text,
        c.comment && `${tr('Araştırmacı notu')}: ${c.comment}`,
        `${c.lesson} · ${tr('İlgili PDF sayfaları')}: ${c.pages}`,
        new URL(`#/ders/${c.number}/${c.section}`, baseUrl).href,
        `Bekir Dağdeviren · ${note.original}`,
        `https://drive.google.com/file/d/${note.id}/view`,
      ]
        .filter(Boolean)
        .join('\n');
    }),
  ].join('\n\n');
}
