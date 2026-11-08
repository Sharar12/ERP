"use client";
import { usePathname } from "next/navigation";
import { Bell, Moon, Plus, Search, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_NOTIFICATIONS, MOCK_ORGANIZATIONS } from "@/mock-data/seed";
import { Badge } from "@/components/ui/badge";
import { MobileNav } from "./mobile-nav";
import Link from "next/link";

export function Topbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [org, setOrg] = useState(MOCK_ORGANIZATIONS[0]);
  const [showNotif, setShowNotif] = useState(false);

  const crumbs = pathname.split("/").filter(Boolean);

  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div className="hidden text-xs text-muted-foreground sm:flex sm:items-center sm:gap-1">
          <Link href="/dashboard" className="hover:text-foreground">Home</Link>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              <span>/</span>
              <span className="capitalize text-foreground/80">{c.replace(/-/g, " ")}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search…" className="w-64 pl-8" />
          </div>
        </div>
        <select
          value={org.id}
          onChange={e => setOrg(MOCK_ORGANIZATIONS.find(o => o.id === e.target.value)!)}
          className="hidden h-8 rounded-md border border-border bg-background px-2 text-xs md:block"
        >
          {MOCK_ORGANIZATIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex"><Plus className="h-3.5 w-3.5" /> Create</Button>
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <div className="relative">
          <Button variant="ghost" size="icon" onClick={() => setShowNotif(v => !v)}>
            <Bell className="h-4 w-4" />
            {MOCK_NOTIFICATIONS.some(n => !n.read) && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive animate-pulse-dot" />}
          </Button>
          {showNotif && (
            <div className="absolute right-0 z-30 mt-1 w-80 rounded-lg border border-border bg-card p-2 shadow-xl animate-fade-down">
              <div className="px-2 py-1 text-xs font-medium">Notifications</div>
              <div className="max-h-72 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map(n => (
                  <div key={n.id} className="rounded-md px-2 py-2 text-xs transition-colors duration-150 hover:bg-muted cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{n.title}</span>
                      <Badge tone={n.type === "error" ? "danger" : n.type === "warning" ? "warning" : n.type === "success" ? "success" : "info"}>{n.type}</Badge>
                    </div>
                    <p className="text-muted-foreground">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground transition-transform duration-200 hover:scale-105"><User className="h-3 w-3" /></div>
          <div className="hidden text-xs leading-tight sm:block">
            <div className="font-medium">Sarah Chen</div>
            <div className="text-muted-foreground">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
