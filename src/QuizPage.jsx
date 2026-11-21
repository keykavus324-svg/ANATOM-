import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, Brain, CheckCircle2, ClipboardCheck, Eye, Flame, Heart, Layers, ListChecks, Maximize2, RotateCcw, Search, ShieldCheck, Sparkles, Timer, Trash2, TrendingUp, X } from 'lucide-react';
import { quizQuestions, quizCategories } from './content/quizBank';
import { quizSetsIn, quizQuestionsIn, findQuizSetIn } from './content/quizI18n.js';
import { localizedNote } from './content/localizedContent.js';
import { notes } from './data';
import { buildAttempt, gradeAttempt, gradeBySet, isAnswerCorrect, answerText, correctText, questionType, formatClock } from './quiz';
import { makeAttemptRecord, overallMastery, coverage, streakDays, weakTopics, weakSets, unstartedSets, setMastery, recentTrend, totals as historyTotals } from './quizProgress';
import { QuizFigure, QuestionInput, ScoreRing, MeterBars, blankAnswerFor, figureSrc } from './components/QuizQuestion.jsx';
import './quiz.css';
import { useI18n, useLocalizedContent } from './i18n.jsx';

const icons = { temel: BookOpen, hareket: Layers, eklem: Maximize2, ekstremite: ListChecks, iskelet: Layers, kas: Layers, dolasim: Heart, sindirim: Sparkles, sinir: Brain, urogenital: Eye, solunum: Layers, duyu: Eye };
const TOTAL = Object.values(quizQuestions).reduce((sum, list) => sum + list.length, 0);
const QUIZ_IDS = quizSetsIn('tr').map(set => set.id); // set ids are language-independent
const validSetIds = (value, ids) => Array.isArray(value) ? value.filter(id => ids.includes(id)) : [];

function useQuizStorage(key) {
  const [value, setValue] = useState(() => { try { return validSetIds(JSON.parse(localStorage.getItem(key)), QUIZ_IDS); } catch { return []; } });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Quiz works without device storage. */ } }, [key, value]);
  return [value, id => setValue(previous => previous.includes(id) ? previous.filter(x => x !== id) : [...previous, id])];
}

// Every question shape the bank uses, named once so the catalogue, the runner and
// the exam simulator describe them with the same words.
const typeLabel = (tr, type) => ({
  choice: tr('Çoktan seçmeli'),
  truefalse: tr('Doğru / Yanlış'),
  multi: tr('Çoklu seçim'),
  order: tr('Sıralama'),
}[questionType({ type })] || tr('Çoktan seçmeli'));

function typeBreakdown(questions) {
  const counts = new Map();
  for (const question of questions) {
    const type = questionType(question);
    counts.set(type, (counts.get(type) || 0) + 1);
  }
  return ['choice', 'truefalse', 'multi', 'order'].filter(type => counts.has(type)).map(type => ({ type, count: counts.get(type) }));
}

function TypeChips({ questions }) {
  const { tr } = useI18n();
  return <span className="quiz-type-chips">{typeBreakdown(questions).map(({ type, count }) => <span key={type}>{count} × {typeLabel(tr, type)}</span>)}</span>;
}

