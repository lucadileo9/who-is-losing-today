'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'winner' | 'loser' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function NeonButton({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled,
  ...props
}: NeonButtonProps) {
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
    md: 'h-10 px-4 text-sm rounded-xl gap-2',
    lg: 'h-12 px-6 text-base font-semibold rounded-xl gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] active:scale-[0.98]',
    winner:
      'bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] active:scale-[0.98]',
    loser:
      'bg-red-600 text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] active:scale-[0.98]',
    outline:
      'border border-white/15 bg-white/[0.03] text-foreground hover:bg-white/[0.08] hover:border-white/30 active:scale-[0.98]',
    ghost:
      'text-muted-foreground hover:bg-white/[0.05] hover:text-foreground active:scale-[0.98]',
  };

  return (
    <button
      className={cn(
        'inline-flex cursor-pointer select-none items-center justify-center font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
