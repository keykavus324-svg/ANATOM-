import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  Heart,
  Bookmark,
  MessageCircle,
  MessagesSquare,
  PenLine,
  Pin,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import { useI18n, useLocalizedContent } from './i18n.jsx';
import { useCommunity } from './useCommunity.js';
import { getActorId } from './forum/remote.js';
import {
  COMMUNITY_MAX_BODY,
  COMMUNITY_TAGS,
  KIND_LABEL_KEYS,
  TAG_LABEL_KEYS,
  countComments,
  filterPosts,
  initialsOf,
  relativeAgeParts,
  sortPosts,
} from './forum/community.js';
import { notes } from './data.js';
import './community.css';

const RELATIVE_KEYS = {
  minute: '{n} dakika önce',
  hour: '{n} saat önce',
  day: '{n} gün önce',
  week: '{n} hafta önce',
  month: '{n} ay önce',
};

const BOOKMARK_STORAGE_KEY = 'anatomi-topluluk-kaydedilenler';

function readSavedIds() {
  try {
    const value = JSON.parse(localStorage.getItem(BOOKMARK_STORAGE_KEY) || '[]');
    return Array.isArray(value) ? [...new Set(value.filter(id => typeof id === 'string' || typeof id === 'number').map(String))] : [];
  } catch { return []; }
}

const ERROR_KEYS = {
  author: 'Görünen ad gerekli.',
  body: 'Biraz daha açıkla: en az birkaç kelime yaz.',
  tooLong: 'Çok uzun: 2000 karakteri geçmesin.',
  network: 'Sunucuya ulaşılamadı. İnternetini kontrol et ve tekrar dene.',
};

function RelativeTime({ ts }) {
  const { tr } = useI18n();
  const parts = relativeAgeParts(ts);
  if (parts.unit === 'now') return <span>{tr('Şimdi')}</span>;
  return <span>{tr(RELATIVE_KEYS[parts.unit], { n: parts.n })}</span>;
}

function Avatar({ name, size = 'md' }) {
  return <span className={`post-avatar ${size}`} aria-hidden="true">{initialsOf(name)}</span>;
}

function KindMark({ kind }) {
  const { tr } = useI18n();
  return <span className={`post-kind kind-${kind}`}>{tr(KIND_LABEL_KEYS[kind])}</span>;
}

// Yorum düğmesi: sayaç her zaman görünür, dokununca konuşma kısmı açılır.
function CommentSection({ post, canPost, onComment }) {
  const { tr } = useI18n();
  const [draft, setDraft] = useState('');
  const [error, setError] = useState(false);
  const submit = async () => {
    const result = await onComment(post.id, draft);
    if (!result || !result.ok) { setError(true); return; }
    setDraft(''); setError(false);
  };
  return <div className="post-comments">
    {post.comments.length > 0 && <ul className="comment-list">{post.comments.map(comment => <li key={comment.id}>
      <Avatar name={comment.author} size="sm"/>
      <div><strong>{comment.author}</strong><small><RelativeTime ts={comment.createdAt}/></small><p>{comment.body}</p></div>
    </li>)}</ul>}
    {canPost ? <div className="comment-form">
      <input value={draft} onChange={e => { setDraft(e.target.value); setError(false); }} placeholder={tr('Yorum yaz…')} aria-label={tr('Yorum yaz…')} maxLength={800}/>
      <button className="comment-send" onClick={submit} disabled={!draft.trim()} aria-label={tr('Yorumu gönder')}><Send size={15}/></button>
    </div> : <button className="comment-gate" onClick={() => document.getElementById('community-profile-input')?.focus()}>{tr('Yorum yazmak için görünen adını ayarla.')}</button>}
    {error && <p className="field-error">{tr('Biraz daha açıkla: en az birkaç kelime yaz.')}</p>}
  </div>;
}

