// API SERVICE: Contact
// Backend endpoints:
//   GET    /api/v1/crm/contacts         → paginated list
//   POST   /api/v1/crm/contacts         → create
//   GET    /api/v1/crm/contacts/{id}    → detail
//   PUT    /api/v1/crm/contacts/{id}    → update
//   DELETE /api/v1/crm/contacts/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Contact, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Contact>> =>
  apiFetch<PaginatedResult<Contact>>('/crm/contacts', { params });

export const getById = async (id: string): Promise<Contact> =>
  apiFetch<Contact>(`/crm/contacts/${id}`);

export const create = async (data: Partial<Contact>): Promise<Contact> =>
  apiFetch<Contact>('/crm/contacts', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Contact>): Promise<Contact> =>
  apiFetch<Contact>(`/crm/contacts/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/crm/contacts/${id}`, { method: 'DELETE' });
