// API SERVICE: Leave
// Backend endpoints:
//   GET    /api/v1/hr/leaves         → paginated list
//   POST   /api/v1/hr/leaves         → create
//   GET    /api/v1/hr/leaves/{id}    → detail
//   PUT    /api/v1/hr/leaves/{id}    → update
//   DELETE /api/v1/hr/leaves/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Leave, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Leave>> =>
  apiFetch<PaginatedResult<Leave>>('/hr/leaves', { params });

export const getById = async (id: string): Promise<Leave> =>
  apiFetch<Leave>(`/hr/leaves/${id}`);

export const create = async (data: Partial<Leave>): Promise<Leave> =>
  apiFetch<Leave>('/hr/leaves', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Leave>): Promise<Leave> =>
  apiFetch<Leave>(`/hr/leaves/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/hr/leaves/${id}`, { method: 'DELETE' });
