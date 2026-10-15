// 3D Anatomi Atlası — ZygoteBody gömülü görünümü için sahne kataloğu.
//
// Bu dosya yalnızca veri ve adres üretimi içerir; 3B model barındırmaz.
// ZygoteBody (eski adıyla Google Body) kendi resmî "Embed" yöntemiyle iframe
// içinde ücretsiz çalışır. Görünümler uygulamanın kendi URL (hash) durumunu
// kullanır:  nav=  kamera konumu,  sel=  seçim/vurgu,  layers=  katman opaklığı.
//
// `source: 'zygote'` ile işaretli sahnelerin bağlantıları doğrulanmış, kamuya
// açık paylaşılmış derin bağlantılardır (organı izole edip diğer katmanları
// soldurur). `source: 'view'` sahneleri yalnızca kamerayı konumlandırır;
// katman denetimi gömülü ZygoteBody arayüzünden yapılır.

// Gömülü görüntüleyicinin adresi ve atıf bilgisi.
// Arayüzde sağlayıcının marka adı gösterilmez; yalnızca hak sahibini belirten kısa
// telif satırı korunur. Teknik atıf (hangi ürün olduğu) depo belgelerinde tutulur.
export const ATLAS_SOURCE = {
  url: 'https://www.zygotebody.com/',
  termsUrl: 'https://www.zygotebody.com/terms',
  viewerLabel: 'Gömülü 3B atlas',
  credit: '3B anatomik model ve veriler © Zygote 3D.',
  licence: 'Gömülü görünüm, hak sahibinin ücretsiz iframe gömme yöntemiyle kendi sunucusundan açılır; modeller kopyalanmaz, yeniden barındırılmaz veya değiştirilmez.',
};

export const atlasGroups = [
  { id: 'views', label: 'Görünümler', hint: 'Bölgeye hızlı geçiş' },
  { id: 'systems', label: 'Sistemler', hint: 'Derslerle eşleşen görünümler' },
  { id: 'focus', label: 'Tek yapı odağı', hint: 'Yapıyı izole eden hazır bağlantılar' },
];

// ZygoteBody (Zygote 3D) hash parçaları — kamera/seçim/katman kodlaması -----------------------------------------------------------------
// Kamera: nav=x,y,z,0,0,0,0 — uygulamanın kendi ürettiği konumlardan alınmıştır.
const camera = (x, y, z) => `nav=${x},${y},${z},0,0,0,0&sel=p:;h:;s:;c:0;o:0`;
// Odak: bir veya birkaç varlığı seçer (s:), diğer katmanları soldurur (c/o).
const isolate = (ids, x, y, z, layers) =>
  `nav=${x},${y},${z},0,0,0,0&sel=p:;h:;s:${ids};c:-0.6;o:-0.75&layers=${layers}`;
// Tüm vücut: hash yok — ZygoteBody başlangıç görünümü.
const overview = '';

