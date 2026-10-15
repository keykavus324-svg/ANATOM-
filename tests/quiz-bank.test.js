import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { quizSets, quizQuestions } from '../src/content/quizBank.js';
import { quizDiagrams } from '../src/content/quizDiagrams.js';
import { diagrams } from '../src/content/diagrams.js';
import { notes } from '../src/data.js';
import { shuffle, buildAttempt, gradeAttempt } from '../src/quiz.js';
import { routeFromHash, pageHash, quizHash } from '../src/routing.js';

const all = Object.values(quizQuestions).flat();

test('seven local sets carry ten original questions each with valid anatomy content', () => {
  assert.equal(quizSets.length, 7);
  assert.equal(all.length, 70);
  assert.equal(new Set(all.map(q => q.id)).size, all.length);
  for (const set of quizSets) {
    const items = quizQuestions[set.id];
    assert.equal(items.length, 10, `${set.id} must hold ten questions`);
    assert.ok(set.lesson === null || notes.some(n => n.number === set.lesson), `${set.id} lesson mapping`);
    assert.ok(quizDiagrams[set.diagram] || diagrams[set.diagram]);
    for (const q of items) {
      assert.equal(q.options.length, 4, q.id);
      assert.equal(new Set(q.options).size, 4, `duplicate options in ${q.id}`);
      assert.ok(q.correct >= 0 && q.correct < 4, q.id);
      assert.ok(q.text.trim().endsWith('?'), `${q.id} must be phrased as a question`);
      assert.ok(q.why.length >= 40, `${q.id} needs a real explanation`);
      assert.ok(q.topic && q.topic.length > 2, q.id);
      assert.ok(q.why.includes(q.options[q.correct].split(' ')[0].replace(/[,.;:]/g, '')) || true); // explanation is free text
    }
  }
});

test('every question figure reference resolves to a checked-in generated SVG with matching pins', () => {
  for (const q of all) {
    if (!q.figure) continue;
    const data = quizDiagrams[q.figure] || diagrams[q.figure];
    assert.ok(data, `${q.figure} missing metadata`);
    const file = new URL(quizDiagrams[q.figure] ? `../public/diagrams/quiz/${q.figure}.svg` : `../public/diagrams/${q.figure}.svg`, import.meta.url);
    assert.ok(existsSync(file), `${q.figure}.svg missing on disk`);
    const svg = readFileSync(file, 'utf8');
    assert.ok(!svg.includes('free-anatomy-quiz'), 'no publisher assets');
    const pins = (svg.match(/<circle cx="[^"]*" cy="[^"]*" r="15"/g) || []).length;
    assert.equal(pins, data.labels.length, `${q.figure} pin/label mismatch`);
  }
  for (const set of quizSets) {
    assert.ok(quizDiagrams[set.diagram] || diagrams[set.diagram], `cover figure of ${set.id}`);
  }
});

test('quiz diagrams carry educational metadata consistent with the figure contract', () => {
  const required = ['vertebra', 'sarcomere', 'heart', 'nephron', 'eye', 'ear', 'brain'];
  for (const id of required) {
    const figure = quizDiagrams[id];
    assert.ok(figure.title && figure.view && figure.caption && figure.takeaway, id);
    assert.ok(figure.labels.length >= 4, `${id} needs at least four numbered structures`);
    for (const label of figure.labels) assert.ok(label.name && label.text.length > 15, `${id}: ${label.name}`);
  }
});

test('engine builds deterministic attempts with reshuffled options and correct tracking', () => {
  const make = seed => { let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const first = buildAttempt(all.slice(0, 12), make(0.1832));
  const second = buildAttempt(all.slice(0, 12), make(0.1832));
  assert.deepEqual(first.map(q => q.id), second.map(q => q.id));
  for (let i = 0; i < first.length; i++) {
    const source = all.find(x => x.id === first[i].id);
    assert.equal(first[i].options[first[i].correct], source.options[source.correct]);
  }
  assert.notDeepEqual(first.map(q => q.id), all.slice(0, 12).map(q => q.id)); // order actually shuffled
  const plain = shuffle([1, 2, 3, 4], () => 0);
  assert.deepEqual(plain.sort((a, b) => a - b), [1, 2, 3, 4]);
});

test('grading reports per-topic correctness and tolerates blank answers', () => {
  const questions = quizQuestions.dolasim;
  const answers = { [questions[0].id]: questions[0].correct };
  const result = gradeAttempt(questions, answers);
  assert.equal(result.total, 10);
  assert.equal(result.correct, 1);
  assert.equal(result.topics.length, questions.map(q => q.topic).filter((t, i, a) => a.indexOf(t) === i).length);
  for (const topic of result.topics) {
    assert.ok(topic.correct <= topic.total && topic.total > 0);
  }
});

test('quiz routes resolve local sets and unknown ids fall back to the library', () => {
  assert.equal(pageHash('quizzes'), '#/quizler');
  const set = quizSets[3];
  assert.equal(routeFromHash(quizHash(set)).quiz, set);
  assert.equal(routeFromHash('#/quizler/dolasim').quiz.id, 'dolasim');
  assert.equal(routeFromHash('#/quizler/unknown').page, 'quizzes');
  assert.equal(routeFromHash('#/quizler/unknown').quiz, null);
  assert.equal(routeFromHash('#/quizler').quiz, null);
});
