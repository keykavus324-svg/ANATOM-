// Original, authored web explanations — not extracted slide text.
import lesson0 from './content/lessons/0.js';
import lesson1 from './content/lessons/1.js';
import lesson2 from './content/lessons/2.js';
import lesson3 from './content/lessons/3.js';
import lesson4 from './content/lessons/4.js';
import lesson5 from './content/lessons/5.js';
import lesson6 from './content/lessons/6.js';
import lesson7 from './content/lessons/7.js';
import lesson8 from './content/lessons/8.js';
import lesson9 from './content/lessons/9.js';
import lesson10 from './content/lessons/10.js';
import lesson11 from './content/lessons/11.js';

export const lessons = {
  0: lesson0,
  1: lesson1,
  2: lesson2,
  3: lesson3,
  4: lesson4,
  5: lesson5,
  6: lesson6,
  7: lesson7,
  8: lesson8,
  9: lesson9,
  10: lesson10,
  11: lesson11,
};

export function readingMinutes(lesson) {
  const text = [lesson.intro, ...lesson.sections.map(s => [s.title, ...(s.paragraphs || []), ...(s.bullets || []), ...(s.table?.rows.flat() || []), s.callout || ''].join(' '))].join(' ');
  return Math.max(2, Math.ceil(text.split(/\s+/).length / 180));
}
