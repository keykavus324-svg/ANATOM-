import React from 'react';
import { ArrowDown, ArrowUp, Check, X } from 'lucide-react';
import { quizDiagrams } from '../content/quizDiagrams';
import { quizFigureIn } from '../content/quizI18n.js';
import { questionType } from '../quiz.js';
import { useI18n } from '../i18n.jsx';

// Shared question furniture for the native quizzes and the exam simulator: the
// figure viewer, the four answer shapes, the score ring and the topic bars. Both
// pages import these so a solved paper and a practice run look and behave the same.
export const figureSrc = id =>
  quizDiagrams[id] ? `${import.meta.env.BASE_URL}diagrams/quiz/${id}.svg` : `${import.meta.env.BASE_URL}diagrams/${id}.svg`;

export function QuizFigure({ id, large, onToggle }) {
  const { tr, lang } = useI18n();
  const data = quizFigureIn(lang, id);
  return (
    <figure className="quiz-figure">
      <div className={large ? 'quiz-figure-scroll expanded' : 'quiz-figure-scroll'} tabIndex={large ? 0 : undefined} role={large ? 'region' : undefined} aria-label={large ? tr('Geniş şemayı kaydırarak incele') : undefined}>
        <img src={figureSrc(id)} width="760" height="507" alt={tr('{title}. Numaralı işaretlerin açıklamaları şekil altında ve yanıt açıklamalarında yer alır.', { title: data.title })}/>
      </div>
      <figcaption>
        {data.view} · {data.caption}
        <div className="quiz-figure-actions">
          <button aria-pressed={large} onClick={onToggle}>{large ? tr('Ekrana sığdır') : tr('Şemayı büyüt')}</button>
        </div>
        <dl className="quiz-figure-key">
          {data.labels.map((label, i) => <div key={label.name}><dt>{i + 1}. {label.name}</dt><dd>{label.text}</dd></div>)}
        </dl>
      </figcaption>
    </figure>
  );
}

// A blank answer is undefined; an ordering question stays undefined until the
// visitor actually moves a row, so the exam palette can still count it as blank.
export function blankAnswerFor(question) {
  const type = questionType(question);
  if (type === 'multi') return [];
  return undefined;
}

export function QuestionInput({ question, answer, onChange, revealed = false }) {
  const { tr } = useI18n();
  const type = questionType(question);
  const name = `answer-${question.id}`;

  if (type === 'order') {
    const sequence = Array.isArray(answer) ? answer : question.options.map((_, i) => i);
    const move = (position, delta) => {
      const target = position + delta;
      if (target < 0 || target >= sequence.length) return;
      const next = [...sequence];
      [next[position], next[target]] = [next[target], next[position]];
      onChange(next);
    };
    return (
      <div className="quiz-order">
        <p className="quiz-order-hint">{tr('Satırları oklarla doğru sıraya taşı. Sıra yukarıdan aşağıya okunur.')}</p>
        <ol className="quiz-order-list" dir="auto">
          {sequence.map((optionIndex, position) => {
            const state = revealed ? (question.correct[position] === optionIndex ? 'good' : 'bad') : '';
            return (
              <li key={question.options[optionIndex]} className={state}>
                <span className="quiz-order-rank">{position + 1}</span>
                <span className="quiz-order-text">{question.options[optionIndex]}</span>
                <span className="quiz-order-controls">
                  <button type="button" aria-label={tr('{item}: bir sıra yukarı taşı', { item: question.options[optionIndex] })} disabled={revealed || position === 0} onClick={() => move(position, -1)}><ArrowUp size={15}/></button>
                  <button type="button" aria-label={tr('{item}: bir sıra aşağı taşı', { item: question.options[optionIndex] })} disabled={revealed || position === sequence.length - 1} onClick={() => move(position, 1)}><ArrowDown size={15}/></button>
                </span>
                {revealed && state === 'good' && <Check size={15} className="quiz-order-mark"/>}
                {revealed && state === 'bad' && <X size={15} className="quiz-order-mark"/>}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  if (type === 'multi') {
    const selected = Array.isArray(answer) ? answer : [];
    const toggle = index => onChange(selected.includes(index) ? selected.filter(i => i !== index) : [...selected, index].sort((a, b) => a - b));
    return (
      <fieldset className="quiz-options multi" dir="auto">
        <legend className="sr-only">{tr('Doğru olanların tümünü seç')}</legend>
        {question.options.map((option, i) => {
          const isRight = question.correct.includes(i);
          const state = revealed ? (isRight ? 'correct' : selected.includes(i) ? 'incorrect' : 'missed') : '';
          return (
            <label key={option} className={state}>
              <input type="checkbox" name={name} value={i} checked={selected.includes(i)} disabled={revealed} onChange={() => toggle(i)}/>
              <span><b>{String.fromCharCode(65 + i)}</b>{option}</span>
              {revealed && isRight && <small>{tr('Doğru seçenek')}</small>}
              {revealed && !isRight && selected.includes(i) && <small>{tr('Yanlış seçim')}</small>}
            </label>
          );
        })}
      </fieldset>
    );
  }

  const binary = type === 'truefalse';
  return (
    <fieldset className={`quiz-options ${binary ? 'binary' : ''}`} dir="auto">
      <legend className="sr-only">{tr('Yanıtını seç')}</legend>
      {question.options.map((option, i) => (
        <label key={option} className={revealed ? (i === question.correct ? 'correct' : answer === i ? 'incorrect' : '') : ''}>
          <input type="radio" name={name} value={i} checked={answer === i} disabled={revealed} onChange={() => onChange(i)}/>
          <span>
            <b>{binary ? (i === 0 ? <Check size={14}/> : <X size={14}/>) : String.fromCharCode(65 + i)}</b>
            {option}
          </span>
          {revealed && i === question.correct && <small>{tr('Doğru yanıt')}</small>}
        </label>
      ))}
    </fieldset>
  );
}

export function ScoreRing({ value, size = 96, caption, label, tone = 'rose' }) {
  const stroke = 7;
  const radius = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = value === null || value === undefined ? 0 : Math.max(0, Math.min(100, value));
  return (
    <div className={`score-ring tone-${tone}`} style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true" focusable="false">
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke}/>
        <circle className="ring-value" cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`}/>
      </svg>
      <div className="ring-copy">
        <strong>{value === null || value === undefined ? '—' : `${Math.round(pct)}%`}</strong>
        {caption && <small>{caption}</small>}
      </div>
    </div>
  );
}

export function MeterBars({ items }) {
  return (
    <ul className="meter-bars">
      {items.map(item => (
        <li key={item.label}>
          <div className="meter-head"><span>{item.label}</span><em>{item.value === null ? '—' : `${Math.round(item.value)}%`}</em></div>
          <div className="meter-track"><span style={{ width: `${Math.max(0, Math.min(100, item.value || 0))}%` }}/></div>
          {item.note && <small>{item.note}</small>}
        </li>
      ))}
    </ul>
  );
}
