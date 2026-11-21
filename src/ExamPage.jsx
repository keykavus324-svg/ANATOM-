import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Brain, CheckCircle2, ClipboardCheck, Clock3, ListChecks, RotateCcw, ShieldCheck, Timer, X } from 'lucide-react';
import { quizSetsIn, quizQuestionsIn, findQuizSetIn } from './content/quizI18n.js';
import { localizedNote } from './content/localizedContent.js';
import { notes } from './data';
import { buildAttempt, gradeAttempt, gradeBySet, isAnswerCorrect, isAnswered, answerText, correctText, questionType, pickBalanced, examSeconds, formatClock, EXAM_LENGTHS } from './quiz';
import { makeAttemptRecord, weakTopics, weakSets, setMastery } from './quizProgress';
import { QuizFigure, QuestionInput, ScoreRing, MeterBars, blankAnswerFor } from './components/QuizQuestion.jsx';
import './quiz.css';
import { useI18n } from './i18n.jsx';

// Exam simulator: a timed, mixed paper drawn from the same local bank as the
// quizzes. Answers are not revealed while the paper runs; the report at the end
// carries the score ring, the per-set and per-topic breakdown, the time used and
// the full review. It is practice, not a graded or proctored exam.
const QUIZ_IDS = quizSetsIn('tr').map(set => set.id);

const typeLabel = (tr, type) => ({
  choice: tr('Çoktan seçmeli'),
  truefalse: tr('Doğru / Yanlış'),
  multi: tr('Çoklu seçim'),
  order: tr('Sıralama'),
}[questionType({ type })] || tr('Çoktan seçmeli'));

function groupsBySet(pool) {
  const map = new Map();
  for (const question of pool) {
    if (!map.has(question.setId)) map.set(question.setId, []);
    map.get(question.setId).push(question);
  }
  return [...map.values()];
}

// The pool follows the scope in the address: one set, the visitor's weak topics or
// every set. A weak-topic paper tops up from the weakest sets, then from the rest,
// so a short history still produces a full paper.
function buildPool(lang, scope, history) {
  const sets = quizSetsIn(lang);
  const ofSet = id => quizQuestionsIn(lang, id).map(question => ({ ...question, setId: id }));
  if (scope.scope === 'set' && QUIZ_IDS.includes(scope.setId)) return ofSet(scope.setId);
  if (scope.scope === 'weak') {
    const topics = weakTopics(history, { limit: 8, minTotal: 1 }).map(entry => entry.topic);
    const matched = sets.flatMap(set => ofSet(set.id)).filter(question => topics.includes(question.topic));
    const weakIds = weakSets(history, QUIZ_IDS, 4).map(entry => entry.setId);
    const fill = weakIds.flatMap(ofSet);
    const rest = sets.flatMap(set => ofSet(set.id));
    return [...new Map([...matched, ...fill, ...rest].map(question => [question.id, question])).values()];
  }
  return sets.flatMap(set => ofSet(set.id));
}

