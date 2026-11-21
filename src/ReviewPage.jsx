import React from 'react';
import { ArrowRight, Star, StarOff } from 'lucide-react';
import { useFavorites } from './useFavorites.js';
import { useI18n } from './i18n.jsx';

// Yıldızlanan terimlerin toplandığı yerel tekrar listesi (localStorage).
export default function ReviewPage({ onLesson }) {
  const { tr } = useI18n();
  const { favorites, toggleFavorite } = useFavorites();
  return <div className="review-page">
    <div className="eyebrow"><span/> {tr('TEKRAR DEFTERİ')} <i>ANATOMİ</i></div>
    <h1>{tr('Tekrar Edilecekler')}</h1>
    <p className="review-intro">{tr('Terim kartlarındaki ve arama sonuçlarındaki yıldıza dokun; zorlandığın yapılar yalnız bu cihazda birikir.')}</p>
    {favorites.length === 0
      ? <div className="empty-state"><Star size={34}/><h3>{tr('Henüz yıldız yok.')}</h3><p>{tr('Bir dersin Terminologia Anatomica kartlarında yıldıza dokun, liste burada dolsun.')}</p></div>
      : <ul className="review-list">
        {favorites.map(term => <li key={term.la}>
          <div><strong>{term.la}</strong><span>{term.tr}</span>{term.en && <em>{term.en}</em>}</div>
          <div className="review-actions">
            <button onClick={() => onLesson(term.lesson)}>{tr('Ders {n}', { n: String(term.lesson).padStart(2, '0') })} <ArrowRight size={14}/></button>
            <button className="icon-button" aria-label={tr('Tekrar listesinden çıkar')} onClick={() => toggleFavorite(term)}><StarOff size={16}/></button>
          </div>
        </li>)}
      </ul>}
  </div>;
}
