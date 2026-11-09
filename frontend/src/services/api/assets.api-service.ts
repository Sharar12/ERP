// API SERVICE: Asset
// Backend endpoints:
//   GET    /api/v1/assets         → paginated list
//   POST   /api/v1/assets         → create
//   GET    /api/v1/assets/{id}    → detail
//   PUT    /api/v1/assets/{id}    → update
//   DELETE /api/v1/assets/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Asset, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Asset>> =>
  apiFetch<PaginatedResult<Asset>>('/assets', { params });

export const getById = async (id: string): Promise<Asset> =>
  apiFetch<Asset>(`/assets/${id}`);

export const create = async (data: Partial<Asset>): Promise<Asset> =>
  apiFetch<Asset>('/assets', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Asset>): Promise<Asset> =>
  apiFetch<Asset>(`/assets/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/assets/${id}`, { method: 'DELETE' });
