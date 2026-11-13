// File Location: frontend/src/components/layout/app-shell.tsx
// Purpose: Master Application Layout Shell (Sidebar, Topbar, Mobile Navigation Drawer, Content Viewport)

'use client';

import * as React from 'react';
import { Sidebar } from './sidebar';
import { MobileNav } from './mobile-nav';
import { Topbar, type TopbarUser } from './topbar';
import { PageTransition } from './page-transition';
import { cn } from '@/lib/utils';

export interface AppShellProps {
  children: React.ReactNode;
  organizationName?: string;
  organizationPlan?: string;
  user?: TopbarUser;
  onLogout?: () => void;
  onOpenCommandSearch?: () => void;
}

export function AppShell({
  children,
  organizationName,
  organizationPlan,
  user,
  onLogout,
  onOpenCommandSearch,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Desktop Fixed Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        organizationName={organizationName}
        organizationPlan={organizationPlan}
      />

      {/* Mobile Drawer Navigation */}
      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        organizationName={organizationName}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-200',
          sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        )}
      >
        <Topbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenCommandSearch={onOpenCommandSearch}
          user={user}
          onLogout={onLogout}
        />

        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
