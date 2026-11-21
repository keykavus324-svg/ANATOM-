import { useCallback, useEffect, useState } from 'react';
import { QUIZ_HISTORY_KEY, cleanHistory, recordAttempt } from './quizProgress.js';

// Device-local attempt history for the quiz section. Storage is optional: when the
// browser blocks it the hook keeps working in memory and reports `storageError`,
// which the pages turn into a short, honest notice instead of a broken screen.
export function useQuizProgress() {
  const [history, setHistory] = useState(() => {
    try { return cleanHistory(JSON.parse(localStorage.getItem(QUIZ_HISTORY_KEY))); } catch { return []; }
  });
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try { localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history)); } catch { setStorageError(true); }
  }, [history]);
  const record = useCallback(attempt => setHistory(previous => recordAttempt(previous, attempt)), []);
  const reset = useCallback(() => setHistory([]), []);
  return { history, record, reset, storageError };
}
