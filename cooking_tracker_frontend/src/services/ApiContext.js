import React, { createContext, useContext, useMemo } from 'react';
import { ApiClient } from './api';

// PUBLIC_INTERFACE
export const ApiContext = createContext(null);

// PUBLIC_INTERFACE
export function ApiProvider({ baseUrl, children }) {
  /**
   * ApiProvider wraps the app and provides a configured ApiClient instance.
   * baseUrl should come from REACT_APP_API_BASE or default '/api'.
   */
  const api = useMemo(() => new ApiClient(baseUrl), [baseUrl]);
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

// PUBLIC_INTERFACE
export function useApi() {
  /** Hook to get ApiClient */
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApi must be used inside ApiProvider');
  return ctx;
}
