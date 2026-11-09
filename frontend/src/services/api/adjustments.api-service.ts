// API SERVICE: StockAdjustment
// Backend endpoints:
//   GET    /api/v1/inventory/adjustments         → paginated list
//   POST   /api/v1/inventory/adjustments         → create
//   GET    /api/v1/inventory/adjustments/{id}    → detail
//   PUT    /api/v1/inventory/adjustments/{id}    → update
//   DELETE /api/v1/inventory/adjustments/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { StockAdjustment, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<StockAdjustment>> =>
  apiFetch<PaginatedResult<StockAdjustment>>('/inventory/adjustments', { params });

export const getById = async (id: string): Promise<StockAdjustment> =>
  apiFetch<StockAdjustment>(`/inventory/adjustments/${id}`);

export const create = async (data: Partial<StockAdjustment>): Promise<StockAdjustment> =>
  apiFetch<StockAdjustment>('/inventory/adjustments', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<StockAdjustment>): Promise<StockAdjustment> =>
  apiFetch<StockAdjustment>(`/inventory/adjustments/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/inventory/adjustments/${id}`, { method: 'DELETE' });
