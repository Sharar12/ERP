// API SERVICE: Auth
import { apiFetch, setToken } from '@/lib/api-client';
import type { User } from '@/types';

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const result = await apiFetch<{ user: User; token: string }>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  if (result.token) {
    setToken(result.token);
  }
  return result;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } finally {
    setToken(null);
  }
}

export async function me(): Promise<User> {
  return apiFetch<User>('/auth/me');
}