function MasteryPanel({ history, onExam, onReset, onSelectSet }) {
  const { tr, lang } = useI18n();
  const mastery = overallMastery(history, QUIZ_IDS);
  const cover = coverage(history, QUIZ_IDS);
  const streak = streakDays(history);
  const weak = weakTopics(history, { limit: 5 });
  const totals = historyTotals(history);
  const trend = recentTrend(history, 12);
  const next = weakSets(history, QUIZ_IDS, 3);
  const fresh = unstartedSets(history, QUIZ_IDS);
  return <section className="quiz-mastery" aria-labelledby="mastery-heading">
    <header className="quiz-mastery-head">
      <div><div className="eyebrow muted">{tr('KİŞİSEL ÇALIŞMA KAYDI')}</div><h2 id="mastery-heading">{tr('Ustalık haritan')}</h2></div>
      <p>{tr('Denemelerin bu cihazda saklanır; puan değil, tekrar için yol göstericidir.')}</p>
    </header>
    {history.length === 0 ? <div className="quiz-mastery-empty">
      <TrendingUp size={26}/><div><strong>{tr('Henüz deneme kaydı yok.')}</strong><p>{tr('Bir quizi adım adım çöz ya da karışık sınava gir; doğruluk oranların, zayıf konuların ve çalışma serin burada biriksin.')}</p></div>
      <button className="primary-button" onClick={() => onExam('')}>{tr('Karışık sınava gir')} <ArrowRight size={16}/></button>
    </div> : <div className="quiz-mastery-body">
      <div className="quiz-mastery-score">
        <ScoreRing value={mastery} size={112} caption={tr('ustalık')} label={tr('Genel ustalık yüzdesi')}/>
        <dl>
          <div><dt>{tr('Çözülen set')}</dt><dd>{cover.started} / {cover.total}</dd></div>
          <div><dt>{tr('Yanıtlanan soru')}</dt><dd>{totals.questions}</dd></div>
          <div><dt>{tr('Doğru oranı')}</dt><dd>{totals.questions ? `%${Math.round(totals.correct / totals.questions * 100)}` : '—'}</dd></div>
          <div><dt>{tr('Çalışma serisi')}</dt><dd className={streak ? 'is-streak' : ''}>{streak ? tr('{n} gün', { n: streak }) : tr('Bugün başlamadın')}</dd></div>
        </dl>
        <div className="quiz-trend" aria-hidden="true">{trend.map((point, i) => <span key={`${point.at}-${i}`} className={`trend-bar ${point.accuracy >= 0.7 ? 'good' : point.accuracy >= 0.4 ? 'mid' : 'low'}`} style={{ height: `${Math.max(8, point.accuracy * 100)}%` }} title={`${point.correct}/${point.total}`}/>)}</div>
        <p className="quiz-trend-caption"><TrendingUp size={13}/> {tr('Son {n} denemenin doğruluk seyri', { n: trend.length })}</p>
      </div>
      <div className="quiz-mastery-side">
        <div className="quiz-mastery-block">
          <h3>{tr('Çalışman gereken konular')}</h3>
          {weak.length ? <ul className="quiz-weak-list">{weak.map(topic => <li key={topic.topic}>
            <span>{topic.topic}</span>
            <em>{topic.correct} / {topic.total}</em>
            <div className="meter-track"><span className={topic.accuracy < 0.5 ? 'low' : 'mid'} style={{ width: `${Math.round(topic.accuracy * 100)}%` }}/></div>
          </li>)}</ul> : <p className="quiz-mastery-note">{tr('Belirgin bir zayıf konu görünmüyor. Karışık sınavla tüm setleri tarayabilirsin.')}</p>}
          <div className="quiz-mastery-actions">
            <button className="primary-button" onClick={() => onExam('weak')} disabled={!weak.length}><ClipboardCheck size={15}/> {tr('Zayıf konulara çalış')}</button>
            <button className="text-button" onClick={() => onExam('')}><Timer size={14}/> {tr('Karışık sınav')}</button>
          </div>
        </div>
        <div className="quiz-mastery-block">
          <h3>{next.length ? tr('En düşük ustalık') : tr('Başlanmamış setler')}</h3>
          {next.length ? <MeterBars items={next.map(entry => { const set = findQuizSetIn(lang, entry.setId); return { label: set?.title || entry.setId, value: entry.mastery, note: tr('{n} deneme', { n: entry.attempts }) }; })}/>
            : <p className="quiz-mastery-note">{tr('Tüm setleri en az bir kez çözmüşsün.')}</p>}
          {fresh.length > 0 && <button className="text-button" onClick={() => onSelectSet(findQuizSetIn(lang, fresh[0]))}>{tr('Sıradaki set:')} {findQuizSetIn(lang, fresh[0]).title} <ArrowRight size={14}/></button>}
        </div>
        <button className="quiz-reset-history" onClick={onReset}><Trash2 size={14}/> {tr('Deneme geçmişini temizle')}</button>
      </div>
    </div>}
  </section>;
}

