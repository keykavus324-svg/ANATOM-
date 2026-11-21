import test from 'node:test';
import assert from 'node:assert/strict';
import {
  QUIZ_HISTORY_KEY, HISTORY_LIMIT, QUIZ_MODES, cleanHistory, recordAttempt, attemptAccuracy,
  setScores, setMastery, masteryMap, overallMastery, coverage, topicMastery, weakTopics,
  weakSets, unstartedSets, streakDays, recentTrend, totals, makeAttemptRecord,
} from '../src/quizProgress.js';
import { quizSets, quizQuestions } from '../src/content/quizBank.js';
import { parseExamScope, examHash, routeFromHash } from '../src/routing.js';
import { buildAttempt, gradeAttempt, gradeBySet } from '../src/quiz.js';

const SET_IDS = quizSets.map(set => set.id);
const DAY = 86400000;
const NOW = Date.UTC(2026, 10, 21, 12, 0, 0);

// A realistic record: one solved set plus one mixed exam that touched three sets.
const setAttempt = {
  id: 'a1', at: NOW - 2 * DAY, mode: 'set', setId: 'dolasim', correct: 7, total: 10, seconds: 240,
  topics: [{ topic: 'Kalp boşlukları', correct: 3, total: 4 }, { topic: 'Dolaşım yolları', correct: 4, total: 6 }],
  sets: [{ setId: 'dolasim', correct: 7, total: 10 }],
};
const examAttempt = {
  id: 'a2', at: NOW - DAY, mode: 'exam', setId: null, correct: 12, total: 20, seconds: 780,
  topics: [{ topic: 'Kalp boşlukları', correct: 1, total: 4 }, { topic: 'Eklem tipleri', correct: 2, total: 6 }, { topic: 'Villus', correct: 1, total: 2 }],
  sets: [{ setId: 'dolasim', correct: 4, total: 7 }, { setId: 'eklem', correct: 4, total: 7 }, { setId: 'sindirim', correct: 4, total: 6 }],
};
const history = cleanHistory([examAttempt, setAttempt]);

test('the storage contract names the key, the cap and the allowed modes', () => {
  assert.equal(QUIZ_HISTORY_KEY, 'anatomi-quiz-history-v1');
  assert.equal(HISTORY_LIMIT, 80);
  assert.deepEqual(QUIZ_MODES, ['set', 'exam', 'drill']);
});

test('cleaning drops anything that could produce NaN in the mastery bars', () => {
  assert.deepEqual(cleanHistory(null), []);
  assert.deepEqual(cleanHistory('nope'), []);
  const messy = cleanHistory([
    null, 7, 'attempt', {},
    // An attempt with more correct than total cannot be graded and is dropped.
    { correct: 12, total: 5, at: NOW },
    // A half-broken record is repaired field by field instead of poisoning the bars.
    { correct: 4, total: 10, at: 'yesterday', mode: 'magic', setId: 12, seconds: -3, topics: 'x', sets: [{ setId: 'dolasim', correct: 9, total: 3 }] },
    setAttempt,
  ]);
  assert.equal(messy.length, 2);
  const repaired = messy[0];
  assert.equal(repaired.correct, 4);
  assert.equal(repaired.total, 10);
  assert.equal(repaired.mode, 'set', 'an unknown mode falls back to a set attempt');
  assert.equal(repaired.setId, null, 'a non-string set id is dropped');
  assert.equal(repaired.seconds, null, 'a negative duration is dropped');
  assert.deepEqual(repaired.topics, [], 'a non-array topic list is dropped');
  assert.deepEqual(repaired.sets, [], 'a group scoring more correct than total is dropped');
  assert.ok(Number.isInteger(repaired.at) && repaired.at > 0, 'an unparsable timestamp becomes now');
  const kept = messy[1];
  assert.equal(kept.mode, 'set');
  assert.equal(kept.setId, 'dolasim');
  assert.equal(kept.at, setAttempt.at);
  assert.deepEqual(kept.sets, [{ setId: 'dolasim', correct: 7, total: 10 }]);
  assert.deepEqual(kept.topics, setAttempt.topics);
  // a wrong mode falls back to a set attempt, a missing id is derived
  const fallback = cleanHistory([{ correct: 1, total: 2, at: NOW, mode: 'weird' }])[0];
  assert.equal(fallback.mode, 'set');
  assert.equal(fallback.setId, null);
  assert.ok(fallback.id.length > 1);
});

test('recording keeps the newest first and never grows past the cap', () => {
  const long = Array.from({ length: HISTORY_LIMIT }, (_, i) => ({ id: `old${i}`, at: NOW - (i + 5) * DAY, correct: 1, total: 2, mode: 'set', setId: 'temel', topics: [], sets: [] }));
  const next = recordAttempt(long, { id: 'new', at: NOW + 10, correct: 2, total: 2, mode: 'exam', setId: null, topics: [], sets: [] }, NOW);
  assert.equal(next.length, HISTORY_LIMIT);
  assert.equal(next[0].id, 'new');
  assert.ok(next[0].at <= NOW, 'a clock from the future is clamped to now');
  assert.ok(next.every((entry, i) => i === 0 || entry.at <= next[i - 1].at), 'newest first');
  assert.deepEqual(recordAttempt([], null), []);
});

