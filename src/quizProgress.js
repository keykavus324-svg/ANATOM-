// Study progress for the quiz section: attempt history, per-set mastery, weak
// topics and the review streak. Everything here is pure and storage-free, so the
// numbers shown in the hub can be tested; the React hook that persists them lives
// in src/useQuizProgress.js. Device storage stays optional — a blocked
// localStorage only means the history is not remembered, never a broken screen.
//
// Honesty limits kept in the UI: these are personal practice records of a study
// tool, not an exam grade, a diagnosis or a prediction of course success.
export const QUIZ_HISTORY_KEY = 'anatomi-quiz-history-v1';
export const HISTORY_LIMIT = 80;
export const QUIZ_MODES = ['set', 'exam', 'drill'];

const DAY = 86400000;
const isInt = (value, max) => Number.isInteger(value) && value >= 0 && value < max;

function cleanGroups(value, keyName) {
  return Array.isArray(value)
    ? value
        .filter(entry => entry && typeof entry[keyName] === 'string' && isInt(entry.correct, 1e6) && isInt(entry.total, 1e6) && entry.correct <= entry.total)
        .slice(0, 40)
        .map(entry => ({ [keyName]: entry[keyName], correct: entry.correct, total: entry.total }))
    : [];
}

// Defensive normalisation: anything stored by an older build or edited by hand is
// dropped instead of producing NaN in the mastery bars.
export function cleanHistory(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter(attempt => attempt && typeof attempt === 'object')
    .filter(attempt => isInt(attempt.correct, 1e6) && isInt(attempt.total, 1e6) && attempt.correct <= attempt.total)
    .slice(0, HISTORY_LIMIT)
    .map(attempt => ({
      id: typeof attempt.id === 'string' ? attempt.id : `a${attempt.at || Date.now()}`,
      at: isInt(attempt.at, 8640000000000000) ? attempt.at : Date.now(),
      mode: QUIZ_MODES.includes(attempt.mode) ? attempt.mode : 'set',
      setId: typeof attempt.setId === 'string' ? attempt.setId : null,
      correct: attempt.correct,
      total: attempt.total,
      seconds: isInt(attempt.seconds, 1e6) ? attempt.seconds : null,
      topics: cleanGroups(attempt.topics, 'topic'),
      sets: cleanGroups(attempt.sets, 'setId'),
    }));
}

// Newest first, capped so a long semester does not grow the record without bound.
export function recordAttempt(history, attempt, now = Date.now()) {
  const next = cleanHistory([attempt, ...cleanHistory(history)]);
  return next.slice(0, HISTORY_LIMIT).map((entry, index) => (index === 0 && entry.at > now ? { ...entry, at: now } : entry));
}

export const attemptAccuracy = attempt => (attempt.total > 0 ? attempt.correct / attempt.total : 0);

// The scores of one set, taken from dedicated attempts and from the set breakdown
// of mixed exams. Newest first.
export function setScores(history, setId) {
  const scores = [];
  for (const attempt of history) {
    if (attempt.setId === setId) scores.push({ correct: attempt.correct, total: attempt.total });
    else {
      const entry = attempt.sets.find(item => item.setId === setId);
      if (entry) scores.push({ correct: entry.correct, total: entry.total });
    }
  }
  return scores.filter(score => score.total > 0);
}

// Mastery blends what you did last with your best run, so one bad attempt does not
// erase a topic you had learned, and one lucky attempt does not mark it as mastered.
export function setMastery(history, setId) {
  const scores = setScores(history, setId);
  if (!scores.length) return { setId, attempts: 0, questions: 0, correct: 0, accuracy: 0, last: null, best: null, mastery: null };
  const accuracies = scores.map(score => score.correct / score.total);
  const last = accuracies[0];
  const best = Math.max(...accuracies);
  return {
    setId,
    attempts: scores.length,
    questions: scores.reduce((sum, score) => sum + score.total, 0),
    correct: scores.reduce((sum, score) => sum + score.correct, 0),
    accuracy: scores.reduce((sum, score) => sum + score.correct, 0) / scores.reduce((sum, score) => sum + score.total, 0),
    last,
    best,
    mastery: Math.round((0.6 * last + 0.4 * best) * 100),
  };
}

