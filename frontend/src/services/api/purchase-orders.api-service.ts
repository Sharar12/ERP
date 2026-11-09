// API SERVICE: PurchaseOrder
// Backend endpoints:
//   GET    /api/v1/purchases/orders         → paginated list
//   POST   /api/v1/purchases/orders         → create
//   GET    /api/v1/purchases/orders/{id}    → detail
//   PUT    /api/v1/purchases/orders/{id}    → update
//   DELETE /api/v1/purchases/orders/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { PurchaseOrder, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<PurchaseOrder>> =>
  apiFetch<PaginatedResult<PurchaseOrder>>('/purchases/orders', { params });

export const getById = async (id: string): Promise<PurchaseOrder> =>
  apiFetch<PurchaseOrder>(`/purchases/orders/${id}`);

export const create = async (data: Partial<PurchaseOrder>): Promise<PurchaseOrder> =>
  apiFetch<PurchaseOrder>('/purchases/orders', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> =>
  apiFetch<PurchaseOrder>(`/purchases/orders/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/purchases/orders/${id}`, { method: 'DELETE' });
