import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { lessons, lessonWords } from '../src/lessons.js';
import { diagrams } from '../src/content/diagrams.js';

test('each clinical chapter has authored explanatory subsections, not source-page embeds', () => {
  let count = 0;
  for (const [number, lesson] of Object.entries(lessons)) {
    if (number === '0') continue;
    for (const section of lesson.sections) {
      assert.ok(section.subsections?.length, `${number}/${section.id}`);
      for (const subsection of section.subsections) {
        count++;
        assert.ok(subsection.title.length > 10);
        assert.ok(subsection.paragraphs.length >= 2);
        assert.ok(subsection.paragraphs.join(' ').split(/\s+/).length >= 65, `${number}/${section.id}`);
        if (subsection.table) {
          assert.ok(subsection.table.headers.length >= 2);
          for (const row of subsection.table.rows) assert.equal(row.length, subsection.table.headers.length);
        }
      }
    }
  }
  assert.equal(count, 230);
});

test('26 original local diagrams are attached to relevant lessons with complete text legends', () => {
  const used = [];
  for (const [number, lesson] of Object.entries(lessons)) {
    const figures = lesson.sections.filter(s => s.diagram).map(s => s.diagram);
    if (number !== '0') assert.ok(figures.length >= 2, number);
    used.push(...figures);
  }
  assert.equal(used.length, 26);
  assert.deepEqual([...used].sort(), Object.keys(diagrams).sort());
  for (const id of used) {
    const figure = diagrams[id];
    assert.ok(figure.caption.length > 60 && figure.takeaway.length > 40);
    assert.ok(figure.labels.length >= 3);
    const svg = readFileSync(new URL(`../public/diagrams/${id}.svg`, import.meta.url), 'utf8');
    assert.match(svg, /viewBox="0 0 760 460"/);
    assert.match(svg, /<title id="title">/);
    assert.match(svg, /<desc id="description">/);
    assert.doesNotMatch(svg, /<script|<foreignObject|<image|href="https?:/);
    figure.labels.forEach((label, i) => {
      assert.ok(label.name && label.text.length > 20);
      assert.ok(svg.includes(`${i + 1}. ${label.name}:`), `${id} legend ${i + 1}`);
      assert.match(svg, new RegExp(`font-size="15"[^>]*>${i + 1}</text>`), `${id} callout ${i + 1}`);
    });
  }
});

test('reading-time calculation includes nested explanations, table headers and figure legends once', () => {
  const base = { intro: 'bir iki', sections: [{title: 'üç', paragraphs: ['dört beş']}] };
  assert.equal(lessonWords(base), 5);
  const nested = structuredClone(base);
  nested.sections[0].subsections = [{title: 'alt', paragraphs: ['yedi sekiz'], table: {headers: ['A', 'B'], rows: [['C', 'D']]}}];
  assert.equal(lessonWords(nested), 12);
  const withDiagram = structuredClone(base);
  withDiagram.sections[0].diagram = 'planes';
  const diagram = diagrams.planes;
  const text = [diagram.title, diagram.caption, diagram.takeaway, ...diagram.labels.flatMap(l => [l.name,l.text])].join(' ');
  assert.equal(lessonWords(withDiagram), 5 + text.trim().split(/\s+/).length);
  assert.equal(lessonWords({intro: '', sections: []}), 0);
});

test('enriched edition retains source references and exceeds the short edition without counting UI duplication', () => {
  assert.equal(Object.values(lessons).reduce((n,l) => n + l.sections.length, 0), 119);
  assert.equal(Object.values(lessons).reduce((n,l) => n + l.review.length, 0), 58);
  assert.ok(Object.values(lessons).reduce((n,l) => n + lessonWords(l), 0) > 44000);
  for (const lesson of Object.values(lessons)) {
    assert.equal(new Set(lesson.review.map(q => q.q)).size, lesson.review.length);
    for (const section of lesson.sections) assert.ok(section.sourcePages && section.source);
  }
});

test('every clinical chapter has an individually authored full-course expansion and source-topic mapping', () => {
  const coverage = JSON.parse(readFileSync(new URL('../docs/full-course-coverage.json', import.meta.url),'utf8'));
  assert.equal(coverage.chapters.length, 115);
  assert.equal(new Set(coverage.chapters.map(c => `${c.lesson}/${c.chapter}`)).size,115);
  for (const item of coverage.chapters) {
    const section = lessons[item.lesson].sections.find(s => s.id === item.chapter);
    assert.ok(section, `${item.lesson}/${item.chapter}`);
    assert.equal(section.sourcePages, item.sourcePages);
    assert.ok(section.subsections.length >= 2);
    assert.deepEqual(item.addedHeadings, section.subsections.slice(1).map(s => s.title));
    assert.equal(new Set(section.subsections.map(s => s.title)).size, section.subsections.length);
  }
});

test('regional explanations include concrete relationships, not just a longer introductory summary', () => {
  const expected = {
    1:['decubitus','Proximalis','Foramina'],
    2:['osteon','endokondral','moment kolu'],
    3:['costoclavicular','conoid','pubofemoral','calcaneofibular'],
    4:['sustentaculum tali','conoid','karpal'],
    5:['Foramen spinosum','lamina papyracea','intervertebral'],
    6:['Motor ünite','flexor digitorum superficialis','pes anserinus','Transversospinal'],
    7:['thoracic duct','ductus venosus','azygos','İnteratrial'],
    8:['myenteric','Brunner','pectinate','hepatic arter'],
    9:['transdüksiyon','internal capsule','C8','arachnoid granulation'],
    10:['pampiniform','suspensory','cardinal','paraurethral'],
    11:['surfactant','Costodiaphragmatic','cricoarytenoid','alveolar duct'],
  };
  for (const [n,terms] of Object.entries(expected)) {
    const lesson = JSON.stringify(lessons[n]).toLocaleLowerCase('tr-TR');
    for(const term of terms) assert.ok(lesson.includes(term.toLocaleLowerCase('tr-TR')), `${n}: ${term}`);
  }
});
