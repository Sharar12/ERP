// File Location: frontend/src/components/ui/tabs.tsx
// Purpose: Tabbed Navigation Component (Variants: underline, pills, with content rendering support)

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id?: string;
  key?: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  count?: string | number;
  content?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  value?: string;
  onChange?: (id: string) => void;
  onValueChange?: (id: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export function Tabs({ tabs, activeTab, value, onChange, onValueChange, variant = 'underline', className }: TabsProps) {
  const [internalTab, setInternalTab] = React.useState<string>(() => {
    return activeTab ?? value ?? tabs[0]?.key ?? tabs[0]?.id ?? '';
  });

  const currentTab = activeTab ?? value ?? internalTab;

  const handleChange = (id: string) => {
    setInternalTab(id);
    onChange?.(id);
    onValueChange?.(id);
  };

  const activeContent = tabs.find((t) => (t.key ?? t.id ?? t.label) === currentTab)?.content;

  return (
    <div className="space-y-4">
      {variant === 'pills' ? (
        <div className={cn('inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80', className)}>
          {tabs.map((tab) => {
            const tabId = tab.key ?? tab.id ?? tab.label;
            const active = tabId === currentTab;
            const badgeValue = tab.badge ?? tab.count;
            return (
              <button
                key={tabId}
                type="button"
                onClick={() => handleChange(tabId)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all',
                  active
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {badgeValue !== undefined && (
                  <span className="rounded-full bg-indigo-100 px-1.5 py-0.2 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {badgeValue}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className={cn('border-b border-slate-200 dark:border-slate-800', className)}>
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {tabs.map((tab) => {
              const tabId = tab.key ?? tab.id ?? tab.label;
              const active = tabId === currentTab;
              const badgeValue = tab.badge ?? tab.count;
              return (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => handleChange(tabId)}
                  className={cn(
                    'inline-flex items-center gap-2 whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors',
                    active
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400'
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {badgeValue !== undefined && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        active
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      )}
                    >
                      {badgeValue}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {activeContent && <div>{activeContent}</div>}
    </div>
  );
}
