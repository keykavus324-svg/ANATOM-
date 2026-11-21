// Pure quiz engine for the native quiz section. Deterministic under an
// injected random source so tests can pin shuffles; options are reshuffled
// once per attempt and stay stable while the visitor reviews a question.
//
// Four answer shapes share one engine (see src/content/quizBank.js):
//   choice    – one correct index out of four options
//   truefalse – the two fixed labels; they are never reordered
//   multi     – several correct indices; order-insensitive, all-or-nothing
//   order     – the options are stored in their canonical sequence and the
//               visitor rebuilds that sequence; graded position by position
export const QUESTION_TYPES = ['choice', 'truefalse', 'multi', 'order'];
export const questionType = question => (QUESTION_TYPES.includes(question?.type) ? question.type : 'choice');
const indices = list => list.map((_, i) => i);
const sorted = list => [...list].sort((a, b) => a - b);

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// One question of an attempt: same id and text, options in the display order of
// this attempt and `correct` expressed against that order.
export function buildQuestion(question, random = Math.random) {
  const type = questionType(question);
  if (type === 'truefalse') return { ...question, type };
  const display = shuffle(indices(question.options), random); // display position → source index
  const options = display.map(i => question.options[i]);
  if (type === 'order') {
    // The right answer is the sequence of display positions that restores the source order.
    return { ...question, type, options, ranks: display, correct: indices(display).sort((a, b) => display[a] - display[b]) };
  }
  const correct = Array.isArray(question.correct)
    ? sorted(display.map((source, position) => (question.correct.includes(source) ? position : -1)).filter(position => position >= 0))
    : display.indexOf(question.correct);
  return { ...question, type, options, correct };
}

export function buildAttempt(questions, random = Math.random) {
  return shuffle(questions, random).map(question => buildQuestion(question, random));
}

// A mixed exam draws from several sets at once. Groups are sampled round-robin so a
// 20-question paper covers every included set instead of draining the first ones.
export function pickBalanced(groups, count, random = Math.random) {
  const queues = groups.map(group => shuffle(group, random));
  const picked = [];
  while (picked.length < count && queues.some(queue => queue.length)) {
    for (const queue of queues) {
      if (picked.length >= count) break;
      if (queue.length) picked.push(queue.shift());
    }
  }
  return picked;
}

export function isAnswerCorrect(question, answer) {
  if (answer === undefined || answer === null) return false;
  const type = questionType(question);
  if (type === 'multi' || type === 'order') {
    if (!Array.isArray(answer) || !Array.isArray(question.correct)) return false;
    if (answer.length !== question.correct.length) return false;
    const expected = type === 'order' ? question.correct : sorted(question.correct);
    const given = type === 'order' ? answer : sorted(answer);
    return given.every((value, i) => value === expected[i]);
  }
  return answer === question.correct;
}

export function isAnswered(question, answer) {
  if (answer === undefined || answer === null) return false;
  const type = questionType(question);
  if (type === 'multi') return Array.isArray(answer) && answer.length > 0;
  if (type === 'order') return Array.isArray(answer) && answer.length === question.options.length;
  return Number.isInteger(answer);
}

// Readable form of an answer (or of the canonical answer) for the review lists.
export function answerText(question, answer, separator = ' → ') {
  const type = questionType(question);
  if (answer === undefined || answer === null) return '';
  if (type === 'multi' || type === 'order') {
    if (!Array.isArray(answer)) return '';
    return answer.map(index => question.options[index]).filter(Boolean).join(separator);
  }
  return question.options[answer] || '';
}

export function correctText(question, separator = ' → ') {
  return answerText(question, question.correct, separator);
}

function groupScores(questions, answers, keyOf) {
  const keys = [...new Set(questions.map(keyOf).filter(key => key !== undefined && key !== null))];
  return keys.map(key => {
    const group = questions.filter(question => keyOf(question) === key);
    return {
      key,
      total: group.length,
      correct: group.filter(question => isAnswerCorrect(question, answers[question.id])).length,
    };
  });
}

export function gradeAttempt(questions, answers) {
  const correct = questions.filter(question => isAnswerCorrect(question, answers[question.id])).length;
  const answered = questions.filter(question => isAnswered(question, answers[question.id])).length;
  return {
    correct,
    total: questions.length,
    wrong: questions.length - correct,
    answered,
    blank: questions.length - answered,
    topics: groupScores(questions, answers, question => question.topic).map(entry => ({ topic: entry.key, total: entry.total, correct: entry.correct })),
  };
}

// Per-set breakdown of one attempt; a mixed exam needs it to update the mastery of
// every set it drew from, not only of the paper as a whole.
export function gradeBySet(questions, answers, setOf = question => question.setId) {
  return groupScores(questions, answers, setOf).map(entry => ({ setId: entry.key, total: entry.total, correct: entry.correct }));
}

// Exam paper length presets, in questions. The countdown is derived from them so a
// longer paper gets proportionally more time (about 45 seconds per question).
export const EXAM_LENGTHS = [10, 20, 30];
export const examSeconds = count => count * 45;
export const formatClock = seconds => {
  const safe = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
};
