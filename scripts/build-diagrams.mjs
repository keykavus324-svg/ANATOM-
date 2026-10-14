// Hand-authored SVG geometry, reproducible without network or image-generation services.
// These are educational relationship schematics, not clinical anatomical plates.
import { mkdirSync, writeFileSync } from 'node:fs';
import { diagrams } from '../src/content/diagrams.js';
const directory = new URL('../public/diagrams/', import.meta.url);
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
shapes.planes=()=>{
 const body=path('M354 84C340 65 347 40 367 40C389 40 396 66 380 84L382 102C405 108 420 116 427 143L454 215L441 222L407 163L408 246L419 371L400 373L374 274L366 274L344 373L325 371L335 246L337 163L303 222L290 215L316 143C323 118 341 107 354 102Z','url(#bone)');
 return body+path('M269 104L438 89L441 328L270 344Z',sage,ink,1,'opacity=".35"')+path('M368 91L428 121L428 360L368 332Z',rose,ink,1,'opacity=".38"')+path('M266 237L379 200L478 237L369 276Z',blue,ink,1,'opacity=".53"')+pin(1,538,122,405,153)+pin(2,207,132,299,149)+pin(3,552,280,443,245)+text(377,406,'ANTERIOR / ÖN');
};
shapes.cavities=()=>path('M301 97C266 62 294 32 332 36C364 40 371 67 365 93L376 108L361 112L360 135C406 167 432 230 424 285C422 322 441 361 428 399L299 399C287 355 290 314 280 276C269 236 284 186 304 150Z','url(#bone)')+path('M311 55C340 39 363 65 350 86C338 102 310 97 301 81Z',sage)+path('M302 104C301 170 286 232 303 289L312 362L327 360L317 282C301 224 321 156 317 112Z',blue)+path('M331 148C374 159 407 211 406 253C378 239 351 235 327 245Z',rose)+path('M327 267C352 256 379 260 408 274L419 367C386 391 345 386 330 366Z',sage)+path('M325 253Q365 229 411 267','none',ink,5)+pin(1,205,63,325,72)+pin(2,179,230,303,231)+pin(3,540,179,378,200)+pin(4,542,263,376,250)+pin(5,548,346,367,325);
shapes['long-bone']=()=>{
 let s=path('M324 52C286 53 278 93 300 124C317 146 316 170 316 209L316 268C316 301 304 321 294 341C277 375 304 410 333 404C354 400 363 399 388 404C420 411 443 380 427 350C409 319 405 299 405 267L405 204C405 166 407 144 422 121C443 87 424 53 400 51C382 47 374 57 360 59C345 59 342 50 324 52Z','url(#bone)');
 s+=path('M339 126L382 126L383 328L339 328Z','#f2e6c8')+path('M327 60C304 62 294 88 307 111L344 140L379 140L411 109C427 79 403 50 381 66L353 68Z','url(#hatch)')+path('M338 314L386 314L415 358C428 385 402 397 380 388L348 388C315 401 294 378 309 356Z','url(#hatch)')+path('M298 72Q308 40 339 52Q357 62 378 53Q410 41 424 70','none',blue,9)+path('M302 387Q316 409 345 396Q360 391 385 398Q411 406 424 385','none',blue,9)+path('M410 152L414 306','none',sage,5);
 return s+pin(1,201,88,326,93)+pin(2,516,56,406,54)+pin(3,530,185,398,203)+pin(4,188,232,359,230)+pin(5,199,357,337,359)+pin(6,535,294,413,266);
};
shapes['growth-plate']=()=>{
 let s=rect(246,62,264,338,'#eee3cd',30)+rect(259,73,238,74,'#dae1ce',20)+rect(259,149,238,91,'#e1d5bd',3)+rect(259,241,238,83,'#d8b5a6',3)+rect(259,325,238,62,'url(#hatch)',4);
 for(let x=285;x<490;x+=43){s+=ellipse(x,104,9,8,sage);for(let y=163;y<229;y+=18)s+=ellipse(x,y,11,5,bone);s+=ellipse(x,264,14,16,rose)+ellipse(x,302,16,17,rose);}
 return s+pin(1,170,101,272,103)+pin(2,595,185,474,197)+pin(3,598,281,477,281)+pin(4,167,360,281,361)+arrow(549,118,549,363)+text(581,409,'METAFİZE DOĞRU');
};
shapes.synovial=()=>path('M319 44L414 44L414 125Q445 166 425 201Q367 225 306 201Q286 165 319 125Z','url(#bone)')+path('M307 256Q367 234 426 256Q444 293 413 324L413 410L320 410L320 324Q288 290 307 256Z','url(#bone)')+path('M309 95C251 149 254 191 269 230C248 272 261 330 309 356L425 356C472 312 483 273 463 230C482 184 463 123 426 95','none',ink,5)+path('M309 114C273 153 275 197 289 229C273 271 279 318 313 337M424 114C454 152 453 196 442 229C458 269 450 311 424 337','none',rose,4)+path('M303 201Q365 226 428 201','none',blue,10)+path('M304 253Q365 232 429 253','none',blue,10)+path('M301 219Q365 239 435 219L435 237Q364 220 301 237Z','#dce6dc','none')+path('M250 174Q241 232 253 291','none',sage,10)+pin(1,535,164,402,209)+pin(2,540,237,375,228)+pin(3,533,322,449,295)+pin(4,177,132,276,144)+pin(5,174,290,251,251);
shapes['joint-motion']=()=>rect(157,126,125,32,'url(#bone)')+rect(163,239,37,141,'url(#bone)')+ellipse(224,219,61,61,'url(#bone)')+ellipse(224,219,22,22,'#f9f5e9')+path('M232 108C319 127 343 209 299 285','none',rose,3,'marker-end="url(#arrow)"')+line(106,219,337,219,ink,1.4,'stroke-dasharray="6 5"')+rect(492,88,48,296,'url(#bone)')+ellipse(516,239,74,39,'none')+path('M444 245Q445 288 516 292Q582 290 589 245','none',sage,17)+path('M471 135C521 98 575 147 570 191','none',rose,3,'marker-end="url(#arrow)"')+line(516,58,516,408,ink,1.4,'stroke-dasharray="6 5"')+pin(1,116,351,176,307)+pin(2,651,277,581,262)+pin(3,369,74,516,75)+text(221,421,'GINGLYMUS')+text(515,421,'TROCHOIDEA');
shapes.forearm=()=>{
 const ulna=x=>path(`M${x} 104q-25 -39 -27 -12l-6 33q10 14 17 19l-3 187q-9 40 12 43q22 -3 7 -33l11 -218q-3 -19 -11 -19Z`,'url(#bone)');
 return ulna(291)+path('M226 111C213 98 190 102 196 118L208 320L195 354Q210 378 239 357L224 319L218 125Z',sage)+ulna(548)+path('M476 112C463 99 442 104 449 120C453 191 532 227 564 316L558 355Q578 375 600 350L578 314C549 242 477 176 468 126Z',sage)+ellipse(211,107,15,6,sage)+ellipse(463,108,15,6,sage)+text(245,416,'SUPİNASYON')+text(522,416,'PRONASYON')+arrow(345,236,395,236)+pin(1,111,174,207,188)+pin(2,649,172,549,187)+pin(3,401,357,575,351)+text(372,64,'DİRSEK')+text(375,397,'EL BİLEĞİ');
};
shapes['foot-arch']=()=>path('M176 294Q177 243 223 252L272 284L276 328L202 342Q164 332 176 294Z','url(#bone)')+path('M229 220Q253 193 292 216L312 249L269 280L228 254Z','url(#bone)')+path('M308 243L351 249L359 276L313 288L280 278Z','url(#bone)')+path('M357 252L403 268L410 299L365 301L352 278Z','url(#bone)')+path('M410 277Q481 297 533 307L548 326L531 342Q477 319 409 310Z','url(#bone)')+path('M553 316L595 323L599 341L548 338Z','url(#bone)')+path('M602 325L629 329Q644 342 625 347L599 342Z','url(#bone)')+path('M208 350Q351 349 538 352','none',sage,7)+path('M196 349Q344 250 539 348','none',rose,1.8,'stroke-dasharray="6 6"')+line(125,369,665,369,ink,1)+pin(1,104,278,207,289)+pin(2,212,142,268,234)+pin(3,423,174,357,265)+pin(4,598,220,484,310)+pin(5,411,420,374,350);
shapes.skull=()=>{
 let s=path('M224 199C209 152 235 88 294 66C374 33 469 60 505 124C536 178 522 236 493 268L474 298L455 287L410 304L335 304L320 327L278 326L257 299L232 283L245 250L217 249L235 226Z','url(#bone)');
 s+=path('M224 199C213 145 251 88 303 67L328 158L307 201L259 216Z',sage)+path('M303 67C379 39 467 61 505 125L467 176L375 194L328 158Z','#e6d7b6')+path('M505 125C537 180 524 234 492 269L453 255L457 206L467 176Z',rose)+path('M338 205L379 190L459 204L453 254L408 270L367 247Z','#d7c4a2')+path('M308 202L328 158L375 194L338 228Z',blue)+path('M238 247L260 226L297 240L321 271L310 299L259 297L236 281Z','#ddc4b5')+path('M297 229L327 224L356 240L322 265L297 254Z',rose)+ellipse(264,224,22,18,'#a0a185')+ellipse(406,238,13,15,'#a0a185')+path('M289 312L338 318L391 295L422 270L437 280L421 331L389 363L295 364L271 344L272 324Z','url(#bone)');
 for(let x=281;x<323;x+=10)s+=line(x,286,x+2,299,ink,1)+line(x+3,319,x+3,333,ink,1);
 return s+pin(1,162,116,267,143)+pin(2,418,28,407,114)+pin(3,596,187,499,207)+pin(4,557,306,418,219)+pin(5,153,289,286,268)+pin(6,381,420,346,348)+pin(7,157,197,333,202)+text(227,409,'ÖN')+text(506,409,'ARKA');
};
shapes.spine=()=>{
 let s=''; const pts=[];
 for(let i=0;i<24;i++){const y=54+i*12;const x=354-23*Math.sin((i/23)*Math.PI*2.2);pts.push([x,y]);s+=rect(x,y,i<7?27:i<19?34:42,10,i<7?sage:i<19?bone:rose,3)+path(`M${x+32} ${y+2}l31 9l-31 -2`,bone,ink,1);}
 s+=path('M345 346L382 348L412 388L398 407L366 375Z',sage)+path('M398 406Q397 422 379 428','none',bone,8);
 return s+pin(1,224,87,345,89)+pin(2,522,195,375,191)+pin(3,223,309,365,315)+pin(4,521,360,380,371)+pin(5,527,422,391,421)+text(226,410,'ANTERIOR')+text(560,64,'POSTERIOR');
};
shapes['muscle-bundle']=()=>{
 let s=path('M103 212C142 174 151 113 212 96C263 135 270 287 218 326C149 310 140 255 103 243Z','url(#muscle)')+path('M77 218L106 211L107 245L77 239Z',bone)+ellipse(219,211,38,115,rose);
 for(let i=0;i<9;i++)s+=path(`M115 ${216+i*2}Q169 ${124+i*15} 212 ${122+i*20}`,'none','#8d6e59',1);
 for(let y=149;y<283;y+=25)s+=ellipse(218,y,13,10,bone);
 s+=path('M225 183L403 147L404 198L224 209Z',rose)+ellipse(406,172,20,29,rose)+path('M413 162L572 209L568 232L411 181Z',bone)+ellipse(574,221,11,15,bone)+path('M581 218L687 280L681 291L576 231Z',rose);
 for(let i=0;i<7;i++)s+=line(590+i*12,224+i*7,585+i*12,236+i*7,ink,2);
 return s+pin(1,107,114,157,194)+pin(2,383,78,363,180)+pin(3,578,122,527,207)+pin(4,650,359,640,261)+text(370,409,'BÜYÜTME SIRASI: KAS → DEMET → LİF → MİYOFİBRİL');
};
shapes.antagonists=()=>{
 let s=path('M266 87Q245 81 242 102L247 279Q241 302 264 306L285 299L276 111Q284 91 266 87Z','url(#bone)')+path('M268 297Q291 289 309 305L535 260Q555 270 540 285L306 334Q278 342 261 319Z','url(#bone)')+path('M278 129Q341 190 284 263L279 310L267 312L266 263Q288 195 265 133Z','url(#muscle)')+path('M242 135Q196 199 241 271L250 304L259 302L249 271Q229 202 251 139Z',sage)+ellipse(268,306,12,12,bone)+rect(534,230,47,67,'#d5c6a8',5)+path('M365 285Q393 249 384 218','none',rose,3,'marker-end="url(#arrow)"')+arrow(556,303,556,369);
 return s+pin(1,382,132,300,194)+pin(2,138,197,229,206)+pin(3,160,366,268,307)+pin(4,654,245,555,260)+text(324,410,'AÇISAL HAREKET • DİRSEK');
};
shapes['heart-flow']=()=>{
 let s=rect(272,141,90,62,'#dce5df')+rect(272,237,90,67,'#cad9d6')+rect(406,141,90,62,'#e8d1c5')+rect(406,237,90,67,'#ddb5a9')+rect(304,37,160,51,'#e6ded0')+rect(291,371,188,51,'#e6ded0');
 s+=text(317,167,'Sağ')+text(317,186,'atrium')+text(317,261,'Sağ')+text(317,280,'ventrikül')+text(451,166,'Sol')+text(451,186,'atrium')+text(451,261,'Sol')+text(451,280,'ventrikül')+text(384,68,'AKCİĞER')+text(385,402,'DOKULAR');
 s+=arrow(317,206,317,234,blue)+arrow(451,206,451,234,rose)+path('M272 269H225V62H300','none',blue,6,'marker-end="url(#arrow)"')+path('M468 62H538V169H500','none',rose,6,'marker-end="url(#arrow)"')+path('M496 272H568V395H483','none',rose,6,'marker-end="url(#arrow)"')+path('M287 395H197V170H267','none',blue,6,'marker-end="url(#arrow)"')+text(384,222,'KAPAKLAR','middle',11)+pin(1,123,212,305,221)+pin(2,622,67,481,62)+pin(3,648,215,460,221)+pin(4,129,385,208,395);
 return s;
};
shapes.aorta=()=>{
 let s=vessel('M280 266V204C280 124 464 127 464 213V344',rose,22)+vessel('M319 151L303 113L299 79',rose,12)+vessel('M303 112L238 99L201 72',rose,10)+vessel('M377 144V65',rose,12)+vessel('M426 163L474 104L530 89',rose,12)+vessel('M464 344L419 396M464 344L518 396',rose,14)+text(207,53,'Sağ subclavia','middle',13)+text(297,57,'Sağ carotis','middle',13)+text(375,45,'Sol carotis','middle',13)+text(548,66,'Sol subclavia','middle',13);
 return s+pin(1,175,164,309,130)+pin(2,371,101,378,108)+pin(3,590,143,471,106)+pin(4,599,289,464,291)+pin(5,605,405,498,377)+text(226,329,'SAĞ')+text(570,329,'SOL');
};
shapes['digestive-tract']=()=>{
 let s=vessel('M359 38L359 107Q364 125 389 129',bone,18)+path('M389 129C414 126 421 94 453 117C489 147 476 195 435 203C410 209 392 198 369 196L355 210L336 202Q345 163 383 170Q403 172 389 129Z','url(#muscle)');
 s+=vessel('M344 201C301 200 301 244 342 246L371 246',bone,14)+vessel('M371 246C427 246 465 263 411 277L334 277C285 277 291 301 345 301L412 301C460 301 451 326 410 326L345 326C297 326 297 349 344 348L406 348C438 348 430 370 396 371L313 350L282 355',bone,15);
 s+=vessel('M282 360L282 237Q282 209 311 211L487 215Q513 216 513 244L513 339Q514 363 474 367Q423 370 416 399L402 422',sage,27)+vessel('M280 368Q262 389 249 386',rose,6);
 return s+pin(1,205,68,359,83)+pin(2,575,127,445,163)+pin(3,205,185,320,219)+pin(4,609,300,410,302)+pin(5,179,363,284,355)+pin(6,610,214,509,230)+pin(7,545,422,411,403);
};
shapes.tooth=()=>{
 let s=path('M250 154L286 203L310 376L358 404L406 376L432 203L472 154L474 410L243 410Z','url(#hatch)')+path('M286 154C264 127 262 70 290 58C316 43 335 62 358 62C381 62 405 41 425 61C451 86 440 128 432 154L409 225L378 384Q366 405 357 381L324 233Z','#f5eedb')+path('M300 145C283 116 284 76 306 75L358 88L411 75C431 84 423 122 415 145L393 223L366 369L341 225Z','#dfc78f')+path('M335 130Q359 103 384 130L376 212L362 350L356 349L347 211Z',rose)+path('M244 172Q271 158 300 174M415 173Q445 157 474 174','none',rose,13)+path('M312 201L339 310L356 386M411 201L392 312L371 386','none',sage,4)+vessel('M360 395L361 340L358 191',rose,3);
 return s+pin(1,169,65,296,67)+pin(2,547,130,400,112)+pin(3,167,210,360,159)+pin(4,556,277,397,275)+pin(5,551,401,362,387)+text(356,438,'ALVEOL KEMİĞİ İÇİNDE TEK KÖK');
};
shapes.villus=()=>{
 let s=path('M225 387L268 350L279 171C281 99 311 53 369 49C425 47 459 106 462 169L472 350L513 387Z','url(#bone)')+path('M242 385L284 352L296 172C298 109 321 68 369 65C411 64 443 111 445 173L455 351L491 385','none',rose,12)+vessel('M314 384L320 177C321 107 408 104 419 168L427 384',rose,6)+vessel('M332 379L336 175C337 133 394 132 404 172L410 379',blue,5)+vessel('M368 386L368 149',sage,12)+ellipse(368,143,6,11,sage);
 for(let y=182;y<348;y+=32)s+=path(`M322 ${y}Q363 ${y-22} 422 ${y+8}`,'none',rose,3);
 return s+pin(1,185,120,287,161)+pin(2,575,188,413,194)+pin(3,578,302,368,278)+pin(4,183,366,285,370)+text(368,423,'BAĞIRSAK DUVARINA');
};
shapes.portal=()=>{
 let s=path('M324 77Q386 40 482 81L526 118Q502 158 435 162L314 150Q300 109 324 77Z','url(#muscle)')+path('M423 80L413 148','none',ink,1.5)+ellipse(174,192,34,54,rose)+rect(280,298,218,85,'#e8dcc2',22);
 for(let i=0;i<4;i++)s+=path(`M301 ${313+i*17}Q390 ${298+i*17} 479 ${315+i*17}`,'none',rose,4);
 s+=vessel('M380 298L380 231L397 167',blue,12)+vessel('M202 207L296 236L380 231',blue,10)+vessel('M327 297L296 236',blue,7)+vessel('M453 88L526 69L605 69L605 37',blue,11)+path('M348 123L394 91L471 128L368 136L428 104L481 125','none',blue,3)+arrow(391,217,396,179)+arrow(492,80,554,72);
 return s+pin(1,198,352,351,339)+pin(2,114,107,245,221)+pin(3,563,226,384,224)+pin(4,295,38,392,115)+pin(5,653,118,554,69)+text(613,29,'KALBE','middle',12)+text(169,270,'DALAK');
};
shapes.neuron=()=>{
 let s=path('M191 202C171 178 176 139 212 138L234 109L247 139C277 153 279 186 266 207L292 231L266 245C251 273 205 267 195 243L172 251Z','url(#muscle)')+ellipse(226,201,20,20,bone);
 const ds=['M197 161L153 115L137 86M153 115L112 122','M184 188L119 177L93 154M119 177L100 205','M200 246L155 290L144 324M155 290L115 282','M240 144L279 88L277 64M266 105L305 100'];
 s+=ds.map(d=>path(d,'none',ink,3)).join('')+path('M272 230Q350 215 418 233T598 228','none',rose,7);
 for(let i=0;i<5;i++)s+=rect(315+i*53,217+(i%2)*7,42,28,sage,12);
 s+=path('M598 228L633 183L663 172M634 184L637 151M599 229L659 229L680 206M657 229L681 249M598 229L631 283L667 291M631 283L633 315','none',ink,3)+arrow(345,180,535,180);
 return s+pin(1,95,61,153,115)+pin(2,194,367,226,201)+pin(3,400,363,412,231)+pin(4,427,103,404,237)+pin(5,668,365,633,282);
};
shapes['spinal-roots']=()=>{
 let s=ellipse(267,226,108,127,'url(#bone)')+path('M261 208C228 182 234 129 213 143C187 167 216 210 243 224C212 235 185 287 210 302C237 315 244 263 264 241L278 241C298 270 306 318 330 297C352 276 317 235 293 224C322 204 340 158 316 143C296 133 299 187 278 208Z',rose)+ellipse(271,226,5,5,'#f9f5e9');
 s+=vessel('M330 161Q377 106 425 152L505 226',sage,8)+ellipse(422,150,23,15,sage)+vessel('M330 287Q387 339 429 292L505 226',rose,8)+vessel('M505 226L561 226',bone,11)+vessel('M561 226L598 177L643 159M561 226L637 280',bone,10)+arrow(387,132,360,135)+arrow(371,316,409,308)+pin(1,468,58,422,150)+pin(2,436,395,420,301)+pin(3,580,365,529,226)+pin(4,667,93,598,177)+pin(5,102,221,244,222)+text(267,57,'POSTERIOR')+text(267,406,'ANTERIOR');
 return s;
};
shapes.meninges=()=>{
 let s=path('M174 101Q369 55 571 100L571 124Q368 80 174 124Z',bone)+path('M174 151Q369 116 571 152L571 160Q369 124 174 159Z',rose)+path('M174 162Q367 127 571 162L571 260Q530 210 490 259Q455 319 410 263Q377 211 332 261Q281 314 245 261Q210 217 174 270Z','#dde4d8')+path('M174 270Q211 217 245 261Q281 314 332 261Q377 211 410 263Q455 319 490 259Q530 210 571 260L571 371L174 371Z','#dfc8b8')+path('M174 270Q211 217 245 261Q281 314 332 261Q377 211 410 263Q455 319 490 259Q530 210 571 260','none',sage,5);
 for(let x=192;x<560;x+=33)s+=line(x,161,x+7,237,sage,1);
 return s+pin(1,99,81,262,99)+pin(2,654,147,501,152)+pin(3,654,214,448,198)+pin(4,102,256,235,249)+pin(5,653,358,463,332);
};
shapes['male-path']=()=>{
 let s=ellipse(212,331,41,57,'url(#bone)')+path('M218 269C272 280 270 376 234 394','none',sage,13)+vessel('M234 394Q285 408 285 362V117Q285 85 312 85H367L413 140L430 185',sage,8)+path('M470 86C502 57 538 77 532 106C558 128 518 153 472 147L446 169L430 185',rose)+rect(380,192,103,79,'#c6ceba',29)+vessel('M430 185L430 244',sage,7)+vessel('M430 206V365L541 398',bone,14)+ellipse(497,293,15,13,rose)+vessel('M496 307L469 333L430 333',rose,5)+arrow(315,86,348,86)+arrow(458,374,498,387);
 return s+pin(1,124,375,242,337)+pin(2,136,154,285,178)+pin(3,608,100,502,115)+pin(4,591,222,478,223)+pin(5,611,321,498,293)+pin(6,600,406,513,389)+text(198,241,'TEK TARAF');
};
shapes.uterus=()=>{
 let s=path('M296 145Q378 122 460 145L460 205Q448 243 416 278L403 315L403 350L354 350L354 315L341 280Q305 247 296 205Z','url(#muscle)')+path('M325 165Q378 150 433 165L426 212L388 278L388 335L368 335L368 278L332 212Z','#eee1c8')+path('M335 173Q378 161 423 173L411 214L378 270L345 214Z',rose)+path('M352 326L352 402L407 402L407 326','none',ink,3)+path('M362 344L362 397M397 344L397 397','none',rose,6)+vessel('M303 166C275 170 263 108 220 127Q191 139 184 190',rose,10)+vessel('M452 166C479 170 493 108 535 127Q564 139 571 190',rose,10)+ellipse(223,210,32,20,'url(#bone)')+ellipse(534,210,32,20,'url(#bone)');
 for(let i=0;i<5;i++)s+=path(`M184 185L${167+i*9} ${209+i%2*8}M571 185L${554+i*9} ${209+i%2*8}`,'none',rose,3);
 return s+pin(1,106,253,223,210)+pin(2,605,80,535,131)+pin(3,379,68,378,192)+pin(4,605,265,437,228)+pin(5,267,342,378,309)+pin(6,516,405,378,378);
};
shapes.airways=()=>{
 let s=path('M324 101C288 80 233 105 205 157C170 221 162 315 176 371Q248 402 329 359Z','url(#muscle)')+path('M415 102C455 83 504 113 535 174C560 225 576 324 567 370Q500 397 423 358L423 289Q475 271 428 232Z','url(#muscle)')+path('M191 242L322 242M233 160L325 326M529 162L428 329','none',ink,2)+vessel('M374 39L374 158L313 230M374 158L448 227',bone,18)+vessel('M325 216L272 166M313 230L261 258M313 230L280 323M448 227L486 179M448 227L490 316',bone,10);
 for(let y=53;y<151;y+=14)s+=path(`M362 ${y}Q374 ${y+7} 386 ${y}`,'none',ink,1.3);
 return s+pin(1,484,36,374,84)+pin(2,166,90,334,203)+pin(3,609,115,424,201)+pin(4,101,321,218,293)+pin(5,655,320,517,287)+text(247,430,'SAĞ • 3 LOB')+text(509,430,'SOL • 2 LOB');
};
shapes.alveolus=()=>{
 let s=path('M274 57L274 132C212 156 206 275 265 309Q337 354 410 307C469 262 459 168 398 132L398 57','url(#bone)',ink,3)+path('M294 57L294 142C242 170 231 254 277 290Q337 326 398 290C441 251 429 172 378 144L378 57','none',rose,3)+vessel('M198 207C172 339 272 393 410 357Q510 319 488 211',blue,22)+path('M198 258C204 358 306 381 410 357Q507 321 488 252','none',rose,13);
 s+=arrow(280,279,260,335,rose)+arrow(411,333,393,278,blue)+ellipse(266,350,14,8,rose)+ellipse(326,366,14,8,rose)+ellipse(457,329,11,8,rose)+text(254,306,'O₂','end',19)+text(432,311,'CO₂','start',19)+text(337,214,'ALVEOL HAVASI','middle',15);
 return s+pin(1,491,89,338,152)+pin(2,123,218,228,236)+pin(3,128,324,271,305)+pin(4,610,275,404,302)+pin(5,572,396,450,339);
};
shapes.diaphragm=()=>path('M257 80Q180 181 216 374L531 374Q568 181 491 80','none',ink,3)+path('M276 103Q237 163 247 258Q289 278 337 254L337 112Z','#dac6b9')+path('M407 112L407 253Q455 279 500 259Q509 165 471 103Z','#dac6b9')+path('M217 324Q279 202 372 306Q462 202 531 324','none',ink,2,'stroke-dasharray="7 6"')+path('M216 365Q284 288 373 359Q462 288 532 365','none',rose,8)+arrow(290,267,290,317)+arrow(457,267,457,317)+arrow(372,127,372,222)+pin(1,136,250,280,264)+pin(2,608,348,470,323)+pin(3,609,163,469,163)+pin(4,126,408,355,391)+text(374,59,'İNSPİRASYON');

