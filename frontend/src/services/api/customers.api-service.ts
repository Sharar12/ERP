// API SERVICE: Customer
// Backend endpoints:
//   GET    /api/v1/crm/customers         → paginated list
//   POST   /api/v1/crm/customers         → create
//   GET    /api/v1/crm/customers/{id}    → detail
//   PUT    /api/v1/crm/customers/{id}    → update
//   DELETE /api/v1/crm/customers/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Customer, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Customer>> =>
  apiFetch<PaginatedResult<Customer>>('/crm/customers', { params });

export const getById = async (id: string): Promise<Customer> =>
  apiFetch<Customer>(`/crm/customers/${id}`);

export const create = async (data: Partial<Customer>): Promise<Customer> =>
  apiFetch<Customer>('/crm/customers', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Customer>): Promise<Customer> =>
  apiFetch<Customer>(`/crm/customers/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/crm/customers/${id}`, { method: 'DELETE' });

export const customerApiService = {
  getAll: async (params?: Record<string, unknown>): Promise<Customer[]> => {
    const res = await getAll(params);
    return Array.isArray(res) ? res : (res?.data ?? []);
  },
  getById,
  create,
  update,
  delete: remove,
  remove,
};
