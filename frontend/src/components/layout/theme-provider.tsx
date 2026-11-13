// File Location: frontend/src/components/layout/theme-provider.tsx
// Purpose: Next.js 14 Theme Provider with next-themes integration and custom hook fallback

'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  return {
    theme: (theme || 'system') as 'light' | 'dark' | 'system',
    resolvedTheme: (resolvedTheme || 'light') as 'light' | 'dark',
    setTheme: (t: 'light' | 'dark' | 'system') => setTheme(t),
  };
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'erp-ui-theme',
}: {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      storageKey={storageKey}
    >
      {children}
    </NextThemesProvider>
  );
}
