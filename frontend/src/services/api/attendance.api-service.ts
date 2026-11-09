// API SERVICE: Attendance
// Backend endpoints:
//   GET    /api/v1/hr/attendance         → paginated list
//   POST   /api/v1/hr/attendance         → create
//   GET    /api/v1/hr/attendance/{id}    → detail
//   PUT    /api/v1/hr/attendance/{id}    → update
//   DELETE /api/v1/hr/attendance/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Attendance, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Attendance>> =>
  apiFetch<PaginatedResult<Attendance>>('/hr/attendance', { params });

export const getById = async (id: string): Promise<Attendance> =>
  apiFetch<Attendance>(`/hr/attendance/${id}`);

export const create = async (data: Partial<Attendance>): Promise<Attendance> =>
  apiFetch<Attendance>('/hr/attendance', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Attendance>): Promise<Attendance> =>
  apiFetch<Attendance>(`/hr/attendance/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/hr/attendance/${id}`, { method: 'DELETE' });
