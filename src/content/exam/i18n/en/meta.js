// English text for the archive review notes, the review date and the six
// exam-teaching figures (src/content/exam/index.js and exam/visuals.js).
export default {
  reviewDate: '15 October 2026',
  sources: {
    summary: { review: 'Text extraction was reviewed; answers given as figures were not treated as an independent answer key.' },
    sorular: { review: 'Full text reviewed. Duplicated, incorrect and ambiguous answers were marked.' },
    b: { review: 'Image pages reviewed. Some screenshots carry the name of Çankırı Karatekin University; they are not all presented as this instructor’s exam.' },
    sinav: { review: 'Image pages reviewed. Some lines of the multi-question photograph on page 3 are illegible; no definite answers were produced from those lines.' },
    vize: { review: 'Images reviewed; handwritten marks were not accepted as a verified answer key.' },
    final1: { review: 'The cortex, cranial nerve and meninges topics legible in the photograph were reviewed. Scored-out or blurred lines and some arrow targets remain unclear.' },
    final2: { review: 'The legible tongue, jejunum, portal circulation, colon, pancreas and cartilage topics were reviewed; not all small vessel numbers could be labelled with certainty.' },
    ornek5: { review: 'The figure of two-joint muscles, rectus femoris and the leg muscles was reviewed.' },
    ornek6: { review: 'The iliopsoas, levator scapulae and rhomboid figures were reviewed.' },
    ornek7: { review: 'The figures of the subscapularis and orbicularis muscles were reviewed.' }
  },
  visuals: {
    'carpal-map': {
      title: 'A direction map of the carpal bones',
      caption: 'A conceptual layout as seen from the palmar side of the right hand: distal at the top, the radius / thumb side on the left. The bones are shown as blocks, not their real outlines or sizes. The pisiform is shown as a small circle overlapping the palmar side of the triquetrum.',
      labels: [
        'Scaphoid: the radial end of the proximal row.',
        'Lunate: the medial neighbour of the scaphoid.',
        'Triquetrum: on the ulnar side of the proximal row.',
        'Pisiform: palmar to the triquetrum; it is not a fourth block on the same straight line.',
        'Trapezium: articulates with the first metacarpal in the distal row.',
        'Trapezoid: medial to the trapezium.',
        'Capitate: in the middle of the distal row.',
        'Hamate: on the ulnar side of the distal row.'
      ]
    },
    'distal-humerus': {
      title: 'Articular surfaces and fossae of the distal humerus',
      caption: 'The anterior and posterior surfaces are separate schematic views. The lateral–medial directions are written on each view. Size, perspective and bone contour are simplified; compare with an atlas to recognise the real bone.',
      labels: [
        'Capitulum: the anterolateral articular surface, in contact with the head of the radius.',
        'Trochlea: the medial spool, in contact with the ulna.',
        'Radial fossa: on the anterior surface above the capitulum.',
        'Coronoid fossa: on the anterior surface above the trochlea.',
        'Olecranon fossa: the large depression on the posterior surface.',
        'Coronoid process: on the ulna, not the humerus; shown separately in the text box.'
      ]
    },
    'cuff-map': {
      title: 'How the rotator cuff muscles relate to the scapula',
      caption: 'The left panel is a conceptual map of the posterior surface of the scapula and the right panel of the anterior / costal surface. The coloured areas approximately show where each muscle arises; they are not the real muscle contour, fibre direction or scale. Distinguish the lateral border relationship of teres minor from the anterior surface relationship of subscapularis.',
      labels: [
        'Supraspinatus: the fossa above the spine on the posterior surface.',
        'Infraspinatus: the broad fossa below the spine on the posterior surface.',
        'Teres minor: along the lateral border, below the infraspinatus.',
        'Subscapularis: the fossa on the anterior / costal surface.',
        'Spina scapulae: the bony ridge separating the posterior fossae; it is not a muscle.'
      ]
    },
    'hyoid-map': {
      title: 'The two muscle groups around the hyoid',
      caption: 'This is a grouping diagram; it is not the real course, attachment line or depth of the muscles. The suprahyoid names are given above and the infrahyoid names below. For the different bone and cartilage attachments of each, read the table in the text.',
      labels: [
        'Suprahyoid: mylohyoid, geniohyoid, stylohyoid, digastric.',
        'Hyoid: the reference bone that names the grouping.',
        'Infrahyoid: sternohyoid, omohyoid, sternothyroid, thyrohyoid.',
        'Thyrohyoid: despite its name it is not in the upper group; it lies between thyroid cartilage and hyoid.'
      ]
    },
    'portal-map': {
      title: 'In the liver: two blood entries, one venous exit',
      caption: 'A flow diagram showing the direction of connections rather than organ positions. Follow the blood flow of the portal vein and hepatic artery uniting in the sinusoids. The bile route is not included in this blood flow diagram.',
      labels: [
        'Capillaries of the digestive organs: the first capillary bed of the portal circulation.',
        'V. portae: brings venous blood to the liver.',
        'A. hepatica propria: a separate arterial entry.',
        'Hepatic sinusoids: the second capillary bed the blood passes through.',
        'Vv. hepaticae: the venous route leaving the liver.',
        'V. cava inferior: the systemic vessel the hepatic veins reach.'
      ]
    },
    'cortex-map': {
      title: 'The two sides of the central sulcus',
      caption: 'A simplified direction map of the lateral surface of the left hemisphere: anterior on the left, posterior on the right. The colour bands highlight approximate regional relationships; this is not a one-to-one atlas drawing of real cortical area boundaries or gyri.',
      labels: [
        'Sulcus centralis: the boundary between the frontal and parietal lobes.',
        'Gyrus precentralis: the primary motor area in front of the sulcus.',
        'Gyrus postcentralis: the primary somatosensory area behind the sulcus.',
        'Sulcus lateralis: the prominent sulcus at the upper border of the temporal lobe.',
        'Occipital lobe: the posterior region; the primary visual area lies mainly on the medial surface and is not shown directly in this lateral drawing.'
      ]
    }
  },
  locators: {
    ['Patella sorusu']: 'Patella question',
    ['Syndesmosis ve sinoviyal eklem soruları']: 'Syndesmosis and synovial joint questions',
    ['Art. cubiti sorusu']: 'Art. cubiti question',
    ['şekil tanıma']: 'figure recognition',
    ['Linea terminalis sorusu']: 'Linea terminalis question',
    ['Sinerjist, kontraksiyon ve retinaculum soruları']: 'Synergist, contraction and retinaculum questions',
    ['Mimik, çiğneme, buccinator ve trigeminus soruları']: 'Facial expression, chewing, buccinator and trigeminal questions',
    ['Suprahyoid ve infrahyoid tekrarları']: 'Suprahyoid and infrahyoid repeats',
    ['Scapula elevasyonu, erector spinae ve accessorius']: 'Scapular elevation, erector spinae and accessory nerve',
    ['kas tanıma']: 'muscle recognition',
    ['Cuff ve teres minor soruları']: 'Cuff and teres minor questions',
    ['Önkol yüzeyel tabaka ve tenar soruları']: 'Superficial forearm layer and thenar questions',
    ['iliopsoas şekli']: 'iliopsoas figure',
    ['iki eklem ve bacak']: 'two joints and the leg',
    ['Ayağın ekstansörü sorusu']: '“Extensor of the foot” question',
    ['Trigeminus ve accessorius soruları']: 'Trigeminal and accessory nerve questions',
  }

};
