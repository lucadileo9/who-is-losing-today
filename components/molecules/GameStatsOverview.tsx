'use client';

import React from 'react';
import { Game, GAME_CONFIG } from '@/lib/game-data';
import { GameStatsSummary } from '@/lib/types/user';
import { GameBadge } from '@/components/atoms/GameBadge';
import { cn } from '@/lib/utils';

interface GameStatsOverviewProps {
  statsByGame: {
    krilion: GameStatsSummary;
    metazooa: GameStatsSummary;
    chronophoto: GameStatsSummary;
  };
  className?: string;
}

const gamesList: { id: Game; key: 'krilion' | 'metazooa' | 'chronophoto' }[] = [
  { id: 'Krilion', key: 'krilion' },
  { id: 'Metazooa', key: 'metazooa' },
  { id: 'Chronophoto', key: 'chronophoto' },
];

export function GameStatsOverview({
  statsByGame,
  className,
}: GameStatsOverviewProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-3', className)}>
      {gamesList.map(({ id, key }) => {
        const stats = statsByGame[key];
        const config = GAME_CONFIG[id];
        const hasPlayed = stats.played > 0;

        return (
          <div
            key={id}
            className="glass-card relative flex flex-col justify-between rounded-2xl border border-white/10 p-5 transition-all hover:border-white/20"
          >
            <div className="flex items-center justify-between">
              <GameBadge gameId={id} size="md" />
              <span className="text-[11px] font-bold uppercase text-muted-foreground">
                {stats.played} {stats.played === 1 ? 'partita' : 'partite'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/5 pt-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Record
                </span>
                <p className="mt-0.5 text-lg font-black text-white">
                  {hasPlayed
                    ? stats.bestScore.toLocaleString('it-IT')
                    : '-'}
                  {hasPlayed && (
                    <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                      {config.unit}
                    </span>
                  )}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Media
                </span>
                <p className="mt-0.5 text-lg font-black text-cyan-300">
                  {hasPlayed
                    ? Math.round(stats.averageScore).toLocaleString('it-IT')
                    : '-'}
                  {hasPlayed && (
                    <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                      {config.unit}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
