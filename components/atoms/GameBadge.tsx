'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { BRAND_COLORS, DEFAULT_GAME_FALLBACKS } from '@/lib/theme/colors';

interface GameBadgeProps {
  gameId: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export function GameBadge({
  gameId,
  size = 'md',
  showDot = true,
  className,
}: GameBadgeProps) {
  const normalizedId = gameId.toLowerCase();

  let color: string = BRAND_COLORS.totale;
  let label = gameId;

  if (normalizedId === 'krilion') {
    color = BRAND_COLORS.krilion;
    label = 'Krilion';
  } else if (normalizedId === 'metazooa') {
    color = BRAND_COLORS.metazooa;
    label = 'Metazooa';
  } else if (normalizedId === 'chronophoto') {
    color = BRAND_COLORS.chronophoto;
    label = 'Chronophoto';
  } else if (normalizedId === 'totale') {
    color = BRAND_COLORS.totale;
    label = 'Totale';
  } else {
    const fallback = DEFAULT_GAME_FALLBACKS.find(
      (g) => g.id.toLowerCase() === normalizedId
    );
    if (fallback) {
      color = fallback.color;
      label = fallback.name;
    }
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold transition-all',
        size === 'sm'
          ? 'rounded-md px-2 py-0.5 text-[11px]'
          : 'rounded-lg px-2.5 py-1 text-xs',
        className
      )}
      style={{
        backgroundColor: `${color}18`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      {showDot && (
        <span
          className="size-1.5 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
      )}
      {label}
    </span>
  );
}
