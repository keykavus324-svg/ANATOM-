// Topluluk panosu: sorular, paylaşılan notlar ve yorumlar.
//
// Pano ve görünen ad yalnız bu cihazın tarayıcısında saklanır; backend, hesap
// veya bulut eşitlemesi yoktur (site mimarisinin geri kalanıyla aynı ilke).
// Bu modül saf işlevler içerir: React kancaları useCommunity.js içindedir ve
// node --test senaryoları bu dosyayı doğrudan çağırabilir.
import { normalize } from '../data.js';

export const COMMUNITY_STORAGE_KEY = 'anatomi-topluluk';
export const COMMUNITY_PROFILE_KEY = 'anatomi-topluluk-profil';
export const COMMUNITY_MAX_BODY = 2000;
export const COMMUNITY_MAX_COMMENT = 800;

// Etiket ve tür anahtarları sabittir; arayüz metinleri sözlükten gelir.
export const COMMUNITY_TAGS = ['genel', 'osteologia', 'arthrologia', 'myologia', 'neuroanatomia', 'klinik', 'calisma'];
export const COMMUNITY_KINDS = ['soru', 'not'];

export const TAG_LABEL_KEYS = {
  genel: 'Genel',
  osteologia: 'Osteoloji',
  arthrologia: 'Arthrologia',
  myologia: 'Myologia',
  neuroanatomia: 'Nöroanatomi',
  klinik: 'Klinik bağlantı',
  calisma: 'Çalışma tekniği',
};

export const KIND_LABEL_KEYS = { soru: 'Soru', not: 'Not' };

export function createUid(prefix = 'p') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function initialsOf(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '·';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toLocaleUpperCase('tr-TR');
}

function clean(text, max) {
  return String(text ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

// İlk açılışta panonun başında duran, topluluk kurallarını anlatan sabit gönderi.
// Daha fazla örnek kişi ya da sahte diyalog eklenmez; gerçek içerik kullanıcıdan gelir.
export function welcomePost(now = Date.now()) {
  return {
    id: 'topluluk-hos-geldin',
    author: 'ANATOMİ',
    kind: 'soru',
    tag: 'genel',
    lesson: null,
    title: 'Topluluk nereden başlar?',
    body: 'Bu satır, sınıfın ortak çalışma panosudur. Takıldığın bir konuyu sor, ezberlediğin bir yolu ya da kendi çalışma tekniğini yaz, arkadaşının sorusunu cevapla.\n\nPaylaşım yapmadan önce konuyu ve dersi seçmeyi unutma; böylece aynı yapıyı merak edenler kolayca bulur. Sorular burada puanlandırılmaz, kıyas da yapılmaz — amaç birbirimize öğretmek.',
    createdAt: now,
    pinned: true,
    likes: 0,
    liked: false,
    comments: [],
  };
}

export function isBoard(value) {
  return Array.isArray(value) && value.every(post => post && typeof post.id === 'string' && typeof post.body === 'string' && typeof post.createdAt === 'number');
}

export function readBoard(storage) {
  try {
    const raw = JSON.parse(storage.getItem(COMMUNITY_STORAGE_KEY));
    return isBoard(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function writeBoard(storage, board) {
  try {
    storage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(isBoard(board) ? board : []));
    return true;
  } catch {
    return false;
  }
}

export function readProfile(storage) {
  try {
    const raw = JSON.parse(storage.getItem(COMMUNITY_PROFILE_KEY));
    return raw && typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim().slice(0, 40) : null;
  } catch {
    return null;
  }
}

export function writeProfile(storage, name) {
  try {
    storage.setItem(COMMUNITY_PROFILE_KEY, JSON.stringify({ name: String(name || '').trim().slice(0, 40) }));
    return true;
  } catch {
    return false;
  }
}

export function filterPosts(board, { query = '', kind = 'all', tag = 'all' } = {}) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return board.filter(post => {
    if (kind !== 'all' && post.kind !== kind) return false;
    if (tag !== 'all' && post.tag !== tag) return false;
    if (!words.length) return true;
    const haystack = normalize(`${post.title || ''} ${post.body} ${post.author}`);
    return words.every(word => haystack.includes(word));
  });
}

// Sabit gönderi her zaman listenin başında; geri kalanı yeniye veya beğeniye göre dizilir.
export function sortPosts(board, sort = 'new') {
  const weight = post => (post.pinned ? 1 : 0);
  const copy = [...board].sort((a, b) => weight(b) - weight(a) || (sort === 'popular' ? (b.likes || 0) - (a.likes || 0) : b.createdAt - a.createdAt));
  return copy;
}

export function createPost(board, draft) {
  const author = clean(draft.author, 40);
  const kind = COMMUNITY_KINDS.includes(draft.kind) ? draft.kind : 'not';
  const tag = COMMUNITY_TAGS.includes(draft.tag) ? draft.tag : 'genel';
  const title = clean(draft.title, 120);
  const body = String(draft.body ?? '').trim();
  const lesson = Number.isInteger(draft.lesson) && draft.lesson >= 1 && draft.lesson <= 11 ? draft.lesson : null;
  if (!author) return { ok: false, error: 'author' };
  if (body.length < 4) return { ok: false, error: 'body' };
  if (body.length > COMMUNITY_MAX_BODY) return { ok: false, error: 'tooLong' };
  const post = {
    id: createUid(),
    author,
    kind,
    tag,
    lesson,
    title: title || null,
    body: body.slice(0, COMMUNITY_MAX_BODY),
    createdAt: Date.now(),
    pinned: false,
    likes: 0,
    liked: false,
    comments: [],
  };
  return { ok: true, post, board: [post, ...board] };
}

export function toggleLike(board, id) {
  return board.map(post => post.id !== id ? post : { ...post, liked: !post.liked, likes: Math.max(0, (post.likes || 0) + (post.liked ? -1 : 1)) });
}

export function addComment(board, id, draft) {
  const author = clean(draft.author, 40);
  const body = String(draft.body ?? '').trim().slice(0, COMMUNITY_MAX_COMMENT);
  if (!author || body.length < 2) return { ok: false, error: !author ? 'author' : 'body' };
  let added = null;
  const next = board.map(post => {
    if (post.id !== id) return post;
    added = { id: createUid('y'), author, body, createdAt: Date.now() };
    return { ...post, comments: [...post.comments, added] };
  });
  return added ? { ok: true, board: next, comment: added } : { ok: false, error: 'missing' };
}

export function removePost(board, id) {
  return board.filter(post => post.id !== id);
}

export function countComments(board) {
  return board.reduce((sum, post) => sum + post.comments.length, 0);
}

export function relativeAgeParts(ts, now = Date.now()) {
  const diff = Math.max(0, Math.floor((now - Number(ts) || 0) / 1000));
  if (diff < 60) return { unit: 'now', n: 0 };
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return { unit: 'minute', n: minutes };
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return { unit: 'hour', n: hours };
  const days = Math.floor(hours / 24);
  if (days < 7) return { unit: 'day', n: days };
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return { unit: 'week', n: weeks };
  return { unit: 'month', n: Math.max(1, Math.floor(days / 30)) };
}
