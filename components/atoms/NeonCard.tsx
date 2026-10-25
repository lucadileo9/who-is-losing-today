'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface NeonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'winner' | 'loser' | 'interactive';
  glowColor?: string;
  children: React.ReactNode;
}

export function NeonCard({
  variant = 'default',
  glowColor,
  children,
  className,
  style,
  ...props
}: NeonCardProps) {
  const variantClasses = {
    default: 'glass-card text-foreground',
    winner:
      'glass-card border-glow-winner bg-gradient-to-br from-amber-500/10 via-transparent to-transparent text-foreground',
    loser:
      'glass-card border-glow-loser bg-gradient-to-br from-red-500/10 via-transparent to-transparent text-foreground',
    interactive:
      'glass-card transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] cursor-pointer text-foreground',
  };

  const customStyle: React.CSSProperties = {
    ...style,
    ...(glowColor
      ? {
          borderColor: `${glowColor}50`,
          boxShadow: `0 0 20px ${glowColor}25`,
        }
      : {}),
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-5 md:p-6',
        variantClasses[variant],
        className
      )}
      style={customStyle}
      {...props}
    >
      {children}
    </div>
  );
}
