import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  BookMarked,
  Crosshair,
  Layers3,
  Link2,
  Ruler,
  Save,
  FlipHorizontal2,
  RotateCcw,
} from 'lucide-react';
import { useI18n } from './i18n';
import { ExerciseBuilder, ExercisePrompt } from './SectionExercise';
import SectionViews from './SectionViews';
import {
  volumeId,
  origin,
  step,
  world,
  initialPoint,
  readSection,
  readExercise,
  distance,
  sectionHash,
  coordText,
  sourceURL,
} from './sectionSpace';
import { dossierKey, readDossier } from './researchLens';

export default function SectionLab() {
  const { tr, lang } = useI18n();
  const [challenge, setChallenge] = useState(() => readExercise(location.hash));
  const [view, V] = useState(() => readSection(location.hash)),
    { point, anchor } = view;
  const [name, N] = useState(''),
    [comment, C] = useState(''),
    [status, S] = useState(''),
    [sharing, H] = useState(false),
    [ready, R] = useState(false);
  useEffect(() => {
    const sync = () => {
      if (location.hash.startsWith('#/kesit')) {
        V(readSection(location.hash));
        setChallenge(readExercise(location.hash));
        S('');
      }
    };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  function change(p, a = anchor) {
    V({ point: p, anchor: a });
    S('');
  }
  const coords = world(point),
    href = new URL(sectionHash(point, anchor), location.href).href;
  function save(e) {
    e.preventDefault();
    if (!name.trim() || !ready) return;
    try {
      const clips = readDossier(localStorage.getItem(dossierKey));
      const clip = {
        kind: 'mri',
        volume: volumeId,
        id: `mri/${crypto.randomUUID()}`,
        lang,
        lesson: 'MNI152 · T1',
        heading: name.trim(),
        text: coordText(point, anchor),
        point: [...point],
        anchor: anchor ? [...anchor] : null,
        comment: comment.trim(),
      };
      localStorage.setItem(dossierKey, JSON.stringify([...clips, clip]));
      N('');
      C('');
      S('Kesit araştırma dosyanıza eklendi.');
    } catch {
      S('Kesit kaydedilemedi. Konum bağlantısını saklayabilirsiniz.');
    }
  }
  return (
    <section className="section-lab">
      <div className="academic-kicker">
        <i />
        {tr('GÖRÜNTÜLEME ATÖLYESİ')}
      </div>
      <h1>{tr('Kesit Laboratuvarı')}</h1>
      <p className="section-lead">
        {tr(
          'Bir noktayı üç düzlemde izleyin, şablon üzerinde ölçün ve aynı konumu kaynaklı bir nota dönüştürün.',
        )}
      </p>
      {challenge && (
        <ExercisePrompt
          key={JSON.stringify(challenge)}
          challenge={challenge}
          point={point}
          ready={ready}
          onShow={(p) => change([...p], null)}
        />
      )}
      <section className="slice-console">
        <header>
          <span>
            <Layers3 size={19} /> MNI152 <em>T1</em>
          </span>
          <small dir="ltr">RAS+ · 2 mm</small>
        </header>
        <SectionViews
          point={point}
          anchor={anchor}
          onPoint={(p) => change(p)}
          onReady={R}
        />
        <div className="slice-readout">
          <span>
            <Crosshair size={15} /> {tr('Seçili konum')}
          </span>
          <strong dir="ltr">
            {coords.map((v, i) => `${'XYZ'[i]} ${v}`).join('  ·  ')} mm
          </strong>
        </div>
      </section>
      <p className="slice-help">
        {tr(
          'Kesite tıklayın veya odaktayken ok tuşlarını kullanın. Alttaki sürgü o düzlemde dilim değiştirir. L/R: sol/sağ, A/P: ön/arka, S/I: üst/alt.',
        )}
      </p>
      <div className="slice-tools">
        <button
          disabled={!ready}
          onClick={() => change(point, anchor ? null : [...point])}
        >
          <Ruler size={16} />
          {tr(anchor ? 'Ölçümü temizle' : 'Ölçüm başlangıcı koy')}
        </button>
        <button
          disabled={!ready || coords[0] === 0}
          onClick={() =>
            change([(-coords[0] - origin[0]) / step, point[1], point[2]])
          }
        >
          <FlipHorizontal2 size={16} />
          {tr('Ayna konuma geç')}
        </button>
        <button onClick={() => change([...initialPoint], null)}>
          <RotateCcw size={15} />
          {tr('Merkeze dön')}
        </button>
        <button aria-expanded={sharing} onClick={() => H((v) => !v)}>
          <Link2 size={15} />
          {tr('Konum bağlantısı')}
        </button>
      </div>
      {anchor && (
        <div className="slice-distance">
          <Ruler size={20} />
          <div>
            <b>
              {tr('İki nokta arası mesafe')} ·{' '}
              {distance(point, anchor).toFixed(1)} mm
            </b>
            <small dir="ltr">{coordText(point, anchor)}</small>
          </div>
        </div>
      )}
      {sharing && (
        <label className="slice-share">
          {tr('Bu bağlantı yalnızca şablon koordinatlarını içerir.')}
          <input
            readOnly
            value={href}
            dir="ltr"
            onFocus={(e) => e.target.select()}
          />
        </label>
      )}
      {!challenge && <ExerciseBuilder point={point} ready={ready} />}
      <div className="slice-bottom">
        <form onSubmit={save}>
          <div className="academic-kicker">
            <BookMarked size={14} />
            {tr('KESİT KAYDI')}
          </div>
          <h2>{tr('Gözlemini kaydet')}</h2>
          <label>
            {tr('Kesit başlığı')}
            <input
              required
              maxLength={140}
              value={name}
              onChange={(e) => N(e.target.value)}
            />
          </label>
          <label>
            {tr('Araştırmacı notu')}
            <textarea
              maxLength={3000}
              rows="2"
              value={comment}
              onChange={(e) => C(e.target.value)}
            />
          </label>
          <button className="primary-button" disabled={!ready || !name.trim()}>
            <Save size={15} />
            {tr('Dosyaya ekle')}
          </button>{' '}
          <a href="#/mercek?dosya=1">
            {tr('Araştırma dosyam')} <ArrowUpRight size={14} />
          </a>
          <p role="status">{status && tr(status)}</p>
        </form>
        <aside>
          <div className="academic-kicker">
            <i />
            {tr('ŞABLON KÜNYESİ')}
          </div>
          <h2>ICBM152 · T1</h2>
          <p>
            {tr(
              'Bu görüntüler bir hastaya ait değildir. MNI ortalama beyin şablonundan hazırlanmış 2 mm aralıklı eğitim kesitleridir. Mesafe şablona aittir; klinik ölçüm veya tanı için kullanılmaz.',
            )}
          </p>
          <p>
            McConnell Brain Imaging Centre · Montreal Neurological Institute ·
            McGill University
          </p>
          <div>
            <a href={sourceURL} target="_blank" rel="noreferrer">
              {tr('Şablon kaynağı')} <ArrowUpRight size={13} />
            </a>
            <a
              href={`${import.meta.env.BASE_URL}sections/LICENSE.txt`}
              target="_blank"
              rel="noreferrer"
            >
              {tr('Veri lisansı')} <ArrowUpRight size={13} />
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
