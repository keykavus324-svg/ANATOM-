import test from 'node:test';
import assert from 'node:assert/strict';
import { externalQuizzes, quizCategories, findExternalQuiz, filterExternalQuizzes, validQuizIds, QUIZ_SOURCE } from '../src/quizCatalog.js';
import { notes } from '../src/data.js';
import { routeFromHash, pageHash, quizHash } from '../src/routing.js';

test('159 unique quiz links retain exact publisher URL casing and real course mappings', () => {
  assert.equal(externalQuizzes.length, 159);
  assert.equal(new Set(externalQuizzes.map(q => q.id)).size, externalQuizzes.length);
  assert.equal(quizCategories.length, 7);
  for (const quiz of externalQuizzes) {
    assert.ok(quizCategories.some(c => c.id === quiz.category));
    assert.equal(new URL(quiz.url).origin, new URL(QUIZ_SOURCE.url).origin);
    assert.equal(new URL(quiz.url).pathname, `/${quiz.id}.html`);
    assert.equal(quiz.language, 'en');
    assert.ok(quiz.lesson === null || notes.some(n => n.number === quiz.lesson));
    assert.ok(quiz.title && quiz.topic && quiz.sourcePage);
  }
  assert.equal(findExternalQuiz('InternalIDQs1').url, `${QUIZ_SOURCE.url}InternalIDQs1.html`);
  assert.equal(findExternalQuiz('urinary1').lesson, null);
  assert.equal(findExternalQuiz('eye1').lesson, null);
});
test('Turkish search composes with category, type and favorite filters without mutating the catalog', () => {
  assert.ok(filterExternalQuizzes({ query: 'KAS ISLEVLERI', category: 'muscles' }).length > 0);
  assert.equal(filterExternalQuizzes({ query: 'KAFATASI' })[0].id, 'skullIDQ1');
  assert.equal(filterExternalQuizzes({ category: 'senses' }).length, 6);
  assert.ok(filterExternalQuizzes({ kind: 'Fizyoloji' }).every(q => q.kind === 'Fizyoloji'));
  assert.equal(filterExternalQuizzes({ savedOnly: true, saved: ['brain1'], category: 'brain' }).length, 1);
  assert.equal(filterExternalQuizzes({ savedOnly: true }).length, 0);
  assert.equal(filterExternalQuizzes({ query: 'not-a-topic' }).length, 0);
});
test('quiz routes survive refresh and invalid IDs fall back to the quiz library', () => {
  assert.equal(pageHash('quizzes'), '#/quizler');
  const quiz = externalQuizzes[0];
  assert.equal(routeFromHash(quizHash(quiz)).quiz, quiz);
  assert.equal(routeFromHash('#/quizler/unknown').page, 'quizzes');
  assert.equal(routeFromHash('#/quizler/unknown').quiz, null);
  assert.equal(routeFromHash('#/quizler').quiz, null);
});
test('local quiz preferences discard malformed, duplicated and obsolete IDs', () => {
  for (const value of [null, 'brain1', {}, 14]) assert.deepEqual(validQuizIds(value), []);
  assert.deepEqual(validQuizIds(['brain1', 'brain1', {}, 'removed', 'eye1']), ['brain1', 'eye1']);
});
