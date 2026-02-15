'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

interface MenuItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  badgeText?: string;
  badgeColor?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  href,
  icon,
  title,
  badgeText,
  badgeColor = 'bg-yellow-500',
}) => {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-6 transition-all duration-200 hover:bg-gray-50'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex items-center gap-2">
          <div className="font-semibold text-gray-800">{title}</div>
          {badgeText && (
            <div
              className={cn(
                'rounded-full px-3 py-1 text-xs text-gray-800',
                badgeColor
              )}
            >
              {badgeText}
            </div>
          )}
        </div>
      </div>

      <ChevronRight className="text-gray-400" />
    </Link>
  );
};
