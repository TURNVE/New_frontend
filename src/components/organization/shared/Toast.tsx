import React from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
} from 'lucide-react';

// Toast wrapper component
export function ToastProvider() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
      }}
    />
  );
}

// Toast helper functions
export const toastUtils = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    });
  },

  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: <XCircle className="w-5 h-5 text-red-600" />,
    });
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    });
  },

  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      icon: <Info className="w-5 h-5 text-blue-600" />,
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      icon: <Loader2 className="w-5 h-5 animate-spin" />,
      duration: Infinity,
    });
  },

  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: Error) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success: (data) => (typeof success === 'function' ? success(data) : success),
      error: (err) => (typeof error === 'function' ? error(err) : error),
    });
  },

  custom: (
    message: React.ReactNode,
    options?: {
      duration?: number;
      onDismiss?: () => void;
      onAutoClose?: () => void;
      action?: {
        label: string;
        onClick: () => void;
      };
    }
  ) => {
    return toast.custom(() => <>{message}</>, options);
  },
};

// Hook for using toasts
export function useToast() {
  return toastUtils;
}

// Toast action component for undo/redo
export function ToastAction({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
    >
      {label}
    </button>
  );
}
