// API SERVICE: Quotation
// Backend endpoints:
//   GET    /api/v1/sales/quotations         → paginated list
//   POST   /api/v1/sales/quotations         → create
//   GET    /api/v1/sales/quotations/{id}    → detail
//   PUT    /api/v1/sales/quotations/{id}    → update
//   DELETE /api/v1/sales/quotations/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Quotation, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Quotation>> =>
  apiFetch<PaginatedResult<Quotation>>('/sales/quotations', { params });

export const getById = async (id: string): Promise<Quotation> =>
  apiFetch<Quotation>(`/sales/quotations/${id}`);

export const create = async (data: Partial<Quotation>): Promise<Quotation> =>
  apiFetch<Quotation>('/sales/quotations', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Quotation>): Promise<Quotation> =>
  apiFetch<Quotation>(`/sales/quotations/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/sales/quotations/${id}`, { method: 'DELETE' });
