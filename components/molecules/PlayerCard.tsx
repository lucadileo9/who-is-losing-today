'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserProfileDTO } from '@/lib/types/user';
import { PlayerAvatar } from '@/components/atoms/PlayerAvatar';

export interface PlayerCardProps {
  player: UserProfileDTO;
  isSelf?: boolean;
  className?: string;
}

export function PlayerCard({
  player,
  isSelf = false,
  className,
}: PlayerCardProps) {
  const profileHref = isSelf ? '/profile' : `/profile/${player.user.id}`;
  const playerColor = player.user.color || '#06b6d4';

  return (
    <div
      className={cn(
        'glass-card group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 p-5 sm:p-6 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]',
        className
      )}
    >
      {/* Glow d'accento col colore personalizzato */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-30"
        style={{ backgroundColor: playerColor }}
      />

      <div>
        {/* Intestazione Card: Avatar + Dati Anagrafici + Badge */}
        <div className="flex items-start justify-between gap-3">
          <Link
            href={profileHref}
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <PlayerAvatar
              name={player.user.name}
              image={player.user.image}
              color={playerColor}
              size="md"
              className="shrink-0 shadow-md"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="truncate font-black text-white transition-colors group-hover:text-cyan-400">
                  {player.user.name}
                </h3>
                {isSelf && (
                  <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-black text-cyan-300 border border-cyan-500/30">
                    TU
                  </span>
                )}
              </div>
              {player.role === 'ADMIN' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                  <ShieldCheck className="size-2.5" /> Admin
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground">
                  Giocatore
                </span>
              )}
            </div>
          </Link>

          {/* Badge Streak Attiva */}
          {player.streak > 0 ? (
            <span className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/15 px-2 py-0.5 text-[10px] font-black text-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.25)]">
              <Flame className="size-3" />
              {player.streak} {player.streak === 1 ? 'giorno' : 'gg'}
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground/50">
              Streak 0
            </span>
          )}
        </div>

        {/* Statistiche in 4 box compatti */}
        <div className="mt-5 grid grid-cols-4 gap-2 border-y border-white/5 py-3">
          {/* Vittorie */}
          <div className="text-center">
            <span className="block text-[10px] font-bold uppercase text-muted-foreground">
              Vinte
            </span>
            <span className="mt-0.5 block text-sm font-black text-amber-400">
              {player.dailyWinsCount}
            </span>
          </div>

          {/* Cucchiai */}
          <div className="text-center">
            <span className="block text-[10px] font-bold uppercase text-muted-foreground">
              Cucchiai
            </span>
            <span className="mt-0.5 block text-sm font-black text-red-400">
              {player.woodenSpoonsCount}
            </span>
          </div>

          {/* Partite */}
          <div className="text-center">
            <span className="block text-[10px] font-bold uppercase text-muted-foreground">
              Partite
            </span>
            <span className="mt-0.5 block text-sm font-black text-white">
              {player.totalGamesPlayed}
            </span>
          </div>

          {/* Record Streak */}
          <div className="text-center">
            <span className="block text-[10px] font-bold uppercase text-muted-foreground">
              Rec. GG
            </span>
            <span className="mt-0.5 block text-sm font-black text-orange-400">
              {player.streakRecord}
            </span>
          </div>
        </div>

        {/* Record Personali nei 3 giochi */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="truncate">
            Best: Krilion{' '}
            <strong className="text-white">
              {player.statsByGame.krilion.bestScore}
            </strong>
          </span>
          <span>•</span>
          <span className="truncate">
            Meta{' '}
            <strong className="text-white">
              {player.statsByGame.metazooa.bestScore > 0
                ? `${player.statsByGame.metazooa.bestScore} tent.`
                : '-'}
            </strong>
          </span>
          <span>•</span>
          <span className="truncate">
            Chrono{' '}
            <strong className="text-white">
              {player.statsByGame.chronophoto.bestScore}
            </strong>
          </span>
        </div>
      </div>

      {/* Footer Card con Tasto Visualizza Profilo */}
      <div className="mt-5 pt-2">
        <Link
          href={profileHref}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] py-2 text-xs font-bold text-white transition-all duration-200 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 group-hover:text-cyan-300"
        >
          <span>Vedi Profilo</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
