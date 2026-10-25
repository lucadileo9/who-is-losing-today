'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface RankBadgeProps {
  rank: number;
  isLoser?: boolean;
  className?: string;
}

export function RankBadge({
  rank,
  isLoser = false,
  className,
}: RankBadgeProps) {
  if (isLoser) {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs font-bold text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]',
          className
        )}
      >
        Ultimo
      </span>
    );
  }

  if (rank === 1) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center min-w-7 h-6 rounded-lg border border-amber-400/40 bg-amber-500/15 px-2 text-xs font-black text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)]',
          className
        )}
      >
        1°
      </span>
    );
  }

  if (rank === 2) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center min-w-7 h-6 rounded-lg border border-slate-300/30 bg-slate-300/10 px-2 text-xs font-bold text-slate-200',
          className
        )}
      >
        2°
      </span>
    );
  }

  if (rank === 3) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center min-w-7 h-6 rounded-lg border border-amber-700/30 bg-amber-700/10 px-2 text-xs font-bold text-amber-500',
          className
        )}
      >
        3°
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex min-w-7 h-6 items-center justify-center rounded-lg bg-white/[0.04] px-1.5 text-xs font-semibold text-muted-foreground border border-white/5',
        className
      )}
    >
      {rank}°
    </span>
  );
}
