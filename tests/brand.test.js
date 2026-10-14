import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('selected anatomy branding has local vector assets and a matching non-atom favicon', () => {
  for(const name of ['brand/anatomi-logo.svg','brand/anatomi-mark.svg','brand/anatomi-mark-small.svg','favicon.svg']) {
    const svg=readFileSync(new URL(`../public/${name}`,import.meta.url),'utf8');
    assert.match(svg, /<svg[^>]+viewBox=/);
    assert.match(svg, /<title[^>]*>ANATOMİ/);
    assert.match(svg, /<path /);
    assert.doesNotMatch(svg, /<script|<image|<foreignObject|<ellipse|href=/);
  }
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  assert.match(html, /href="\/favicon.svg"/);
});
