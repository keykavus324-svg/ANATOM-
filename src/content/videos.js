// Video ders kataloğu.
//
// Videolar NotebookLM ile, web konu anlatımlarıyla aynı kaynak notlardan üretilir ve
// hocanın Google Drive klasöründe yayınlanır. Burada yalnızca Drive dosya kimlikleri ve
// künye bilgileri tutulur; video dosyaları depoya kopyalanmaz, Drive üzerinden oynatılır.
// Bu dosya düz JavaScript'tir; testler JSX dönüşümü olmadan okuyabilir.

export const VIDEO_FOLDER_ID = '1bl7GLkQLamaQs3djc3fiSGd97mZnjKMq';
export const VIDEO_FOLDER_URL = `https://drive.google.com/drive/folders/${VIDEO_FOLDER_ID}`;
export const drivePreviewUrl = id => `https://drive.google.com/file/d/${id}/preview`;
export const driveViewUrl = id => `https://drive.google.com/file/d/${id}/view`;

// Klasördeki tam ders filmi: on iki dersin kesintisiz birleşik kaydı.
export const FEATURED_VIDEO_ID = '1dtCODZugtKZz6PcNCTjybim2SNHhViPV';

// seconds: Drive'daki kaydın süresi. Ders 1 altı ayrı parça hâlinde yayınlanır.
const entries = {
  0: {
    id: FEATURED_VIDEO_ID,
    seconds: 16492,
    pages: '12 ders · birleşik',
    summary: {
      tr: 'On iki dersin kesintisiz birleşik kaydı. Sınav öncesinde bütün konuları tek oturumda tekrar etmek için.',
      en: 'An uninterrupted merge of all twelve lessons — for revising the whole course in one sitting before an exam.',
      ar: 'تسجيل متواصل يجمع الدروس الاثني عشر كلها لمراجعة المقرر كاملًا في جلسة واحدة.',
    },
  },
  1: {
    id: '1xnxVpsEOom-IP9YrAQHH-4fybrlB8Ynr',
    seconds: 4199,
    pages: '55 sayfa · 6 parça',
    clips: [
      { id: '1xnxVpsEOom-IP9YrAQHH-4fybrlB8Ynr', label: 'Sayfa 01–03', seconds: 233 },
      { id: '1PWPBJu66DkPteRfr_xfP7RcRzCdgblSv', label: 'Sayfa 04–13', seconds: 796 },
      { id: '1zmI3DbFs62NDQpJe0D8Fp1hRu331cWPU', label: 'Sayfa 14–23', seconds: 770 },
      { id: '1wY9gF5Wd2hlbU53d1NQhGbm-Yy7PG77j', label: 'Sayfa 24–36', seconds: 778 },
      { id: '1hy7ahhHSsK3xxiWcbpT6xGahY7VXqJ3m', label: 'Sayfa 37–47', seconds: 862 },
      { id: '1bW8Gs94UV84C9eClzYn1I7c5ALFHFCzv', label: 'Sayfa 48–55', seconds: 760 },
    ],
    summary: {
      tr: 'Anatomik duruş, düzlemler, eksenler ve terminoloji; sonunda Latince terimleri okuma alışkanlığı.',
      en: 'Anatomical position, planes, axes and terminology, ending with the habit of reading Latin terms.',
      ar: 'الوضع التشريحي والمستويات والمحاور والمصطلحات، ثم عادة قراءة المصطلحات اللاتينية.',
    },
  },
  2: {
    id: '1AEy3XIMehLkLyq099M2wfyHC8nHmooIG',
    seconds: 1829,
    pages: '69 sayfa',
    summary: {
      tr: 'Kemik, eklem ve kasın birlikte çalışması; kemik tipleri, büyüme ve yüzey işaretleri.',
      en: 'How bone, joint and muscle work together: bone types, growth and surface markings.',
      ar: 'عمل العظم والمفصل والعضلة معًا: أنواع العظام والنمو والمعالم السطحية.',
    },
  },
  3: {
    id: '1WDUbR6335ByHTPJnTylv16j1fOpmzcyE',
    seconds: 1885,
    pages: '58 sayfa',
    summary: {
      tr: 'Eklem sınıflaması, sinoviyal eklemin bileşenleri ve ekstremite eklemlerinin hareketleri.',
      en: 'Joint classification, the components of a synovial joint and the movements of limb joints.',
      ar: 'تصنيف المفاصل ومكوّنات المفصل الزليلي وحركات مفاصل الأطراف.',
    },
  },
  4: {
    id: '1aRfFmHGQyWuIuITP2bBWqAVkpU4k3VV9',
    seconds: 1777,
    pages: '49 sayfa',
    summary: {
      tr: 'Omuz kuşağından ele, kalçadan ayağa; üst ve alt ekstremite kemiklerinin zinciri.',
      en: 'From shoulder girdle to hand and from hip to foot: the bone chain of both limbs.',
      ar: 'من حزام الكتف إلى اليد ومن الورك إلى القدم: سلسلة عظام الطرفين.',
    },
  },
  5: {
    id: '1P2eAriiz5N-FEDdoIMe-UX4TpVUZb8Tf',
    seconds: 1956,
    pages: '67 sayfa',
    summary: {
      tr: 'Kafa kemikleri beş görünümde, omurganın bölümleri, kaburgalar ve sternum.',
      en: 'Skull bones in five views, the regions of the vertebral column, ribs and sternum.',
      ar: 'عظام الجمجمة من خمسة مناظر وأقسام العمود الفقري والأضلاع والقص.',
    },
  },
  6: {
    id: '1AjoyxjvHOk-UZa-HVNz6m0Zk3XtsXnK0',
    seconds: 2995,
    pages: '86 sayfa',
    summary: {
      tr: 'Kasın liften bütüne kuruluşu, origo–insersiyo mantığı ve bölge bölge bütün kaslar.',
      en: 'Muscle from fibre to whole, the origin–insertion logic and every regional muscle group.',
      ar: 'بنية العضلة من الليف إلى الكل ومنطق المنشأ والمدخل وجميع المجموعات العضلية.',
    },
  },
  7: {
    id: '1nQb5155V0yfONhNmIRHdPIh87js24TXQ',
    seconds: 2022,
    pages: '51 sayfa',
    summary: {
      tr: 'Kalbin boşlukları, kapakları ve koroner dolaşımı; büyük ve küçük dolaşımın birleşmesi.',
      en: 'Cardiac chambers, valves and coronary circulation; how the systemic and pulmonary circuits join.',
      ar: 'حجرات القلب وصماماته والدوران التاجي، وكيف يتصل الدوران الكبير بالصغير.',
    },
  },
};

