import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Search, X, ExternalLink, RotateCcw, ArrowRight } from 'lucide-react';
import { books, bookPreviewUrl } from './books';
import { bookCollections } from './bookCollections';
import { normalize } from './data';
import './components/bookCollections.css';

function BookReader({ book, onClose }) {
  const ref = useRef(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; dialog.close(); };
  }, []);
  return <dialog ref={ref} className="book-reader-dialog" aria-label={`${book.title} — kitap okuyucu`} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <header><div><BookOpen size={22}/><h2>{book.title}</h2></div><button className="icon-button" aria-label="Kitap okuyucuyu kapat" onClick={onClose}><X size={23}/></button></header>
    <p className="book-reader-info">PDF’yi indirmeden bu pencerede okuyabilirsin. Büyük kitapların açılması zaman alabilir.</p>
    <iframe key={revision} src={bookPreviewUrl(book)} title={`${book.title} PDF`} allow="fullscreen"/>
    <footer><span>Önizleme açılmıyorsa kaynakta giriş veya erişim izni gerekebilir.</span><button className="text-button" onClick={() => setRevision(v => v + 1)}><RotateCcw size={15}/> Yenile</button><a className="text-button" href={`https://drive.google.com/file/d/${book.id}/view`} target="_blank" rel="noopener noreferrer">Kaynakta aç <ExternalLink size={15}/></a></footer>
  </dialog>;
}

export default function BooksPage() {
  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState('all');
  const [active, setActive] = useState(null);
  const results = books.filter(book => (collection === 'all' || book.collection === collection) && normalize(book.title).includes(normalize(query.trim())));
  return <section className="books-page" aria-labelledby="books-heading">
    <div className="eyebrow"><span/> AYRI BİR OKUMA KÜTÜPHANESİ</div><h1 id="books-heading">Anatomi <em>kitapları</em></h1><p className="hero-description">Atlaslar ve başvuru kitapları, ders notlarından ayrı bir yerde.<br/>Bir kitap seç; indirmeden, sitenin içindeki PDF okuyucuda okumaya başla.</p>
    <div className="search-row"><div className="search-field"><Search size={18}/><input type="search" aria-label="Kitaplarda ara" placeholder="Kitap veya atlas ara…" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button onClick={() => setQuery('')} aria-label="Kitap aramasını temizle"><X size={16}/></button>}</div></div>
    <div className="filters-row"><div className="category-filters" aria-label="Kitap koleksiyonları">{[{ id: 'all', title: 'Tüm kitaplar' }, ...bookCollections.filter(c => books.some(b => b.collection === c.id))].map(c => <button key={c.id} onClick={() => setCollection(c.id)} className={collection === c.id ? 'active' : ''} aria-pressed={collection === c.id}>{c.title}</button>)}</div><span className="result-count" role="status">{results.length} kitap</span></div>
    <div className="book-collections-grid">{results.map(book => <article className="book-collection-card" key={book.id}><div className="book-collection-top"><BookOpen size={26}/><span>PDF</span></div><span className="book-collection-provider">{bookCollections.find(c => c.id === book.collection)?.title}</span><h3>{book.title}</h3><button className="book-collection-open" onClick={() => setActive(book)} aria-label={`${book.title}: indirmeden oku`}>İndirmeden oku <ArrowRight size={17}/></button></article>)}</div>
    {!results.length && <div className="empty-state"><Search size={28}/><h3>Kitap bulunamadı.</h3><p>Arama sözcüğünü veya koleksiyon filtresini değiştir.</p><button className="text-button" onClick={() => { setQuery(''); setCollection('all'); }}>Filtreleri temizle</button></div>}
    <aside className="books-access-note"><h2>Erişim hakkında</h2><p>Kitaplar kopyalanmaz; Google Drive önizlemesiyle gösterilir. Önizleme desteği ve erişim izinleri dosya sahibine bağlıdır. Materyallerin hakları ilgili hak sahiplerine aittir.</p><p>Diğer Drive arşivi ve MEGA koleksiyonundaki dosyalar listelenemediği için henüz okuyucuya eklenmedi. RAR arşivleri PDF okuyucuda açılamaz.</p>{bookCollections.filter(c => !books.some(b => b.collection === c.id)).map(c => <a className="text-button" key={c.id} href={c.url} target="_blank" rel="noopener noreferrer">{c.title} — kaynağı aç <ExternalLink size={14}/></a>)}</aside>
    {active && <BookReader book={active} onClose={() => setActive(null)}/>}
  </section>;
}
