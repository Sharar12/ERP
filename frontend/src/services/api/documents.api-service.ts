// API SERVICE: Document
// Backend endpoints:
//   GET    /api/v1/documents         → paginated list
//   POST   /api/v1/documents         → create
//   GET    /api/v1/documents/{id}    → detail
//   PUT    /api/v1/documents/{id}    → update
//   DELETE /api/v1/documents/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Document, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Document>> =>
  apiFetch<PaginatedResult<Document>>('/documents', { params });

export const getById = async (id: string): Promise<Document> =>
  apiFetch<Document>(`/documents/${id}`);

export const create = async (data: Partial<Document>): Promise<Document> =>
  apiFetch<Document>('/documents', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Document>): Promise<Document> =>
  apiFetch<Document>(`/documents/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/documents/${id}`, { method: 'DELETE' });
