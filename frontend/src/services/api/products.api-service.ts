// API SERVICE: Product
// Backend endpoints:
//   GET    /api/v1/inventory/products         → paginated list
//   POST   /api/v1/inventory/products         → create
//   GET    /api/v1/inventory/products/{id}    → detail
//   PUT    /api/v1/inventory/products/{id}    → update
//   DELETE /api/v1/inventory/products/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Product, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Product>> =>
  apiFetch<PaginatedResult<Product>>('/inventory/products', { params });

export const getById = async (id: string): Promise<Product> =>
  apiFetch<Product>(`/inventory/products/${id}`);

export const create = async (data: Partial<Product>): Promise<Product> =>
  apiFetch<Product>('/inventory/products', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Product>): Promise<Product> =>
  apiFetch<Product>(`/inventory/products/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/inventory/products/${id}`, { method: 'DELETE' });