export function masteryMap(history, setIds) {
  return setIds.map(setId => setMastery(history, setId));
}

// One number for the hub ring: the mean mastery of the sets that already have data.
// Returns null until the first attempt, so the UI can say "no data yet" honestly.
export function overallMastery(history, setIds) {
  const values = masteryMap(history, setIds).filter(entry => entry.mastery !== null);
  if (!values.length) return null;
  return Math.round(values.reduce((sum, entry) => sum + entry.mastery, 0) / values.length);
}

export function coverage(history, setIds) {
  const started = masteryMap(history, setIds).filter(entry => entry.attempts > 0);
  return { started: started.length, total: setIds.length, ratio: setIds.length ? started.length / setIds.length : 0 };
}

// Every topic seen in the history, merged across attempts and sets.
export function topicMastery(history) {
  const map = new Map();
  for (const attempt of history) {
    for (const entry of attempt.topics) {
      const current = map.get(entry.topic) || { topic: entry.topic, correct: 0, total: 0, setId: attempt.setId };
      current.correct += entry.correct;
      current.total += entry.total;
      if (!current.setId && attempt.sets.length === 1) current.setId = attempt.sets[0].setId;
      map.set(entry.topic, current);
    }
  }
  return [...map.values()].map(entry => ({ ...entry, accuracy: entry.total ? entry.correct / entry.total : 0 }));
}

// Topics with enough evidence and the lowest accuracy; used for "çalışman gereken
// konular" and for the weak-topic drill paper.
export function weakTopics(history, { limit = 4, minTotal = 2 } = {}) {
  return topicMastery(history)
    .filter(entry => entry.total >= minTotal && entry.accuracy < 0.85)
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)
    .slice(0, limit);
}

export function weakSets(history, setIds, limit = 3) {
  return masteryMap(history, setIds)
    .filter(entry => entry.attempts > 0)
    .sort((a, b) => a.mastery - b.mastery || b.attempts - a.attempts)
    .slice(0, limit);
}

export function unstartedSets(history, setIds) {
  return setIds.filter(setId => setScores(history, setId).length === 0);
}

// Consecutive calendar days with at least one attempt. Today counts; if nothing was
// solved today the streak survives until the end of yesterday.
export function streakDays(history, now = Date.now()) {
  const days = new Set(history.map(attempt => Math.floor(attempt.at / DAY)));
  const today = Math.floor(now / DAY);
  let cursor = days.has(today) ? today : today - 1;
  if (!days.has(cursor)) return 0;
  let streak = 0;
  while (days.has(cursor)) { streak += 1; cursor -= 1; }
  return streak;
}

// Oldest → newest accuracies of the last attempts, for the trend strip.
export function recentTrend(history, limit = 10) {
  return history.slice(0, limit).reverse().map(attempt => ({ at: attempt.at, mode: attempt.mode, accuracy: attemptAccuracy(attempt), correct: attempt.correct, total: attempt.total }));
}

export function totals(history) {
  return {
    attempts: history.length,
    questions: history.reduce((sum, attempt) => sum + attempt.total, 0),
    correct: history.reduce((sum, attempt) => sum + attempt.correct, 0),
    seconds: history.reduce((sum, attempt) => sum + (attempt.seconds || 0), 0),
  };
}

// Build the record that gets written after a finished paper.
export function makeAttemptRecord({ mode, setId = null, result, setScores: sets = [], seconds = null, now = Date.now(), random = Math.random }) {
  return {
    id: `a${now.toString(36)}${Math.floor(random() * 1e6).toString(36)}`,
    at: now,
    mode,
    setId,
    correct: result.correct,
    total: result.total,
    seconds: Number.isInteger(seconds) ? seconds : null,
    topics: result.topics.map(topic => ({ topic: topic.topic, correct: topic.correct, total: topic.total })),
    sets: sets.filter(entry => entry.total > 0).map(entry => ({ setId: entry.setId, correct: entry.correct, total: entry.total })),
  };
}
