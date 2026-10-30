// Translation packs.
//
// The Turkish site is the default and needs none of the English or Arabic texts, so
// each language's content is a separate chunk that is downloaded only when that
// language is chosen. The content helpers (lessonI18n, quizI18n, examI18n, ...) read
// the cached pack synchronously; the language provider waits for loadTranslationPack
// before rendering a language, so no screen is drawn half-translated.
const loaders = {
  en: () => import('./en.js'),
  ar: () => import('./ar.js'),
};

const cache = {};

export function translationPack(lang) {
  return cache[lang] || null;
}

// Turkish is the source text itself, so it is always ready.
export function isTranslationReady(lang) {
  return lang === 'tr' || !loaders[lang] || Boolean(cache[lang]);
}

export function loadTranslationPack(lang) {
  if (!loaders[lang]) return Promise.resolve(null);
  if (cache[lang]) return Promise.resolve(cache[lang]);
  return loaders[lang]().then(module => {
    cache[lang] = module.default;
    return cache[lang];
  });
}