function ExamBand({ onExam, history }) {
  const { tr } = useI18n();
  return <section className="quiz-exam-band">
    <div className="quiz-exam-copy">
      <span className="eyebrow"><span/> {tr('YENİ · SINAV SİMÜLASYONU')}</span>
      <h2>{tr('Süre tut, karıştır, sonda gör.')}</h2>
      <p>{tr('Karışık sınav tüm setlerden dengeli soru çeker; yanıtlar sınav bitene kadar açıklanmaz. Sonda puan halkası, set set doğruluk, harcanan süre ve soru soru döküm alırsın.')}</p>
      <ul className="quiz-exam-points">
        <li><Timer size={14}/> {tr('Soru başına 45 saniye')}</li>
        <li><Layers size={14}/> {tr('10, 20 veya 30 soruluk kâğıt')}</li>
        <li><ListChecks size={14}/> {tr('Soru paleti ile atla ve dön')}</li>
      </ul>
      <div className="quiz-exam-actions">
        <button className="primary-button" onClick={() => onExam('')}><Timer size={16}/> {tr('Karışık sınava gir')}</button>
        <button className="text-button" onClick={() => onExam('weak')} disabled={!history.length}>{tr('Zayıf konu kâğıdı')} <ArrowRight size={14}/></button>
      </div>
    </div>
    <div className="quiz-exam-art" aria-hidden="true"><div className="exam-orbit"/><Timer size={86} strokeWidth={.85}/><span>EXAMEN · TEMPUS · RATIO</span><small>{tr('Süre, karışım ve geri bildirim bir arada.')}</small></div>
  </section>;
}

