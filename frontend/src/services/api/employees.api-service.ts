// API SERVICE: Employee
// Backend endpoints:
//   GET    /api/v1/hr/employees         → paginated list
//   POST   /api/v1/hr/employees         → create
//   GET    /api/v1/hr/employees/{id}    → detail
//   PUT    /api/v1/hr/employees/{id}    → update
//   DELETE /api/v1/hr/employees/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { Employee, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<Employee>> =>
  apiFetch<PaginatedResult<Employee>>('/hr/employees', { params });

export const getById = async (id: string): Promise<Employee> =>
  apiFetch<Employee>(`/hr/employees/${id}`);

export const create = async (data: Partial<Employee>): Promise<Employee> =>
  apiFetch<Employee>('/hr/employees', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<Employee>): Promise<Employee> =>
  apiFetch<Employee>(`/hr/employees/${id}`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(`/hr/employees/${id}`, { method: 'DELETE' });
