import React, { useId, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, RotateCcw } from 'lucide-react';
import { teachingForLesson, teachingForSection } from '../content/exam';
import { examSourcesIn, examReviewDateIn, examLocatorIn, examVisualIn } from '../content/examI18n.js';
import './exam-teaching.css';
import { useI18n } from '../i18n.jsx';

function moveTo(id) {
  const target = document.getElementById(`teaching-${id}`);
  target?.focus({ preventScroll: true });
  target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
}

export function ExamLearningMap({ number, items: translatedItems, note }) {
  const { tr, lang } = useI18n();
  const examSources = examSourcesIn(lang);
  const examReviewDate = examReviewDateIn(lang);
  const items = translatedItems || teachingForLesson(number);
  if (!items.length) return null;
  const sourceKeys = [...new Set(items.flatMap(item => item.evidence.map(([key]) => key)))];
  return <section className="exam-learning-map" aria-label={tr("Soru konularına göre ayrıntılı anlatım")}>
    <div className="exam-map-heading"><BookOpen aria-hidden="true" size={20}/><span>{tr("KONU ANLATIMINI DERİNLEŞTİR")}</span><span>{tr("{n} açıklamalı konu", { n: items.length })}</span></div>
    <h2>{tr("İsmi bilmek yetmez. Nedenini de öğren.")}</h2>
    <p>{sourceKeys.length ? tr('Paylaştığın soru klasöründeki okunabilen örnekler ile ders notları karşılaştırılarak hazırlanan ek anlatımlar, ilgili konunun içine yerleştirildi. Her başlıkta açıklama, karşılaştırma ve gerekçeli kontrol sorusu var.') : tr('Ders notundaki ilişkileri pekiştiren ek anlatım ve gerekçeli kontrol sorusu ilgili konunun içine yerleştirildi. Bu ders için incelenen arşivden doğrudan bir çıkmış soru eşleştirmesi yapılmadı.')}</p>
    <nav aria-label={tr("Ayrıntılı konu hedefleri")}><ol>{items.map((item, i) => <li key={item.id}><button onClick={() => moveTo(item.id)}><span>{String(i + 1).padStart(2, '0')}</span>{item.title}<ArrowRight aria-hidden="true" size={15}/></button></li>)}</ol></nav>
    <details className="exam-source-audit"><summary>{tr("Kaynak kontrolü ve bilmen gereken sınırlar")}</summary>
      <p>{tr('{date} · Bunlar özgün konu açıklamaları ve yeni hazırlanmış alıştırmalardır; soruların birebir kopyası veya resmî cevap anahtarı değildir. Arşivde farklı kurumlara ait ekran görüntüleri de vardır. Karalanmış ya da okunaksız satırlardan kesin cevap çıkarılmadı. İşaretli seçenekler doğruluk kanıtı sayılmadı. Yeni sınavın kapsamı ve notu garanti edilemez.', { date: examReviewDate })}</p>
      {sourceKeys.length > 0 && <ul>{sourceKeys.map(key => <li key={key}><a href={`https://drive.google.com/file/d/${examSources[key].id}/view`} target="_blank" rel="noreferrer">{examSources[key].name}</a><p>{examSources[key].review}</p></li>)}</ul>}
      <p>{tr("Aşağıdaki kaynak sayfa aralıkları ilgili ders konusunu gösterir. Ek açıklamalar proje tarafından yazılmıştır; hocanın onayladığı bir yayın olarak sunulmaz.")}</p>
    </details>
  </section>;
}

