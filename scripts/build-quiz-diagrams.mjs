// Hand-authored SVG geometry for the native quiz figures, reproducible without
// network or image-generation services. Same editorial schematic language and
// palette as scripts/build-diagrams.mjs; separate output directory.
import { mkdirSync, writeFileSync } from 'node:fs';
import { quizDiagrams } from '../src/content/quizDiagrams.js';
const directory = new URL('../public/diagrams/quiz/', import.meta.url);
mkdirSync(directory, { recursive: true });
const ink='#666b55', sage='#a8b69a', rose='#cb9b91', bone='#e8dcc2', blue='#99adb2';
const path=(d,fill='none',stroke=ink,width=2,extra='')=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const ellipse=(x,y,rx,ry,fill=bone,stroke=ink)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const rect=(x,y,w,h,fill=bone,rx=12)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${ink}" stroke-width="1.7"/>`;
const line=(x1,y1,x2,y2,color=ink,width=1.6,extra='')=>path(`M${x1} ${y1}L${x2} ${y2}`,'none',color,width,extra);
const arrow=(x1,y1,x2,y2,color=ink)=>line(x1,y1,x2,y2,color,2.4,'marker-end="url(#arrow)"');
const text=(x,y,t,anchor='middle',size=15)=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Georgia,serif" font-size="${size}" fill="${ink}">${t}</text>`;
const pin=(n,x,y,tx,ty)=>`${line(x,y,tx,ty,ink,1,'stroke-dasharray="3 3"')}${ellipse(tx,ty,2.5,2.5,ink,ink)}<circle cx="${x}" cy="${y}" r="15" fill="#f9f5e9" stroke="${ink}" stroke-width="1.1"/>${text(x,y+5,n,'middle',15)}`;
const vessel=(d,color,width=10)=>path(d,'none',ink,width+3)+path(d,'none',color,width);