function PostCard({ post, mine, canPost, flash, saved, onSave, onLike, onComment, onRemove, onOpenLesson }) {
  const { tr } = useI18n();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const comments = post.comments?.length || 0;
  return <article className={`post-card ${post.kind} ${flash ? 'flash' : ''}`}>
    <header className="post-head">
      <Avatar name={post.author}/>
      <div className="post-author"><strong>{post.author}</strong><small><RelativeTime ts={post.createdAt}/></small></div>
      <KindMark kind={post.kind}/>
      {post.pinned && <span className="post-pinned"><Pin size={11}/> {tr('Sabitlenmiş')}</span>}
      {mine && !confirming && <button className="icon-button post-remove" aria-label={tr('Gönderiyi sil')} title={tr('Gönderiyi sil')} onClick={() => setConfirming(true)}><Trash2 size={16}/></button>}
    </header>
    {post.title && <h3 className="post-title">{post.title}</h3>}
    <p className="post-body">{post.body}</p>
    <div className="post-meta">
      <span className="post-tag">{tr(TAG_LABEL_KEYS[post.tag])}</span>
      {post.lesson && <button className="post-lesson" onClick={() => onOpenLesson(post.lesson)}>{tr('Ders {n}', { n: post.lesson })} <ChevronDown size={12}/></button>}
    </div>
    {!confirming ? <footer className="post-actions">
      <button className={`action-button like-button ${post.liked ? 'liked' : ''}`} aria-label={tr('{count} beğeni', { count: post.likes })} aria-pressed={post.liked} onClick={() => onLike(post.id)}><Heart size={17} fill={post.liked ? 'currentColor' : 'none'}/><span>{post.likes}</span></button>
      <button className="action-button" aria-expanded={open} onClick={() => setOpen(value => !value)}><MessageCircle size={16}/><span>{tr('{count} yorum', { count: comments })}</span></button>
      <button className={`action-button save-button ${saved ? 'saved' : ''}`} aria-label={saved ? tr('Kaydedilenlerden çıkar') : tr('Gönderiyi kaydet')} aria-pressed={saved} onClick={() => onSave(post.id)}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'}/><span>{saved ? tr('Kaydedildi') : tr('Kaydet')}</span></button>
    </footer> : <footer className="post-confirm">
      <p>{tr('Bu gönderiyi silmek istediğine emin misin?')}</p>
      <div><button className="danger-button" onClick={() => onRemove(post.id)}>{tr('Evet, sil')}</button><button className="text-button" onClick={() => setConfirming(false)}>{tr('Vazgeç')}</button></div>
    </footer>}
    {open && <CommentSection post={post} canPost={canPost} onComment={onComment}/>}
  </article>;
}

// Görünen ad kendi taslağını tutar: her tuşta kaydetmek yerine düzenleme bittiğinde
// (veya Enter ile) profil güncellenir, böylece yazarken metin silinmez.
function ProfileField({ profile, onSave }) {
  const { tr } = useI18n();
  const [draft, setDraft] = useState(profile || '');
  useEffect(() => { setDraft(profile || ''); }, [profile]);
  const save = () => onSave(draft);
  return <>
    <input id="community-profile-input" value={draft} onChange={e => setDraft(e.target.value)} onBlur={save} onKeyDown={e => { if (e.key === 'Enter') { save(); e.currentTarget.blur(); } }} placeholder={tr('Görünen adın')} aria-label={tr('Görünen adın')} maxLength={40}/>
    {profile && <span className="profile-hint"><Avatar name={profile} size="sm"/> {profile}</span>}
  </>;
}

