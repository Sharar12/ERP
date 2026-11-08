"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronsLeft, ChevronsRight } from "lucide-react";
import { NAV_ITEMS } from "@/constants/navigation";
import { MOCK_MODULES } from "@/mock-data/seed"; /* MOCK CONFIG: module visibility; API REPLACEMENT: modules API */
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* MOCK CONFIG: read enabled modules from in-memory seed for nav filtering. */
const enabledModules = new Set(MOCK_MODULES.filter(m => m.enabled).map(m => m.key));

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(NAV_ITEMS.filter(n => pathname.startsWith(n.href)).map(n => n.href)));

  const items = useMemo(() => NAV_ITEMS.filter(item => !item.moduleKey || enabledModules.has(item.moduleKey)), []);

  return (
    <aside className={cn("hidden h-screen shrink-0 flex-col border-r border-border bg-card md:flex transition-[width] duration-300 ease-out", collapsed ? "w-14" : "w-60")}>
      <div className="flex h-12 items-center justify-between border-b border-border px-3">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-foreground" />
            <span className="text-[13px] font-semibold tracking-tight">Universal ERP</span>
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(v => !v)}>
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {items.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const isOpen = openGroups.has(item.href);
          const hasChildren = !!item.children?.length;
          return (
            <div key={item.href} className="mb-0.5">
              <div className="flex items-center">
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex flex-1 items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px]",
                    "transition-colors duration-150",
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-foreground" />
                  )}
                  <Icon className="h-[15px] w-[15px] shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
                {!collapsed && hasChildren && (
                  <button
                    onClick={() => {
                      const n = new Set(openGroups);
                      n.has(item.href) ? n.delete(item.href) : n.add(item.href);
                      setOpenGroups(n);
                    }}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200 ease-out", isOpen && "rotate-180")} />
                  </button>
                )}
              </div>
              {!collapsed && hasChildren && isOpen && (
                <div className="ml-9 mt-0.5 space-y-0.5 border-l border-border pl-2">
                  {item.children!.map(child => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block rounded-md px-2 py-1 text-xs transition-colors duration-100",
                        pathname === child.href ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

