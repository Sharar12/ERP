// File Location: frontend/src/components/ui/badge.tsx
// Purpose: Status Badge Design Component (Variants/Tones: default, success, warning, danger/destructive, info, outline, muted)

import * as React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'destructive' | 'info' | 'outline' | 'muted';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  tone?: BadgeVariant;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800',
  danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800',
  destructive: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800',
  info: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800',
  outline: 'bg-transparent text-slate-600 border-slate-300 dark:text-slate-300 dark:border-slate-700',
  muted: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-slate-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  destructive: 'bg-rose-500',
  info: 'bg-indigo-500',
  outline: 'bg-slate-400',
  muted: 'bg-slate-400',
};

export function Badge({ className, variant, tone, dot = false, children, ...props }: BadgeProps) {
  const activeVariant = (tone || variant || 'default') as BadgeVariant;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight transition-colors',
        variantStyles[activeVariant] || variantStyles.default,
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[activeVariant] || dotColors.default)} />}
      {children}
    </span>
  );
}

export function statusTone(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    active: 'success', paid: 'success', completed: 'success', won: 'success', fulfilled: 'success', received: 'success', present: 'success',
    pending: 'warning', sent: 'info', confirmed: 'info', qualified: 'info', proposal: 'warning', on_hold: 'warning', on_leave: 'warning',
    overdue: 'danger', inactive: 'muted', cancelled: 'danger', lost: 'danger', terminated: 'danger', draft: 'muted', new: 'info',
    contacted: 'warning', planning: 'info', discontinued: 'danger', lead: 'info', absent: 'danger', failed: 'danger', passed: 'success',
  };
  return map[status] ?? 'default';
}
