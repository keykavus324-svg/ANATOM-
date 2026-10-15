import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, Brain, CheckCircle2, ClipboardCheck, Eye, Heart, Layers, Maximize2, RotateCcw, Search, ShieldCheck, X } from 'lucide-react';
import { quizSets, quizQuestions, findQuizSet } from './content/quizBank';
import { quizDiagrams } from './content/quizDiagrams';
import { diagrams } from './content/diagrams';
import { notes } from './data';
import { buildAttempt, gradeAttempt } from './quiz';
import './quiz.css';

const icons = { temel: BookOpen, iskelet: Layers, kas: Layers, dolasim: Heart, sinir: Brain, solunum: Layers, duyu: Eye };
const TOTAL = Object.values(quizQuestions).reduce((sum, list) => sum + list.length, 0);
const figureSrc = id => quizDiagrams[id] ? `${import.meta.env.BASE_URL}diagrams/quiz/${id}.svg` : `${import.meta.env.BASE_URL}diagrams/${id}.svg`;
const figureData = id => quizDiagrams[id] || diagrams[id];
const validSetIds = (value, pool) => Array.isArray(value) ? value.filter(id => pool.some(s => s.id === id)) : [];

function useQuizStorage(key) {
  const [value, setValue] = useState(() => { try { return validSetIds(JSON.parse(localStorage.getItem(key)), quizSets); } catch { return []; } });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Quiz works without device storage. */ } }, [key, value]);
  return [value, id => setValue(previous => previous.includes(id) ? previous.filter(x => x !== id) : [...previous, id])];
}

function Figure({ id, large, onToggle }) {
  const data = figureData(id);
  return <figure className="quiz-figure">
    <div className={large ? 'quiz-figure-scroll expanded' : 'quiz-figure-scroll'} tabIndex={large ? 0 : undefined} role={large ? 'region' : undefined} aria-label={large ? 'Geniş şemayı kaydırarak incele' : undefined}>
      <img src={figureSrc(id)} width="760" height="460" alt={`${data.title}. Numaralı işaretlerin açıklamaları şekil altında ve yanıt açıklamalarında yer alır.`}/>
    </div>
    <figcaption>
      {data.view} · {data.caption}
      <div className="quiz-figure-actions">
        <button aria-pressed={large} onClick={onToggle}>{large ? 'Ekrana sığdır' : 'Şemayı büyüt'}</button>
      </div>
      <dl className="quiz-figure-key">
        {data.labels.map((label, i) => <div key={label.name}><dt>{i + 1}. {label.name}</dt><dd>{label.text}</dd></div>)}
      </dl>
    </figcaption>
  </figure>;
}

