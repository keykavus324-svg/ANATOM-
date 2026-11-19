import React, { useState } from 'react';
import {
  Plus,
  FolderOpen,
  Trash2,
  Presentation,
  Printer,
  Save,
  ArrowUpRight,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { lessonHash } from './routing';
import { useI18n } from './i18n';

import { emptyPlan, loadLibrary, storePlan, deletePlan } from './planLibrary';
import PlanPresentation from './PlanPresentation';

export default function LessonPlanner({ notes }) {
  const { tr } = useI18n();
  const [library, setLibrary] = useState(() => {
    try {
      return loadLibrary(localStorage, notes);
    } catch {
      return { plans: [], activeId: '', unavailable: true };
    }
  });
  const [plan, setPlan] = useState(
    () => library.plans.find((p) => p.id === library.activeId) || emptyPlan(),
  );
  const [presenting, setPresenting] = useState(false);
  const [status, setStatus] = useState(
    library.unavailable
      ? 'Kayıtlı planlar okunamadı. Yazdırma ve sunum kullanılabilir.'
      : '',
  );
  const [dirty, setDirty] = useState(false);
  function openPlan(next) {
    if (
      dirty &&
      !window.confirm(tr('Kaydedilmemiş değişiklikler bırakılsın mı?'))
    )
      return;
    setPlan(next);
    setDirty(false);
    setStatus('');
  }
  function applyLibrary(next) {
    setLibrary(next);
    setPlan(next.plans.find((p) => p.id === next.activeId) || emptyPlan());
    setDirty(false);
  }
  const update = (patch) => {
    setPlan((p) => ({ ...p, ...patch }));
    setDirty(true);
    setStatus('');
  };
  function save(e) {
    e.preventDefault();
    try {
      applyLibrary(storePlan(localStorage, notes, plan));
      setStatus('Plan bu tarayıcıya kaydedildi.');
    } catch {
      setStatus('Kaydedilemedi. Planınızı yazdırabilirsiniz.');
    }
  }
  function remove() {
    if (
      !window.confirm(
        tr('“{title}” planı bu tarayıcıdan silinsin mi?', {
          title: plan.title,
        }),
      )
    )
      return;
    try {
      applyLibrary(deletePlan(localStorage, notes, plan.id));
      setStatus('Plan silindi.');
    } catch {
      setStatus('Plan silinemedi.');
    }
  }
  const chosen = plan.ids.map((id) => notes.find((n) => n.id === id));
  function move(index, delta) {
    const ids = [...plan.ids];
    [ids[index], ids[index + delta]] = [ids[index + delta], ids[index]];
    update({ ids });
  }
  return (
    <section className="planner">
      <div className="academic-kicker">
        <i />
        {tr('ÖĞRETİM ARAÇLARI')}
      </div>
      <h1>{tr('Ders Planlayıcı')}</h1>
      <p>
        {tr(
          'Dersinizin hedefini belirleyin, konuları seçin ve planınızı bu cihazda saklayın.',
        )}
      </p>
      <div className="plan-library-bar">
        <FolderOpen aria-hidden="true" size={23} />
        <label>
          {tr('Plan arşivim')} <small>({library.plans.length})</small>
          <select
            value={plan.id}
            onChange={(e) =>
              openPlan(
                library.plans.find((p) => p.id === e.target.value) ||
                  emptyPlan(),
              )
            }
          >
            {!plan.id && <option value="">{tr('Yeni taslak')}</option>}
            {library.plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
        <button onClick={() => openPlan(emptyPlan())}>
          <Plus size={16} />
          {tr('Yeni plan')}
        </button>
        {plan.id && (
          <button onClick={remove}>
            <Trash2 size={15} />
            {tr('Planı sil')}
          </button>
        )}
      </div>
      <div className="planner-grid">
        <form onSubmit={save}>
          <label>
            {tr('Ders başlığı')}
            <input
              required
              maxLength={160}
              value={plan.title}
              onChange={(e) => update({ title: e.target.value })}
            />
          </label>
          <label>
            {tr('Öğrenme hedefleri')}
            <textarea
              rows="3"
              maxLength={3000}
              value={plan.goal}
              onChange={(e) => update({ goal: e.target.value })}
            />
          </label>
          <fieldset>
            <legend>{tr('Derse eklenecek konular')}</legend>
            {notes.map((n) => (
              <label key={n.id}>
                <input
                  type="checkbox"
                  checked={plan.ids.includes(n.id)}
                  onChange={(e) =>
                    update({
                      ids: e.target.checked
                        ? [...plan.ids, n.id]
                        : plan.ids.filter((id) => id !== n.id),
                    })
                  }
                />
                {n.title}
              </label>
            ))}
          </fieldset>
          <button
            className="primary-button"
            disabled={!chosen.length || !plan.title.trim()}
          >
            <Save size={16} />
            {tr('Planı kaydet')}
          </button>
          <p role="status">{status && tr(status)}</p>
        </form>
        <article className="plan-preview">
          <div className="academic-kicker">ANATOMİ / {tr('DERS PLANI')}</div>
          <h2>{plan.title || tr('Plan önizlemesi')}</h2>
          {plan.goal && <p>{plan.goal}</p>}
          {!chosen.length && (
            <p>{tr('Seçtiğiniz konular burada listelenecek.')}</p>
          )}
          <ol>
            {chosen.map((n, i) => (
              <li key={n.id}>
                <div className="plan-topic">
                  <a href={lessonHash(n)} target="_blank" rel="noreferrer">
                    {n.title} <ArrowUpRight size={14} />
                  </a>
                  <div className="plan-order">
                    <button
                      disabled={i === 0}
                      aria-label={tr('{title}: yukarı taşı', {
                        title: n.title,
                      })}
                      onClick={() => move(i, -1)}
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      disabled={i === chosen.length - 1}
                      aria-label={tr('{title}: aşağı taşı', { title: n.title })}
                      onClick={() => move(i, 1)}
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>
                <small>{n.latin}</small>
              </li>
            ))}
          </ol>
          {chosen.length > 0 && (
            <div className="plan-sources">
              <h3>{tr('Dersin özgün kaynakları')}</h3>
              <p>{tr('Dr. Öğr. Gör. Bekir Dağdeviren')}</p>
              {chosen.map((n) => (
                <a
                  key={n.id}
                  href={`https://drive.google.com/file/d/${n.id}/view`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {n.original} <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          )}
          <div className="plan-launch-actions">
            <button
              className="primary-button"
              disabled={!chosen.length || !plan.title.trim()}
              onClick={() => setPresenting(true)}
            >
              <Presentation size={16} />
              {tr('Sunumu başlat')}
            </button>
            <button
              className="text-button print-plan"
              disabled={!chosen.length || !plan.title.trim()}
              onClick={() => window.print()}
            >
              <Printer size={15} />
              {tr('Planı yazdır')}
            </button>
          </div>
        </article>
      </div>
      {presenting && (
        <PlanPresentation
          plan={plan}
          topics={chosen}
          onClose={() => setPresenting(false)}
        />
      )}
    </section>
  );
}
