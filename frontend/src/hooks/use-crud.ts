// src/hooks/use-crud.ts
'use client';
import useSWR from 'swr';
import { apiFetch, invalidate } from '@/lib/api-client';
import type { PaginatedResult } from '@/types';

export function useCrudList<T>(endpoint: string, params?: Record<string, unknown>) {
  const key = `/${endpoint}${params ? '?' + JSON.stringify(params) : ''}`;
  return useSWR<PaginatedResult<T>>(key, () =>
    apiFetch<PaginatedResult<T>>(`/${endpoint}`, { params })
  );
}

export function useCrudItem<T>(endpoint: string, id: string | null) {
  return useSWR<T>(id ? `/${endpoint}/${id}` : null, () =>
    apiFetch<T>(`/${endpoint}/${id}`)
  );
}

export function useCrudMutations<T extends { id: string | number }>(endpoint: string) {
  return {
    create: async (data: Partial<T>): Promise<T> => {
      const result = await apiFetch<T>(`/${endpoint}`, { method: 'POST', body: data });
      invalidate(`/${endpoint}`);
      return result;
    },
    update: async (id: string | number, data: Partial<T>): Promise<T> => {
      const result = await apiFetch<T>(`/${endpoint}/${id}`, { method: 'PUT', body: data });
      invalidate(`/${endpoint}`);
      return result;
    },
    remove: async (id: string | number): Promise<void> => {
      await apiFetch(`/${endpoint}/${id}`, { method: 'DELETE' });
      invalidate(`/${endpoint}`);
    },
    custom: <R>(id: string | number, action: string, body?: unknown): Promise<R> => {
      const result = apiFetch<R>(`/${endpoint}/${id}/${action}`, { method: 'POST', body });
      return result.then((r) => { invalidate(`/${endpoint}`); return r; });
    },
  };
}

