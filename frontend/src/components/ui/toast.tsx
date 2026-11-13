// File Location: frontend/src/components/ui/toast.tsx
// Purpose: Global Toast Notification System with Context Provider and Auto-dismiss

'use client';

import * as React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  title?: string;
  message?: string;
  description?: string;
  variant?: ToastVariant;
  type?: ToastVariant;
}

interface ToastContextValue {
  toast: (item: string | Omit<ToastItem, 'id'>) => void;
  push: (messageOrItem: string | Omit<ToastItem, 'id'>, type?: ToastVariant) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const addToast = React.useCallback((input: string | Omit<ToastItem, 'id'>, typeFallback?: ToastVariant) => {
    const id = Math.random().toString(36).slice(2);
    let item: Omit<ToastItem, 'id'>;

    if (typeof input === 'string') {
      item = {
        title: input,
        variant: typeFallback || 'info',
      };
    } else {
      item = {
        ...input,
        title: input.title || input.message || '',
        variant: input.variant || input.type || typeFallback || 'info',
      };
    }

    setToasts((prev) => [...prev, { ...item, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast: addToast, push: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2.5 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg transition-all dark:bg-slate-900',
              t.variant === 'error'
                ? 'border-rose-200 dark:border-rose-900'
                : t.variant === 'success'
                ? 'border-emerald-200 dark:border-emerald-900'
                : 'border-slate-200 dark:border-slate-800'
            )}
          >
            {t.variant === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />}
            {t.variant === 'error' && <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />}
            {(!t.variant || t.variant === 'info') && <Info className="h-5 w-5 shrink-0 text-indigo-500" />}
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.title}</p>
              {t.description && <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-slate-400 hover:text-slate-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
