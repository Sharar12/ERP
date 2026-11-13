// File Location: frontend/src/app/(dashboard)/layout.tsx
// Purpose: Authenticated Application Shell Wrapper (Sidebar + Topbar + Viewport)

import { AppShell } from "@/components/layout/app-shell";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

