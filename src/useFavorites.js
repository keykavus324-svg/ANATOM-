import { useCallback, useEffect, useState } from 'react';

// Yıldızlanan terimler yalnız bu cihazda tutulur (backend yok).
const KEY = 'anatomi-favorites';

function read() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(raw) ? raw.filter(item => item && item.la) : [];
  } catch { return []; }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(read);
  useEffect(() => {
    const sync = () => setFavorites(read());
    window.addEventListener('anatomi-favorites', sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener('anatomi-favorites', sync); window.removeEventListener('storage', sync); };
  }, []);
  const toggleFavorite = useCallback(term => {
    setFavorites(current => {
      const exists = current.some(item => item.la === term.la);
      const next = exists ? current.filter(item => item.la !== term.la) : [...current, { la: term.la, tr: term.tr, en: term.en, lesson: term.lesson }];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode: session-only */ }
      window.dispatchEvent(new Event('anatomi-favorites'));
      return next;
    });
  }, []);
  const isFavorite = useCallback(la => favorites.some(item => item.la === la), [favorites]);
  return { favorites, toggleFavorite, isFavorite };
}
