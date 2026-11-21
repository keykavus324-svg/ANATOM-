import React, { useMemo, useState } from 'react';
import { ClipboardCheck, RotateCcw, Check, X } from 'lucide-react';
import { lessons } from '../lessons';
import { diagramIn } from '../content/diagramI18n.js';
import { termsIn } from '../content/terminology.js';
import { useI18n } from '../i18n.jsx';

const mulberry = seed => () => {
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Bölüm sonu 5 soruluk mini test: 3 soru şekil üzerinden yapı bulma
// (plakadaki numaralı pin), 2 soru Latince–Türkçe terim eşleştirme.
export default function MiniTest({ number }) {
  const { tr, lang } = useI18n();
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const questions = useMemo(() => {
    const random = mulberry(number * 7919 + 13);
    const figures = lessons[number].sections.filter(section => section.diagram)
      .map(section => ({ diagramId: section.diagram, figure: diagramIn(lang, section.diagram) }))
      .filter(entry => entry.figure && entry.figure.labels.length >= 4);
    const list = [];
    for (const { diagramId, figure } of figures.slice(0, 3)) {
      const pin = Math.floor(random() * figure.labels.length);
      const wrong = figure.labels.map((label, i) => ({ label: label.name, i })).filter(item => item.i !== pin);
      const picks = wrong.sort(() => random() - 0.5).slice(0, 3).map(item => item.label);
      list.push({ id: `fig-${diagramId}-${pin}`, kind: 'figure', figure: figure.title, pin: pin + 1, options: [figure.labels[pin].name, ...picks].sort(() => random() - 0.5), correct: figure.labels[pin].name, diagramId });
    }
    const terms = termsIn(number);
    for (const term of terms.sort(() => random() - 0.5).slice(0, 2)) {
      const pool = terms.filter(item => item.la !== term.la);
      const picks = pool.sort(() => random() - 0.5).slice(0, 3).map(item => item.tr);
      list.push({ id: `term-${term.la}`, kind: 'term', la: term.la, options: [term.tr, ...picks].sort(() => random() - 0.5), correct: term.tr });
    }
    return list.slice(0, 5);
  }, [number, lang]);
  if (questions.length === 0) return null;
  const score = questions.filter(question => answers[question.id] === question.correct).length;
  return <section className="mini-test" aria-label={tr('Bölüm sonu mini test')}>
    <div className="mini-test-head"><ClipboardCheck size={18}/><div><strong>{tr('Mini test · {n} soru', { n: questions.length })}</strong><small>{tr('Görselden yapı bul ve terimi eşleştir; puanlı sınav değildir.')}</small></div></div>
    <ol className="mini-test-list">
      {questions.map((question, i) => {
        const picked = answers[question.id];
        return <li key={question.id} className={checked ? (picked === question.correct ? 'is-correct' : 'is-wrong') : ''}>
          <p className="mini-test-stem"><span>{i + 1}</span>{question.kind === 'figure'
            ? tr('Şekilde {n} numarayla işaretlenen yapı hangisidir?', { n: question.pin })
            : <>{tr('Latincesi verilen terimin Türkçe karşılığı hangisi?')} <strong className="mini-la">{question.la}</strong></>}
          </p>
          {question.kind === 'figure' && <figure className="mini-test-figure"><img src={`${import.meta.env.BASE_URL}diagrams/${question.diagramId}.svg`} width="760" height="460" loading="lazy" alt={question.figure}/><figcaption>{question.figure}</figcaption></figure>}
          <div className="mini-test-options" role="group">
            {question.options.map(option => <button
              key={option}
              aria-pressed={picked === option}
              disabled={checked}
              onClick={() => setAnswers(current => ({ ...current, [question.id]: option }))}
            >{option}{checked && option === question.correct && <Check size={14}/>}{checked && picked === option && option !== question.correct && <X size={14}/>}</button>)}
          </div>
        </li>;
      })}
    </ol>
    <div className="mini-test-actions">
      {!checked
        ? <button className="primary-button" disabled={questions.some(question => !answers[question.id])} onClick={() => setChecked(true)}>{tr('Yanıtı kontrol et')}</button>
        : <><span aria-live="polite" className="mini-test-score">{tr('Doğru {correct} / {n}', { correct: score, n: questions.length })}</span><button onClick={() => { setAnswers({}); setChecked(false); }}><RotateCcw size={15}/> {tr('Yeniden çöz')}</button></>}
    </div>
  </section>;
}
