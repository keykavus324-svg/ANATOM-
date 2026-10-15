import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, Brain, CheckCircle2, ClipboardCheck, ExternalLink, Globe2, Heart, Layers, Maximize2, RotateCcw, Search, ShieldCheck, X } from 'lucide-react';
import { externalQuizzes, quizCategories, QUIZ_SOURCE, filterExternalQuizzes, validQuizIds } from './quizCatalog';
import { notes } from './data';
import './quiz.css';

const icons = { general: BookOpen, skeleton: Layers, muscles: Layers, organs: Heart, surface: Layers, senses: Search, brain: Brain };
function useQuizStorage(key) {
  const [value, setValue] = useState(() => { try { return validQuizIds(JSON.parse(localStorage.getItem(key))); } catch { return []; } });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Quizzes work without device storage. */ } }, [key, value]);
  return [value, id => setValue(previous => previous.includes(id) ? previous.filter(x => x !== id) : [...previous, id])];
}
function QuizViewer({ quiz, onBack, saved, onSave, studied, onStudied, onLesson }) {
  const [started, setStarted] = useState(false);
  const [revision, setRevision] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const frame = useRef(null);
  const heading = useRef(null);
  const category = quizCategories.find(c => c.id === quiz.category);
  const note = notes.find(n => n.number === quiz.lesson);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    if (!started) return;
    setWaiting(true);
    const timer = setTimeout(() => setWaiting(false), 12000);
    return () => clearTimeout(timer);
  }, [started, revision]);
  return <section className="quiz-detail">
    <button className="text-button" onClick={onBack}><ArrowLeft size={16}/> Quiz kütüphanesine dön</button>
    <div className="quiz-detail-heading"><div><div className="eyebrow">{category.title.toLocaleUpperCase('tr-TR')} · {quiz.kind.toLocaleUpperCase('tr-TR')}</div><h1 ref={heading} tabIndex={-1}>{quiz.title}</h1><p><Globe2 size={14}/> İngilizce</p></div><button className={`quiz-save ${saved ? 'selected' : ''}`} aria-label={saved ? 'Quiz favorisini kaldır' : 'Quizi favorilere ekle'} aria-pressed={saved} onClick={onSave}><Bookmark size={19} fill={saved ? 'currentColor' : 'none'}/></button></div>
    <div className="quiz-workspace" ref={frame}>
      <div className="quiz-viewer-toolbar"><span><ClipboardCheck size={17}/> Soru alanı</span><div>{started && <><button className="text-button" onClick={() => setRevision(r => r + 1)}><RotateCcw size={14}/> Baştan aç</button><button className="text-button" onClick={() => frame.current?.requestFullscreen?.().catch(() => {})}><Maximize2 size={14}/> Tam ekran</button></>}<a className="text-button" href={quiz.url} target="_blank" rel="noopener noreferrer">Kaynakta aç <ExternalLink size={14}/></a></div></div>
      {!started ? <div className="quiz-consent"><div className="quiz-consent-icon"><Brain size={42}/></div><span className="eyebrow">HAZIRSAN BAŞLAYALIM</span><h2>Konuyu seçtin.<br/><em>Şimdi bilgini sına.</em></h2><p>Sorular ve cevap seçenekleri İngilizcedir. Kaynağın quiz motoru her soruyu kendi sayfasını yenileyerek açtığı için gömülü pencere yalnızca ilk soruyu önizler; soru geçişleri ve puan kaynak sayfada çalışır.</p><div className="quiz-consent-actions"><a className="primary-button" href={quiz.url} target="_blank" rel="noopener noreferrer">Quizi kaynağında çöz <ExternalLink size={16}/></a><button className="text-button" onClick={() => setStarted(true)}>Gömülü önizlemeyi başlat <ArrowRight size={15}/></button></div><small>Başlattığında harici siteyle bağlantı kurulur; kaynak sitenin çerez ve gizlilik koşulları geçerlidir.</small></div> : <><div className="quiz-frame-status" role="status">{waiting ? 'Kaynak siteye bağlanılıyor…' : 'Gömülü pencere yalnızca ilk soruyu gösterir; sonraki sorular kaynak sayfada açılır.'}</div><div className="quiz-frame-hint"><div className="quiz-frame-hint-copy"><strong><ShieldCheck size={15}/> Sorular bu pencerede ilerlemiyor mu?</strong><p>Bu bir arıza değil: yayıncının quiz motoru sonraki soruya geçerken kendi sayfasını baştan yükler; gömülü pencerede bu geçiş tarayıcı güvenliği gereği engellenir. Quizin tamamı ve puanın kaynak sayfada çalışır.</p></div><a className="primary-button" href={quiz.url} target="_blank" rel="noopener noreferrer">Quizi kaynağında çöz <ExternalLink size={15}/></a></div><div className="quiz-frame-viewport is-focused"><iframe key={`${quiz.id}-${revision}`} src={quiz.url} title={`${quiz.title} — quiz`} onLoad={() => setWaiting(false)} referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox" allow="fullscreen"/></div></>}
    </div>
    <p className="quiz-source-notice"><ShieldCheck size={16}/><span>Gömülü gösterim kaynak sitenin güvenlik politikasına bağlıdır. Quiz sonuçları kaynak pencerede gösterilir; ANATOMİ cevaplarını veya puanını okuyamaz ve otomatik kaydetmez.</span></p>
    <div className="quiz-study-footer"><div><h2>Çalışmanı tamamladın mı?</h2><p>“Çalıştım” kişisel bir işarettir; sınav başarısı veya puan değildir.</p></div><button className={`quiz-studied ${studied ? 'selected' : ''}`} onClick={onStudied} aria-pressed={studied}><CheckCircle2 size={17}/>{studied ? 'Çalıştım · işareti kaldır' : 'Çalıştım olarak işaretle'}</button></div>
    {note && <button className="quiz-lesson-link" onClick={() => onLesson(note)}><BookOpen size={20}/><span><small>KONUYU TEKRAR ET</small><strong>{note.title}</strong></span><ArrowRight size={18}/></button>}
    <details className="quiz-source-details"><summary>Bilgi ve kaynak</summary><a className="quiz-attribution" href={quiz.sourcePage} target="_blank" rel="noopener noreferrer">Kaynak ve diğer quizler: {QUIZ_SOURCE.name} <ExternalLink size={13}/></a></details>
  </section>;
}
export default function QuizPage({ selected, onSelect, onBack, onLesson, onPractice }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [kind, setKind] = useState('all');
  const [tab, setTab] = useState('all');
  const [saved, toggleSaved] = useQuizStorage('anatomi-external-quiz-saved');
  const [studied, toggleStudied] = useQuizStorage('anatomi-external-quiz-studied');
  const [lastId, setLastId] = useState(() => { try { return localStorage.getItem('anatomi-external-quiz-last') || ''; } catch { return ''; } });
  useEffect(() => { if (selected) { setLastId(selected.id); try { localStorage.setItem('anatomi-external-quiz-last', selected.id); } catch { /* Optional. */ } } }, [selected]);
  const results = filterExternalQuizzes({ query, category, kind, savedOnly: tab === 'saved', saved });
  const last = externalQuizzes.find(q => q.id === lastId);
  if (selected) return <QuizViewer key={selected.id} quiz={selected} onBack={onBack} saved={saved.includes(selected.id)} onSave={() => toggleSaved(selected.id)} studied={studied.includes(selected.id)} onStudied={() => toggleStudied(selected.id)} onLesson={onLesson}/>;
  return <section className="quiz-page" aria-labelledby="quiz-heading">
    <header className="quiz-hero"><div><div className="eyebrow"><span/> MERAKTAN HATIRLAMAYA</div><h1 id="quiz-heading">Bir yapı. Bir soru.<br/><em>Bir adım daha ileri.</em></h1><p>Anatomi quizleriyle bilgini tazele. Konunu seç, kaynak quizi aç ve tekrar ederek öğrendiklerini kalıcı hâle getir.</p><div className="quiz-hero-tags"><span><ClipboardCheck size={14}/>{externalQuizzes.length} quiz bağlantısı</span><span><Layers size={14}/>{quizCategories.length} konu alanı</span><span><Globe2 size={14}/>İngilizce quizler</span></div></div><div className="quiz-hero-art" aria-hidden="true"><div className="quiz-orbit"/><Brain size={100} strokeWidth={.8}/><span>REPETITIO EST MATER STUDIORUM</span><small>Tekrar, öğrenmenin temelidir.</small></div></header>
    <details className="quiz-source-details"><summary>Quizler hakkında</summary><div className="quiz-intro-note"><ShieldCheck size={19}/><p><strong>Türkçe rehber, özgün kaynak.</strong> Başlıklar ve gezinme Türkçe; quizler Free Anatomy Quiz’in kendi İngilizce arayüzünde açılır. Sorular veya görseller kopyalanmaz. Gömülü pencere açılmazsa quizi kaynağında çözebilirsin.</p></div></details>
    {last && <button className="quiz-resume" onClick={() => onSelect(last)}><RotateCcw size={19}/><span><small>SON AÇTIĞIN QUİZ</small><strong>{last.title}</strong><em>Yeniden aç · soru konumu saklanmaz</em></span><ArrowRight size={20}/></button>}
    <div className="quiz-section-title"><div><div className="eyebrow muted">ÇALIŞMA ALANINI SEÇ</div><h2>Anatomi Quizleri</h2></div><span>{studied.length} quiz “çalıştım” işaretli</span></div>
    <div className="quiz-category-grid">{quizCategories.map(c => { const Icon = icons[c.id]; return <button className={category === c.id ? 'active' : ''} key={c.id} aria-pressed={category === c.id} onClick={() => setCategory(previous => previous === c.id ? 'all' : c.id)}><span className={`quiz-category-icon ${c.id}`}><Icon size={22}/></span><strong>{c.title}</strong><p>{c.description}</p><span className="quiz-category-count">{externalQuizzes.filter(q => q.category === c.id).length} quiz <ArrowRight size={14}/></span></button>; })}</div>
    <div className="quiz-list-controls"><div className="quiz-tabs" aria-label="Quiz listesi"><button aria-pressed={tab === 'all'} onClick={() => setTab('all')}>Tüm quizler</button><button aria-pressed={tab === 'saved'} onClick={() => setTab('saved')}><Bookmark size={14}/> Favorilerim <span>{saved.length}</span></button></div><button className="text-button" onClick={() => { setCategory('all'); setKind('all'); setQuery(''); setTab('all'); }}>Filtreleri temizle</button></div>
    <div className="quiz-search-row"><div className="search-field"><Search size={18}/><input type="search" aria-label="Quizlerde ara" placeholder="Örn. kafatası, kalp, kas işlevleri…" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button aria-label="Quiz aramasını temizle" onClick={() => setQuery('')}><X size={16}/></button>}</div><select aria-label="Quiz türü" value={kind} onChange={e => setKind(e.target.value)}>{['all', 'Anatomi', 'Fizyoloji', 'Patoloji'].map(k => <option key={k} value={k}>{k === 'all' ? 'Tüm türler' : k}</option>)}</select></div>
    <div className="quiz-results-line"><span>{category === 'all' ? 'Tüm konu alanları' : quizCategories.find(c => c.id === category).title}</span><span role="status">{results.length} quiz listeleniyor</span></div>
    <div className="quiz-cards">{results.map(quiz => <article className="quiz-card" key={quiz.id}><div className="quiz-card-top"><span>{quizCategories.find(c => c.id === quiz.category).title}</span><button className={`quiz-save ${saved.includes(quiz.id) ? 'selected' : ''}`} aria-label={`${quiz.title}: ${saved.includes(quiz.id) ? 'favorilerden kaldır' : 'favorilere ekle'}`} aria-pressed={saved.includes(quiz.id)} onClick={() => toggleSaved(quiz.id)}><Bookmark size={17} fill={saved.includes(quiz.id) ? 'currentColor' : 'none'}/></button></div><h3><button onClick={() => onSelect(quiz)}>{quiz.title}</button></h3><div className="quiz-card-meta"><span>{quiz.kind}</span><span>EN</span>{studied.includes(quiz.id) && <span className="quiz-done"><CheckCircle2 size={13}/> Çalıştım</span>}</div><button className="quiz-card-start" onClick={() => onSelect(quiz)}>Quizi aç <ArrowRight size={16}/></button></article>)}</div>
    {!results.length && <div className="empty-state"><Search size={32}/><h3>{tab === 'saved' ? 'Bu filtrelerde favori quiz yok.' : 'Bu aramada quiz bulamadık.'}</h3><p>Başka bir terim dene veya filtreleri temizle. Yer imiyle quizleri favorilerine ekleyebilirsin.</p><button className="primary-button" onClick={() => { setQuery(''); setCategory('all'); setKind('all'); setTab('all'); }}>Tüm quizleri göster</button></div>}
    <div className="quiz-native-band"><div><h2>Türkçe sorularla çalışmak ister misin?</h2><p>Yerel soru bankası, görsel alıştırmalar ve süreli denemeler “Kendini sına” bölümünde.</p></div><button className="primary-button" onClick={onPractice}>Kendini sına <ArrowRight size={16}/></button></div>
    <details className="quiz-source-details"><summary>Bilgi ve kaynak</summary><a className="quiz-attribution" href={QUIZ_SOURCE.url} target="_blank" rel="noopener noreferrer">Quiz kaynağı: {QUIZ_SOURCE.name} <ExternalLink size={13}/></a><p className="quiz-device-note">Favorilerin ve “çalıştım” işaretlerin yalnızca bu tarayıcıda saklanır. Kaynak siteyle resmî iş birliği veya onay iddiası yoktur.</p></details>
  </section>;
}