test('set scores merge dedicated attempts with the set breakdown of mixed exams', () => {
  const scores = setScores(history, 'dolasim');
  assert.deepEqual(scores, [{ correct: 4, total: 7 }, { correct: 7, total: 10 }]);
  assert.deepEqual(setScores(history, 'olmayan'), []);
  assert.equal(attemptAccuracy({ correct: 3, total: 4 }), 0.75);
  assert.equal(attemptAccuracy({ correct: 0, total: 0 }), 0);
});

test('mastery blends the last run with the best run', () => {
  const mastery = setMastery(history, 'dolasim');
  assert.equal(mastery.attempts, 2);
  assert.equal(mastery.questions, 17);
  assert.equal(mastery.correct, 11);
  assert.equal(mastery.last, 4 / 7);
  assert.equal(mastery.best, 7 / 10);
  assert.equal(mastery.mastery, Math.round((0.6 * (4 / 7) + 0.4 * (7 / 10)) * 100));
  // One bad run does not erase what was learned; one lucky run does not mark it mastered.
  const lucky = setMastery(cleanHistory([{ correct: 10, total: 10, at: NOW, setId: 'dolasim', topics: [], sets: [] }]), 'dolasim');
  assert.equal(lucky.mastery, 100);
  const mixed = setMastery(cleanHistory([{ correct: 1, total: 10, at: NOW, setId: 'dolasim', topics: [], sets: [] }, { correct: 10, total: 10, at: NOW - DAY, setId: 'dolasim', topics: [], sets: [] }]), 'dolasim');
  assert.equal(mixed.mastery, Math.round((0.6 * 0.1 + 0.4 * 1) * 100));
  const empty = setMastery([], 'dolasim');
  assert.equal(empty.mastery, null);
  assert.equal(empty.attempts, 0);
});

test('the hub numbers stay honest before the first attempt', () => {
  assert.equal(overallMastery([], SET_IDS), null);
  assert.deepEqual(coverage([], SET_IDS), { started: 0, total: SET_IDS.length, ratio: 0 });
  assert.deepEqual(totals([]), { attempts: 0, questions: 0, correct: 0, seconds: 0 });
  assert.deepEqual(recentTrend([]), []);
  assert.equal(unstartedSets([], SET_IDS).length, SET_IDS.length);
  assert.deepEqual(weakTopics([]), []);
  assert.deepEqual(weakSets([], SET_IDS), []);
  // The hub ring is the mean mastery of the three sets this history touched.
  assert.equal(overallMastery(history, SET_IDS), 62);
  const cover = coverage(history, SET_IDS);
  assert.deepEqual(cover, { started: 3, total: 12, ratio: 0.25 });
  assert.deepEqual(unstartedSets(history, SET_IDS).slice(0, 3), ['temel', 'hareket', 'ekstremite']);
});

test('weak topics carry enough evidence and are ordered weakest first', () => {
  const weak = weakTopics(history, { limit: 4, minTotal: 2 });
  assert.deepEqual(weak.map(entry => entry.topic), ['Eklem tipleri', 'Kalp boşlukları', 'Villus', 'Dolaşım yolları']);
  for (let i = 1; i < weak.length; i++) assert.ok(weak[i - 1].accuracy <= weak[i].accuracy);
  const kalp = weak.find(entry => entry.topic === 'Kalp boşlukları');
  assert.equal(kalp.total, 8); // 4 from the set attempt plus 4 from the exam
  assert.equal(kalp.correct, 4);
  assert.ok(kalp.total > weak[2].total, 'an equal accuracy ranks the topic with more evidence first');
  // A single question is not evidence; raising the floor hides it.
  assert.deepEqual(weakTopics(history, { minTotal: 9 }).map(entry => entry.topic), []);
  assert.deepEqual(weakTopics(history, { limit: 1 }).length, 1);
  const strong = cleanHistory([{ id: 'a', at: NOW, correct: 20, total: 20, topics: [{ topic: 'Tam', correct: 20, total: 20 }], sets: [] }]);
  assert.deepEqual(weakTopics(strong), [], 'a topic above 85% is not called weak');
});

