'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const sizeConfig = {
  sm: {
    title: 'text-sm sm:text-base font-bold',
    icon: 'size-4',
  },
  md: {
    title: 'text-base sm:text-lg md:text-xl font-black tracking-tight',
    icon: 'size-5',
  },
  lg: {
    title: 'text-lg sm:text-xl md:text-2xl font-black tracking-tight',
    icon: 'size-6',
  },
  xl: {
    title: 'text-2xl sm:text-3xl md:text-4xl font-black tracking-tight',
    icon: 'size-7',
  },
};

export function SectionHeading({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-cyan-400',
  size = 'md',
  badge,
  action,
  className,
}: SectionHeadingProps) {
  const cfg = sizeConfig[size];

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-2',
        className
      )}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {Icon && <Icon className={cn(cfg.icon, iconColor, 'shrink-0')} />}
          <h2 className={cn(cfg.title, 'text-white truncate')}>{title}</h2>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
