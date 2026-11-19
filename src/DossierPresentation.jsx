import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X, Presentation } from 'lucide-react';
import SectionViews from './SectionViews';
import { useI18n } from './i18n';

// A slide is always a selected passage, never a generated summary of its source.
export default function DossierPresentation({
  clips,
  index,
  onClose,
  sourceLinks,
}) {
  const { tr, isRtl } = useI18n();
  const ref = useRef(null);
  const [pos, setPos] = useState(0);
  const clip = clips[pos];
  const fig = index.figures.find(
    (f) => f.number === clip.number && f.section === clip.section,
  );
  useEffect(() => {
    const dlg = ref.current,
      trigger = document.activeElement,
      before = document.body.style.overflow;
    dlg.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dlg.close();
      document.body.style.overflow = before;
      trigger?.focus({ preventScroll: true });
    };
  }, []);
  const move = (n) =>
    setPos((p) => Math.min(clips.length - 1, Math.max(0, p + n)));
  return (
    <dialog
      ref={ref}
      className="plan-stage dossier-stage"
      aria-label={tr('Dosya sunumu')}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        if (
          !['ArrowLeft', 'ArrowRight'].includes(e.key) ||
          e.altKey ||
          e.ctrlKey ||
          e.metaKey
        )
          return;
        e.preventDefault();
        move((e.key === 'ArrowRight' ? 1 : -1) * (isRtl ? -1 : 1));
      }}
    >
      <header>
        <span>
          <Presentation size={18} />
          {tr('Dosya sunumu')}
        </span>
        <button onClick={onClose} autoFocus>
          <X size={16} />
          {tr('Sunumu kapat')}
        </button>
      </header>
      <div
        className={`stage-body ${clip.kind === 'mri' ? 'mri-slide' : ''}`}
        key={clip.id + clip.lang}
      >
        <div className="stage-copy">
          <div className="academic-kicker">
            {clip.lesson} ·{' '}
            {clip.kind === 'paper' ? clip.paperId : clip.lang.toUpperCase()}
          </div>
          <h2>{clip.heading}</h2>
          <p lang={clip.lang} dir="auto">
            {clip.text}
          </p>
          {clip.comment && (
            <aside>
              <b>{tr('Araştırmacı notu')}</b>
              <p dir="auto">{clip.comment}</p>
            </aside>
          )}
          {sourceLinks(clip)}
        </div>
        {clip.kind === 'mri' && (
          <SectionViews point={clip.point} anchor={clip.anchor} />
        )}
        {fig && (
          <figure>
            <img
              src={`${import.meta.env.BASE_URL}diagrams/${fig.key}.svg`}
              alt={fig.diagram.title}
            />
            <figcaption>{fig.diagram.title}</figcaption>
          </figure>
        )}
      </div>
      <footer>
        <span aria-live="polite">
          {tr('Slayt {n} / {total}', { n: pos + 1, total: clips.length })}
        </span>
        <div>
          <button
            disabled={!pos}
            aria-label={tr('Önceki slayt')}
            onClick={() => move(-1)}
          >
            <ArrowLeft size={16} />
          </button>
          <button
            disabled={pos === clips.length - 1}
            aria-label={tr('Sonraki slayt')}
            onClick={() => move(1)}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </footer>
    </dialog>
  );
}
