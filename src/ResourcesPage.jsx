import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, BookOpen, ExternalLink, FileText, Languages, RotateCcw, ShieldCheck, X } from 'lucide-react';
import { useI18n } from './i18n.jsx';
import { arabicNote, arabicNotePreviewUrl, arabicNoteViewUrl, openResources } from './resources.js';
import { DRIVE_URL } from './data.js';
import './resources.css';

function NoteViewer({ note, onClose }) {
  const { lang, tr } = useI18n();
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; dialog.close(); };
  }, []);
  return <dialog ref={ref} className="resource-reader-dialog" aria-label={`${note.title[lang]} — ${tr('PDF okuyucu')}`} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <header><div><BookOpen size={21}/><h2>{note.title[lang]}</h2></div><button className="icon-button" aria-label={tr('Okuyucuyu kapat')} onClick={onClose}><X size={22}/></button></header>
    <p className="resource-reader-info">{tr('Özgün ders notu · Google Drive üzerinden görüntülenir')}</p>
    <div className="resource-pdf-area">
      {!loaded && <div className="resource-loading"><span className="spinner"/><p>{tr('Notunuz hazırlanıyor…')}</p><small>{tr('Google Drive okuyucusuna bağlanılıyor.')}</small></div>}
      <iframe key={revision} src={arabicNotePreviewUrl(note)} title={`${note.title[lang]} PDF`} allow="fullscreen" onLoad={() => setLoaded(true)}/>
    </div>
    <footer>
      <span>{tr('Belge açılmıyorsa Google hesabınızla giriş yapmanız veya dosya sahibinden erişim istemeniz gerekebilir.')}</span>
      <button className="text-button" onClick={() => { setLoaded(false); setRevision(value => value + 1); }}><RotateCcw size={14}/> {tr('Yenile')}</button>
      <a className="text-button" href={arabicNoteViewUrl(note)} target="_blank" rel="noopener noreferrer">{tr('Drive’da aç')} <ExternalLink size={14}/></a>
    </footer>
  </dialog>;
}

export default function ResourcesPage() {
  const { lang, tr } = useI18n();
  const [open, setOpen] = useState(false);
  return <section className="resources-page" aria-labelledby="resources-heading">
    <div className="eyebrow"><span/> {tr('KAYNAK MERKEZİ')}</div>
    <h1 id="resources-heading">{tr('Kaynaklar')}<em>{tr('Açık kaynaklar, Arapça notlar ve lisans notu.')}</em></h1>

    <article className="resource-feature">
      <div className="resource-feature-icon"><Languages size={26} aria-hidden="true"/></div>
      <div className="resource-feature-copy">
        <span className="eyebrow muted">{tr('Arapça ders notu')}</span>
        <h2>{arabicNote.title[lang]}</h2>
        <p>{arabicNote.description[lang]}</p>
        <small className="resource-meta"><FileText size={13}/> PDF · {arabicNote.access}</small>
      </div>
      <div className="resource-feature-actions">
        <button className="primary-button" onClick={() => setOpen(true)}>{tr('Arapça notu aç')} <ArrowUpRight size={16}/></button>
        <a className="text-button" href={arabicNoteViewUrl(arabicNote)} target="_blank" rel="noopener noreferrer">{tr('Drive’da görüntüle')} <ExternalLink size={14}/></a>
      </div>
    </article>

    <section className="resource-licence">
      <ShieldCheck size={22} aria-hidden="true"/>
      <div>
        <h2>{tr('Lisanslı kitaplar kaldırıldı')}</h2>
        <p>{tr('Netter, Gray’s, Sobotta, Moore ve benzeri telif hakkı korunan atlas ve kitaplar siteden kaldırıldı. Bu sayfada yalnızca izin verilen veya açık lisanslı kaynaklar listelenir.')}</p>
        <p>{tr('Telif hakkına saygı')}: {tr('Bu sitede telif hakkı korunan kitap veya atlas PDF’si barındırılmaz. Kaynak önerileri, hak sahiplerinin kendi yayınlarına bağlantı verir.')}</p>
      </div>
    </section>

    <div className="section-heading resource-heading"><div><div className="eyebrow muted">{tr('Ücretsiz erişim')}</div><h2>{tr('Açık lisanslı kaynaklar')}<span>{openResources.length}</span></h2><p>{tr('Bu bağlantılar yeni sekmede açılır. Lisans bilgisi kaynağın kendi sayfasında geçerlidir.')}</p></div></div>
    <div className="resource-grid">
      {openResources.map(item => <article className="resource-card" key={item.id}>
        <span className="resource-provider">{item.provider}</span>
        <h3>{item.title}</h3>
        <p>{item.note[lang]}</p>
        <span className="resource-licence-tag">{item.licence}</span>
        <a className="resource-open" href={item.url} target="_blank" rel="noopener noreferrer">{tr('Kaynağı aç')} <ArrowUpRight size={15}/></a>
      </article>)}
    </div>

    <section className="resource-archive">
      <div><h2>{tr('Hocamızın Drive arşivi')}</h2><p>{tr('Ders notlarının özgün PDF’leri Google Drive klasöründe.')}</p></div>
      <a className="primary-button" href={DRIVE_URL} target="_blank" rel="noopener noreferrer">{tr('Arşivi aç')} <ArrowUpRight size={16}/></a>
    </section>

    {open && <NoteViewer note={arabicNote} onClose={() => setOpen(false)}/>}
  </section>;
}
