import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { quizSets, quizQuestions, quizCategories } from '../src/content/quizBank.js';
import { quizDiagrams } from '../src/content/quizDiagrams.js';
import { diagrams } from '../src/content/diagrams.js';
import { notes, categories } from '../src/data.js';
import { QUESTION_TYPES, shuffle, buildAttempt, gradeAttempt } from '../src/quiz.js';
import { routeFromHash, pageHash, quizHash } from '../src/routing.js';

const all = Object.values(quizQuestions).flat();
const typeOf = question => question.type || 'choice';

test('twelve local sets carry ten original questions each with valid anatomy content', () => {
  assert.equal(quizSets.length, 12);
  assert.equal(all.length, 120);
  assert.equal(new Set(all.map(q => q.id)).size, all.length);
  for (const set of quizSets) {
    const items = quizQuestions[set.id];
    assert.equal(items.length, 10, `${set.id} must hold ten questions`);
    assert.ok(set.lesson === null || notes.some(n => n.number === set.lesson), `${set.id} lesson mapping`);
    assert.ok(quizCategories.includes(set.category), `${set.id} needs a catalogue category`);
    assert.ok(categories.includes(set.category), `${set.id} category must exist in the library`);
    if (set.lesson !== null) {
      assert.equal(notes.find(n => n.number === set.lesson).category, set.category, `${set.id} category must follow its lesson`);
    }
    assert.ok(quizDiagrams[set.diagram] || diagrams[set.diagram]);
    for (const q of items) {
      const type = typeOf(q);
      assert.ok(QUESTION_TYPES.includes(type), `${q.id} has an unknown type`);
      assert.equal(new Set(q.options).size, q.options.length, `duplicate options in ${q.id}`);
      assert.ok(q.topic && q.topic.length > 2, q.id);
      assert.ok(q.why.length >= 40, `${q.id} needs a real explanation`);
      if (type === 'truefalse') {
        assert.deepEqual(q.options, ['Doğru', 'Yanlış'], `${q.id} keeps the fixed labels`);
        assert.ok(q.correct === 0 || q.correct === 1, q.id);
        assert.ok(q.text.trim().endsWith('.'), `${q.id} is a statement to judge`);
      } else if (type === 'multi') {
        assert.ok(q.options.length >= 4, `${q.id} needs distractors`);
        assert.ok(Array.isArray(q.correct) && q.correct.length >= 2 && q.correct.length < q.options.length, `${q.id} must have several but not all options correct`);
        for (const index of q.correct) assert.ok(index >= 0 && index < q.options.length, q.id);
        assert.ok(q.text.trim().endsWith('?'), q.id);
      } else if (type === 'order') {
        assert.ok(q.options.length >= 4, `${q.id} needs a sequence worth ordering`);
        assert.equal(q.correct, null, `${q.id} stores the canonical order in the option list`);
        assert.ok(q.text.trim().endsWith('?'), q.id);
      } else {
        assert.equal(q.options.length, 4, q.id);
        assert.ok(q.correct >= 0 && q.correct < 4, q.id);
        assert.ok(q.text.trim().endsWith('?'), `${q.id} must be phrased as a question`);
      }
    }
  }
});

test('every anatomy lesson is covered by at least one native quiz set', () => {
  for (const note of notes) {
    if (note.number === 0) continue; // the atlas/book guide is a source list, not a topic
    assert.ok(quizSets.some(set => set.lesson === note.number), `lesson ${note.number} (${note.title}) has no quiz set`);
  }
  assert.equal(new Set(quizSets.filter(set => set.lesson !== null).map(set => set.lesson)).size, 11);
  assert.ok(quizSets.some(set => set.lesson === null), 'the sense-organ set stays lesson-independent');
});

test('the bank mixes the four answer shapes instead of one repeated format', () => {
  const counts = Object.fromEntries(QUESTION_TYPES.map(type => [type, all.filter(q => typeOf(q) === type).length]));
  for (const type of ['truefalse', 'multi', 'order']) assert.ok(counts[type] >= 5, `${type} should appear in several sets`);
  assert.ok(counts.choice > all.length / 2, 'multiple choice stays the main shape');
  assert.ok(new Set(all.filter(q => typeOf(q) === 'order').map(q => q.options.length)).size > 1, 'ordering questions vary in length');
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
  const choices = all.filter(q => typeOf(q) === 'choice');
  const first = buildAttempt(choices.slice(0, 12), make(0.1832));
  const second = buildAttempt(choices.slice(0, 12), make(0.1832));
  assert.deepEqual(first.map(q => q.id), second.map(q => q.id));
  for (let i = 0; i < first.length; i++) {
    const source = choices.find(x => x.id === first[i].id);
    assert.equal(first[i].options[first[i].correct], source.options[source.correct]);
  }
  assert.notDeepEqual(first.map(q => q.id), choices.slice(0, 12).map(q => q.id)); // order actually shuffled
  const plain = shuffle([1, 2, 3, 4], () => 0);
  assert.deepEqual(plain.sort((a, b) => a - b), [1, 2, 3, 4]);
});

test('grading reports per-topic correctness and tolerates blank answers', () => {
  const questions = quizQuestions.dolasim;
  const answers = { [questions[0].id]: questions[0].correct };
  const result = gradeAttempt(questions, answers);
  assert.equal(result.total, 10);
  assert.equal(result.correct, 1);
  assert.equal(result.blank, 9);
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
  assert.equal(routeFromHash('#/quizler/sindirim').quiz.id, 'sindirim');
  assert.equal(routeFromHash('#/quizler/unknown').page, 'quizzes');
  assert.equal(routeFromHash('#/quizler/unknown').quiz, null);
  assert.equal(routeFromHash('#/quizler').quiz, null);
});
