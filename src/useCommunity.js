import { useCallback, useEffect, useState } from 'react';
import * as store from './forum/community.js';
import { isRemoteConfigured } from './forum/config.js';
import * as remote from './forum/remote.js';

// Supabase yapılandırılıysa pano herkese açık bir tablodur; yoksa siteyi kuran
// ilke bozulmadan yalnız cihazda tutulan pano kullanılır.
const REMOTE = isRemoteConfigured();

function localBoard() {
  const saved = store.readBoard(localStorage);
  return saved || [store.welcomePost()];
}

export function useCommunity() {
  const [board, setBoard] = useState(() => (REMOTE ? [] : localBoard()));
  const [profile, setProfile] = useState(store.readProfile);
  const [status, setStatus] = useState(REMOTE ? 'loading' : 'ready');
  const [offline, setOffline] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!REMOTE) store.writeBoard(localStorage, board); }, [board]);
  useEffect(() => { store.writeProfile(localStorage, profile || ''); }, [profile]);

  // Canlı pano: ilk açılış, odak yenileme ve 15 saniyelik yoklama.
  const refresh = useCallback(async () => {
    if (!REMOTE) return undefined;
    try {
      const next = await remote.fetchBoard();
      setBoard(next);
      setStatus('ready');
      setOffline(false);
    } catch {
      setOffline(true);
      setStatus(current => (current === 'ready' ? 'ready' : 'error'));
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (!REMOTE) return undefined;
    refresh();
    const tick = setInterval(() => { if (document.visibilityState === 'visible') refresh(); }, 15000);
    const wake = () => { if (document.visibilityState === 'visible') refresh(); };
    window.addEventListener('focus', wake);
    document.addEventListener('visibilitychange', wake);
    return () => { clearInterval(tick); window.removeEventListener('focus', wake); document.removeEventListener('visibilitychange', wake); };
  }, [refresh]);

  useEffect(() => {
    if (REMOTE) return undefined;
    const sync = () => { const saved = store.readBoard(localStorage); if (saved) setBoard(saved); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const setName = useCallback(name => setProfile(String(name || '').trim().slice(0, 40)), []);

  // Uzak panoda işlem önce sunucuda yapılır, ardından tablo yeniden çekilir.
  const runRemote = useCallback(async job => {
    setBusy(true);
    try { await job(); await refresh(); return true; } catch { return false; } finally { setBusy(false); }
  }, [refresh]);

  const publish = useCallback(draft => {
    const author = draft.author || profile;
    if (REMOTE) return runRemote(() => remote.sendPost({ ...draft, author })).then(ok => ({ ok, error: ok ? null : 'network' }));
    const result = store.createPost(board, { ...draft, author });
    if (result.ok) setBoard(result.board);
    return Promise.resolve(result);
  }, [board, profile, runRemote]);

  const like = useCallback(id => {
    const post = board.find(item => String(item.id) === String(id));
    if (!post) return undefined;
    if (REMOTE) return runRemote(() => remote.setLiked(post.id, post.liked));
    setBoard(current => store.toggleLike(current, id));
    return undefined;
  }, [board, runRemote]);

  const comment = useCallback((id, body) => {
    if (REMOTE) return runRemote(() => remote.sendComment(id, { author: profile, body })).then(ok => ({ ok, error: ok ? null : 'network' }));
    const result = store.addComment(board, id, { author: profile, body });
    if (result.ok) setBoard(result.board);
    return Promise.resolve(result);
  }, [board, profile, runRemote]);

  const remove = useCallback(id => {
    if (REMOTE) return runRemote(() => remote.removePost(id));
    setBoard(current => store.removePost(current, id));
    return undefined;
  }, [runRemote]);

  return { board, profile, canPost: Boolean(profile), mode: REMOTE ? 'remote' : 'local', status, offline, busy, setName, publish, like, comment, remove, refresh };
}
