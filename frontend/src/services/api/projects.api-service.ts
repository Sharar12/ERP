// API SERVICE: Project
// Backend endpoints:
//   GET    /api/v1/projects         → paginated list
//   POST   /api/v1/projects         → create
//   GET    /api/v1/projects/{id}    → detail
//   PUT    /api/v1/projects/{id}    → update
//   DELETE /api/v1/projects/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Project, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Project>> =>
  apiFetch<PaginatedResult<Project>>('/projects', { params });

export const getById = async (id: string): Promise<Project> =>
  apiFetch<Project>(`/projects/${id}`);

export const create = async (data: Partial<Project>): Promise<Project> =>
  apiFetch<Project>('/projects', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Project>): Promise<Project> =>
  apiFetch<Project>(`/projects/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/projects/${id}`, { method: 'DELETE' });
