import test from 'node:test';
import assert from 'node:assert/strict';
import { practiceBank, dueQuestionsIn, makeSession, gradeSession } from '../src/practice.js';
import { loadTranslationPack } from '../src/content/packs/index.js';
await Promise.all([loadTranslationPack('en'), loadTranslationPack('ar')]); // translation packs load on demand

const languages = ['tr', 'en', 'ar'];
const turkish = practiceBank('tr');

test('the practice bank keeps the same ids and options in every language', () => {
  for (const lang of languages) {
    const bank = practiceBank(lang);
    assert.deepEqual(bank.questionBank.map(q => q.id), turkish.questionBank.map(q => q.id), `${lang} question order`);
    bank.questionBank.forEach((question, i) => {
      const base = turkish.questionBank[i];
      assert.equal(question.options.length, base.options.length, `${lang} ${question.id} option count`);
      assert.equal(question.correct, base.correct, `${lang} ${question.id} correct index`);
      assert.equal(question.kind, base.kind);
    });
  }
});

test('English and Arabic practice questions are actually translated', () => {
  for (const lang of ['en', 'ar']) {
    const bank = practiceBank(lang);
    bank.knowledgeQuestions.forEach((question, i) => {
      assert.notEqual(question.q, turkish.knowledgeQuestions[i].q, `${lang} knowledge ${question.id} stem`);
      assert.notEqual(question.topic, turkish.knowledgeQuestions[i].topic, `${lang} knowledge ${question.id} topic`);
    });
    bank.visualQuestions.forEach((question, i) => {
      assert.notEqual(question.q, turkish.visualQuestions[i].q, `${lang} visual ${question.id} stem`);
      assert.notEqual(question.hint, turkish.visualQuestions[i].hint, `${lang} visual ${question.id} hint`);
      assert.notEqual(question.topic, turkish.visualQuestions[i].topic, `${lang} visual ${question.id} figure title`);
    });
  }
});

test('the practice bank is cached per language instead of being rebuilt', () => {
  assert.equal(practiceBank('en'), practiceBank('en'));
  assert.notEqual(practiceBank('en'), practiceBank('ar'));
});

test('the review queue renders the stored ids in the requested language', () => {
  const notebook = { [turkish.questionBank[0].id]: { misses: 1, streak: 0, due: 0 } };
  const english = dueQuestionsIn('en', notebook);
  assert.equal(english.length, 1);
  assert.equal(english[0].q, practiceBank('en').knowledgeQuestions[0].q);
});

test('sessions and grading still work on a translated bank', () => {
  const session = makeSession(practiceBank('ar').questionBank, 5, () => 0.42);
  assert.equal(session.length, 5);
  const answers = Object.fromEntries(session.map(q => [q.id, q.correct]));
  const result = gradeSession(session, answers);
  assert.equal(result.correct, 5);
  assert.equal(result.blank, 0);
});
