// API SERVICE: Opportunity
// Backend endpoints:
//   GET    /api/v1/crm/opportunities         → paginated list
//   POST   /api/v1/crm/opportunities         → create
//   GET    /api/v1/crm/opportunities/{id}    → detail
//   PUT    /api/v1/crm/opportunities/{id}    → update
//   DELETE /api/v1/crm/opportunities/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Opportunity, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Opportunity>> =>
  apiFetch<PaginatedResult<Opportunity>>('/crm/opportunities', { params });

export const getById = async (id: string): Promise<Opportunity> =>
  apiFetch<Opportunity>(`/crm/opportunities/${id}`);

export const create = async (data: Partial<Opportunity>): Promise<Opportunity> =>
  apiFetch<Opportunity>('/crm/opportunities', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Opportunity>): Promise<Opportunity> =>
  apiFetch<Opportunity>(`/crm/opportunities/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/crm/opportunities/${id}`, { method: 'DELETE' });
