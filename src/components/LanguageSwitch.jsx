import React from 'react';
import { Languages } from 'lucide-react';
import { useI18n } from '../i18n.jsx';

// Segmented language picker. The choice is remembered on the device, so a
// returning Arabic- or English-speaking student lands in the same language.
export default function LanguageSwitch({ compact = false }) {
  const { lang, languages, setLang, tr } = useI18n();
  return <div className={`language-switch ${compact ? 'compact' : ''}`} role="group" aria-label={tr('Site dili')}>
    {!compact && <span className="language-switch-label"><Languages size={14} aria-hidden="true"/>{tr('Dil')}</span>}
    <div className="language-switch-options">
      {languages.map(item => <button key={item.code} type="button" lang={item.htmlLang} dir={item.dir === 'rtl' ? 'rtl' : 'ltr'} className={lang === item.code ? 'active' : ''} aria-pressed={lang === item.code} onClick={() => setLang(item.code)} title={item.name}>
        <span className="lang-full">{compact ? item.short : item.name}</span><span className="lang-short">{item.short}</span>
      </button>)}
    </div>
  </div>;
}
