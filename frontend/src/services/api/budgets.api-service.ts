// API SERVICE: Budget
// Backend endpoints:
//   GET    /api/v1/finance/budgets         → paginated list
//   POST   /api/v1/finance/budgets         → create
//   GET    /api/v1/finance/budgets/{id}    → detail
//   PUT    /api/v1/finance/budgets/{id}    → update
//   DELETE /api/v1/finance/budgets/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Budget, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Budget>> =>
  apiFetch<PaginatedResult<Budget>>('/finance/budgets', { params });

export const getById = async (id: string): Promise<Budget> =>
  apiFetch<Budget>(`/finance/budgets/${id}`);

export const create = async (data: Partial<Budget>): Promise<Budget> =>
  apiFetch<Budget>('/finance/budgets', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Budget>): Promise<Budget> =>
  apiFetch<Budget>(`/finance/budgets/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/finance/budgets/${id}`, { method: 'DELETE' });
