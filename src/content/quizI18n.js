// Localised view of the project's own quiz bank and quiz figures.
//
// The Turkish bank (src/content/quizBank.js) stays the source of truth for ids,
// option order and the correct answer index. These helpers only swap the readable
// text, so a stored attempt or a saved set id keeps working across languages.
import { quizSets, quizQuestions } from './quizBank.js';
import { quizDiagrams } from './quizDiagrams.js';
import { diagramIn } from './diagramI18n.js';
import en from './quizBank/i18n/en.js';
import ar from './quizBank/i18n/ar.js';
import diagramEn from './quizDiagrams/i18n/en.js';
import diagramAr from './quizDiagrams/i18n/ar.js';

const banks = { en, ar };
const figures = { en: diagramEn, ar: diagramAr };

function sameLength(base, patch, where) {
  if (!Array.isArray(patch) || patch.length !== base.length) {
    throw new Error(`quiz translation drift at ${where}: expected ${base.length}, got ${patch?.length}`);
  }
}

export function quizSetIn(lang, set) {
  const patch = banks[lang]?.sets?.[set.id];
  if (!patch) return set;
  return {
    ...set,
    title: patch.title || set.title,
    description: patch.description || set.description,
    keywords: patch.keywords || set.keywords,
  };
}

export function quizSetsIn(lang) {
  return quizSets.map(set => quizSetIn(lang, set));
}

export function findQuizSetIn(lang, id) {
  const set = quizSets.find(item => item.id === id);
  return set ? quizSetIn(lang, set) : set;
}

export function quizQuestionsIn(lang, setId) {
  const base = quizQuestions[setId] || [];
  const patch = banks[lang]?.questions;
  if (!patch) return base;
  return base.map(question => {
    const text = patch[question.id];
    if (!text) return question;
    sameLength(question.options, text.options, `${question.id}.options`);
    return {
      ...question,
      topic: text.topic || question.topic,
      text: text.text || question.text,
      options: text.options,
      why: text.why || question.why,
    };
  });
}

export function quizFigureIn(lang, id) {
  if (!quizDiagrams[id]) return diagramIn(lang, id);
  const base = quizDiagrams[id];
  const patch = figures[lang]?.[id];
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

export const TRANSLATED_QUIZ = {
  en: Object.keys(banks.en.questions),
  ar: Object.keys(banks.ar.questions),
};
