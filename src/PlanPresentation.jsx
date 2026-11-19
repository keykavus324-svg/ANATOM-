import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  X,
  Presentation,
  ArrowUpRight,
} from 'lucide-react';
import { useI18n } from './i18n';
import { lessons } from './lessons';
import { lessonIn } from './content/lessonI18n';
import { lessonHash } from './routing';

export default function PlanPresentation({ plan, topics, onClose }) {
  const { tr, lang, isRtl } = useI18n();
  const [index, setIndex] = useState(0);
  const ref = useRef(null);
  const total = 1 + topics.length * 2;
  const topic = index ? topics[Math.floor((index - 1) / 2)] : null;
  const lesson = topic && lessonIn(lang, topic.number, lessons[topic.number]);
  const discussion = topic && index % 2 === 0;
  const move = (delta) =>
    setIndex((i) => Math.max(0, Math.min(total - 1, i + delta)));
  useEffect(() => {
    const trigger = document.activeElement;
    const dialog = ref.current;
    const before = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = before;
      trigger?.focus({ preventScroll: true });
    };
  }, []);
  function handleKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    move((e.key === 'ArrowRight' ? 1 : -1) * (isRtl ? -1 : 1));
  }
  return (
    <dialog
      ref={ref}
      className="plan-stage"
      aria-label={tr('Sınıf sunumu')}
      onKeyDown={handleKey}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <header>
        <span>
          <Presentation size={19} />
          {tr('Sınıf sunumu')}
        </span>
        <button onClick={onClose} autoFocus>
          <X size={17} />
          {tr('Sunumu kapat')}
        </button>
      </header>
      <div className="stage-body" key={index}>
        <div className="stage-copy">
          <div className="academic-kicker">
            <i />
            {!topic
              ? tr('DERS PLANI')
              : discussion
                ? tr('TARTIŞMA SORUSU')
                : topic.latin}
          </div>
          <h2>{topic ? topic.title : plan.title}</h2>
          {!topic ? (
            <>
              {plan.goal && (
                <>
                  <h3>{tr('Öğrenme hedefleri')}</h3>
                  <p className="stage-goal">{plan.goal}</p>
                </>
              )}
              <ol>
                {topics.map((n) => (
                  <li key={n.id}>{n.title}</li>
                ))}
              </ol>
            </>
          ) : discussion ? (
            <>
              <p>{lesson.review[0].q}</p>
              <details>
                <summary>{tr('Yanıtı incele')}</summary>
                <p>{lesson.review[0].a}</p>
              </details>
            </>
          ) : (
            <p>{lesson.intro}</p>
          )}
          {topic && (
            <a
              className="stage-link"
              href={lessonHash(topic)}
              target="_blank"
              rel="noreferrer"
            >
              {tr('Konu anlatımını aç')}
              <ArrowUpRight size={15} />
            </a>
          )}
        </div>
        {topic && (
          <figure>
            <img
              src={`${import.meta.env.BASE_URL}${lesson.image.replace(/^\//, '')}`}
              alt={lesson.imageAlt}
            />
            <figcaption>
              {tr(
                'Yapay zekâ ile üretilmiş temsili çizim · Anatomik referans değildir.',
              )}
            </figcaption>
          </figure>
        )}
      </div>
      <footer>
        <span aria-live="polite">
          {tr('Slayt {n} / {total}', { n: index + 1, total })}
        </span>
        <div>
          <button
            disabled={!index}
            onClick={() => move(-1)}
            aria-label={tr('Önceki slayt')}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            disabled={index === total - 1}
            onClick={() => move(1)}
            aria-label={tr('Sonraki slayt')}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </dialog>
  );
}
