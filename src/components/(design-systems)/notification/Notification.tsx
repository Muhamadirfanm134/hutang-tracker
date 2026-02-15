'use client';

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ReactNode, useEffect } from 'react';

type Variant = 'info' | 'success' | 'warning' | 'error';
type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface NotificationProps {
  variant?: Variant;
  title?: string;
  description?: string;
  icon?: ReactNode;
  radius?: Radius;
  dismissible?: boolean;
  onDismiss?: () => void;
  duration?: number; // in ms, e.g., 5000 = 5s
  className?: string;
}

const variantStyle: Record<Variant, string> = {
  info: 'bg-(--color-primary-50) text-(--color-primary-800) border border-(--color-primary-200)',
  success: 'bg-green-50 text-green-800 border border-green-200',
  warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  error: 'bg-red-50 text-red-800 border border-red-200',
};

const defaultIcons: Record<Variant, ReactNode> = {
  info: (
    <InformationCircleIcon className="h-5 w-5 text-(--color-primary-500)" />
  ),
  success: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
  warning: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
  error: <XCircleIcon className="h-5 w-5 text-red-500" />,
};

const radiusClass: Record<Radius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export default function Notification({
  variant = 'info',
  title,
  description,
  icon,
  radius = 'md',
  dismissible = true,
  onDismiss,
  duration,
  className,
}: NotificationProps) {
  // Auto-dismiss effect
  useEffect(() => {
    if (duration && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  return (
    <div
      className={clsx(
        'flex w-full max-w-sm items-start gap-3 p-4 shadow-md transition-all',
        variantStyle[variant],
        radiusClass[radius],
        className
      )}
    >
      <div className="pt-1">{icon ?? defaultIcons[variant]}</div>

      <div className="flex-1 space-y-0.5 text-sm">
        {title && <p className="font-medium">{title}</p>}
        {description && <p className="text-xs">{description}</p>}
      </div>

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="cursor-pointer p-1 text-inherit transition hover:opacity-70"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
