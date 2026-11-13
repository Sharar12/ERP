// File Location: frontend/src/components/ui/card.tsx
// Purpose: Global Card Container Component (Used for Stat KPI Cards, Panels, and Content Containers)

import * as React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-xs',
        'dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-1 border-b border-slate-100 px-6 py-4 dark:border-slate-800/80', className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100', className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xs text-slate-500 dark:text-slate-400', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-3.5 rounded-b-xl',
        'dark:border-slate-800 dark:bg-slate-900/60',
        className
      )}
      {...props}
    />
  );
}
