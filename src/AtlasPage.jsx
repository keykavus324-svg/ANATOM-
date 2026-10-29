import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, BookOpen, Bookmark, ChevronRight, Compass, ExternalLink, Layers, Link2, Loader, Maximize2, Minimize2, MousePointerClick, RefreshCw, Rotate3d, Search, ShieldCheck, Sparkles, TriangleAlert } from 'lucide-react';
import { atlasSceneGroups as atlasSceneGroupsRaw, atlasUrl, defaultAtlasScene } from './atlas';
import { atlasSceneIn, atlasGroupsIn, atlasSourceIn } from './content/atlasI18n.js';
import { notes } from './data';
import { useI18n, useLocalizedContent } from './i18n.jsx';
import './atlas.css';

const SLOW_LOAD_MS = 12000;
const buildGroups = lang => atlasGroupsIn(lang).map(group => ({
  ...group,
  scenes: (atlasSceneGroupsRaw.find(item => item.id === group.id)?.scenes || []).map(scene => atlasSceneIn(lang, scene)),
}));
const ALL_IDS = atlasSceneGroupsRaw.flatMap(group => group.scenes.map(scene => scene.id));

function useSavedScenes() {
  const [saved, setSaved] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem('anatomi-atlas-scenes'));
      return Array.isArray(data) ? data.filter(id => ALL_IDS.includes(id)) : [];
    } catch { return []; }
  });
  useEffect(() => { try { localStorage.setItem('anatomi-atlas-scenes', JSON.stringify(saved)); } catch { /* Kaydetme kapalıysa atlas çalışmaya devam eder. */ } }, [saved]);
  const toggle = id => setSaved(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]);
  return [saved, toggle];
}

