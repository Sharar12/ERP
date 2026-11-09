// API SERVICE: Supplier
// Backend endpoints:
//   GET    /api/v1/purchases/suppliers         → paginated list
//   POST   /api/v1/purchases/suppliers         → create
//   GET    /api/v1/purchases/suppliers/{id}    → detail
//   PUT    /api/v1/purchases/suppliers/{id}    → update
//   DELETE /api/v1/purchases/suppliers/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Supplier, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Supplier>> =>
  apiFetch<PaginatedResult<Supplier>>('/purchases/suppliers', { params });

export const getById = async (id: string): Promise<Supplier> =>
  apiFetch<Supplier>(`/purchases/suppliers/${id}`);

export const create = async (data: Partial<Supplier>): Promise<Supplier> =>
  apiFetch<Supplier>('/purchases/suppliers', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Supplier>): Promise<Supplier> =>
  apiFetch<Supplier>(`/purchases/suppliers/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/purchases/suppliers/${id}`, { method: 'DELETE' });
