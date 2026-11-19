import React, { useState } from 'react';
import { ArrowUpRight, GraduationCap } from 'lucide-react';
import { useI18n } from './i18n';
import { distance, exerciseHash, radii, world } from './sectionSpace';
export function ExerciseBuilder({ point, ready }) {
  const { tr } = useI18n();
  const [prompt, P] = useState(''),
    [radius, R] = useState(6),
    [link, L] = useState('');
  return (
    <details className="slice-exercise">
      <summary>
        <GraduationCap size={17} />{' '}
        {tr('Sınıf için nokta bulma görevi hazırla')}
      </summary>
      <p>
        {tr(
          'Bir hedef nokta seçin ve öğrencinin orayı bulmasını sağlayacak ipucunu yazın. Bağlantı soruyu, hedefi ve kabul yarıçapını içerir; bu bir denemedir, güvenli sınav değildir.',
        )}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          L(new URL(exerciseHash(point, prompt, radius), location.href).href);
        }}
      >
        <label>
          {tr('Öğrenciye ipucu')}
          <input
            required
            maxLength={180}
            value={prompt}
            onChange={(e) => {
              P(e.target.value);
              L('');
            }}
          />
        </label>
        <label>
          {tr('Kabul yarıçapı')}
          <select
            value={radius}
            onChange={(e) => {
              R(Number(e.target.value));
              L('');
            }}
          >
            {radii.map((n) => (
              <option key={n} value={n}>
                {n} mm
              </option>
            ))}
          </select>
        </label>
        <button className="primary-button" disabled={!ready || !prompt.trim()}>
          {tr('Görev bağlantısı oluştur')}
        </button>
      </form>
      {link && (
        <label className="slice-share">
          {tr('Oluşturulan görev bağlantısı')}
          <input
            value={link}
            dir="ltr"
            readOnly
            onFocus={(e) => e.target.select()}
          />
          <a href={link} target="_blank" rel="noreferrer">
            {tr('Görevi önizle')} <ArrowUpRight size={13} />
          </a>
        </label>
      )}
    </details>
  );
}
export function ExercisePrompt({ challenge, point, ready, onShow }) {
  const { tr } = useI18n();
  const [attempt, A] = useState(null),
    [revealed, R] = useState(false);
  const { target, prompt, radius } = challenge;
  return (
    <section className="slice-exercise exercise-prompt">
      <div className="academic-kicker">
        <GraduationCap size={16} />
        {tr('NOKTA BULMA GÖREVİ')}
      </div>
      <h2 dir="auto">{prompt}</h2>
      <p>
        {tr(
          'Üç kesiti kullanarak noktanızı seçin ve hedefe uzaklığınızı kontrol edin.',
        )}{' '}
        {tr('Kabul yarıçapı')}: {radius} mm.
      </p>
      <div className="slice-tools">
        <button
          disabled={!ready || revealed}
          onClick={() => A(distance(target, point))}
        >
          {tr('Seçimimi kontrol et')}
        </button>
        <button
          disabled={!ready || revealed}
          onClick={() => {
            onShow(target);
            R(true);
          }}
        >
          {tr('Hedefi göster')}
        </button>
        <a href="#/kesit/v1">{tr('Serbest incelemeye dön')}</a>
      </div>
      <p role="status">
        {revealed
          ? `${tr('Hedef konum')}: (${world(target).join(', ')}) mm`
          : attempt !== null
            ? `${tr('Son deneme')}: ${attempt.toFixed(1)} mm · ${tr(attempt <= radius ? 'Kabul alanında.' : 'Kabul alanı dışında; tekrar deneyin.')}`
            : ''}
      </p>
    </section>
  );
}
