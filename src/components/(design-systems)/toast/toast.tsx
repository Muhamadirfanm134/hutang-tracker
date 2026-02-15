'use client';

import React from 'react';
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

const variantStyles: Record<ToastVariant, string> = {
  default: 'bg-slate-700/90 border-slate-600 text-white',
  success: 'bg-green-700 text-white border-green-600',
  error: 'bg-red-700 text-white border-red-600',
  warning: 'bg-amber-700 text-white border-amber-600',
  info: 'bg-blue-700 text-white border-blue-600',
};

const iconBgStyles: Record<ToastVariant, string> = {
  default: 'bg-slate-600',
  success: 'bg-green-600',
  error: 'bg-red-600',
  warning: 'bg-amber-600',
  info: 'bg-blue-600',
};

const variantIcon: Record<ToastVariant, React.ReactNode> = {
  default: null,
  success: <CheckCircle2 className="h-5 w-5 shrink-0" />,
  error: <XCircle className="h-5 w-5 shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 shrink-0" />,
  info: <Info className="h-5 w-5 shrink-0" />,
};

export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  onClose: (id: string) => void;
};

export default function Toast({
  id,
  title,
  description,
  variant = 'default',
  onClose,
}: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto mb-3 flex w-full max-w-xl items-center justify-between rounded-full border px-3 py-2.5 shadow-lg backdrop-blur-sm transition-all',
        variantStyles[variant]
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full',
            iconBgStyles[variant]
          )}
        >
          {variantIcon[variant]}
        </div>
        <div className="flex flex-col">
          {title && (
            <span className="text-xs leading-none font-bold">{title}</span>
          )}
          {description && (
            <span className="mt-0.5 text-xs leading-tight opacity-80">
              {description}
            </span>
          )}
        </div>
      </div>

      <button
        aria-label="Close"
        onClick={() => onClose(id)}
        className="ml-4 rounded-full border-1 border-white p-1 transition-colors hover:bg-white/10"
      >
        <X className="h-4 w-4 opacity-80" />
      </button>
    </div>
  );
}
