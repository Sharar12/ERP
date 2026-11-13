// File Location: frontend/src/components/ui/date-picker.tsx
// Purpose: Native Date Picker Input Component with Calendar Icon

'use client';

import * as React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <Calendar className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
        <input
          ref={ref}
          type="date"
          className={cn(
            'flex h-9 w-full rounded-lg border bg-white pl-9 pr-3 py-1.5 text-sm text-slate-900 shadow-2xs transition-colors',
            'focus-visible:outline-none focus-visible:ring-2',
            'dark:bg-slate-950 dark:text-slate-100 dark:[color-scheme:dark]',
            error
              ? 'border-rose-500 focus-visible:ring-rose-500/20'
              : 'border-slate-300 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-slate-700',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
DatePicker.displayName = 'DatePicker';
