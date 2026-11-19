// Europe PMC REST metadata only. Article links are derived from provider IDs, never remote HTML.
const text = (v) =>
  typeof v === 'string' ? v.replace(/[\r\n\t]+/g, ' ').trim() : '';
const sourceId = (v) =>
  typeof v === 'string' && /^[A-Z][A-Z0-9]{1,11}$/.test(v);
const recordId = (v) =>
  typeof v === 'string' && /^[\w.-]{1,100}$/.test(v) && v !== '.' && v !== '..';
export const paperUrl = (p) =>
  `https://europepmc.org/article/${p.source}/${p.paperId}`;
export function parsePaper(item) {
  const heading = text(item?.title),
    source = item?.source,
    paperId = item?.id;
  if (!heading || !sourceId(source) || !recordId(paperId)) return null;
  const authors = (
    Array.isArray(item.authorList?.author) ? item.authorList.author : []
  )
    .map((a) => text(a?.fullName) || text(a?.collectiveName))
    .filter(Boolean);
  const journal =
    text(item.journalInfo?.journal?.title) || text(item.journalTitle);
  const year = text(item.pubYear),
    doi = text(item.doi);
  return {
    id: `epmc/${source}/${paperId}`,
    kind: 'paper',
    source,
    paperId,
    heading,
    journal,
    year,
    doi,
    authors,
    lang: 'und',
    lesson: 'Europe PMC',
    text: [text(item.authorString) || authors.join(', '), journal, year]
      .filter(Boolean)
      .join(' · '),
    comment: '',
  };
}
export function validPaper(p) {
  return (
    p?.kind === 'paper' &&
    sourceId(p.source) &&
    recordId(p.paperId) &&
    p.id === `epmc/${p.source}/${p.paperId}` &&
    [
      'heading',
      'year',
      'journal',
      'doi',
      'text',
      'comment',
      'lang',
      'lesson',
    ].every((k) => typeof p[k] === 'string') &&
    Array.isArray(p.authors) &&
    p.authors.every((a) => typeof a === 'string')
  );
}
export function papersRIS(clips) {
  return (
    clips
      .filter(validPaper)
      .map((p) =>
        [
          p.journal ? 'TY  - JOUR' : 'TY  - GEN',
          `TI  - ${text(p.heading)}`,
          ...p.authors.map((a) => `AU  - ${text(a)}`),
          p.journal && `JO  - ${text(p.journal)}`,
          p.year && `PY  - ${text(p.year)}`,
          p.doi && `DO  - ${text(p.doi)}`,
          `UR  - ${paperUrl(p)}`,
          'ER  - ',
        ]
          .filter(Boolean)
          .join('\r\n'),
      )
      .join('\r\n\r\n') + '\r\n'
  );
}
