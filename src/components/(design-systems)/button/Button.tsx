'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import LoadingIcon from '@/components/ui/LoadingIcon';
import Link from 'next/link';
import {
  Radius,
  radiusClasses,
  Size,
  sizeClasses,
  Variant,
  variantClasses,
} from './constant';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  radius?: Radius;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  children?: ReactNode;
  href?: string;
}

export default function Button({
  variant = 'default',
  radius = 'md',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  children,
  className,
  disabled,
  href,
  ...props
}: ButtonProps) {
  const isIconOnly = !!icon && !children;

  const classes = clsx(
    'inline-flex items-center justify-center font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    radiusClasses[radius],
    !isIconOnly && sizeClasses[size],
    isIconOnly && 'w-10 h-10 p-0',
    className
  );

  const content = (
    <>
      {isLoading && <LoadingIcon size={18} color="white" className="mr-2" />}
      {!isLoading && icon && iconPosition === 'left' && <span>{icon}</span>}
      {children}
      {!isLoading && icon && iconPosition === 'right' && <span>{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} target="_blank" className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button {...props} disabled={disabled || isLoading} className={classes}>
      {content}
    </button>
  );
}