function QuizViewer({ set, onBack, saved, onSave, studied, onStudied, onLesson }) {
  const [phase, setPhase] = useState('intro');
  const [session, setSession] = useState(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(undefined);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState({});
  const [large, setLarge] = useState(false);
  const heading = useRef(null);
  const focusHeading = () => requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  const note = notes.find(n => n.number === set.lesson);
  const questions = session?.questions || [];
  const current = questions[index];
  const start = () => {
    setSession({ questions: buildAttempt(quizQuestions[set.id]) });
    setAnswers({});
    setIndex(0);
    setAnswer(undefined);
    setChecked(false);
    setLarge(false);
    setPhase('play');
    focusHeading();
  };
  const check = () => {
    if (answer === undefined || checked) return;
    setChecked(true);
    setAnswers(before => ({ ...before, [current.id]: answer }));
  };
  const next = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setAnswer(undefined);
      setChecked(false);
      setLarge(false);
      focusHeading();
    } else {
      setPhase('results');
      focusHeading();
    }
  };
  const result = phase === 'results' ? gradeAttempt(questions, answers) : null;
  return <section className="quiz-detail">
    <button className="text-button" onClick={onBack}><ArrowLeft size={16}/> Quiz kütüphanesine dön</button>
    <div className="quiz-detail-heading"><div><div className="eyebrow">{set.title.toLocaleUpperCase('tr-TR')} · YEREL SORU BANKASI</div><h1 ref={heading} tabIndex={-1}>{set.title}</h1><p><BookOpen size={14}/> Türkçe · {quizQuestions[set.id].length} soru</p></div><button className={`quiz-save ${saved ? 'selected' : ''}`} aria-label={saved ? 'Quiz favorisini kaldır' : 'Quizi favorilere ekle'} aria-pressed={saved} onClick={onSave}><Bookmark size={19} fill={saved ? 'currentColor' : 'none'}/></button></div>
    <div className="quiz-workspace">
      <div className="quiz-viewer-toolbar"><span><ClipboardCheck size={17}/> Soru alanı</span><div>{phase === 'play' && <button className="text-button" onClick={start}><RotateCcw size={14}/> Baştan başla</button>}</div></div>
      {phase === 'intro' && <div className="quiz-intro">
        <figure className="quiz-intro-figure" aria-hidden="true"><img src={figureSrc(set.diagram)} width="760" height="460" alt=""/><span className="quiz-intro-count">{quizQuestions[set.id].length} soru</span></figure>
        <div className="quiz-intro-copy">
          <span className="eyebrow">HAZIRSAN BAŞLAYALIM</span>
          <h2 tabIndex={-1}>{set.description}</h2>
          <p>Sorular bu site için yazıldı; şekiller projeye ait sadeleştirilmiş şemalardır. Her yanıttan sonra doğru yanıt ve kısa açıklama gösterilir, sonunda konu konu özet alırsın.</p>
          <button className="primary-button" onClick={start}>Çözüme başla <ArrowRight size={17}/></button>
          {note && <button className="text-button" onClick={() => onLesson(note)}><BookOpen size={15}/> Önce konuyu tekrar et: {note.title} <ArrowRight size={14}/></button>}
        </div>
      </div>}
      {phase === 'play' && current && <div className="quiz-runner">
        <div className="quiz-session-bar"><span>{set.title.toLocaleUpperCase('tr-TR')} · {index + 1} / {questions.length}</span></div>
        <progress aria-label="Soru ilerlemesi" value={index + (checked ? 1 : 0)} max={questions.length}/>
        <p className="quiz-topic">{current.topic}</p>
        <h2 ref={heading} tabIndex={-1}>{current.text}</h2>
        {current.figure && <Figure id={current.figure} large={large} onToggle={() => setLarge(!large)}/>}
        <fieldset className="quiz-options">
          <legend className="sr-only">Yanıtını seç</legend>
          {current.options.map((option, i) => <label key={option} className={checked ? (i === current.correct ? 'correct' : answers[current.id] === i ? 'incorrect' : '') : ''}>
            <input type="radio" name={`quiz-${current.id}`} value={i} checked={answer === i} disabled={checked} onChange={() => setAnswer(i)}/>
            <span><b>{String.fromCharCode(65 + i)}</b>{option}</span>
            {checked && i === current.correct && <small>Doğru yanıt</small>}
          </label>)}
        </fieldset>
        {!checked && <button className="quiz-primary" disabled={answer === undefined} onClick={check}>Yanıtı kontrol et</button>}
        {checked && <div className="quiz-feedback" role="status">
          <strong>{answer === current.correct ? 'Doğru.' : 'Henüz değil.'} Doğru yanıt: {current.options[current.correct]}</strong>
          <p>{current.why}</p>
          <button className="quiz-primary" onClick={next}>{index < questions.length - 1 ? 'Sonraki soru' : 'Sonuçları gör'} <ArrowRight size={15}/></button>
        </div>}
      </div>}
      {phase === 'results' && result && <div className="quiz-results">
        <div className="quiz-score" role="status">
          <span className="eyebrow">SONUÇ</span>
          <p className="quiz-score-line"><strong>{result.correct}</strong> / {result.total} doğru</p>
          <p className="quiz-score-note">{result.correct === result.total ? 'Hepsini doğru bilmişsin. Şemaları tekrar inceleyerek pekiştir.' : 'Yanlış ve boş bıraktıklarının açıklamalarını aşağıda bulabilirsin.'}</p>
          <div className="quiz-score-actions">
            <button className="primary-button" onClick={start}><RotateCcw size={15}/> Yeniden çöz</button>
            <button className="text-button" onClick={onBack}>Başka quiz seç <ArrowRight size={14}/></button>
          </div>
        </div>
        <h3 className="quiz-review-title">Yanıt dökümü</h3>
        <ol className="quiz-review">
          {questions.map((q, i) => <li key={q.id} className={answers[q.id] === q.correct ? 'good' : ''}>
            <div className="quiz-review-head"><span className="quiz-review-no">{i + 1}</span><strong>{q.text}</strong></div>
            <p className="quiz-review-answer">{answers[q.id] === undefined ? <em>Boş bırakıldı.</em> : <>Yanıtın: <em>{q.options[answers[q.id]]}</em></>}{answers[q.id] !== q.correct && <> · Doğrusu: <strong>{q.options[q.correct]}</strong></>}</p>
            <p className="quiz-review-why">{q.why}</p>
          </li>)}
        </ol>
      </div>}
    </div>
    <div className="quiz-study-footer"><div><h2>Çalışmanı tamamladın mı?</h2><p>“Çalıştım” kişisel bir işarettir; sınav başarısı veya puan değildir.</p></div><button className={`quiz-studied ${studied ? 'selected' : ''}`} onClick={onStudied} aria-pressed={studied}><CheckCircle2 size={17}/>{studied ? 'Çalıştım · işareti kaldır' : 'Çalıştım olarak işaretle'}</button></div>
    {note && <button className="quiz-lesson-link" onClick={() => onLesson(note)}><BookOpen size={20}/><span><small>KONUYU TEKRAR ET</small><strong>{note.title}</strong></span><ArrowRight size={18}/></button>}
    <p className="quiz-source-notice"><ShieldCheck size={16}/><span>Sorular ve şekiller bu proje için hazırlandı; hocanın sınav sorusu veya resmî bir soru bankası değildir. Şemalar sadeleştirilmiş, ölçeksiz öğretim çizimleridir; atlas veya ders kitabı yerine geçmez. Buradaki başarı gerçek sınav notunu garanti etmez.</span></p>
  </section>;
}

