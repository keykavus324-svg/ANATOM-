import React, {
  useEffect,
  useState,
  useMemo,
  useSyncExternalStore,
} from 'react';
import {
  Search,
  ScanLine,
  ArrowUpRight,
  BookMarked,
  Presentation,
  Download,
  Plus,
  Minus,
  Check,
  FileText,
  X,
} from 'lucide-react';
import { useI18n } from './i18n';
import { notes as originals } from './data';
import {
  buildResearchIndex,
  findPassages,
  findFigure,
  readResearchQuery,
  researchHash,
  fold,
  clipPassage,
  exportDossier,
  dossierKey,
  readDossier,
} from './researchLens';
import { diagramPins } from './content/diagramPins';
import './researchLens.css';
import LiteratureSearch from './LiteratureSearch';
import { paperUrl, papersRIS } from './literature';
import { sectionHash, sourceURL } from './sectionSpace';
import DossierPresentation from './DossierPresentation';

const subscribe = (f) => {
  window.addEventListener('hashchange', f);
  return () => window.removeEventListener('hashchange', f);
};
const getHash = () => window.location.hash;
const sourceHint =
  'Pasajlar sitenin editoryal anlatımıdır. PDF sayfaları ilgili konuyu gösterir; birebir alıntı değildir.';
function QueryForm({ a, b, search, examples }) {
  const { tr } = useI18n();
  const [first, A] = useState(a),
    [second, B] = useState(b),
    [pair, setPair] = useState(Boolean(b));
  return (
    <form
      className="lens-form"
      onSubmit={(e) => {
        e.preventDefault();
        search(first.trim(), pair ? second.trim() : '');
      }}
    >
      <div className="lens-controls">
        <label>
          <span>A</span>
          <input
            type="search"
            maxLength={100}
            aria-label={tr('Birinci yapı veya terim')}
            placeholder={tr('Yapı veya terim ara')}
            value={first}
            onChange={(e) => A(e.target.value)}
            required
          />
        </label>
        {pair ? (
          <label>
            <span>B</span>
            <input
              autoFocus
              type="search"
              maxLength={100}
              required
              aria-label={tr('İkinci yapı veya terim')}
              value={second}
              onChange={(e) => B(e.target.value)}
            />
            <button
              type="button"
              aria-label={tr('Karşılaştırmayı kapat')}
              onClick={() => {
                B('');
                setPair(false);
                if (b) search(first, '');
              }}
            >
              <X size={15} />
            </button>
          </label>
        ) : (
          <button
            type="button"
            className="lens-compare"
            onClick={() => setPair(true)}
          >
            <Plus size={15} />
            {tr('Karşılaştır')}
          </button>
        )}
        <button
          className="lens-submit"
          disabled={
            !first.trim() ||
            (pair && (!second.trim() || fold(first) === fold(second)))
          }
        >
          <Search size={16} />
          {tr('İncele')}
        </button>
      </div>
      <div className="lens-examples">
        <span>{tr('Örnek izler')}</span>
        {examples.map(([x, y]) => (
          <button type="button" key={x} onClick={() => search(x, y)}>
            {x}
            {y && ` × ${y}`}
            <ArrowUpRight size={12} />
          </button>
        ))}
      </div>
    </form>
  );
}
function SourceLinks({ r, tr }) {
  if (r.kind === 'mri')
    return (
      <div className="lens-sources">
        <a
          href={sectionHash(r.point, r.anchor)}
          target="_blank"
          rel="noreferrer"
        >
          {tr('Kesiti yeniden aç')} <ArrowUpRight size={13} />
        </a>
        <a href={sourceURL} target="_blank" rel="noreferrer">
          {tr('Şablon kaynağı')} <ArrowUpRight size={13} />
        </a>
      </div>
    );
  if (r.kind === 'paper')
    return (
      <div className="lens-sources">
        <a href={paperUrl(r)} target="_blank" rel="noreferrer">
          Europe PMC · {r.paperId} <ArrowUpRight size={13} />
        </a>
        {r.doi && <span>DOI: {r.doi}</span>}
      </div>
    );
  const n = originals.find((n) => n.number === r.number);
  return (
    <div className="lens-sources">
      <a
        href={`#/ders/${r.number}/${r.section}`}
        target="_blank"
        rel="noreferrer"
      >
        {tr('Bölümü aç')} <ArrowUpRight size={13} />
      </a>
      <a
        href={`https://drive.google.com/file/d/${n.id}/view`}
        target="_blank"
        rel="noreferrer"
      >
        {tr('İlgili PDF sayfaları')}: {r.pages} <ArrowUpRight size={13} />
      </a>
    </div>
  );
}
function DiagramCard({ query, match, other = '', pairedMatch, search, tr }) {
  if (!match)
    return (
      <article className="lens-figure">
        <div className="lens-figure-title">
          <ScanLine size={18} />
          <h2>{query}</h2>
        </div>
        <p>
          {tr(
            'Bu terim için etiketli şema bulunamadı. Metin eşleşmelerini aşağıda inceleyin.',
          )}
        </p>
      </article>
    );
  const { fig, label } = match;
  const pair = (item) =>
    search(
      query,
      item === label || fold(query) === fold(item.name) ? '' : item.name,
    );
  return (
    <article className="lens-figure interactive">
      <div className="lens-plate">
        <img
          src={`${import.meta.env.BASE_URL}diagrams/${fig.key}.svg`}
          alt={fig.diagram.title}
        />
        {fig.labels.map((item, j) => {
          const [x, y] = diagramPins[fig.key][j];
          return (
            <button
              key={j}
              className={`lens-pin ${item === label ? 'a' : item === pairedMatch?.label ? 'b' : ''}`}
              style={{
                left: `${(100 * x) / 760}%`,
                top: `${(100 * y) / 460}%`,
              }}
              title={item.name}
              aria-label={`${j + 1}. ${item.name}`}
              onClick={() => pair(item)}
            >
              {j + 1}
            </button>
          );
        })}
      </div>
      <div className="lens-figure-copy">
        <div className="academic-kicker">
          <ScanLine size={14} />
          {tr('ETKİLEŞİMLİ ŞEMA')}
        </div>
        <h3>{fig.diagram.title}</h3>
        {[
          [query, label],
          [other, pairedMatch?.label],
        ]
          .slice(0, pairedMatch ? 2 : 1)
          .map(([term, item], j) => (
            <div key={j} className="lens-definition">
              <span>{j ? 'B' : 'A'}</span>
              <div>
                <h2>{term}</h2>
                <p>
                  {item ? (
                    <>
                      {fold(item.name) !== fold(term) && <b>{item.name}: </b>}
                      {item.text}
                    </>
                  ) : (
                    fig.diagram.caption
                  )}
                </p>
              </div>
            </div>
          ))}
        <div className="lens-labels">
          <small>{tr('Aynı şemada karşılaştır')}</small>
          {fig.labels
            .filter((l) => l !== label && fold(l.name) !== fold(other))
            .map((l) => (
              <button key={l.row.id} onClick={() => pair(l)}>
                {l.name} <Plus size={11} />
              </button>
            ))}
        </div>
      </div>
    </article>
  );
}
function Evidence({ index, a, b, clips, toggle, search, tr }) {
  const [tab, setTab] = useState(b ? 'both' : 'a'),
    [limit, setLimit] = useState(5),
    [course, setCourse] = useState(null);
  const hits = useMemo(
    () => ({
      a: findPassages(index.rows, a),
      b: b ? findPassages(index.rows, b) : [],
      both: b ? findPassages(index.rows, a, b) : [],
    }),
    [index, a, b],
  );
  const matchA = findFigure(index.figures, a),
    matchB = b && findFigure(index.figures, b);
  const courses = Array.from(new Set(hits[tab].map((r) => r.number)))
    .map((n) => ({
      n,
      name: hits[tab].find((r) => r.number === n).lesson,
      count: hits[tab].filter((r) => r.number === n).length,
    }))
    .sort((x, y) => y.count - x.count);
  const list = hits[tab].filter((r) => course === null || r.number === course);
  const shared = Boolean(matchA && matchB && matchA.fig.key === matchB.fig.key);
  return (
    <>
      <section className={`lens-figures ${b && !shared ? 'paired' : ''}`}>
        <DiagramCard
          query={a}
          match={matchA}
          other={b}
          pairedMatch={shared ? matchB : null}
          search={search}
          tr={tr}
        />
        {b && !shared && (
          <DiagramCard
            query={b}
            match={matchB}
            other={a}
            search={search}
            tr={tr}
          />
        )}
      </section>
      <div className="lens-results-heading">
        <div className="academic-kicker">
          <i />
          {tr('KAYNAK İZİ')}
        </div>
        <h2>{tr('Pasajlar ve dayanaklar')}</h2>
        <p>{tr(sourceHint)}</p>
      </div>
      <div className="lens-filters">
        {(b
          ? [
              ['both', tr('Aynı pasajda')],
              ['a', a],
              ['b', b],
            ]
          : [['a', a]]
        ).map(([t, label]) => (
          <button
            key={t}
            aria-pressed={t === tab}
            onClick={() => {
              setTab(t);
              setLimit(5);
              setCourse(null);
            }}
          >
            {label}
            <b>{hits[t].length}</b>
          </button>
        ))}
      </div>
      {tab === 'both' && (
        <p className="lens-note">
          {tr(
            'Birlikte geçme, iki terimin aynı metin parçasında bulunduğunu gösterir; tek başına anatomik bağlantı kanıtı değildir.',
          )}
        </p>
      )}
      {courses.length > 1 && (
        <details className="lens-map">
          <summary>
            {tr('Dersler arası iz')} · {courses.length}
          </summary>
          <p>{tr('Bir ders seçerek eşleşen pasajları süzün.')}</p>
          <div>
            {courses.map((c) => (
              <button
                key={c.n}
                aria-pressed={course === c.n}
                onClick={() => {
                  setCourse(course === c.n ? null : c.n);
                  setLimit(5);
                }}
              >
                <span>{c.name}</span>
                <i
                  style={{ width: `${(100 * c.count) / courses[0].count}%` }}
                />
                <b>{c.count}</b>
              </button>
            ))}
          </div>
        </details>
      )}
      {course !== null && (
        <button className="lens-more" onClick={() => setCourse(null)}>
          {courses.find((c) => c.n === course)?.name}
          <X size={14} />
        </button>
      )}
      {!list.length && (
        <p className="lens-empty">
          {tr(
            'Eşleşen pasaj yok. Daha kısa bir terim deneyin veya yapıların ayrı sonuçlarına bakın.',
          )}
        </p>
      )}
      {list.slice(0, limit).map((r) => {
        const saved = clips.some((c) => c.id === r.id && c.lang === r.lang);
        return (
          <article key={r.id} className="lens-passage">
            <div className="lens-meta">
              <span>
                <FileText size={13} />
                {r.lesson}
              </span>
              <small>
                {tr(
                  r.kind === 'label'
                    ? 'Şema etiketi'
                    : r.kind === 'table'
                      ? 'Tablo satırı'
                      : 'Ders pasajı',
                )}
              </small>
            </div>
            <h3>{r.heading}</h3>
            <p>{r.text}</p>
            <div className="lens-actions">
              <SourceLinks r={r} tr={tr} />
              <button aria-pressed={saved} onClick={() => toggle(r)}>
                {saved ? <Check size={14} /> : <Plus size={14} />}{' '}
                {tr(saved ? 'Dosyadan çıkar' : 'Dosyaya ekle')}
              </button>
            </div>
          </article>
        );
      })}
      {list.length > limit && (
        <button className="lens-more" onClick={() => setLimit((l) => l + 10)}>
          {tr('Daha fazla pasaj göster')} <Plus size={14} />
        </button>
      )}
    </>
  );
}
export default function ResearchLens({ notes }) {
  const { tr, lang } = useI18n();
  const hash = useSyncExternalStore(subscribe, getHash);
  const index = useMemo(() => buildResearchIndex(lang, notes), [lang]);
  const sample = (id, i) =>
    index.figures.find((f) => f.key === id).labels[i].name;
  const examples = [
    [sample('forearm', 0), sample('forearm', 1)],
    [sample('meninges', 0), sample('meninges', 3)],
    [sample('airways', 0), ''],
  ];
  const [a, b] = readResearchQuery(hash, examples[0][0]);
  const [dossier, D] = useState(
      () => new URLSearchParams(hash.split('?')[1]).get('dosya') === '1',
    ),
    [showSlides, S] = useState(false);
  const [initial] = useState(() => {
    try {
      return { clips: readDossier(localStorage.getItem(dossierKey)) };
    } catch {
      return { clips: [], error: true };
    }
  });
  const [clips, C] = useState(initial.clips),
    [warn, W] = useState(initial.error);
  // A lab opened from this dossier may add records in a separate tab.
  useEffect(() => {
    const sync = (e) => {
      if (e.key !== dossierKey && e.key !== null) return;
      try {
        C(readDossier(localStorage.getItem(dossierKey)));
        S(false);
        W(false);
      } catch {
        W(true);
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const persist = (next) => {
    C(next);
    try {
      localStorage.setItem(dossierKey, JSON.stringify(next));
      W(false);
    } catch {
      W(true);
    }
  };
  const search = (x, y = '') => {
    if (!x.trim()) return;
    D(false);
    window.location.hash = researchHash(x.trim(), y.trim());
  };
  const isSame = (p, r) => p.id === r.id && p.lang === r.lang;
  const toggle = (r) =>
    persist(
      clips.some((p) => isSame(p, r))
        ? clips.filter((p) => !isSame(p, r))
        : [...clips, r.kind === 'paper' ? r : clipPassage(r)],
    );
  function download(ris = false) {
    const url = URL.createObjectURL(
      new Blob(
        [
          ris
            ? papersRIS(clips)
            : exportDossier(clips, originals, window.location.href, tr),
        ],
        {
          type: 'text/plain;charset=utf-8',
        },
      ),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = ris
      ? 'anatomi-kaynakca.ris'
      : 'anatomi-arastirma-dosyasi.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className="lens-page">
      <header className="lens-header">
        <div>
          <div className="academic-kicker">
            <i />
            {tr('ARAŞTIRMA TEZGAHI')}
          </div>
          <h1>{tr('Anatomi Merceği')}</h1>
          <p>
            {tr(
              'Bir terimden şemaya, bir karşılaştırmadan kaynaklı araştırma notuna.',
            )}
          </p>
        </div>
        <button aria-pressed={dossier} onClick={() => D(!dossier)}>
          <BookMarked size={17} />
          {tr(dossier ? 'Merceğe dön' : 'Araştırma dosyam')}
          <b>{clips.length}</b>
        </button>
      </header>
      {warn && (
        <p role="status">
          {tr(
            'Cihaz kaydı kullanılamıyor. Çalışmanızı kaybetmemek için dosyayı indirin.',
          )}
        </p>
      )}
      {dossier ? (
        <section className="lens-dossier">
          <div className="lens-results-heading">
            <h2>{tr('Araştırma dosyam')}</h2>
            <p>
              {tr(
                'Seçtiğiniz pasajlar ve kendi notlarınız bu tarayıcıda tutulur. Kaynak bağlantılarıyla birlikte dışa aktarabilirsiniz.',
              )}
            </p>
          </div>
          <div className="lens-file-tools">
            <button
              className="primary-button"
              disabled={!clips.length}
              onClick={() => S(true)}
            >
              <Presentation size={16} />
              {tr('Dosyayı sun')}
            </button>
            <button
              className="text-button"
              disabled={!clips.length}
              onClick={() => download()}
            >
              <Download size={16} />
              {tr('Kaynaklı dosyayı indir')}
            </button>
            {clips.some((c) => c.kind === 'paper') && (
              <button className="text-button" onClick={() => download(true)}>
                <Download size={15} />
                {tr('Yayın künyeleri (.ris)')}
              </button>
            )}
          </div>
          {!clips.length && (
            <p className="lens-empty">
              {tr(
                'Henüz pasaj eklemediniz. Mercekteki bir sonucun “Dosyaya ekle” düğmesini kullanın.',
              )}
            </p>
          )}
          {clips.map((r) => (
            <article key={`${r.lang}/${r.id}`} className="lens-passage">
              <div className="lens-meta">
                {r.lesson} ·{' '}
                {r.kind === 'paper' ? r.paperId : r.lang.toUpperCase()}
              </div>
              <h3>{r.heading}</h3>
              <p>{r.text}</p>
              <label className="lens-annotation">
                {tr('Araştırmacı notu')}
                <textarea
                  maxLength={3000}
                  value={r.comment}
                  onChange={(e) =>
                    persist(
                      clips.map((p) =>
                        isSame(p, r) ? { ...p, comment: e.target.value } : p,
                      ),
                    )
                  }
                />
              </label>
              <div className="lens-actions">
                <SourceLinks r={r} tr={tr} />
                <button onClick={() => toggle(r)}>
                  <Minus size={14} />
                  {tr('Dosyadan çıkar')}
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <>
          <QueryForm
            key={`${lang}::${a}::${b}`}
            a={a}
            b={b}
            search={search}
            examples={examples}
          />
          <LiteratureSearch
            key={`lit::${a}::${b}`}
            initial={[a, b].filter(Boolean).join(' AND ') + ' AND anatomy'}
            clips={clips}
            toggle={toggle}
          />
          <Evidence
            key={`hits::${lang}::${a}::${b}`}
            index={index}
            a={a}
            b={b}
            clips={clips}
            toggle={toggle}
            search={search}
            tr={tr}
          />
        </>
      )}
      {showSlides && clips.length > 0 && (
        <DossierPresentation
          clips={clips}
          index={index}
          onClose={() => S(false)}
          sourceLinks={(r) => <SourceLinks r={r} tr={tr} />}
        />
      )}
    </section>
  );
}
