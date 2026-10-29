import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Bookmark, Check, CheckCircle2, ChevronDown, Clock3, FileText, Languages, List, Minus, Plus, Rotate3d } from 'lucide-react';
import { lessons, readingMinutes } from './lessons';
import { notes } from './data';
import './lesson.css';
import InstructionalFigure from './components/InstructionalFigure';
import { diagramIn } from './content/diagramI18n.js';
import { studyGuides } from './content/studyGuides';
import ExamTeaching, { ExamLearningMap } from './components/ExamTeaching';
import { teachingForLesson, teachingForSection } from './content/exam';
import { lessonIn, guideIn, teachingIn, hasLessonTranslation, TRANSLATED_LESSONS } from './content/lessonI18n';
import { useI18n, useLocalizedContent } from './i18n.jsx';

function ComparisonTable({ table, title }) {
  const { tr } = useI18n();
  return <div className="lesson-table-wrap"><table><caption>{title} — {tr('karşılaştırma')}</caption><thead><tr>{table.headers.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{table.rows.map((row, j) => <tr key={j}>{row.map((cell, k) => k === 0 ? <th scope="row" key={k}>{cell}</th> : <td key={k}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

export default function LessonPage({ note, onPdf, onBack, onNavigate, onAtlas, atlasScene, saved, onSave, completed, onComplete }) {
  const { tr, isTurkish, lang } = useI18n();
  const { categoryLabel, notes: localizedNotes, scene: localizedScene } = useLocalizedContent();
  const baseLesson = lessons[note.number];
  // Translated lesson bodies replace the Turkish text element by element; the
  // structure, diagram keys and source page references stay identical.
  const lesson = lessonIn(lang, note.number, baseLesson);
  const guide = guideIn(lang, note.number, studyGuides[note.number]);
  const additionalTeaching = teachingIn(lang, note.number, teachingForLesson(note.number));
  const translated = hasLessonTranslation(lang, note.number);
  const diagramCount = lesson.sections.filter(s => s.diagram).length + additionalTeaching.filter(item => item.visual).length;
  const translatedCount = TRANSLATED_LESSONS[lang]?.length || 0;
  const [active, setActive] = useState(lesson.sections[0].id);
  const [progress, setProgress] = useState(0);
  const [fontSize, setFontSize] = useState(() => {
    try { const size = Number(localStorage.getItem('anatomi-reading-size')); return [14, 16, 18, 20].includes(size) ? size : 16; } catch { return 16; }
  });
  const content = useRef(null);
  const tocDetails = useRef(null);
  const bookNotes = localizedNotes(notes);
  const index = bookNotes.findIndex(n => n.id === note.id);
  useEffect(() => {
    try { localStorage.setItem('anatomi-reading-size', String(fontSize)); } catch { /* Reader works without storage. */ }
  }, [fontSize]);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${note.title} · ${tr('KONU ANLATIMI')} — ANATOMİ`;
    return () => { document.title = previousTitle; };
  }, [note.title, tr]);
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
  }, [lesson, fontSize]);
  const jump = (id, detailIndex) => {
    if (tocDetails.current) tocDetails.current.open = false;
    const target = document.getElementById(`lesson-${id}${detailIndex === undefined ? '' : `-detail-${detailIndex + 1}`}`);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    setActive(id);
  };
  const toc = <ol>{lesson.sections.map((section, i) => <li key={section.id}><button className={active === section.id ? 'active' : ''} aria-current={active === section.id ? 'location' : undefined} onClick={() => jump(section.id)}><span>{String(i + 1).padStart(2, '0')}</span>{section.title}</button>{section.subsections?.length > 0 && <ul className={`toc-subsections${active === section.id ? ' is-active' : ''}`} aria-label={`${section.title} ${tr('ayrıntıları')}`}>{section.subsections.map((subsection, j) => <li key={subsection.title}><button aria-label={tr('Ayrıntı: {title}', { title: subsection.title })} onClick={() => jump(section.id, j)}>{subsection.title}</button></li>)}</ul>}</li>)}<li><button onClick={() => jump('glossary')}><span>＋</span>{tr('Terim kartları')}</button></li><li><button onClick={() => jump('review')}><span>↳</span>{tr('Kendini yokla')}</button></li></ol>;
  return <div className="lesson-page" style={{ '--reading-size': `${fontSize}px` }}>
    <div className="lesson-breadcrumb"><button onClick={onBack}><ArrowLeft size={15}/> {tr('Kütüphaneye dön')}</button><span>{categoryLabel(note.category)} <i/> {note.number === 0 ? tr('Kaynak rehberi') : tr('Ders {n}', { n: String(note.number).padStart(2, '0') })}</span></div>
    <header className="lesson-hero">
      <div className="lesson-hero-copy"><div className="eyebrow"><span/> {tr('KONU ANLATIMI')} <i>ANATOMİ</i></div><h1>{note.title}</h1><p className="lesson-subtitle">{lesson.subtitle}</p><p className="lesson-intro">{lesson.intro}</p><div className="lesson-credit"><span className="credit-avatar">BD</span><div><strong>{tr('Kaynak: Öğr. Gör. Bekir Dağdeviren')}</strong><span>{tr('Konu anlatımı: ANATOMİ · Kaynak notlardan yeniden yazıldı')}</span></div></div><div className="lesson-metadata"><span><Clock3 size={14}/> {tr('Yaklaşık {n} dk okuma', { n: readingMinutes(lesson) })}</span><span><List size={14}/> {tr('{n} konu başlığı', { n: lesson.sections.length })}</span>{diagramCount > 0 && <span>{tr('{n} açıklamalı şema', { n: diagramCount })}</span>}</div></div>
      <figure className={`lesson-illustration illustration-${note.number}`}><span className="illustration-orbit"/><img src={`${import.meta.env.BASE_URL}${lesson.image.replace(/^\//, '')}`} alt={lesson.imageAlt} fetchPriority="high"/><figcaption><span>FIG. {String(note.number || 12).padStart(2, '0')}</span>{note.latin}<small>{tr('Yapay zekâ ile üretilmiş temsili çizim · Anatomik referans değildir.')}</small></figcaption></figure>
    </header>
    <div className="lesson-toolbar"><div className="reading-modes" aria-label={tr('Okuma biçimi')}><span className="current-mode"><BookOpen size={16}/> {tr('Sitede oku')}</span><button onClick={() => onPdf(note)}><FileText size={16}/> {tr('Orijinal PDF')} <ArrowUpRight size={14}/></button>{atlasScene && onAtlas && <button className="lesson-atlas-button" onClick={onAtlas}><Rotate3d size={16}/> 3D atlas <ArrowUpRight size={14}/></button>}</div><div className="reading-tools"><div className="font-controls" aria-label={tr('Metin boyutu')}><button onClick={() => setFontSize(s => Math.max(14, s - 2))} disabled={fontSize === 14} aria-label={tr('Yazıyı küçült')}><Minus size={13}/></button><span aria-live="polite" aria-label={tr('Yazı boyutu {n} piksel', { n: fontSize })}>Aa</span><button onClick={() => setFontSize(s => Math.min(20, s + 2))} disabled={fontSize === 20} aria-label={tr('Yazıyı büyüt')}><Plus size={13}/></button></div><button className={`lesson-save ${saved ? 'is-saved' : ''}`} aria-pressed={saved} onClick={() => onSave(note.id)}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'}/><span>{saved ? tr('Kaydedildi') : tr('Kaydet')}</span></button></div><div className="reading-progress" role="progressbar" aria-label={tr('Konu anlatımında ilerleme')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }}/></div></div>
    {!isTurkish && !translated && <div className="lesson-language-note"><Languages size={18}/><p>{tr('Bu ders henüz {language} diline çevrilmedi; metin Türkçe gösteriliyor. Çevrilen dersler: {done} / {total}. Arapça ders notu ve özgün PDF’ler Kaynaklar bölümündedir.', { language: tr(lang === 'ar' ? 'Arapça' : 'İngilizce'), done: translatedCount, total: Object.keys(lessons).length })}</p></div>}
    <div className="web-edition-note"><BookOpen size={18}/><p>{tr('Hocanın kaynak notları temel alınarak, konuları birbirine bağlayan açıklamalarla yeniden yazıldı. Slaytları karşılaştırmak için')} <button onClick={() => onPdf(note)}>{tr('orijinal PDF’yi aç')} <ArrowUpRight size={12}/></button>.</p></div>
    {atlasScene && onAtlas && <div className="lesson-atlas-note"><Rotate3d size={18}/><p><strong>{tr('Bu dersin üç boyutlu eşleşmesi:')}</strong> {localizedScene(atlasScene).title} · <em>{atlasScene.latin}</em> — {tr('Gömülü 3B atlasta katmanları kaldırıp yapıyı döndürerek inceleyebilirsin.')}<button onClick={onAtlas}>{tr('3D atlas sahnesini aç')} <ArrowUpRight size={12}/></button></p></div>}
    <ExamLearningMap number={note.number} items={additionalTeaching}/>
    {guide && <section className="visual-study" aria-label={tr('Görerek öğren çalışma alanı')}>
      <div className="eyebrow">{tr('GÖR → İLİŞKİ KUR → HATIRLA')}</div>
      <h2>{guide.goal}</h2><p>{guide.explanation}</p>
      <div className="visual-study-grid">{lesson.sections.filter(section => section.diagram).map(section => <button key={section.id} onClick={() => {
        const figure = document.querySelector(`[data-diagram="${section.diagram}"]`);
        figure?.focus({ preventScroll: true });
        figure?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      }}><img src={`${import.meta.env.BASE_URL}diagrams/${section.diagram}.svg`} width="760" height="460" alt="" loading="lazy"/><span>{diagramIn(lang, section.diagram).title}<ArrowRight size={16}/></span></button>)}</div>
      <div className="study-assignment"><strong>{tr('Şemada bul, kendi cümlenle anlat')}</strong><p>{guide.task}</p><details><summary>{tr('Örnek yanıtı karşılaştır')}</summary><p>{guide.answer}</p></details></div>
      <aside><strong>{tr('Sık karıştırılan nokta')}</strong><p>{guide.mistake}</p></aside>
      <small>{tr('Proje için hazırlanmış çalışma rehberi · Hocanın sınav sorusu değildir. Şemalar sadeleştirilmiş ve ölçeksizdir.')}</small>
    </section>}
    <details className="mobile-toc" ref={tocDetails}><summary><List size={17}/> {tr('Bu derste neler var?')}<ChevronDown size={16}/></summary><nav aria-label={tr('Mobil içindekiler')}>{toc}</nav></details>
    <div className="lesson-layout"><aside className="lesson-toc"><div className="toc-sticky"><div className="eyebrow">{tr('İÇİNDEKİLER')}</div><nav aria-label={tr('Ders içindekiler')}>{toc}</nav><div className="toc-pdf"><FileText size={21}/><strong>{tr('Özgün kaynağa dön.')}</strong><p>{tr('Slaytların tamamı ve hocanın kullandığı şekiller PDF’de.')}</p><button onClick={() => onPdf(note)}>{tr('PDF’yi aç')} <ArrowUpRight size={15}/></button></div></div></aside>
      <article className="lesson-content" ref={content} dir="auto" aria-label={`${note.title} ${tr('KONU ANLATIMI')}`}><div className="lesson-scope"><span>{tr('DERSİN YOL HARİTASI')}</span><p>{lesson.scope}</p></div>
        {lesson.sections.map((section, i) => <section className="lesson-section" key={section.id}><div className="lesson-section-title"><span>{String(i + 1).padStart(2, '0')}</span><h2 id={`lesson-${section.id}`} tabIndex={-1}>{section.title}</h2></div>
          {section.paragraphs?.map((p, j) => <p key={j}>{p}</p>)}
          {section.flow && <ol className="concept-flow" aria-label={tr('Sıralı anatomik akış')}>{section.flow.map((step, j) => <li key={step}><span>{String(j + 1).padStart(2, '0')}</span>{step}{j < section.flow.length - 1 && <ArrowRight size={15}/>}</li>)}</ol>}
          {section.table && <ComparisonTable table={section.table} title={section.title}/>}
          {section.bullets && <ul className="lesson-bullets">{section.bullets.map(b => <li key={b}>{b}</li>)}</ul>}
          {section.subsections?.map((subsection, j) => <div className="lesson-subsection" key={subsection.title}>
            <h3 id={`lesson-${section.id}-detail-${j + 1}`} tabIndex={-1}>{subsection.title}</h3>
            {subsection.paragraphs?.map((p, k) => <p key={k}>{p}</p>)}
            {subsection.table && <ComparisonTable table={subsection.table} title={subsection.title}/>}
          </div>)}
          <ExamTeaching number={note.number} section={section.id} items={teachingIn(lang, note.number, teachingForSection(note.number, section.id))}/>
          {section.diagram && <InstructionalFigure diagramId={section.diagram} number={`${String(note.number).padStart(2, '0')}.${String(i + 1).padStart(2, '0')}`}/>}
          {section.callout && <aside className="lesson-callout"><span>{tr('AKLINDA KALSIN')}</span><p>{section.callout}</p></aside>}
          <div className="section-source"><FileText size={12}/><span>{section.source} · {tr('Kaynak konu aralığı')}</span></div>
        </section>)}
        <section className="glossary-section"><div className="lesson-section-title"><span>＋</span><h2 id="lesson-glossary" tabIndex={-1}>{tr('Küçük bir terim rehberi')}</h2></div><p>{tr('Bu derste karşılaştığın sözcüklere hızlı bir dönüş.')}</p><dl className="glossary-grid">{lesson.glossary.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></section>
        <section className="review-section"><div className="eyebrow">{tr('ÖĞRENDİKLERİNİ PEKİŞTİR')}</div><h2 id="lesson-review" tabIndex={-1}>{tr('Okudun. Peki, hatırlıyor musun?')}</h2><p>{tr('Önce kendin yanıtla, sonra cevabı aç. Bunlar konu anlatımı için hazırlanmış tekrar sorularıdır; hocanın sınav soruları değildir.')}</p>{lesson.review.map((item, i) => <details key={item.q}><summary><span>{String(i + 1).padStart(2, '0')}</span>{item.q}<ChevronDown size={17}/></summary><p>{item.a}</p></details>)}</section>
        <div className="lesson-completion"><div><CheckCircle2 size={25}/><span><strong>{tr('Bir konu daha, bir adım daha.')}</strong><small>{tr('Okundu durumu bu tarayıcıda saklanır.')}</small></span></div><button className={`complete-button ${completed ? 'completed' : ''}`} onClick={() => onComplete(note.id)}>{completed ? <CheckCircle2 size={17}/> : <Check size={17}/>} {completed ? tr('Okundu olarak işaretlendi') : tr('Okundu olarak işaretle')}</button></div>
        <div className="lesson-source-footer"><span>{tr('ÖZGÜN KAYNAK')}</span><p>{tr('Öğr. Gör. Bekir Dağdeviren')} · <button onClick={() => onPdf(note)}>{note.original} <ArrowUpRight size={13}/></button></p><small>{tr('Bu konu anlatımı kaynak notlar temel alınarak proje için yazılmıştır; hocanın birebir metni veya onayladığı bir yayın değildir. Sayfa referansları kaynak konuyu belirtir; açıklayıcı ek bilgiler ve düzeltmeler içerir. Konu içindeki numaralı şemalar proje için hazırlanmıştır; sadeleştirilmiştir ve ölçekli anatomik atlas çizimleri değildir. Yapay zekâ ile üretilmiş kapak görseli hocanın PDF’sinden alınmamıştır ve anatomik hata içerebilir. Eğitim amaçlıdır; klinik referans değildir.')}</small></div>
        <nav className="lesson-next-prev" aria-label={tr('Dersler arasında gezinme')}>{index > 0 ? <button onClick={() => onNavigate(bookNotes[index - 1])}><ArrowLeft size={18}/><span><small>{tr('ÖNCEKİ NOT')}</small>{bookNotes[index - 1].title}</span></button> : <button onClick={onBack}><ArrowLeft size={18}/><span><small>{tr('BAŞLANGIÇ NOKTAN')}</small>{tr('Ders kütüphanesi')}</span></button>}{index < bookNotes.length - 1 && <button onClick={() => onNavigate(bookNotes[index + 1])}><span><small>{tr('SONRAKİ NOT')}</small>{bookNotes[index + 1].title}</span><ArrowRight size={18}/></button>}</nav>
      </article>
    </div>
  </div>;
}
