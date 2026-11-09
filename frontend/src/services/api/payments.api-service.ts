// API SERVICE: Payment
// Backend endpoints:
//   GET    /api/v1/sales/payments         → paginated list
//   POST   /api/v1/sales/payments         → create
//   GET    /api/v1/sales/payments/{id}    → detail
//   PUT    /api/v1/sales/payments/{id}    → update
//   DELETE /api/v1/sales/payments/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Payment, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Payment>> =>
  apiFetch<PaginatedResult<Payment>>('/sales/payments', { params });

export const getById = async (id: string): Promise<Payment> =>
  apiFetch<Payment>(`/sales/payments/${id}`);

export const create = async (data: Partial<Payment>): Promise<Payment> =>
  apiFetch<Payment>('/sales/payments', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Payment>): Promise<Payment> =>
  apiFetch<Payment>(`/sales/payments/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/sales/payments/${id}`, { method: 'DELETE' });
