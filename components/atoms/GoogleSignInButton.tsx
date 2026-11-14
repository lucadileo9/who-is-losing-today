'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GoogleSignInButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  callbackUrl?: string;
}

export function GoogleSignInButton({
  size = 'md',
  label,
  callbackUrl = '/dashboard',
  className,
  onClick,
  ...props
}: GoogleSignInButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.4)]',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2 shadow-[0_0_18px_rgba(6,182,212,0.4)]',
    lg: 'px-8 py-3.5 text-base rounded-xl gap-3 shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)]',
  };

  const iconSizes = {
    sm: 'size-3.5',
    md: 'size-4',
    lg: 'size-5',
  };

  const defaultLabel = size === 'sm' ? 'Accedi' : 'Accedi con Google';
  const displayLabel = label ?? defaultLabel;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (!e.defaultPrevented) {
      signIn('google', { callbackUrl });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'group inline-flex cursor-pointer items-center justify-center font-bold text-black transition-all bg-cyan-500 hover:bg-cyan-400 active:scale-95',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <LogIn
        className={cn('transition-transform group-hover:scale-110', iconSizes[size])}
      />
      <span>{displayLabel}</span>
    </button>
  );
}
