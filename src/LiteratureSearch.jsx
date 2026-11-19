import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, BookOpen, Search, Plus, Check } from 'lucide-react';
import { parsePaper, paperUrl } from './literature';
import { useI18n } from './i18n';

export default function LiteratureSearch({ initial, clips, toggle }) {
  const { tr } = useI18n();
  const [query, Q] = useState(initial),
    [open, O] = useState(false),
    [papers, P] = useState([]),
    [status, S] = useState('idle');
  const request = useRef(null);
  useEffect(
    () => () => {
      request.current?.abort();
      request.current = null;
    },
    [],
  );
  const phrase = query.trim() + (open ? ' AND OPEN_ACCESS:Y' : '');
  function resetResults(){request.current?.abort(); request.current=null; P([]); S('idle');}
  async function search(e) {
    e.preventDefault();
    if (!query.trim()) return;
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    const timer = setTimeout(() => controller.abort(), 12000);
    S('loading');
    P([]);
    try {
      const params = new URLSearchParams({
        query: phrase,
        format: 'json',
        resultType: 'core',
        pageSize: '8',
      });
      const res = await fetch(
        `https://www.ebi.ac.uk/europepmc/webservices/rest/search?${params}`,
        {
          signal: controller.signal,
          credentials: 'omit',
          referrerPolicy: 'no-referrer',
        },
      );
      if (!res.ok) throw Error('Search failed');
      const data = await res.json();
      if (!Array.isArray(data.resultList?.result))
        throw Error('Unexpected response');
      const records = data.resultList.result.map(parsePaper).filter(Boolean);
      if (request.current === controller) {
        P(records);
        S(records.length ? 'ready' : 'empty');
      }
    } catch {
      if (request.current === controller) S('error');
    } finally {
      clearTimeout(timer);
    }
  }
  return (
    <details className="lens-literature">
      <summary>
        <BookOpen size={17} />
        {tr('Bilimsel yayınları tara')} <small>Europe PMC</small>
      </summary>
      <p>
        {tr(
          'İsteğe bağlı dış tarama: yalnızca yayın sorgunuz Europe PMC’ye gönderilir. Sonuçlar yayın künyeleridir; tam metin veya bilimsel kalite değerlendirmesi değildir.',
        )}
      </p>
      <form onSubmit={search}>
        <label>
          {tr('Yayın sorgusu')}
          <input
            value={query}
            maxLength={300}
            onChange={(e) => {resetResults();Q(e.target.value);}}
            required
          />
        </label>
        <label className="lit-oa">
          <input
            type="checkbox"
            checked={open}
            onChange={(e) => {resetResults();O(e.target.checked);}}
          />
          {tr('Açık erişim')}
        </label>
        <button
          className="primary-button"
          disabled={!query.trim() || status === 'loading'}
        >
          <Search size={15} />
          {tr('Yayın ara')}
        </button>
      </form>
      <div role="status" aria-live="polite">
        {status === 'loading'
          ? tr('Europe PMC taranıyor…')
          : status === 'empty'
            ? tr('Bu sorgu için yayın bulunamadı.')
            : status === 'error'
              ? tr(
                  'Yayın servisine ulaşılamadı. Yeniden deneyin veya sorguyu Europe PMC’de açın.',
                )
              : status === 'ready'
                ? tr('{n} yayın gösteriliyor.', { n: papers.length })
                : null}
      </div>
      {papers.map((p) => {
        const saved = clips.some((c) => c.id === p.id);
        return (
          <article key={p.id}>
            <a href={paperUrl(p)} target="_blank" rel="noreferrer">
              {p.heading} <ArrowUpRight size={13} />
            </a>
            <p>{p.text}</p>
            <button
              className="lens-more"
              aria-pressed={saved}
              onClick={() => toggle(p)}
            >
              {saved ? <Check size={13} /> : <Plus size={13} />}{' '}
              {tr(saved ? 'Dosyadan çıkar' : 'Dosyaya ekle')}
            </button>
          </article>
        );
      })}
      {query.trim() && (
        <a
          className="lit-external"
          href={`https://europepmc.org/search?${new URLSearchParams({ query: phrase })}`}
          target="_blank"
          rel="noreferrer"
        >
          {tr('Sorguyu Europe PMC’de aç')} <ArrowUpRight size={12} />
        </a>
      )}
    </details>
  );
}
