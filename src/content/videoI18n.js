// Video künyelerinin dile göre çözümlenmesi.
//
// Video başlığı ve Latince adı dersin kendi çevirisinden gelir; özet metni video
// kataloğunda üç dilde tutulur. Eksik çeviri Türkçe metne düşer, böylece hiçbir kart
// boş görünmez.
import { localizedNote } from './localizedContent.js';

export function lessonVideoIn(lang, video, note) {
  if (!video) return null;
  const summary = video.summary?.[lang] || video.summary?.tr || '';
  if (!note) {
    return {
      title: lang === 'en' ? 'Complete course' : lang === 'ar' ? 'المقرر الكامل' : 'Tam ders',
      latin: 'Cursus completus',
      summary,
    };
  }
  const meta = localizedNote(note, lang);
  return { title: meta.title, latin: meta.latin, summary };
}
