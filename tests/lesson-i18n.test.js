import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/lessons.js';
import { studyGuides } from '../src/content/studyGuides.js';
import { teachingForLesson } from '../src/content/exam/index.js';
import { lessonIn, guideIn, teachingIn, lessonTranslation, TRANSLATED_LESSONS, hasLessonTranslation } from '../src/content/lessonI18n.js';

test('a translated lesson replaces every readable field and keeps the structure', () => {
  for (const lang of ['en', 'ar']) {
    for (const number of TRANSLATED_LESSONS[lang]) {
      const base = lessons[number];
      const merged = lessonIn(lang, number, base);
      assert.equal(merged.sections.length, base.sections.length);
      assert.deepEqual(merged.sections.map(s => s.id), base.sections.map(s => s.id));
      assert.deepEqual(merged.sections.map(s => s.sourcePages), base.sections.map(s => s.sourcePages));
      assert.notEqual(merged.subtitle, base.subtitle, `${lang} lesson ${number} subtitle is not translated`);
      merged.sections.forEach((section, i) => {
        const original = base.sections[i];
        assert.equal(section.paragraphs.length, original.paragraphs.length);
        if (original.table) {
          assert.equal(section.table.rows.length, original.table.rows.length);
        }
        if (original.callout) assert.ok(section.callout);
        (original.subsections || []).forEach((sub, j) => {
          assert.equal(section.subsections[j].paragraphs.length, sub.paragraphs.length);
        });
      });
      assert.equal(merged.review.length, base.review.length);
      assert.equal(merged.glossary.length, base.glossary.length);
    }
  }
});

test('English and Arabic lesson text no longer copies the Turkish prose', () => {
  for (const lang of ['en', 'ar']) {
    for (const number of TRANSLATED_LESSONS[lang]) {
      const base = lessons[number];
      const merged = lessonIn(lang, number, base);
      const turkishParagraphs = new Set(base.sections.flatMap(s => s.paragraphs));
      const translated = merged.sections.flatMap(s => s.paragraphs);
      const stillTurkish = translated.filter(p => turkishParagraphs.has(p));
      assert.deepEqual(stillTurkish, [], `${lang} lesson ${number} still shows Turkish paragraphs`);
    }
  }
});

test('study guides and exam teaching are translated together with the lesson', () => {
  for (const lang of ['en', 'ar']) {
    for (const number of TRANSLATED_LESSONS[lang]) {
      const patch = lessonTranslation(lang, number);
      const guide = studyGuides[number];
      if (guide) {
        assert.ok(patch.guide, `${lang} lesson ${number} has a study guide but no translation`);
        const merged = guideIn(lang, number, guide);
        for (const key of ['goal', 'explanation', 'task', 'answer', 'mistake']) {
          assert.ok(merged[key] && merged[key].trim().length > 0);
          if (lang === 'en') assert.notEqual(merged[key], guide[key]);
        }
      }
      const items = teachingForLesson(number);
      if (items.length) {
        const merged = teachingIn(lang, number, items);
        assert.equal(merged.length, items.length);
        merged.forEach((item, i) => {
          assert.notEqual(item.title, items[i].title, `${lang} ${items[i].id} title is untranslated`);
          assert.equal(item.paragraphs.length, items[i].paragraphs.length);
          assert.equal(item.rows.length, items[i].rows.length);
          assert.equal(item.checks.length, items[i].checks.length);
        });
      }
    }
  }
});

test('a missing translation falls back to the Turkish lesson instead of breaking', () => {
  const base = lessons[2];
  assert.equal(hasLessonTranslation('en', 2), false);
  const merged = lessonIn('en', 2, base);
  assert.equal(merged, base);
  assert.equal(lessonTranslation('xx', 0), null);
});

test('English lesson bodies are not leftover Turkish sentences', () => {
  const turkishWords = /\b(ve|ile|için|olarak|bulunur|değildir|gerekir)\b/;
  for (const number of TRANSLATED_LESSONS.en) {
    const merged = lessonIn('en', number, lessons[number]);
    const texts = [merged.subtitle, merged.intro, ...merged.sections.flatMap(s => [s.title, ...s.paragraphs])];
    for (const text of texts) {
      assert.equal(turkishWords.test(text), false, `Turkish wording in English lesson ${number}: ${text.slice(0, 60)}`);
    }
  }
});
