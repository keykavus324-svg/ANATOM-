import React, { useEffect, useRef, useState } from 'react';
import { Search, Star, CornerDownLeft } from 'lucide-react';
import { searchTerms } from '../content/terminology.js';
import { useFavorites } from '../useFavorites.js';
import { useI18n } from '../i18n.jsx';

// Latince–Türkçe anlık terim arama: i/ı, ş/s, ğ/g duyarsız eşleştirme ile
// hem clavicula hem köprücük yazımı aynı sonuca ulaşır.
export default function TermSearch({ onPick }) {
  const { tr } = useI18n();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const results = searchTerms(query);
  useEffect(() => {
    const close = event => { if (!box.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  return <div className="term-search" ref={box}>
    <Search size={14} aria-hidden="true"/>
    <input
      value={query}
      onChange={event => { setQuery(event.target.value); setOpen(true); }}
      onFocus={() => setOpen(true)}
      onKeyDown={event => {
        if (event.key === 'Escape') setOpen(false);
        if (event.key === 'Enter' && results[0]) { onPick(results[0]); setOpen(false); }
      }}
      placeholder={tr('Terim ara: clavicula / köprücük')}
      aria-label={tr('Latince veya Türkçe terim ara')}
      role="combobox" aria-expanded={open && results.length > 0} aria-autocomplete="list"
    />
    {open && query.trim().length >= 2 && <ul className="term-search-results" role="listbox">
      {results.length === 0 && <li className="term-search-empty">{tr('Eşleşen terim yok; yazımı dene.')}</li>}
      {results.map(term => <li key={term.la} role="option" aria-selected="false">
        <button onClick={() => { onPick(term); setOpen(false); }}>
          <strong>{term.la}</strong><span>{term.tr}</span><em>{tr('Ders {n}', { n: String(term.lesson).padStart(2, '0') })}</em>
        </button>
        <button className={`term-star ${isFavorite(term.la) ? 'is-fav' : ''}`} aria-label={isFavorite(term.la) ? tr('Tekrar listesinden çıkar') : tr('Tekrar listesine ekle')} onClick={() => toggleFavorite(term)}>
          <Star size={14} fill={isFavorite(term.la) ? 'currentColor' : 'none'}/>
        </button>
      </li>)}
    </ul>}
    <CornerDownLeft size={13} className="term-search-enter" aria-hidden="true"/>
  </div>;
}
