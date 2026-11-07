import test from 'node:test';
import assert from 'node:assert/strict';
import {
  lessonVideos, courseVideos, videoForLesson, featuredVideo, formatDuration,
  drivePreviewUrl, driveViewUrl, VIDEO_FOLDER_ID, FEATURED_VIDEO_ID,
} from '../src/content/videos.js';
import { lessonVideoIn } from '../src/content/videoI18n.js';
import { notes } from '../src/data.js';
import { localizedNote } from '../src/content/localizedContent.js';

test('every published course lesson has exactly one video entry', () => {
  const numbers = courseVideos().map(video => video.lesson).sort((a, b) => a - b);
  assert.deepEqual(numbers, [1, 2, 3, 4, 5, 6, 7]);
  for (const video of courseVideos()) assert.ok(notes.some(note => note.number === video.lesson));
});

test('Drive ids are unique, well formed and points at the instructor folder', () => {
  const ids = lessonVideos.flatMap(video => video.clips ? video.clips.map(clip => clip.id) : [video.id]);
  assert.equal(new Set(ids).size, ids.length, 'a video id is listed twice');
  // Drive file ids are 28–44 URL-safe characters.
  for (const id of ids) assert.match(id, /^[\w-]{28,44}$/, `suspicious id: ${id}`);
  assert.equal(videoForLesson(0).id, FEATURED_VIDEO_ID);
  assert.match(VIDEO_FOLDER_ID, /^[\w-]{28,44}$/);
  assert.equal(drivePreviewUrl('abc'), 'https://drive.google.com/file/d/abc/preview');
  assert.equal(driveViewUrl('abc'), 'https://drive.google.com/file/d/abc/view');
});

test('lesson one is split into page-ranged parts that add up to its duration', () => {
  const video = videoForLesson(1);
  assert.equal(video.clips.length, 6);
  assert.equal(video.playId, video.clips[0].id);
  const sum = video.clips.reduce((total, clip) => total + clip.seconds, 0);
  assert.ok(Math.abs(sum - video.seconds) <= 5, 'clips should add up to the lesson duration');
  for (const clip of video.clips) assert.match(clip.label, /^Sayfa \d{2}–\d{2}$/);
});

test('durations are formatted for people, not as raw seconds', () => {
  assert.equal(formatDuration(233), '3 dk 53 sn');
  assert.equal(formatDuration(1829), '30 dk 29 sn');
  assert.equal(formatDuration(16492), '4 sa 34 dk');
  assert.equal(formatDuration(0), '1 sn');
});

test('video summaries exist in Turkish, English and Arabic', () => {
  for (const video of lessonVideos) {
    for (const lang of ['tr', 'en', 'ar']) assert.ok(video.summary[lang].length > 30, `missing ${lang} summary for lesson ${video.lesson}`);
  }
  // Video titles follow the lesson's own translation and never fall back to a raw key.
  for (const lang of ['tr', 'en', 'ar']) {
    for (const video of courseVideos()) {
      const note = notes.find(item => item.number === video.lesson);
      const info = lessonVideoIn(lang, video, note);
      assert.equal(info.title, localizedNote(note, lang).title);
      assert.ok(info.latin.length > 3);
      assert.ok(info.summary.length > 30);
    }
  }
});

test('the videos page route is registered and reachable', async () => {
  const { routeFromHash, pageHash } = await import('../src/routing.js');
  assert.equal(pageHash('videos'), '#/videolar');
  assert.equal(routeFromHash('#/videolar').page, 'videos');
  assert.equal(routeFromHash('#/videolar').lesson, null);
  // The single combined recording is offered separately from the lesson cards.
  assert.ok(featuredVideo());
  assert.ok(!courseVideos().some(video => video.lesson === 0));
});
