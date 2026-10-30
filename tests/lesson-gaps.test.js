import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/lessons.js';
import { studyGuides } from '../src/content/studyGuides.js';
import { lessonIn, guideIn } from '../src/content/lessonI18n.js';
import { lessonGaps } from '../src/content/lessons/i18n/gaps/index.js';

// Every string a gap dictionary can replace must still exist in the Turkish source;
// otherwise the entry is dead and would silently stop translating.
function strings(value, out = new Set()) {
  if (typeof value === 'string') out.add(value);
  else if (Array.isArray(value)) value.forEach(item => strings(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach(item => strings(item, out));
  return out;
}

test('gap dictionaries only name real Turkish source strings with both translations', () => {
  for (const [number, gaps] of Object.entries(lessonGaps)) {
    const source = strings(lessons[number]);
    for (const [turkish, value] of Object.entries(gaps)) {
      assert.ok(source.has(turkish), `lesson ${number}: "${turkish.slice(0, 40)}" is not in the Turkish source`);
      for (const lang of ['en', 'ar']) {
        assert.ok(value[lang]?.trim(), `lesson ${number}: missing ${lang} for "${turkish.slice(0, 40)}"`);
      }
    }
  }
});

test('translated lessons and guides no longer contain the gap source strings', () => {
  for (const [number, gaps] of Object.entries(lessonGaps)) {
    for (const lang of ['en', 'ar']) {
      const leftovers = [...strings(lessonIn(lang, Number(number), lessons[number])), ...strings(guideIn(lang, Number(number), studyGuides[number]))]
        .filter(text => Object.hasOwn(gaps, text));
      assert.deepEqual(leftovers, [], `lesson ${number} ${lang} still shows Turkish`);
    }
  }
});
