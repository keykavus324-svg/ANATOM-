import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  knowledgeQuestions,
  visualQuestions,
  questionBank,
  makeSession,
  cleanNotebook,
  recordAnswer,
  dueQuestions,
  gradeSession,
} from "../src/practice.js";
import { lessons } from "../src/lessons.js";
import { diagrams } from "../src/content/diagrams.js";
import { routeFromHash, pageHash } from "../src/routing.js";

test("practice bank retains real lesson anchors, numbered visual keys and valid unique choices", () => {
  assert.equal(knowledgeQuestions.length, 42);
  assert.equal(
    new Set(questionBank.map((q) => q.id)).size,
    questionBank.length,
  );
  assert.equal(new Set(visualQuestions.map((q) => q.diagram)).size, 26);
  for (const q of questionBank) {
    assert.ok(lessons[q.lesson].sections.some((s) => s.id === q.section));
    assert.ok(q.options.length >= 3);
    assert.equal(new Set(q.options).size, q.options.length);
    assert.ok(q.correct >= 0 && q.correct < q.options.length);
    if (q.kind === "visual") {
      assert.equal(
        q.options[q.correct],
        diagrams[q.diagram].labels[q.marker - 1].name,
      );
      const svg = readFileSync(
        new URL(`../public/diagrams/${q.diagram}.svg`, import.meta.url),
        "utf8",
      );
      assert.ok(svg.includes(`>${q.marker}</text>`), q.id);
    }
  }
});
test("session sampling and option shuffling preserve correct answers without mutating authored data", () => {
  const before = JSON.stringify(questionBank);
  const session = makeSession(questionBank, 20, () => 0.3);
  assert.equal(session.length, 20);
  assert.equal(new Set(session.map((q) => q.id)).size, 20);
  for (const q of session) {
    const original = questionBank.find((item) => item.id === q.id);
    assert.equal(q.options[q.correct], original.options[original.correct]);
  }
  assert.equal(JSON.stringify(questionBank), before);
  assert.equal(makeSession(knowledgeQuestions, 100).length, 42);
  assert.equal(makeSession([], 10).length, 0);
});
test("wrong or blank responses become due tomorrow; repeated correct retrieval expands the interval", () => {
  const id = questionBank[0].id,
    now = 1800000000000,
    day = 86400000;
  assert.deepEqual(recordAnswer({}, id, true, now), {});
  let state = recordAnswer({}, id, false, now);
  assert.deepEqual(state[id], { misses: 1, streak: 0, due: now + day });
  assert.equal(dueQuestions(state, now).length, 0);
  assert.equal(dueQuestions(state, now + day).length, 1);
  for (const days of [1, 3, 7, 14, 30, 30]) {
    state = recordAnswer(state, id, true, now);
    assert.equal(state[id].due, now + days * day);
  }
  state = recordAnswer(state, id, false, now);
  assert.equal(state[id].streak, 0);
  assert.equal(state[id].misses, 2);
  assert.equal(state[id].due, now + day);
  assert.deepEqual(recordAnswer(state, "not-a-question", false), state);
});
test("notebook hydration rejects malformed, outdated and non-finite records", () => {
  const id = questionBank[0].id;
  const good = { misses: 2, streak: 1, due: 123 };
  assert.deepEqual(
    cleanNotebook({
      [id]: { ...good, extra: "discard" },
      unknown: good,
      constructor: good,
    }),
    { [id]: good },
  );
  for (const bad of [
    null,
    [],
    {},
    { misses: 0, streak: 0, due: 1 },
    { misses: 1, streak: -1, due: 1 },
    { misses: 1, streak: 1, due: Infinity },
  ])
    assert.deepEqual(cleanNotebook({ [id]: bad }), {});
});
test("exam grading distinguishes wrong answers from blanks and gives lesson-level totals", () => {
  const sample = makeSession(knowledgeQuestions, 3, () => 0.8);
  const answers = {
    [sample[0].id]: sample[0].correct,
    [sample[1].id]: (sample[1].correct + 1) % sample[1].options.length,
  };
  const result = gradeSession(sample, answers);
  assert.equal(result.correct, 1);
  assert.equal(result.answered, 2);
  assert.equal(result.blank, 1);
  assert.equal(result.wrong, 1);
  assert.equal(
    result.topics.reduce((n, t) => n + t.total, 0),
    3,
  );
  assert.equal(
    result.topics.reduce((n, t) => n + t.correct, 0),
    1,
  );
});
test("practice route round-trips without disturbing lesson and PDF-related catalog data", () => {
  assert.equal(pageHash("practice"), "#/calis");
  assert.equal(routeFromHash("#/calis").page, "practice");
  assert.equal(routeFromHash("#/ders/8").lesson.number, 8);
});
