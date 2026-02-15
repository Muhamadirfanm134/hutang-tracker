'use client';

import { cn } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

interface ResponsiveModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  withCloseButton?: boolean;
}

export default function ResponsiveModal({
  isOpen,
  onOpenChange,
  title,
  children,
  withCloseButton = false,
}: ResponsiveModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </Dialog.Overlay>

        <Dialog.Content asChild>
          <motion.div
            className={`fixed z-100 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl ${
              isMobile
                ? 'right-0 bottom-0 left-0 rounded-t-4xl'
                : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            }`}
            initial={
              isMobile ? { y: '100%' } : { opacity: 0, y: -50, scale: 0.95 }
            }
            animate={isMobile ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={
              isMobile ? { y: '100%' } : { opacity: 0, y: -50, scale: 0.95 }
            }
            transition={{ duration: 0.3 }}
          >
            <div className="absolute top-2 left-0 flex w-full items-center justify-center">
              <div className="h-1 w-8 rounded-full bg-(--color-neutral-600)" />
            </div>

            <div className="mb-4 flex items-center justify-between">
              {title && (
                <Dialog.Title
                  className={cn('w-full text-lg font-semibold', {
                    'text-center': !withCloseButton,
                  })}
                >
                  {title}
                </Dialog.Title>
              )}
              {withCloseButton && (
                <Dialog.Close asChild>
                  <button className="cursor-pointer rounded-full border-1 border-gray-200 bg-white p-3 text-gray-500 hover:text-gray-800">
                    <X size={20} />
                  </button>
                </Dialog.Close>
              )}
            </div>

            <div>{children}</div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
