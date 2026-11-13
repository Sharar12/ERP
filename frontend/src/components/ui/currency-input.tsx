// File Location: frontend/src/components/ui/currency-input.tsx
// Purpose: Financial Number Input with Currency Symbol, Formatting & Tabular Numerals

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number | string;
  onChange: (value: number) => void;
  currency?: string;
  symbol?: string;
  error?: boolean;
}

export function CurrencyInput({
  value,
  onChange,
  currency = 'USD',
  symbol = '$',
  error,
  className,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState<string>(() =>
    value !== '' && value !== null && value !== undefined ? String(value) : ''
  );

  React.useEffect(() => {
    const num = Number(value);
    if (!Number.isNaN(num) && Number(displayValue) !== num) {
      setDisplayValue(value === 0 ? '0' : value ? String(value) : '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const parts = raw.split('.');
    const sanitized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : raw;
    setDisplayValue(sanitized);
    onChange(sanitized === '' ? 0 : parseFloat(sanitized));
  };

  const handleBlur = () => {
    if (displayValue !== '') {
      const parsed = parseFloat(displayValue);
      if (!Number.isNaN(parsed)) {
        setDisplayValue(parsed.toFixed(2));
      }
    }
  };

  return (
    <div className="relative flex items-center w-full">
      <span className="pointer-events-none absolute left-3 text-sm font-medium text-slate-500 select-none">
        {symbol}
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="0.00"
        className={cn(
          'flex h-9 w-full rounded-lg border bg-white pl-7 pr-14 py-1.5 text-right font-mono text-sm tabular-nums text-slate-900 shadow-2xs transition-colors',
          'placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2',
          'dark:bg-slate-950 dark:text-slate-100',
          error
            ? 'border-rose-500 focus-visible:ring-rose-500/20'
            : 'border-slate-300 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-slate-700',
          className
        )}
        {...props}
      />
      <span className="pointer-events-none absolute right-2.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        {currency}
      </span>
    </div>
  );
}
