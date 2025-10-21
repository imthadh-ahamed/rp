'use client';

import { ToastProvider } from '@/components/ui';

/**
 * Client-side Providers Component
 * Wraps client-only providers like Toast
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastProvider />
    </>
  );
}
