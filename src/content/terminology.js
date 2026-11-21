// Terminologia Anatomica karşılıkları: her Türkçe terimin yanında uluslararası
// Latince adı taşınır. `lesson` alanı terimin ilk öğretildiği dersi işaret eder;
// üst arama çubuğu ve ders sayfasındaki TA kartları bu kaynağı paylaşır.
export const TERMS = [
  // 1 · Anatomiye giriş
  { la: 'Positio anatomica', tr: 'Anatomik pozisyon', en: 'anatomical position', lesson: 1 },
  { la: 'Planum sagittale', tr: 'Sagittal düzlem', en: 'sagittal plane', lesson: 1 },
  { la: 'Planum coronale', tr: 'Frontal (koronal) düzlem', en: 'coronal plane', lesson: 1 },
  { la: 'Planum transversale', tr: 'Transvers düzlem', en: 'transverse plane', lesson: 1 },
  { la: 'Cavitas thoracica', tr: 'Göğüs boşluğu', en: 'thoracic cavity', lesson: 1 },
  { la: 'Cavitas abdominis', tr: 'Karın boşluğu', en: 'abdominal cavity', lesson: 1 },
  { la: 'Canalis vertebralis', tr: 'Vertebral kanal', en: 'vertebral canal', lesson: 1 },
  { la: 'Diaphragma', tr: 'Diyafram', en: 'diaphragm', lesson: 1 },
  { la: 'Proximalis', tr: 'Proksimal (merkeze yakın)', en: 'proximal', lesson: 1 },
  { la: 'Distalis', tr: 'Distal (merkeze uzak)', en: 'distal', lesson: 1 },
  { la: 'Medialis', tr: 'Medial (orta hatta yakın)', en: 'medial', lesson: 1 },
  { la: 'Lateralis', tr: 'Lateral (yana uzak)', en: 'lateral', lesson: 1 },
  // 2 · Hareket
  { la: 'Flexio', tr: 'Fleksiyon (bükme)', en: 'flexion', lesson: 2 },
  { la: 'Extensio', tr: 'Ekstansiyon (germe)', en: 'extension', lesson: 2 },
  { la: 'Abductio', tr: 'Abdüksiyon (uzaklaştırma)', en: 'abduction', lesson: 2 },
  { la: 'Adductio', tr: 'Addüksiyon (yakınlaştırma)', en: 'adduction', lesson: 2 },
  { la: 'Rotatio', tr: 'Rotasyon (döndürme)', en: 'rotation', lesson: 2 },
  { la: 'Pronatio', tr: 'Pronasyon', en: 'pronation', lesson: 2 },
  { la: 'Supinatio', tr: 'Supinasyon', en: 'supination', lesson: 2 },
  { la: 'Circumductio', tr: 'Sirkumdüksiyon', en: 'circumduction', lesson: 2 },
  { la: 'Origo', tr: 'Kasın başlangıcı', en: 'origin of muscle', lesson: 2 },
  { la: 'Insertio', tr: 'Kasın tutunma yeri', en: 'insertion of muscle', lesson: 2 },
  // 3 · Eklem
  { la: 'Articulatio', tr: 'Eklem', en: 'joint', lesson: 3 },
  { la: 'Articulatio synovialis', tr: 'Sinoviyal eklem', en: 'synovial joint', lesson: 3 },
  { la: 'Capsula articularis', tr: 'Eklem kapsülü', en: 'articular capsule', lesson: 3 },
  { la: 'Membrana synovialis', tr: 'Sinoviyal zar', en: 'synovial membrane', lesson: 3 },
  { la: 'Cavitas articularis', tr: 'Eklem boşluğu', en: 'articular cavity', lesson: 3 },
  { la: 'Cartilago articularis', tr: 'Eklem kıkırdağı', en: 'articular cartilage', lesson: 3 },
  { la: 'Ligamentum', tr: 'Bağ', en: 'ligament', lesson: 3 },
  { la: 'Discus articularis', tr: 'Eklem diski', en: 'articular disc', lesson: 3 },
  { la: 'Meniscus articularis', tr: 'Eklem menisküsü', en: 'articular meniscus', lesson: 3 },
  { la: 'Articulatio genus', tr: 'Diz eklemi', en: 'knee joint', lesson: 3 },
  // 4 · Ekstremite kemikleri
  { la: 'Clavicula', tr: 'Köprücük kemiği', en: 'clavicle', lesson: 4 },
  { la: 'Scapula', tr: 'Kürek kemiği', en: 'scapula', lesson: 4 },
  { la: 'Humerus', tr: 'Pazu kemiği', en: 'humerus', lesson: 4 },
  { la: 'Radius', tr: 'Önkol dış kemiği', en: 'radius', lesson: 4 },
  { la: 'Ulna', tr: 'Önkol iç kemiği', en: 'ulna', lesson: 4 },
  { la: 'Carpus', tr: 'El bileği kemikleri', en: 'carpal bones', lesson: 4 },
  { la: 'Os scaphoideum', tr: 'Skafoid kemik', en: 'scaphoid', lesson: 4 },
  { la: 'Metacarpus', tr: 'Tarak kemikleri', en: 'metacarpal bones', lesson: 4 },
  { la: 'Femur', tr: 'Uyluk kemiği', en: 'femur', lesson: 4 },
  { la: 'Patella', tr: 'Diz kapağı kemiği', en: 'patella', lesson: 4 },
  { la: 'Tibia', tr: 'Kaval kemiği', en: 'tibia', lesson: 4 },
  { la: 'Fibula', tr: 'Kamış kemiği', en: 'fibula', lesson: 4 },
  { la: 'Calcaneus', tr: 'Topuk kemiği', en: 'calcaneus', lesson: 4 },
  { la: 'Talus', tr: 'Aşık kemiği', en: 'talus', lesson: 4 },
  // 5 · Kranium ve vertebra
  { la: 'Os frontale', tr: 'Alın kemiği', en: 'frontal bone', lesson: 5 },
  { la: 'Os parietale', tr: 'Duvar kemiği', en: 'parietal bone', lesson: 5 },
  { la: 'Os occipitale', tr: 'Art kafa kemiği', en: 'occipital bone', lesson: 5 },
  { la: 'Os temporale', tr: 'Şakak kemiği', en: 'temporal bone', lesson: 5 },
  { la: 'Os sphenoidale', tr: 'Temel (sfenoid) kemik', en: 'sphenoid bone', lesson: 5 },
  { la: 'Mandibula', tr: 'Alt çene kemiği', en: 'mandible', lesson: 5 },
  { la: 'Maxilla', tr: 'Üst çene kemiği', en: 'maxilla', lesson: 5 },
  { la: 'Os zygomaticum', tr: 'Elmacık kemiği', en: 'zygomatic bone', lesson: 5 },
  { la: 'Vertebra', tr: 'Omur', en: 'vertebra', lesson: 5 },
  { la: 'Corpus vertebrae', tr: 'Omur gövdesi', en: 'vertebral body', lesson: 5 },
  { la: 'Discus intervertebralis', tr: 'Omurlar arası disk', en: 'intervertebral disc', lesson: 5 },
  { la: 'Sacrum', tr: 'Sağrı kemiği', en: 'sacrum', lesson: 5 },
  { la: 'Coccyx', tr: 'Kuyruk sokumu kemiği', en: 'coccyx', lesson: 5 },
  // 6 · Kas
  { la: 'Musculus', tr: 'Kas', en: 'muscle', lesson: 6 },
  { la: 'Tendo', tr: 'Tendon', en: 'tendon', lesson: 6 },
  { la: 'Aponeurosis', tr: 'Aponevroz', en: 'aponeurosis', lesson: 6 },
  { la: 'Fascia', tr: 'Fasya', en: 'fascia', lesson: 6 },
  { la: 'Musculus biceps brachii', tr: 'İki başlı kol kası', en: 'biceps brachii', lesson: 6 },
  { la: 'Musculus triceps brachii', tr: 'Üç başlı kol kası', en: 'triceps brachii', lesson: 6 },
  { la: 'Musculus deltoideus', tr: 'Omuz kası', en: 'deltoid', lesson: 6 },
  { la: 'Musculus pectoralis major', tr: 'Büyük göğüs kası', en: 'pectoralis major', lesson: 6 },
  { la: 'Musculus latissimus dorsi', tr: 'Geniş sırt kası', en: 'latissimus dorsi', lesson: 6 },
  { la: 'Musculus rectus abdominis', tr: 'Karın ön kası', en: 'rectus abdominis', lesson: 6 },
  { la: 'Musculus quadriceps femoris', tr: 'Dört başlı uyluk kası', en: 'quadriceps femoris', lesson: 6 },
  { la: 'Musculus triceps surae', tr: 'Baldır kası grubu', en: 'triceps surae', lesson: 6 },
  { la: 'Musculus sternocleidomastoideus', tr: 'Boyun yan kası', en: 'sternocleidomastoid', lesson: 6 },
  // 7 · Dolaşım
  { la: 'Cor', tr: 'Kalp', en: 'heart', lesson: 7 },
  { la: 'Atrium dextrum', tr: 'Sağ kulakçık', en: 'right atrium', lesson: 7 },
  { la: 'Atrium sinistrum', tr: 'Sol kulakçık', en: 'left atrium', lesson: 7 },
  { la: 'Ventriculus dexter', tr: 'Sağ karıncık', en: 'right ventricle', lesson: 7 },
  { la: 'Ventriculus sinister', tr: 'Sol karıncık', en: 'left ventricle', lesson: 7 },
  { la: 'Valva tricuspidalis', tr: 'Üç yaprakçıklı kapak', en: 'tricuspid valve', lesson: 7 },
  { la: 'Valva mitralis', tr: 'Mitral kapak', en: 'mitral valve', lesson: 7 },
  { la: 'Aorta', tr: 'Aort', en: 'aorta', lesson: 7 },
  { la: 'Truncus pulmonalis', tr: 'Pulmoner gövde', en: 'pulmonary trunk', lesson: 7 },
  { la: 'Vena cava superior', tr: 'Üst ana toplardamar', en: 'superior vena cava', lesson: 7 },
  { la: 'Vena cava inferior', tr: 'Alt ana toplardamar', en: 'inferior vena cava', lesson: 7 },
  { la: 'Vena portae hepatis', tr: 'Portal ven', en: 'hepatic portal vein', lesson: 7 },
  { la: 'Arteria carotis communis', tr: 'Ortak karotis arter', en: 'common carotid artery', lesson: 7 },
  { la: 'Arteria subclavia', tr: 'Köprücük altı arteri', en: 'subclavian artery', lesson: 7 },
  // 8 · Sindirim
  { la: 'Oesophagus', tr: 'Yemek borusu', en: 'esophagus', lesson: 8 },
  { la: 'Gaster', tr: 'Mide', en: 'stomach', lesson: 8 },
  { la: 'Duodenum', tr: 'Oniki parmak bağırsağı', en: 'duodenum', lesson: 8 },
  { la: 'Jejunum', tr: 'İnce bağırsağın orta bölümü', en: 'jejunum', lesson: 8 },
  { la: 'Ileum', tr: 'İnce bağırsağın son bölümü', en: 'ileum', lesson: 8 },
  { la: 'Caecum', tr: 'Kör bağırsak', en: 'cecum', lesson: 8 },
  { la: 'Appendix vermiformis', tr: 'Apandiks', en: 'vermiform appendix', lesson: 8 },
  { la: 'Colon transversum', tr: 'Enine kolon', en: 'transverse colon', lesson: 8 },
  { la: 'Rectum', tr: 'Rektum', en: 'rectum', lesson: 8 },
  { la: 'Hepar', tr: 'Karaciğer', en: 'liver', lesson: 8 },
  { la: 'Pancreas', tr: 'Pankreas', en: 'pancreas', lesson: 8 },
  { la: 'Vesica biliaris', tr: 'Safra kesesi', en: 'gallbladder', lesson: 8 },
  // 9 · Sinir sistemi ve duyu
  { la: 'Encephalon', tr: 'Beyin', en: 'brain', lesson: 9 },
  { la: 'Medulla spinalis', tr: 'Omurilik', en: 'spinal cord', lesson: 9 },
  { la: 'Neuron', tr: 'Nöron', en: 'neuron', lesson: 9 },
  { la: 'Substantia grisea', tr: 'Gri madde', en: 'grey matter', lesson: 9 },
  { la: 'Substantia alba', tr: 'Ak madde', en: 'white matter', lesson: 9 },
  { la: 'Dura mater', tr: 'Sert zar', en: 'dura mater', lesson: 9 },
  { la: 'Arachnoidea mater', tr: 'Örümceksi zar', en: 'arachnoid mater', lesson: 9 },
  { la: 'Pia mater', tr: 'İnce zar', en: 'pia mater', lesson: 9 },
  { la: 'Sulcus centralis', tr: 'Merkezi oluk', en: 'central sulcus', lesson: 9 },
  { la: 'Gyrus precentralis', tr: 'Merkez ön kıvrım (motor)', en: 'precentral gyrus', lesson: 9 },
  { la: 'Gyrus postcentralis', tr: 'Merkez arka kıvrım (duyu)', en: 'postcentral gyrus', lesson: 9 },
  { la: 'Cerebellum', tr: 'Beyincik', en: 'cerebellum', lesson: 9 },
  { la: 'Plexus brachialis', tr: 'Kol sinir ağı', en: 'brachial plexus', lesson: 9 },
  { la: 'Nervus medianus', tr: 'Median sinir', en: 'median nerve', lesson: 9 },
  { la: 'Nervus ulnaris', tr: 'Ulnar sinir', en: 'ulnar nerve', lesson: 9 },
  { la: 'Nervus radialis', tr: 'Radial sinir', en: 'radial nerve', lesson: 9 },
  { la: 'Nervus ischiadicus', tr: 'Siyatik sinir', en: 'sciatic nerve', lesson: 9 },
  { la: 'Oculus', tr: 'Göz', en: 'eye', lesson: 9 },
  { la: 'Retina', tr: 'Ağ tabaka', en: 'retina', lesson: 9 },
  { la: 'Cochlea', tr: 'İç kulak salyangozu', en: 'cochlea', lesson: 9 },
  // 10 · Ürogenital
  { la: 'Ren', tr: 'Böbrek', en: 'kidney', lesson: 10 },
  { la: 'Nephron', tr: 'Nefron', en: 'nephron', lesson: 10 },
  { la: 'Ureter', tr: 'İdrar borusu', en: 'ureter', lesson: 10 },
  { la: 'Vesica urinaria', tr: 'İdrar kesesi', en: 'urinary bladder', lesson: 10 },
  { la: 'Urethra', tr: 'İdrar yolu', en: 'urethra', lesson: 10 },
  { la: 'Testis', tr: 'Testis', en: 'testis', lesson: 10 },
  { la: 'Epididymis', tr: 'Epididim', en: 'epididymis', lesson: 10 },
  { la: 'Ductus deferens', tr: 'Sperm kanalı', en: 'ductus deferens', lesson: 10 },
  { la: 'Ovarium', tr: 'Over', en: 'ovary', lesson: 10 },
  { la: 'Uterus', tr: 'Rahim', en: 'uterus', lesson: 10 },
  { la: 'Tuba uterina', tr: 'Tuba uterina (fallop)', en: 'uterine tube', lesson: 10 },
  // 11 · Solunum
  { la: 'Trachea', tr: 'Soluk borusu', en: 'trachea', lesson: 11 },
  { la: 'Bronchus principalis', tr: 'Ana bronş', en: 'main bronchus', lesson: 11 },
  { la: 'Pulmo', tr: 'Akciğer', en: 'lung', lesson: 11 },
  { la: 'Pleura', tr: 'Akciğer zarı', en: 'pleura', lesson: 11 },
  { la: 'Alveolus pulmonis', tr: 'Alveol', en: 'pulmonary alveolus', lesson: 11 },
  { la: 'Larynx', tr: 'Gırtlak', en: 'larynx', lesson: 11 },
  { la: 'Pharynx', tr: 'Yutak', en: 'pharynx', lesson: 11 },
  { la: 'Mediastinum', tr: 'Mediasten', en: 'mediastinum', lesson: 11 },
];

