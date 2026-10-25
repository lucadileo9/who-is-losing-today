import React from 'react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  subtext?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = 'text-cyan-400',
  subtext,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center sm:min-w-[85px] transition-all hover:border-white/15 hover:bg-white/[0.05]',
        className
      )}
    >
      <span
        className={cn(
          'flex items-center gap-1 text-[11px] font-bold uppercase',
          iconColor
        )}
      >
        {Icon && <Icon className="size-3.5" />}
        {label}
      </span>
      <span className="mt-1 text-xl sm:text-2xl font-black text-white">
        {value}
      </span>
      {subtext && (
        <span className="text-[10px] text-muted-foreground">{subtext}</span>
      )}
    </div>
  );
}
