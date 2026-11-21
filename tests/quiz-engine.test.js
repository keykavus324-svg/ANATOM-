import test from 'node:test';
import assert from 'node:assert/strict';
import { quizQuestions } from '../src/content/quizBank.js';
import {
  QUESTION_TYPES, questionType, shuffle, buildAttempt, buildQuestion, pickBalanced,
  isAnswerCorrect, isAnswered, answerText, correctText, gradeAttempt, gradeBySet,
  examSeconds, formatClock, EXAM_LENGTHS,
} from '../src/quiz.js';

const all = Object.values(quizQuestions).flat();
const byType = type => all.filter(q => questionType(q) === type);
const seeded = seed => { let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };

test('the type helper defaults to multiple choice and rejects unknown shapes', () => {
  assert.equal(questionType({}), 'choice');
  assert.equal(questionType({ type: 'multi' }), 'multi');
  assert.equal(questionType({ type: 'nonsense' }), 'choice');
  assert.deepEqual(QUESTION_TYPES, ['choice', 'truefalse', 'multi', 'order']);
  for (const question of all) assert.ok(QUESTION_TYPES.includes(questionType(question)));
});

test('true/false items never reorder their two fixed labels', () => {
  for (const question of byType('truefalse')) {
    for (const seed of [0.01, 0.37, 0.93]) {
      const attempt = buildQuestion(question, seeded(seed));
      assert.deepEqual(attempt.options, ['Doğru', 'Yanlış']);
      assert.equal(attempt.correct, question.correct);
    }
  }
});

test('multiple-choice attempts keep pointing at the same authored answer', () => {
  for (const question of byType('choice').slice(0, 25)) {
    const attempt = buildQuestion(question, seeded(0.4242));
    assert.equal(attempt.options.length, question.options.length);
    assert.equal(attempt.options[attempt.correct], question.options[question.correct]);
    assert.deepEqual([...attempt.options].sort(), [...question.options].sort());
  }
});

test('multi-select answers are graded as a set and stay complete after shuffling', () => {
  for (const question of byType('multi')) {
    const attempt = buildQuestion(question, seeded(0.7));
    assert.ok(Array.isArray(attempt.correct));
    assert.equal(attempt.correct.length, question.correct.length);
    // The same authored options stay correct, expressed in display order.
    const authored = attempt.correct.map(index => attempt.options[index]).sort();
    const expected = question.correct.map(index => question.options[index]).sort();
    assert.deepEqual(authored, expected);
    assert.ok(isAnswerCorrect(attempt, attempt.correct), 'the full correct set passes');
    assert.ok(isAnswerCorrect(attempt, [...attempt.correct].reverse()), 'selection order does not matter');
    assert.ok(!isAnswerCorrect(attempt, attempt.correct.slice(0, 1)), 'a partial selection fails');
    const wrong = attempt.correct.concat([attempt.options.findIndex((_, i) => !attempt.correct.includes(i))]);
    assert.ok(!isAnswerCorrect(attempt, wrong), 'an extra wrong option fails');
    assert.ok(isAnswered(attempt, [0]), 'one tick counts as answered');
    assert.ok(!isAnswered(attempt, []), 'an empty selection is blank');
  }
});

