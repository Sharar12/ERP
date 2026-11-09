// API SERVICE: Ticket
// Backend endpoints:
//   GET    /api/v1/tickets         → paginated list
//   POST   /api/v1/tickets         → create
//   GET    /api/v1/tickets/{id}    → detail
//   PUT    /api/v1/tickets/{id}    → update
//   DELETE /api/v1/tickets/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Ticket, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Ticket>> =>
  apiFetch<PaginatedResult<Ticket>>('/tickets', { params });

export const getById = async (id: string): Promise<Ticket> =>
  apiFetch<Ticket>(`/tickets/${id}`);

export const create = async (data: Partial<Ticket>): Promise<Ticket> =>
  apiFetch<Ticket>('/tickets', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Ticket>): Promise<Ticket> =>
  apiFetch<Ticket>(`/tickets/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/tickets/${id}`, { method: 'DELETE' });