const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(const [id,definition] of Object.entries(diagrams)){
 if(!shapes[id])throw Error(`Missing drawing: ${id}`);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 460" role="img" aria-labelledby="title description"><title id="title">${escape(definition.title)}</title><desc id="description">${escape(definition.caption+' '+definition.labels.map((l,i)=>`${i+1}. ${l.name}: ${l.text}`).join(' '))}</desc><defs><linearGradient id="bone" x2="1" y2=".5"><stop stop-color="#f5ecd5"/><stop offset=".5" stop-color="#ddc9a6"/><stop offset="1" stop-color="#eee1c5"/></linearGradient><linearGradient id="muscle" x2="1" y2=".6"><stop stop-color="#e5c9b6"/><stop offset=".6" stop-color="#c89989"/><stop offset="1" stop-color="#ddbdab"/></linearGradient><pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(17)"><rect width="10" height="10" fill="#e8dcc2"/><path d="M0 0V10M0 4L10 9" stroke="#a99e80" stroke-width=".6"/></pattern><pattern id="paper" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".45" fill="#8d8868" opacity=".11"/></pattern><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="${ink}" stroke-width="1.4"/></marker></defs><rect width="760" height="460" fill="#f7f1e3"/><rect width="760" height="460" fill="url(#paper)"/><path d="M20 47V20H47M713 20H740V47M20 413V440H47M713 440H740V413" fill="none" stroke="#c8c5ae" stroke-width="1"/><g>${shapes[id]()}</g></svg>`;
 writeFileSync(new URL(`${id}.svg`,directory),svg+'\n');
}
console.log(`Wrote ${Object.keys(diagrams).length} original instructional SVGs.`);
