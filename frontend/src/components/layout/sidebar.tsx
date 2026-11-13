// File Location: frontend/src/components/layout/sidebar.tsx
// Purpose: Collapsible Desktop Navigation Sidebar (Connected to NAV_ITEMS & dynamic modules)

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
} from 'lucide-react';
import { NAV_ITEMS, type NavItem } from '@/constants/navigation';
import { moduleService } from '@/services';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  organizationName?: string;
  organizationPlan?: string;
}

export function Sidebar({
  collapsed: controlledCollapsed,
  onToggleCollapse,
  organizationName = 'Universal ERP',
  organizationPlan = 'Enterprise Cloud',
}: SidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = React.useState(false);
  const collapsed = controlledCollapsed ?? internalCollapsed;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({});
  const [enabledModules, setEnabledModules] = React.useState<Set<string> | null>(null);

  React.useEffect(() => {
    moduleService
      .getAll()
      .then((mods) => {
        if (Array.isArray(mods) && mods.length > 0) {
          const enabled = new Set(
            mods
              .filter((m: any) => m.enabled ?? m.is_enabled ?? true)
              .map((m: any) => m.key ?? m.slug)
          );
          setEnabledModules(enabled);
        }
      })
      .catch(() => {});
  }, []);

  const items = React.useMemo(() => {
    return NAV_ITEMS.filter((item) => {
      if (!item.moduleKey) return true;
      if (!enabledModules) return true;
      return enabledModules.has(item.moduleKey);
    });
  }, [enabledModules]);

  React.useEffect(() => {
    const activeParent = items.find((item) =>
      item.children?.some((sub) => pathname === sub.href || pathname.startsWith(sub.href + '/'))
    );
    if (activeParent) {
      setOpenGroups((prev) => ({ ...prev, [activeParent.href]: true }));
    }
  }, [pathname, items]);

  const toggleGroup = (href: string) => {
    setOpenGroups((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  return (
    <aside
      className={cn(
        'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-30 border-r border-slate-200 bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-900',
        collapsed ? 'lg:w-[72px]' : 'lg:w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-4 dark:border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Building2 className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <p className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                {organizationName}
              </p>
              <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {organizationPlan}
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const hasChildren = Boolean(item.children?.length);
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const isOpen = openGroups[item.href] ?? false;

          if (hasChildren && !collapsed) {
            return (
              <div key={`${item.href}-${item.label}`} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(item.href)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-50/70 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100'
                  )}
                >
                  <span className="flex items-center gap-3 truncate">
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-150',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="ml-4 space-y-0.5 border-l border-slate-200 pl-3 dark:border-slate-800">
                    {item.children!.map((sub) => {
                      const subActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            'block rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                            subActive
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                          )}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.children?.[0]?.href ?? item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                collapsed ? 'justify-center' : 'gap-3',
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Action Footer */}
      <div className="border-t border-slate-200/80 p-3 dark:border-slate-800">
        <button
          type="button"
          onClick={handleToggle}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
