'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface MobileHeaderProps {
  title: string;
  action?: ReactNode;
  onBack?: () => void;
  className?: string;
}

export default function MobileHeader({
  title,
  action,
  onBack,
  className,
}: MobileHeaderProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 z-50 w-full backdrop-saturate-150 transition-all duration-300',
        scrolled
          ? 'border-b border-gray-200 bg-white/50 shadow-xs backdrop-blur-md'
          : 'border-transparent bg-transparent',
        'flex items-center justify-between px-4 py-6',
        className
      )}
    >
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="cursor-pointer rounded-full border-1 border-gray-300 bg-white/80 p-2 text-gray-700 transition hover:bg-white"
        aria-label="Back"
      >
        <ChevronLeft className="h-5 w-5 text-(--color-primary-500)" />
      </button>

      {/* Title */}
      <h1
        className={cn(
          'text-xl font-bold transition-colors duration-300',
          scrolled && '#424B52'
        )}
      >
        {title}
      </h1>

      {/* Action Button */}
      {action ? (
        <div className="rounded-full bg-white/80 p-2 text-gray-700 transition hover:bg-white">
          {action}
        </div>
      ) : (
        <div className="w-9" />
      )}
    </header>
  );
}
