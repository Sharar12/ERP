"use client";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "./button";

export function Repeatable<T>({ items, onChange, renderItem, createItem, addLabel = "Add row" }: {
  items: T[]; onChange: (v: T[]) => void;
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => React.ReactNode;
  createItem: () => T; addLabel?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 rounded-lg border border-border p-2">
          <div className="flex-1">{renderItem(item, i, (patch) => {
            const next = [...items];
            next[i] = { ...next[i], ...patch };
            onChange(next);
          })}</div>
          <Button variant="ghost" size="icon" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...items, createItem()])}>
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </Button>
    </div>
  );
}

