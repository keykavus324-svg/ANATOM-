import React, { useState } from 'react';
import EditionIllustration from './EditionIllustration';
import {
  ArrowRight,
  ArrowUpRight,
  ScanLine,
  Layers3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useI18n } from './i18n';

const modules = [
  ['library', 'Ders Kütüphanesi', 'Konu anlatımları ve özgün notlar'],
  ['atlas', '3D Anatomi Atlası', 'Yapıları üç boyutta inceleyin'],
  ['sections', 'Kesit Laboratuvarı', 'Üç düzlemde MR incelemesi'],
  ['planner', 'Ders Planlayıcı', 'Kendi ders akışınızı oluşturun'],
];
const plates = [
  [9, 'brain', 'NÖROANATOMİ'],
  [5, 'skull', 'OSTEOLOJİ'],
  [11, 'lungs', 'SPLANKNOLOJİ'],
];
const specimens = [
  { image: 'heart', latin: 'Cor humanum', title: 'Kalp', chapter: 7 },
  { image: 'brain', latin: 'Cerebrum', title: 'Beyin', chapter: 9 },
  { image: 'skull', latin: 'Cranium', title: 'Kafatası', chapter: 5 },
];
export default function AcademicHome({ navigate, notes, openWeb }) {
  const { tr, isRtl } = useI18n();
  const [active, setActive] = useState(0);
  const specimen = specimens[active];
  const cycle = (dir) =>
    setActive((i) => (i + dir + specimens.length) % specimens.length);

  return (
    <div className="academic-home edition-home">
      <section
        className="plate-hero edition-cover"
        aria-label={tr('Atlas kapağı')}
      >
        <div className="edition-rule" aria-hidden="true" />
        <div className="plate-copy edition-copy">
          <span className="edition-kicker">
            <i />
            ANATOMİ <b>/</b> {tr('ATLAS EDİSYONU')}
          </span>
          <h1>
            {tr('İnsan bedeni,')}
            <br />
            <em>{tr('katman katman.')}</em>
          </h1>
          <p>
            {tr(
              'Anatomik yapıları keşfedin, kaynakları karşılaştırın ve bilginizi kendi araştırma dosyanızda birleştirin.',
            )}
          </p>
          <div className="plate-actions">
            <button onClick={() => navigate('lens')}>
              <ScanLine size={16} />
              {tr('Anatomi Merceği')}
              <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate('sections')}>
              <Layers3 size={16} />
              {tr('Kesit Laboratuvarı')}
            </button>
          </div>
          <small className="plate-maker">
            {tr('Tasarım ve geliştirme: ')}
            <strong>Muhammet TUĞRUL</strong>
          </small>
        </div>
        <div className="edition-viewport" dir="ltr">
          <div className="edition-dial" aria-hidden="true">
            <i />
            <b />
          </div>
          <div className="edition-axis" aria-hidden="true" />
          <span className="edition-register" aria-hidden="true">
            +<br />╵
          </span>
          <img
            key={specimen.image}
            className={`edition-organ ${specimen.image}`}
            src={`${import.meta.env.BASE_URL}edition/specimens/${specimen.image}.webp`}
            alt={tr('{name}: temsili atlas illüstrasyonu', {
              name: tr(specimen.title),
            })}
          />
          <span className="edition-index" aria-hidden="true">
            TAB. 0{active + 1}
            <i />
          </span>
        </div>
        <div className="edition-caption">
          <button
            className="edition-caption-link"
            onClick={() =>
              openWeb(notes.find((n) => n.number === specimen.chapter))
            }
            aria-label={tr('{name}: ilgili dersi aç', {
              name: tr(specimen.title),
            })}
          >
            <small>FIG. 0{active + 1} / 03</small>
            <span aria-live="polite">{specimen.latin}</span>
            <ArrowUpRight size={14} />
          </button>
          <div className="edition-pager">
            <button
              aria-label={tr('Önceki kapak levhası')}
              onClick={() => cycle(-1)}
            >
              {isRtl ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
            <button
              aria-label={tr('Sonraki kapak levhası')}
              onClick={() => cycle(1)}
            >
              {isRtl ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
            </button>
          </div>
        </div>
      </section>
      <div className="edition-folio">
        <span>ANATOMIA HUMANA</span>
        <i />
        <span>
          {tr('DİJİTAL ATLAS')} <b>·</b> VOL. I
        </span>
      </div>
      <section className="edition-stations">
        <div className="edition-heading">
          <div>
            <div className="academic-kicker">
              <i />
              {tr('ÇALIŞMA MASASI')}
            </div>
            <h2>{tr('Çalışma istasyonları')}</h2>
          </div>
          <span className="edition-counter">01 — 04</span>
        </div>
        <div className="module-links">
          {modules.map(([id, title, desc], i) => (
            <button
              className={`station station-${id}`}
              key={id}
              onClick={() => navigate(id)}
            >
              <div className="station-strip">
                <span>
                  {tr('İSTASYON')} / 0{i + 1}
                </span>
                <ArrowUpRight size={15} />
              </div>
              <EditionIllustration type={id} />
              <div className="station-bottom">
                <strong>{tr(title)}</strong>
                <small>{tr(desc)}</small>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="plate-library">
        <div className="academic-kicker">
          <i />
          {tr('GÖRSEL KOLEKSİYON')}
        </div>
        <div className="plate-heading">
          <h2>{tr('Anatomik levhalar')}</h2>
          <button onClick={() => navigate('library')}>
            {tr('Tüm dersleri gör')} <ArrowRight size={15} />
          </button>
        </div>
        <div className="plate-cards">
          {plates.map(([number, image, field], i) => {
            const note = notes.find((n) => n.number === number);
            return (
              <button
                key={number}
                className={`spec-card ${image}`}
                onClick={() => openWeb(note)}
              >
                <div className="spec-thumb">
                  <img
                    src={`${import.meta.env.BASE_URL}edition/specimens/${image}.webp`}
                    alt=""
                  />
                  <span className="spec-no">FIG. 0{i + 2}</span>
                  <span className="spec-expand">
                    <ScanLine size={16} />
                  </span>
                </div>
                <div className="spec-info">
                  <small>
                    <i />
                    {tr(field)}
                  </small>
                  <h3>{note.title}</h3>
                  <em>{note.latin}</em>
                  <ArrowUpRight size={16} />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
