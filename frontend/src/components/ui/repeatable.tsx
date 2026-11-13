// File Location: frontend/src/components/ui/repeatable.tsx
// Purpose: Dynamic Multi-Row Repeatable Field Group for Invoices, Orders & Transfers

'use client';

import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface RepeatableProps<T> {
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderRow: (item: T, index: number) => React.ReactNode;
  addLabel?: string;
  minItems?: number;
  className?: string;
}

export function Repeatable<T>({
  items,
  onAdd,
  onRemove,
  renderRow,
  addLabel = 'Add Line Item',
  minItems = 1,
  className,
}: RepeatableProps<T>) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="space-y-2.5">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="group relative flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-200/70 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400 mt-1">
              {idx + 1}
            </div>
            <div className="flex-1">{renderRow(item, idx)}</div>
            <button
              type="button"
              disabled={items.length <= minItems}
              onClick={() => onRemove(idx)}
              title="Remove row"
              className="mt-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 disabled:pointer-events-none dark:hover:bg-rose-950/50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={onAdd} leftIcon={<Plus className="h-4 w-4" />}>
        {addLabel}
      </Button>
    </div>
  );
}