function QuizViewer({ set, onBack, saved, onSave, studied, onStudied, onLesson, onExam, history, record }) {
  const { tr, lang } = useI18n();
  const bank = useMemo(() => quizQuestionsIn(lang, set.id), [lang, set.id]);
  const [phase, setPhase] = useState('intro');
  const [session, setSession] = useState(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(undefined);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState({});
  const [large, setLarge] = useState(false);
  const startedAt = useRef(0);
  const savedAttempt = useRef(false);
  const heading = useRef(null);
  const focusHeading = () => requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  const note = notes.find(n => n.number === set.lesson);
  const noteTitle = note ? localizedNote(note, lang).title : '';
  const questions = session?.questions || [];
  const current = questions[index];
  const progress = setMastery(history, set.id);
  const start = () => {
    const paper = buildAttempt(bank);
    setSession({ questions: paper });
    setAnswers({});
    setIndex(0);
    setAnswer(blankAnswerFor(paper[0]));
    setChecked(false);
    setLarge(false);
    startedAt.current = Date.now();
    savedAttempt.current = false;
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
      const following = questions[index + 1];
      setIndex(index + 1);
      setAnswer(blankAnswerFor(following));
      setChecked(false);
      setLarge(false);
      focusHeading();
    } else {
      setPhase('results');
      focusHeading();
    }
  };
  const result = phase === 'results' ? gradeAttempt(questions, answers) : null;
  useEffect(() => {
    if (phase !== 'results' || !result || savedAttempt.current) return;
    savedAttempt.current = true;
    record(makeAttemptRecord({
      mode: 'set',
      setId: set.id,
      result,
      setScores: gradeBySet(questions.map(q => ({ ...q, setId: set.id })), answers),
      seconds: Math.round((Date.now() - startedAt.current) / 1000),
    }));
  }, [phase, result, record, set.id, questions, answers]);
  return <section className="quiz-detail">
    <button className="text-button" onClick={onBack}><ArrowLeft size={16}/> {tr('Quiz kütüphanesine dön')}</button>
    <div className="quiz-detail-heading"><div><div className="eyebrow">{set.title.toLocaleUpperCase(lang === 'tr' ? 'tr' : undefined)} · {tr('YEREL SORU BANKASI')}</div><h1 ref={heading} tabIndex={-1}>{set.title}</h1><p><BookOpen size={14}/> {tr('{n} soru', { n: bank.length })} <TypeChips questions={bank}/></p></div><button className={`quiz-save ${saved ? 'selected' : ''}`} aria-label={saved ? tr('Quiz favorisini kaldır') : tr('Quizi favorilere ekle')} aria-pressed={saved} onClick={onSave}><Bookmark size={19} fill={saved ? 'currentColor' : 'none'}/></button></div>
    <div className="quiz-workspace">
      <div className="quiz-viewer-toolbar"><span><ClipboardCheck size={17}/> {phase === 'results' ? tr('Sonuç ve döküm') : tr('Soru alanı')}</span><div>{phase === 'play' && <button className="text-button" onClick={start}><RotateCcw size={14}/> {tr('Baştan başla')}</button>}{progress.mastery !== null && <span className="quiz-toolbar-mastery">{tr('Ustalık')} <strong>{progress.mastery}%</strong></span>}</div></div>
      {phase === 'intro' && <div className="quiz-intro">
        <figure className="quiz-intro-figure" aria-hidden="true"><img src={figureSrc(set.diagram)} width="760" height="507" alt=""/><span className="quiz-intro-count">{tr('{n} soru', { n: bank.length })}</span></figure>
        <div className="quiz-intro-copy">
          <span className="eyebrow">{tr('HAZIRSAN BAŞLAYALIM')}</span>
          <h2 tabIndex={-1}>{set.description}</h2>
          <p>{tr('Sorular bu site için yazıldı; şekiller projeye ait sadeleştirilmiş şemalardır. Her yanıttan sonra doğru yanıt ve kısa açıklama gösterilir, sonunda konu konu özet alırsın.')}</p>
          <div className="quiz-intro-types"><TypeChips questions={bank}/></div>
          {progress.mastery !== null && <p className="quiz-intro-progress">{tr('Bu setteki ustalığın {mastery}% · son denemende {correct}/{total} doğru.', { mastery: progress.mastery, correct: progress.correct, total: progress.questions })}</p>}
          <div className="quiz-intro-actions">
            <button className="primary-button" onClick={start}>{tr('Adım adım çöz')} <ArrowRight size={17}/></button>
            <button className="quiz-secondary" onClick={() => onExam(set.id)}><Timer size={16}/> {tr('Sınav modunda çöz')}</button>
          </div>
          {note && <button className="text-button" onClick={() => onLesson(note)}><BookOpen size={15}/> {tr('Önce konuyu tekrar et:')} {localizedNote(note, lang).title} <ArrowRight size={14}/></button>}
        </div>
      </div>}
      {phase === 'play' && current && <div className="quiz-runner">
        <div className="quiz-session-bar"><span>{set.title.toLocaleUpperCase(lang === 'tr' ? 'tr' : undefined)} · {index + 1} / {questions.length}</span><em>{typeLabel(tr, current.type)}</em></div>
        <progress aria-label={tr('Soru ilerlemesi')} value={index + (checked ? 1 : 0)} max={questions.length}/>
        <p className="quiz-topic">{current.topic}</p>
        <h2 ref={heading} tabIndex={-1} dir="auto">{current.text}</h2>
        {current.figure && <QuizFigure id={current.figure} large={large} onToggle={() => setLarge(!large)}/>}
        <QuestionInput question={current} answer={answer} onChange={value => { setAnswer(value); }} revealed={checked}/>
        {!checked && <button className="quiz-primary" disabled={answer === undefined || (Array.isArray(answer) && answer.length === 0)} onClick={check}>{questionType(current) === 'order' ? tr('Sırayı kontrol et') : questionType(current) === 'multi' ? tr('Seçimleri kontrol et') : tr('Yanıtı kontrol et')}</button>}
        {checked && <div className="quiz-feedback" role="status">
          <strong>{isAnswerCorrect(current, answer) ? tr('Doğru.') : tr('Henüz değil.')} {tr('Doğru yanıt: {answer}', { answer: correctText(current) })}</strong>
          {questionType(current) === 'multi' && !isAnswerCorrect(current, answer) && answer?.length > 0 && <p className="quiz-feedback-extra">{tr('Senin seçimlerin:')} {answerText(current, answer, ' · ')}</p>}
          {questionType(current) === 'order' && !isAnswerCorrect(current, answer) && Array.isArray(answer) && <p className="quiz-feedback-extra">{tr('Senin sıran:')} {answerText(current, answer, ' → ')}</p>}
          <p>{current.why}</p>
          <button className="quiz-primary" onClick={next}>{index < questions.length - 1 ? tr('Sonraki soru') : tr('Sonuçları gör')} <ArrowRight size={15}/></button>
        </div>}
      </div>}
      {phase === 'results' && result && <div className="quiz-results">
        <div className="quiz-score" role="status">
          <ScoreRing value={Math.round(result.correct / result.total * 100)} size={104} caption={tr('doğru')} label={tr('Bu denemenin doğruluk yüzdesi')}/>
          <div className="quiz-score-copy">
            <span className="eyebrow">{tr('SONUÇ')}</span>
            <p className="quiz-score-line">{tr('{correct} / {total} doğru', { correct: result.correct, total: result.total })}</p>
            <p className="quiz-score-note">{result.correct === result.total ? tr('Hepsini doğru bilmişsin. Şemaları tekrar inceleyerek pekiştir.') : tr('Yanlış ve boş bıraktıklarının açıklamalarını aşağıda bulabilirsin.')} {tr('Denemen çalışma kaydına eklendi.')}</p>
            <div className="quiz-score-actions">
              <button className="primary-button" onClick={start}><RotateCcw size={15}/> {tr('Yeniden çöz')}</button>
              <button className="quiz-secondary" onClick={() => onExam(set.id)}><Timer size={15}/> {tr('Sınav modunda dene')}</button>
              <button className="text-button" onClick={onBack}>{tr('Başka quiz seç')} <ArrowRight size={14}/></button>
            </div>
          </div>
        </div>
        <h3 className="quiz-review-title">{tr('Konu konu doğruluk')}</h3>
        <MeterBars items={result.topics.map(topic => ({ label: topic.topic, value: Math.round(topic.correct / topic.total * 100), note: tr('{correct} / {total} doğru', { correct: topic.correct, total: topic.total }) }))}/>
        <h3 className="quiz-review-title">{tr('Yanıt dökümü')}</h3>
        <ol className="quiz-review">
          {questions.map((q, i) => <li key={q.id} className={isAnswerCorrect(q, answers[q.id]) ? 'good' : ''}>
            <div className="quiz-review-head"><span className="quiz-review-no">{i + 1}</span><strong>{q.text}</strong><em>{typeLabel(tr, q.type)}</em></div>
            <p className="quiz-review-answer">{answers[q.id] === undefined || (Array.isArray(answers[q.id]) && answers[q.id].length === 0) ? <em>{tr('Boş bırakıldı.')}</em> : <>{tr('Yanıtın:')} <em>{answerText(q, answers[q.id], questionType(q) === 'order' ? ' → ' : ' · ')}</em></>}{!isAnswerCorrect(q, answers[q.id]) && <> · {tr('Doğrusu:')} <strong>{correctText(q)}</strong></>}</p>
            <p className="quiz-review-why">{q.why}</p>
          </li>)}
        </ol>
      </div>}
    </div>
    <div className="quiz-study-footer"><div><h2>{tr('Çalışmanı tamamladın mı?')}</h2><p>{tr('“Çalıştım” kişisel bir işarettir; sınav başarısı veya puan değildir.')}</p></div><button className={`quiz-studied ${studied ? 'selected' : ''}`} onClick={onStudied} aria-pressed={studied}><CheckCircle2 size={17}/>{studied ? tr('Çalıştım · işareti kaldır') : tr('Çalıştım olarak işaretle')}</button></div>
    {note && <button className="quiz-lesson-link" onClick={() => onLesson(note)}><BookOpen size={20}/><span><small>{tr('KONUYU TEKRAR ET')}</small><strong>{noteTitle}</strong></span><ArrowRight size={18}/></button>}
    <p className="quiz-source-notice"><ShieldCheck size={16}/><span>{tr('Sorular ve şekiller bu proje için hazırlandı; hocanın sınav sorusu veya resmî bir soru bankası değildir. Şemalar sadeleştirilmiş, ölçeksiz öğretim çizimleridir; atlas veya ders kitabı yerine geçmez. Buradaki başarı gerçek sınav notunu garanti etmez.')}</span></p>
  </section>;
}

