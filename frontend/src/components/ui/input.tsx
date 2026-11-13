// File Location: frontend/src/components/ui/input.tsx
// Purpose: Global Input & Form Control Design Components (Input, Select, Textarea)

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftAddon, rightAddon, type = 'text', ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {leftAddon && (
          <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
            {leftAddon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'flex h-9 w-full rounded-lg border bg-white px-3 py-1.5 text-sm text-slate-900 shadow-2xs transition-colors',
            'placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
            'dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500',
            error
              ? 'border-rose-500 focus-visible:ring-rose-500/20'
              : 'border-slate-300 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-slate-700',
            leftAddon && 'pl-9',
            rightAddon && 'pr-9',
            className
          )}
          {...props}
        />
        {rightAddon && (
          <div className="absolute right-3 flex items-center text-slate-400">
            {rightAddon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-2xs transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900 shadow-2xs transition-colors',
        'placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
