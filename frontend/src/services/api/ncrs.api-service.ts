// API SERVICE: NonConformanceReport
// Backend endpoints:
//   GET    /api/v1/quality/ncrs         → paginated list
//   POST   /api/v1/quality/ncrs         → create
//   GET    /api/v1/quality/ncrs/{id}    → detail
//   PUT    /api/v1/quality/ncrs/{id}    → update
//   DELETE /api/v1/quality/ncrs/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { NonConformanceReport, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<NonConformanceReport>> =>
  apiFetch<PaginatedResult<NonConformanceReport>>('/quality/ncrs', { params });

export const getById = async (id: string): Promise<NonConformanceReport> =>
  apiFetch<NonConformanceReport>(`/quality/ncrs/${id}`);

export const create = async (data: Partial<NonConformanceReport>): Promise<NonConformanceReport> =>
  apiFetch<NonConformanceReport>('/quality/ncrs', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<NonConformanceReport>): Promise<NonConformanceReport> =>
  apiFetch<NonConformanceReport>(`/quality/ncrs/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/quality/ncrs/${id}`, { method: 'DELETE' });
