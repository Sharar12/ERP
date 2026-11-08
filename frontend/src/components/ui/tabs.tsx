"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Tabs({ tabs, defaultTab, onChange }: {
  tabs: { key: string; label: string; content: React.ReactNode }[];
  defaultTab?: string;
  onChange?: (key: string) => void;
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.key);
  return (
    <div>
      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => { setActive(t.key); onChange?.(t.key); }}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2 text-sm transition-all duration-200",
              active === t.key ? "border-accent font-medium text-accent" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="animate-fade-in">{tabs.find(t => t.key === active)?.content}</div>
    </div>
  );
}

