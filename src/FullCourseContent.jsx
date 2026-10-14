import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCircle2, ChevronDown, FileText, Image as ImageIcon, Search, X } from 'lucide-react';
import { normalize } from './data';
import manifest from './courseManifest.json';

const PAGE_SIZE = 6;
export default function FullCourseContent({ note, onPdf, completed, onComplete }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [query, setQuery] = useState('');
  const [batch, setBatch] = useState(0);
  const [pendingPage, setPendingPage] = useState(null);
  const resultsStart = useRef(null);
  const info = manifest[note.number];
  useEffect(() => {
    const controller = new AbortController();
    setError(false); setData(null);
    fetch(`/course-content/${note.number}.json`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Content unavailable'); return response.json(); })
      .then(result => { if (result.sourceId !== note.id || result.pages?.length !== info.totalPages) throw new Error('Incomplete source'); setData(result); })
      .catch(err => { if (err.name !== 'AbortError') setError(true); });
    return () => controller.abort();
  }, [note.number, note.id, info.totalPages, retry]);
  const pages = useMemo(() => {
    if (!data) return [];
    const terms = normalize(query).trim().split(/\s+/);
    return data.pages.filter(page => terms.every(term => normalize(`${page.title} ${page.text}`).includes(term)));
  }, [data, query]);
  const totalBatches = Math.max(1, Math.ceil(pages.length / PAGE_SIZE));
  const visible = pages.slice(batch * PAGE_SIZE, (batch + 1) * PAGE_SIZE);
  const goToBatch = next => { setBatch(Math.min(totalBatches - 1, Math.max(0, next))); resultsStart.current?.scrollIntoView({ behavior: 'instant', block: 'start' }); };
  const jumpToPage = number => {
    const index = data.pages.findIndex(page => page.number === number);
    if (index < 0) return;
    setQuery(''); setBatch(Math.floor(index / PAGE_SIZE)); setPendingPage(number);
  };
  useEffect(() => {
    if (pendingPage === null) return;
    const target = document.getElementById(`source-page-${pendingPage}`);
    if (target) { target.scrollIntoView({ behavior: 'instant', block: 'start' }); target.focus({ preventScroll: true }); setPendingPage(null); }
  }, [pendingPage, batch, query]);
  if (error) return <div className="full-content-status" role="alert"><FileText size={27}/><h2>Web aktarımı yüklenemedi.</h2><p>Hiçbir sayfayı eksik göstermemek için içerik bütünlüğü kontrol ediliyor. Yeniden deneyebilir veya orijinal PDF’yi açabilirsin.</p><button className="primary-button" onClick={() => setRetry(value => value + 1)}>Yeniden dene</button><button className="text-button" onClick={() => onPdf(note)}>Orijinal PDF’yi aç <ArrowUpRight size={15}/></button></div>;
  if (!data) return <div className="full-content-status" role="status"><span className="spinner"/><p>{info.totalPages} kaynak sayfasının web metni hazırlanıyor…</p></div>;
  const pagination = <div className="source-pagination"><button disabled={batch === 0} onClick={() => goToBatch(batch - 1)}><ArrowLeft size={15}/> Önceki bölüm</button><span>Bölüm {batch + 1} / {totalBatches}</span><button disabled={batch + 1 >= totalBatches} onClick={() => goToBatch(batch + 1)}>Sonraki bölüm <ArrowRight size={15}/></button></div>;
  return <section className="full-course" aria-label={`${note.title} tam web aktarımı`}>
    <div className="full-course-heading"><div><div className="eyebrow">KAYNAĞIN TAMAMI · SAYFA SAYFA</div><h2>Hiçbir sayfayı atlamadan.</h2><p>Öğr. Gör. Bekir Dağdeviren’in <strong>{info.totalPages} sayfalık</strong> dosyasının tüm sayfaları burada. Çıkarılabilen metinler web yazısı olarak, şekiller ve metin katmanı olmayan içerikler özgün sayfa görseliyle sunulur.</p></div><div className="coverage-seal"><CheckCircle2 size={22}/><strong>{data.pages.length} / {info.totalPages}</strong><span>KAYNAK SAYFASI</span></div></div>
    <div className="source-fidelity"><FileText size={17}/><p><strong>Otomatik kaynak aktarımıdır, yeniden yazılmış ders kitabı değildir.</strong> Metin sırası, karakterler veya tablo yerleşimi PDF’den aktarılırken bozulabilir. Her sayfanın renkleri ve etiketleri korunmuş görseli de bu yüzden eklenmiştir. Kaynak metindeki bilimsel doğruluk ayrıca öğretim elemanı denetimi gerektirir.</p></div>
    <div className="full-course-controls" ref={resultsStart}><label className="full-search"><Search size={17}/><input type="search" aria-label="Tam ders metninde ara" placeholder="Bu dersin bütün metninde ara…" value={query} onChange={event => { setQuery(event.target.value); setBatch(0); }}/>{query && <button aria-label="Ders içi aramayı temizle" onClick={() => { setQuery(''); setBatch(0); }}><X size={15}/></button>}</label><label className="source-page-jump"><span>Sayfaya git</span><select aria-label="Kaynak sayfasına git" value="" onChange={event => jumpToPage(Number(event.target.value))}><option value="" disabled>Bir başlık seç</option>{data.pages.map(page => <option value={page.number} key={page.number}>{String(page.number).padStart(2, '0')} · {page.title}</option>)}</select><ChevronDown size={14}/></label></div>
    <div className="full-result-meta"><span role="status">{query ? `${pages.length} / ${info.totalPages} kaynak sayfası eşleşti` : `${info.totalPages} kaynak sayfasının tamamı aktarıldı`}</span><small>Arama, çıkarılan metni tarar; görsel içindeki yazılar OCR ile taranmamıştır.</small></div>
    {pagination}
    {visible.length === 0 ? <div className="empty-state"><Search size={30}/><h3>Bu metinde eşleşme bulunamadı.</h3><p>Terim yalnızca bir görsel içinde yer alıyor olabilir. Aramayı temizleyip kaynak sayfalarını inceleyebilirsin.</p><button className="primary-button" onClick={() => { setQuery(''); setBatch(0); }}>Tüm sayfalara dön</button></div> : <div className="source-pages">{visible.map(page => <article className="source-page" key={page.number}><header className="source-page-heading"><span>{String(page.number).padStart(2, '0')}<small>/{info.totalPages}</small></span><div><div className="eyebrow">ÖZGÜN KAYNAK · SAYFA {page.number}</div><h3 id={`source-page-${page.number}`} tabIndex={-1}>{page.title}</h3></div></header>
      {page.hasExtractableText ? <div className="source-page-text">{page.blocks.map((text, i) => <p key={i}>{text}</p>)}</div> : <div className="image-only-note"><ImageIcon size={18}/><p>Bu sayfanın okunabilir bir metin katmanı yok. İçeriği atlamamak için özgün sayfanın tamamı aşağıda gösteriliyor.</p></div>}
      <figure className="source-page-figure"><div><span><ImageIcon size={14}/> Özgün sayfa ve şekiller</span><a href={page.image} target="_blank" rel="noreferrer" aria-label={`Kaynak sayfa ${page.number} görselini büyüt`}>Büyüt <ArrowUpRight size={14}/></a></div><a href={page.image} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true"><img src={page.image} width={page.width} height={page.height} loading="lazy" decoding="async" alt={`${note.title}, kaynak PDF sayfa ${page.number}: ${page.title}. Metin dışındaki şekil ve etiketleri içerir.`}/></a><figcaption>Kaynak: Öğr. Gör. Bekir Dağdeviren · {note.original} · Sayfa {page.number}. Orijinal renkler korunmuştur; yapay zekâ çizimi değildir.</figcaption></figure>
    </article>)}</div>}
    {pagination}
    <div className="lesson-completion"><div><BookOpen size={25}/><span><strong>Kendi hızında, tüm not boyunca.</strong><small>Okundu işareti otomatik konulmaz; karar senin.</small></span></div><button className={`complete-button ${completed ? 'completed' : ''}`} onClick={() => onComplete(note.id)}>{completed ? <CheckCircle2 size={17}/> : <Check size={17}/>} {completed ? 'Okundu olarak işaretlendi' : 'Okundu olarak işaretle'}</button></div>
    <div className="full-source-footer"><ShieldText/><p>Kaynak dosyanın {info.totalPages} sayfası; metin ve özgün görsel karşılıklarıyla 14 Ekim 2026’da aktarıldı. Web aktarımı Drive izinlerinden bağımsızdır. Haklar ilgili hak sahiplerine aittir.</p><button onClick={() => onPdf(note)}>Orijinal PDF ile karşılaştır <ArrowUpRight size={14}/></button></div>
  </section>;
}
function ShieldText(){ return <span className="eyebrow">EMEĞE VE KAYNAĞA SAYGIYLA</span>; }
