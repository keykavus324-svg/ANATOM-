import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COMMUNITY_STORAGE_KEY,
  addComment,
  countComments,
  createPost,
  createUid,
  filterPosts,
  initialsOf,
  isBoard,
  readBoard,
  relativeAgeParts,
  removePost,
  sortPosts,
  toggleLike,
  welcomePost,
  writeBoard,
} from '../src/forum/community.js';
import { pageHash, routeFromHash } from '../src/routing.js';

function memoryStorage(seed = {}) {
  const data = { ...seed };
  return {
    getItem: key => (key in data ? data[key] : null),
    setItem: (key, value) => { data[key] = String(value); },
    dump: () => ({ ...data }),
  };
}

const draft = {
  author: 'Elif',
  kind: 'soru',
  tag: 'osteologia',
  lesson: 5,
  title: 'Processus styloideus nerededir?',
  body: 'Kafatası lekesinde styloid sürecin tutkunu hangi kas?',
};

test('the community board has its own route and hash', () => {
  assert.equal(pageHash('community'), '#/topluluk');
  assert.equal(routeFromHash('#/topluluk').page, 'community');
});

test('first visit seeds one pinned welcome post and nothing else', () => {
  const board = [welcomePost(1000)];
  assert.ok(isBoard(board));
  assert.equal(board.length, 1);
  assert.equal(board[0].pinned, true);
  assert.equal(board[0].id, 'topluluk-hos-geldin');
  assert.ok(board[0].body.length > 40);
  assert.deepEqual(board[0].comments, []);
});

test('the board round-trips through the device storage under a stable key', () => {
  const storage = memoryStorage();
  const board = [welcomePost(5)];
  assert.equal(writeBoard(storage, board), true);
  assert.ok(storage.dump()[COMMUNITY_STORAGE_KEY]);
  assert.deepEqual(readBoard(storage), board);
  assert.equal(readBoard(memoryStorage({ [COMMUNITY_STORAGE_KEY]: '{bozuk' })), null);
  assert.deepEqual(readBoard(memoryStorage({ [COMMUNITY_STORAGE_KEY]: '[]' })), [], 'an emptied board stays empty');
});

test('filtering covers kind, tag and folded Turkish search', () => {
  const board = [
    { ...draft, id: 'a', createdAt: 3, comments: [], body: 'Processus styloideus nerede bulunur?' },
    { ...createPost([], { ...draft, title: '', body: 'Gluteal bölgede triseps tutkunu' }).post, id: 'b', createdAt: 2, kind: 'not', tag: 'myologia' },
    { ...createPost([], { ...draft, title: '', body: 'Sodyum kanalı hakkında not' }).post, id: 'c', createdAt: 1, kind: 'not', tag: 'genel' },
  ];
  assert.equal(filterPosts(board, { kind: 'soru' }).length, 1);
  assert.equal(filterPosts(board, { tag: 'myologia' }).length, 1);
  assert.equal(filterPosts(board, { query: 'STYLOIDEUS' }).length, 1, 'Latin terms are searched case-insensitively');
  assert.equal(filterPosts(board, { query: 'triseps' }).length, 1);
  assert.equal(filterPosts(board, { query: 'sodyum' }).length, 1);
  assert.equal(filterPosts(board, { query: 'öyle bir şey yok' }).length, 0);
});

test('sorting keeps the pinned post first and honours new or popular order', () => {
  const base = [welcomePost(1), createPost([], draft).post, createPost([], { ...draft, body: 'Başka bir paylaşım' }).post];
  base[1].likes = 9;
  assert.equal(sortPosts(base, 'new')[0].id, 'topluluk-hos-geldin');
  assert.equal(sortPosts(base, 'popular')[0].id, 'topluluk-hos-geldin');
  assert.equal(sortPosts(base.slice(1), 'popular')[0].likes, 9);
  assert.ok(sortPosts(base, 'new')[1].createdAt >= sortPosts(base, 'new')[2].createdAt);
});

test('createPost validates identity and length, caps the tag and returns the post on top', () => {
  assert.equal(createPost([], { ...draft, author: '' }).error, 'author');
  assert.equal(createPost([], { ...draft, body: '  ' }).error, 'body');
  assert.equal(createPost([], { ...draft, body: 'x'.repeat(2001) }).error, 'tooLong');
  const result = createPost([welcomePost(1)], { ...draft, tag: 'bilinmeyen-etiket', lesson: 99 });
  assert.equal(result.ok, true);
  assert.equal(result.board[0].id, result.post.id);
  assert.equal(result.post.tag, 'genel', 'unknown tags fall back to general');
  assert.equal(result.post.lesson, null, 'lesson links stay inside 1-11');
  assert.equal(result.post.pinned, false);
  assert.ok(result.post.id && result.post.createdAt > 0);
});

test('likes toggle once per click and never drop below zero', () => {
  let board = [{ ...welcomePost(), likes: 1, liked: false }];
  board = toggleLike(board, board[0].id);
  assert.equal(board[0].likes, 2);
  assert.equal(board[0].liked, true);
  board = toggleLike(board, board[0].id);
  assert.equal(board[0].likes, 1);
  board = [{ ...welcomePost(), likes: 0, liked: false }];
  board = toggleLike(board, board[0].id);
  board = toggleLike(board, board[0].id);
  assert.equal(board[0].likes, 0);
});

test('comments require both a name and text, and count across the board', () => {
  const seeded = [welcomePost()];
  assert.equal(addComment(seeded, seeded[0].id, { author: '', body: 'merhaba' }).error, 'author');
  assert.equal(addComment(seeded, seeded[0].id, { author: 'Kerem', body: '' }).error, 'body');
  const added = addComment(seeded, seeded[0].id, { author: 'Kerem', body: 'Styloid sürece triceps?' });
  assert.equal(added.ok, true);
  assert.equal(added.board[0].comments.length, 1);
  assert.equal(countComments(added.board), 1);
  assert.equal(countComments(removePost(added.board, seeded[0].id)), 0);
});

test('relative ages and display initials follow Turkish spelling', () => {
  const now = 1_000_000_000_000;
  assert.equal(relativeAgeParts(now - 30_000, now).unit, 'now');
  assert.equal(relativeAgeParts(now - 5 * 60_000, now).n, 5);
  assert.equal(relativeAgeParts(now - 3 * 3_600_000, now).unit, 'hour');
  assert.equal(relativeAgeParts(now - 2 * 86_400_000, now).unit, 'day');
  assert.equal(relativeAgeParts(now - 3 * 7 * 86_400_000, now).unit, 'week');
  assert.equal(relativeAgeParts(now - 60 * 86_400_000, now).unit, 'month');
  assert.equal(initialsOf('Elif Yılmaz'), 'EY');
  assert.equal(initialsOf('  '), '·');
  assert.match(createUid(), /^p-/);
});
