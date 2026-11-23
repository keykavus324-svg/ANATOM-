// Topluluk panosunun Supabase (PostgREST) arka ucu.
//
// Pano artık herkese açık bir tablodur: gönderiler, yorumlar ve beğeniler
// cihazlar arası paylaşılır. Kimlik, cihazdan gelen sabit bir aktör kimliğiyle
// etiketlenir; görünen ad ayrıca tutulur. Bu dosya saf HTTP işlemleridir,
// React kancaları useCommunity.js içinde birleştirilir.
import { supabaseApiUrl, supabaseApiKey } from './config.js';

export const ACTOR_KEY = 'anatomi-topluluk-aktor';

export class RemoteError extends Error {
  constructor(message, status = 0) { super(message); this.name = 'RemoteError'; this.status = status; }
}

function makeActorId() {
  try { return crypto.randomUUID(); } catch { /* eski tarayıcılar */ }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
    const value = Math.random() * 16 | 0;
    return (char === 'x' ? value : (value & 0x3 | 0x8)).toString(16);
  });
}

// Node testleri tarayıcı depolaması olmadan da çalışsın diye bellek içi yedek var.
const memoryFallback = new Map();
function storageBackend() {
  try { if (typeof localStorage !== 'undefined') return localStorage; } catch { /* gizli mod */ }
  return { getItem: key => (memoryFallback.has(key) ? memoryFallback.get(key) : null), setItem: (key, value) => memoryFallback.set(key, String(value)) };
}

// Aktör kimliği cihaza özeldir ve panoda "kimin paylaştığını" ayırt etmeye yarar.
export function getActorId(storage = storageBackend()) {
  try {
    const raw = JSON.parse(storage.getItem(ACTOR_KEY));
    if (raw && typeof raw.id === 'string' && raw.id) return raw.id;
  } catch { /* bozuk kayıt yeniden üretilir */ }
  const id = makeActorId();
  try { storage.setItem(ACTOR_KEY, JSON.stringify({ id })); } catch { /* oturum içi */ }
  return id;
}

async function request(path, { method = 'GET', body, prefer } = {}) {
  const actor = getActorId();
  let response;
  try {
    response = await fetch(`${supabaseApiUrl()}/rest/v1/${path}`, {
      method,
      headers: {
        apikey: supabaseApiKey(),
        Authorization: `Bearer ${supabaseApiKey()}`,
        'Content-Type': 'application/json',
        'x-anatom-actor': actor,
        ...(prefer ? { Prefer: prefer } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new RemoteError('network');
  }
  if (!response.ok) {
    let message = 'Sunucu isteği reddetti.';
    try { const detail = await response.json(); if (detail?.message) message = detail.message; } catch { /* gövde yok */ }
    throw new RemoteError(message, response.status);
  }
  if (method === 'DELETE') return null;
  try { return await response.json(); } catch { return null; }
}

function toPost(row, actor) {
  const likes = Array.isArray(row.forum_likes) ? row.forum_likes : [];
  return {
    id: String(row.id),
    actor: row.actor ?? null,
    author: row.author,
    kind: row.kind,
    tag: row.tag,
    lesson: row.lesson ?? null,
    title: row.title ?? null,
    body: row.body,
    createdAt: Date.parse(row.created_at) || Date.now(),
    pinned: Boolean(row.pinned),
    likes: likes.length,
    liked: likes.some(item => item && item.actor === actor),
    comments: (Array.isArray(row.forum_comments) ? row.forum_comments : []).map(comment => ({
      id: String(comment.id), author: comment.author, body: comment.body, createdAt: Date.parse(comment.created_at) || 0,
    })),
  };
}

// Gönderiler yorumları ve beğeni aktörleriniyle beraber tek istekte döner.
export async function fetchBoard() {
  const rows = await request('forum_posts?select=*,forum_comments(*),forum_likes(actor)&order=pinned.desc,created_at.desc&forum_comments.order=created_at.asc');
  const actor = getActorId();
  return (Array.isArray(rows) ? rows : []).map(row => toPost(row, actor));
}

export async function sendPost(draft) {
  await request('forum_posts', {
    method: 'POST',
    prefer: 'return=minimal',
    body: {
      author: draft.author,
      kind: draft.kind,
      tag: draft.tag,
      lesson: draft.lesson ?? null,
      title: draft.title ? String(draft.title).slice(0, 120) : null,
      body: draft.body,
      actor: getActorId(),
    },
  });
}

export async function removePost(id) {
  await request(`forum_posts?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', prefer: 'return=minimal' });
}

export async function sendComment(postId, draft) {
  await request('forum_comments', {
    method: 'POST',
    prefer: 'return=minimal',
    body: { post_id: Number(postId), author: draft.author, body: draft.body, actor: getActorId() },
  });
}

// Beğeni, aktör başına tek satırla tutulur: eklemek ve geri almak aynı işlem.
export async function setLiked(postId, liked) {
  const actor = getActorId();
  if (liked) {
    await request(`forum_likes?post_id=eq.${encodeURIComponent(postId)}&actor=eq.${encodeURIComponent(actor)}`, { method: 'DELETE', prefer: 'return=minimal' });
  } else {
    await request('forum_likes', { method: 'POST', prefer: 'resolution=ignore-duplicates,return=minimal', body: { post_id: Number(postId), actor } });
  }
}
