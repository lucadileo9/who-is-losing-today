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
          'inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-500/15 px-2.5 py-0.5 text-xs font-bold text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.25)]',
          className
        )}
      >
        <span>🥄</span>
        <span>Ultimo</span>
      </span>
    );
  }

  if (rank === 1) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-500/15 px-2.5 py-0.5 text-xs font-black text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
          className
        )}
      >
        <span>🥇</span>
        <span>1°</span>
      </span>
    );
  }

  if (rank === 2) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full border border-slate-300/40 bg-slate-300/15 px-2.5 py-0.5 text-xs font-bold text-slate-200',
          className
        )}
      >
        <span>🥈</span>
        <span>2°</span>
      </span>
    );
  }

  if (rank === 3) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full border border-amber-700/40 bg-amber-700/15 px-2.5 py-0.5 text-xs font-bold text-amber-500',
          className
        )}
      >
        <span>🥉</span>
        <span>3°</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex size-6 items-center justify-center rounded-full bg-white/5 text-xs font-medium text-muted-foreground',
        className
      )}
    >
      {rank}°
    </span>
  );
}
