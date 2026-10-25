'use client';

import React from 'react';
import { Trophy, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GameBadge } from '@/components/atoms/GameBadge';
import { PlayerAvatar } from '@/components/atoms/PlayerAvatar';
import { AllTimeRecordItem } from '@/lib/types/period';

interface HallOfFameCardProps {
  record: AllTimeRecordItem | null;
  gameId: string;
  gameName: string;
  className?: string;
}

export function HallOfFameCard({
  record,
  gameId,
  gameName,
  className,
}: HallOfFameCardProps) {
  if (!record) {
    return (
      <div
        className={cn(
          'glass-card flex flex-col justify-between rounded-2xl border-white/5 p-4 opacity-60',
          className
        )}
      >
        <div className="flex items-center justify-between">
          <GameBadge gameId={gameId} size="sm" />
          <Trophy className="size-4 text-muted-foreground" />
        </div>
        <div className="my-4 text-center">
          <p className="text-xs text-muted-foreground">Nessun record ancora</p>
        </div>
      </div>
    );
  }

  const formattedDate = (() => {
    try {
      const [year, month, day] = record.date.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('it-IT', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d);
    } catch {
      return record.date;
    }
  })();

  return (
    <div
      className={cn(
        'glass-card relative flex flex-col justify-between overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:border-amber-400/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
        className
      )}
    >
      {/* Top Header: Badge Gioco + Icona Trofeo Oro */}
      <div className="flex items-center justify-between">
        <GameBadge gameId={gameId} size="sm" />
        <span className="flex size-7 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/15 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
          <Trophy className="size-3.5" />
        </span>
      </div>

      {/* Record Value */}
      <div className="my-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black tracking-tight text-white">
            {record.score.toLocaleString('it-IT')}
          </span>
          <span className="text-xs font-bold uppercase text-amber-400">
            {record.unit}
          </span>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">
          Miglior prestazione di sempre
        </span>
      </div>

      {/* Detentore del Record */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <div className="flex min-w-0 items-center gap-2">
          <PlayerAvatar
            name={record.holder.name}
            image={record.holder.image}
            color={record.holder.color}
            size="xs"
            isWinner={true}
          />
          <span className="max-w-[100px] truncate text-xs font-bold text-white sm:max-w-[120px]">
            {record.holder.name}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
          <Calendar className="size-3" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
