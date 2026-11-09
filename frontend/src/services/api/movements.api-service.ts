// API SERVICE: StockMovement
// Backend endpoints:
//   GET    /api/v1/inventory/movements         → paginated list
//   POST   /api/v1/inventory/movements         → create
//   GET    /api/v1/inventory/movements/{id}    → detail
//   PUT    /api/v1/inventory/movements/{id}    → update
//   DELETE /api/v1/inventory/movements/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { StockMovement, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<StockMovement>> =>
  apiFetch<PaginatedResult<StockMovement>>('/inventory/movements', { params });

export const getById = async (id: string): Promise<StockMovement> =>
  apiFetch<StockMovement>(`/inventory/movements/${id}`);

export const create = async (data: Partial<StockMovement>): Promise<StockMovement> =>
  apiFetch<StockMovement>('/inventory/movements', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<StockMovement>): Promise<StockMovement> =>
  apiFetch<StockMovement>(`/inventory/movements/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/inventory/movements/${id}`, { method: 'DELETE' });