test('weak sets rank by mastery and the trend strip reads oldest to newest', () => {
  const weakest = weakSets(history, SET_IDS, 3).map(entry => entry.setId);
  assert.deepEqual(weakest, ['eklem', 'dolasim', 'sindirim']);
  assert.deepEqual(weakSets(history, SET_IDS, 2).map(entry => entry.setId), ['eklem', 'dolasim']);
  assert.equal(weakSets(history, SET_IDS, 99).length, 3, 'only sets with attempts are ranked');
  const trend = recentTrend(history, 10);
  assert.deepEqual(trend.map(point => point.mode), ['set', 'exam']);
  assert.ok(trend[0].at < trend[1].at, 'the strip reads oldest to newest');
  assert.equal(trend[0].at, setAttempt.at);
  assert.equal(trend[1].accuracy, 12 / 20);
  assert.equal(recentTrend(history, 1).length, 1);
  const summary = totals(history);
  assert.deepEqual(summary, { attempts: 2, questions: 30, correct: 19, seconds: 1020 });
  assert.deepEqual(masteryMap(history, ['dolasim', 'temel']).map(entry => entry.setId), ['dolasim', 'temel']);
});

test('the streak counts consecutive days and survives a quiet morning', () => {
  const day = at => ({ id: `d${at}`, at, correct: 1, total: 2, mode: 'set', setId: 'temel', topics: [], sets: [] });
  const three = cleanHistory([day(NOW), day(NOW - DAY), day(NOW - 2 * DAY)]);
  assert.equal(streakDays(three, NOW), 3);
  assert.equal(streakDays(three, NOW + 3 * 60 * 60 * 1000), 3, 'the same calendar day keeps the streak');
  const quiet = cleanHistory([day(NOW - DAY), day(NOW - 2 * DAY)]);
  assert.equal(streakDays(quiet, NOW), 2, 'nothing solved yet today still counts yesterday');
  assert.equal(streakDays(quiet, NOW + DAY), 0, 'a missed day breaks the streak');
  assert.equal(streakDays([], NOW), 0);
  const gapped = cleanHistory([day(NOW), day(NOW - 2 * DAY)]);
  assert.equal(streakDays(gapped, NOW), 1);
});

test('a finished paper produces a record the hub can read back', () => {
  const paper = buildAttempt(quizQuestions.dolasim, () => 0.5);
  const answers = Object.fromEntries(paper.map(question => [question.id, question.correct]));
  const result = gradeAttempt(paper, answers);
  const record = makeAttemptRecord({
    mode: 'set',
    setId: 'dolasim',
    result,
    setScores: gradeBySet(paper.map(question => ({ ...question, setId: 'dolasim' })), answers),
    seconds: 130,
    now: NOW,
    random: () => 0.25,
  });
  assert.equal(record.correct, 10);
  assert.equal(record.total, 10);
  assert.equal(record.seconds, 130);
  assert.equal(record.at, NOW);
  assert.ok(record.id.startsWith(`a${NOW.toString(36)}`));
  assert.equal(record.topics.length, new Set(paper.map(question => question.topic)).size);
  assert.deepEqual(record.sets, [{ setId: 'dolasim', correct: 10, total: 10 }]);
  assert.equal(setMastery(cleanHistory([record]), 'dolasim').mastery, 100);
  // A mixed exam record keeps no single set id but still feeds every set it touched.
  const mixed = makeAttemptRecord({ mode: 'exam', result, setScores: [{ setId: 'dolasim', correct: 6, total: 6 }, { setId: 'eklem', correct: 0, total: 0 }], now: NOW, random: () => 0.5 });
  assert.equal(mixed.setId, null);
  assert.deepEqual(mixed.sets, [{ setId: 'dolasim', correct: 6, total: 6 }], 'empty group scores are dropped');
  assert.equal(makeAttemptRecord({ mode: 'drill', result, now: NOW, random: () => 0.1 }).seconds, null);
});

test('the exam simulator has an addressable scope and stale links fall back safely', () => {
  assert.deepEqual(parseExamScope(''), { scope: 'all', setId: null, key: '' });
  assert.deepEqual(parseExamScope('?k=weak'), { scope: 'weak', setId: null, key: 'weak' });
  assert.deepEqual(parseExamScope('?k=sindirim'), { scope: 'set', setId: 'sindirim', key: 'sindirim' });
  assert.deepEqual(parseExamScope('?k=olmayan'), { scope: 'all', setId: null, key: '' });
  assert.equal(examHash(''), '#/sinav');
  assert.equal(examHash('weak'), '#/sinav?k=weak');
  assert.equal(examHash('dolasim'), '#/sinav?k=dolasim');
  assert.equal(routeFromHash('#/sinav').page, 'exam');
  assert.deepEqual(routeFromHash('#/sinav').exam, parseExamScope(''));
  assert.equal(routeFromHash('#/sinav?k=weak').exam.scope, 'weak');
  assert.equal(routeFromHash('#/sinav?k=eklem').exam.setId, 'eklem');
  assert.equal(routeFromHash('#/quizler').exam, null);
  assert.equal(routeFromHash('#/').page, 'home');
  assert.equal(examHash(parseExamScope('?k=urogenital').key), '#/sinav?k=urogenital');
});