test('ordering questions are shuffled into a fresh sequence that the visitor rebuilds', () => {
  for (const question of byType('order')) {
    const attempt = buildQuestion(question, seeded(0.31));
    assert.equal(attempt.options.length, question.options.length);
    assert.equal(attempt.correct.length, question.options.length);
    // The canonical sequence reads the authored order back out of the shuffled list.
    assert.deepEqual(attempt.correct.map(index => attempt.options[index]), question.options);
    assert.deepEqual([...attempt.correct].sort((a, b) => a - b), attempt.options.map((_, i) => i));
    assert.ok(isAnswerCorrect(attempt, attempt.correct));
    const swapped = [...attempt.correct];
    [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
    assert.ok(!isAnswerCorrect(attempt, swapped), 'order is graded position by position');
    assert.ok(!isAnswered(attempt, undefined), 'an untouched order is blank');
    assert.ok(isAnswered(attempt, attempt.correct));
    assert.equal(correctText(attempt), question.options.join(' → '));
  }
});

test('order attempts differ between seeds but always restore the authored sequence', () => {
  const question = byType('order')[0];
  const first = buildQuestion(question, seeded(0.11)).options;
  const second = buildQuestion(question, seeded(0.89)).options;
  assert.notDeepEqual(first, second);
  assert.deepEqual([...first].sort(), [...second].sort());
});

test('answer text renders each shape readably and blank answers stay empty', () => {
  const choice = byType('choice')[0];
  const attempt = buildQuestion(choice, seeded(0.2));
  assert.equal(answerText(attempt, attempt.correct), attempt.options[attempt.correct]);
  assert.equal(answerText(attempt, undefined), '');
  const order = buildQuestion(byType('order')[0], seeded(0.2));
  assert.equal(answerText(order, order.correct, ' → '), order.correct.map(i => order.options[i]).join(' → '));
  const multi = buildQuestion(byType('multi')[0], seeded(0.2));
  assert.equal(answerText(multi, multi.correct, ' · '), multi.correct.map(i => multi.options[i]).join(' · '));
  assert.equal(answerText(multi, null), '');
});

test('grading a mixed paper counts each shape correctly and reports blanks', () => {
  const paper = buildAttempt([byType('choice')[0], byType('truefalse')[0], byType('multi')[0], byType('order')[0]], seeded(0.5));
  const answers = {};
  answers[paper[0].id] = paper[0].correct;              // right
  answers[paper[1].id] = paper[1].correct === 0 ? 1 : 0; // wrong
  answers[paper[2].id] = [];                             // blank
  // the ordering question stays untouched → blank
  const result = gradeAttempt(paper, answers);
  assert.equal(result.total, 4);
  assert.equal(result.correct, 1);
  assert.equal(result.answered, 2);
  assert.equal(result.blank, 2);
  assert.equal(result.wrong, 3);
  assert.equal(result.topics.length, new Set(paper.map(q => q.topic)).size);
  const sets = gradeBySet(paper.map(q => ({ ...q, setId: 'temel' })), answers);
  assert.deepEqual(sets, [{ setId: 'temel', total: 4, correct: 1 }]);
});

test('a balanced draw covers every group before draining any single one', () => {
  const groups = [
    [{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }, { id: 'a4' }],
    [{ id: 'b1' }, { id: 'b2' }],
    [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }],
  ];
  const picked = pickBalanced(groups, 6, seeded(0.25));
  assert.equal(picked.length, 6);
  assert.equal(new Set(picked.map(q => q.id)).size, 6);
  const counts = id => picked.filter(q => q.id.startsWith(id)).length;
  assert.equal(counts('a'), 2); // round robin: a, b, c, a, b, c
  assert.equal(counts('b'), 2);
  assert.equal(counts('c'), 2);
  const short = pickBalanced(groups, 4, seeded(0.25));
  assert.deepEqual(short.map(q => q.id[0]), ['a', 'b', 'c', 'a'], 'a short paper still visits every group first');
  assert.equal(pickBalanced(groups, 99, seeded(0.25)).length, 9); // never more than the pool
  assert.deepEqual(pickBalanced([], 5), []);
  assert.deepEqual(pickBalanced([[]], 5), []);
});

test('attempt building stays deterministic under the same random source', () => {
  const first = buildAttempt(all, seeded(0.1234));
  const second = buildAttempt(all, seeded(0.1234));
  assert.deepEqual(first.map(q => q.id), second.map(q => q.id));
  assert.deepEqual(first.map(q => JSON.stringify(q.options)), second.map(q => JSON.stringify(q.options)));
  assert.notDeepEqual(first.map(q => q.id), all.map(q => q.id));
  assert.equal(shuffle([], seeded(0.1)).length, 0);
});

test('the exam clock derives time from paper length and formats it for people', () => {
  assert.deepEqual(EXAM_LENGTHS, [10, 20, 30]);
  assert.equal(examSeconds(10), 450);
  assert.equal(examSeconds(20), 900);
  assert.equal(formatClock(450), '7:30');
  assert.equal(formatClock(0), '0:00');
  assert.equal(formatClock(-30), '0:00');
  assert.equal(formatClock(65), '1:05');
});
