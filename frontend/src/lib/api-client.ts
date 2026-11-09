// API CLIENT
// Central fetch wrapper. Handles auth token, envelope unwrapping,
// error normalisation, 401 auto-logout, retry, optimistic updates, and cache invalidation.

import { mutate } from 'swr';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
const TOKEN_KEY = 'erp_auth_token';

export class ApiError extends Error {
  constructor(public status: number, message: string, public errors?: Record<string, string[]>) {
    super(message);
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  params?: Record<string, unknown>;
  signal?: AbortSignal;
};

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return '';
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (typeof v === 'object') {
      Object.entries(v as Record<string, unknown>).forEach(([fk, fv]) => {
        if (fv !== undefined && fv !== null && fv !== '') search.append(`${k}[${fk}]`, String(fv));
      });
    } else {
      search.append(k, String(v));
    }
  });
  const q = search.toString();
  return q ? `?${q}` : '';
}

async function _fetch<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}${buildQuery(opts.params)}`, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  });

  if (res.status === 401) {
    setToken(null);
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
    throw new ApiError(401, 'Unauthenticated');
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, json.message ?? 'Request failed', json.errors);
  }

  // Unwrap { data, meta } envelope if present
  return (json.data !== undefined ? json.data : json) as T;
}

// ============================================================
// RETRY — transient network errors and 5xx get one backoff retry
// ============================================================

export async function apiFetch<T = unknown>(
  path: string,
  opts: RequestOptions = {},
  retry = true,
): Promise<T> {
  try {
    return await _fetch<T>(path, opts);
  } catch (err) {
    if (retry && err instanceof ApiError && err.status >= 500) {
      await new Promise(r => setTimeout(r, 500));
      return apiFetch<T>(path, opts, false);
    }
    throw err;
  }
}

// ============================================================
// OPTIMISTIC UPDATE HELPER
// Wraps a mutation with an optimistic state patch + rollback.
// ============================================================

export async function optimistic<T>(
  applyOptimistic: () => void,
  rollback: () => void,
  mutation: () => Promise<T>,
): Promise<T> {
  applyOptimistic();
  try {
    return await mutation();
  } catch (err) {
    rollback();
    throw err;
  }
}

// ============================================================
// CACHE INVALIDATION — SWR cache bust on mutation
// ============================================================

export function invalidate(prefix: string): void {
  mutate((key: unknown) => typeof key === 'string' && key.startsWith(prefix), undefined, { revalidate: true });
}
