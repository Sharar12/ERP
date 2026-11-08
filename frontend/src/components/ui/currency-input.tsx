"use client";
import { Input } from "./input";

export function CurrencyInput({ value, onChange, currency = "USD" }: {
  value: number; onChange: (v: number) => void; currency?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
        {currency === "USD" ? "$" : currency}
      </span>
      <Input type="number" value={value} onChange={e => onChange(Number(e.target.value))} className="pl-7" />
    </div>
  );
}

