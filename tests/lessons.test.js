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

test('editorial reference archive preserves 697 source pages without shipping them in public/', () => {
  const manifest=JSON.parse(readFileSync(new URL('../src/courseManifest.json',import.meta.url),'utf8'));
  let total=0;
  for (const note of notes) {
    const content=JSON.parse(readFileSync(new URL(`../reference/course-content/${note.number}.json`,import.meta.url),'utf8'));
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
      assert.ok(existsSync(new URL(`../reference/course-content/${page.image}`,import.meta.url)),page.image);
      assert.ok(page.width>0 && page.height>0);
    }
    total+=content.totalPages;
  }
  assert.equal(total,697);
});

test('authored chapters cover previously omitted regional and distal topics', () => {
  const required={
    0:['Prometheus'], 1:['latince','bolgeler','bosluklar'], 2:['pelvis','aksiyel'],
    3:['usteklemler','alteklemler','aksiyel-eklemler','klinik-terimler'],
    4:['scaphoideum','naviculare','tuberculum supraglenoidale'],
    5:['canalis opticus','foramen jugulare','linea','promontorium'],
    6:['fasya','sirt','govde','omuzkol','elkas','kalca','uyluk','bacak'],
    7:['ileti','arter-agaci','venler','lenf'],
    8:['dilsinir','pharynx','oesophagus','mide','duodenum','jejunum-ileum','kolon','rectum','hepar','pankreas','portal'],
    9:['omurilik','meninks','kraniyal'], 10:['vagina','vulva','epididymis'],
    11:['toraks','diaphragma','hilum','rima glottidis']
  };
  for(const [n,terms]of Object.entries(required)){
    const text=JSON.stringify(lessons[n]).toLocaleLowerCase('tr-TR');
    for(const term of terms) assert.ok(text.includes(term.toLocaleLowerCase('tr-TR')), `${n}: missing ${term}`);
  }
  const text=JSON.stringify(lessons);
  assert.doesNotMatch(text,/Bölgesel kasların tümü bu özette yer almaz|Mide, bağırsak ve yardımcı organların ayrıntıları için PDF/);
  assert.ok(Object.values(lessons).reduce((n,l)=>n+l.sections.length,0)>100);
});

test('every authored section references real source page ranges', () => {
  const manifest=JSON.parse(readFileSync(new URL('../src/courseManifest.json',import.meta.url),'utf8'));
  for(const [n,l]of Object.entries(lessons)){
    for(const section of l.sections){
      assert.ok(section.sourcePages, `${n}/${section.id}`);
      for(const part of section.sourcePages.split(', ')){
        const [a,b=a]=part.split('–').map(Number);
        assert.ok(a>=1 && a<=b && b<=manifest[n].totalPages, `${n}/${section.id}: ${part}`);
      }
    }
  }
  assert.equal(existsSync(new URL('../public/course-content',import.meta.url)),false);
});

test('corrected teaching distinctions are explicit and legacy dump UI is absent', () => {
  assert.match(JSON.stringify(lessons[8]),/birbirinden kesin çizgilerle ayrılmış adacıklarda algılanmaz/);
  assert.match(JSON.stringify(lessons[9]),/31 spinal segment/);
  assert.match(JSON.stringify(lessons[10]),/Görünümü cinsel ilişki geçmişini kanıtlamaz/);
  const ui=readFileSync(new URL('../src/LessonPage.jsx',import.meta.url),'utf8');
  assert.doesNotMatch(ui,/FullCourseContent|edition-switch|Kaynağın tamamı|Hızlı tekrar/);
});
