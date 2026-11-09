// API SERVICE: Warehouse
// Backend endpoints:
//   GET    /api/v1/inventory/warehouses         → paginated list
//   POST   /api/v1/inventory/warehouses         → create
//   GET    /api/v1/inventory/warehouses/{id}    → detail
//   PUT    /api/v1/inventory/warehouses/{id}    → update
//   DELETE /api/v1/inventory/warehouses/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Warehouse, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Warehouse>> =>
  apiFetch<PaginatedResult<Warehouse>>('/inventory/warehouses', { params });

export const getById = async (id: string): Promise<Warehouse> =>
  apiFetch<Warehouse>(`/inventory/warehouses/${id}`);

export const create = async (data: Partial<Warehouse>): Promise<Warehouse> =>
  apiFetch<Warehouse>('/inventory/warehouses', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Warehouse>): Promise<Warehouse> =>
  apiFetch<Warehouse>(`/inventory/warehouses/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/inventory/warehouses/${id}`, { method: 'DELETE' });