const shapes={};
shapes.vertebra=()=>{
 let s=text(380,58,'POSTERIOR')+text(380,438,'ANTERIOR');
 // Spinous process (posterior, top of image) and laminae around the foramen.
 s+=path('M352 250L408 250L398 150Q380 136 362 150Z','url(#bone)');
 s+=path('M300 238Q300 172 348 150L362 152L352 250Q318 252 300 238Z','url(#bone)')+path('M460 238Q460 172 412 150L398 152L408 250Q442 252 460 238Z','url(#bone)');
 // Superior articular facets beside the pedicles.
 s+=ellipse(303,236,15,26,sage)+ellipse(457,236,15,26,sage);
 // Transverse processes as wings.
 s+=path('M300 196C252 176 200 172 158 186C172 208 226 222 278 218Z','url(#bone)')+path('M460 196C508 176 560 172 602 186C588 208 534 222 482 218Z','url(#bone)');
 // Vertebral foramen (space) bounded by arch and body.
 s+=path('M314 246Q314 178 380 166Q446 178 446 246Q446 268 380 272Q314 268 314 246Z','#f3ecd9');
 // Body (anterior, bottom).
 s+=path('M262 276C262 254 300 268 380 268C460 268 498 254 498 276L492 330C470 368 420 388 380 388C340 388 290 368 268 330Z','url(#bone)');
 s+=path('M282 292Q380 314 478 292','none',ink,1.2,'stroke-dasharray="4 4"');
 return s+pin(1,148,330,300,318)+pin(2,622,132,408,204)+pin(3,104,182,206,196)+pin(4,636,268,452,240)+pin(5,135,88,370,172)+text(380,308,'CORPUS');
};
shapes.sarcomere=()=>{
 let s=text(380,66,'SARKOMER')+line(272,84,272,100,ink,1.4)+line(488,84,488,100,ink,1.4)+line(272,92,488,92,ink,1.4,'stroke-dasharray="5 5"');
 for(let y=138;y<=322;y+=26)s+=rect(262,y,14,13,'#cdbb97',4)+rect(484,y,14,13,'#cdbb97',4);
 s+=path('M348 132Q316 180 316 230Q316 280 348 328','none',sage,26)+path('M412 132Q444 180 444 230Q444 280 412 328','none',sage,26);
 for(let y=146;y<=316;y+=26)s+=line(276,y,332,y,rose,3.4)+line(484,y,428,y,rose,3.4);
 for(let y=172;y<=296;y+=62)s+=ellipse(330,y,5,9,rose,ink,0)+ellipse(430,y,5,9,rose,ink,0);
 s+=line(380,132,380,328,ink,1.6,'stroke-dasharray="6 5"')+text(380,352,'M ÇİZGİSİ','middle',13);
 
 return s+pin(1,176,110,262,144)+pin(2,168,300,300,250)+pin(3,606,142,420,196)+pin(4,560,86,462,92)+text(380,412,'İKİ Z ÇİZGİSİ ARASI = BİR SARKOMER','middle',13);
};
shapes.heart=()=>{
 let s=text(380,52,'İZLEYİCİNİN SOLU = KİŞİNİN SAĞI','middle',13);
 // Outer myocardium.
 s+=path('M366 96C312 66 226 78 196 148C168 214 196 300 262 348C312 384 448 384 498 348C564 300 592 214 564 148C534 78 448 66 394 96Q380 104 366 96Z','url(#muscle)');
 // Right side (viewer left): right atrium cavity + right ventricle cavity.
 s+=path('M242 132C206 142 188 172 194 204C198 228 216 244 240 250C246 262 258 268 272 266L286 258L282 148Q262 130 242 132Z','#f3ecd9');
 s+=path('M226 292C208 316 226 352 258 366C284 376 312 366 322 344C330 322 318 296 296 284Q260 272 226 292Z','#f3ecd9');
 // Left side (viewer right): left atrium + thick-walled left ventricle.
 s+=path('M502 136C540 148 556 180 548 210C542 234 520 248 498 250C488 240 470 238 458 244L450 154Q476 132 502 136Z','#f3ecd9');
 s+=path('M432 268C408 296 414 340 446 362C478 382 522 372 540 342C556 314 544 276 514 258Q470 244 432 268Z','#f3ecd9');
 // Interventricular septum.
 s+=path('M362 226L378 226L372 348Q356 350 344 342Z',sage,'none',0);
 s+=path('M366 222Q356 288 348 344','none',ink,2);
 // AV valves.
 s+=path('M282 262L292 288M302 262L296 288','none',ink,2.2)+ellipse(292,260,22,7,rose);
 s+=path('M444 258L452 284M462 256L458 282','none',ink,2.2)+ellipse(452,254,22,7,rose);
 // Aorta from left ventricle + pulmonary trunk from right ventricle.
 s+=vessel('M474 136C476 88 442 62 398 62',bone,20)+vessel('M300 142C296 100 330 78 366 84',bone,16);
 s+=ellipse(398,62,16,9,bone)+ellipse(368,84,13,8,bone);
 s+=text(470,84,'AORTA','start',13);
 s+=text(236,238,'TRİKÜSPİD','middle',0);
 return s+pin(1,116,150,238,190)+pin(2,110,268,282,272)+pin(3,648,148,500,192)+pin(4,664,330,498,312)+pin(5,240,44,382,62)+text(380,424,'ÖN KESİT • ŞEMA','middle',13);
};
shapes.nephron=()=>{
 // Glomerulus + Bowman capsule.
 let s=ellipse(258,128,52,52,'#f3ecd9',ink);
 s+=path('M258 100C236 106 226 128 236 148C244 162 264 166 278 156C292 146 294 124 282 112C272 102 264 100 258 100Z','none',rose,7);
 s+=path('M244 106C232 118 230 140 240 152','none',rose,7);
 s+=vessel('M258 76C258 58 236 52 220 58',rose,9)+vessel('M258 76C262 56 286 52 300 60',bone,9);
 // Proximal coiled tubule.
 s+=vessel('M302 122C344 96 372 138 336 160C310 176 316 204 352 198C378 194 384 220 356 234',bone,13);
 // Loop of Henle: down, hairpin, up.
 s+=vessel('M356 234C368 262 372 300 372 330C372 366 420 366 424 332C428 298 426 262 424 236',bone,13);
 // Distal coiled tubule.
 s+=vessel('M424 236C448 214 488 224 478 250C470 272 494 282 512 266',bone,13);
 // Collecting duct.
 s+=vessel('M512 266C536 300 548 336 552 392',bone,15);
 s+=arrow(300,158,318,150)+text(588,412,'PELVİS RENALİS','end',12);
 s+=text(258,196,'BOWMAN','middle',12)+text(258,214,'KAPSÜLÜ','middle',12);
 return s+pin(1,120,96,240,122)+pin(2,132,238,336,206)+pin(3,300,392,380,350)+pin(4,628,222,470,246)+pin(5,648,342,534,318);
};
shapes.eye=()=>{
 // Globe coats.
 let s=ellipse(400,232,148,146,'#f3ecd9',ink);
 s+=ellipse(400,232,140,138,'none','#c9bfa6',9);
 s+=ellipse(400,232,131,129,'none',rose,4);
 // Cornea bulge at left.
 s+=path('M258 158C214 184 214 280 258 306Q246 232 258 158Z',sage);
 s+=path('M262 162C224 188 224 276 262 302','none',ink,2.4);
 // Iris + lens + anterior chamber.
 s+=path('M264 172L296 204L296 260L264 292C250 260 250 204 264 172Z',rose);
 s+=ellipse(310,232,24,44,bone);
 s+=path('M296 204C302 218 302 246 296 260','none',ink,1.4,'stroke-dasharray="3 3"');
 // Retina inner line (stops at ora serrata).
 s+=path('M300 118C380 100 470 118 512 170','none','#8a9677',3)+path('M300 346C380 364 470 346 512 294','none','#8a9677',3);
 // Vitreous label + macula + optic nerve.
 s+=text(420,238,'VİTRÖZ','middle',13)+ellipse(494,238,10,7,'none',ink,0)+line(490,238,498,238,ink,1)+line(494,234,494,242,ink,1);
 s+=vessel('M546 236C586 238 620 242 648 244',bone,18)+path('M548 228C588 230 620 234 646 236','none',ink,1.2)+path('M548 244C588 246 620 250 646 252','none',ink,1.2);
 s+=ellipse(544,238,10,12,rose);
 s+=text(380,428,'ÖNDE','start',0);
 return s+pin(1,150,140,240,190)+pin(2,152,330,296,262)+pin(3,320,66,272,178)+pin(4,660,120,528,166)+pin(5,600,330,452,268)+pin(6,676,258,640,246)+text(258,400,'KORNEA • LENS • İRİS ÖNDE','middle',0);
};
shapes.ear=()=>{
 // Auricle + external canal.
 let s=path('M96 208C84 176 110 148 140 156C166 162 176 190 164 214C158 226 144 232 132 226C124 222 122 212 128 206','none',ink,2.6);
 s+=path('M150 214L292 214L292 258L150 258Z','#f3ecd9')+path('M150 214Q220 208 292 214','none',ink,1.2);
 // Tympanic membrane.
 s+=ellipse(296,236,7,30,rose);
 // Middle ear cavity + ossicles.
 s+=path('M304 160C348 148 396 156 408 184C418 210 416 262 400 288C384 310 336 314 312 300Q298 270 298 236Q298 186 304 160Z','#f3ecd9');
 s+=path('M312 208L332 236L330 258M348 226L364 244M352 224L372 242','none',ink,2.6)+ellipse(348,222,7,7,bone)+ellipse(372,240,6,6,bone);
 s+=path('M376 246L392 238M376 250L392 254','none',ink,2.6)+ellipse(388,246,9,9,'none',ink,1.6);
 s+=ellipse(404,246,6,8,rose);
 // Semicircular canals (three loops) + cochlea spiral.
 s+=path('M446 168C438 128 470 100 502 108C530 116 540 146 526 170C514 188 488 192 470 180','none',sage,9);
 s+=path('M470 180C452 196 452 220 470 232C488 242 508 234 514 218','none',sage,9)+path('M502 108C522 120 530 146 518 166','none',sage,9);
 s+=path('M470 330C452 302 462 268 494 260C522 254 546 272 546 298C546 326 522 344 498 338C478 332 468 314 474 296C480 280 498 276 508 286C516 294 512 308 500 310','none',rose,9);
 // Eustachian tube.
 s+=vessel('M330 300C316 336 300 364 286 388',bone,13);
 s+=text(150,430,'DIŞ')+text(352,430,'ORTA')+text(520,430,'İÇ');
 s+=line(288,404,288,414,ink,1,'stroke-dasharray="4 4"')+line(424,404,424,414,ink,1,'stroke-dasharray="4 4"');
 return s+pin(1,110,116,196,214)+pin(2,196,320,292,254)+pin(3,428,92,356,216)+pin(4,646,332,540,318)+pin(5,648,84,524,120)+pin(6,158,404,282,378);
};
shapes.brain=()=>{
 // Lobes as adjacent fills tiling the hemisphere (front left).
 let s=path('M158 278C142 206 178 112 268 84C316 68 366 62 408 74L392 168C332 176 302 212 292 252L284 318C224 310 172 300 158 278Z',sage);
 s+=path('M408 74C466 62 518 78 552 108L524 172L442 162L392 168Z',bone);
 s+=path('M552 108C596 144 616 200 602 250L562 288L508 264L524 172Z',blue);
 s+=path('M292 252C296 214 330 178 392 168L442 162C486 206 522 248 548 280L562 288C546 302 514 312 482 308C430 322 378 326 330 314C302 300 288 280 292 252Z',rose);
 // Outline + sulci + cerebellum + brainstem.
 s+=path('M158 278C142 206 178 112 268 84C316 68 366 62 408 74C466 62 518 78 552 108C596 144 616 200 602 250C596 272 584 284 562 288C546 316 514 334 482 308C430 322 378 326 330 314C262 310 190 304 158 278Z','none',ink,3);
 s+=line(414,70,388,164,ink,2)+path('M170 246C238 264 296 260 342 238','none',ink,2);
 s+=path('M498 306C540 300 574 314 578 338C580 360 552 378 516 374C488 370 470 352 474 332C477 318 486 308 498 306Z',rose);
 for(let y=318;y<368;y+=10)s+=path(`M486 ${y}Q530 ${y-6} 570 ${y+2}`,'none',ink,1);
 s+=vessel('M446 296C452 330 458 356 466 384',bone,20)+ellipse(454,336,15,17,bone);
 s+=text(122,408,'ÖN')+text(624,408,'ARKA');
 return s+pin(1,88,120,212,152)+pin(2,470,38,452,100)+pin(3,120,318,300,286)+pin(4,686,142,560,196)+pin(5,682,336,586,342)+pin(6,556,428,462,370);
};

