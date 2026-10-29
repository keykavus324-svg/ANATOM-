import { lessons } from "./lessons.js";
import { diagrams } from "./content/diagrams.js";
import { teachingForLesson } from "./content/exam/index.js";
import { teachingIn } from "./content/lessonI18n.js";
import { diagramIn } from "./content/diagramI18n.js";
import { translate } from "./i18nPhrases.js";

// The practice bank is generated from the exam teaching and the diagrams, so it
// follows the language of every other piece of content instead of carrying its
// own copy of the questions: the knowledge items come from the same translated
// teaching patches as the lesson pages, and the visual items from diagramIn().
const KNOWLEDGE_LESSONS = Object.keys(lessons).map(Number).filter((n) => n > 0);

function knowledgeQuestionsFor(lang) {
  return KNOWLEDGE_LESSONS.flatMap((number) =>
    teachingIn(lang, number, teachingForLesson(number)).flatMap((item) =>
      item.checks.map((check, i) => ({
        ...check,
        id: `knowledge:${item.id}:${i}`,
        lesson: item.lesson,
        section: item.section,
        kind: "knowledge",
        topic: item.title,
      })),
    ),
  );
}

function visualQuestionsFor(lang) {
  return Object.entries(lessons).flatMap(([number, lesson]) =>
    lesson.sections.flatMap((section) => {
      const figure = diagrams[section.diagram];
      if (!figure || Number(number) === 0 || figure.labels.length < 3)
        return [];
      const localized = diagramIn(lang, section.diagram);
      return localized.labels.map((label, index) => {
        const others = localized.labels.filter((_, i) => i !== index).slice(0, 3);
        return {
          id: `visual:${section.diagram}:${index}`,
          lesson: Number(number),
          section: section.id,
          kind: "visual",
          diagram: section.diagram,
          marker: index + 1,
          topic: localized.title,
          q: translate(
            lang,
            "Şemada {n} numarayla işaretlenen yapı / kavram hangisidir?",
            { n: index + 1 },
          ),
          options: [label.name, ...others.map((l) => l.name)],
          correct: 0,
          why: `${label.name}: ${label.text} ${localized.takeaway}`,
          hint: label.text,
        };
      });
    }),
  );
}

const cache = new Map();

export function practiceBank(lang = "tr") {
  if (!cache.has(lang)) {
    const knowledge = knowledgeQuestionsFor(lang);
    const visual = visualQuestionsFor(lang);
    cache.set(lang, {
      knowledgeQuestions: knowledge,
      visualQuestions: visual,
      questionBank: [...knowledge, ...visual],
    });
  }
  return cache.get(lang);
}

export const knowledgeQuestions = practiceBank("tr").knowledgeQuestions;
export const visualQuestions = practiceBank("tr").visualQuestions;
export const questionBank = practiceBank("tr").questionBank;
export const questionById = Object.fromEntries(
  questionBank.map((q) => [q.id, q]),
);

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function makeSession(pool, count, random = Math.random) {
  return shuffle(pool, random)
    .slice(0, Math.max(0, count))
    .map((q) => {
      const order = shuffle(
        q.options.map((_, i) => i),
        random,
      );
      return {
        ...q,
        options: order.map((i) => q.options[i]),
        correct: order.indexOf(q.correct),
      };
    });
}
export const PRACTICE_KEY = "anatomi-practice-v1";
const DAY = 86400000;
export function cleanNotebook(value, byId = questionById) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([id, v]) =>
          Object.hasOwn(byId, id) &&
          v &&
          Number.isInteger(v.misses) &&
          v.misses > 0 &&
          v.misses < 100000 &&
          Number.isInteger(v.streak) &&
          v.streak >= 0 &&
          v.streak < 100000 &&
          Number.isFinite(v.due) &&
          v.due >= 0 &&
          v.due <= 8640000000000000,
      )
      .map(([id, v]) => [
        id,
        { misses: v.misses, streak: v.streak, due: v.due },
      ]),
  );
}
export function recordAnswer(notebook, id, correct, now = Date.now()) {
  if (!Object.hasOwn(questionById, id)) return notebook;
  const previous = notebook[id];
  if (correct && !previous) return notebook;
  const streak = correct ? previous.streak + 1 : 0;
  const days = correct ? [1, 3, 7, 14, 30][Math.min(streak - 1, 4)] : 1;
  return {
    ...notebook,
    [id]: {
      misses: (previous?.misses || 0) + (correct ? 0 : 1),
      streak,
      due: now + days * DAY,
    },
  };
}
export const dueQuestions = (notebook, now = Date.now()) =>
  Object.keys(cleanNotebook(notebook))
    .filter((id) => notebook[id].due <= now)
    .map((id) => questionById[id]);

// Same review queue, but with the questions rendered in the requested language.
export function dueQuestionsIn(lang, notebook, now = Date.now()) {
  const bank = practiceBank(lang);
  const byId = Object.fromEntries(bank.questionBank.map((q) => [q.id, q]));
  return Object.keys(cleanNotebook(notebook, byId))
    .filter((id) => notebook[id].due <= now)
    .map((id) => byId[id]);
}
export function gradeSession(questions, answers) {
  const correct = questions.filter((q) => answers[q.id] === q.correct).length;
  const answered = questions.filter((q) =>
    Number.isInteger(answers[q.id]),
  ).length;
  const topics = [...new Set(questions.map((q) => q.lesson))].map((lesson) => {
    const group = questions.filter((q) => q.lesson === lesson);
    return {
      lesson,
      total: group.length,
      correct: group.filter((q) => answers[q.id] === q.correct).length,
    };
  });
  return {
    correct,
    total: questions.length,
    answered,
    blank: questions.length - answered,
    wrong: answered - correct,
    topics,
  };
}
