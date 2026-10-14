// Student-prepared, selected-topic study summaries based on text extracted from
// Bekir Dağdeviren's linked PDFs on 2026-10-14. NOT verbatim/full transcriptions.
// `source` names an actual source heading, not an invented page number.
const section = (id, title, source, content) => ({ id, title, source, ...content });
const table = (headers, rows) => ({ headers, rows });
export const lessons = {
  1: {
    subtitle: 'Bir beden. Ortak bir dil.',
    intro: 'Anatomiyi öğrenmenin ilk adımı, yapıları isimlendirmek kadar onların birbirleriyle ilişkilerini de anlayabilmektir. Anatomik duruş, düzlemler ve yön terimleri bu ortak dilin temelini oluşturur.',
    scope: 'Tanım, anatominin dalları, anatomik duruş, düzlemler, eksenler, yön ve hareket terimleri.',
    image: '/anatomy-torso.webp', imageAlt: 'Göğüs kafesi ve kasların atlas tarzında temsili çizimi',
    sections: [
      section('tanim', 'Anatomi neyi inceler?', 'ANATOMİNİN TANIMI', {
        paragraphs: ['Anatomi; insan vücudunun normal yapısını, biçimini, organlarını ve organların birbirleriyle ilişkilerini inceleyen bilim dalıdır. Bir yapının yalnızca adını bilmek yeterli değildir: nerede bulunduğu, hangi yapılara komşu olduğu ve vücudun bütünü içindeki yeri de önemlidir.', 'Ders notunda anatominin gelişimi Hipokrat, Aristo, Galen, Leonardo da Vinci, Andreas Vesalius ve İbni Sina gibi isimlerle ele alınır. Bu çalışma özetinin odağı ise anatomik tanımlamalarda kullanılan temel kavramlardır.'],
        callout: 'Önce konum, sonra ilişki: Bir organı tanımlarken “Nerede?” ve “Neye göre?” sorularını birlikte sor.'
      }),
      section('dallar', 'Aynı bedene farklı bakışlar', 'ANATOMİ ÇEŞİTLERİ / Anlatım şekli, öğrenim yöntemlerine göre anatomi alt grupları', {
        paragraphs: ['Anatominin dalları, inceleme ölçeğine ve kullanılan yaklaşıma göre farklılaşır. Sistematik yaklaşım bir organ sistemini bütün olarak ele alırken topografik yaklaşım aynı bölgedeki farklı sistemlere ait yapıları birlikte inceler.'],
        table: table(['Yaklaşım', 'İnceleme odağı'], [ ['Makroskopik anatomi', 'Çıplak gözle görülebilen yapılar; kadavra, model ve atlaslarla çalışma.'], ['Mikroskopik anatomi', 'Mikroskop altında hücreler ve dokular; sitoloji ve histoloji.'], ['Gelişim anatomisi', 'Zigot oluşumundan itibaren yaşam boyunca yapısal değişimler.'], ['Sistematik anatomi', 'İskelet, kas, dolaşım gibi sistemlerin organizasyonu.'], ['Topografik anatomi', 'Baş, önkol veya karın gibi belirli bölgelerin yapıları.'], ['Fonksiyonel anatomi', 'Yapı ile işlev arasındaki ilişki.'] ])
      }),
      section('durus', 'Referans noktası: anatomik duruş', 'Anatomik Duruş', {
        paragraphs: ['Yön ve yer tarifleri standart bir vücut pozisyonuna göre yapılır. Kişi ayakta dik durur; başı ve yüzü öne bakar. Kollar vücudun iki yanında, avuç içleri öne dönüktür. Ders notunda topukların bitişik olduğu duruş tarif edilir.'],
        bullets: ['Sağ ve sol, gözlemcinin değil incelenen kişinin sağı ve soludur.', 'Bir yapı öne, arkaya, içe veya dışa doğru tarif edilirken anatomik duruş esas alınır.', 'Örneğin önkolda radius lateral, ulna medial taraftadır.'],
        callout: 'Avuç içlerinin öne bakması küçük bir ayrıntı değildir; üst ekstremitenin yönlerini doğru okumayı sağlar.'
      }),
      section('duzlemler', 'Düzlemler ve eksenler', 'ANATOMİK DÜZLEMLER / VÜCUDUN ANA EKSENLERİ', {
        paragraphs: ['Düzlemler vücudu hayali kesitlere ayırır; eksenler ise hareketin etrafında gerçekleştiği hayali çizgilerdir. İkisini birbirine karıştırmadan öğrenmek hareket analizini kolaylaştırır.'],
        table: table(['Düzlem', 'Vücudu nasıl ayırır?'], [['Sagittal', 'Sağ ve sol bölümlere ayırır.'], ['Median (midsagittal)', 'Tam orta hattan geçerek sağ ve sol yarılara ayırır.'], ['Frontal (koronal)', 'Ön ve arka bölümlere ayırır.'], ['Transvers (horizontal)', 'Yere paralel geçerek üst ve alt bölümlere ayırır.']]),
        bullets: ['Sagittal eksen önden arkaya uzanır.', 'Transvers eksen sağdan sola uzanır.', 'Vertikal eksen yukarıdan aşağıya uzanır.']
      }),
      section('yonler', 'Yapıları birbirine göre tarif etmek', 'Yön Bildiren Terimler', {
        table: table(['Terim çifti', 'Anlamı ve örnek'], [['Superior / inferior', 'Üst / alt. Kalp, midenin superiorunda bulunur.'], ['Anterior / posterior', 'Ön / arka. Omurga, kalbin posteriorundadır.'], ['Medial / lateral', 'Orta hatta yakın / orta hattan uzak. Kulaklar gözlerin lateralindedir.'], ['Proksimal / distal', 'Uzvun başlangıcına yakın / uzak. El bileği, parmakların proksimalindedir.'], ['Superficialis / profundus', 'Yüzeyel / derin. Deri, kaslara göre yüzeyeldir.'], ['Dexter / sinister', 'Sağ / sol. Kişinin anatomik yönleri esas alınır.']]),
        callout: '“Medial” içte olmakla, “proksimal” ise uzvun başlangıcına yakın olmakla ilgilidir. Aynı anlamda kullanılmazlar.'
      }),
      section('hareket', 'Hareketin sözcükleri', 'HAREKETLERLE İLGİLİ TERİMLER', {
        table: table(['Hareket', 'Tanım'], [['Fleksiyon / ekstansiyon', 'Eklem açısının küçülmesi / büyümesi.'], ['Abduksiyon / adduksiyon', 'Orta hattan uzaklaşma / orta hatta yaklaşma.'], ['Rotasyon', 'Bir yapının uzun ekseni etrafında dönmesi.'], ['Sirkumdüksiyon', 'Fleksiyon, abduksiyon, ekstansiyon ve adduksiyonun birleştiği dairesel hareket.'], ['İnversiyon / eversiyon', 'Ayak tabanının içe / dışa döndürülmesi.']]),
        paragraphs: ['Terimleri yalnızca ezberlemek yerine, ilgili hareketi anatomik duruştan başlayarak düşün. Tam hareket görselleri ve Latince okunuş örnekleri için özgün PDF’ye dön.']
      })
    ],
    glossary: [['Anatomi', 'Vücudun yapısını ve yapılar arası ilişkileri inceleyen bilim.'], ['Planum', 'Düzlem.'], ['Axis', 'Eksen.'], ['Median', 'Tam orta hatta ait.']],
    review: [{ q: 'Frontal düzlem vücudu hangi bölümlere ayırır?', a: 'Ön ve arka bölümlere ayırır.' }, { q: 'El bileği parmaklara göre proksimal midir, distal midir?', a: 'Proksimaldir; uzvun başlangıcına daha yakındır.' }]
  },
  2: {
    subtitle: 'Desteğin ve hareketin mimarisi.',
    intro: 'Kemikler, eklemler ve kaslar birlikte hareket sistemini oluşturur. İskelet yalnızca bir taşıyıcı çerçeve değildir; koruma, mineral depolama ve kan hücresi üretimiyle de vücudun işleyişine katılır.',
    scope: 'Hareket sisteminin bileşenleri, kemik yapısı, kemik tipleri, yüzey terimleri ve iskeletin genel organizasyonu.',
    image: '/atlas/skeleton.webp', imageAlt: 'İnsan iskeletinin önden görünümünü betimleyen atlas tarzında çizim',
    sections: [
      section('bilesenler', 'Hareketin üç bileşeni', 'BU BÖLÜMDE NELER ÖĞRENECEĞİZ?', {
        paragraphs: ['Kemikler vücudun destek yapısını, eklemler kemikler arasındaki bağlantıları, kaslar ise kuvvet üreten yapıları oluşturur. Hareketi anlamak, bu üç unsuru tek bir sistem içinde değerlendirmeyi gerektirir.'],
        table: table(['Yapı', 'Latince tekil / çoğul'], [['Kemik', 'Os / ossa'], ['Eklem', 'Articulatio / articulationes'], ['Kas', 'Musculus / musculi']])
      }),
      section('gorev', 'Kemiğin görevleri', 'KEMİĞİN FONKSİYONLARI', {
        bullets: ['Destek: Vücuda biçim ve taşıyıcı bir çerçeve sağlar.', 'Koruma: Hayati yapılar için kemik bir koruma oluşturur.', 'Hareket: Kasların oluşturduğu kuvvetin iletilmesine katılır.', 'Mineral deposu: Kalsiyum ve fosfor gibi mineraller için rezervdir.', 'Kan hücresi üretimi: Kemik iliği kan hücrelerinin üretiminde görev alır.'],
        callout: 'Kemik, cansız bir taşıyıcı malzeme değil; metabolik işlevleri olan canlı bir dokudur.'
      }),
      section('yapi', 'Kompakt ve süngerimsi yapı', 'MORFOLOJİK OLARAK KEMİKLER İKİ KISIMDAN OLUŞUR', {
        paragraphs: ['Substantia compacta kemiğin yoğun ve sert dış bölümünü; substantia spongiosa ise içteki süngerimsi yapıyı tanımlar. Uzun kemiklerde gövde ve uçlar ayrıca adlandırılır.'],
        table: table(['Bölüm', 'Tanım'], [['Diaphysis', 'Uzun kemiğin gövdesi.'], ['Epiphysis', 'Uzun kemiğin uç bölümleri.'], ['Metaphysis', 'Gövde ile uç arasındaki geçiş bölgesi; büyüme çağında boyuna büyümeyle ilişkilidir.']])
      }),
      section('tipler', 'Kemikleri biçimlerine göre tanımak', 'Kemik tipleri', {
        table: table(['Tip', 'Özellik / örnek'], [['Ossa longa', 'Uzun kemikler; gövde ve iki uç içerir.'], ['Ossa brevia', 'Boyutları birbirine yakın kısa kemikler; el ve ayak bileği kemikleri.'], ['Ossa plana', 'İnce ve geniş yassı kemikler; parietal kemik gibi.'], ['Ossa sesamoidea', 'Tendon içinde bulunan kemikler; en büyük örnek patelladır.'], ['Ossa pneumatica', 'İçinde hava boşlukları bulunan kemikler; maxilla ve sphenoid kemik.'], ['Ossa irregularia', 'Düzensiz biçimli kemikler; mandibula, sacrum ve os coxae.']])
      }),
      section('yuzey', 'Kemik yüzeyinin dili', 'Kemik oluşumlarının adlandırılması', {
        paragraphs: ['Kemik üzerindeki çıkıntı, çukur ve açıklıkların isimleri benzer yapılarda tekrar karşımıza çıkar. Bu terimler öğrenildiğinde yeni bir kemiği tarif etmek daha kolay olur.'],
        table: table(['Terim', 'Anlam'], [['Caput / condylus', 'Baş / eklemleşmeye katılan yuvarlak çıkıntı.'], ['Tuberculum / tuberositas', 'Küçük yuvarlak çıkıntı / pürüzlü kabarıklık.'], ['Spina / crista', 'Dikensi çıkıntı / belirgin kemik sırtı.'], ['Sulcus / fossa', 'Oluk / çukur.'], ['Foramen / canalis', 'Delik / kanal.'], ['Fissura / incisura', 'Yarık / çentik.']])
      }),
      section('iskelet', 'İskelete genel bakış', 'İSKELET SİSTEMİ / ÜST EKSTREMİTE KEMİKLERİ / COLUMNA VERTEBRALİS', {
        paragraphs: ['Ders notunda erişkin iskeletinin 206 kemikten oluştuğu belirtilir. Kafa iskeleti, omurga ve göğüs kafesi gövdenin ana çerçevesini oluşturur; ekstremite kemikleri bu çerçeveye katılır.'],
        bullets: ['Üst ekstremite: Scapula, clavicula, humerus, radius, ulna ve el kemikleri.', 'Alt ekstremite: Os coxae, femur, patella, tibia, fibula ve ayak kemikleri.', 'Erişkin omurga: 24 ayrı vertebra, sacrum ve coccyx ile toplam 26 kemik.', 'Göğüs iskeleti: Sternum ve costae; omurganın torakal bölümüyle birlikte göğüs kafesine katılır.']
      })
    ],
    glossary: [['Osteologia', 'Kemikleri inceleyen anatomi alanı.'], ['Metaphysis', 'Uzun kemikte gövde ile uç arasındaki geçiş bölgesi.'], ['Diaphysis', 'Uzun kemiğin gövdesi.'], ['Patella', 'Diz kapağı; sesamoid kemik örneği.']],
    review: [{ q: 'Patella hangi kemik tipine örnektir?', a: 'Sesamoid kemiktir; tendon içinde yer alır.' }, { q: 'Substantia compacta ile spongiosa arasındaki temel fark nedir?', a: 'Compacta yoğun ve sert, spongiosa ise süngerimsi yapıdadır.' }]
  },
  3: {
    subtitle: 'Kemikler arasındaki hareket alanı.',
    intro: 'Eklemler, iskeletin parçalarını bir araya getirirken bölgeye uygun hareket veya sağlamlık sağlar. Bir eklemi anlamanın anahtarı, yapısını hareket kapasitesiyle birlikte değerlendirmektir.',
    scope: 'Fonksiyonel ve yapısal sınıflama, sinoviyal eklemin bileşenleri, eklem tipleri ve seçilmiş bölgesel örnekler.',
    image: '/atlas/knee.webp', imageAlt: 'Diz ekleminin kemik ve bağlarını betimleyen temsili atlas çizimi',
    sections: [
      section('siniflama', 'İki ayrı sınıflandırma', 'EKLEMLERİN SINIFLANDIRILMASI', {
        paragraphs: ['Kemiklerin birleştiği yerlere eklem denir. Artroloji bu bağlantıları inceler. Eklemler hem hareket yeteneklerine hem de aradaki dokunun yapısına göre sınıflanır. Bu iki yaklaşımı birbirinin tam eş anlamlısı gibi kullanmamak gerekir.'],
        table: table(['Fonksiyonel sınıflama', 'Hareket'], [['Synarthrosis', 'Hareketsiz.'], ['Amphiarthrosis', 'Az hareketli.'], ['Diarthrosis', 'Serbest hareketli.']]),
        bullets: ['Yapısal sınıflama: Fibröz, kartilaginöz ve sinoviyal eklemler.', 'Kafatası suturalarında sağlamlık öne çıkarken ekstremite eklemlerinde hareket kapasitesi belirgindir.']
      }),
      section('fibroz', 'Fibröz ve kartilaginöz eklemler', 'Articulationes fibrosae / Articulationes cartilaginae', {
        table: table(['Tür', 'Bağlantı / örnek'], [['Sutura', 'Kafatası kemikleri arasındaki dikişsi bağlantı.'], ['Gomphosis', 'Diş ile diş yuvası arasındaki bağlantı.'], ['Syndesmosis', 'Kemiklerin bağ dokusuyla bağlanması; distal tibiofibular bağlantı.'], ['Synchondrosis', 'Kemikler arasında hiyalin kıkırdak; büyüme plağı örneği.'], ['Symphysis', 'Fibrokıkırdak içeren bağlantı; symphysis pubica ve omur gövdeleri arası.']]),
        paragraphs: ['Fibröz bağlantılarda kemikleri bağ dokusu bir arada tutar. Kartilaginöz eklemlerde ise kemikler arasında kıkırdak doku bulunur. Bağlantının yapısı, dayanıklılığı ve hareket sınırını etkiler.']
      }),
      section('sinoviyal', 'Sinoviyal eklemin temel yapısı', 'Articulationes synoviales / Eklem yüzleri / Eklem boşluğu / Eklem bağları', {
        bullets: ['Eklem yüzleri: Birbirine uyacak biçimde şekillenmiş kemik yüzleridir; çoğunlukla hiyalin kıkırdakla örtülüdür.', 'Eklem kapsülü: Eklemi çevreler.', 'Eklem boşluğu: Sinoviyal sıvı içerir; sıvı kayganlık sağlar ve eklem kıkırdağının beslenmesine katkıda bulunur.', 'Bağlar: Kapsülü destekler, eklemin sağlamlığına ve hareketin sınırlandırılmasına katkı sağlar.'],
        callout: 'Meniscus, discus ve labrum gibi yardımcı yapılar eklem yüzleri arasındaki uyumu artırabilir. Her eklemde hepsi bulunmaz.'
      }),
      section('bicimler', 'Eklem biçimi, hareketi belirler', 'EKLEM YÜZLERİNİN ŞEKLİNE GÖRE SYNOVIAL EKLEMLER', {
        table: table(['Tip', 'Hareket / örnek'], [['Trochoidea', 'Dönme hareketi; proksimal radioulnar eklem.'], ['Ginglymus (trochlearis)', 'Menteşe hareketi; interfalangeal eklemler.'], ['Ellipsoidea', 'Fleksiyon–ekstansiyon ve abduksiyon–adduksiyon; radiocarpal eklem.'], ['Sellaris', 'Eyer biçimli yüzler; başparmağın carpometacarpal eklemi.'], ['Spheroidea', 'Çok eksenli hareket; omuz ve kalça.'], ['Plana', 'Yüzlerin birbirinin üzerinde kayması; faset eklemler.']])
      }),
      section('ornekler', 'Omuz, kalça ve diz', 'Üst Ekstremite Eklemleri / Alt Ekstremite Eklemleri', {
        paragraphs: ['Omuz eklemi caput humeri ile cavitas glenoidalis arasında oluşur ve sferoid tiptedir. Kalçada caput femoris, acetabulum ile eklemleşir; bu da sferoid bir eklemdir.', 'Diz eklemi femur, tibia ve patellanın katılımıyla oluşur. Notta bikondiler tip olarak ele alınır. Medial ve lateral meniscus, çapraz bağlar ve kollateral bağlar dizin yapısal organizasyonunun önemli parçalarıdır.'],
        bullets: ['Ön ve arka çapraz bağ: Lig. cruciatum anterius ve posterius.', 'Kollateral bağlar: Lig. collaterale tibiale ve fibulare.', 'Ayak bileği: Tibia, fibula ve talus arasında; menteşe tipi hareket.'],
        callout: 'Web çizimi bir kapak illüstrasyonudur. Bağların kesin tutunma noktaları için PDF’deki etiketli şekilleri ve doğrulanmış atlası kullan.'
      })
    ],
    glossary: [['Articulatio', 'Eklem.'], ['Synovia', 'Eklem boşluğundaki kayganlaştırıcı sıvı.'], ['Ligamentum', 'Bağ.'], ['Labrum', 'Eklem çukurunun kenarında bulunan fibrokıkırdak yapı.']],
    review: [{ q: 'Omuz ve kalça hangi sinoviyal eklem tipine örnektir?', a: 'Spheroidea, yani küresel eklem tipine.' }, { q: 'Sutura ile symphysis aynı yapısal grupta mıdır?', a: 'Hayır. Sutura fibröz; symphysis kartilaginöz bir bağlantıdır.' }]
  },
  4: {
    subtitle: 'Omuzdan parmaklara, kalçadan adımlara.',
    intro: 'Appendiküler iskelet, üst ve alt ekstremiteler ile bunları gövdeye bağlayan kuşaklardan oluşur. Kemikleri bölgelere ayırarak öğrenmek, uzun bir isim listesini anlaşılır bir haritaya dönüştürür.',
    scope: 'Omuz ve kalça kuşakları, kol–önkol, uyluk–bacak, el ve ayak kemikleri.',
    image: '/atlas/skeleton.webp', imageAlt: 'Üst ve alt ekstremite kemiklerini de içeren temsili iskelet çizimi',
    sections: [
      section('organizasyon', 'Appendiküler iskeletin organizasyonu', 'Skeleton Appendiculare', {
        paragraphs: ['Kaynakta erişkin iskeleti 80 aksiyel ve 126 appendiküler kemik olarak gruplandırılır. İki üst ekstremite ve omuz kuşakları toplam 64; iki alt ekstremite ve kalça kuşağı toplam 62 kemikle bu dağılıma katılır.'],
        table: table(['Bölüm', 'Kuşak ve serbest bölüm'], [['Üst ekstremite', 'Scapula + clavicula; humerus, radius, ulna ve el kemikleri.'], ['Alt ekstremite', 'Os coxae; femur, patella, tibia, fibula ve ayak kemikleri.']])
      }),
      section('omuz', 'Omuz kuşağı ve humerus', 'Scapula / Clavicula / Humerus', {
        paragraphs: ['Scapula sırt tarafında bulunan üçgen biçimli kemiktir. Üç kenarı, üç köşesi ve iki yüzü vardır. Spina scapulae, acromion ve processus coracoideus önemli çıkıntılarıdır.', 'Clavicula S biçimindedir. Medialde manubrium sterni, lateralde acromion ile eklemleşir. Humerus üst ekstremitenin uzun kol kemiğidir; proksimal uç, gövde ve distal uç şeklinde incelenir.'],
        bullets: ['Proksimal humerus: Caput humeri, collum anatomicum, tuberculum majus ve minus.', 'Gövde: Tuberositas deltoidea belirgin bir oluşumdur.', 'Distal uç: Capitulum humeri radius ile, trochlea humeri ulna ile eklemleşir.']
      }),
      section('onkol', 'Önkol: radius ve ulna', 'Ossa antebrachii / Radius / Ulna', {
        table: table(['Kemik', 'Ayırt edici özellikler'], [['Radius', 'Anatomik duruşta lateral taraftadır. Distal ucu daha geniştir; scaphoideum ve lunatum ile eklemleşir.'], ['Ulna', 'Medial taraftadır. Proksimal ucu belirgindir; olecranon dirsek çıkıntısını oluşturur.']]),
        callout: 'Ulna, el bileği kemikleriyle doğrudan temas etmez; arada eklem diski bulunur.'
      }),
      section('el', 'El iskeleti: 8 + 5 + 14', 'Ossa manus / Ossa carpi / Ossa digitorum manus', {
        paragraphs: ['Bir elde 27 kemik bulunur: 8 el bileği kemiği, 5 metakarpal ve 14 falanks. Başparmakta iki, diğer parmakların her birinde üç falanks vardır.'],
        table: table(['Karpal sıra', 'Lateralden mediale'], [['Proksimal sıra', 'Scaphoideum, lunatum, triquetrum, pisiforme.'], ['Distal sıra', 'Trapezium, trapezoideum, capitatum, hamatum.']]),
        bullets: ['Metakarpaller I–V olarak numaralandırılır.', 'Falankslar proksimal, orta ve distal olarak adlandırılır; başparmakta orta falanks yoktur.']
      }),
      section('alt', 'Kalça, uyluk ve bacak', 'Alt Ekstremite Kemikleri / Os Coxae / Os Femoris / Bacak Kemikleri', {
        paragraphs: ['Os coxae; ilium, ischium ve pubis bölümlerinin birleşmesiyle oluşur. Bu birleşme alanındaki acetabulum, femur başını kabul eden eklem çukurudur.', 'Femur vücudun en uzun ve güçlü kemiklerinden biridir. Caput, collum, trochanter major ve minor proksimal uçta; kondiller distal uçta incelenir.'],
        table: table(['Yapı', 'Konum / belirgin oluşum'], [['Patella', 'Dizin önünde bulunan sesamoid kemik.'], ['Tibia', 'Bacağın medialinde; distalinde malleolus medialis.'], ['Fibula', 'Bacağın lateralinde; distalinde malleolus lateralis.']])
      }),
      section('ayak', 'Ayak iskeleti ve kemerler', 'Ayak iskeleti / Ossa tarsi / Ayak iskeletinin arcus’ları', {
        paragraphs: ['Bir ayakta 26 kemik bulunur. Tarsal, metatarsal ve parmak kemikleri ayak iskeletinin ana gruplarıdır. Talus, calcaneus, naviculare, cuboideum ve üç cuneiform kemik tarsal grubu oluşturur.'],
        bullets: ['7 tarsal kemik + 5 metatarsal kemik + 14 falanks.', 'Medial ve lateral longitudinal kemerler uzunlamasına uzanır.', 'Transvers kemer enine düzenlenir.'],
        callout: 'El ve ayağı karşılaştır: Her ikisinde de 5 tarak kemiği ve 14 falanks vardır; bilek kemiği sayıları farklıdır.'
      })
    ],
    glossary: [['Cingulum', 'Kuşak.'], ['Acetabulum', 'Kalça kemiğinde femur başının eklemleştiği çukur.'], ['Olecranon', 'Ulnanın dirsek çıkıntısı.'], ['Malleolus', 'Ayak bileğinin yanlarındaki kemik çıkıntı.']],
    review: [{ q: 'Bir el ile bir ayak arasındaki kemik sayısı farkı nedir?', a: 'Elde 27, ayakta 26 kemik vardır; fark karpal ve tarsal kemik sayısından kaynaklanır.' }, { q: 'Tibia mı, fibula mı medialdedir?', a: 'Tibia medial, fibula lateraldedir.' }]
  },
  5: {
    subtitle: 'Koruyan bir çatı, taşıyan bir sütun.',
    intro: 'Kafatası beyin ve duyu yapıları için bir koruma oluştururken omurga hem yük taşır hem omuriliği çevreler. Aksiyel iskeletin bu parçaları, göğüs kafesiyle birlikte vücudun merkezini şekillendirir.',
    scope: 'Neurocranium, yüz kemikleri, omurganın bölgeleri, tipik ve özel vertebralar, kaburgalar ve sternum.',
    image: '/atlas/skull.webp', imageAlt: 'Kafatası ve üst boyun omurlarının temsili atlas illüstrasyonu',
    sections: [
      section('kafatasi', 'Kafatasının iki ana bölümü', 'KAFA İSKELETİ / Neurocranium', {
        paragraphs: ['Cranium, neurocranium ve viscerocranium olarak incelenir. Neurocranium beyni çevreleyen 8 kemikten, viscerocranium ise yüz iskeletinin 14 kemiğinden oluşur. Hyoid kemik ve işitme kemikçikleri ayrı gruplardır.'],
        table: table(['Neurocranium', 'Kemikler'], [['Tek kemikler', 'Os frontale, os occipitale, os sphenoidale, os ethmoidale.'], ['Çift kemikler', 'Os parietale ve os temporale.']])
      }),
      section('norokranyum', 'Beyni çevreleyen kemikler', 'Os frontale / Os parietale / Os occipitale / Os sphenoidale / Os temporale / Os ethmoidale', {
        bullets: ['Frontal kemik: Alın bölgesini ve orbita tavanının bir bölümünü oluşturur.', 'Parietal kemikler: Kafatasının üst ve yan bölümlerine katılır.', 'Occipital kemik: Arka ve alt bölgededir; foramen magnumu çevreler.', 'Sphenoid kemik: Kafa tabanında; gövde, büyük ve küçük kanatlar ile pterygoid çıkıntılar içerir.', 'Temporal kemik: İşitme ve denge organlarıyla ilişkili yapılara ev sahipliği yapar.', 'Ethmoid kemik: Burun boşluğunun ve kemik septumun yapısına katılır.']
      }),
      section('yuz', 'Yüz iskeleti', 'VISCEROCRANIUM', {
        table: table(['Grup', 'Kemikler'], [['Çift', 'Maxilla, os zygomaticum, os nasale, os lacrimale, os palatinum, concha nasalis inferior.'], ['Tek', 'Mandibula ve vomer.']]),
        paragraphs: ['Maxilla üst çene ve ağız tavanının önemli bir bölümünü oluşturur. Mandibula alt çene kemiğidir; corpus ve ramus bölümleri angulus mandibulae çevresinde birleşir.', 'Hyoid kemik, dil kökü ile gırtlak arasında yer alır. Diğer kafatası kemikleriyle doğrudan eklemleşmez.']
      }),
      section('omurga', 'Omurgayı bölgelere ayırmak', 'Columna Vertebralis', {
        paragraphs: ['Omurga, tipik olarak 33 vertebral segmentten gelişir. Erişkinde sakral ve koksigeal birleşmeler sonucunda 26 ayrı kemik olarak sayılır. Vertebral kanal omuriliği korur.'],
        table: table(['Bölge', 'Sayı'], [['Servikal', '7 ayrı vertebra (C1–C7).'], ['Torakal', '12 ayrı vertebra (T1–T12).'], ['Lumbal', '5 ayrı vertebra (L1–L5).'], ['Sacrum', '5 sakral segmentin birleşmesiyle 1 kemik.'], ['Coccyx', 'Genellikle 4 segmentin birleşmesiyle 1 kemik; değişkenlik görülebilir.']]),
        callout: '“33 vertebral segment” ile “erişkinde 26 kemik” farklı sayım biçimleridir; çelişki değildir.'
      }),
      section('vertebra', 'Tipik vertebra ve özel örnekler', 'Omurların Tipik Özellikleri / ATLAS / AXIS / VERTEBRA PROMİNENS', {
        paragraphs: ['Tipik bir vertebrada corpus, arcus, foramen vertebrale ve çıkıntılar bulunur. Vertebral deliklerin üst üste gelmesi canalis vertebralisi oluşturur. Omur gövdeleri arasında intervertebral diskler yer alır.'],
        bullets: ['Atlas (C1): Gövdesi ve processus spinosusu yoktur.', 'Axis (C2): Dens axis ile ayırt edilir.', 'C7: Uzun spinöz çıkıntısıyla vertebra prominens olarak adlandırılır.', 'Servikal vertebraların transvers çıkıntılarında foramen transversarium bulunur.', 'Lumbal vertebraların gövdeleri yük taşımaya uygun biçimde büyüktür.']
      }),
      section('gogus', 'Kaburgalar ve sternum', 'Kaburgalar (Costae) / Sternum', {
        paragraphs: ['İnsanda 12 çift kaburga bulunur. İlk 7 çift gerçek kaburga (costae verae), son 5 çift yalancı kaburga (costae spuriae) olarak adlandırılır. 11. ve 12. çiftler serbest kaburgalardır.', 'Sternum üç bölümde incelenir: manubrium sterni, corpus sterni ve processus xiphoideus. Manubrium ile corpusun birleşimindeki angulus sterni, göğüs bölgesinin önemli bir yüzey referansıdır.']
      })
    ],
    glossary: [['Neurocranium', 'Kafatasının beyni çevreleyen bölümü.'], ['Viscerocranium', 'Yüz iskeleti.'], ['Foramen magnum', 'Occipital kemikteki büyük açıklık.'], ['Dens axis', 'C2 vertebrasının diş benzeri çıkıntısı.']],
    review: [{ q: 'Neurocranium kaç kemikten oluşur?', a: '8 kemik: dört tek kemik ile iki çift kemik.' }, { q: 'Atlası tipik bir vertebradan ayıran iki özellik nedir?', a: 'Gövdesinin ve processus spinosusunun bulunmaması.' }]
  },
  6: {
    subtitle: 'Hareketin yaşayan dokusu.',
    intro: 'Kaslar yalnızca yer değiştirmemizi sağlamaz; postürün korunmasına, eklemlerin stabilitesine ve ısı üretimine de katılır. Kas bilimi, bu dokunun yapısını ve hareket içindeki rolünü birlikte ele alır.',
    scope: 'Kas tipleri, temel kas yapısı, tutunma terimleri, etki biçimleri, kasılma örnekleri ve seçilmiş baş–boyun kasları. Bölgesel kasların tümü bu özette yer almaz.',
    image: '/atlas/muscles.webp', imageAlt: 'Omuz ve kol kaslarını betimleyen atlas tarzında temsili çizim',
    sections: [
      section('tipler', 'Üç kas dokusu', 'SYSTEMA MUSCULARE / Kas çeşitleri', {
        table: table(['Doku', 'Temel özellik'], [['İskelet kası', 'Çizgili yapıdadır; istemli hareketlerde görev alır.'], ['Düz kas', 'Damar ve iç organ duvarlarında yer alır; istem dışı çalışır.'], ['Kalp kası', 'Çizgili yapıda olmasına rağmen istem dışı çalışır.']]),
        paragraphs: ['Kas sistemi hareketin yanında eklemlerin stabilizasyonuna, postürün ayarlanmasına ve ısı üretimine katkıda bulunur. Düzenli yüklenmeyle kas kütlesinin artması hipertrofi; kullanılmama veya innervasyon kaybıyla azalması atrofi olarak adlandırılır.']
      }),
      section('yapi', 'Kasın yapısı ve tutunması', 'Kasın yapısı / Origo / İnsertio / Aponeurosis', {
        paragraphs: ['Bir iskelet kasında kas karnı ve kuvveti aktaran tendonlar bulunur. Tendon yassı, levha biçimindeyse aponeurosis terimi kullanılır.'],
        table: table(['Terim', 'Tanım'], [['Origo', 'Kasın genellikle daha az hareketli ve proksimal tutunma yeri.'], ['Insertio', 'Kas kasıldığında genellikle daha hareketli olan, çoğu zaman distal tutunma yeri.'], ['Venter', 'Kasın etli gövdesi, kas karnı.'], ['Epimysium', 'Kasın bütününü çevreleyen bağ dokusu.'], ['Perimysium', 'Kas lifi demetlerini çevreleyen bağ dokusu.'], ['Endomysium', 'Tek tek kas liflerinin çevresindeki bağ dokusu.']]),
        callout: 'Origo ve insertio, hareketi okurken kullanılan temel tutunma terimleridir. Sabitlenen uca göre hareketin görünümü değişebilir.'
      }),
      section('roller', 'Bir hareket, birden fazla rol', 'ETKİ ŞEKİLLERİNE GÖRE KASLAR', {
        table: table(['Rol', 'İşlev'], [['Agonist', 'Hareketin oluşturulmasında başlıca görev alan kas.'], ['Antagonist', 'Karşı yönde hareket üretebilen kas.'], ['Sinerjist', 'Agonistin hareketini destekleyen kas.'], ['Fiksatör', 'Hareket sırasında başka bir bölümü sabitleyen kas.']]),
        paragraphs: ['Ders notunda bir bardağı ağza götürme örneği kullanılır: Dirsek fleksiyonu sırasında biceps brachii agonist rol üstlenirken triceps brachii karşıt hareketi yapabilen kastır. Gövdeyi sabitleyen kaslar da hareketin kontrollü gerçekleşmesine katkıda bulunur.']
      }),
      section('kasilma', 'Kasılma biçimlerini ayırt etmek', 'Kas Kasılmaları', {
        bullets: ['Konsantrik kasılma: Kas kuvvet üretirken kısalır; bir ağırlığı kaldırma örneği.', 'Eksantrik kasılma: Kas kuvvet üretirken uzar; yükü kontrollü indirmeye katılma örneği.', 'İzometrik kasılma: Kasın boyunda belirgin değişiklik olmadan gerilim oluşur; sabit bir duvarı itme örneği.'],
        paragraphs: ['Kas adları da bilgi taşır: Şekil, yerleşim, fonksiyon, büyüklük, uzunluk, başlangıç sayısı veya tutunma noktaları isimlendirmede kullanılabilir. “Biceps”, “triceps”, “longus” ve “brevis” gibi sözcükler bu yüzden anlamlıdır.']
      }),
      section('basboyun', 'Baş ve boyundan seçilmiş örnekler', 'BAŞ KASLARI / BOYUN KASLARI', {
        table: table(['Grup / kas', 'Özet işlev'], [['M. orbicularis oculi', 'Göz kapaklarını kapatır.'], ['M. orbicularis oris', 'Dudakların kapanmasına katılır.'], ['Çiğneme kasları', 'Masseter, temporalis ve medial/lateral pterygoid kaslar.'], ['M. sternocleidomastoideus', 'Tek taraflı etkinlikte başın karşıya dönmesi ve aynı yana eğilmesine katkı sağlar.']]),
        paragraphs: ['Mimik kaslarının motor innervasyonu n. facialis ile; çiğneme kaslarının motor innervasyonu n. trigeminusun mandibular bölümüyle ilişkilidir. Boyunda hyoid kemiğin üstündeki ve altındaki kaslar ayrı gruplar halinde incelenir.'],
        callout: 'Bu sayfa kas biliminin temel kavramlarına odaklanır. Gövde ve ekstremitelerin ayrıntılı bölgesel kas anlatımları için özgün PDF’yi kullan.'
      })
    ],
    glossary: [['Myologia', 'Kas bilimi.'], ['Tendon', 'Kas kuvvetini tutunma yerine aktaran bağ dokusu.'], ['Aponeurosis', 'Yassı ve geniş tendon.'], ['Hipertrofi / atrofi', 'Kas kütlesinin artması / azalması.']],
    review: [{ q: 'İzometrik kasılmada kas boyu nasıl değişir?', a: 'Belirgin biçimde değişmez; gerilim oluşur.' }, { q: 'Agonist ve fiksatörün rolleri aynı mıdır?', a: 'Hayır. Agonist hareketi üretir; fiksatör başka bir bölümü sabitlemeye yardım eder.' }]
  },
  7: {
    subtitle: 'Her atımda birbirine bağlanan bir vücut.',
    intro: 'Kalp ve damarlar, oksijenin, besinlerin ve çeşitli maddelerin vücutta taşınmasını sağlayan bir ağ oluşturur. Kanın izlediği yön, hem damar isimlerini hem kalbin boşluklarını anlamayı kolaylaştırır.',
    scope: 'Dolaşımın görevleri, kalbin boşlukları, temel kapaklar, büyük damarlar, duvar tabakaları, koroner dolaşım ve lenf sistemine giriş.',
    image: '/atlas/heart.webp', imageAlt: 'Kalbin dış yüzü ve büyük damarlarının atlas tarzında temsili çizimi',
    sections: [
      section('gorevler', 'Bir taşıma ve düzenleme sistemi', 'Dolaşım sisteminin görevleri', {
        bullets: ['Emilen besin maddelerini doku ve hücrelere taşır.', 'Akciğerlerden alınan oksijenin dokulara ulaşmasını sağlar.', 'Karbondioksit ve metabolik artıkların ilgili organlara taşınmasına katılır.', 'Hormonları hedef dokulara ulaştırır.', 'Vücut sıcaklığının düzenlenmesine ve savunmaya katkı sağlar.'],
        paragraphs: ['Kardiyovasküler sistem, kanı pompalayan kalp ile kanın dolaştığı damarlardan oluşur. Lenf sistemi ise doku aralığındaki sıvı ve büyük moleküllerin geri taşınmasında tamamlayıcı bir rol üstlenir.']
      }),
      section('kalp', 'Dört boşluklu merkez', 'Kalp (Cor) / Kalbin Boşlukları', {
        paragraphs: ['Kalp göğüs boşluğunda, pericardium denilen kese içinde yer alan kaslı bir organdır. Tabanı basis cordis, tepesi apex cordis olarak adlandırılır. Sağ ve sol tarafta birer atrium ile birer ventriculus bulunur.'],
        table: table(['Boşluk', 'Temel bağlantı'], [['Sağ atrium', 'V. cava superior, v. cava inferior ve sinus coronariustan kan alır.'], ['Sağ ventrikül', 'Kanı truncus pulmonalis yoluyla akciğerlere gönderir.'], ['Sol atrium', 'Akciğerlerden gelen pulmoner venleri kabul eder.'], ['Sol ventrikül', 'Kanı aortaya pompalar.']])
      }),
      section('kapaklar', 'Kapaklar ve ayırıcı duvarlar', 'Ostium atrioventriculare / Septum interventriculare', {
        paragraphs: ['Sağ atrium ile sağ ventrikül arasında triküspit, sol atrium ile sol ventrikül arasında mitral (biküspit) kapak bulunur. Kapaklar kan akımının yönlendirilmesinde önemlidir.'],
        bullets: ['Triküspit kapak: Sağ atriyoventriküler açıklıkta, üç yapraklı.', 'Mitral kapak: Sol atriyoventriküler açıklıkta, iki yapraklı.', 'Septum interatriale: Atriumları birbirinden ayırır.', 'Septum interventriculare: Ventrikülleri birbirinden ayırır.']
      }),
      section('damarlar', 'Arter ve ven: belirleyici olan yön', 'Kan damarları / Kalbe giren ve kalpten çıkan damarlar / Aorta', {
        paragraphs: ['Arter, kanı kalpten uzaklaştıran; ven, kanı kalbe getiren damardır. Adlandırmayı kanın oksijen miktarına göre yapmak yanıltıcıdır. Pulmoner arterler oksijeni görece az kanı akciğerlere taşırken pulmoner venler oksijenden zengin kanı sol atriuma getirir.'],
        table: table(['Damar', 'İlişki'], [['Truncus pulmonalis', 'Sağ ventrikülden çıkar; sağ ve sol pulmoner arterlere ayrılır.'], ['Pulmoner venler', 'Genellikle her akciğerden iki tane; toplam dört ven sol atriuma açılır.'], ['Aorta', 'Sol ventrikülden çıkar; çıkan aorta, arcus aortae ve inen aorta olarak incelenir.'], ['Venae cavae', 'Üst ve alt vücut bölgelerinden venöz kanı sağ atriuma taşır.']]),
        callout: 'Arter = kalpten çıkan. Ven = kalbe dönen. Bu yön kuralı, pulmoner dolaşımda da değişmez.'
      }),
      section('duvar', 'Duvar, beslenme ve ileti', 'Kalbin tabakaları / Kalbin İleti Sistemi / Kalbi Besleyen Damarlar', {
        table: table(['Tabaka', 'Özellik'], [['Epikard', 'Kalp duvarının dış yüzündeki tabaka.'], ['Myokard', 'Kasılmayı sağlayan kas tabakası.'], ['Endokard', 'Boşlukların ve kapakların iç yüzünü örten tabaka.']]),
        paragraphs: ['Kalbin kendi dokusu sağ ve sol koroner arterler aracılığıyla beslenir. Venöz kanın büyük bölümü sinus coronarius üzerinden sağ atriuma döner.', 'Kalbin özelleşmiş ileti dokusu ritmik uyarı oluşturabilir ve iletebilir. Sinoatriyal düğüm bu sistemin doğal ritim başlatıcısıdır; otonom sinir sistemi ritmi düzenler.']
      })
    ],
    glossary: [['Cor', 'Kalp.'], ['Atrium', 'Kalbin kan kabul eden üst boşluğu.'], ['Ventriculus', 'Kalbin pompalama işlevindeki alt boşluğu.'], ['Pericardium', 'Kalbi çevreleyen kese.']],
    review: [{ q: 'Pulmoner venler nereye açılır?', a: 'Sol atriuma açılır ve akciğerlerden oksijence zengin kan getirir.' }, { q: 'Bir damarın arter olarak adlandırılmasını ne belirler?', a: 'Kanı kalpten uzaklaştırması; oksijen içeriği değil.' }]
  },
  8: {
    subtitle: 'Besinin izlediği yolu okumak.',
    intro: 'Sindirim, besinlerin kullanılabilir küçük birimlere ayrılması ve emilmesiyle ilişkilidir. Bu web notu sindirim kanalının genel haritasını ve giriş bölgesindeki yapıları birlikte ele alır.',
    scope: 'Sindirim kanalına genel bakış; ağız boşluğu, damak, dişler, dil ve büyük tükürük bezleri. Mide, bağırsak ve yardımcı organların ayrıntıları için PDF’ye başvur.',
    image: '/atlas/digestive.webp', imageAlt: 'Sindirim organlarının doğal yerleşimini betimleyen temsili atlas illüstrasyonu',
    sections: [
      section('yol', 'Sindirim kanalının genel haritası', 'Sindirim Sistemi / Systema Digestorium', {
        paragraphs: ['Büyük moleküllü besinlerin vücudun kullanabileceği birimlere dönüştürülmesi digestio olarak adlandırılır. Sindirim kanalındaki içerik ilerlerken mekanik ve kimyasal süreçler birlikte işler. Emilimle maddeler kan ve lenfe katılır; kullanılmayan artıklar dışarı atılır.'],
        flow: ['Ağız', 'Pharynx', 'Oesophagus', 'Mide', 'İnce bağırsak', 'Kalın bağırsak'],
        bullets: ['Tükürük bezleri, karaciğer ve pankreas sindirime yardımcı organlardır.', 'Midedeki içerik kimus halini alır ve ince bağırsağa ilerler.', 'İnce bağırsakta pankreas ve karaciğer salgıları sindirim sürecine katılır.']
      }),
      section('agiz', 'Ağız boşluğunun iki bölümü', 'Cavitas oris / Ağız boşluğunun sınırları', {
        table: table(['Bölüm', 'Sınır'], [['Vestibulum oris', 'Dışta dudak ve yanaklar, içte dişler ve diş etleri arasındaki aralık.'], ['Cavitas oris propria', 'Diş kavislerinin iç tarafında kalan asıl ağız boşluğu.']]),
        paragraphs: ['Ağız boşluğunun tavanında damak, tabanında dil ve ağız tabanı yapıları bulunur. Yan duvarları yanaklar, ön sınırı dudaklar oluşturur. Arkada isthmus faucium ile yutağa geçilir.']
      }),
      section('damak', 'Damak ve boğaz geçidi', 'PALATUM / Isthmus faucium', {
        paragraphs: ['Damak, sert damak (palatum durum) ve yumuşak damak (palatum molle) olarak incelenir. Sert damağın kemik temelinin ön bölümü maxilladan, arka bölümü palatin kemikten oluşur.', 'Isthmus faucium ağız boşluğu ile oropharynx arasındaki geçittir. Üstte yumuşak damak ve uvula, altta dil kökü ve yanlarda damak arklarıyla ilişkilidir. Tonsilla palatina, iki damak arkı arasında bulunur.'],
        callout: 'Damak yalnızca bir “tavan” değildir; ağız ve burun boşluklarının ayrılmasında, yutma ve konuşmada önemli bir yapıdır.'
      }),
      section('dis', 'Dişlerin düzeni ve yapısı', 'Dentes / Kalıcı dişler / Süt dişleri', {
        table: table(['Diş grubu', 'Sayı ve dağılım'], [['Süt dişleri', 'Toplam 20; her yarım çenede 2 kesici, 1 köpek, 2 azı.'], ['Kalıcı dişler', 'Üçüncü azılar dahil toplam 32; her yarım çenede 2 kesici, 1 köpek, 2 küçük azı, 3 büyük azı.']]),
        paragraphs: ['Bir dişte görünen taç bölümü corona dentis, boyun bölümü cervix dentis ve kemik içinde kalan kök radix dentis olarak adlandırılır. Pulpa boşluğu damar ve sinirleri içerir. Taç dışta mine ile örtülüdür; dentin bu sert yapının altında yer alır.'],
        bullets: ['Süt dişleri arasında premolar bulunmaz.', 'Kök ucundaki açıklık damar ve sinirlerin dişe giriş yoludur.']
      }),
      section('dil', 'Dil ve tükürük bezleri', 'Dil (Lingua) / Dil kasları / Büyük tükürük bezleri', {
        paragraphs: ['Dil; apex, corpus ve radix bölümleriyle incelenir. Kas yapısı sayesinde beslenme ve konuşmaya katılır. İntrinsik kaslar dilin biçimini değiştirirken ekstrinsik kaslar dilin konumunu değiştirmeye katkı sağlar.', 'Ders notunda m. genioglossus, dilin arkaya kaçmasını önlemeye katkısından dolayı “güvenlik kası” olarak vurgulanır.'],
        table: table(['Büyük tükürük bezi', 'Temel bilgi'], [['Gl. parotidea', 'Kanalı üst ikinci molar diş hizasında vestibulum orise açılır.'], ['Gl. submandibularis', 'Kanalı ağız tabanında caruncula sublingualis bölgesine açılır.'], ['Gl. sublingualis', 'Dil altındaki en küçük büyük tükürük bezidir; çok sayıda küçük kanalı bulunur.']])
      })
    ],
    glossary: [['Digestio', 'Sindirim.'], ['Cavitas oris', 'Ağız boşluğu.'], ['Lingua', 'Dil.'], ['Palatum', 'Damak.']],
    review: [{ q: 'Süt dişleri arasında premolar var mıdır?', a: 'Yoktur. Bir yarım çenede iki kesici, bir köpek ve iki azı bulunur.' }, { q: 'Vestibulum oris nerede bulunur?', a: 'Dudak ve yanaklarla dişler ve diş etleri arasındaki aralıkta.' }]
  },
  9: {
    subtitle: 'Algılamak, işlemek, yanıt vermek.',
    intro: 'Sinir sistemi, çevreden ve vücuttan gelen bilgileri değerlendirir; uygun yanıtların oluşmasına ve iç dengenin korunmasına katılır. Yapısal bölümler ile işlevsel bölümleri ayrı düşünmek konunun temelini kurar.',
    scope: 'Nöron ve glia, afferent–efferent yollar, merkezi/periferik ve somatik/otonom ayrımı, beyin sapı, beyincik ve serebral loblara giriş.',
    image: '/atlas/brain.webp', imageAlt: 'Beyin, beyincik ve beyin sapının temsili yandan atlas çizimi',
    sections: [
      section('akim', 'Bilginin iki yönü', 'SİNİR SİSTEMİ / Afferent yollar / Efferent yollar', {
        paragraphs: ['Sinir sisteminin görevleri arasında vücudu bir bütün olarak koordine etmek, uyaranlara uygun yanıt vermek ve homeostaza katkıda bulunmak vardır. Sinirsel uyarı için impuls, bir yapının sinir bağlantısı için innervasyon terimi kullanılır.'],
        flow: ['Reseptör', 'Afferent yol', 'Merkezi işlem', 'Efferent yol', 'Yanıt'],
        table: table(['Yön', 'Tanım'], [['Afferent', 'Çevreden merkezi sinir sistemine bilgi taşıyan yol.'], ['Efferent', 'Merkezden çevredeki yapılara komut taşıyan yol.']])
      }),
      section('hucre', 'Nöron ve destek hücreleri', 'Neuron / Fonksiyonlarına göre nöronların sınıflandırılması', {
        paragraphs: ['Nöron; hücre gövdesi ve uzantılarıyla birlikte değerlendirilir. Dendritler bilgiyi genellikle gövdeye doğru alırken akson bilgiyi diğer hücrelere iletir. Glia hücreleri sinir dokusunun destek, beslenme ve korunma işlevlerine katılır.'],
        bullets: ['Duyusal nöronlar: Çevreden alınan duyuları merkeze taşır.', 'Motor nöronlar: Merkezi sinir sisteminden kas ve bez gibi yapılara uyarı taşır.', 'İnternöronlar: Nöronlar arasında bağlantı ve işlem süreçlerine katılır.']
      }),
      section('bolumler', 'Yapısal ve işlevsel ayrımlar', 'Sinir sisteminin bölümleri', {
        table: table(['Sınıflama', 'Bölümler'], [['Anatomik', 'Merkezi sinir sistemi: beyin ve omurilik. Periferik sinir sistemi: kraniyal/spinal sinirler ve ganglionlar.'], ['Fonksiyonel', 'Somatik sistem: somatik duyu ve iskelet kaslarının motor kontrolü. Otonom sistem: iç organların, düz kasın, kalp kasının ve bezlerin düzenlenmesi.']]),
        paragraphs: ['Kaynakta periferik sistem 12 çift kraniyal ve 31 çift spinal sinirle birlikte ele alınır. Merkezi yapılar kafatası boşluğu ve vertebral kanal tarafından çevrelenir.'],
        callout: '“Merkezi–periferik” bir yerleşim ayrımıdır. “Somatik–otonom” ise işlevsel ayrımdır. Bu iki sınıflama aynı şey değildir.'
      }),
      section('beyinsapi', 'Beyin sapı ve beyincik', 'Encephalon / MEDULLA OBLONGATA / PONS / MEZENCEPHALON / Cerebellum', {
        table: table(['Yapı', 'Temel ilişki'], [['Medulla oblongata', 'Beyin sapının alt bölümüdür; kalp-damar ve solunum düzenlenmesiyle ilgili merkezler içerir.'], ['Pons', 'Medulla oblongata ile mesencephalon arasında; cerebellumla bağlantılıdır.'], ['Mesencephalon', 'Beyin sapının üst bölümüdür; çeşitli motor ve duyusal devrelere katılır.'], ['Cerebellum', 'Hareketin koordinasyonu, denge ve postürle ilişkilidir.']]),
        paragraphs: ['Mesencephalon, pons ve medulla oblongata birlikte beyin sapını oluşturur. Cerebellumun hareket üzerindeki rolü, farklı kas gruplarının uyumlu çalışmasını desteklemesi üzerinden düşünülebilir.']
      }),
      section('loblar', 'Ara beyin ve serebral loblar', 'Diencephalon / BEYNİN LOBLARI', {
        paragraphs: ['Thalamus, koku dışındaki duyuların kortekse iletilmesinde önemli bir ara istasyondur. Hypothalamus iç denge, ısı, sıvı dengesi, açlık–tokluk ve endokrin bağlantılarla ilişkilidir.'],
        table: table(['Lob', 'Öne çıkan işlev ilişkisi'], [['Frontal', 'Motor kontrol, planlama ve karar süreçleri.'], ['Parietal', 'Somatik duyuların değerlendirilmesi.'], ['Occipital', 'Görsel işleme.'], ['Temporal', 'İşitme ve bellekle ilişkili süreçler.']]),
        callout: 'Bu tablo başlangıç haritasıdır. Karmaşık işlevler tek bir noktaya indirgenmez; birbiriyle bağlantılı ağlarda yürütülür.'
      })
    ],
    glossary: [['Encephalon', 'Kafatası içindeki beyin yapılarının bütünü.'], ['Medulla spinalis', 'Omurilik.'], ['Afferent', 'Merkeze yönelen.'], ['Efferent', 'Merkezden uzaklaşan.']],
    review: [{ q: 'Beyin sapının üç ana bölümü nedir?', a: 'Mesencephalon, pons ve medulla oblongata.' }, { q: 'Afferent lifler hangi yönde bilgi taşır?', a: 'Çevreden merkezi sinir sistemine doğru.' }]
  },
  10: {
    subtitle: 'Üreme organlarını yapı ve konumla anlamak.',
    intro: 'Bu dosyanın adı “Ürogenital sistem” olsa da çıkarılabilen metni erkek ve kadın üreme organlarını ele alır. Web notunun kapsamı da bu içerikle sınırlıdır; ayrı bir böbrek veya üriner sistem anlatımı eklenmemiştir.',
    scope: 'Erkek ve kadın iç/dış genital organları, iletim yolları, yardımcı bezler ve temel komşuluklar.',
    image: '/atlas/reproductive.webp', imageAlt: 'Uterus, tuba uterina ve ovariumların eğitim amaçlı temsili atlas çizimi',
    sections: [
      section('erkek', 'Erkek üreme organlarına genel bakış', 'ORGANA GENİTALİA MASCULİNA', {
        paragraphs: ['Erkek üreme sisteminde testisler üreme hücrelerinin ve hormonların üretimiyle ilişkilidir. Epididymis, ductus deferens ve ductus ejaculatorius iletim yolunun önemli parçalarıdır. Vesicula seminalis, prostat ve bulbourethral bezler salgılarıyla bu sisteme katılır.'],
        bullets: ['Testisler çift, oval organlardır ve scrotum içinde yer alır.', 'Epididymis, testis ile ductus deferens arasında bulunur; sperm olgunlaşması ve depolanmasıyla ilişkilidir.', 'Ductus deferens, epididymis kanalının devamıdır ve spermin taşınmasını sağlar.']
      }),
      section('bezler', 'Yardımcı bezler ve dış yapılar', 'VESİCULA SEMİNALİS / PROSTATE / GLANDULA BULBOURETHRALİS / PENİS / SCROTUM', {
        table: table(['Yapı', 'Konum veya işlev'], [['Vesicula seminalis', 'Mesanenin arkasında; salgısı ejakülatın önemli bir bölümüne katılır.'], ['Prostat', 'Mesanenin altında, rectumun önünde yer alan bez.'], ['Bulbourethral bezler', 'Üretraya salgı veren küçük çift bezler.'], ['Scrotum', 'Testis ve ilişkili yapıları barındıran torba.']]),
        paragraphs: ['Penis; radix, corpus ve glans bölümleriyle incelenir. İki corpus cavernosum ve bir corpus spongiosum, erektil yapının ana bileşenleridir.'],
        callout: 'Sperm hücresi ile semen aynı kavram değildir. Semen, sperm hücreleriyle çeşitli bez salgılarının oluşturduğu karışımdır.'
      }),
      section('kadin', 'Kadın iç genital organları', 'ORGANA GENİTALİA FEMİNİNA İNTERNA / OVARİUM / TUBA UTERİNA', {
        table: table(['Organ', 'Temel özellik'], [['Ovarium', 'Çift organdır; oositler ve üreme hormonlarıyla ilişkilidir.'], ['Tuba uterina', 'Uterusun iki yanında uzanır; fertilizasyonun olağan yeri ampulla bölümüdür.'], ['Uterus', 'Pelviste, mesanenin arkasında ve rectumun önünde bulunan içi boş kaslı organ.'], ['Vagina', 'Uterusun alt bölümü ile dış genital bölge arasında uzanan kaslı-zarlı kanal.']]),
        paragraphs: ['Ders notunda uterus corpus ve cervix bölümleri üzerinden anlatılır. Organları öğrenirken isimlerinin yanında komşuluklarını da tekrar etmek pelvisin üç boyutlu düzenini anlamayı kolaylaştırır.']
      }),
      section('vulva', 'Dış genital yapılar', 'Organa Genitalia Feminina Externa / DIŞ GENİTAL ORGANLAR', {
        paragraphs: ['Kadın dış genital yapılarının tümü vulva başlığı altında ele alınır. Mons pubis, labium majus ve minus, clitoris, vestibulum ve ilgili bezler bu bölgenin yapılarıdır.', 'Vestibulum, labia minora arasında bulunur. Burada üretranın dış açıklığı ile vajinal açıklık ayrı yapılardır.'],
        bullets: ['Clitoris erektil doku içeren bir yapıdır.', 'Bulbi vestibuli, vajinal açıklığın yanlarında yer alan çift erektil yapılardır.', 'Büyük vestibüler bezler Bartholin bezleri olarak da adlandırılır.'],
        callout: 'Bu çalışma notu organların anatomik düzenini özetler; tanı, cinsel sağlık değerlendirmesi veya kişiye özel tıbbi öneri içermez.'
      })
    ],
    glossary: [['Epididymis', 'Sperm olgunlaşması ve depolanmasıyla ilişkili kanal sistemi.'], ['Ovarium', 'Yumurtalık.'], ['Tuba uterina', 'Uterin tüp.'], ['Cervix uteri', 'Uterusun boyun bölümü.']],
    review: [{ q: 'Prostatın mesane ve rectuma göre konumu nasıldır?', a: 'Mesanenin altında, rectumun önündedir.' }, { q: 'Fertilizasyonun olağan yeri neresidir?', a: 'Tuba uterinanın ampulla bölümü.' }]
  },
  11: {
    subtitle: 'Bir nefesin anatomik yolculuğu.',
    intro: 'Solunum sistemi havanın iletilmesini ve gaz alışverişini sağlar. Burundan başlayan yol, giderek dallanan hava yollarıyla akciğerlere ulaşır; göğüs kafesi ve diaphragma bu sürecin hareketli çerçevesidir.',
    scope: 'İç/dış solunum, burun ve sinüsler, pharynx, larynx, trachea, bronşlar, akciğer lobları ve diaphragma.',
    image: '/atlas/lungs.webp', imageAlt: 'Trachea ve iki akciğerin temsili atlas tarzı çizimi',
    sections: [
      section('gaz', 'Gaz alışverişinin iki düzeyi', 'Systema Respiratorium / Dış solunum / İç solunum', {
        paragraphs: ['Solunum sisteminin temel görevi oksijenin alınması ve metabolizma sonucu oluşan karbondioksitin uzaklaştırılmasıdır. Bu alışveriş akciğer düzeyinde ve doku düzeyinde ayrı ele alınır.'],
        table: table(['Kavram', 'Alışverişin yeri'], [['Dış solunum', 'Akciğerlerde hava ile kan arasında.'], ['İç solunum', 'Kan ile dokular arasında.']]),
        flow: ['Burun', 'Pharynx', 'Larynx', 'Trachea', 'Bronşlar', 'Akciğerler']
      }),
      section('burun', 'Havayı hazırlayan giriş: burun', 'Nasus / Cavitas Nasi / Sinus Paranasales', {
        paragraphs: ['Burun hava yolu oluşturur; havanın ısıtılması, nemlendirilmesi ve filtre edilmesine katkı sağlar. Aynı zamanda koku reseptörlerini barındırır ve sesin rezonansına katılır.', 'Burun boşluğu nares ile dış ortama, choanae ile nasopharynxe açılır. Septum nasi, boşluğu iki bölüme ayırır; kemik ve kıkırdak bileşenler içerir.'],
        bullets: ['Paranasal sinüsler: Frontal, maxiller, sphenoidal ve ethmoidal hava boşlukları.', 'Bu boşlukların mukozası burun mukozasıyla devamlılık gösterir.', 'Nasolakrimal kanal, alt burun meatusuna açılır.']
      }),
      section('yutak', 'Pharynx ve larynx aynı yapı değildir', 'Pharynx / Larynx', {
        table: table(['Larynx kıkırdakları', 'Örnekler'], [['Tek', 'Thyroidea, cricoidea, epiglottica.'], ['Çift', 'Arytenoidea, corniculata, cuneiformis.']]),
        paragraphs: ['Pharynx yutaktır; hem sindirim hem solunumla ilişkilidir. Nasopharynx, oropharynx ve laryngopharynx bölümleri vardır. Larynx ise gırtlaktır; hava yolunun korunması ve ses oluşumunda görev alır.', 'Plica vocalis gerçek ses kıvrımı, plica vestibularis ise onun üstündeki vestibüler kıvrımdır. Ses oluşumu, hava akımının ses kıvrımlarıyla etkileşmesine dayanır.']
      }),
      section('brons', 'Trachea ve bronş ağacı', 'Trachea / Bronchus principalis', {
        paragraphs: ['Trachea, C biçimli kıkırdaklarla desteklenen bir hava yoludur. Alt uçta sağ ve sol ana bronşa ayrılır. Dallanma ana bronş, lober bronş ve segmental bronş şeklinde ilerler.'],
        table: table(['Ana bronş', 'Karşılaştırma'], [['Sağ', 'Sola göre daha kısa, daha geniş ve daha dik seyirlidir; üç lober dala ayrılır.'], ['Sol', 'Daha uzun, daha dar ve daha obliktir; iki lober dala ayrılır.']]),
        callout: 'Sağ–sol farkını bronşların seyri ve akciğerlerin lob sayısıyla birlikte öğren.'
      }),
      section('akciger', 'Akciğer yüzleri ve lobları', 'Pulmones / Fissura’larla loblara ayrılırlar', {
        table: table(['Akciğer', 'Lob ve fissürler'], [['Sağ', 'Üst, orta ve alt olmak üzere 3 lob; horizontal ve oblik fissür.'], ['Sol', 'Üst ve alt olmak üzere 2 lob; oblik fissür.']]),
        paragraphs: ['Akciğerin tepesi apex pulmonis, tabanı basis pulmonis olarak adlandırılır. Costal yüz göğüs duvarıyla, mediastinal yüz mediastinumla, diaphragmatik yüz ise diaphragmayla ilişkilidir.', 'Mediastinum iki akciğer arasındaki merkezi bölgedir. Kaynakta üst ve alt mediastinum ayrımı angulus sterni düzeyiyle ilişkilendirilir.']
      }),
      section('diaphragma', 'Nefesin hareketli tabanı', 'Diaphragma', {
        paragraphs: ['Diaphragma göğüs ve karın boşluklarını ayıran kubbe biçimli kas-tendon yapısıdır. Kasıldığında aşağı doğru hareket edip yassılaşır; göğüs boşluğunun hacmi artar ve soluk almaya katkıda bulunur. Motor innervasyonu n. phrenicus tarafından sağlanır.'],
        bullets: ['Sternal, costal ve lumbal bölümler halinde incelenir.', 'Başlıca açıklıklar: Hiatus aorticus, hiatus oesophageus ve foramen venae cavae.'],
        callout: 'Soluk alma yalnızca “akciğerin çalışması” değildir; göğüs duvarı ve solunum kaslarının hareketiyle ilişkilidir.'
      })
    ],
    glossary: [['Nasus', 'Burun.'], ['Pharynx / larynx', 'Yutak / gırtlak.'], ['Trachea', 'Soluk borusu.'], ['Pulmo / pulmones', 'Akciğer / akciğerler.']],
    review: [{ q: 'Sağ ana bronş, sola göre nasıldır?', a: 'Daha kısa, daha geniş ve daha dik seyirlidir.' }, { q: 'Diaphragmanın motor siniri nedir?', a: 'N. phrenicus.' }]
  },
  0: {
    subtitle: 'İyi bir atlas, uzun bir yol arkadaşlığı.',
    intro: 'Hocanın kaynak rehberi, temel anatomi öğrenimini ve mesleki yaşamda bilgiye geri dönmeyi destekleyen atlas ve kitap önerileri sunar. Liste bir zorunlu satın alma listesi değildir.',
    scope: 'Kaynak PDF’deki önerilen kitap ve atlasların listesi ile kullanım amacının özeti.',
    image: '/anatomy-torso.webp', imageAlt: 'Anatomi atlası estetiğini temsil eden göğüs kafesi illüstrasyonu',
    sections: [
      section('yaklasim', 'Öneri, zorunluluk değil', 'Kaynak rehberinin giriş metni', {
        paragraphs: ['Öğr. Gör. Bekir Dağdeviren, bu listenin temel eğitim için bir öneri olduğunu ve kitap satın almanın zorunlu olmadığını belirtir. Ders notları öğrenim için yeterli olabilir; ek kaynaklar ise anatomiyi daha derinlemesine çalışmayı destekler.', 'Rehberde kitapların yeni veya ikinci el olarak temin edilebileceği de ifade edilir. Belirli bir satıcı, güncel fiyat veya zorunlu baskı bilgisi verilmez.'],
        callout: 'Önce ihtiyaç: Bir atlasın görselleri ile bir ders kitabının açıklamaları farklı öğrenme ihtiyaçlarına karşılık gelir.'
      }),
      section('atlaslar', 'Önerilen atlaslar', 'SOBOTTA ATLAS / Netter insan anatomisi', {
        table: table(['Atlas', 'Kaynak notundaki öneri'], [['Sobotta Atlas', 'Atlas önerileri arasında yer alır. İkinci el, eski basım seçeneği ayrıca anılır.'], ['Netter İnsan Anatomisi', 'İnsan anatomisi atlası önerisi olarak listelenir.']]),
        paragraphs: ['Atlasları, ders notunda karşılaştığın yapıları komşuluklarıyla birlikte incelemek için kullanabilirsin. Web sayfalarındaki dekoratif çizimler, etiketli ve uzman denetiminden geçmiş atlas görsellerinin yerine geçmez.']
      }),
      section('kitaplar', 'Önerilen ders kitapları', 'Mehmet Yıldırım / Kaplan Arıncı ders kitabı', {
        table: table(['Kitap / yazar', 'Kaynak notundaki açıklama'], [['Mehmet Yıldırım — Anatomi ders kitabı', 'Lisans düzeyine uygun olarak belirtilir.'], ['Kaplan Arıncı — Anatomi ders kitabı', 'Daha ayrıntılı bilgi içerdiği belirtilir.']]),
        paragraphs: ['Buradaki isimler kaynak PDF’deki biçimi esas alınarak özetlenmiştir. Satın almadan önce tam eser adı, güncel baskı ve dersin gereksinimleri hocayla teyit edilmelidir.']
      }),
      section('iletisim', 'Soruların için akademik iletişim', 'Kaynak rehberinin giriş metni', {
        paragraphs: ['Rehberde sorular için Öğr. Gör. Bekir Dağdeviren’in kurumsal e-posta adresi paylaşılır: bdagdeviren@firat.edu.tr.', 'Bu sayfa kitapları satmaz, ticari yönlendirme veya satış ortaklığı bağlantısı içermez. Amaç, hocanın önerilerini okunabilir bir kaynak listesinde bir araya getirmektir.']
      })
    ],
    glossary: [['Atlas', 'Yapıları görseller üzerinden incelemeye yardımcı kaynak.'], ['Ders kitabı', 'Kavram ve ilişkileri açıklayıcı metinlerle işleyen kaynak.']],
    review: [{ q: 'Listedeki kitapları satın almak zorunlu mu?', a: 'Hayır. Hocanın kaynak rehberinde bu önerilerin zorunlu olmadığı açıkça belirtilir.' }]
  }
};

export function readingMinutes(lesson) {
  const text = [lesson.intro, ...lesson.sections.map(s => [s.title, ...(s.paragraphs || []), ...(s.bullets || []), ...(s.table?.rows.flat() || []), s.callout || ''].join(' '))].join(' ');
  return Math.max(2, Math.ceil(text.split(/\s+/).length / 180));
}