const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(const [id,definition] of Object.entries(quizDiagrams)){
 if(!shapes[id])throw Error(`Missing drawing: ${id}`);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 460" role="img" aria-labelledby="title description"><title id="title">${escape(definition.title)}</title><desc id="description">${escape(definition.caption+' '+definition.labels.map((l,i)=>`${i+1}. ${l.name}: ${l.text}`).join(' '))}</desc><defs><linearGradient id="bone" x2="1" y2=".5"><stop stop-color="#f5ecd5"/><stop offset=".5" stop-color="#ddc9a6"/><stop offset="1" stop-color="#eee1c5"/></linearGradient><linearGradient id="muscle" x2="1" y2=".6"><stop stop-color="#e5c9b6"/><stop offset=".6" stop-color="#c89989"/><stop offset="1" stop-color="#ddbdab"/></linearGradient><pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(17)"><rect width="10" height="10" fill="#e8dcc2"/><path d="M0 0V10M0 4L10 9" stroke="#a99e80" stroke-width=".6"/></pattern><pattern id="paper" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".45" fill="#8d8868" opacity=".11"/></pattern><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="${ink}" stroke-width="1.4"/></marker></defs><rect width="760" height="460" fill="#f7f1e3"/><rect width="760" height="460" fill="url(#paper)"/><path d="M20 47V20H47M713 20H740V47M20 413V440H47M713 440H740V413" fill="none" stroke="#c8c5ae" stroke-width="1"/><g>${shapes[id]()}</g></svg>`;
 writeFileSync(new URL(`${id}.svg`,directory),svg+'\n');
}
console.log(`Wrote ${Object.keys(quizDiagrams).length} quiz figure SVGs.`);
