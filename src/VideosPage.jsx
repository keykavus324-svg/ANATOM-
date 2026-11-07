import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, CheckCircle2, Clock3, ExternalLink, FolderOpen, Play, Sparkles, X } from 'lucide-react';
import { notes } from './data';
import { lessons } from './lessons';
import { courseVideos, featuredVideo, formatDuration, drivePreviewUrl, driveViewUrl, VIDEO_FOLDER_URL, totalVideoSeconds, pendingLessons } from './content/videos.js';
import { lessonVideoIn } from './content/videoI18n.js';
import { useI18n, useLocalizedContent } from './i18n.jsx';
import './videos.css';

const PAD = n => String(n).padStart(2, '0');

function VideoFrame({ id, title, onOpenDrive }) {
  const { tr } = useI18n();
  const [loaded, setLoaded] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => { setLoaded(false); }, [id, revision]);
  return <div className="video-frame">
    {!loaded && <div className="video-frame-loading"><span className="spinner"/><p>{tr('Video hazırlanıyor…')}</p><small>{tr('Google Drive oynatıcısına bağlanılıyor.')}</small></div>}
    <iframe
      key={`${id}-${revision}`}
      src={drivePreviewUrl(id)}
      title={title}
      allow="autoplay; fullscreen"
      allowFullScreen
      loading="lazy"
      onLoad={() => setLoaded(true)}
    />
    <div className="video-frame-actions">
      <button onClick={() => { setLoaded(false); setRevision(value => value + 1); }}>{tr('Yenile')}</button>
      <button onClick={() => onOpenDrive(id)}>{tr('Drive’da aç')} <ExternalLink size={12}/></button>
    </div>
  </div>;
}

function PlayerDialog({ video, note, onClose, onLesson }) {
  const { tr, lang } = useI18n();
  const info = lessonVideoIn(lang, video, note);
  const [clip, setClip] = useState(video.playId);
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    const escape = event => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', escape);
    return () => { window.removeEventListener('keydown', escape); document.body.style.overflow = overflow; element.close(); };
  }, [onClose]);
  const activeClip = video.clips?.find(item => item.id === clip);
  const openDrive = id => window.open(driveViewUrl(id), '_blank', 'noopener,noreferrer');
  return <dialog ref={dialog} className="video-dialog" aria-label={`${info.title} — ${tr('video ders')}`} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="video-dialog-inner">
      <header>
        <div>
          <span className="eyebrow muted"><span/> {note ? `${tr('Ders')} ${PAD(note.number)}` : tr('BİRLEŞİK KAYIT')}</span>
          <h2>{info.title}</h2>
          <p>{info.latin} {activeClip ? `· ${activeClip.label}` : ''} · {formatDuration(activeClip?.seconds || video.seconds)}</p>
        </div>
        <button className="icon-button" onClick={onClose} aria-label={tr('Videoyu kapat')}><X size={22}/></button>
      </header>
      <VideoFrame id={clip} title={`${info.title} ${tr('video dersi')}`} onOpenDrive={openDrive}/>
      <div className="video-dialog-meta">
        <p>{info.summary}</p>
        <a href={VIDEO_FOLDER_URL} target="_blank" rel="noopener noreferrer">{tr('Drive klasörünü aç')} <ArrowUpRight size={13}/></a>
      </div>
      {video.clips && <div className="video-clips" role="group" aria-label={tr('Dersin video parçaları')}>
        <span className="video-clips-label">{tr('Bu ders {n} parça hâlinde yayınlanıyor', { n: video.clips.length })}</span>
        {video.clips.map((item, i) => <button key={item.id} className={clip === item.id ? 'active' : ''} aria-pressed={clip === item.id} onClick={() => setClip(item.id)}>
          <span>{PAD(i + 1)}</span>
          <strong>{item.label}</strong>
          <small>{formatDuration(item.seconds)}</small>
        </button>)}
      </div>}
      {note && <footer>
        <button className="text-button" onClick={() => { onClose(); onLesson(note); }}><BookOpen size={15}/> {tr('Bu dersin konu anlatımını aç')} <ArrowRight size={14}/></button>
        <span><Sparkles size={13}/> {tr('NotebookLM ile kaynak notlardan üretilmiş video; dersin kendisi değil, tekrar aracıdır.')}</span>
      </footer>}
    </div>
  </dialog>;
}

