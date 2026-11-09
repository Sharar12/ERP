// API SERVICE: Lead
// Backend endpoints:
//   GET    /api/v1/crm/leads         → paginated list
//   POST   /api/v1/crm/leads         → create
//   GET    /api/v1/crm/leads/{id}    → detail
//   PUT    /api/v1/crm/leads/{id}    → update
//   DELETE /api/v1/crm/leads/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Lead, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Lead>> =>
  apiFetch<PaginatedResult<Lead>>('/crm/leads', { params });

export const getById = async (id: string): Promise<Lead> =>
  apiFetch<Lead>(`/crm/leads/${id}`);

export const create = async (data: Partial<Lead>): Promise<Lead> =>
  apiFetch<Lead>('/crm/leads', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Lead>): Promise<Lead> =>
  apiFetch<Lead>(`/crm/leads/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/crm/leads/${id}`, { method: 'DELETE' });
