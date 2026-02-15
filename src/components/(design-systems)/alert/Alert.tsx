'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';
type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface AlertProps {
  isOpen?: boolean;
  variant?: AlertVariant;
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  radius?: Radius;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export default function Alert({
  isOpen = true,
  variant = 'info',
  title,
  description,
  icon,
  action,
  radius = 'md',
  className,
  dismissible = false,
  onDismiss,
}: AlertProps) {
  if (!isOpen) return null;

  const variantStyles: Record<AlertVariant, string> = {
    info: 'bg-[--color-primary-50] text-[--color-primary-800] border border-[--color-primary-200]',
    success: 'bg-green-50 text-green-800 border border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    error: 'bg-red-50 text-red-800 border border-red-200',
  };

  const radiusClass: Record<Radius, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const defaultIcons: Record<AlertVariant, ReactNode> = {
    info: (
      <InformationCircleIcon className="h-5 w-5 text-[--color-primary-500]" />
    ),
    success: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    warning: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
    error: <XCircleIcon className="h-5 w-5 text-red-500" />,
  };

  return (
    <div
      className={clsx(
        'flex w-full items-start gap-3 p-4 text-sm',
        variantStyles[variant],
        radiusClass[radius],
        className
      )}
    >
      <div className="shrink-0 pt-1">{icon ?? defaultIcons[variant]}</div>

      <div className="flex-1 space-y-0.5">
        {title && <p className="font-medium">{title}</p>}
        {description && <p className="text-sm">{description}</p>}
      </div>

      {dismissible && (
        <button
          onClick={onDismiss}
          className="mt-1 ml-auto text-inherit transition hover:opacity-70"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}

      {action && <div className="ml-2">{action}</div>}
    </div>
  );
}
