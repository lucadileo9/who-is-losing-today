'use client';

import React from 'react';
import { Crown, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlayerAvatar } from '@/components/atoms/PlayerAvatar';
import { DailyPlayerScore } from '@/lib/types/daily';

interface HeroPlayerCardProps {
  type: 'winner' | 'loser';
  playerScore: DailyPlayerScore | null;
  totalPlayers: number;
  currentUserId?: string;
  className?: string;
}

const config = {
  winner: {
    title: 'Il Re della Giornata',
    badge: '1° Posto',
    icon: Crown,
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgGradient: 'bg-gradient-to-br from-amber-500/15 via-transparent to-transparent',
    glowShadow: 'shadow-[0_0_25px_rgba(245,158,11,0.2)]',
    scoreColor: 'text-amber-400',
    iconBadgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
    youBadgeBg: 'bg-amber-500/30 text-amber-300 border-amber-500/40',
    emptyTitle: 'In attesa del leader',
    emptyDesc: 'Nessun punteggio completato per questa giornata.',
  },
  loser: {
    title: 'Il Perdente di Oggi',
    badge: 'Ultimo Posto',
    icon: Flame,
    accentColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    bgGradient: 'bg-gradient-to-br from-red-500/15 via-transparent to-transparent',
    glowShadow: 'shadow-[0_0_25px_rgba(239,68,68,0.2)]',
    scoreColor: 'text-red-400',
    iconBadgeBg: 'bg-red-500/20 border-red-500/40 text-red-400',
    youBadgeBg: 'bg-red-500/30 text-red-300 border-red-500/40',
    emptyTitle: 'Nessun perdente',
    emptyDesc:
      'Serve almeno un avversario per poter assegnare la posizione di ultimo classificato.',
  },
};

export function HeroPlayerCard({
  type,
  playerScore,
  totalPlayers,
  currentUserId,
  className,
}: HeroPlayerCardProps) {
  const isWinner = type === 'winner';
  const cfg = config[type];
  const Icon = cfg.icon;

  const isMe = currentUserId && playerScore?.user.id === currentUserId;

  const hasNoPlayer = !playerScore || (!isWinner && totalPlayers < 2);

  return (
    <div
      className={cn(
        'glass-card relative overflow-hidden rounded-3xl p-5 sm:p-6 transition-all duration-300',
        cfg.borderColor,
        cfg.bgGradient,
        cfg.glowShadow,
        className
      )}
    >
      {/* Header della Card */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'flex size-7 items-center justify-center rounded-lg border text-sm',
              cfg.iconBadgeBg
            )}
          >
            <Icon className="size-4" />
          </span>
          <span
            className={cn(
              'text-xs font-black uppercase tracking-wider',
              cfg.accentColor
            )}
          >
            {cfg.title}
          </span>
        </div>

        {!hasNoPlayer && (
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[10px] font-bold border uppercase',
              cfg.iconBadgeBg
            )}
          >
            {cfg.badge}
          </span>
        )}
      </div>

      {/* Contenuto Card */}
      {hasNoPlayer ? (
        <div className="my-6 text-center py-4">
          <h3 className="text-base font-bold text-white">{cfg.emptyTitle}</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
            {cfg.emptyDesc}
          </p>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-4 sm:gap-5">
          <PlayerAvatar
            name={playerScore.user.name}
            image={playerScore.user.image}
            color={playerScore.user.color}
            size="lg"
            isWinner={isWinner}
            isLoser={!isWinner}
            className="shrink-0"
          />

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-white truncate">
                {playerScore.user.name}
              </h3>
              {isMe && (
                <span
                  className={cn(
                    'rounded px-1.5 py-0.5 text-[10px] font-black border uppercase',
                    cfg.youBadgeBg
                  )}
                >
                  Tu
                </span>
              )}
            </div>

            <div className="mt-1 flex items-baseline gap-1.5">
              <span
                className={cn(
                  'text-2xl sm:text-3xl font-black tracking-tight',
                  cfg.scoreColor
                )}
              >
                {playerScore.normalizedScore}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                pt complessivi
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
