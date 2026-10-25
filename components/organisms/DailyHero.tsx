'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, PlusCircle } from 'lucide-react';
import { DailyResultsDTO } from '@/lib/types/daily';
import { HeroPlayerCard } from '@/components/molecules/HeroPlayerCard';

interface DailyHeroProps {
  daily: DailyResultsDTO;
  currentUserId?: string;
}

export function DailyHero({ daily, currentUserId }: DailyHeroProps) {
  const { totalPlayers, winner, loser } = daily;

  // Se nessun giocatore ha ancora giocato oggi
  if (totalPlayers === 0) {
    return (
      <div className="glass-card relative overflow-hidden rounded-3xl border-white/10 p-6 text-center sm:p-10">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <Flame className="size-7 animate-pulse" />
        </div>
        <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
          Nessuna sfida registrata oggi
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          La lavagna è ancora intonsa. Inserisci i tuoi punteggi per primo e
          scopri chi sarà il perdente del giorno!
        </p>
        <Link
          href="/submit"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all hover:bg-cyan-400 active:scale-95"
        >
          <PlusCircle className="size-4" />
          <span>Inserisci la prima partita</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
      <HeroPlayerCard
        type="loser"
        playerScore={loser}
        totalPlayers={totalPlayers}
        currentUserId={currentUserId}
      />
      <HeroPlayerCard
        type="winner"
        playerScore={winner}
        totalPlayers={totalPlayers}
        currentUserId={currentUserId}
      />
    </div>
  );
}
