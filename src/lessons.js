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

import { diagrams } from './content/diagrams.js';
import { teachingForLesson } from './content/exam/index.js';
import { examVisuals } from './content/exam/visuals.js';

// Count the visible instructional material, including nested prose and figure keys.
// Navigation, review answers and repeated UI labels are deliberately excluded.
export function lessonWords(lesson) {
  const sectionText = section => {
    const diagram = diagrams[section.diagram];
    return [section.title, ...(section.paragraphs || []), ...(section.bullets || []),
      ...(section.flow || []), ...(section.table?.headers || []),
      ...(section.table?.rows.flat() || []), section.callout || '',
      ...(section.subsections || []).map(sectionText),
      ...(diagram ? [diagram.title, diagram.caption, diagram.takeaway,
        ...diagram.labels.flatMap(label => [label.name, label.text])] : [])].join(' ');
  };
  const number = Object.keys(lessons).find(key => lessons[key] === lesson);
  const additions = number === undefined ? [] : teachingForLesson(number).flatMap(item => {
    const visual = examVisuals[item.visual];
    return [item.title, ...item.paragraphs, ...item.headers, ...item.rows.flat(), item.trap || '',
      ...(visual ? [visual.title, visual.caption, ...visual.labels] : [])];
  });
  const text = [lesson.intro, ...lesson.sections.map(sectionText), ...additions].join(' ').trim();
  return text ? text.split(/\s+/).length : 0;
}
export function readingMinutes(lesson) {
  return Math.max(2, Math.ceil(lessonWords(lesson) / 180));
}
