import React, { useEffect, useId, useRef, useState } from 'react';
import { Maximize2, Minus, Plus, X } from 'lucide-react';
import { diagrams } from '../content/diagrams';
import './instructional-figure.css';

export default function InstructionalFigure({ diagramId, number }) {
  const diagram = diagrams[diagramId];
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const titleId = useId();
  const captionId = useId();
  const modalTitleId = useId();
  useEffect(() => {
    if (!expanded) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (trigger.current?.isConnected) trigger.current.focus({ preventScroll: true });
    };
  }, [expanded]);
  const containKeyboardFocus = event => {
    if (event.key !== 'Tab') return;
    const targets = [...dialog.current.querySelectorAll('button:not(:disabled), [tabindex="0"]')];
    const first = targets[0];
    const last = targets.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  if (!diagram) return null;
  return <figure className="instructional-figure" aria-labelledby={titleId} aria-describedby={captionId} data-diagram={diagramId}>
    <div className="figure-heading"><span>ŞEKİL {number}</span><span>{diagram.view}</span></div>
    <div className="figure-plate">
      <img src={`${import.meta.env.BASE_URL}diagrams/${diagramId}.svg`} width="760" height="460" loading="lazy" decoding="async" alt={`${diagram.title}. Numaralı yapıların açıklamaları şeklin altında.`}/>
      <button ref={trigger} className="figure-expand" aria-label={`Şemayı büyüt: ${diagram.title}`} onClick={() => { setZoom(1); setExpanded(true); }}><Maximize2 size={15}/><span>Büyüt</span></button>
    </div>
    <figcaption>
      <h3 id={titleId}>{diagram.title}</h3>
      <p id={captionId}>{diagram.caption}</p>
      <dl className="figure-legend">{diagram.labels.map((label, i) => <div key={label.name}><dt><span aria-hidden="true">{i + 1}</span><span><span className="sr-only">{i + 1}. </span>{label.name}</span></dt><dd>{label.text}</dd></div>)}</dl>
      <p className="figure-takeaway"><span>ŞEKLİ OKURKEN</span>{diagram.takeaway}</p>
      <small className="figure-disclaimer">ANATOMİ için hazırlanmış özgün öğretici şema · Ölçekli anatomik çizim değildir.</small>
    </figcaption>
    {expanded && <dialog ref={dialog} className="figure-dialog" aria-labelledby={modalTitleId} onKeyDown={containKeyboardFocus} onCancel={event => { event.preventDefault(); setExpanded(false); }} onClick={event => { if (event.target === event.currentTarget) setExpanded(false); }}>
      <div className="figure-dialog-header"><div><span>ŞEKİL {number} · İNCELEME GÖRÜNÜMÜ</span><h2 id={modalTitleId}>{diagram.title}</h2></div><button autoFocus aria-label="Şemayı kapat" onClick={() => setExpanded(false)}><X size={22}/></button></div>
      <div className="figure-zoom-tools"><span>Geniş çizimde yatay ve dikey kaydırabilirsin.</span><div><button disabled={zoom <= 1} aria-label="Şemayı küçült" onClick={() => setZoom(value => Math.max(1, value - .25))}><Minus size={16}/></button><output aria-live="polite">%{Math.round(zoom * 100)}</output><button disabled={zoom >= 2} aria-label="Şemayı yakınlaştır" onClick={() => setZoom(value => Math.min(2, value + .25))}><Plus size={16}/></button></div></div>
      <div className="figure-zoom-viewport" tabIndex={0} role="region" aria-label="Büyütülmüş şema; kaydırarak incele"><img src={`${import.meta.env.BASE_URL}diagrams/${diagramId}.svg`} style={{ width: `${760 * zoom}px` }} width="760" height="460" alt={diagram.title}/></div>
      <ol className="figure-dialog-legend">{diagram.labels.map(label => <li key={label.name}><strong>{label.name}.</strong> {label.text}</li>)}</ol>
    </dialog>}
  </figure>;
}
