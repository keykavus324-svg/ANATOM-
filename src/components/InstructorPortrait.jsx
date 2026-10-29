import React, { useState } from 'react';
import { PROFILE_URL, INSTRUCTOR_PHOTO_URL } from '../data';
import { useI18n } from '../i18n.jsx';

export default function InstructorPortrait() {
  const { tr } = useI18n();
  const [failed, setFailed] = useState(false);
  return <figure className="instructor-portrait">
    <div className="instructor-portrait-frame">
      {failed
        ? <span className="instructor-portrait-fallback" role="img" aria-label={tr('Bekir Dağdeviren — fotoğraf yüklenemedi')}>BD</span>
        : <img src={INSTRUCTOR_PHOTO_URL} alt={tr('Öğr. Gör. Bekir Dağdeviren’in portresi')} width="180" height="180" referrerPolicy="no-referrer" onError={() => setFailed(true)}/>}
    </div>
    <figcaption><span>{tr('FIRAT ÜNİVERSİTESİ')}</span><a href={PROFILE_URL} target="_blank" rel="noreferrer">{failed ? tr('Fotoğrafı akademik profilde gör') : tr('Fotoğraf: Akademik Bilgi Sistemi')}</a></figcaption>
  </figure>;
}