export default function QuizPage({ selected, onSelect, onBack, onLesson, onPractice, onExam, progress }) {
  const { tr, lang } = useI18n();
  const { categoryLabel } = useLocalizedContent();
  const quizSets = quizSetsIn(lang);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('all');
  const [category, setCategory] = useState('all');
  const [saved, toggleSaved] = useQuizStorage('anatomi-quiz-saved');
  const [studied, toggleStudied] = useQuizStorage('anatomi-quiz-studied');
  // The attempt history is owned by the app shell so the exam report and this hub agree.
  const { history, record, reset, storageError } = progress;
  const [lastId, setLastId] = useState(() => { try { return localStorage.getItem('anatomi-quiz-last') || ''; } catch { return ''; } });
  useEffect(() => { if (selected) { setLastId(selected.id); try { localStorage.setItem('anatomi-quiz-last', selected.id); } catch { /* Optional. */ } } }, [selected]);
  const word = query.trim().toLocaleLowerCase('tr-TR');
  const results = quizSets.filter(set => (tab === 'all' || saved.includes(set.id))
    && (category === 'all' || set.category === category)
    && (!word || `${set.title} ${set.description} ${set.keywords || ''}`.toLocaleLowerCase('tr-TR').includes(word)));
  const last = findQuizSetIn(lang, lastId);
  if (selected) return <QuizViewer key={selected.id} set={findQuizSetIn(lang, selected.id) || selected} onBack={onBack} saved={saved.includes(selected.id)} onSave={() => toggleSaved(selected.id)} studied={studied.includes(selected.id)} onStudied={() => toggleStudied(selected.id)} onLesson={onLesson} onExam={onExam} history={history} record={record}/>;
  return <section className="quiz-page" aria-labelledby="quiz-heading">
    <header className="quiz-hero"><div><div className="eyebrow"><span/> {tr('SORULAR BU SİTE İÇİN YAZILDI')}</div><h1 id="quiz-heading">{tr('Bir yapı. Bir soru.')}<br/><em>{tr('Bir adım daha ileri.')}</em></h1><p>{tr('Yerel anatomi quizleriyle bilgini sına. Sorular ders kütüphanesindeki konulara ve projeye ait şemalara dayanır.')}</p><div className="quiz-hero-tags"><span><ClipboardCheck size={14}/>{tr('{n} yerel soru', { n: TOTAL })}</span><span><Layers size={14}/>{tr('{n} konu seti', { n: quizSets.length })}</span><span><BookOpen size={14}/>{tr('Derslerin tamamı kapsanıyor')}</span><span><ListChecks size={14}/>{tr('{n} soru tipi', { n: 4 })}</span><span><Brain size={14}/>{tr('Şemalı sorular')}</span></div></div><div className="quiz-hero-art" aria-hidden="true"><div className="quiz-orbit"/><Brain size={100} strokeWidth={.8}/><span>REPETITIO EST MATER STUDIORUM</span><small>{tr('Tekrar, öğrenmenin temelidir.')}</small></div></header>
    <ExamBand onExam={onExam} history={history}/>
    <MasteryPanel history={history} onExam={onExam} onReset={reset} onSelectSet={onSelect}/>
    {storageError && <p className="quiz-storage-note"><ShieldCheck size={14}/> {tr('Tarayıcı deposu kapalı olduğu için deneme geçmişi bu oturumdan sonra saklanamaz.')}</p>}
    {last && <button className="quiz-resume" onClick={() => onSelect(last)}><RotateCcw size={19}/><span><small>{tr('SON AÇTIĞIN QUIZ')}</small><strong>{last.title}</strong><em>{tr('Yeniden çöz · soru sırası her denemede karışır')}</em></span><ArrowRight size={20}/></button>}
    <div className="quiz-section-title"><div><div className="eyebrow muted">{tr('ÇALIŞMA ALANINI SEÇ')}</div><h2>{tr('Anatomi Quizleri')}</h2></div><span>{tr('{count} quiz “çalıştım” işaretli', { count: studied.length })}</span></div>
    <div className="quiz-list-controls"><div className="quiz-tabs" aria-label={tr('Quiz listesi')}><button aria-pressed={tab === 'all'} onClick={() => setTab('all')}>{tr('Tüm quizler')}</button><button aria-pressed={tab === 'saved'} onClick={() => setTab('saved')}><Bookmark size={14}/> {tr('Favorilerim')} <span>{saved.length}</span></button></div><button className="text-button" onClick={() => { setQuery(''); setTab('all'); setCategory('all'); }}>{tr('Filtreleri temizle')}</button></div>
    <div className="quiz-category-row" aria-label={tr('Konu grubu filtresi')}>{[{ key: 'all', label: tr('Tümü') }, ...quizCategories.map(key => ({ key, label: categoryLabel(key) }))].map(item => <button key={item.key} aria-pressed={category === item.key} onClick={() => setCategory(item.key)}>{item.label}</button>)}</div>
    <div className="quiz-search-row"><div className="search-field"><Search size={18}/><input type="search" aria-label={tr('Quizlerde ara')} placeholder={tr('Örn. kalp, omurga, sarkomer…')} value={query} onChange={e => setQuery(e.target.value)}/>{query && <button aria-label={tr('Quiz aramasını temizle')} onClick={() => setQuery('')}><X size={16}/></button>}</div></div>
    <div className="quiz-results-line"><span role="status">{tr('{count} quiz listeleniyor', { count: results.length })}</span></div>
    <div className="quiz-cards">{results.map(set => { const Icon = icons[set.id] || ClipboardCheck; const bank = quizQuestionsIn(lang, set.id); const progress = setMastery(history, set.id); return <article className="quiz-card" key={set.id}><div className="quiz-card-top"><span>{tr('{n} soru', { n: bank.length })}</span><button className={`quiz-save ${saved.includes(set.id) ? 'selected' : ''}`} aria-label={`${set.title}: ${saved.includes(set.id) ? tr('favorilerden kaldır') : tr('favorilere ekle')}`} aria-pressed={saved.includes(set.id)} onClick={() => toggleSaved(set.id)}><Bookmark size={17} fill={saved.includes(set.id) ? 'currentColor' : 'none'}/></button></div><figure className="quiz-card-figure" aria-hidden="true"><img src={figureSrc(set.diagram)} width="760" height="460" loading="lazy" alt=""/></figure><h3><button onClick={() => onSelect(set)}>{set.title}</button></h3><p className="quiz-card-desc">{set.description}</p><div className="quiz-card-progress">{progress.mastery === null ? <span className="quiz-not-started">{tr('Henüz çözülmedi')}</span> : <><ScoreRing value={progress.mastery} size={44} label={`${set.title}: ${tr('ustalık')} ${progress.mastery}%`}/><span className="quiz-card-progress-copy"><strong>{tr('{n} deneme', { n: progress.attempts })}</strong><em>{tr('En iyi %{best}', { best: Math.round(progress.best * 100) })}</em></span></>}</div><div className="quiz-card-meta"><TypeChips questions={bank}/>{studied.includes(set.id) && <span className="quiz-done"><CheckCircle2 size={13}/> {tr('Çalıştım')}</span>}{saved.includes(set.id) && <span className="quiz-done"><Bookmark size={13} fill="currentColor"/> {tr('Favori')}</span>}</div><div className="quiz-card-actions"><button className="quiz-card-start" onClick={() => onSelect(set)}>{tr('Adım adım çöz')} <ArrowRight size={16}/></button><button className="quiz-card-exam" aria-label={`${set.title}: ${tr('Sınav modunda çöz')}`} onClick={() => onExam(set.id)}><Timer size={15}/></button></div></article>; })}</div>
    {!results.length && <div className="empty-state"><Search size={32}/><h3>{tab === 'saved' ? tr('Bu filtrelerde favori quiz yok.') : tr('Bu aramada quiz bulamadık.')}</h3><p>{tr('Başka bir terim dene veya filtreleri temizle. Yer imiyle quizleri favorilerine ekleyebilirsin.')}</p><button className="primary-button" onClick={() => { setQuery(''); setTab('all'); setCategory('all'); }}>{tr('Tüm quizleri göster')}</button></div>}
    <div className="quiz-native-band"><div><h2>{tr('Okudun, izledin. Peki hatırlıyor musun?')}</h2><p>{tr('Zamanlı denemeler, görsel şema alıştırmaları ve sana özel tekrar defteri “Kendini sına” bölümünde.')}</p></div><button className="primary-button" onClick={onPractice}>{tr('Kendini sına')} <ArrowRight size={16}/></button></div>
    <p className="quiz-source-notice"><ShieldCheck size={16}/><span>{tr('Ustalık haritası ve deneme geçmişi yalnız bu cihazda saklanır; hesap, bulut eşitlemesi veya not gönderimi yoktur. Kayıtlar kişisel çalışma izlenimidir, resmî bir değerlendirme değildir.')}</span></p>
  </section>;
}
