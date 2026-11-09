// DATA PROVIDER CONFIGURATION
// Phase 3: API is now the active provider.
// To go back to mock for offline dev, change to "mock".

export const DATA_PROVIDER = 'api' as const;
export type DataProvider = 'mock' | 'api';
export const PROVIDER: DataProvider = DATA_PROVIDER;
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
