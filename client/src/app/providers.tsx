'use client';

import { ToastProvider } from '@/components/ui';
import AuthLoader from '@/components/common/AuthLoader';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';

/**
 * Client-side Providers Component
 * Wraps client-only providers like Toast
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <ToastProvider />
      <AuthLoader />
    </Provider>
  );
}
