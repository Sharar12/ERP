// API SERVICE: SalesReturn
// Backend endpoints:
//   GET    /api/v1/sales/returns         → paginated list
//   POST   /api/v1/sales/returns         → create
//   GET    /api/v1/sales/returns/{id}    → detail
//   PUT    /api/v1/sales/returns/{id}    → update
//   DELETE /api/v1/sales/returns/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { SalesReturn, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<SalesReturn>> =>
  apiFetch<PaginatedResult<SalesReturn>>('/sales/returns', { params });

export const getById = async (id: string): Promise<SalesReturn> =>
  apiFetch<SalesReturn>(`/sales/returns/${id}`);

export const create = async (data: Partial<SalesReturn>): Promise<SalesReturn> =>
  apiFetch<SalesReturn>('/sales/returns', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<SalesReturn>): Promise<SalesReturn> =>
  apiFetch<SalesReturn>(`/sales/returns/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/sales/returns/${id}`, { method: 'DELETE' });
