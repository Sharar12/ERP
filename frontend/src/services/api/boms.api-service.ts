// API SERVICE: Bom
// Backend endpoints:
//   GET    /api/v1/manufacturing/boms         → paginated list
//   POST   /api/v1/manufacturing/boms         → create
//   GET    /api/v1/manufacturing/boms/{id}    → detail
//   PUT    /api/v1/manufacturing/boms/{id}    → update
//   DELETE /api/v1/manufacturing/boms/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Bom, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Bom>> =>
  apiFetch<PaginatedResult<Bom>>('/manufacturing/boms', { params });

export const getById = async (id: string): Promise<Bom> =>
  apiFetch<Bom>(`/manufacturing/boms/${id}`);

export const create = async (data: Partial<Bom>): Promise<Bom> =>
  apiFetch<Bom>('/manufacturing/boms', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Bom>): Promise<Bom> =>
  apiFetch<Bom>(`/manufacturing/boms/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/manufacturing/boms/${id}`, { method: 'DELETE' });