export const atlasScenes = [
  {
    id: 'tum-vucut', group: 'views', source: 'view', lesson: 1,
    title: 'Tüm vücut', latin: 'Corpus humanum',
    summary: 'Baştan ayağa bütün beden; oranları, yüzeyel işaret noktalarını ve kabaca sistem yerleşimini görürsün.',
    observe: 'Ayakta duruş (anatomik pozisyon) ile modelin duruşunu karşılaştır: avuç içleri öne, başparmak dışa bakar.',
    steps: [
      'Gömülü pencerede fare ile tıklayıp sürükleyerek modeli döndür, tekerlek ile yakınlaş.',
      'Sol taraftaki opaklık kaydırıcısını aşağı çektikçe deri, kas ve organ katmanları sırayla görünür olur.',
      'Kaydırıcının altındaki düğmeyle katmanları tek tek açıp kapatabilirsin.',
    ],
    hash: overview,
  },
  {
    id: 'bas-boyun', group: 'views', source: 'view', lesson: 5,
    title: 'Baş ve boyun', latin: 'Caput et collum',
    summary: 'Kafatası, boyun omurları ve boyun bölgesi yapılarına yakın bakış.',
    observe: 'Kafatasının beyin kutusu (neurocranium) ile yüz iskeleti (viscerocranium) arasındaki ağırlık farkını gör.',
    steps: [
      'Arama kutusuna `skull` veya `vertebra` yazarak ilgili yapıyı seç.',
      'Seçilen yapının adının altındaki `Zoom to` aracıyla görünümü o yapıya ortala.',
      '`Ctrl` (Mac’te `Cmd`) tuşuna basılı tutup tıklayarak görünümden çıkarmak istediğin yapıları gizle.',
    ],
    hash: camera('0.75', '126.89', '58.47'),
  },
  {
    id: 'gogus', group: 'views', source: 'view', lesson: 7,
    title: 'Göğüs boşluğu', latin: 'Cavitas thoracis',
    summary: 'Kalp, akciğerler, timus ve büyük damarların göğüs kafesi içindeki komşulukları.',
    observe: 'Kalbin göğüs kafesinde neden hafif sola ve öne yerleştiğini, akciğerlerin kalbe nasıl yer açtığını düşün.',
    steps: [
      'Opaklık kaydırıcısını kullanarak kaburgaları şeffaflaştır ve iç organları ortaya çıkar.',
      'Arama kutusuna `heart`, `lung`, `aorta` yazarak yapıları tek tek seç.',
      'Birden çok yapıyı birlikte görmek için seçimden sonra etiketteki raptiye (pin) simgesini kullan.',
    ],
    hash: camera('-4.65', '113.68', '119.59'),
  },
  {
    id: 'karin', group: 'views', source: 'view', lesson: 8,
    title: 'Karın boşluğu', latin: 'Cavitas abdominis',
    summary: 'Mide, karaciğer, bağırsaklar, böbrekler ve büyük damarların karın içi yerleşimi.',
    observe: 'Karaciğerin sağ üst kadranda büyük yer kaplaması ile midenin sola kayması arasındaki ilişkiyi kur.',
    steps: [
      'Katman denetiminden sindirim organları katmanını görünür yap.',
      'Arama kutusuna `liver`, `stomach`, `intestine`, `kidney` yazarak organları sırayla incele.',
      'Hazır izole görünümler için soldaki “Tek yapı odağı” listesini kullan.',
    ],
    hash: camera('-4.65', '125.08', '119.59'),
  },
  {
    id: 'iskelet', group: 'systems', source: 'zygote', lesson: 2,
    title: 'İskelet sistemi', latin: 'Systema skeletale',
    summary: 'Kemikler yalnız bırakılmış görünüm: gövde iskeleti, kemiklerin birbirine verdiği destek ve boşluklar.',
    observe: 'Uzun kemiklerin gövde ağırlığını nasıl taşıdığını, kaburga–sternum bağlantısının göğüs kafesini nasıl kapattığını izle.',
    steps: [
      'İskelet izole edilmiş gelir; diğer katmanlar soldurulmuştur.',
      'Arama kutusuna `femur`, `humerus`, `costa` gibi bir kemik adı yazıp `Zoom to` ile o kemiğe odaklan.',
      '`Ctrl`/`Cmd` + tıklama ile görünümden çıkarmak istediğin kemiği gizle, böylece altta kalan yapıyı rahatça gör.',
    ],
    hash: isolate('5', '-4.65', '110.1', '142.99', '0,0,6250,0,0,0,10000,10000,10000,10000,10000'),
  },
  {
    id: 'kaslar', group: 'systems', source: 'view', lesson: 6,
    title: 'Kas sistemi', latin: 'Systema musculare',
    summary: 'Yüzeyel ve derin kas gruplarının bedendeki dağılımı; kasların kemiğe tutunma noktaları.',
    observe: 'Aynı eklemi çevreleyen kasların karşıt (antagonist) dizilişini izle: biri çekerken diğeri gevşer.',
    steps: [
      'Sol panelde katman listesini açıp yalnızca kas katmanını görünür bırak.',
      'Arama kutusuna `biceps`, `deltoid`, `quadriceps` gibi terimler yazarak kası seç.',
      'Etiketteki seçim aracıyla kası sabitleyip kemikle olan ilişkisini birlikte gör.',
    ],
    hash: camera('-4.65', '110.1', '142.99'),
  },
  {
    id: 'sinir', group: 'systems', source: 'view', lesson: 9,
    title: 'Sinir sistemi', latin: 'Systema nervosum',
    summary: 'Merkezî sinir sistemi ile periferik sinir ve pleksusların gövde boyunca dağılımı.',
    observe: 'Omurilikten çıkan sinirlerin hedef bölgeye göre ayrıldığını, pleksusların bu yol ağının kavşakları olduğunu gör.',
    steps: [
      'Katman denetiminden sinir katmanını görünür yap; diğer katmanları kapatarak yolu tek başına izle.',
      'Arama kutusuna `brain`, `spinal cord`, `nerve` yazarak yapıları seç.',
      'Beyin ve omurilik için soldaki “Beyin” odak görünümüne geç.',
    ],
    hash: camera('1.46', '112.52', '99.98'),
  },
  {
    id: 'dolasim', group: 'systems', source: 'view', lesson: 7,
    title: 'Dolaşım sistemi', latin: 'Systema cardiovasculare',
    summary: 'Kalp, atardamarlar ve toplardamarlar; gövdede büyük damarların izlediği yol.',
    observe: 'Küçük (pulmoner) ve büyük (sistemik) dolaşımın kalpten çıkıp kalbe dönüş yollarını karşılaştır.',
    steps: [
      'Katman denetiminden dolaşım katmanını görünür yap.',
      'Arama kutusuna `heart`, `aorta`, `vena cava` yazarak yapıları sırayla seç.',
      'Kalbi tek başına incelemek için akciğer katmanını kapat, kalbi seçip etiketteki `Zoom to` aracını kullan.',
    ],
    hash: camera('-4.65', '112.5', '99'),
  },
  {
    id: 'sindirim', group: 'systems', source: 'view', lesson: 8,
    title: 'Sindirim sistemi', latin: 'Systema digestorium',
    summary: 'Ağızdan anüse kadar sindirim kanalı boyunca organların sırası ve yardımcı bezler.',
    observe: 'Kanal boyunca emilim yüzeyi için kıvrımların artışını ve karaciğer–pankreas bağlantısını izle.',
    steps: [
      'Katman denetiminden sindirim katmanını görünür yap.',
      'Arama kutusuna `stomach`, `duodenum`, `colon`, `pancreas` yazarak organları seç.',
      'Mide ve karaciğer için “Tek yapı odağı” görünümlerini kullan.',
    ],
    hash: camera('1.46', '112.52', '126.69'),
  },
  {
    id: 'urogenital', group: 'systems', source: 'view', lesson: 10,
    title: 'Ürogenital sistem', latin: 'Systema urogenitale',
    summary: 'Böbrekler, idrar yolları ve üreme organlarının pelvis içindeki komşulukları.',
    observe: 'Böbreklerin karın arkasına (retroperitoneal) yerleşimi ile üreterlerin mesaneye iniş yolunu izle.',
    steps: [
      'Katman denetiminden ilgili katmanı görünür yap.',
      'Arama kutusuna `kidney`, `ureter`, `bladder`, `uterus`, `prostate` yazarak yapıları seç.',
      'Sol üstteki model simgesinden kadın ve erkek model arasında geçiş yapıp karşılaştır.',
    ],
    hash: camera('-4.65', '105', '112'),
  },
  {
    id: 'lenfatik', group: 'systems', source: 'view', lesson: 7,
    title: 'Lenfatik sistem', latin: 'Systema lymphoideum',
    summary: 'Lenf damarları, düğümler ve lenfoid organların bedendeki dağılımı.',
    observe: 'Lenf düğümlerinin damar kavşaklarında ve eklem çevrelerinde toplanmasının nedenini düşün.',
    steps: [
      'Katman denetiminden lenfatik katmanı görünür yap.',
      'Arama kutusuna `lymph`, `node`, `spleen`, `thymus` yazarak yapıları seç.',
      'Dolaşım katmanıyla birlikte açarak iki sistemin komşuluğunu karşılaştır.',
    ],
    hash: camera('-4.65', '110.1', '152'),
  },
  {
    id: 'deri', group: 'systems', source: 'view', lesson: 1,
    title: 'Deri ve örtü sistemi', latin: 'Integumentum commune',
    summary: 'En dış katman: yüzeyel anatomi, işaret noktaları ve derinin altındaki yapıların görünürlüğü.',
    observe: 'Derinin şeffaflaştıkça hangi yüzeyel kemik çıkıntılarının ve kasların ele geldiğini not et.',
    steps: [
      'Opaklık kaydırıcısını en üstten başlatıp kademe kademe indir.',
      'Katman denetiminden yalnızca deri katmanını görünür bırakarak dış görünümü incele.',
      'Yüzeysel işaret noktalarını (clavicula, spina iliaca) arama kutusundan bularak doğrula.',
    ],
    hash: camera('-4.65', '110.1', '160'),
  },
  {
    id: 'kafatasi', group: 'focus', source: 'zygote', lesson: 5,
    title: 'Kafatası', latin: 'Cranium',
    summary: 'Kafatası yalnız bırakılmış görünüm: kemikler, suturalar ve boşluklar.',
    observe: 'Sutura adlarını kemiklerin komşuluğuna göre eşleştir: coronalis, sagittalis, lambdoidea.',
    steps: [
      'Görünüm kafatasını izole eder; diğer katmanlar soldurulmuş durumda gelir.',
      '`Ctrl`/`Cmd` + tıklama ile görmek istemediğin kemiği gizle.',
      'Göz çukuru ve burun boşluğu çevresindeki kemikleri tek tek seçerek karşılaştır.',
    ],
    hash: isolate('1059', '0.75', '126.89', '58.47', '0,1,6250'),
  },
  {
    id: 'beyin', group: 'focus', source: 'zygote', lesson: 9,
    title: 'Beyin', latin: 'Encephalon',
    summary: 'Beynin kafatası içindeki konumu ve loblarının yerleşimi.',
    observe: 'Kafatası boşluğunun şekli ile beynin lob yerleşiminin örtüştüğünü gör.',
    steps: [
      'Beyin izole edilmiş gelir; kafatası kemiklerini katman denetiminden geri açabilirsin.',
      'Arama kutusuna `cerebellum`, `brainstem`, `lobe` yazarak bölümleri tek tek seç.',
      'Modeli yukarıdan (üstten) görünüme çevirerek iki yarım küre simetrisini incele.',
    ],
    hash: isolate('1754', '1.46', '112.52', '99.98', '0,1,1250'),
  },
  {
    id: 'akcigerler', group: 'focus', source: 'zygote', lesson: 11,
    title: 'Akciğerler', latin: 'Pulmones',
    summary: 'İki akciğer izole edilmiş görünümde: loblar, fissürler ve kalbe komşuluk.',
    observe: 'Sağ akciğerin üç, sol akciğerin iki loblu olmasının kalp yerleşimiyle ilişkisini kur.',
    steps: [
      'Akciğerler izole edilmiş gelir; kalbi de görünür yaparak komşuluğu karşılaştır.',
      'Arama kutusuna `lobe`, `bronchus`, `fissure` yazarak bölümleri seç.',
      'Görünümü önden yan tarafa döndürerek fissürlerin seyrini izle.',
    ],
    hash: isolate('1175,1177', '-4.65', '113.68', '119.59', '0,0,5000,0,0,0,0,10000,10000,10000,10000'),
  },
  {
    id: 'karaciger', group: 'focus', source: 'zygote', lesson: 8,
    title: 'Karaciğer', latin: 'Hepar',
    summary: 'Karaciğer izole edilmiş görünümde; lobları ve komşu organlarla ilişkisi.',
    observe: 'Karaciğerin sol lobunun mide üzerine uzanmasını ve porta hepatis bölgesini bul.',
    steps: [
      'Karaciğer izole edilmiş gelir; mide ve safra yollarını katman denetiminden ekle.',
      'Arama kutusuna `hepatic`, `bile`, `gallbladder` yazarak yapıları seç.',
      'Organı alttan görünüme çevirerek porta hepatis’in yerini doğrula.',
    ],
    hash: isolate('1151', '-4.65', '125.08', '119.59', '0,0,5000,0,0,0,0,10000,10000,10000,10000'),
  },
  {
    id: 'mide', group: 'focus', source: 'zygote', lesson: 8,
    title: 'Mide', latin: 'Gaster',
    summary: 'Mide izole edilmiş görünümde; kardiya, fundus, korpus ve pilor bölümleri.',
    observe: 'Pilorun duodenuma açılan kısmının nerede olduğunu ve midenin sola uzanan fundusunu bul.',
    steps: [
      'Mide izole edilmiş gelir; karaciğer ve pankreası ekleyerek komşuluğu gör.',
      'Arama kutusuna `stomach`, `duodenum`, `esophagus` yazarak geçiş bölgelerini seç.',
      'Organın ön ve arka yüzünü döndürerek curvatura major ve minor’u karşılaştır.',
    ],
    hash: isolate('1225', '1.46', '112.52', '126.69', '0,1,5000'),
  },
  {
    id: 'kalp', group: 'focus', source: 'view', lesson: 7,
    title: 'Kalp', latin: 'Cor',
    summary: 'Kalbin göğüs boşluğundaki konumu; akciğerlerle komşuluğu ve büyük damar kökleri.',
    observe: 'Kalbin tepesinin (apex) sola ve aşağıya yönelmesini, tabanının (basis) yukarıda kalmasını izle.',
    steps: [
      'Arama kutusuna `heart` yaz, çıkan sonucu seç ve etiketteki `Zoom to` ile kalbe odaklan.',
      'Akciğer katmanını kapatarak kalbi tek başına incele; sonra geri açıp komşuluğu karşılaştır.',
      '`atrium`, `ventricle`, `valve` aramalarıyla odacıkları ve kapakları tek tek ortaya çıkar.',
    ],
    hash: camera('-4.65', '112.5', '99'),
  },
];

