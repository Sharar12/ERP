// File Location: frontend/src/components/layout/page-transition.tsx
// Purpose: Smooth Page Navigation Transition Animation

'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setVisible(false);
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div
      className={cn(
        'transition-all duration-200 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
}
