import { useEffect, useState } from 'react';
import { loadCatalog } from '../api/openLibrary.js';

// Loads one catalog page. AbortController cancels outdated requests so a slow
// earlier search can never overwrite a newer one (race-condition guard).
export function useBooks({ q = '', category = '', page = 1 }) {
  const [state, setState] = useState({ status: 'loading', books: [], total: 0, source: 'live', error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setState((s) => ({ ...s, status: 'loading' }));
    loadCatalog({ q, category, page, signal: ctrl.signal })
      .then((r) => { if (!ctrl.signal.aborted) setState({ status: 'ready', ...r }); })
      .catch((e) => {
        if (!ctrl.signal.aborted) setState({ status: 'error', books: [], total: 0, source: 'fallback', error: e.message });
      });
    return () => ctrl.abort();
  }, [q, category, page, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
