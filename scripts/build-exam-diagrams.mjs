import { mkdirSync, writeFileSync } from 'node:fs';
import { examVisuals } from '../src/content/exam/visuals.js';
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text = (x,y,s,size=17,fill='#44563c') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-family="Arial,sans-serif">${esc(s)}</text>`;
const box = (x,y,w,h,s,fill='#e6dcc1') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="#879477" stroke-width="1.5"/>${text(x+12,y+h/2+6,s,16)}`;
const line = (x1,y1,x2,y2,arrow=false,color='#667a55') => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="2" ${arrow?'marker-end="url(#arrow)"':''}/>`;
const mark = (x,y,n) => `<circle cx="${x}" cy="${y}" r="13" fill="#526d48"/>${text(x-4,y+5,n,14,'#fff')}`;
const drawings = {};
drawings['carpal-map'] = text(35,78,'RADIUS / BAŞPARMAK TARAFI',13)+text(520,78,'ULNA TARAFI',13)+text(290,40,'DİSTAL • PARMAKLARA',16)+
  [box(55,145,142,85,'Trapezium'),box(210,145,145,85,'Trapezoideum'),box(368,145,145,85,'Capitatum'),box(526,145,165,85,'Hamatum')].join('')+
  [box(95,260,165,85,'Scaphoideum','#e1e6d6'),box(278,260,165,85,'Lunatum','#e1e6d6'),box(460,260,165,85,'Triquetrum','#e1e6d6')].join('')+
  `<circle cx="605" cy="333" r="42" fill="#d2a797" stroke="#876f60" stroke-width="2"/>`+text(572,338,'Pisiforme',13)+
  line(125,140,70,100)+text(35,102,'I. metakarp',13)+line(280,140,280,100)+line(440,140,440,100)+line(600,140,600,100)+
  mark(115,278,1)+mark(298,278,2)+mark(480,278,3)+mark(636,307,4)+mark(75,163,5)+mark(230,163,6)+mark(388,163,7)+mark(546,163,8)+text(270,405,'PROKSİMAL • ÖNKOLA',16)+text(45,448,'Bloklar gerçek kemik biçimini göstermez. Palmar yerleşim haritası.',13);
drawings['distal-humerus'] = text(90,45,'ÖN YÜZ',19)+text(470,45,'ARKA YÜZ',19)+text(35,80,'LATERAL',12)+text(250,80,'MEDİAL',12)+text(410,80,'MEDİAL',12)+text(640,80,'LATERAL',12)+
  `<path d="M125 95L125 220Q90 240 85 290Q100 345 165 320L207 330Q275 350 280 290Q277 250 235 218L235 95" fill="#e6dcc1" stroke="#8b8c72" stroke-width="3"/>`+
  `<ellipse cx="139" cy="290" rx="28" ry="26" fill="#b5c4a4" stroke="#617453"/><path d="M190 270Q210 260 226 275L234 314Q210 330 183 310Z" fill="#b5c4a4" stroke="#617453"/>`+
  `<ellipse cx="140" cy="245" rx="19" ry="14" fill="#f8f4e9" stroke="#9d967f"/><ellipse cx="208" cy="238" rx="22" ry="16" fill="#f8f4e9" stroke="#9d967f"/>`+
  mark(100,315,1)+line(110,306,128,294)+mark(255,326,2)+line(245,316,221,300)+mark(82,220,3)+line(93,226,130,240)+mark(270,206,4)+line(260,213,225,230)+
  `<path d="M490 95L490 220Q455 240 450 290Q465 345 530 320L572 330Q640 350 645 290Q642 250 600 218L600 95" fill="#e6dcc1" stroke="#8b8c72" stroke-width="3"/><ellipse cx="550" cy="250" rx="37" ry="36" fill="#f8f4e9" stroke="#9d967f"/>`+
  mark(630,210,5)+line(619,216,577,237)+box(60,375,640,55,'6. Processus coronoideus ULNADADIR; humerusta fossa vardır.','#e5e9dc');
drawings['cuff-map'] = text(55,44,'ARKA YÜZ • POSTERIOR',17)+text(440,44,'ÖN YÜZ • KOSTAL',17)+
  `<path d="M80 100L300 90L280 145L160 350Z" fill="#e7ddc5" stroke="#859174" stroke-width="3"/><path d="M94 112L277 103L262 143L109 166Z" fill="#c4cfad"/><path d="M110 184L260 160L162 318Z" fill="#ca9e8c"/><path d="M275 167L293 180L181 334L173 318Z" fill="#ad8878"/><path d="M82 175L295 145" stroke="#617454" stroke-width="10" stroke-linecap="round"/>`+
  `<path d="M460 100L680 90L660 145L540 350Z" fill="#e7ddc5" stroke="#859174" stroke-width="3"/><path d="M478 119L657 112L639 151L542 322Z" fill="#c79e8a"/>`+
  mark(170,131,1)+mark(171,226,2)+mark(260,238,3)+line(249,243,224,265)+mark(550,210,4)+mark(48,181,5)+line(61,179,99,172)+
  text(50,399,'1–3 → tuberculum majus',16)+text(435,399,'4 → tuberculum minus',16)+text(50,442,'Sadeleştirilmiş başlangıç alanları; gerçek kas konturu ve ölçeği değildir.',13);
drawings['hyoid-map'] = text(50,50,'GRUP HARİTASI • TUTUNMA ÇİZGİLERİ DEĞİLDİR',16)+
  box(50,85,310,65,'Mylohyoideus','#e1e7d6')+box(395,85,310,65,'Geniohyoideus','#e1e7d6')+box(50,165,310,65,'Stylohyoideus','#e1e7d6')+box(395,165,310,65,'Digastricus','#e1e7d6')+
  mark(30,120,1)+box(270,250,220,45,'HYOID KEMİK','#e4d3ae')+mark(512,274,2)+
  box(50,315,310,55,'Sternohyoideus','#ead9cd')+box(395,315,310,55,'Omohyoideus','#ead9cd')+box(50,385,310,55,'Sternothyroideus','#ead9cd')+box(395,385,310,55,'Thyrohyoideus','#d4b3a0')+mark(30,343,3)+mark(690,412,4);
drawings['portal-map'] = box(35,70,300,65,'1. Organ kapillerleri','#e2e7d8')+box(50,180,270,60,'2. V. portae','#d9e1e9')+box(425,180,300,60,'3. A. hepatica propria','#e5bfb1')+
  box(210,285,350,65,'4. Karaciğer sinüzoidleri','#e5d7ba')+box(40,395,300,55,'5. Vv. hepaticae','#d9e1e9')+box(430,395,300,55,'6. V. cava inferior','#d9e1e9')+
  line(185,135,185,175,true)+line(185,240,290,280,true)+line(575,240,480,280,true)+line(310,350,200,390,true)+line(340,422,425,422,true)+text(415,95,'Aortadan arteriyel kan',15)+line(570,110,570,175,true,'#b78370')+text(35,33,'KAN AKIŞ YÖNLERİ • ORGAN KONUMU DEĞİLDİR',16);
drawings['cortex-map'] = text(35,43,'ANTERIOR / ÖN',16)+text(545,43,'POSTERIOR / ARKA',16)+
  `<path d="M95 270Q42 170 126 112Q205 49 335 76Q480 56 582 123Q692 179 663 281Q640 344 529 354L278 346Q148 361 95 270Z" fill="#e7dcc8" stroke="#78866b" stroke-width="3"/><path d="M300 90Q320 145 296 206L277 255L301 270L324 209Q349 147 328 84Z" fill="#c8917e"/><path d="M341 84Q365 150 337 212L318 270L345 268L363 216Q389 146 370 85Z" fill="#a5bd95"/><path d="M338 80Q365 144 333 210L310 273" fill="none" stroke="#556a49" stroke-width="5"/><path d="M151 275Q250 253 310 273Q391 283 488 267" fill="none" stroke="#6b795f" stroke-width="4"/><path d="M565 130Q535 233 567 335" fill="none" stroke="#b6ab91" stroke-width="2" stroke-dasharray="6 5"/>`+
  mark(430,74,1)+line(419,81,353,129)+mark(240,145,2)+line(252,147,304,153)+mark(438,153,3)+line(426,158,359,170)+mark(200,394,4)+line(207,381,231,267)+mark(630,232,5)+text(80,420,'Motor: oluğun önü',15)+text(350,420,'Somatik duyu: oluğun arkası',15)+text(80,450,'Bölgesel kavram haritası; birebir korteks konturu / alan sınırı değildir.',13);
mkdirSync('public/diagrams/exam', {recursive:true});
for (const [id,figure] of Object.entries(examVisuals)) {
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 480" width="760" height="480" role="img" aria-labelledby="title description"><title id="title">${esc(figure.title)}</title><desc id="description">${esc(figure.caption+' '+figure.labels.join(' '))}</desc><defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#667a55"/></marker></defs><rect width="760" height="480" fill="#f8f4e9"/>${drawings[id]}</svg>`;
 writeFileSync(`public/diagrams/exam/${id}.svg`,svg);
}
console.log('6 original exam teaching diagrams written.');