// Türkçe karakter duyarsız eşleştirme: i/ı/İ, ş/s, ğ/g, ü/u, ö/o, ç/c ve
// Latince tarafta nadir diyakritikler aynı kefeye konur.
const FOLD_MAP = { ı: 'i', i̇: 'i', ş: 's', ğ: 'g', ü: 'u', ö: 'o', ç: 'c', â: 'a', î: 'i', û: 'u' };
export function fold(text) {
  return String(text)
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split('')
    .map(ch => FOLD_MAP[ch] || ch)
    .join('');
}

export function termsIn(lesson) {
  return TERMS.filter(term => term.lesson === lesson);
}

// Hem Latince hem Türkçe (ve İngilizce) tarafta katlanmış alt-dizgi arar.
export function searchTerms(query, limit = 8) {
  const q = fold(query.trim());
  if (q.length < 2) return [];
  return TERMS
    .map(term => ({ term, score: [term.la, term.tr, term.en].reduce((best, field, i) => {
      const f = fold(field);
      if (f === q) return Math.min(best, i);
      if (f.startsWith(q)) return Math.min(best, i + 3);
      if (f.includes(q)) return Math.min(best, i + 6);
      return best;
    }, 99) }))
    .filter(hit => hit.score < 50)
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map(hit => hit.term);
}