export const lessonVideos = Object.entries(entries).map(([number, entry]) => ({
  lesson: Number(number),
  pages: entry.pages,
  seconds: entry.seconds,
  id: entry.id,
  // Dersin ilk parçası; tek parça derslerde kaydın kendisi.
  playId: entry.clips ? entry.clips[0].id : entry.id,
  clips: entry.clips || null,
  partCount: entry.clips ? entry.clips.length : 1,
  minutes: Math.max(1, Math.round(entry.seconds / 60)),
  summary: entry.summary,
}));

export function formatDuration(seconds) {
  const total = Math.max(1, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) return `${hours} sa ${String(minutes).padStart(2, '0')} dk`;
  if (minutes > 0) return `${minutes} dk ${String(secs).padStart(2, '0')} sn`;
  return `${secs} sn`;
}

export function videoForLesson(number) {
  return lessonVideos.find(video => video.lesson === Number(number)) || null;
}

export function featuredVideo() {
  return lessonVideos.find(video => video.id === FEATURED_VIDEO_ID) || null;
}

export function courseVideos() {
  return lessonVideos.filter(video => video.lesson !== 0);
}

// Kaydı henüz Drive klasörüne eklenmemiş dersler. Bu dersler sayfada “hazırlanıyor”
// olarak listelenir; video eklendiğinde yukarıdaki kataloğa bir satır eklemek yeterlidir.
export const pendingLessons = [8, 9, 10, 11].filter(number => !videoForLesson(number));

export const totalVideoSeconds = courseVideos().reduce((sum, video) => sum + video.seconds, 0);
