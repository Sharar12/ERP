// File Location: frontend/src/components/layout/topbar.tsx
// Purpose: Header Topbar Component (Global Search, Dark/Light Toggle, Notifications Drawer, User Profile Menu)

'use client';

import * as React from 'react';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from './theme-provider';
import { useAuth } from '@/hooks/use-auth';
import { notificationService, organizationService } from '@/services';
import type { Notification } from '@/types';

export interface TopbarUser {
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
}

export interface TopbarProps {
  onOpenMobileNav?: () => void;
  onOpenCommandSearch?: () => void;
  user?: TopbarUser;
  unreadNotifications?: number;
  onLogout?: () => void;
}

export function Topbar({
  onOpenMobileNav,
  onOpenCommandSearch,
  user: controlledUser,
  unreadNotifications: controlledUnread,
  onLogout: controlledLogout,
}: TopbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { user: authUser, logout: authLogout } = useAuth();
  const [org, setOrg] = React.useState<any>(null);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    organizationService.get().then(setOrg).catch(() => {});
    notificationService.getAll().then(setNotifications).catch(() => setNotifications([]));
  }, []);

  const activeUser: TopbarUser = controlledUser || {
    name: authUser?.name || 'Administrator',
    email: authUser?.email || 'admin@universal-erp.io',
    role: (authUser as any)?.role || 'System Admin',
  };

  const handleLogout = controlledLogout || authLogout;

  React.useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenCommandSearch?.();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onOpenCommandSearch]);

  const initials = activeUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const unreadCount = controlledUnread ?? notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/90 bg-white/90 px-4 backdrop-blur-md sm:px-6 dark:border-slate-800 dark:bg-slate-900/90">
      {/* Left: Mobile Trigger & Global Quick Search */}
      <div className="flex items-center gap-3">
        {onOpenMobileNav && (
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenCommandSearch}
          className="flex h-9 w-56 items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-3 text-xs text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100/70 sm:w-72 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-400 dark:hover:border-slate-700"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span>Search orders, SKUs, staff...</span>
          </span>
          <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-500 sm:inline-block dark:border-slate-700 dark:bg-slate-900">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Theme Switcher, Notifications & Profile Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {org && (
          <span className="hidden md:inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {org.name}
          </span>
        )}

        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          title="Toggle color theme"
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <Link
          href="/announcements"
          title="Announcements & Alerts"
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
          )}
        </Link>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

        {/* User Account Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-xl p-1 pr-2 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {initials}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{activeUser.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{activeUser.role}</p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 md:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">{activeUser.name}</p>
                <p className="truncate text-[11px] text-slate-500">{activeUser.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/settings/organization"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  Organization Settings
                </Link>
              </div>
              {handleLogout && (
                <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
