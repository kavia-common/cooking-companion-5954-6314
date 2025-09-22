import { useEffect, useState } from 'react';

// PUBLIC_INTERFACE
export function useLocalStorage(key, initialValue) {
  /**
   * Persist a state value in localStorage.
   */
  const [state, setState] = useState(() => {
    try {
      const v = window.localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [key, state]);

  return [state, setState];
}
