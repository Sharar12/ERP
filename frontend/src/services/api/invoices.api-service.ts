// API SERVICE: Invoice
// Backend endpoints:
//   GET    /api/v1/sales/invoices         → paginated list
//   POST   /api/v1/sales/invoices         → create
//   GET    /api/v1/sales/invoices/{id}    → detail
//   PUT    /api/v1/sales/invoices/{id}    → update
//   DELETE /api/v1/sales/invoices/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Invoice, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Invoice>> =>
  apiFetch<PaginatedResult<Invoice>>('/sales/invoices', { params });

export const getById = async (id: string): Promise<Invoice> =>
  apiFetch<Invoice>(`/sales/invoices/${id}`);

export const create = async (data: Partial<Invoice>): Promise<Invoice> =>
  apiFetch<Invoice>('/sales/invoices', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Invoice>): Promise<Invoice> =>
  apiFetch<Invoice>(`/sales/invoices/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/sales/invoices/${id}`, { method: 'DELETE' });
