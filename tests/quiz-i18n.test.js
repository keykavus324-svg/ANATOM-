import test from 'node:test';
import assert from 'node:assert/strict';
import { quizSets, quizQuestions } from '../src/content/quizBank.js';
import { quizDiagrams } from '../src/content/quizDiagrams.js';
import { quizSetIn, quizSetsIn, quizQuestionsIn, quizFigureIn, findQuizSetIn, TRANSLATED_QUIZ } from '../src/content/quizI18n.js';
import { loadTranslationPack } from '../src/content/packs/index.js';
await Promise.all([loadTranslationPack('en'), loadTranslationPack('ar')]); // translation packs load on demand

const setIds = quizSets.map(set => set.id);
const questionIds = Object.values(quizQuestions).flat().map(question => question.id);

test('every quiz set and question has an English and an Arabic version', () => {
  for (const id of questionIds) {
    assert.ok(TRANSLATED_QUIZ.en.includes(id), `${id} has no English text`);
    assert.ok(TRANSLATED_QUIZ.ar.includes(id), `${id} has no Arabic text`);
  }
  assert.deepEqual([...TRANSLATED_QUIZ.en].sort(), [...questionIds].sort());
  assert.deepEqual([...TRANSLATED_QUIZ.ar].sort(), [...questionIds].sort());
});

test('translated quiz sets keep their ids and diagrams', () => {
  for (const lang of ['en', 'ar']) {
    const sets = quizSetsIn(lang);
    assert.deepEqual(sets.map(set => set.id), setIds);
    sets.forEach((set, i) => {
      assert.notEqual(set.title, quizSets[i].title, `${lang} ${set.id} title is untranslated`);
      assert.notEqual(set.description, quizSets[i].description, `${lang} ${set.id} description is untranslated`);
      assert.equal(set.diagram, quizSets[i].diagram);
      assert.equal(set.lesson, quizSets[i].lesson);
    });
    assert.equal(findQuizSetIn(lang, 'kas').title, sets.find(set => set.id === 'kas').title);
  }
});

test('translated questions keep the option order and the correct index', () => {
  for (const lang of ['en', 'ar']) {
    for (const setId of setIds) {
      const base = quizQuestions[setId];
      const merged = quizQuestionsIn(lang, setId);
      assert.equal(merged.length, base.length, `${lang} ${setId} question count`);
      merged.forEach((question, i) => {
        assert.equal(question.id, base[i].id);
        assert.equal(question.options.length, base[i].options.length, `${lang} ${question.id} option count`);
        assert.equal(question.correct, base[i].correct, `${lang} ${question.id} correct index`);
        assert.notEqual(question.text, base[i].text, `${lang} ${question.id} question text`);
        assert.notEqual(question.why, base[i].why, `${lang} ${question.id} explanation`);
        assert.notEqual(question.topic, base[i].topic, `${lang} ${question.id} topic`);
      });
    }
  }
});

test('quiz figures are translated and the figure file names stay the same', () => {
  for (const lang of ['en', 'ar']) {
    for (const [id, base] of Object.entries(quizDiagrams)) {
      const merged = quizFigureIn(lang, id);
      assert.notEqual(merged.title, base.title, `${lang} ${id} title`);
      assert.equal(merged.labels.length, base.labels.length, `${lang} ${id} label count`);
      merged.labels.forEach((label, i) => {
        assert.notEqual(label.text, base.labels[i].text, `${lang} ${id} label ${i}`);
      });
    }
    // A diagram that belongs to the lesson set is served by the lesson translator.
    const lessonFigure = quizFigureIn(lang, 'planes');
    assert.ok(lessonFigure, 'a lesson diagram must still resolve');
    assert.equal(lessonFigure.labels.length, 3);
  }
});

test('an unknown language falls back to the Turkish quiz', () => {
  assert.deepEqual(quizSetsIn('xx').map(set => set.title), quizSets.map(set => set.title));
  const base = quizQuestions.temel;
  assert.deepEqual(quizQuestionsIn('xx', 'temel').map(question => question.text), base.map(question => question.text));
  assert.equal(quizFigureIn('xx', 'eye'), quizDiagrams.eye);
  assert.equal(quizSetIn('xx', quizSets[0]), quizSets[0]);
});
