import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { examTeaching, examSources, teachingForLesson, teachingForSection } from '../src/content/exam/index.js';
import { examVisuals } from '../src/content/exam/visuals.js';
import { lessons, lessonWords } from '../src/lessons.js';

test('42 authored explanations attach to real lesson sections with substantive prose, comparisons and rationales', () => {
  assert.equal(examTeaching.length, 42);
  assert.equal(new Set(examTeaching.map(item => item.id)).size, examTeaching.length);
  for (const item of examTeaching) {
    assert.ok(lessons[item.lesson].sections.some(section => section.id === item.section), item.id);
    assert.ok(item.paragraphs.length >= 2);
    assert.ok(item.paragraphs.join(' ').split(/\s+/).length >= 100, item.id);
    assert.ok(item.headers.length >= 3);
    assert.ok(item.rows.length >= 2);
    for (const row of item.rows) assert.equal(row.length, item.headers.length);
    for (const check of item.checks) {
      assert.ok(check.options.length >= 3);
      assert.equal(new Set(check.options).size, check.options.length);
      assert.ok(Number.isInteger(check.correct) && check.correct >= 0 && check.correct < check.options.length);
      assert.ok(check.why.length > 70, item.id);
    }
    assert.ok(teachingForSection(item.lesson, item.section).includes(item));
  }
  for (let n = 1; n <= 11; n++) assert.ok(teachingForLesson(n).length, `lesson ${n}`);
  assert.equal(teachingForLesson(0).length, 0);
});

test('evidence locators only reference supplied files and respect known PDF page bounds', () => {
  assert.equal(Object.keys(examSources).length, 10);
  for (const item of examTeaching) for (const [key, locator] of item.evidence) {
    const source = examSources[key];
    assert.ok(source, key);
    assert.ok(source.review && source.id && locator);
    if (source.pages) for (const range of locator.split(', ')) {
      const [a, b = a] = range.split('–').map(Number);
      assert.ok(a >= 1 && b >= a && b <= source.pages, `${item.id}/${locator}`);
    }
  }
  assert.match(examSources.b.review, /Çankırı/);
  assert.match(examSources.final1.review, /belirsiz/);
  assert.match(examSources.sinav.review, /okunaksız/);
});

test('6 additional instructional visuals exist with self-contained accessible legends', () => {
  const used = examTeaching.filter(item => item.visual).map(item => item.visual);
  assert.deepEqual([...new Set(used)].sort(), Object.keys(examVisuals).sort());
  assert.equal(used.length, 6);
  for (const [id, figure] of Object.entries(examVisuals)) {
    const svg = readFileSync(new URL(`../public/diagrams/exam/${id}.svg`, import.meta.url), 'utf8');
    assert.match(svg, /viewBox="0 0 760 480"/);
    assert.match(svg, /<title id="title">/);
    assert.match(svg, /<desc id="description">/);
    assert.doesNotMatch(svg, /<script|<image|<foreignObject|href=/);
    assert.ok(figure.caption.length > 100);
    for (const label of figure.labels) assert.ok(svg.includes(label));
  }
});

test('reading time counts added teaching and visual keys exactly once, without counting quiz UI', () => {
  for (let n = 1; n <= 11; n++) {
    const lesson = lessons[n];
    const baseWords = lessonWords(structuredClone(lesson));
    const additions = teachingForLesson(n).flatMap(item => {
      const figure = examVisuals[item.visual];
      return [item.title, ...item.paragraphs, ...item.headers, ...item.rows.flat(), item.trap || '', ...(figure ? [figure.title, figure.caption, ...figure.labels] : [])];
    }).join(' ').trim().split(/\s+/).length;
    assert.equal(lessonWords(lesson), baseWords + additions);
  }
});

test('known unreliable answer markings are corrected instead of repeated as authoritative keys', () => {
  const text = id => JSON.stringify(examTeaching.find(item => item.id === id));
  assert.match(text('humerus-distal-tanima'), /capitulum distal humerusta gerçekten vardır/);
  assert.match(text('eklem-yapi-ayrimi'), /temel ayırıcı özelliği eklem boşluğudur/);
  assert.match(text('atlas-axis-bolge-farki'), /ön arkusunun arka yüzündeki fovea dentis/);
  assert.match(text('kalp-venoz-donus'), /kalp kasının venöz dönüşünün büyük bölümünü/);
  assert.match(text('uyluk-iki-eklem'), /kalçada fleksör, dizde ekstansördür/);
  assert.equal(existsSync(new URL('../public/google_drive', import.meta.url)), false);
});
