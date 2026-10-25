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
        'glass-card relative overflow-hidden rounded-2xl border-white/5 p-4 sm:p-5 transition-all hover:border-white/10',
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
          'mt-2 text-2xl sm:text-3xl font-black truncate',
          valueColor
        )}
      >
        {value}
      </p>
      {subtext && (
        <span className={cn('text-[11px] block truncate', subtextColor)}>
          {subtext}
        </span>
      )}
    </div>
  );
}
