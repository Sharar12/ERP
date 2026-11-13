// File Location: frontend/src/components/ui/filters.tsx
// Purpose: ERP Data Table Search & Filter Toolbar with Search Input, Slot and Reset Action

'use client';

import * as React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface FiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  onReset?: () => void;
  hasActiveFilters?: boolean;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function Filters({
  search,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  onReset,
  hasActiveFilters,
  children,
  actions,
  className,
}: FiltersProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900',
        className
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        <div className="w-full sm:max-w-xs">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            leftAddon={<Search className="h-4 w-4" />}
          />
        </div>
        {children}
        {hasActiveFilters && onReset && (
          <Button variant="ghost" size="sm" onClick={onReset} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
            Reset
          </Button>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