export default function QuizPage({ selected, onSelect, onBack, onLesson, onPractice }) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('all');
  const [saved, toggleSaved] = useQuizStorage('anatomi-quiz-saved');
  const [studied, toggleStudied] = useQuizStorage('anatomi-quiz-studied');
  const [lastId, setLastId] = useState(() => { try { return localStorage.getItem('anatomi-quiz-last') || ''; } catch { return ''; } });
  useEffect(() => { if (selected) { setLastId(selected.id); try { localStorage.setItem('anatomi-quiz-last', selected.id); } catch { /* Optional. */ } } }, [selected]);
  const word = query.trim().toLocaleLowerCase('tr-TR');
  const results = quizSets.filter(set => (tab === 'all' || saved.includes(set.id)) && (!word || `${set.title} ${set.description} ${set.keywords || ''}`.toLocaleLowerCase('tr-TR').includes(word)));
  const last = findQuizSet(lastId);
  if (selected) return <QuizViewer key={selected.id} set={selected} onBack={onBack} saved={saved.includes(selected.id)} onSave={() => toggleSaved(selected.id)} studied={studied.includes(selected.id)} onStudied={() => toggleStudied(selected.id)} onLesson={onLesson}/>;
  return <section className="quiz-page" aria-labelledby="quiz-heading">
    <header className="quiz-hero"><div><div className="eyebrow"><span/> SORULAR BU SİTE İÇİN YAZILDI</div><h1 id="quiz-heading">Bir yapı. Bir soru.<br/><em>Bir adım daha ileri.</em></h1><p>Yerel anatomi quizleriyle bilgini sına. Sorular ders kütüphanesindeki konulara ve projeye ait şemalara göre hazırlandı; her yanıtta açıklama görürsün.</p><div className="quiz-hero-tags"><span><ClipboardCheck size={14}/>{TOTAL} yerel soru</span><span><Layers size={14}/>{quizSets.length} konu alanı</span><span><Brain size={14}/>Şemalı sorular</span></div></div><div className="quiz-hero-art" aria-hidden="true"><div className="quiz-orbit"/><Brain size={100} strokeWidth={.8}/><span>REPETITIO EST MATER STUDIORUM</span><small>Tekrar, öğrenmenin temelidir.</small></div></header>
    {last && <button className="quiz-resume" onClick={() => onSelect(last)}><RotateCcw size={19}/><span><small>SON AÇTIĞIN QUIZ</small><strong>{last.title}</strong><em>Yeniden çöz · soru sırası her denemede karışır</em></span><ArrowRight size={20}/></button>}
    <div className="quiz-section-title"><div><div className="eyebrow muted">ÇALIŞMA ALANINI SEÇ</div><h2>Anatomi Quizleri</h2></div><span>{studied.length} quiz “çalıştım” işaretli</span></div>
    <div className="quiz-list-controls"><div className="quiz-tabs" aria-label="Quiz listesi"><button aria-pressed={tab === 'all'} onClick={() => setTab('all')}>Tüm quizler</button><button aria-pressed={tab === 'saved'} onClick={() => setTab('saved')}><Bookmark size={14}/> Favorilerim <span>{saved.length}</span></button></div><button className="text-button" onClick={() => { setQuery(''); setTab('all'); }}>Filtreleri temizle</button></div>
    <div className="quiz-search-row"><div className="search-field"><Search size={18}/><input type="search" aria-label="Quizlerde ara" placeholder="Örn. kalp, omurga, sarkomer…" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button aria-label="Quiz aramasını temizle" onClick={() => setQuery('')}><X size={16}/></button>}</div></div>
    <div className="quiz-results-line"><span role="status">{results.length} quiz listeleniyor</span></div>
    <div className="quiz-cards">{results.map(set => { const Icon = icons[set.id] || ClipboardCheck; const count = quizQuestions[set.id].length; return <article className="quiz-card" key={set.id}><div className="quiz-card-top"><span>{count} soru</span><button className={`quiz-save ${saved.includes(set.id) ? 'selected' : ''}`} aria-label={`${set.title}: ${saved.includes(set.id) ? 'favorilerden kaldır' : 'favorilere ekle'}`} aria-pressed={saved.includes(set.id)} onClick={() => toggleSaved(set.id)}><Bookmark size={17} fill={saved.includes(set.id) ? 'currentColor' : 'none'}/></button></div><figure className="quiz-card-figure" aria-hidden="true"><img src={figureSrc(set.diagram)} width="760" height="460" loading="lazy" alt=""/></figure><h3><button onClick={() => onSelect(set)}>{set.title}</button></h3><p className="quiz-card-desc">{set.description}</p><div className="quiz-card-meta"><span>TR</span>{studied.includes(set.id) && <span className="quiz-done"><CheckCircle2 size={13}/> Çalıştım</span>}{saved.includes(set.id) && <span className="quiz-done"><Bookmark size={13} fill="currentColor"/> Favori</span>}</div><button className="quiz-card-start" onClick={() => onSelect(set)}>Quizi çöz <ArrowRight size={16}/></button></article>; })}</div>
    {!results.length && <div className="empty-state"><Search size={32}/><h3>{tab === 'saved' ? 'Bu filtrelerde favori quiz yok.' : 'Bu aramada quiz bulamadık.'}</h3><p>Başka bir terim dene veya filtreleri temizle. Yer imiyle quizleri favorilerine ekleyebilirsin.</p><button className="primary-button" onClick={() => { setQuery(''); setTab('all'); }}>Tüm quizleri göster</button></div>}
    <div className="quiz-native-band"><div><h2>Okudun, izledin. Peki hatırlıyor musun?</h2><p>Zamanlı denemeler, görsel şema alıştırmaları ve sana özel tekrar defteri “Kendini sına” bölümünde.</p></div><button className="primary-button" onClick={onPractice}>Kendini sına <ArrowRight size={16}/></button></div>
  </section>;
}