export default function ExamPage({ scope, onScope, onQuizzes, onOpenSet, onLesson, progress }) {
  const { tr, lang } = useI18n();
  const { history, record } = progress;
  const quizSets = quizSetsIn(lang);
  const pool = useMemo(() => buildPool(lang, scope, history), [lang, scope, history]);
  const [length, setLength] = useState(20);
  const [timed, setTimed] = useState(true);
  const [phase, setPhase] = useState('setup');
  const [paper, setPaper] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [large, setLarge] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(0);
  const savedAttempt = useRef(false);
  const heading = useRef(null);
  const focusHeading = () => requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));

  // A new scope in the address (from the hub, the report or the browser) starts a
  // fresh setup screen instead of leaving the previous paper's report on screen.
  useEffect(() => {
    setPhase('setup');
    setPaper(null);
    setConfirmFinish(false);
    setLarge(false);
  }, [scope.key]);

  const seconds = examSeconds(length);
  const questions = paper?.questions || [];
  const current = questions[index];
  const answeredCount = questions.filter(question => isAnswered(question, answers[question.id])).length;
  const result = phase === 'results' ? gradeAttempt(questions, answers) : null;
  const scopeSet = scope.scope === 'set' ? findQuizSetIn(lang, scope.setId) : null;
  const scopeLabel = scope.scope === 'set' && scopeSet ? scopeSet.title : scope.scope === 'weak' ? tr('Zayıf konularım') : tr('Tüm konu setleri');

  const start = () => {
    const selected = buildAttempt(pickBalanced(groupsBySet(pool), Math.min(length, pool.length)));
    setPaper({ questions: selected });
    setAnswers(Object.fromEntries(selected.map(question => [question.id, blankAnswerFor(question)])));
    setIndex(0);
    setLarge(false);
    setConfirmFinish(false);
    setRemaining(seconds);
    setElapsed(0);
    startedAt.current = Date.now();
    savedAttempt.current = false;
    setPhase('run');
    focusHeading();
  };

  // One interval drives both the countdown and the stop-watch reading.
  useEffect(() => {
    if (phase !== 'run') return undefined;
    const timer = setInterval(() => {
      const passed = Math.round((Date.now() - startedAt.current) / 1000);
      setElapsed(passed);
      if (timed) setRemaining(Math.max(0, seconds - passed));
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, timed, seconds]);

  const finish = () => {
    if (phase !== 'run') return;
    setConfirmFinish(false);
    setPhase('results');
    focusHeading();
  };

  useEffect(() => {
    // Time out: the paper is handed in on its own, blanks included.
    if (phase !== 'run' || !timed || remaining !== 0 || !questions.length) return;
    setConfirmFinish(false);
    setPhase('results');
    focusHeading();
  }, [remaining, phase, timed, questions.length]);

  useEffect(() => {
    if (phase !== 'results' || savedAttempt.current || !questions.length) return;
    savedAttempt.current = true;
    record(makeAttemptRecord({
      mode: scope.scope === 'weak' ? 'drill' : 'exam',
      setId: scope.scope === 'set' ? scope.setId : null,
      result: gradeAttempt(questions, answers),
      setScores: gradeBySet(questions, answers),
      seconds: Math.round((Date.now() - startedAt.current) / 1000),
    }));
  }, [phase, questions, answers, record, scope.scope, scope.setId]);

  // Alt+arrow moves between questions; Escape closes the finish confirmation.
  useEffect(() => {
    if (phase !== 'run') return undefined;
    const onKey = event => {
      if (event.key === 'Escape' && confirmFinish) { setConfirmFinish(false); return; }
      if (!event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowRight' && index < questions.length - 1) { event.preventDefault(); setIndex(index + 1); setLarge(false); focusHeading(); }
      if (event.key === 'ArrowLeft' && index > 0) { event.preventDefault(); setIndex(index - 1); setLarge(false); focusHeading(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, index, questions.length, confirmFinish]);

  if (phase === 'setup') {
    const bySet = quizSets.map(set => ({ set, count: pool.filter(question => question.setId === set.id).length })).filter(entry => entry.count > 0);
    return <section className="exam-page" aria-labelledby="exam-heading">
      <button className="text-button" onClick={onQuizzes}><ArrowLeft size={16}/> {tr('Quiz kütüphanesine dön')}</button>
      <header className="exam-setup-head">
        <div><span className="eyebrow"><span/> {tr('SINAV SİMÜLASYONU')}</span><h1 id="exam-heading" ref={heading} tabIndex={-1}>{tr('Karışık kâğıt,')}<br/><em>{tr('gerçek tempo.')}</em></h1><p>{tr('Kâğıt tüm setlerden dengeli soru çeker, sıra ve seçenekler her denemede karışır. Sınav sırasında doğru yanıt gösterilmez; rapor sonda gelir.')}</p></div>
        <div className="exam-setup-art" aria-hidden="true"><div className="exam-orbit"/><Timer size={82} strokeWidth={.85}/><span>TEMPUS · MIXTURA · RATIO</span></div>
      </header>
      <div className="exam-setup-grid">
        <div className="exam-setup-panel">
          <div className="exam-field">
            <h2>{tr('Kapsam')}</h2>
            <p>{tr('Kâğıdın hangi sorulardan oluşacağını seç. Seçim adres çubuğuna yazılır ve paylaşılabilir.')}</p>
            <div className="exam-choices">
              <button aria-pressed={scope.scope === 'all'} onClick={() => onScope('')}><ListChecks size={15}/> {tr('Tüm konu setleri')} <span>{quizSets.length}</span></button>
              <button aria-pressed={scope.scope === 'weak'} onClick={() => onScope('weak')} disabled={!weakTopics(history, { minTotal: 1 }).length}><ClipboardCheck size={15}/> {tr('Zayıf konularım')} <span>{weakTopics(history, { limit: 8, minTotal: 1 }).length}</span></button>
            </div>
            <label className="exam-select"><span>{tr('Tek bir set')}</span>
              <select value={scope.scope === 'set' ? scope.setId : ''} onChange={event => onScope(event.target.value)}>
                <option value="">{tr('Set seç…')}</option>
                {quizSets.map(set => <option key={set.id} value={set.id}>{set.title}</option>)}
              </select>
            </label>
          </div>
          <div className="exam-field">
            <h2>{tr('Kâğıt uzunluğu')}</h2>
            <div className="exam-choices lengths">{EXAM_LENGTHS.map(count => <button key={count} aria-pressed={length === count} onClick={() => setLength(count)}>{tr('{n} soru', { n: count })}<em>{timed ? formatClock(examSeconds(count)) : tr('süre serbest')}</em></button>)}</div>
          </div>
          <div className="exam-field">
            <h2>{tr('Süre')}</h2>
            <div className="exam-choices"><button aria-pressed={timed} onClick={() => setTimed(!timed)}>{timed ? <><Clock3 size={15}/> {tr('Süre sayacı açık · {time}', { time: formatClock(seconds) })}</> : <><X size={15}/> {tr('Süre sayacı kapalı · geçen süre gösterilir')}</>}</button></div>
          </div>
          <button className="primary-button exam-start" onClick={start} disabled={pool.length === 0}><Timer size={17}/> {tr('Sınava başla')} <ArrowRight size={17}/></button>
          <p className="exam-setup-note"><ShieldCheck size={14}/> {tr('Bu bir alıştırma kâğıdıdır: resmî sınav değildir, gözetim veya not içermez. Sorular ve şekiller bu proje için hazırlanmıştır; başarı gerçek sınav notunu garanti etmez.')}</p>
        </div>
        <aside className="exam-setup-side">
          <h2>{tr('Havuz')}</h2>
          <p className="exam-pool-total"><strong>{pool.length}</strong> {tr('soru hazır')}</p>
          <ul className="exam-pool-list">{bySet.map(({ set, count }) => <li key={set.id}><button onClick={() => onOpenSet(set)}>{set.title}</button><span>{count}</span></li>)}</ul>
          <div className="exam-side-block">
            <h3>{tr('Nasıl işler?')}</h3>
            <ol>
              <li>{tr('Soru paletiyle atla, sonra dön.')}</li>
              <li>{tr('Boş bırakılan sorular raporda görünür.')}</li>
              <li>{tr('Süre biterse kâğıt kendiliğinden teslim edilir.')}</li>
              <li>{tr('Sonuç set set ustalığına işlenir.')}</li>
            </ol>
          </div>
        </aside>
      </div>
    </section>;
  }

  if (phase === 'run' && current) {
    const blanks = questions.length - answeredCount;
    return <section className="exam-page exam-running" aria-labelledby="exam-run-heading">
      <div className="exam-run-bar">
        <div className="exam-run-title"><Timer size={17}/><span>{tr('Sınav sürüyor')} · {scopeLabel}</span></div>
        <div className={`exam-clock ${timed && remaining <= 60 ? 'is-low' : ''}`} role="timer" aria-live="off"><Clock3 size={15}/>{formatClock(timed ? remaining : elapsed)}<em>{timed ? tr('kalan') : tr('geçen')}</em></div>
        <div className="exam-run-actions">
          {blanks > 0 && <span className="exam-blank-note">{tr('{n} boş', { n: blanks })}</span>}
          <button className="primary-button exam-finish" onClick={() => (blanks > 0 ? setConfirmFinish(true) : finish())}><CheckCircle2 size={15}/> {tr('Sınavı bitir')}</button>
        </div>
      </div>
      <progress aria-label={tr('Soru ilerlemesi')} value={index + 1} max={questions.length}/>
      {confirmFinish && <div className="exam-confirm" role="alertdialog" aria-label={tr('Sınavı bitirme onayı')}>
        <p><strong>{tr('{n} soruyu boş bırakıyorsun.', { n: blanks })}</strong> {tr('Boş sorular yanlış sayılır. Kâğıdı yine de teslim etmek istiyor musun?')}</p>
        <div><button className="primary-button" onClick={finish}>{tr('Evet, teslim et')}</button><button className="text-button" onClick={() => setConfirmFinish(false)}>{tr('Devam et')} <ArrowRight size={14}/></button></div>
      </div>}
      <div className="exam-run-grid">
        <div className="exam-question">
          <div className="exam-question-head"><p className="quiz-topic">{current.topic}</p><em>{typeLabel(tr, current.type)}</em></div>
          <h2 id="exam-run-heading" ref={heading} tabIndex={-1} dir="auto">{current.text}</h2>
          {current.figure && <QuizFigure id={current.figure} large={large} onToggle={() => setLarge(!large)}/>}
          <QuestionInput question={current} answer={answers[current.id]} onChange={value => setAnswers(before => ({ ...before, [current.id]: value }))}/>
          <div className="exam-nav">
            <button className="text-button" disabled={index === 0} onClick={() => { setIndex(index - 1); setLarge(false); focusHeading(); }}><ArrowLeft size={15}/> {tr('Önceki soru')}</button>
            <span className="exam-nav-count">{index + 1} / {questions.length}</span>
            {index < questions.length - 1
              ? <button className="quiz-primary" onClick={() => { setIndex(index + 1); setLarge(false); focusHeading(); }}>{tr('Sonraki soru')} <ArrowRight size={15}/></button>
              : <button className="quiz-primary" onClick={() => (blanks > 0 ? setConfirmFinish(true) : finish())}>{tr('Sınavı bitir')} <ArrowRight size={15}/></button>}
          </div>
          <p className="exam-keyboard-hint">{tr('Alt + ok tuşlarıyla sorular arasında geçebilirsin.')}</p>
        </div>
        <nav className="exam-palette" aria-label={tr('Soru paleti')}>
          <h2>{tr('Soru paleti')}</h2>
          <div className="exam-palette-grid">{questions.map((question, i) => <button key={question.id} className={`${i === index ? 'is-current' : ''} ${isAnswered(question, answers[question.id]) ? 'is-answered' : ''}`} aria-current={i === index ? 'true' : undefined} aria-label={tr('{n}. soru', { n: i + 1 })} onClick={() => { setIndex(i); setLarge(false); }}>{i + 1}</button>)}</div>
          <p className="exam-palette-legend"><span className="is-answered"/><span>{tr('yanıtlandı')}</span><span className="is-open"/><span>{tr('boş')}</span></p>
        </nav>
      </div>
    </section>;
  }

  const setScores = result ? gradeBySet(questions, answers) : [];
  // Topics that cost points on this paper, weakest first; each is linked back to the
  // set and the lesson that explain it.
  const weakNow = result
    ? result.topics
      .filter(topic => topic.correct < topic.total)
      .sort((a, b) => a.correct / a.total - b.correct / b.total || b.total - a.total)
      .slice(0, 4)
    : [];
  const setForTopic = topic => quizSets.find(item => quizQuestionsIn(lang, item.id).some(question => question.topic === topic));
  return <section className="exam-page exam-results" aria-labelledby="exam-result-heading">
    <div className="exam-result-head">
      <ScoreRing value={result ? Math.round(result.correct / result.total * 100) : 0} size={132} caption={tr('doğru')} label={tr('Kâğıdın doğruluk yüzdesi')} tone={result && result.correct / result.total >= 0.7 ? 'sage' : 'rose'}/>
      <div>
        <span className="eyebrow">{tr('KÂĞIT RAPORU')}</span>
        <h1 id="exam-result-heading" ref={heading} tabIndex={-1}>{tr('{correct} / {total} doğru', { correct: result?.correct || 0, total: result?.total || 0 })}</h1>
        <p className="exam-result-line">{scopeLabel} · {tr('{n} soruluk kâğıt', { n: questions.length })} · {timed ? tr('kalan süre {time}', { time: formatClock(remaining) }) : tr('harcanan süre {time}', { time: formatClock(elapsed) })}{result?.blank ? ` · ${tr('{n} boş', { n: result.blank })}` : ''}</p>
        <p className="exam-result-note">{result && result.correct === result.total ? tr('Tam isabet. Aynı kâğıdı bir kez daha karıştırıp süreyle pekiştirebilirsin.') : tr('Aşağıdaki dökümde her sorunun doğru yanıtı ve açıklaması var. Yanlışların konularına dönüp şemaları tekrar incele.')}</p>
        <div className="exam-result-actions">
          <button className="primary-button" onClick={start}><RotateCcw size={15}/> {tr('Yeni kâğıt')}</button>
          <button className="quiz-secondary" onClick={() => onScope('weak')} disabled={!weakTopics(history, { minTotal: 1 }).length}><ClipboardCheck size={15}/> {tr('Zayıf konu kâğıdı')}</button>
          <button className="text-button" onClick={onQuizzes}>{tr('Quiz kütüphanesi')} <ArrowRight size={14}/></button>
        </div>
      </div>
    </div>
    <div className="exam-result-grid">
      <div className="exam-result-block">
        <h2>{tr('Set set doğruluk')}</h2>
        <MeterBars items={setScores.map(entry => { const set = findQuizSetIn(lang, entry.setId); return { label: set?.title || entry.setId, value: Math.round(entry.correct / entry.total * 100), note: tr('{correct} / {total} doğru', { correct: entry.correct, total: entry.total }) }; })}/>
      </div>
      <div className="exam-result-block">
        <h2>{tr('Konu konu doğruluk')}</h2>
        <MeterBars items={result.topics.map(topic => ({ label: topic.topic, value: Math.round(topic.correct / topic.total * 100), note: tr('{correct} / {total} doğru', { correct: topic.correct, total: topic.total }) }))}/>
      </div>
      <div className="exam-result-block exam-result-next">
        <h2>{tr('Bundan sonra')}</h2>
        {weakNow.length ? <ul className="exam-next-list">{weakNow.map(topic => { const set = setForTopic(topic.topic); const note = set ? notes.find(item => item.number === set.lesson) : null; return <li key={topic.topic}>
          <div><strong>{topic.topic}</strong><em>{tr('{correct} / {total} doğru', { correct: topic.correct, total: topic.total })}</em></div>
          <span className="exam-next-links">
            {set && <button onClick={() => onOpenSet(set)}><Brain size={14}/> {set.title}</button>}
            {note && <button onClick={() => onLesson(note)}><BookOpen size={14}/> {localizedNote(note, lang).title}</button>}
          </span>
        </li>; })}</ul> : <p className="exam-next-none">{tr('Bu kâğıtta belirgin bir zayıf konu çıkmadı. Ustalık haritanda en düşük sette çalışmaya devam edebilirsin.')}</p>}
        <p className="exam-progress-note">{setScores.length === 1 && setMastery(history, setScores[0].setId).mastery !== null ? tr('Bu setin ustalığı artık %{mastery}.', { mastery: setMastery(history, setScores[0].setId).mastery }) : tr('Kâğıt, deneme geçmişine eklendi ve ustalık haritanı güncelledi.')}</p>
      </div>
    </div>
    <h2 className="quiz-review-title">{tr('Yanıt dökümü')}</h2>
    <ol className="quiz-review exam-review">{questions.map((question, i) => <li key={question.id} className={isAnswerCorrect(question, answers[question.id]) ? 'good' : ''}>
      <div className="quiz-review-head"><span className="quiz-review-no">{i + 1}</span><strong>{question.text}</strong><em>{typeLabel(tr, question.type)}</em></div>
      <p className="quiz-review-answer">{!isAnswered(question, answers[question.id]) ? <em>{tr('Boş bırakıldı.')}</em> : <>{tr('Yanıtın:')} <em>{answerText(question, answers[question.id], questionType(question) === 'order' ? ' → ' : ' · ')}</em></>}{!isAnswerCorrect(question, answers[question.id]) && <> · {tr('Doğrusu:')} <strong>{correctText(question)}</strong></>}</p>
      <p className="quiz-review-why">{question.why}</p>
    </li>)}</ol>
    <p className="quiz-source-notice"><ShieldCheck size={16}/><span>{tr('Bu kâğıt kişisel bir alıştırmadır; resmî sınav, gözetim veya not yerine geçmez. Sorular ve şekiller bu proje için hazırlanmıştır, hocanın sınav sorusu veya resmî bir soru bankası değildir.')}</span></p>
  </section>;
}
