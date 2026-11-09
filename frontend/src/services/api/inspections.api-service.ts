// API SERVICE: QualityInspection
// Backend endpoints:
//   GET    /api/v1/quality/inspections         → paginated list
//   POST   /api/v1/quality/inspections         → create
//   GET    /api/v1/quality/inspections/{id}    → detail
//   PUT    /api/v1/quality/inspections/{id}    → update
//   DELETE /api/v1/quality/inspections/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { QualityInspection, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<QualityInspection>> =>
  apiFetch<PaginatedResult<QualityInspection>>('/quality/inspections', { params });

export const getById = async (id: string): Promise<QualityInspection> =>
  apiFetch<QualityInspection>(`/quality/inspections/${id}`);

export const create = async (data: Partial<QualityInspection>): Promise<QualityInspection> =>
  apiFetch<QualityInspection>('/quality/inspections', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<QualityInspection>): Promise<QualityInspection> =>
  apiFetch<QualityInspection>(`/quality/inspections/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/quality/inspections/${id}`, { method: 'DELETE' });
