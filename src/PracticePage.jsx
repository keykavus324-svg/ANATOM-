import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  RotateCcw,
  ScanLine,
  ClipboardCheck,
  Trash2,
} from "lucide-react";
import { notes } from "./data";
import { diagrams } from "./content/diagrams";
import {
  knowledgeQuestions,
  visualQuestions,
  questionById,
  makeSession,
  cleanNotebook,
  recordAnswer,
  dueQuestions,
  gradeSession,
  PRACTICE_KEY,
} from "./practice";
import "./practice.css";
import { useI18n } from "./i18n.jsx";
const titleFor = (n) =>
  notes.find((note) => note.number === n)?.title || `Ders ${n}`;
const timeText = (s) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function PracticePage({ onLesson, onExternalQuizzes }) {
  const { tr } = useI18n();
  const [notebook, setNotebook] = useState(() => {
    try {
      return cleanNotebook(JSON.parse(localStorage.getItem(PRACTICE_KEY)));
    } catch {
      return {};
    }
  });
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(PRACTICE_KEY, JSON.stringify(notebook));
    } catch {
      setStorageError(true);
    }
  }, [notebook]);
  const [view, setView] = useState("setup");
  const [mode, setMode] = useState("visual");
  const [lesson, setLesson] = useState("all");
  const [count, setCount] = useState("10");
  const [minutes, setMinutes] = useState("20");
  const [session, setSession] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [remaining, setRemaining] = useState(null);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [hint, setHint] = useState(false);
  const [large, setLarge] = useState(false);
  const finished = useRef(false);
  const heading = useRef(null);
  const focusHeading = () =>
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  const allPending = Object.keys(notebook).map((id) => questionById[id]);
  const due = dueQuestions(notebook);
  const pool = (
    mode === "visual" ? visualQuestions : knowledgeQuestions
  ).filter((q) => lesson === "all" || q.lesson === Number(lesson));
  const current = session?.questions[index];
  useEffect(() => {
    if (view !== "play" || !session?.deadline) return;
    const tick = () =>
      setRemaining(
        Math.max(0, Math.ceil((session.deadline - Date.now()) / 1000)),
      );
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [view, session]);
  useEffect(() => {
    if (view === "play" && remaining === 0) finish();
  }, [remaining, view]);

  function start(items = pool, review = false) {
    if (!items.length) return;
    const size =
      count === "all" ? items.length : Math.min(Number(count), items.length);
    const questions = makeSession(items, review ? items.length : size);
    const seconds =
      !review && mode === "exam" && Number(minutes) > 0
        ? Number(minutes) * 60
        : null;
    setSession({
      questions,
      mode: review ? "review" : mode,
      deadline: seconds ? Date.now() + seconds * 1000 : null,
    });
    setAnswers({});
    setChecked({});
    setIndex(0);
    setHint(false);
    setLarge(false);
    setRemaining(seconds);
    setConfirmFinish(false);
    finished.current = false;
    setView("play");
    focusHeading();
  }
  function finish() {
    if (finished.current || !session) return;
    finished.current = true;
    // Visual practice has already recorded checked responses; exam responses are
    // recorded only once on completion. Unanswered items are queued for review.
    setNotebook((before) =>
      session.questions.reduce(
        (state, q) =>
          checked[q.id]
            ? state
            : recordAnswer(state, q.id, answers[q.id] === q.correct),
        before,
      ),
    );
    setConfirmFinish(false);
    setView("results");
    focusHeading();
  }
  function check() {
    if (answers[current.id] === undefined || checked[current.id]) return;
    setChecked((before) => ({ ...before, [current.id]: true }));
    setNotebook((before) =>
      recordAnswer(before, current.id, answers[current.id] === current.correct),
    );
  }
  function changeQuestion(next) {
    setIndex(next);
    setHint(false);
    setLarge(false);
    setConfirmFinish(false);
    focusHeading();
  }
  const result = session ? gradeSession(session.questions, answers) : null;
  const immediate = session?.mode !== "exam";
  const sourceNote = (
    <p className="practice-source-note">
      Proje için hazırlanmış alıştırmalar · Resmî çıkmış soru veya hocanın
      onayladığı sınav değildir. Şemalar sadeleştirilmiş ve ölçeksizdir; atlas
      yerine geçmez. Buradaki başarı gerçek sınav notunu garanti etmez.
    </p>
  );
  const openTopic = (q) =>
    onLesson(
      notes.find((n) => n.number === q.lesson),
      q.section,
    );
  return (
    <section className="practice-page">
      <header className="practice-hero">
        <div className="eyebrow">{tr("BİLGİYİ KULLAN • EKSİĞİNİ GÖR")}</div>
        <h1 ref={view === "setup" ? heading : undefined} tabIndex={-1}>
          {tr("Kendini")} <em>{tr("sına.")}</em>
        </h1>
        <p>{tr("Bir yapıyı tanı. Bilgini dene. Karıştırdığın konuyu zamanında yeniden hatırla.")}</p>
        {onExternalQuizzes && <button className="text-button" style={{ marginTop: 18 }} onClick={onExternalQuizzes}>{tr("Anatomi quizleri çalışma alanı")} <ArrowRight size={16}/></button>}
        <div className="practice-pills">
          <span>
            <ScanLine size={15} aria-hidden="true" />
            {tr("{n} görsel alıştırma", { n: visualQuestions.length })}
          </span>
          <span>
            <ClipboardCheck size={15} aria-hidden="true" />
            {tr("{n} açıklamalı soru", { n: knowledgeQuestions.length })}
          </span>
          <span>
            <RotateCcw size={15} aria-hidden="true" />
            {due.length} tekrar zamanı gelen
          </span>
        </div>
      </header>
      {storageError && (
        <p role="status" className="practice-warning">
          Tarayıcı depolaması kullanılamıyor. Bu oturumda çalışabilirsin; tekrar
          defterin sayfa kapatılınca korunmayabilir.
        </p>
      )}
      {(view === "setup" || view === "notebook") && (
        <nav className="practice-tabs" aria-label={tr("Çalışma alanları")}>
          <button
            aria-pressed={view === "setup"}
            onClick={() => setView("setup")}
          >
            {tr("Yeni çalışma")}
          </button>
          <button
            aria-pressed={view === "notebook"}
            onClick={() => setView("notebook")}
          >
            {tr("Tekrar defterim")} <span>{allPending.length}</span>
          </button>
        </nav>
      )}
      {view === "setup" && (
        <>
          <div
            className="practice-modes"
            role="group"
            aria-label={tr("Çalışma türü")}
          >
            <button
              aria-pressed={mode === "visual"}
              onClick={() => setMode("visual")}
            >
              <ScanLine aria-hidden="true" size={25} />
              <strong>{tr("Görsel yapı tanıma")}</strong>
              <span>{tr("Numarayı bul, yapıyı seç, gerekçeyi karşılaştır.")}</span>
            </button>
            <button
              aria-pressed={mode === "exam"}
              onClick={() => setMode("exam")}
            >
              <ClipboardCheck aria-hidden="true" size={25} />
              <strong>{tr("Deneme sınavı")}</strong>
              <span>{tr("Konunu ve süreni seç. Açıklamaları sınav sonunda gör.")}</span>
            </button>
          </div>
          <form
            className="practice-setup"
            onSubmit={(e) => {
              e.preventDefault();
              start();
            }}
          >
            <h2>{tr("Çalışmanı oluştur.")}</h2>
            <div className="practice-fields">
              <label>
                {tr("Konu")}
                <select
                  aria-label={tr("Konu")}
                  value={lesson}
                  onChange={(e) => setLesson(e.target.value)}
                >
                  <option value="all">{tr("Tüm anatomi dersleri")}</option>
                  {notes
                    .filter((n) => n.number > 0)
                    .sort((a, b) => a.number - b.number)
                    .map((note) => (
                      <option key={note.number} value={note.number}>
                        {String(note.number).padStart(2, "0")} · {note.title}
                      </option>
                    ))}
                </select>
              </label>
              <label>
                {tr("Soru sayısı")}
                <select
                  aria-label={tr("Soru sayısı")}
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                >
                  {["5", "10", "20"].map((n) => (
                    <option key={n} value={n}>
                      {tr("{n} soru", { n })}
                    </option>
                  ))}
                  <option value="all">{tr("Uygun soruların tamamı")}</option>
                </select>
              </label>
              {mode === "exam" && (
                <label>
                  {tr("Süre")}
                  <select
                    aria-label={tr("Süre")}
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                  >
                    <option value="0">{tr("Süresiz")}</option>
                    <option value="10">{tr("10 dakika")}</option>
                    <option value="20">{tr("20 dakika")}</option>
                    <option value="30">{tr("30 dakika")}</option>
                  </select>
                </label>
              )}
            </div>
            <p>
              {tr("{n} uygun soru var.", { n: pool.length })}{" "}
              {pool.length > 0
                ? tr("Bu çalışmada {n} soru sorulacak; seçeneklerin sırası karıştırılır.", { n: count === "all" ? pool.length : Math.min(Number(count), pool.length) })
                : tr("Bu konu için henüz uygun soru yok. Başka konu veya çalışma türü seç.")}
            </p>
            <button
              className="practice-primary"
              disabled={!pool.length}
              type="submit"
            >
              {tr("Çalışmaya başla")} <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>
          <aside className="practice-how">
            <h3>{tr("Nasıl daha iyi öğrenirsin?")}</h3>
            <ol>
              <li>{tr("Görselde önce yönü ve bakış açısını belirle.")}</li>
              <li>
                Cevabı yalnız adıyla değil, görevi veya komşuluğuyla söyle.
              </li>
              <li>
                Yanlışlarını defterden tekrar et; doğru hatırladıkça tekrar
                aralığı uzar.
              </li>
            </ol>
            <p>
              Vize / final için konu seçimini hocanın duyurduğu kapsama göre
              yap. Otomatik bir vize–final kapsamı varsayılmaz.
            </p>
          </aside>
          {sourceNote}
        </>
      )}
      {view === "notebook" && (
        <div className="practice-notebook">
          <h2 ref={heading} tabIndex={-1}>
            {tr("Tekrar defterim")}
          </h2>
          <p>{tr("Yanlış ve boş bıraktığın sorular burada birikir. Doğru yanıtladıkça 1, 3, 7, 14 ve 30 günlük aralıklarla yeniden planlanır. İlk tekrar ertesi gündür. İstersen zamanını beklemeden çalışabilirsin.")}</p>
          {allPending.length ? (
            <>
              <div className="practice-actions">
                <button
                  className="practice-primary"
                  disabled={!due.length}
                  onClick={() => start(due, true)}
                >
                  {tr("Zamanı gelenleri çalış ({n})", { n: due.length })}
                </button>
                <button onClick={() => start(allPending, true)}>
                  {tr("Tüm defteri çalış ({n})", { n: allPending.length })}
                </button>
              </div>
              <ul className="practice-review-list">
                {allPending.map((q) => (
                  <li key={q.id}>
                    <div>
                      <small>
                        {titleFor(q.lesson)} ·{" "}
                        {q.kind === "visual" ? tr("Görsel") : tr("Konu sorusu")}
                      </small>
                      <h3>{q.topic}</h3>
                      <p>
                        {notebook[q.id].misses} kez yanlış / boş ·{" "}
                        {notebook[q.id].streak} ardışık doğru · Sonraki tekrar:{" "}
                        {new Date(notebook[q.id].due).toLocaleDateString(
                          "tr-TR",
                        )}
                      </p>
                    </div>
                    <button onClick={() => start([q], true)}>
                      {tr("Tekrar çalış")} <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="practice-delete"
                onClick={() => setConfirmClear(true)}
              >
                <Trash2 size={15} aria-hidden="true" /> {tr("Defteri temizle")}
              </button>
              {confirmClear && (
                <div
                  className="practice-warning"
                  role="group"
                  aria-label={tr("Defteri temizleme onayı")}
                >
                  <p>{tr("Kaydedilen tüm tekrar kayıtları silinecek. Bu işlem geri alınamaz.")}</p>
                  <button
                    onClick={() => {
                      setNotebook({});
                      setConfirmClear(false);
                    }}
                  >
                    {tr("Evet, defteri temizle")}
                  </button>
                  <button onClick={() => setConfirmClear(false)}>{tr("Vazgeç")}</button>
                </div>
              )}
            </>
          ) : (
            <div className="practice-empty">
              <BookOpen size={32} aria-hidden="true" />
              <h3>{tr("Temiz bir başlangıç.")}</h3>
              <p>{tr("Henüz kaydedilmiş yanlışın yok. Bir çalışma tamamladığında ihtiyaç duyduğun konular burada görünecek.")}</p>
              <button
                className="practice-primary"
                onClick={() => setView("setup")}
              >
                {tr("Yeni çalışma oluştur")}
              </button>
            </div>
          )}
          <p className="practice-source-note">
            Kayıtlar yalnızca bu tarayıcıda saklanır. Hesap veya sunucuya
            gönderim yoktur; cihazlar arasında eşitlenmez. Tarayıcı verilerini
            silmek defterini de siler.
          </p>
        </div>
      )}
      {view === "play" && current && (
        <div className="practice-session">
          <div className="practice-session-bar">
            <span>
              {session.mode === "exam"
                ? tr("DENEME SINAVI")
                : session.mode === "review"
                  ? tr("TEKRAR ÇALIŞMASI")
                  : tr("GÖRSEL ÇALIŞMA")}{" "}
              · {index + 1} / {session.questions.length}
            </span>
            {remaining !== null && (
              <span role="timer" aria-label={tr("Kalan süre")}>
                <Clock3 size={15} aria-hidden="true" />
                {timeText(remaining)}
              </span>
            )}
          </div>
          <progress
            aria-label={tr("Soru ilerlemesi")}
            value={index + 1}
            max={session.questions.length}
          />
          <p className="practice-topic">
            {titleFor(current.lesson)} · {current.topic}
          </p>
          <h2 ref={heading} tabIndex={-1} dir="auto">
            {current.q}
          </h2>
          {current.kind === "visual" && (
            <figure className="practice-figure">
              <div
                className={
                  large
                    ? "practice-image-scroll expanded"
                    : "practice-image-scroll"
                }
                tabIndex={large ? 0 : undefined}
                role={large ? "region" : undefined}
                aria-label={
                  large ? tr("Geniş görseli kaydırarak incele") : undefined
                }
              >
                <img
                  src={`${import.meta.env.BASE_URL}diagrams/${current.diagram}.svg`}
                  width="760"
                  height="460"
                  alt={`${diagrams[current.diagram].view}. Şemada ${current.marker} numaralı işareti bul. Metin ipucu aşağıdaki düğmeyle açılabilir.`}
                />
              </div>
              <figcaption>
                {diagrams[current.diagram].view} · {tr("Sadeleştirilmiş, ölçeksiz şema.")}
                <div className="practice-actions">
                  <button aria-pressed={large} onClick={() => setLarge(!large)}>
                    {large ? tr("Ekrana sığdır") : tr("Görseli büyüt")}
                  </button>
                  <button aria-expanded={hint} onClick={() => setHint(!hint)}>
                    {hint ? tr("Metin ipucunu gizle") : tr("Metin ipucunu göster")}
                  </button>
                </div>
                {hint && <p>{current.hint}</p>}
              </figcaption>
            </figure>
          )}
          <fieldset className="practice-options" dir="auto">
            <legend className="sr-only">{tr("Yanıtını seç")}</legend>
            {current.options.map((option, i) => (
              <label
                key={option}
                className={
                  immediate && checked[current.id]
                    ? i === current.correct
                      ? "correct"
                      : answers[current.id] === i
                        ? "incorrect"
                        : ""
                    : ""
                }
              >
                <input
                  type="radio"
                  name={`practice-${current.id}`}
                  value={i}
                  checked={answers[current.id] === i}
                  disabled={immediate && !!checked[current.id]}
                  onChange={() =>
                    setAnswers((before) => ({ ...before, [current.id]: i }))
                  }
                />
                <span>
                  <b>{String.fromCharCode(65 + i)}</b>
                  {option}
                </span>
                {immediate && checked[current.id] && i === current.correct && (
                  <small>{tr("Doğru yanıt")}</small>
                )}
              </label>
            ))}
          </fieldset>
          {immediate && !checked[current.id] && (
            <button
              className="practice-primary"
              disabled={answers[current.id] === undefined}
              onClick={check}
            >
              {tr("Yanıtı kontrol et")}
            </button>
          )}
          {immediate && checked[current.id] && (
            <div className="practice-feedback" role="status">
              <strong>
                {answers[current.id] === current.correct
                  ? tr("Doğru.")
                  : tr("Henüz değil.")}{" "}
                {tr("Doğru yanıt: {answer}", { answer: current.options[current.correct] })}
              </strong>
              <p>{current.why}</p>
            </div>
          )}
          <div className="practice-actions practice-question-nav">
            <button
              disabled={index === 0}
              onClick={() => changeQuestion(index - 1)}
            >
              {tr("Önceki soru")}
            </button>
            {index < session.questions.length - 1 && (
              <button
                className="practice-primary"
                disabled={immediate && !checked[current.id]}
                onClick={() => changeQuestion(index + 1)}
              >
                {tr("Sonraki soru")} <ArrowRight size={15} aria-hidden="true" />
              </button>
            )}
            <button onClick={() => setConfirmFinish(true)}>
              {tr("Çalışmayı bitir")}
            </button>
          </div>
          {confirmFinish && (
            <div
              className="practice-warning"
              role="group"
              aria-label={tr("Çalışmayı bitirme onayı")}
            >
              <p>
                {result.blank ? `${tr("{n} soru boş kalacak.", { n: result.blank })} ` : ""}
                {tr("Çalışmayı bitirip sonuçlarını görmek istiyor musun?")}
              </p>
              <button onClick={finish}>{tr("Evet, sonuçları göster")}</button>
              <button onClick={() => setConfirmFinish(false)}>
                {tr("Çalışmaya devam et")}
              </button>
            </div>
          )}
          {session.mode === "exam" && (
            <nav
              className="practice-question-grid"
              aria-label={tr("Sorular arasında gezin")}
            >
              {session.questions.map((q, i) => (
                <button
                  key={q.id}
                  aria-label={answers[q.id] === undefined ? tr("Soru {n} — boş", { n: i + 1 }) : tr("Soru {n} — yanıtlandı", { n: i + 1 })}
                  aria-current={index === i ? "step" : undefined}
                  className={answers[q.id] === undefined ? "" : "answered"}
                  onClick={() => changeQuestion(i)}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          )}
          <p className="practice-source-note">
            Çalışma oturumu sayfa yenilendiğinde kapanır. Kontrol edilen görsel
            yanıtların ve tamamlanan denemelerin tekrar kayıtları bu tarayıcıda
            tutulur.
          </p>
        </div>
      )}
      {view === "results" && result && (
        <div className="practice-results">
          <div className="practice-result-header">
            <CheckCircle2 size={32} aria-hidden="true" />
            <h2 ref={heading} tabIndex={-1}>
              {tr("Sonucun değil, sonraki adımın.")}
            </h2>
            {remaining === 0 && (
              <p>{tr("Süre doldu; mevcut yanıtlarınla çalışma tamamlandı.")}</p>
            )}
            <div className="practice-result-score">
              <strong>
                {result.correct}
                <small> / {result.total}</small>
              </strong>
              <span>{tr("doğru yanıt")}</span>
            </div>
            {onExternalQuizzes && <button className="text-button" style={{ marginTop: 18 }} onClick={onExternalQuizzes}>{tr("Anatomi quizleri çalışma alanı")} <ArrowRight size={16}/></button>}
        <div className="practice-pills">
              <span>{tr("{n} yanlış", { n: result.wrong })}</span>
              <span>{tr("{n} boş", { n: result.blank })}</span>
              <span>
                {tr("%{n} başarı", { n: Math.round((result.correct / result.total) * 100) })}
              </span>
            </div>
            <p>{tr("Yanlış ve boş sorular tekrar defterine eklendi. Bu sonuç yalnızca bu alıştırma grubuna aittir; ders başarısının veya sınav notunun ölçüsü değildir.")}</p>
          </div>
          <div className="practice-actions">
            <button
              className="practice-primary"
              onClick={() => {
                setView("setup");
                focusHeading();
              }}
            >
              {tr("Yeni çalışma")}
            </button>
            <button
              onClick={() => {
                setView("notebook");
                focusHeading();
              }}
            >
              {tr("Tekrar defterime git")}
            </button>
          </div>
          <h3>{tr("Konuya göre durumun")}</h3>
          <ul className="practice-topic-results">
            {result.topics.map((t) => (
              <li key={t.lesson}>
                <span>{titleFor(t.lesson)}</span>
                <strong>
                  {t.correct} / {t.total}
                </strong>
              </li>
            ))}
          </ul>
          <h3>{tr("Yanıtlarını incele")}</h3>
          {session.questions.map((q, i) => (
            <details className="practice-result-item" key={q.id}>
              <summary>
                <span>
                  {answers[q.id] === undefined
                    ? tr("Boş")
                    : answers[q.id] === q.correct
                      ? tr("Doğru")
                      : tr("Yanlış")}
                </span>
                {i + 1}.{" "}
                {q.kind === "visual" ? `${q.topic} · ${q.marker} numara` : q.q}
              </summary>
              {q.kind === "visual" && (
                <img
                  src={`${import.meta.env.BASE_URL}diagrams/${q.diagram}.svg`}
                  width="760"
                  height="460"
                  loading="lazy"
                  alt={`${q.topic}, ${q.marker} numaralı işaretin açıklaması aşağıda.`}
                />
              )}
              <p>
                <strong>{tr("Senin yanıtın:")} </strong>
                {q.options[answers[q.id]] || tr("Boş bırakıldı.")}
              </p>
              <p>
                <strong>{tr("Doğru yanıt:")} </strong>
                {q.options[q.correct]}
              </p>
              <p>{q.why}</p>
              <button onClick={() => openTopic(q)}>
                {tr("İlgili konu anlatımına git")}{" "}
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </details>
          ))}
          {sourceNote}
        </div>
      )}
    </section>
  );
}