export const atlasSceneGroups = atlasGroups.map(group => ({
  ...group,
  scenes: atlasScenes.filter(scene => scene.group === group.id),
}));

export function findAtlasScene(id) {
  return atlasScenes.find(scene => scene.id === id) || null;
}

export const defaultAtlasScene = atlasScenes[0];

// Sahnelerin ZygoteBody adresi. Sahne yalnızca kamera konumlandırıyorsa hash boş kalır
// ve uygulama başlangıç görünümünü açar.
export function atlasUrl(scene = defaultAtlasScene) {
  return scene.hash ? `${ATLAS_SOURCE.url}#${scene.hash}` : ATLAS_SOURCE.url;
}

// Ders ↔ sahne eşleşmesi: ders sayfasından tek dokunuşla ilgili 3B görünüme geçilir.
const lessonScenes = {
  0: 'tum-vucut',
  1: 'tum-vucut',
  2: 'iskelet',
  3: 'iskelet',
  4: 'iskelet',
  5: 'kafatasi',
  6: 'kaslar',
  7: 'dolasim',
  8: 'sindirim',
  9: 'sinir',
  10: 'urogenital',
  11: 'akcigerler',
};

export function atlasSceneForLesson(number) {
  return findAtlasScene(lessonScenes[number]) || defaultAtlasScene;
}

export const atlasLessonSceneMap = lessonScenes;
