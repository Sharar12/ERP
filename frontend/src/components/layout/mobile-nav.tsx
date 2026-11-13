// File Location: frontend/src/components/layout/mobile-nav.tsx
// Purpose: Responsive Mobile Drawer Navigation Menu

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Building2 } from 'lucide-react';
import { NAV_ITEMS } from '@/constants/navigation';
import { cn } from '@/lib/utils';

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  organizationName?: string;
}

export function MobileNav({
  open,
  onClose,
  organizationName = 'Universal ERP',
}: MobileNavProps) {
  const pathname = usePathname();

  React.useEffect(() => {
    onClose();
  }, [pathname]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs" onClick={onClose} />
      <aside className="relative z-10 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5 truncate">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {organizationName}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <div key={`${item.href}-${item.label}`} className="space-y-1">
                <Link
                  href={item.children?.[0]?.href ?? item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>

                {item.children && (
                  <div className="ml-6 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-800">
                    {item.children.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          'block rounded-md px-2.5 py-1.5 text-xs font-medium',
                          pathname === sub.href
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                        )}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
