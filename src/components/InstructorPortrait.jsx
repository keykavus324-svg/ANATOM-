import React, { useState } from 'react';
import { PROFILE_URL, INSTRUCTOR_PHOTO_URL } from '../data';

export default function InstructorPortrait() {
  const [failed, setFailed] = useState(false);
  return <figure className="instructor-portrait">
    <div className="instructor-portrait-frame">
      {failed
        ? <span className="instructor-portrait-fallback" role="img" aria-label="Bekir Dağdeviren — fotoğraf yüklenemedi">BD</span>
        : <img src={INSTRUCTOR_PHOTO_URL} alt="Öğr. Gör. Bekir Dağdeviren’in portresi" width="180" height="180" referrerPolicy="no-referrer" onError={() => setFailed(true)}/>}
    </div>
    <figcaption><span>FIRAT ÜNİVERSİTESİ</span><a href={PROFILE_URL} target="_blank" rel="noreferrer">{failed ? 'Fotoğrafı akademik profilde gör' : 'Fotoğraf: Akademik Bilgi Sistemi'}</a></figcaption>
  </figure>;
}
