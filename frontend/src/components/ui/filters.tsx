"use client";
import { X } from "lucide-react";
import { Select } from "./input";

export interface FilterDef {
  key: string;
  label: string;
  options: string[];
}
export function FilterBar({ filters, values, onChange }: {
  filters: FilterDef[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  const active = Object.entries(values).filter(([, v]) => v);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map(f => (
        <Select key={f.key} value={values[f.key] ?? ""} onChange={e => onChange(f.key, e.target.value)} className="w-auto">
          <option value="">{f.label}</option>
          {f.options.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
      ))}
      {active.length > 0 && (
        <button
          onClick={() => active.forEach(([k]) => onChange(k, ""))}
          className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
        >
          <X className="h-3 w-3" /> Clear ({active.length})
        </button>
      )}
    </div>
  );
}

