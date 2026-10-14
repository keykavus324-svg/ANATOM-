import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Bookmark, Check, CheckCircle2, ChevronDown, Clock3, FileText, List, Minus, Plus, ShieldCheck } from 'lucide-react';
import { lessons, readingMinutes } from './lessons';
import { notes } from './data';
import './lesson.css';
import FullCourseContent from './FullCourseContent';
import manifest from './courseManifest.json';

export default function LessonPage({ note, onPdf, onBack, onNavigate, saved, onSave, completed, onComplete }) {
  const lesson = lessons[note.number];
  const [edition, setEdition] = useState('full');
  const sourceInfo = manifest[note.number];
  const [active, setActive] = useState(lesson.sections[0].id);
  const [progress, setProgress] = useState(0);
  const [fontSize, setFontSize] = useState(() => {
    try { const size = Number(localStorage.getItem('anatomi-reading-size')); return [14, 16, 18, 20].includes(size) ? size : 16; } catch { return 16; }
  });
  const content = useRef(null);
  const tocDetails = useRef(null);
  const index = notes.findIndex(n => n.id === note.id);
  useEffect(() => {
    try { localStorage.setItem('anatomi-reading-size', String(fontSize)); } catch { /* Reader works without storage. */ }
  }, [fontSize]);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${note.title} · Web ders notu — ANATOMİ`;
    return () => { document.title = previousTitle; };
  }, [note.title]);
  useEffect(() => {
    const update = () => {
      const rect = content.current?.getBoundingClientRect();
      if (!rect) return;
      const distance = Math.max(1, rect.height - window.innerHeight + 120);
      setProgress(Math.round(Math.max(0, Math.min(100, (120 - rect.top) / distance * 100))));
      let current = lesson.sections[0].id;
      for (const section of lesson.sections) {
        if ((document.getElementById(`lesson-${section.id}`)?.getBoundingClientRect().top ?? Infinity) <= 190) current = section.id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [lesson, fontSize, edition]);
  const jump = id => {
    if (tocDetails.current) tocDetails.current.open = false;
    const target = document.getElementById(`lesson-${id}`);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    setActive(id);
  };
  const toc = <ol>{lesson.sections.map((section, i) => <li key={section.id}><button className={active === section.id ? 'active' : ''} aria-current={active === section.id ? 'location' : undefined} onClick={() => jump(section.id)}><span>{String(i + 1).padStart(2, '0')}</span>{section.title}</button></li>)}<li><button onClick={() => jump('glossary')}><span>＋</span>Terim kartları</button></li><li><button onClick={() => jump('review')}><span>↳</span>Kendini yokla</button></li></ol>;
  return <div className="lesson-page" style={{ '--reading-size': `${fontSize}px` }}>
    <div className="lesson-breadcrumb"><button onClick={onBack}><ArrowLeft size={15}/> Kütüphaneye dön</button><span>{note.category} <i/> {note.number === 0 ? 'Kaynak rehberi' : `Ders ${String(note.number).padStart(2, '0')}`}</span></div>
    <header className="lesson-hero">
      <div className="lesson-hero-copy"><div className="eyebrow"><span/> WEB DERS NOTU <i>{edition === 'full' ? 'TAM KAYNAK' : 'ÖZET'}</i></div><h1>{note.title}</h1><p className="lesson-subtitle">{lesson.subtitle}</p><p className="lesson-intro">{lesson.intro}</p><div className="lesson-credit"><span className="credit-avatar">BD</span><div><strong>Kaynak: Öğr. Gör. Bekir Dağdeviren</strong><span>Web düzenlemesi: ANATOMİ öğrenci projesi</span></div></div><div className="lesson-metadata"><span><Clock3 size={14}/> {edition === 'full' ? `${sourceInfo.totalPages} kaynak sayfası` : `Yaklaşık ${readingMinutes(lesson)} dk okuma`}</span><span><List size={14}/> {edition === 'full' ? 'Metin + özgün şekiller' : `${lesson.sections.length} konu başlığı`}</span></div></div>
      <figure className={`lesson-illustration illustration-${note.number}`}><span className="illustration-orbit"/><img src={lesson.image} alt={lesson.imageAlt} fetchPriority="high"/><figcaption><span>FIG. {String(note.number || 12).padStart(2, '0')}</span>{note.latin}<small>Yapay zekâ ile üretilmiş temsili çizim · Anatomik referans değildir.</small></figcaption></figure>
    </header>
    <div className="lesson-toolbar"><div className="reading-modes" aria-label="Okuma biçimi"><span className="current-mode"><BookOpen size={16}/> Sitede oku</span><button onClick={() => onPdf(note)}><FileText size={16}/> Orijinal PDF <ArrowUpRight size={14}/></button></div><div className="reading-tools"><div className="font-controls" aria-label="Metin boyutu"><button onClick={() => setFontSize(s => Math.max(14, s - 2))} disabled={fontSize === 14} aria-label="Yazıyı küçült"><Minus size={13}/></button><span aria-live="polite" aria-label={`Yazı boyutu ${fontSize} piksel`}>Aa</span><button onClick={() => setFontSize(s => Math.min(20, s + 2))} disabled={fontSize === 20} aria-label="Yazıyı büyüt"><Plus size={13}/></button></div><button className={`lesson-save ${saved ? 'is-saved' : ''}`} aria-pressed={saved} onClick={() => onSave(note.id)}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'}/><span>{saved ? 'Kaydedildi' : 'Kaydet'}</span></button></div><div className="reading-progress" role="progressbar" aria-label={edition === 'full' ? 'Görünen bölümde ilerleme' : 'Web notunda ilerleme'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }}/></div></div>
    <div className="edition-switch" role="group" aria-label="Web içeriği türü"><button className={edition === 'full' ? 'selected' : ''} aria-pressed={edition === 'full'} onClick={() => setEdition('full')}><BookOpen size={16}/><span>Kaynağın tamamı<small>{sourceInfo.totalPages} / {sourceInfo.totalPages} kaynak sayfası</small></span></button><button className={edition === 'summary' ? 'selected' : ''} aria-pressed={edition === 'summary'} onClick={() => setEdition('summary')}><List size={16}/><span>Hızlı tekrar<small>Seçilmiş konuların özeti</small></span></button></div>
    <div className="web-edition-note"><ShieldCheck size={18}/><p>{edition === 'full' ? <><strong>Kaynak PDF’nin bütün sayfaları web ortamında.</strong> Çıkarılan yazılar ile tüm özgün sayfa görselleri birlikte sunulur. Aktarım otomatiktir; hocanın onayladığı yeni bir yayın veya düzeltilmiş ders kitabı değildir. </> : <><strong>Hızlı tekrar — tam ders notu değil.</strong> Bu seçenek seçilmiş konuların öğrenci projesi kapsamında hazırlanmış özetidir; tam PDF aktarımı değildir. Tüm içerik için “Kaynağın tamamı” seçeneğine geç. </>}<button onClick={() => onPdf(note)}>PDF’yi aç <ArrowUpRight size={12}/></button></p></div>
    {edition === 'full' ? <div ref={content}><FullCourseContent note={note} onPdf={onPdf} completed={completed} onComplete={onComplete}/><nav className="lesson-next-prev" aria-label="Dersler arasında gezinme">{index > 0 ? <button onClick={() => onNavigate(notes[index - 1])}><ArrowLeft size={18}/><span><small>ÖNCEKİ NOT</small>{notes[index - 1].title}</span></button> : <button onClick={onBack}><ArrowLeft size={18}/><span><small>BAŞLANGIÇ NOKTAN</small>Ders kütüphanesi</span></button>}{index < notes.length - 1 && <button onClick={() => onNavigate(notes[index + 1])}><span><small>SONRAKİ NOT</small>{notes[index + 1].title}</span><ArrowRight size={18}/></button>}</nav></div> : <>
    <details className="mobile-toc" ref={tocDetails}><summary><List size={17}/> Bu notta neler var?<ChevronDown size={16}/></summary><nav aria-label="Mobil içindekiler">{toc}</nav></details>
    <div className="lesson-layout"><aside className="lesson-toc"><div className="toc-sticky"><div className="eyebrow">BU NOTTA</div><nav aria-label="Ders içindekiler">{toc}</nav><div className="toc-pdf"><FileText size={21}/><strong>Özgün kaynağa dön.</strong><p>Slaytların tamamı ve hocanın kullandığı şekiller PDF’de.</p><button onClick={() => onPdf(note)}>PDF’yi aç <ArrowUpRight size={15}/></button></div></div></aside>
      <article className="lesson-content" ref={content} aria-label={`${note.title} web çalışma notu`}><div className="lesson-scope"><span>BU ÖZETİN KAPSAMI</span><p>{lesson.scope}</p></div>
        {lesson.sections.map((section, i) => <section className="lesson-section" key={section.id}><div className="lesson-section-title"><span>{String(i + 1).padStart(2, '0')}</span><h2 id={`lesson-${section.id}`} tabIndex={-1}>{section.title}</h2></div>
          {section.paragraphs?.map((p, j) => <p key={j}>{p}</p>)}
          {section.flow && <ol className="concept-flow" aria-label="Sıralı anatomik akış">{section.flow.map((step, j) => <li key={step}><span>{String(j + 1).padStart(2, '0')}</span>{step}{j < section.flow.length - 1 && <ArrowRight size={15}/>}</li>)}</ol>}
          {section.table && <div className="lesson-table-wrap"><table><caption>{section.title} — karşılaştırma</caption><thead><tr>{section.table.headers.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{section.table.rows.map((row, j) => <tr key={j}>{row.map((cell, k) => k === 0 ? <th scope="row" key={k}>{cell}</th> : <td key={k}>{cell}</td>)}</tr>)}</tbody></table></div>}
          {section.bullets && <ul className="lesson-bullets">{section.bullets.map(b => <li key={b}>{b}</li>)}</ul>}
          {section.callout && <aside className="lesson-callout"><span>AKLINDA KALSIN</span><p>{section.callout}</p></aside>}
          <div className="section-source"><FileText size={12}/><span>Kaynak başlık: {section.source}</span></div>
        </section>)}
        <section className="glossary-section"><div className="lesson-section-title"><span>＋</span><h2 id="lesson-glossary" tabIndex={-1}>Küçük bir terim rehberi</h2></div><p>Bu derste karşılaştığın sözcüklere hızlı bir dönüş.</p><dl className="glossary-grid">{lesson.glossary.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></section>
        <section className="review-section"><div className="eyebrow">BİR DAKİKALIK TEKRAR</div><h2 id="lesson-review" tabIndex={-1}>Okudun. Peki, hatırlıyor musun?</h2><p>Önce kendin yanıtla, sonra cevabı aç. Bunlar web özeti için hazırlanmış tekrar sorularıdır; hocanın sınav soruları değildir.</p>{lesson.review.map((item, i) => <details key={item.q}><summary><span>{String(i + 1).padStart(2, '0')}</span>{item.q}<ChevronDown size={17}/></summary><p>{item.a}</p></details>)}</section>
        <div className="lesson-completion"><div><CheckCircle2 size={25}/><span><strong>Bir konu daha, bir adım daha.</strong><small>Okundu durumu bu tarayıcıda saklanır.</small></span></div><button className={`complete-button ${completed ? 'completed' : ''}`} onClick={() => onComplete(note.id)}>{completed ? <CheckCircle2 size={17}/> : <Check size={17}/>} {completed ? 'Okundu olarak işaretlendi' : 'Okundu olarak işaretle'}</button></div>
        <div className="lesson-source-footer"><span>ÖZGÜN KAYNAK</span><p>Öğr. Gör. Bekir Dağdeviren · <button onClick={() => onPdf(note)}>{note.original} <ArrowUpRight size={13}/></button></p><small>Web metni seçilmiş kaynak başlıklarının yeniden düzenlenmiş özetidir. Yapay zekâ ile üretilmiş kapak görseli hocanın PDF’sinden alınmamıştır ve anatomik hata içerebilir. Eğitim amaçlıdır; klinik referans değildir.</small></div>
        <nav className="lesson-next-prev" aria-label="Dersler arasında gezinme">{index > 0 ? <button onClick={() => onNavigate(notes[index - 1])}><ArrowLeft size={18}/><span><small>ÖNCEKİ NOT</small>{notes[index - 1].title}</span></button> : <button onClick={onBack}><ArrowLeft size={18}/><span><small>BAŞLANGIÇ NOKTAN</small>Ders kütüphanesi</span></button>}{index < notes.length - 1 && <button onClick={() => onNavigate(notes[index + 1])}><span><small>SONRAKİ NOT</small>{notes[index + 1].title}</span><ArrowRight size={18}/></button>}</nav>
      </article>
    </div></>}
  </div>;
}
