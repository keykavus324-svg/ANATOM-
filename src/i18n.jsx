import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translate } from './i18nPhrases.js';

// Interface languages live in a plain-JS module so tests can import them.
export { LANGUAGES, DEFAULT_LANGUAGE, languageMeta } from './i18nMeta.js';
import { LANGUAGES, DEFAULT_LANGUAGE, languageMeta, LANGUAGE_STORAGE_KEY as STORAGE_KEY } from './i18nMeta.js';
import { localizedNote, localizedNotes, localizedScene, localizedCategory } from './content/localizedContent.js';

function storedLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGUAGES.some(item => item.code === saved)) return saved;
  } catch { /* A stored preference is optional. */ }
  return null;
}

function browserLanguage() {
  try {
    const list = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
    for (const value of list) {
      const code = String(value).toLowerCase();
      if (code.startsWith('ar')) return 'ar';
      if (code.startsWith('tr')) return 'tr';
    }
  } catch { /* Older browsers may not expose navigator.languages. */ }
  return DEFAULT_LANGUAGE;
}

const I18nContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => storedLanguage() || browserLanguage());
  const meta = languageMeta(lang);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = meta.htmlLang;
    root.dir = meta.dir;
    root.classList.toggle('rtl', meta.dir === 'rtl');
    root.classList.toggle('lang-ar', lang === 'ar');
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* Preference is optional. */ }
  }, [lang, meta.dir, meta.htmlLang]);

  const setLang = useCallback(code => {
    if (LANGUAGES.some(item => item.code === code)) setLangState(code);
  }, []);
  const tr = useCallback((text, vars) => translate(lang, text, vars), [lang]);

  const value = useMemo(() => ({
    lang,
    dir: meta.dir,
    isRtl: meta.dir === 'rtl',
    language: meta,
    languages: LANGUAGES,
    setLang,
    tr,
    // Short helper for the few places that need the current language code.
    isTurkish: lang === 'tr',
  }), [lang, meta, setLang, tr]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

const fallback = {
  lang: DEFAULT_LANGUAGE,
  dir: 'ltr',
  isRtl: false,
  language: LANGUAGES[0],
  languages: LANGUAGES,
  setLang: () => {},
  tr: (text, vars) => translate(DEFAULT_LANGUAGE, text, vars),
  isTurkish: true,
};

export function useI18n() {
  return useContext(I18nContext) || fallback;
}

// Convenience hook: components get the localisation helpers without importing the
// dictionary, the language context and the metadata separately.
export function useLocalizedContent() {
  const { lang, isTurkish } = useI18n();
  return {
    lang,
    isTurkish,
    note: value => localizedNote(value, lang),
    notes: values => localizedNotes(values, lang),
    scene: value => localizedScene(value, lang),
    categoryLabel: value => localizedCategory(value, lang),
  };
}
