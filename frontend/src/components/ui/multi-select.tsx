"use client";
import { X } from "lucide-react";

export function MultiSelect({ value, onChange, options, placeholder }: {
  value: string[]; onChange: (v: string[]) => void; options: string[]; placeholder?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex flex-wrap gap-1">
        {value.map(v => (
          <span key={v} className="inline-flex items-center gap-1 rounded bg-accent/10 px-2 py-0.5 text-xs text-accent">
            {v}
            <button onClick={() => onChange(value.filter(x => x !== v))}><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      <select
        value=""
        onChange={e => { if (e.target.value && !value.includes(e.target.value)) onChange([...value, e.target.value]); }}
        className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm"
      >
        <option value="">{placeholder ?? "Add…"}</option>
        {options.filter(o => !value.includes(o)).map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

