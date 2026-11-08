"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/constants/navigation";
import { MOCK_MODULES } from "@/mock-data/seed";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const enabled = new Set(MOCK_MODULES.filter(m => m.enabled).map(m => m.key));

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items = NAV_ITEMS.filter(i => !i.moduleKey || enabled.has(i.moduleKey));
  return (
    <>
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)}><Menu className="h-4 w-4" /></Button>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 overflow-y-auto border-r border-border bg-card p-3 animate-slide-in-left">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="h-7 w-7 rounded-lg bg-accent" /><span className="text-sm font-semibold">Universal ERP</span></div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            {items.map(item => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <div key={item.href} className="mb-0.5">
                  <Link href={item.href} onClick={() => setOpen(false)}
                    className={cn("flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors duration-150",
                      active ? "bg-accent/10 font-medium text-accent" : "hover:bg-muted")}>
                    <Icon className="h-4 w-4" />{item.label}
                  </Link>
                  {item.children?.map(c => (
                    <Link key={c.href} href={c.href} onClick={() => setOpen(false)}
                      className={cn("block rounded-md py-1.5 pl-10 pr-2 text-xs transition-colors duration-150",
                        pathname === c.href ? "text-accent font-medium" : "text-muted-foreground")}>
                      {c.label}
                    </Link>
                  ))}
                </div>
              );
            })}
          </aside>
        </div>
      )}
    </>
  );
}

