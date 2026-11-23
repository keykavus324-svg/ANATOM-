import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RemoteError,
  fetchBoard,
  getActorId,
  removePost,
  sendComment,
  sendPost,
  setLiked,
} from '../src/forum/remote.js';
import { isRemoteConfigured } from '../src/forum/config.js';

const realFetch = globalThis.fetch;
function memoryStorage(seed = {}) {
  const data = { ...seed };
  return { getItem: key => (key in data ? data[key] : null), setItem: (key, value) => { data[key] = String(value); }, dump: () => ({ ...data }) };
}
function stubFetch(handler) { globalThis.fetch = async (...args) => handler(...args); }
test.after(() => { globalThis.fetch = realFetch; });

test('the forum ships a publishable Supabase endpoint', () => {
  assert.equal(isRemoteConfigured(), true);
});

test('the actor id is one stable uuid per device and survives bad records', () => {
  const storage = memoryStorage();
  const first = getActorId(storage);
  assert.match(first, /^[0-9a-f-]{36}$/);
  assert.equal(getActorId(storage), first);
  const other = memoryStorage({ 'anatomi-topluluk-aktor': '{bozuk' });
  assert.notEqual(getActorId(other), first);
});

test('the board request embeds comments and like actors in one call', async () => {
  // Bu süreçteki varsayılan aktörü alıp yorumci bu kimliği kullanır.
  const actor = getActorId();
  let seen;
  stubFetch(async (url, options) => {
    seen = { url: String(url), options };
    return {
      ok: true,
      json: async () => [{
        id: 7, author: 'Elif', actor: 'baskabiri', kind: 'soru', tag: 'osteologia', lesson: 5,
        title: 'Başlık', body: 'Soru metni', pinned: false, created_at: '2026-11-23T18:00:00Z',
        forum_comments: [{ id: 11, author: 'Kerem', body: 'Yorum', created_at: '2026-11-23T18:05:00Z' }],
        forum_likes: [{ actor }, { actor: 'actor-2' }],
      }],
    };
  });
  const board = await fetchBoard();
  assert.match(seen.url, /forum_posts\?select=\*,forum_comments\(\*\),forum_likes\(actor\)/);
  assert.match(seen.url, /order=pinned\.desc,created_at\.desc/);
  assert.equal(seen.options.headers.apikey.length > 0, true);
  assert.equal(seen.options.headers['x-anatom-actor'], actor);
  assert.equal(board[0].id, '7');
  assert.equal(board[0].likes, 2);
  assert.equal(board[0].liked, true, 'this device has already liked it');
  assert.equal(board[0].comments.length, 1);
  assert.equal(board[0].comments[0].author, 'Kerem');
  assert.equal(board[0].actor, 'baskabiri');
});

test('publishing sends a clean payload and returns empty title as null', async () => {
  let body;
  stubFetch(async (url, options) => { body = JSON.parse(options.body); return { ok: true, json: async () => [] }; });
  await sendPost({ author: 'Elif', kind: 'not', tag: 'genel', lesson: null, title: '', body: 'Kendi cümlelerimle not' });
  assert.equal(body.title, null);
  assert.equal(body.lesson, null);
  assert.equal(body.author, 'Elif');
  assert.match(body.actor, /^[0-9a-f-]{36}$/);
});

test('likes add and remove by the actor row, and deletes cascade on the post', async () => {
  const calls = [];
  stubFetch(async (url, options) => { calls.push({ url: String(url), method: options.method, body: options.body }); return { ok: true, json: async () => [] }; });
  const actor = getActorId();
  await setLiked('7', false);
  assert.match(calls[0].url, /\/rest\/v1\/forum_likes$/);
  assert.equal(calls[0].method, 'POST');
  assert.equal(JSON.parse(calls[0].body).post_id, 7);
  assert.equal(JSON.parse(calls[0].body).actor, actor);
  await setLiked('7', true);
  assert.match(calls[1].url, /\/rest\/v1\/forum_likes\?post_id=eq\.7&actor=eq\./);
  assert.equal(calls[1].method, 'DELETE');
  await removePost('7');
  assert.match(calls[2].url, /\/rest\/v1\/forum_posts\?id=eq\.7$/);
  await sendComment('7', { author: 'Elif', body: 'Merhaba' });
  assert.equal(JSON.parse(calls[3].body).post_id, 7);
});

test('server refusals and broken networks surface as RemoteError', async () => {
  stubFetch(async () => ({ ok: false, status: 400, json: async () => ({ message: 'new row violates check constraint' }) }));
  await assert.rejects(() => sendPost({ author: 'A', kind: 'soru', tag: 'genel', lesson: null, title: null, body: 'Kısa' }), error => error instanceof RemoteError && /check constraint/.test(error.message));
  stubFetch(async () => { throw new TypeError('offline'); });
  await assert.rejects(() => fetchBoard(), error => error instanceof RemoteError && error.message === 'network');
});
