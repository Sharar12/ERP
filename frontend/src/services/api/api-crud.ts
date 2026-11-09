import { apiFetch } from '@/lib/api-client';
import type { CrudService, ID } from '@/types';

export function createApiCrud<T>(endpoint: string): CrudService<T> & {
  getAll: (params?: Record<string, unknown>) => Promise<T[]>;
  getById: (id: ID) => Promise<T | null>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: ID, data: Partial<T>) => Promise<T>;
  delete: (id: ID) => Promise<void>;
  remove: (id: ID) => Promise<void>;
} {
  return {
    async getAll(params?: Record<string, unknown>): Promise<T[]> {
      const res = await apiFetch<any>(endpoint, { params });
      return Array.isArray(res) ? res : (res?.data ?? []);
    },
    async getById(id: ID): Promise<T | null> {
      try {
        const res = await apiFetch<any>(`${endpoint}/${id}`);
        return (res?.data ?? res) as T;
      } catch {
        return null;
      }
    },
    async create(data: Partial<T>): Promise<T> {
      const res = await apiFetch<any>(endpoint, { method: 'POST', body: data });
      return (res?.data ?? res) as T;
    },
    async update(id: ID, data: Partial<T>): Promise<T> {
      const res = await apiFetch<any>(`${endpoint}/${id}`, { method: 'PUT', body: data });
      return (res?.data ?? res) as T;
    },
    async delete(id: ID): Promise<void> {
      await apiFetch(`${endpoint}/${id}`, { method: 'DELETE' });
    },
    async remove(id: ID): Promise<void> {
      await apiFetch(`${endpoint}/${id}`, { method: 'DELETE' });
    },
  };
}

