// DATA PROVIDER CONFIGURATION
// Universal ERP is 100% connected to the real PHP Laravel backend and MySQL database.
// No mock data.

export const DATA_PROVIDER = 'api' as const;
export type DataProvider = 'api';
export const PROVIDER: DataProvider = 'api';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