export default function VideosPage({ onLesson, initialLesson = null }) {
  const { tr, lang } = useI18n();
  const { note: localizedNote, categoryLabel } = useLocalizedContent();
  const [filter, setFilter] = useState('all');
  const [openVideo, setOpenVideo] = useState(() => {
    if (!initialLesson) return null;
    const video = courseVideos().find(item => item.lesson === Number(initialLesson));
    if (!video) return null;
    return { video, note: notes.find(item => item.number === video.lesson) || null };
  });
  const videos = useMemo(() => courseVideos().map(video => ({
    video,
    note: localizedNote(notes.find(item => item.number === video.lesson)),
    info: lessonVideoIn(lang, video, notes.find(item => item.number === video.lesson)),
  })), [lang, localizedNote]);
  const featured = featuredVideo();
  const featuredInfo = featured ? lessonVideoIn(lang, featured, null) : null;
  const noteFor = number => localizedNote(notes.find(item => item.number === number));
  const groups = [
    { id: 'all', label: tr('Tüm dersler') },
    { id: 'temel', label: tr('Temel anatomi') },
    { id: 'hareket', label: tr('Hareket sistemi') },
    { id: 'organ', label: tr('Organ sistemleri') },
  ];
  const groupOf = video => {
    const note = notes.find(item => item.number === video.lesson);
    if (!note) return 'organ';
    if (note.category === 'Temel anatomi') return 'temel';
    if (note.category === 'Hareket sistemi') return 'hareket';
    return 'organ';
  };
  const shown = filter === 'all' ? videos : videos.filter(item => groupOf(item.video) === filter);

  return <div className="videos-page">
    <div className="eyebrow"><span/> {tr('VİDEO KONU ANLATIMI')}</div>
    <div className="videos-hero">
      <div>
        <h1>{tr('Dinleyerek tekrar et.')}<em>{tr('Ders ders, sırayla.')}</em></h1>
        <p>{tr('Kaynak notlardan üretilmiş sesli video anlatımları. Her ders kendi sayfasında; kaldığın yeri bu tarayıcıda saklarız.')}</p>
        <div className="videos-stats">
          <span><Play size={14}/> {tr('{n} ders videosu', { n: videos.length })}</span>
          <span><Clock3 size={14}/> {tr('Toplam {time}', { time: formatDuration(totalVideoSeconds) })}</span>
          <a href={VIDEO_FOLDER_URL} target="_blank" rel="noopener noreferrer"><FolderOpen size={14}/> {tr('Drive klasörü')} <ArrowUpRight size={12}/></a>
        </div>
      </div>
      {featured && <aside className="videos-featured">
        <span className="videos-featured-badge"><Sparkles size={13}/> {tr('BİRLEŞİK KAYIT')}</span>
        <h2>{featuredInfo.title}</h2>
        <p>{featuredInfo.summary}</p>
        <small>{formatDuration(featured.seconds)} · {tr('12 ders, tek video')}</small>
        <button className="primary-button" onClick={() => setOpenVideo({ video: featured, note: null })}><Play size={15}/> {tr('Birleşik kaydı oynat')}</button>
      </aside>}
    </div>

    <div className="videos-toolbar">
      <div className="videos-filters" aria-label={tr('Video konu filtreleri')}>
        {groups.map(group => <button key={group.id} className={filter === group.id ? 'active' : ''} aria-pressed={filter === group.id} onClick={() => setFilter(group.id)}>{group.label}</button>)}
      </div>
      <span className="videos-count">{tr('{n} video listeleniyor', { n: shown.length })}</span>
    </div>

    <div className="videos-grid">
      {shown.map(({ video, note, info }, index) => <article className="video-card" key={video.lesson}>
        <button className="video-card-poster" onClick={() => setOpenVideo({ video, note })} aria-label={`${info.title} ${tr('video dersini oynat')}`}>
          <img src={`${import.meta.env.BASE_URL}${(lessons[video.lesson]?.image || '/anatomy-torso.webp').replace(/^\//, '')}`} alt="" loading="lazy"/>
          <span className="video-card-play"><Play size={22} fill="currentColor"/></span>
          <span className="video-card-duration">{formatDuration(video.seconds)}</span>
          <span className="video-card-index">{PAD(video.lesson)}</span>
        </button>
        <div className="video-card-body">
          <div className="video-card-eyebrow"><span>{note?.category ? categoryLabel(note.category) : categoryLabel('Organ sistemleri')}</span><i/>{video.pages}</div>
          <h3>{info.title}</h3>
          <p className="video-card-latin">{info.latin}</p>
          <p className="video-card-summary">{info.summary}</p>
          <div className="video-card-actions">
            <button className="video-card-play-button" onClick={() => setOpenVideo({ video, note })}><Play size={13}/> {tr('Oynat')}</button>
            {video.clips && <span className="video-parts-badge">{tr('{n} parça', { n: video.partCount })}</span>}
            <button className="video-card-lesson" onClick={() => onLesson(noteFor(video.lesson))}><BookOpen size={13}/> {tr('Konu anlatımı')}</button>
          </div>
        </div>
      </article>)}
    </div>

    {pendingLessons.length > 0 && <section className="videos-pending" aria-label={tr('Hazırlanan ders videoları')}>
      <div className="videos-pending-head">
        <span className="eyebrow muted"><span/> {tr('SIRADA')}</span>
        <h2>{tr('Videosu hazırlanan dersler')}</h2>
        <p>{tr('Bu derslerin yazılı anlatımı hazır. Video kaydı eklendiğinde bu sayfada oynatılabilir olacak; şimdilik konu anlatımından çalışabilirsin.')}</p>
      </div>
      <div className="videos-pending-list">
        {pendingLessons.map(number => {
          const note = noteFor(number);
          return <button key={number} onClick={() => onLesson(note)}><span>{PAD(number)}</span><strong>{note.title}</strong><em>{tr('Video hazırlanıyor')}</em><ArrowRight size={14}/></button>;
        })}
      </div>
    </section>}

    <section className="videos-order">
      <CheckCircle2 size={20}/>
      <div>
        <h2>{tr('Nasıl çalışmalı?')}</h2>
        <p>{tr('Önce dersin konu anlatımını oku, sonra videosunu dinle. Video sırasında terim kartlarına ve tekrar sorularına dön; ardından “Kendini sına” bölümünde denemeyi çöz. Videolar uzun olduğu için bir oturuşta bitirmek zorunda değilsin — ders sayfasındaki parçalar hâlinde ilerleyebilirsin.')}</p>
        <div className="videos-order-actions">
          <button className="primary-button" onClick={() => onLesson(noteFor(1))}>{tr('İlk dersten başla')} <ArrowRight size={15}/></button>
          <button className="text-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowLeft size={14}/> {tr('Başa dön')}</button>
        </div>
      </div>
    </section>

    {openVideo && <PlayerDialog video={openVideo.video} note={openVideo.note} onClose={() => setOpenVideo(null)} onLesson={onLesson}/>}
  </div>;
}
