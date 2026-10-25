import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CommunityStatCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  subtext?: string;
  subtextColor?: string;
  className?: string;
}

export function CommunityStatCard({
  label,
  value,
  icon: Icon,
  iconColor = 'text-cyan-400',
  valueColor = 'text-white',
  subtext,
  subtextColor = 'text-muted-foreground',
  className,
}: CommunityStatCardProps) {
  return (
    <div
      className={cn(
        'glass-card relative overflow-hidden rounded-2xl border-white/5 p-4 transition-all hover:border-white/10 sm:p-5',
        className
      )}
    >
      <div className={cn('flex items-center gap-2', iconColor)}>
        <Icon className="size-4 shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p
        className={cn(
          'mt-2 truncate text-2xl font-black sm:text-3xl',
          valueColor
        )}
      >
        {value}
      </p>
      {subtext && (
        <span className={cn('block truncate text-[11px]', subtextColor)}>
          {subtext}
        </span>
      )}
    </div>
  );
}
