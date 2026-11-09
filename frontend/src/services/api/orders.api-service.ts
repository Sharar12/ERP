// API SERVICE: SalesOrder
// Backend endpoints:
//   GET    /api/v1/sales/orders         → paginated list
//   POST   /api/v1/sales/orders         → create
//   GET    /api/v1/sales/orders/{id}    → detail
//   PUT    /api/v1/sales/orders/{id}    → update
//   DELETE /api/v1/sales/orders/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { SalesOrder, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<SalesOrder>> =>
  apiFetch<PaginatedResult<SalesOrder>>('/sales/orders', { params });

export const getById = async (id: string): Promise<SalesOrder> =>
  apiFetch<SalesOrder>(`/sales/orders/${id}`);

export const create = async (data: Partial<SalesOrder>): Promise<SalesOrder> =>
  apiFetch<SalesOrder>('/sales/orders', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<SalesOrder>): Promise<SalesOrder> =>
  apiFetch<SalesOrder>(`/sales/orders/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/sales/orders/${id}`, { method: 'DELETE' });
