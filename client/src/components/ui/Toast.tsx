import toast, { Toaster, Toast as ToastType } from 'react-hot-toast';

/**
 * Toast Component
 * Provides a centralized toast notification system
 */

// Toast configuration
export const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '14px',
        },
        // Success toast style
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          },
          style: {
            background: '#fff',
            color: '#1F2937',
            border: '1px solid #D1FAE5',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
        // Error toast style
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
          style: {
            background: '#fff',
            color: '#1F2937',
            border: '1px solid #FEE2E2',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
        // Loading toast style
        loading: {
          style: {
            background: '#fff',
            color: '#1F2937',
            border: '1px solid #E5E7EB',
          },
        },
      }}
    />
  );
};

/**
 * Toast utility functions
 */
export const showToast = {
  /**
   * Show success toast
   */
  success: (message: string) => {
    return toast.success(message);
  },

  /**
   * Show error toast
   */
  error: (message: string) => {
    return toast.error(message);
  },

  /**
   * Show loading toast
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Show info toast
   */
  info: (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#fff',
        color: '#1F2937',
        border: '1px solid #DBEAFE',
      },
    });
  },

  /**
   * Show warning toast
   */
  warning: (message: string) => {
    toast(message, {
      icon: '⚠️',
      style: {
        background: '#fff',
        color: '#1F2937',
        border: '1px solid #FEF3C7',
      },
    });
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },

  /**
   * Promise toast - shows loading, then success or error based on promise result
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  },

  /**
   * Custom toast with custom component
   */
  custom: (message: string, options?: any) => {
    toast(message, options);
  },
};

export default showToast;
