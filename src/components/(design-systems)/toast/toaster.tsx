'use client';

import React, { useEffect, useState } from 'react';
import Toast, { ToastVariant } from './toast';
import { cn } from '@/lib/utils';

type ToastPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'top-center';

type InternalToast = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  position?: ToastPosition;
};

const CHANNEL = '__juwal_toast__';

export function dispatchToast(payload: Omit<InternalToast, 'id'>) {
  if (typeof window === 'undefined') return;
  const ev = new CustomEvent(CHANNEL, { detail: payload });
  window.dispatchEvent(ev as Event);
}

export default function Toaster() {
  const [toasts, setToasts] = useState<InternalToast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      const detail = custom.detail as Omit<InternalToast, 'id'>;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const toast: InternalToast = {
        id,
        title: detail.title,
        description: detail.description,
        variant: detail.variant ?? 'default',
        duration: detail.duration ?? 4000,
        position: detail.position ?? 'top-center',
      };

      setToasts((s) => [toast, ...s]);

      setTimeout(() => {
        setToasts((s) => s.filter((t) => t.id !== id));
      }, toast.duration);
    };

    window.addEventListener(CHANNEL, handler as EventListener);
    return () => window.removeEventListener(CHANNEL, handler as EventListener);
  }, []);

  const remove = (id: string) => setToasts((s) => s.filter((t) => t.id !== id));

  const grouped = toasts.reduce(
    (acc, t) => {
      acc[t.position ?? 'top-center'].push(t);
      return acc;
    },
    {
      'bottom-right': [],
      'bottom-left': [],
      'top-right': [],
      'top-left': [],
      'top-center': [],
    } as Record<ToastPosition, InternalToast[]>
  );

  const positions: Record<ToastPosition, string> = {
    'bottom-right': 'bottom-4 right-4 md:bottom-8 md:right-8 items-end',
    'bottom-left': 'bottom-4 left-4 md:bottom-8 md:left-8 items-start',
    'top-right': 'top-4 right-4 md:top-8 md:right-8 items-end',
    'top-left': 'top-4 left-4 md:top-8 md:left-8 items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 md:top-8 items-center',
  };

  return (
    <>
      {(Object.keys(grouped) as ToastPosition[]).map((pos) => (
        <div
          key={pos}
          className={cn(
            'fixed z-50 flex w-auto flex-col space-y-2',
            positions[pos]
          )}
        >
          {grouped[pos].map((t) => (
            <Toast
              key={t.id}
              id={t.id}
              title={t.title}
              description={t.description}
              variant={t.variant}
              onClose={remove}
            />
          ))}
        </div>
      ))}
    </>
  );
}
