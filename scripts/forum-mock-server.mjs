// PostgREST taklidi: topluluk panosunun arka uç akışını CI/bölge dışı ortamda
// sınamak için bellek içinde çalışan küçük bir sunucu.
//
//   node scripts/forum-mock-server.mjs            # 8799 portunda başlatır
//   npm run test:forum                            # bunu başlatıp uçtan uca sınar
//
// Gerçek istek biçimi src/forum/remote.js ile aynıdır: gönderiler tek istekte
// gömülü yorumları ve beğeni aktörlerini döner.
import http from 'node:http';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

export function createForumMock({ port = 8799, seedWelcome = true } = {}) {
  const state = {
    posts: seedWelcome ? [
      { id: 1, author: 'ANATOMİ', actor: null, kind: 'soru', tag: 'genel', lesson: null, title: 'Topluluk nereden başlar?', body: 'Bu satır, sınıfın ortak çalışma panosudur.', pinned: true, created_at: '2026-11-23T00:00:00Z' },
    ] : [],
    comments: [], likes: [], nextPost: 2, nextComment: 1,
  };
  const send = (res, code, payload) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(payload)); };
  const board = () => state.posts.map(post => ({
    ...post,
    forum_comments: state.comments.filter(comment => comment.post_id === post.id),
    forum_likes: state.likes.filter(like => like.post_id === post.id),
  })).sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.created_at) - new Date(a.created_at));
  const readBody = req => new Promise(resolve => { let raw = ''; req.on('data', chunk => { raw += chunk; }); req.on('end', () => resolve(raw ? JSON.parse(raw) : {})); });

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    try {
      if (req.method === 'GET' && url.pathname.endsWith('/forum_posts')) return send(res, 200, board());
      if (req.method === 'POST' && url.pathname.endsWith('/forum_posts')) {
        const body = await readBody(req);
        state.posts.push({ id: state.nextPost++, author: body.author, actor: body.actor ?? null, kind: body.kind, tag: body.tag, lesson: body.lesson ?? null, title: body.title ?? null, body: body.body, pinned: false, created_at: new Date().toISOString() });
        return send(res, 201, []);
      }
      if (req.method === 'DELETE' && url.pathname.endsWith('/forum_posts')) {
        const id = Number(url.searchParams.get('id').replace('eq.', ''));
        state.posts = state.posts.filter(post => post.id !== id);
        state.comments = state.comments.filter(comment => comment.post_id !== id);
        state.likes = state.likes.filter(like => like.post_id !== id);
        return send(res, 204, []);
      }
      if (req.method === 'POST' && url.pathname.endsWith('/forum_comments')) {
        const body = await readBody(req);
        state.comments.push({ id: state.nextComment++, post_id: body.post_id, author: body.author, actor: body.actor ?? null, body: body.body, created_at: new Date().toISOString() });
        return send(res, 201, []);
      }
      if (req.method === 'POST' && url.pathname.endsWith('/forum_likes')) {
        const body = await readBody(req);
        if (!state.likes.some(like => like.post_id === body.post_id && like.actor === body.actor)) state.likes.push({ post_id: body.post_id, actor: body.actor, created_at: new Date().toISOString() });
        return send(res, 201, []);
      }
      if (req.method === 'DELETE' && url.pathname.endsWith('/forum_likes')) {
        const postId = Number(url.searchParams.get('post_id').replace('eq.', ''));
        const actor = url.searchParams.get('actor').replace('eq.', '');
        state.likes = state.likes.filter(like => !(like.post_id === postId && like.actor === actor));
        return send(res, 204, []);
      }
      send(res, 404, { message: `yol bulunamadı: ${req.method} ${url.pathname}` });
    } catch (error) {
      send(res, 400, { message: error.message });
    }
  });
  const listen = () => new Promise(resolve => server.listen(port, '0.0.0.0', resolve));
  const close = () => new Promise(resolve => server.close(() => resolve()));
  return { server, state, listen, close };
}

// Doğrudan çalıştırılırsa bağımsız sunucu olarak dinler.
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  createForumMock().listen().then(() => console.log('forum mock ready on http://localhost:8799'));
}
