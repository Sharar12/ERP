// API SERVICE: ChartOfAccount
// Backend endpoints:
//   GET    /api/v1/finance/accounts         → paginated list
//   POST   /api/v1/finance/accounts         → create
//   GET    /api/v1/finance/accounts/{id}    → detail
//   PUT    /api/v1/finance/accounts/{id}    → update
//   DELETE /api/v1/finance/accounts/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { ChartOfAccount, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<ChartOfAccount>> =>
  apiFetch<PaginatedResult<ChartOfAccount>>('/finance/accounts', { params });

export const getById = async (id: string): Promise<ChartOfAccount> =>
  apiFetch<ChartOfAccount>(`/finance/accounts/${id}`);

export const create = async (data: Partial<ChartOfAccount>): Promise<ChartOfAccount> =>
  apiFetch<ChartOfAccount>('/finance/accounts', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<ChartOfAccount>): Promise<ChartOfAccount> =>
  apiFetch<ChartOfAccount>(`/finance/accounts/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/finance/accounts/${id}`, { method: 'DELETE' });
