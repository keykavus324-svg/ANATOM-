import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Compass, Info, Layers, Loader, Maximize2, Minimize2, MousePointerClick, RefreshCw, Rotate3d, ShieldCheck, Sparkles, TriangleAlert } from 'lucide-react';
import { ATLAS_SOURCE } from './atlas';
import { useI18n } from './i18n.jsx';
import './atlas.css';

const SLOW_LOAD_MS = 12000;

// Muhammet TUĞRUL'un atlası tek bir gömülü pencere olarak açılır. Atlasın kendi menüleri
// (görünümler, kesit düzlemleri, sistemler) pencerenin içinde çalışır.
export default function AtlasPage({ onLibrary }) {
  const { tr } = useI18n();
  const url = ATLAS_SOURCE.url;
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [pseudoFullscreen, setPseudoFullscreen] = useState(false);
  const [reachable, setReachable] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const viewer = useRef(null);
  const expanded = fullscreen || pseudoFullscreen;

  useEffect(() => {
    const previous = document.title;
    document.title = `${ATLAS_SOURCE.title} — ${tr('İnteraktif Anatomi Atlası')} · ANATOMİ`;
    return () => { document.title = previous; };
  }, [tr]);

  useEffect(() => {
    setLoaded(false);
    setSlow(false);
    setDismissed(false);
    const timer = setTimeout(() => setSlow(true), SLOW_LOAD_MS);
    return () => clearTimeout(timer);
  }, [reloadKey]);

  // Atlasın adresine erişilemiyorsa (çevrimdışı, engelleyici, kurumsal ağ) kullanıcıyı boş bir
  // çerçeveyle bekletmek yerine hemen yeni sekme seçeneğini sunarız.
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

  const toggleFullscreen = () => {
    if (document.fullscreenElement) { document.exitFullscreen?.().catch(() => {}); return; }
    viewer.current?.requestFullscreen?.().then(() => { setFullscreen(true); setPseudoFullscreen(false); }).catch(() => setPseudoFullscreen(value => !value));
  };

  const status = reachable === false ? 'blocked' : loaded ? 'ready' : 'loading';

  return <div className="atlas-page">
    <div className="atlas-breadcrumb">
      <button onClick={onLibrary}><Compass size={15}/> {tr('Kütüphaneye dön')}</button>
      <span>{tr('3B ANATOMİ')} <i/> {tr('gömülü atlas görünümü')}</span>
    </div>

    <header className="atlas-hero">
      <div className="atlas-hero-copy">
        <div className="eyebrow"><span/> {tr('ETKİLEŞİMLİ 3B İNCELEME')} <i>{tr('ATLAS')}</i></div>
        <h1>{ATLAS_SOURCE.title} <em>{tr('İnteraktif Anatomi Atlası')}</em></h1>
        <p className="atlas-lead">{tr('TUĞRUL ATLAS, Muhammet TUĞRUL tarafından hazırlanmış interaktif bir insan anatomisi atlasıdır. Atlası bu sayfada döndürebilir, yakınlaştırabilir ve yapıları inceleyebilirsin.')}</p>
        <div className="atlas-hero-meta">
          <span><Layers size={13}/> {tr('Katman katman inceleme')}</span>
          <span><Rotate3d size={13}/> {tr('360° döndürme ve yakınlaştırma')}</span>
          <span><MousePointerClick size={13}/> {tr('Sistem ve görünüm menüsü')}</span>
        </div>
      </div>
      <div className="atlas-hero-card">
        <span className="atlas-hero-card-label">{tr('HAZIRLAYAN')}</span>
        <strong>{ATLAS_SOURCE.title}</strong>
        <small>{ATLAS_SOURCE.author}</small>
        <p>{tr('Atlas bu sayfada gömülü olarak açılır. Görünüm ve sistem menüleri atlasın kendi arayüzündedir.')}</p>
      </div>
    </header>

    <div className="atlas-toolbar">
      <div className="atlas-toolbar-status" role="status" aria-live="polite">
        <span className={`atlas-status ${status}`}><i/>{reachable === false ? tr('Atlas penceresi açılamadı') : loaded ? tr('Görünüm hazır') : tr('Atlas yükleniyor…')}</span>
        <span className="atlas-toolbar-caption">{tr('Gömülü 3B atlas')} {tr('penceresi · döndürmek için sürükle')}</span>
      </div>
      <div className="atlas-tools">
        <button className="icon-button" aria-label={tr('Atlas görünümünü yenile')} title={tr('Görünümü yenile')} onClick={() => setReloadKey(key => key + 1)}><RefreshCw size={17}/></button>
        <button className="icon-button" aria-label={expanded ? tr('Tam ekrandan çık') : tr('Tam ekran atlas')} title={expanded ? tr('Tam ekrandan çık') : tr('Tam ekran')} onClick={toggleFullscreen}>{expanded ? <Minimize2 size={17}/> : <Maximize2 size={17}/>}</button>
        <a className="primary-button atlas-open" href={url} target="_blank" rel="noreferrer">{tr('Yeni sekmede aç')} <ArrowUpRight size={15}/></a>
      </div>
    </div>

    <div className={`atlas-viewer ${pseudoFullscreen ? 'is-expanded' : ''}`} ref={viewer}>
      {reachable !== false && !loaded && !slow && <div className="atlas-overlay"><Loader size={26} className="atlas-spinner"/><p>{tr('Atlas hazırlanıyor…')}</p><small>{tr('Atlasın sunucusuna bağlanılıyor; ilk açılış birkaç saniye sürebilir.')}</small></div>}
      {(reachable === false || (slow && !loaded)) && !dismissed && <div className="atlas-overlay atlas-overlay-slow">
        <TriangleAlert size={25}/>
        <p>{reachable === false ? tr('Gömülü atlasa bu ağdan ulaşılamıyor.') : tr('Gömülü görünüm açılmadı gibi görünüyor.')}</p>
        <small>{reachable === false ? tr('Alan adı engellenmiş, çevrimdışısın ya da tarayıcı uzantın isteği durdurmuş olabilir. Atlası yeni sekmede açabilirsin; sayfanın geri kalanı normal çalışır.') : tr('Ağ engeli, reklam engelleyici veya tarayıcının gizlilik ayarı çerçeveyi bloke edebilir. Atlası yeni sekmede açabilirsin.')}</small>
        <div className="atlas-overlay-actions">
          <a className="primary-button" href={url} target="_blank" rel="noreferrer">{tr('Yeni sekmede aç')} <ArrowUpRight size={15}/></a>
          <button className="text-button" onClick={() => { setSlow(false); setReloadKey(key => key + 1); }}><RefreshCw size={15}/> {tr('Yeniden dene')}</button>
          <button className="text-button" onClick={() => setDismissed(true)}>{tr('Pencereyi yine de göster')}</button>
        </div>
      </div>}
      <iframe key={reloadKey} src={url} title={`${ATLAS_SOURCE.title} — ${tr('3B anatomi atlası görünümü')}`} allow="fullscreen; xr-spatial-tracking; clipboard-write" allowFullScreen onLoad={() => { setLoaded(true); setSlow(false); }}/>
      {pseudoFullscreen && <button className="atlas-exit-fullscreen" onClick={() => setPseudoFullscreen(false)}><Minimize2 size={16}/> {tr('Tam ekrandan çık')}</button>}
    </div>

    {loaded && <div className="atlas-inline-note"><Info size={15}/><span>{tr('Atlasın araçları pencerenin içindedir. Pencere boş kalırsa “{open}” düğmesiyle atlası ayrı bir sekmede açabilirsin.', { open: tr('Yeni sekmede aç') })}</span></div>}

    <div className="atlas-guide">
      <article className="atlas-guide-main">
        <span className="eyebrow muted">{tr('NASIL KULLANILIR?')}</span>
        <h2>{tr('Atlası nasıl incelersin?')}</h2>
        <p className="atlas-summary">{tr('Atlasın içindeki düğmeler görünümü ve kesit düzlemini değiştirir. Aşağıdaki adımlar en sık kullanılan akışı gösterir.')}</p>
        <ol className="atlas-steps">
          <li><span>01</span>{tr('Atlası sürükleyerek döndür; fare tekerleğiyle ya da kıstırarak yakınlaş.')}</li>
          <li><span>02</span>{tr('“Önce, Arka, Sol, Sağ” düğmeleriyle açıyı değiştir.')}</li>
          <li><span>03</span>{tr('“Aksiyal, Sagittal, Koronal” düğmeleriyle kesit düzlemini seç.')}</li>
          <li><span>04</span>{tr('“Sistemler” menüsünden bir sistem seç ve yapıları o sisteme göre incele.')}</li>
        </ol>
      </article>
      <aside className="atlas-guide-side">
        <div className="atlas-source-card">
          <ShieldCheck size={19}/>
          <strong>{tr('Kaynak ve kullanım')}</strong>
          <p>{tr('Bu atlas Muhammet TUĞRUL’un kendi çalışmasıdır; site yalnızca onu gömülü olarak gösterir.')}</p>
          <p className="atlas-credit-line">{tr('Bir Muhammet TUĞRUL projesi.')}</p>
          <p className="atlas-source-small">{tr('Bu bölüm tıbbi tanı veya tedavi amacı taşımaz; ders çalışmasına yardımcı bir inceleme aracıdır. Gömülü görünüm, atlasın sunucusunun erişilebilirliğine bağlıdır.')}</p>
        </div>
        <div className="atlas-source-card atlas-source-tip">
          <Sparkles size={19}/>
          <strong>{tr('Dersle birlikte kullan')}</strong>
          <p>{tr('Bir konuyu okurken atlası ikinci sekmede açık tut; okuduğun yapıyı aynı anda üç boyutlu görürsün.')}</p>
        </div>
      </aside>
    </div>
  </div>;
}
