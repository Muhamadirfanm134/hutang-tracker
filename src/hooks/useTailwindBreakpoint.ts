'use client';
import { useEffect, useState } from 'react';

type TailwindBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints: Record<TailwindBreakpoint, number> = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

const entries = Object.entries(breakpoints).sort((a, b) => b[1] - a[1]) as [
  TailwindBreakpoint,
  number,
][];

export const useTailwindBreakpoint = (): TailwindBreakpoint | null => {
  const [breakpoint, setBreakpoint] = useState<TailwindBreakpoint | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const getBreakpoint = () => {
      const width = window.innerWidth;
      const bp = entries.find(([, minWidth]) => width >= minWidth)?.[0] || null;
      setBreakpoint(bp);
    };

    getBreakpoint(); // initial
    window.addEventListener('resize', getBreakpoint);
    return () => window.removeEventListener('resize', getBreakpoint);
  }, []);

  return breakpoint;
};
