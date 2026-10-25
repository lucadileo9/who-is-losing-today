'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PlayerAvatar } from '@/components/atoms/PlayerAvatar';
import { RankBadge } from '@/components/atoms/RankBadge';
import { UserSummaryDTO } from '@/lib/types/user';

interface StandingsRowProps {
  rank: number;
  user: UserSummaryDTO;
  rawScore?: number | string;
  normalizedScore: number;
  scoreUnit?: string;
  secondaryInfo?: string; // es. "3 partite" o "Media: 840"
  isCurrentUser?: boolean;
  isWinner?: boolean;
  isLoser?: boolean;
  className?: string;
}

export function StandingsRow({
  rank,
  user,
  rawScore,
  normalizedScore,
  scoreUnit,
  secondaryInfo,
  isCurrentUser = false,
  isWinner = false,
  isLoser = false,
  className,
}: StandingsRowProps) {
  return (
    <div
      className={cn(
        'group flex items-center justify-between gap-3 rounded-xl p-3 transition-all duration-200',
        isWinner
          ? 'border border-amber-500/30 bg-amber-500/[0.08] shadow-[0_0_15px_rgba(245,158,11,0.15)]'
          : isLoser
            ? 'border border-red-500/30 bg-red-500/[0.08] shadow-[0_0_15px_rgba(239,68,68,0.15)]'
            : isCurrentUser
              ? 'border border-cyan-500/30 bg-cyan-500/[0.06]'
              : 'border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.05]',
        className
      )}
    >
      {/* Colonna Sinistra: Posizione + Avatar + Nome */}
      <div className="flex min-w-0 items-center gap-3">
        <RankBadge rank={rank} isLoser={isLoser} className="shrink-0" />

        <Link
          href={`/profile/${user.id}`}
          className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-85"
        >
          <PlayerAvatar
            name={user.name}
            image={user.image}
            color={user.color}
            size="sm"
            isWinner={isWinner}
            isLoser={isLoser}
            className="shrink-0"
          />

          <div className="flex min-w-0 flex-col truncate">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'truncate text-sm font-bold transition-colors group-hover:text-cyan-300',
                  isWinner
                    ? 'text-amber-300'
                    : isLoser
                      ? 'text-red-300'
                      : isCurrentUser
                        ? 'text-cyan-300'
                        : 'text-white'
                )}
              >
                {user.name}
              </span>
              {isCurrentUser && (
                <span className="py-0.2 rounded border border-cyan-500/30 bg-cyan-500/20 px-1.5 text-[10px] font-black uppercase text-cyan-300">
                  Tu
                </span>
              )}
            </div>
            {secondaryInfo && (
              <span className="truncate text-[11px] text-muted-foreground">
                {secondaryInfo}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Colonna Destra: Punteggio Normalizzato e Grezzo */}
      <div className="flex shrink-0 flex-col items-end">
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              'text-base font-black tracking-tight md:text-lg',
              isWinner
                ? 'text-amber-400'
                : isLoser
                  ? 'text-red-400'
                  : 'text-white'
            )}
          >
            {normalizedScore}
          </span>
          <span className="text-[10px] font-semibold text-muted-foreground">
            pt
          </span>
        </div>

        {rawScore !== undefined && (
          <span className="text-[11px] font-medium text-muted-foreground">
            {typeof rawScore === 'number'
              ? rawScore.toLocaleString('it-IT')
              : rawScore}{' '}
            {scoreUnit}
          </span>
        )}
      </div>
    </div>
  );
}
