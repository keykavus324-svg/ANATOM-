import React from 'react';
import { BookOpen, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { bookCollections } from '../bookCollections';
import './bookCollections.css';

export default function BookCollections() {
  return <section className="book-collections" id="anatomi-kitaplari" aria-labelledby="book-collections-heading">
    <div className="section-heading"><div><div className="eyebrow muted">OKUMA ALANINI GENİŞLET</div><h2 id="book-collections-heading">Anatomi kitapları<span>{bookCollections.length}</span></h2><p>Kitap ve atlaslar için paylaşılan kaynak klasörlerini keşfet.</p></div></div>
    <div className="book-collections-grid">{bookCollections.map((collection, index) => <a className="book-collection-card" key={collection.id} href={collection.url} target="_blank" rel="noopener noreferrer" aria-label={`${collection.title} — ${collection.provider} klasörünü yeni sekmede aç`}>
      <div className="book-collection-top"><BookOpen size={25} aria-hidden="true"/><span>{String(index + 1).padStart(2, '0')}</span></div>
      <span className="book-collection-provider">{collection.provider} · Paylaşılan klasör</span><h3>{collection.title}</h3><span className="book-collection-open">Klasörü aç <ArrowUpRight size={17} aria-hidden="true"/></span>
    </a>)}</div>
    <p className="book-collections-note"><ShieldCheck size={17} aria-hidden="true"/><span>Bu bağlantılar ders notlarından bağımsız harici koleksiyonlardır. Dosyalar sitede barındırılmaz; içerik ve paylaşım izinleri kaynak sahiplerinin kontrolündedir. Erişim için giriş yapmanız veya izin istemeniz gerekebilir. Materyalleri yalnızca hak sahiplerinin izin verdiği koşullarda kullanın.</span></p>
  </section>;
}
