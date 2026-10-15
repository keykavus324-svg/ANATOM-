import React, { useEffect, useState } from 'react';
import { ArrowUpRight, BookOpen, FileText, Search, X, RotateCcw, ShieldCheck, FolderOpen } from 'lucide-react';
import { books, bookKinds, bookLanguages, filterBooks, languageLabel, BOOKS_FOLDER_URL } from './books';
import Dialog from './components/Dialog';
import './books.css';

const driveFileUrl = id => `https://drive.google.com/file/d/${id}/view`;
const drivePreviewUrl = id => `https://drive.google.com/file/d/${id}/preview`;

// Kitabı sayfadan ayrılmadan Google Drive önizlemesinde açar; dosya kopyalanmaz.
function BookViewer({ book, onClose }) {
  const [loaded, setLoaded] = useState(false);
  const [reload, setReload] = useState(0);
  useEffect(() => { setLoaded(false); }, [book.id, reload]);
  return <Dialog className="reader-dialog book-viewer" label={`${book.title} — PDF`} onClose={onClose}>
    <div className="reader">
      <header className="reader-header">
        <div className="reader-title"><span className="reader-icon"><BookOpen size={21}/></span><div><h2>{book.title}</h2><p>{book.detail ? `${book.detail} · ` : ''}{languageLabel(book.lang)} · <span>{book.kind}</span></p></div></div>
        <div className="reader-actions"><button className="icon-button" aria-label="Kitabı kapat" onClick={onClose}><X size={23}/></button></div>
      </header>
      <div className="reader-access"><span><ShieldCheck size={15}/> Yayıncısına ait özgün kitap · Google Drive üzerinden görüntülenir</span><a href={driveFileUrl(book.id)} target="_blank" rel="noreferrer">Drive’da aç <ArrowUpRight size={14}/></a></div>
      <div className="pdf-area">{!loaded && <div className="pdf-loading"><span className="spinner"/><p>Kitap hazırlanıyor…</p><small>Google Drive okuyucusuna bağlanılıyor.</small></div>}<iframe key={`${book.id}-${reload}`} src={drivePreviewUrl(book.id)} title={`${book.title} PDF`} allow="fullscreen" onLoad={() => setLoaded(true)}/></div>
      <div className="reader-help"><span>Belge açılmıyorsa Google hesabınızla giriş yapmanız veya dosya sahibinden erişim istemeniz gerekebilir.</span><button onClick={() => setReload(r => r + 1)}><RotateCcw size={13}/> Yenile</button></div>
    </div>
  </Dialog>;
}

export default function BooksPage() {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('all');
  const [kind, setKind] = useState('Tüm konular');
  const [viewing, setViewing] = useState(null);
  const results = filterBooks({ query, language, kind });
  const clear = () => { setQuery(''); setLanguage('all'); setKind('Tüm konular'); };

  return <section className="books-page" aria-labelledby="books-title">
    <div className="books-head">
      <div className="eyebrow muted"><span/> KAYNAK KİTAPLAR VE ATLASLAR</div>
      <h1 id="books-title">Anatomi kitap rafı</h1>
      <p className="books-intro">Atlaslar, ders kitapları ve nöroanatomi kaynakları. Her kitap kendi Google Drive dosyasından önizlenir; kitap ANATOMİ’ye kopyalanmaz ve sunucuya yüklenmez.</p>
      <div className="books-count"><strong>{books.length}</strong> kitap · <a href={BOOKS_FOLDER_URL} target="_blank" rel="noreferrer">Drive klasörünü aç <ArrowUpRight size={13}/></a></div>
    </div>

    <div className="books-tools">
      <div className="books-search">
        <Search size={18}/>
        <input type="search" placeholder="Kitap, yayın veya konu ara…" value={query} onChange={e => setQuery(e.target.value)} aria-label="Kitaplarda ara"/>
        {query && <button onClick={() => setQuery('')} aria-label="Aramayı temizle"><X size={16}/></button>}
      </div>
      <div className="books-filters">
        <div className="books-chips" role="group" aria-label="Dil">
          {bookLanguages.map(l => <button key={l.id} className={language === l.id ? 'active' : ''} aria-pressed={language === l.id} onClick={() => setLanguage(l.id)}>{l.label}</button>)}
        </div>
        <select value={kind} onChange={e => setKind(e.target.value)} aria-label="Konuya göre filtrele">
          {bookKinds.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
    </div>

    <p className="books-result-count" aria-live="polite">{results.length} kitap listeleniyor</p>

    {results.length > 0 ? <div className="books-grid">{results.map(book => <article className={`book-card lang-${book.lang}`} key={book.id}>
      <div className="book-spine" aria-hidden="true"><FolderOpen size={20}/><span>{book.lang === 'tr' ? 'TR' : 'EN'}</span></div>
      <div className="book-body">
        <div className="book-meta"><span>{book.kind}</span><span>{languageLabel(book.lang)}</span></div>
        <h3>{book.title}</h3>
        {book.detail && <p className="book-detail">{book.detail}</p>}
        <p className="book-original" title={book.original}>{book.original}</p>
        <div className="book-actions">
          <button className="book-open" onClick={() => setViewing(book)} aria-label={`${book.title}${book.detail ? ' ' + book.detail : ''}: PDF’yi aç`}><FileText size={14}/> PDF’yi aç</button>
          <a href={driveFileUrl(book.id)} target="_blank" rel="noreferrer" aria-label={`${book.title}: Drive’da aç`}>Drive’da aç <ArrowUpRight size={13}/></a>
        </div>
      </div>
    </article>)}</div> : <div className="books-empty">
      <Search size={32}/>
      <h3>Bu aramada kitap bulamadık.</h3>
      <p>Başka bir kelime dene veya filtreleri temizle.</p>
      <button className="primary-button" onClick={clear}>Filtreleri temizle</button>
    </div>}

    <p className="books-note"><ShieldCheck size={16}/> Bu kitaplar yayıncılarına ve yazarlarına aittir; ANATOMİ bağımsız bir öğrenci projesidir. Açılış, Drive’daki paylaşım izinlerine bağlıdır.</p>
    {viewing && <BookViewer book={viewing} onClose={() => setViewing(null)}/>}
  </section>;
}
