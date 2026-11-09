// API SERVICE: GoodsReceivedNote
// Backend endpoints:
//   GET    /api/v1/purchases/grns         → paginated list
//   POST   /api/v1/purchases/grns         → create
//   GET    /api/v1/purchases/grns/{id}    → detail
//   PUT    /api/v1/purchases/grns/{id}    → update
//   DELETE /api/v1/purchases/grns/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { GoodsReceivedNote, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<GoodsReceivedNote>> =>
  apiFetch<PaginatedResult<GoodsReceivedNote>>('/purchases/grns', { params });

export const getById = async (id: string): Promise<GoodsReceivedNote> =>
  apiFetch<GoodsReceivedNote>(`/purchases/grns/${id}`);

export const create = async (data: Partial<GoodsReceivedNote>): Promise<GoodsReceivedNote> =>
  apiFetch<GoodsReceivedNote>('/purchases/grns', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<GoodsReceivedNote>): Promise<GoodsReceivedNote> =>
  apiFetch<GoodsReceivedNote>(`/purchases/grns/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/purchases/grns/${id}`, { method: 'DELETE' });
