// Pure quiz engine for the native quiz section. Deterministic under an
// injected random source so tests can pin shuffles; options are reshuffled
// once per attempt and stay stable while the visitor reviews a question.
export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function buildAttempt(questions, random = Math.random) {
  return shuffle(questions, random).map(q => {
    const order = shuffle(q.options.map((_, i) => i), random);
    return { ...q, options: order.map(i => q.options[i]), correct: order.indexOf(q.correct) };
  });
}
export function gradeAttempt(questions, answers) {
  const correct = questions.filter(q => answers[q.id] === q.correct).length;
  return {
    correct,
    total: questions.length,
    wrong: questions.length - correct,
    topics: [...new Set(questions.map(q => q.topic))].map(topic => {
      const group = questions.filter(q => q.topic === topic);
      return { topic, total: group.length, correct: group.filter(q => answers[q.id] === q.correct).length };
    }),
  };
}