function Composer({ defaultName, lessons, remote, onClose, onSubmit }) {
  const { tr } = useI18n();
  const needsName = !defaultName;
  const [name, setName] = useState(defaultName || '');
  const [kind, setKind] = useState('soru');
  const [tag, setTag] = useState('genel');
  const [lesson, setLesson] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; dialog.close(); };
  }, []);
  const submit = async () => {
    const result = await onSubmit({ author: needsName ? name : defaultName, kind, tag, lesson: lesson ? Number(lesson) : null, title, body });
    if (!result.ok) { setError(ERROR_KEYS[result.error] || ERROR_KEYS.body); return; }
    onClose();
  };
  return <dialog ref={ref} className="composer-dialog" aria-label={tr('Yeni gönderi')} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <header className="composer-head"><div className="eyebrow"><span/> {tr('TOPLULUK')}</div><h2>{tr('Yeni gönderi')}</h2><button className="icon-button" aria-label={tr('İptal')} onClick={onClose}><X size={21}/></button></header>
    {needsName && <label className="field"><span>{tr('Görünen adın')}</span><input value={name} onChange={e => setName(e.target.value)} maxLength={40} autoFocus/></label>}
    <div className="kind-switch" role="group" aria-label={tr('Gönderi türü')}>
      {[['soru', tr('Soru sor')], ['not', tr('Not paylaş')]].map(([value, label]) => <button key={value} className={kind === value ? 'selected' : ''} aria-pressed={kind === value} onClick={() => setKind(value)}>{label}</button>)}
    </div>
    <div className="composer-row">
      <label className="field"><span>{tr('Etiket')}</span><select value={tag} onChange={e => setTag(e.target.value)}>{COMMUNITY_TAGS.map(key => <option key={key} value={key}>{tr(TAG_LABEL_KEYS[key])}</option>)}</select></label>
      <label className="field"><span>{tr('İlgili ders (isteğe bağlı)')}</span><select value={lesson} onChange={e => setLesson(e.target.value)}><option value="">{tr('Ders seç')}</option>{lessons.map(note => <option key={note.number} value={note.number}>{note.number}. {note.title}</option>)}</select></label>
    </div>
    <label className="field"><span>{tr('Başlık (isteğe bağlı)')}</span><input value={title} onChange={e => setTitle(e.target.value)} maxLength={120} placeholder={tr('Kısa ve net bir başlık')}/></label>
    <label className="field"><span>{tr('İçerik')}</span><textarea value={body} onChange={e => setBody(e.target.value)} rows={6} maxLength={COMMUNITY_MAX_BODY} placeholder={tr('Bir soru ya da not yaz…')}/><small className="char-count">{tr('{n} / {max}', { n: body.length, max: COMMUNITY_MAX_BODY })}</small></label>
    {error && <p className="field-error">{error}</p>}
    <footer className="composer-foot">
      <span className="composer-note"><ShieldCheck size={14}/> {remote ? tr('Gönderiler topluluk panosunda herkese görünür.') : tr('Paylaşımlar bu cihazda saklanır')}</span>
      <button className="primary-button" onClick={submit}>{tr('Gönder')} <Send size={14}/></button>
    </footer>
  </dialog>;
}

