import test from 'node:test';
import assert from 'node:assert/strict';
import { bookCollections } from '../src/bookCollections.js';

test('four distinct external book collections have complete metadata and HTTPS links', () => {
  assert.equal(bookCollections.length, 4);
  assert.equal(new Set(bookCollections.map(c => c.id)).size, 4);
  for (const collection of bookCollections) {
    assert.ok(collection.title && collection.provider);
    const url = new URL(collection.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(['drive.google.com', 'mega.nz'].includes(url.hostname));
  }
});

test('access keys and the nested MEGA folder are preserved exactly', () => {
  assert.equal(new URL(bookCollections[1].url).searchParams.get('resourcekey'), '0-QD1INQLSsFcwb7zvxjWs9Q');
  assert.equal(new URL(bookCollections[2].url).hash, '#IOhBn4fsvgHUfMJCZ0LIdQ/folder/umx0mQ7I');
});

test('books reported as requiring access are excluded without removing other editions', async () => {
  const { books } = await import('../src/books.js');
  const removed = ['0B4-iIcP4qnKYTmN0R3l6R2IyOFE', '0B4-iIcP4qnKYbDN3andhZm1SUGM', '0B4-iIcP4qnKYOW5Vc2tWeTNfaXM'];
  for (const id of removed) assert.ok(!books.some(book => book.id === id));
  assert.ok(books.some(book => book.id === '1Us2SHHn012eUKap4-fGqY4M3-H8Lwps8'));
  assert.ok(books.some(book => book.id === '1hBaXF0Ul37Z1g187pt4z6s3yaEK17auB'));
});
