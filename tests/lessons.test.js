import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { notes } from '../src/data.js';
import { lessons, readingMinutes } from '../src/lessons.js';
import { routeFromHash, pageHash, lessonHash } from '../src/routing.js';

test('each of the 12 source PDFs has a structured web study note', () => {
  assert.equal(Object.keys(lessons).length, notes.length);
  for (const note of notes) {
    const lesson = lessons[note.number];
    assert.ok(lesson, note.title);
    assert.ok(lesson.scope && lesson.intro && lesson.subtitle);
    assert.ok(lesson.sections.length >= 4);
    assert.ok(lesson.glossary.length >= 2);
    assert.ok(lesson.review.length >= 1);
    assert.ok(readingMinutes(lesson) >= 2);
  }
});
test('all web sections have source headings, unique anchors and real content', () => {
  for (const lesson of Object.values(lessons)) {
    const ids = lesson.sections.map(s => s.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(!ids.includes('glossary') && !ids.includes('review'));
    for (const section of lesson.sections) {
      assert.ok(section.source && section.title);
      assert.ok(section.paragraphs?.length || section.table?.rows.length || section.bullets?.length);
      if (section.table) {
        for (const row of section.table.rows) assert.equal(row.length, section.table.headers.length);
      }
    }
  }
});
test('every atlas asset is local and exists; no Drive document is needed to read web notes', () => {
  for (const lesson of Object.values(lessons)) {
    assert.match(lesson.image, /^\/(atlas\/)?[\w-]+\.webp$/);
    assert.ok(existsSync(new URL(`../public${lesson.image}`, import.meta.url)), lesson.image);
    assert.ok(lesson.imageAlt.length > 20);
  }
  const files = new Set(Object.values(lessons).map(l => l.image));
  assert.equal(files.size, 10); // existing torso + 9 newly illustrated subjects
});
test('web note URLs round trip and reject invalid lesson numbers', () => {
  for (const note of notes) {
    assert.equal(routeFromHash(lessonHash(note)).lesson.id, note.id);
    assert.equal(routeFromHash(lessonHash(note)).page, 'lesson');
  }
  for (const page of ['home', 'library', 'about', 'saved']) assert.equal(routeFromHash(pageHash(page)).page, page);
  assert.equal(routeFromHash('#/ders/99').page, 'home');
  assert.equal(routeFromHash('#/ders/not-a-number').lesson, null);
});
test('site name is ANATOMİ in title and visible branding', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const app = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8');
  assert.match(html, /<title>ANATOMİ/);
  assert.match(app, /ANATOMİ/);
  assert.doesNotMatch(app, /ANATOM(?!İ)/);
});

test('full web edition preserves all 697 source pages with text and an image fallback', () => {
  const manifest=JSON.parse(readFileSync(new URL('../src/courseManifest.json',import.meta.url),'utf8'));
  let total=0;
  for (const note of notes) {
    const content=JSON.parse(readFileSync(new URL(`../public/course-content/${note.number}.json`,import.meta.url),'utf8'));
    assert.equal(content.sourceId,note.id);
    assert.equal(content.totalPages,manifest[note.number].totalPages);
    assert.equal(content.pages.length,content.totalPages);
    assert.match(content.sourceSha256,/^[a-f0-9]{64}$/);
    for(let i=0;i<content.pages.length;i++) {
      const page=content.pages[i];
      assert.equal(page.number,i+1);
      assert.ok(Array.isArray(page.blocks));
      assert.equal(page.text,page.blocks.join('\n\n'));
      assert.ok(page.title);
      assert.ok(existsSync(new URL(`../public${page.image}`,import.meta.url)),page.image);
      assert.ok(page.width>0 && page.height>0);
    }
    total+=content.totalPages;
  }
  assert.equal(total,697);
});