export default function AtlasPage({ scene, onScene, onLesson, onLibrary }) {
  const { tr, lang } = useI18n();
  const { scene: localizedScene } = useLocalizedContent();
  const active = localizedScene(scene || defaultAtlasScene);
  const atlasSceneGroups = buildGroups(lang);
  const allScenes = atlasSceneGroups.flatMap(group => group.scenes);
  const ATLAS_SOURCE = atlasSourceIn(lang);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [pseudoFullscreen, setPseudoFullscreen] = useState(false);
  const [copied, setCopied] = useState('');
  const [reachable, setReachable] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [group, setGroup] = useState('all');
  const [saved, toggleSaved] = useSavedScenes();
  const viewer = useRef(null);
  const url = atlasUrl(active);
  const lesson = notes.find(note => note.number === active.lesson);
  const savedActive = saved.includes(active.id);
  const expanded = fullscreen || pseudoFullscreen;

  useEffect(() => {
    const previous = document.title;
    document.title = `${active.title} · ${tr('3D Anatomi Atlası')} — ANATOMİ`;
    return () => { document.title = previous; };
  }, [active.title]);

  useEffect(() => {
    setLoaded(false);
    setSlow(false);
    setDismissed(false);
    const timer = setTimeout(() => setSlow(true), SLOW_LOAD_MS);
    return () => clearTimeout(timer);
  }, [active.id, reloadKey]);

  // Gömülü atlasın alan adına erişilemiyorsa (çevrimdışı, engelleyici, kurumsal ağ) kullanıcıyı
  // boş bir çerçeveyle bekletmek yerine hemen yeni sekme seçeneğini sunarız.
  useEffect(() => {
    let cancelled = false;
    setReachable(null);
    fetch(url, { mode: 'no-cors', cache: 'no-store', referrerPolicy: 'origin' })
      .then(() => { if (!cancelled) setReachable(true); })
      .catch(() => { if (!cancelled) setReachable(false); });
    return () => { cancelled = true; };
  }, [url, reloadKey]);

  useEffect(() => {
    const sync = () => { setFullscreen(Boolean(document.fullscreenElement)); if (!document.fullscreenElement) setPseudoFullscreen(false); };
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);
  useEffect(() => {
    if (!pseudoFullscreen) return;
    const escape = event => { if (event.key === 'Escape') setPseudoFullscreen(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', escape);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', escape); };
  }, [pseudoFullscreen]);
  useEffect(() => { if (group !== 'all' && group !== active.group) setGroup(active.group); }, [active.group]);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(''), copied.startsWith('#') ? 8000 : 2400);
    return () => clearTimeout(timer);
  }, [copied]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) { document.exitFullscreen?.().catch(() => {}); return; }
    viewer.current?.requestFullscreen?.().then(() => { setFullscreen(true); setPseudoFullscreen(false); }).catch(() => setPseudoFullscreen(value => !value));
  };
  const copyLink = async () => {
    const link = `${window.location.origin}${window.location.pathname}#/atlas/${active.id}`;
    try { await navigator.clipboard.writeText(link); setCopied(tr('Sahne bağlantısı kopyalandı.')); }
    catch { setCopied(link); }
  };
  const savedScenes = useMemo(() => saved.map(id => allScenes.find(item => item.id === id)).filter(Boolean), [saved]);

  return <div className="atlas-page">
    <div className="atlas-breadcrumb">
      <button onClick={onLibrary}><Compass size={15}/> {tr('Kütüphaneye dön')}</button>
      <span>{tr('3B ANATOMİ')} <i/> {tr('gömülü atlas görünümü')}</span>
    </div>

    <header className="atlas-hero">
      <div className="atlas-hero-copy">
        <div className="eyebrow"><span/> {tr('ETKİLEŞİMLİ 3B İNCELEME')} <i>{tr('ATLAS')}</i></div>
        <h1>{tr('3D Anatomi')} <em>{tr('Atlası')}</em></h1>
        <p className="atlas-lead">{tr('İnsan bedenini siteden ayrılmadan döndür, katmanları kaldır, organları tek tek izole et. Gömülü atlas, hak sahibinin ücretsiz iframe gömme yöntemiyle kendi sunucusundan açılır; ayrı bir üyelik gerekmez.')}</p>
        <div className="atlas-hero-meta">
          <span><Layers size={13}/> {tr('Katman katman inceleme')}</span>
          <span><Search size={13}/> {tr('Yapı arama ve izole etme')}</span>
          <span><Rotate3d size={13}/> {tr('360° döndürme ve yakınlaştırma')}</span>
        </div>
      </div>
      <div className="atlas-hero-card">
        <span className="atlas-hero-card-label">{tr('SEÇİLİ SAHNE')}</span>
        <strong>{active.title}</strong>
        <small>{active.latin}</small>
        <p>{active.source === 'zygote' ? tr('Hazır izole bağlantı: yapı seçili gelir, diğer katmanlar soldurulur.') : tr('Kamera bu bölgeye ayarlanır; katmanları gömülü arayüzden sen yönetirsin.')}</p>
        {lesson && <button className="atlas-lesson-link" onClick={() => onLesson(lesson)}><BookOpen size={14}/> {tr('Ders {n} · {title}', { n: String(lesson.number).padStart(2, '0'), title: lesson.title })} <ArrowUpRight size={13}/></button>}
      </div>
    </header>

    <nav className="atlas-groups" aria-label={tr('Atlas görünüm grupları')}>
      <button className={group === 'all' ? 'active' : ''} aria-pressed={group === 'all'} onClick={() => setGroup('all')}>{tr('Tüm görünümler')}<span>{allScenes.length}</span></button>
      {atlasSceneGroups.map(item => <button key={item.id} className={group === item.id ? 'active' : ''} aria-pressed={group === item.id} onClick={() => setGroup(item.id)}>{tr(item.label)}<span>{item.scenes.length}</span></button>)}
    </nav>

    <div className="atlas-layout">
      <aside className="atlas-sidebar" aria-label={tr('Atlas sahneleri')}>
        <div className="atlas-sidebar-head"><span className="eyebrow muted">{tr('SAHNELER')}</span><small>{savedScenes.length > 0 ? tr('{count} sahne kayıtlı', { count: savedScenes.length }) : tr('Bir sahne seç; ders eşleşmesi ve yol gösteren adımlar hazır gelir.')}</small></div>
        {atlasSceneGroups.filter(item => group === 'all' || item.id === group).map(item => <section key={item.id} className="atlas-scene-group">
          <h2>{tr(item.label)}<span>{tr(item.hint)}</span></h2>
          <div className="atlas-scene-list">
            {item.scenes.map(scene => <button key={scene.id} className={`atlas-scene ${active.id === scene.id ? 'active' : ''}`} aria-current={active.id === scene.id ? 'true' : undefined} onClick={() => onScene(scene.id)}>
              <span className="atlas-scene-dot"/>
              <span className="atlas-scene-text"><strong>{scene.title}</strong><small>{scene.latin}</small></span>
              {scene.source === 'zygote' ? <span className="atlas-badge" title={tr('Yapı izole edilmiş hazır bağlantı')}>{tr('izole')}</span> : <ChevronRight size={14}/>}
            </button>)}
          </div>
        </section>)}
        {savedScenes.length > 0 && <div className="atlas-saved-scenes"><span className="eyebrow muted">{tr('KAYDEDİLEN SAHNELER')}</span>{savedScenes.map(item => <button key={item.id} className={active.id === item.id ? 'active' : ''} onClick={() => onScene(item.id)}>{item.title}<Bookmark size={12} fill="currentColor"/></button>)}</div>}
      </aside>

      <div className="atlas-main">
        <div className="atlas-toolbar">
          <div className="atlas-toolbar-status" role="status" aria-live="polite">
            <span className={`atlas-status ${reachable === false ? 'blocked' : loaded ? 'ready' : 'loading'}`}><i/>{reachable === false ? tr('Atlas penceresi açılamadı') : loaded ? tr('Görünüm hazır') : tr('Atlas yükleniyor…')}</span>
            <span className="atlas-toolbar-caption">{tr(ATLAS_SOURCE.viewerLabel)} {tr('penceresi · döndürmek için sürükle')}</span>
          </div>
          <div className="atlas-tools">
            <button className={`icon-button ${savedActive ? 'is-saved' : ''}`} aria-pressed={savedActive} aria-label={savedActive ? tr('Sahneyi kaydedilenlerden kaldır') : tr('Sahneyi kaydet')} title={tr('Sahneyi kaydet')} onClick={() => toggleSaved(active.id)}><Bookmark size={17} fill={savedActive ? 'currentColor' : 'none'}/></button>
            <button className="icon-button" aria-label={tr('Atlas görünümünü yenile')} title={tr('Görünümü yenile')} onClick={() => setReloadKey(key => key + 1)}><RefreshCw size={17}/></button>
            <button className="icon-button" aria-label={expanded ? tr('Tam ekrandan çık') : tr('Tam ekran atlas')} title={expanded ? tr('Tam ekrandan çık') : tr('Tam ekran')} onClick={toggleFullscreen}>{expanded ? <Minimize2 size={17}/> : <Maximize2 size={17}/>}</button>
            <button className="text-button atlas-copy" onClick={copyLink}><Link2 size={15}/> {copied || tr('Sahne bağlantısını kopyala')}</button>
            <a className="primary-button atlas-open" href={url} target="_blank" rel="noreferrer">{tr('Yeni sekmede aç')} <ArrowUpRight size={15}/></a>
          </div>
        </div>

        <div className={`atlas-viewer ${pseudoFullscreen ? 'is-expanded' : ''}`} ref={viewer}>
          {reachable !== false && !loaded && !slow && <div className="atlas-overlay"><Loader size={26} className="atlas-spinner"/><p>{tr('{title} görünümü hazırlanıyor…', { title: active.title })}</p><small>{tr('Gömülü atlas altyapısına bağlanılıyor; ilk açılış birkaç saniye sürebilir.')}</small></div>}
          {(reachable === false || (slow && !loaded)) && !dismissed && <div className="atlas-overlay atlas-overlay-slow"><TriangleAlert size={25}/><p>{reachable === false ? tr('Gömülü atlasa bu ağdan ulaşılamıyor.') : tr('Gömülü görünüm açılmadı gibi görünüyor.')}</p><small>{reachable === false ? tr('Alan adı engellenmiş, çevrimdışısın ya da tarayıcı uzantın isteği durdurmuş olabilir. Atlası kaynağından yeni sekmede açabilirsin; sayfanın geri kalanı normal çalışır.') : tr('Ağ engeli, reklam engelleyici veya tarayıcının gizlilik ayarı çerçeveyi bloke edebilir. Atlası kaynağından yeni sekmede açabilirsin.')}</small><div className="atlas-overlay-actions"><a className="primary-button" href={url} target="_blank" rel="noreferrer">{tr('Yeni sekmede aç')} <ArrowUpRight size={15}/></a><button className="text-button" onClick={() => { setSlow(false); setReloadKey(key => key + 1); }}><RefreshCw size={15}/> {tr('Yeniden dene')}</button><button className="text-button" onClick={() => setDismissed(true)}>{tr('Pencereyi yine de göster')}</button></div></div>}
          <iframe key={`${active.id}-${reloadKey}`} src={url} title={`${active.title} — ${tr('3B anatomi atlası görünümü')}`} allow="fullscreen; xr-spatial-tracking; clipboard-write" allowFullScreen onLoad={() => { setLoaded(true); setSlow(false); }}/>
          {pseudoFullscreen && <button className="atlas-exit-fullscreen" onClick={() => setPseudoFullscreen(false)}><Minimize2 size={16}/> {tr('Tam ekrandan çık')}</button>}
        </div>

        {loaded && <div className="atlas-inline-note"><Info size={15}/><span>{tr('Gömülü pencerenin tüm temel araçları kullanılabilir: sol paneldeki opaklık kaydırıcısı, katman düğmesi, sağ üstteki arama kutusu ve etiket araçları bu pencerenin içindedir. Pencere boş kalırsa üstteki')} <b>{tr('Yeni sekmede aç')}</b> {tr('düğmesiyle atlası kaynağından görüntüleyebilirsin.')}</span></div>}

        <div className="atlas-guide">
          <article className="atlas-guide-main">
            <span className="eyebrow muted">{tr('BU SAHNEDE NE YAPILIR?')}</span>
            <h2>{active.title}<span>{active.latin}</span></h2>
            <p className="atlas-summary">{active.summary}</p>
            <div className="atlas-observe"><MousePointerClick size={16}/><p><strong>{tr('Neye bakmalı?')}</strong> {active.observe}</p></div>
            <ol className="atlas-steps">{active.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span>{step}</li>)}</ol>
          </article>
          <aside className="atlas-guide-side">
            <div className="atlas-tools-legend">
              <span className="eyebrow muted">{tr('GÖMÜLÜ ARAÇLAR')}</span>
              <ul>
                <li><strong>{tr('Döndür / yakınlaş:')}</strong> {tr('sürükle ve tekerlek; üstteki ev simgesi görünümü sıfırlar.')}</li>
                <li><strong>{tr('Opaklık kaydırıcısı:')}</strong> {tr('soldadır; çektikçe katmanlar tek tek açığa çıkar.')}</li>
                <li><strong>{tr('Katman düğmesi:')}</strong> {tr('kaydırıcının altındadır; katmanları tek tek açar.')}</li>
                <li><strong>{tr('Arama:')}</strong> {tr('sağ üsttedir; yapıyı seçer,')} <b>Zoom to</b> {tr('o yapıya odaklanır.')}</li>
                <li><strong>{tr('Gizle / pin:')}</strong> {tr('Ctrl/Cmd+tıklama yapıyı gizler, etiketteki raptiye sabitler.')}</li>
                <li><strong>{tr('Model seçimi:')}</strong> {tr('sol taraftaki model simgesinden kadın/erkek model değişir.')}</li>
              </ul>
            </div>
            {lesson && <div className="atlas-lesson-card"><BookOpen size={19}/><strong>{tr('Bu görünüm Ders {n} ile eşleşiyor.', { n: String(lesson.number).padStart(2, '0') })}</strong><p>{lesson.title} · {lesson.latin}</p><button className="text-button" onClick={() => onLesson(lesson)}>{tr('Konu anlatımını aç')} <ArrowUpRight size={14}/></button></div>}
            <div className="atlas-source-card">
              <ShieldCheck size={19}/>
              <strong>{tr('Kaynak ve kullanım')}</strong>
              <p>{tr(ATLAS_SOURCE.licence)}</p>
              <p className="atlas-credit-line">{ATLAS_SOURCE.credit}</p>
              <a href={ATLAS_SOURCE.termsUrl} target="_blank" rel="noreferrer">{tr('Kaynak sağlayıcının kullanım koşulları')} <ExternalLink size={12}/></a>
              <p className="atlas-source-small">{tr('Bu bölüm tıbbi tanı veya tedavi amacı taşımaz; ders çalışmasına yardımcı bir inceleme aracıdır. Gömülü görünümün çalışması kaynak sağlayıcının servisinin erişilebilirliğine bağlıdır.')}</p>
            </div>
            <div className="atlas-source-card atlas-source-tip">
              <Sparkles size={19}/>
              <strong>{tr('Dersle birlikte kullan')}</strong>
              <p>{tr('Bir konuyu okurken atlası ikinci sekmede açık tut. Her ders kendi atlas sahnesine bağlanır; böylece okuduğun yapıyı aynı anda üç boyutlu görürsün.')}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>;
}
