'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { DEFAULT_USER_COLOR } from '@/lib/theme/colors';

interface PlayerAvatarProps {
  name: string;
  image?: string | null;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isWinner?: boolean;
  isLoser?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-base font-semibold',
  xl: 'size-20 text-xl font-bold',
};

export function PlayerAvatar({
  name,
  image,
  color = DEFAULT_USER_COLOR,
  size = 'md',
  isWinner = false,
  isLoser = false,
  className,
}: PlayerAvatarProps) {
  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  // Ring styling basato sullo status o sul colore del giocatore
  const ringStyle = isWinner
    ? 'ring-2 ring-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
    : isLoser
      ? 'ring-2 ring-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
      : 'ring-1 ring-white/15';

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full transition-transform',
        sizeClasses[size],
        ringStyle,
        className
      )}
      style={{
        backgroundColor: color ? `${color}25` : undefined,
        borderColor: color || undefined,
      }}
      title={name}
    >
      {image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={image}
          alt={name}
          className="size-full rounded-full object-cover"
        />
      ) : (
        <span
          className="font-bold tracking-tight"
          style={{ color: color || '#ffffff' }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
