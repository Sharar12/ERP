'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services';
import type { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (authService as any).me?.()
      .then((data: any) => {
        setUser(data);
      })
      .catch(() => {
        // Only redirect if protected
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          router.push('/login');
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    const u = (res as any)?.user ?? res;
    setUser(u);
    router.push('/dashboard');
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, logout };
}