export default function CommunityPage({ onOpenLesson }) {
  const { tr } = useI18n();
  const { notes: localize } = useLocalizedContent();
  const { board, profile, canPost, mode, status, offline, busy, setName, publish, like, comment, remove, refresh } = useCommunity();
  const allNotes = useMemo(() => localize(notes).filter(note => note.number > 0), [localize]);
  const [tab, setTab] = useState('all');
  const [savedIds, setSavedIds] = useState(readSavedIds);
  useEffect(() => {
    const syncSaved = event => { if (event.key === BOOKMARK_STORAGE_KEY) setSavedIds(readSavedIds()); };
    window.addEventListener('storage', syncSaved);
    return () => window.removeEventListener('storage', syncSaved);
  }, []);
  const [tag, setTag] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('new');
  const [composer, setComposer] = useState(false);
  const [toast, setToast] = useState('');
  const [highlight, setHighlight] = useState('');
  const toastTimer = useRef(null);
  useEffect(() => { if (!toast) return undefined; clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(''), 2400); return () => clearTimeout(toastTimer.current); }, [toast]);

  const actorId = getActorId();
  const toggleSaved = id => setSavedIds(current => {
    const next = current.includes(String(id)) ? current.filter(savedId => savedId !== String(id)) : [...current, String(id)];
    try { localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
    return next;
  });
  const visible = useMemo(() => {
    const kind = tab === 'saved' ? 'all' : tab;
    const matches = filterPosts(board, { query, kind, tag });
    return sortPosts(tab === 'saved' ? matches.filter(post => savedIds.includes(String(post.id))) : matches, sort);
  }, [board, query, tab, tag, sort, savedIds]);
  const handlePublish = async draft => {
    const result = await publish(draft);
    if (result.ok) {
      // İlk kez ad gösteriliyorsa aynı ad panoda da kullanılır ve bir dahaki sefer sorulmaz.
      if (!profile && draft.author) setName(draft.author);
      setComposer(false); setTab('all'); setTag('all'); setQuery('');
      if (mode === 'local') { setHighlight(result.post.id); setTimeout(() => setHighlight(''), 1800); }
      setToast(tr('Gönderi panoya eklendi.'));
    } else {
      setToast(tr('Sunucuya ulaşılamadı. İnternetini kontrol et ve tekrar dene.'));
    }
    return result;
  };
  const handleComment = async (id, body) => {
    const result = await comment(id, body);
    if (result && result.ok) setToast(tr('Yorum eklendi.'));
    else if (mode === 'remote') setToast(tr('Sunucuya ulaşılamadı. İnternetini kontrol et ve tekrar dene.'));
    return result || { ok: false, error: 'body' };
  };
  const empty = visible.length === 0;

  return <section className="community-page" aria-labelledby="community-heading">
    <header className="community-head">
      <div className="eyebrow"><span/> {tr('TOPLULUK')}</div>
      <h1 id="community-heading">{tr('Topluluk')}<em>{tr('Soru sor, bildiklerini paylaş.')}</em></h1>
      <p className="community-intro">{tr('Ders arkadaşlarınla aynı satırda: soru sor, not paylaş, yorumla.')}</p>
    </header>

    <div className="community-layout">
      <div className="community-main">
        <div className="community-toolbar">
          <div className="community-tabs" role="tablist" aria-label={tr('Gönderi türleri')}>
            {[['all', tr('Tümü')], ['soru', tr('Sorular')], ['not', tr('Notlar')], ['saved', tr('Kaydettiklerim')]].map(([value, label]) => <button key={value} role="tab" aria-selected={tab === value} className={tab === value ? 'active' : ''} onClick={() => setTab(value)}>{label}{value === 'saved' && savedIds.length > 0 ? ` · ${savedIds.length}` : ''}</button>)}
          </div>
          <div className="community-tools">
            <div className="search-field"><Search size={16}/><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={tr('Toplulukta ara')} aria-label={tr('Toplulukta ara')}/>{query && <button className="icon-button" aria-label={tr('Aramayı temizle')} onClick={() => setQuery('')}><X size={15}/></button>}</div>
            <div className="sort-select"><SlidersHorizontal size={14}/><select value={sort} onChange={e => setSort(e.target.value)} aria-label={tr('Gönderileri sırala')}><option value="new">{tr('Yeni')}</option><option value="popular">{tr('Popüler')}</option></select><ChevronDown size={12}/></div>
            {mode === 'remote' && <button className="icon-button community-refresh" aria-label={tr('Panoyu yenile')} title={tr('Panoyu yenile')} onClick={() => refresh()} disabled={busy}><RotateCcw size={16}/></button>}
            <button className="primary-button community-new" onClick={() => setComposer(true)} disabled={busy}><PenLine size={15}/> {tr('Yeni gönderi')}</button>
          </div>
        </div>

        <div className="community-tags" aria-label={tr('Etiketler')}>
          {['all', ...COMMUNITY_TAGS].map(key => <button key={key} className={tag === key ? 'active' : ''} aria-pressed={tag === key} onClick={() => setTag(key)}>{key === 'all' ? tr('Tüm etiketler') : tr(TAG_LABEL_KEYS[key])}</button>)}
        </div>

        {mode === 'remote' && offline && <div className="community-notice" role="status"><span className="notice-dot"/> {tr('Bağlantı kurulamadı; son yüklenen pano gösteriliyor.')}</div>}

        {mode === 'remote' && status === 'loading' && board.length === 0 ? <div className="community-loading"><span className="spinner"/> <span>{tr('Pano yükleniyor…')}</span></div>
        : empty ? <div className="empty-state community-empty">
          <MessagesSquare size={32}/>
          <h3>{board.length === 0 ? tr('Henüz paylaşım yok.') : tr('Bu filtreyle eşleşen gönderi bulunamadı.')}</h3>
          <p>{board.length === 0 ? tr('İlk paylaşımı sen yap: soru sor, notunu paylaş, başlat.') : tr('Filtreleri temizle veya başka bir etikete göz at.')}</p>
          {board.length === 0 && <button className="primary-button" onClick={() => setComposer(true)}>{tr('Yeni gönderi')} <PenLine size={15}/></button>}
        </div> : <div className="community-list">{visible.map(post => <PostCard key={post.id} post={post} mine={mode === 'remote' ? Boolean(actorId && post.actor === actorId) : Boolean(profile && post.author === profile)} canPost={canPost} flash={highlight === post.id} saved={savedIds.includes(String(post.id))} onSave={toggleSaved} onLike={like} onComment={handleComment} onRemove={id => { remove(id); setToast(tr('Gönderi silindi.')); }} onOpenLesson={onOpenLesson}/>)}</div>}
      </div>

      <aside className="community-side">
        <div className="side-card profile-card">
          <h2>{tr('Kim siniz?')}</h2>
          <p>{tr('Görünen adın bu cihazda saklanır ve yalnızca panoda gösterilir.')}</p>
          <ProfileField profile={profile} onSave={setName}/>
        </div>
        <div className="side-card rules-card">
          <h2><ShieldCheck size={18}/> {tr('Topluluk kuralları')}</h2>
          <ol>
            <li>{tr('Önce konuyu bul, sonra sor: arama, ders ve etiket işini kolaylaştırır.')}</li>
            <li>{tr('Soru sorarken ilgili derse ve etikete dokun; aynı yapıyı merak edenler gelsin.')}</li>
            <li>{tr('Cevap verirken kaynağı işaret et; klinik tavsiye değil, çalışma notu paylaş.')}</li>
            <li>{tr('Saygılı ol: kişisel bilgi, klinik görüntü ve telifli belge paylaşılmaz.')}</li>
          </ol>
        </div>
        <div className={`side-card storage-card ${mode === 'remote' ? 'live' : ''}`}>
          <h2>{mode === 'remote' ? tr('Canlı pano') : tr('Paylaşımlar bu cihazda saklanır')}</h2>
          <p>{mode === 'remote' ? tr('Pano herkese açık ve tüm cihazlarda aynı.') : tr('Pano ve görünen ad yalnız bu tarayıcıda tutulur; hesap yoktur, buluta aktarılmaz.')}</p>
        </div>
        <div className="side-card stats-card">
          <span><MessagesSquare size={15}/> {tr('{count} gönderi', { count: board.length })}</span>
          <span><MessageCircle size={15}/> {tr('{count} yorum', { count: countComments(board) })}</span>
        </div>
      </aside>
    </div>

    {composer && <Composer defaultName={profile || ''} lessons={allNotes} remote={mode === 'remote'} onClose={() => setComposer(false)} onSubmit={handlePublish}/>}
    {toast && <div className="toast" role="status"><CheckCircle2 size={17}/>{toast}</div>}
  </section>;
}
