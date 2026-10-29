// Plain-JavaScript language metadata, shared by the React provider and the tests.
export const LANGUAGES = [
  { code: 'tr', name: 'Türkçe', short: 'TR', dir: 'ltr', htmlLang: 'tr' },
  { code: 'en', name: 'English', short: 'EN', dir: 'ltr', htmlLang: 'en' },
  { code: 'ar', name: 'العربية', short: 'AR', dir: 'rtl', htmlLang: 'ar' },
];

export const DEFAULT_LANGUAGE = 'tr';
export const LANGUAGE_STORAGE_KEY = 'anatomi-language';

export function languageMeta(code) {
  return LANGUAGES.find(item => item.code === code) || LANGUAGES[0];
}
