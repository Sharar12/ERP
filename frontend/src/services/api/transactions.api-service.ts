// API SERVICE: Transaction
// Backend endpoints:
//   GET    /api/v1/finance/transactions         → paginated list
//   POST   /api/v1/finance/transactions         → create
//   GET    /api/v1/finance/transactions/{id}    → detail
//   PUT    /api/v1/finance/transactions/{id}    → update
//   DELETE /api/v1/finance/transactions/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Transaction, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Transaction>> =>
  apiFetch<PaginatedResult<Transaction>>('/finance/transactions', { params });

export const getById = async (id: string): Promise<Transaction> =>
  apiFetch<Transaction>(`/finance/transactions/${id}`);

export const create = async (data: Partial<Transaction>): Promise<Transaction> =>
  apiFetch<Transaction>('/finance/transactions', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Transaction>): Promise<Transaction> =>
  apiFetch<Transaction>(`/finance/transactions/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/finance/transactions/${id}`, { method: 'DELETE' });
