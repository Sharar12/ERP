// API SERVICE: JournalEntry
// Backend endpoints:
//   GET    /api/v1/finance/journal         → paginated list
//   POST   /api/v1/finance/journal         → create
//   GET    /api/v1/finance/journal/{id}    → detail
//   PUT    /api/v1/finance/journal/{id}    → update
//   DELETE /api/v1/finance/journal/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { JournalEntry, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<JournalEntry>> =>
  apiFetch<PaginatedResult<JournalEntry>>('/finance/journal', { params });

export const getById = async (id: string): Promise<JournalEntry> =>
  apiFetch<JournalEntry>(`/finance/journal/${id}`);

export const create = async (data: Partial<JournalEntry>): Promise<JournalEntry> =>
  apiFetch<JournalEntry>('/finance/journal', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<JournalEntry>): Promise<JournalEntry> =>
  apiFetch<JournalEntry>(`/finance/journal/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/finance/journal/${id}`, { method: 'DELETE' });