function KnowledgeCheck({ check }) {
  const { tr } = useI18n();
  const group = useId();
  const feedbackId = useId();
  const [choice, setChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  return <form className="teaching-check" onSubmit={event => { event.preventDefault(); if (choice !== null) setSubmitted(true); }}>
    <fieldset aria-describedby={submitted ? feedbackId : undefined}><legend><span>{tr("ANLADIĞINI KONTROL ET")}</span>{check.q}</legend>
      {check.options.map((option, i) => <label key={option} className={submitted && i === check.correct ? 'answer-correct' : submitted && choice === i ? 'answer-incorrect' : ''}><input type="radio" name={group} value={i} checked={choice === i} disabled={submitted} onChange={() => setChoice(i)}/><span><b>{String.fromCharCode(65 + i)}</b>{option}{submitted && i === check.correct && <small>{tr("Doğru seçenek")}</small>}</span></label>)}
    </fieldset>
    {!submitted ? <button className="teaching-check-submit" type="submit" disabled={choice === null}>{tr("Yanıtı kontrol et")} <ArrowRight aria-hidden="true" size={15}/></button> : <>
      <div className="teaching-feedback" id={feedbackId} role="status"><strong>{choice === check.correct ? <><CheckCircle2 aria-hidden="true" size={17}/> {tr('Doğru. Şimdi gerekçeyi karşılaştır.')}</> : <>{tr('Henüz değil. Doğru yanıt: {letter}', { letter: String.fromCharCode(65 + check.correct) })}</>}</strong><p>{check.why}</p></div>
      <button type="button" className="teaching-check-reset" onClick={() => { setChoice(null); setSubmitted(false); }}><RotateCcw aria-hidden="true" size={14}/> {tr("Yeniden dene")}</button>
    </>}
  </form>;
}

function TeachingFigure({ id }) {
  const { tr, lang } = useI18n();
  const figure = examVisualIn(lang, id);
  const captionId = useId();
  const [large, setLarge] = useState(false);
  if (!figure) return null;
  return <figure className="teaching-figure" aria-labelledby={captionId}>
    <div className={`teaching-figure-viewport${large ? ' is-large' : ''}`} tabIndex={large ? 0 : undefined} role={large ? 'region' : undefined} aria-label={large ? tr('Geniş şemayı yatay kaydırarak incele') : undefined}><img src={`${import.meta.env.BASE_URL}diagrams/exam/${id}.svg`} width="760" height="480" loading="lazy" alt={tr('{title}. Numaralı anahtar ve yön açıklaması aşağıdadır.', { title: figure.title })}/></div>
    <figcaption><h4 id={captionId}>{figure.title}</h4><p>{figure.caption}</p><button type="button" aria-pressed={large} onClick={() => setLarge(value => !value)}>{large ? tr('Şemayı ekrana sığdır') : tr('Geniş görünümde incele')}</button><ol>{figure.labels.map(label => <li key={label}>{label}</li>)}</ol><small>{tr("Proje için çizilen öğretici şema · Ölçeksiz ve sadeleştirilmiş · Atlas yerine geçmez.")}</small></figcaption>
  </figure>;
}

export default function ExamTeaching({ number, section, items: translatedItems }) {
  const { tr, lang } = useI18n();
  const examSources = examSourcesIn(lang);
  const items = (translatedItems || teachingForSection(number, section));
  return items.map(item => <div className="exam-teaching" key={item.id}>
    <div className="teaching-kicker">{tr("AÇIKLA • KARŞILAŞTIR • UYGULA")}</div>
    <h3 id={`teaching-${item.id}`} tabIndex={-1}>{item.title}</h3>
    {item.paragraphs.map(p => <p key={p}>{p}</p>)}
    {item.visual && <TeachingFigure id={item.visual}/>}
    <div className="lesson-table-wrap"><table><caption>{item.title} — {tr("ayırt etme tablosu")}</caption><thead><tr>{item.headers.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{item.rows.map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th scope="row" key={i}>{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>
    {item.trap && <aside className="teaching-trap"><strong>{tr("Çeldiriciyi fark et")}</strong><p>{item.trap}</p></aside>}
    {item.checks.map(check => <KnowledgeCheck key={check.q} check={check}/>)}
    <details className="teaching-evidence"><summary>{tr("Bu ek anlatımın kaynak eşleşmesi")}</summary><p>{tr("İlgili ders notunun konu aralığı bölümün altında belirtilir. Anlatım ve gerekçeler proje için yeniden yazılmıştır; birebir alıntı değildir.")}</p>{item.evidence.length > 0 ? <ul>{item.evidence.map(([key, locator]) => <li key={`${key}-${locator}`}><a href={`https://drive.google.com/file/d/${examSources[key].id}/view`} target="_blank" rel="noreferrer">{examSources[key].name}</a> · {examSources[key].pages ? tr('PDF sayfası: ') : tr('Konu / soru: ')}{examLocatorIn(lang, locator)}</li>)}</ul> : <p>{tr("Bu başlık ders notundan tamamlayıcı anlatımdır; doğrudan çıkmış soru eşleştirmesi yapılmadı.")}</p>}</details>
  </div>);
}
