// API SERVICE: Task
// Backend endpoints:
//   GET    /api/v1/tasks         → paginated list
//   POST   /api/v1/tasks         → create
//   GET    /api/v1/tasks/{id}    → detail
//   PUT    /api/v1/tasks/{id}    → update
//   DELETE /api/v1/tasks/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Task, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Task>> =>
  apiFetch<PaginatedResult<Task>>('/tasks', { params });

export const getById = async (id: string): Promise<Task> =>
  apiFetch<Task>(`/tasks/${id}`);

export const create = async (data: Partial<Task>): Promise<Task> =>
  apiFetch<Task>('/tasks', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Task>): Promise<Task> =>
  apiFetch<Task>(`/tasks/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/tasks/${id}`, { method: 'DELETE' });
