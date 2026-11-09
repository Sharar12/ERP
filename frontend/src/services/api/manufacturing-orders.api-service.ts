// API SERVICE: ManufacturingOrder
// Backend endpoints:
//   GET    /api/v1/manufacturing/orders         → paginated list
//   POST   /api/v1/manufacturing/orders         → create
//   GET    /api/v1/manufacturing/orders/{id}    → detail
//   PUT    /api/v1/manufacturing/orders/{id}    → update
//   DELETE /api/v1/manufacturing/orders/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { ManufacturingOrder, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<ManufacturingOrder>> =>
  apiFetch<PaginatedResult<ManufacturingOrder>>('/manufacturing/orders', { params });

export const getById = async (id: string): Promise<ManufacturingOrder> =>
  apiFetch<ManufacturingOrder>(`/manufacturing/orders/${id}`);

export const create = async (data: Partial<ManufacturingOrder>): Promise<ManufacturingOrder> =>
  apiFetch<ManufacturingOrder>('/manufacturing/orders', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<ManufacturingOrder>): Promise<ManufacturingOrder> =>
  apiFetch<ManufacturingOrder>(`/manufacturing/orders/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/manufacturing/orders/${id}`, { method: 'DELETE' });
