'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, PlusCircle } from 'lucide-react';
import { PlayerAvatar } from '@/components/atoms/PlayerAvatar';
import { DailyResultsDTO } from '@/lib/types/daily';

interface DailyHeroProps {
  daily: DailyResultsDTO;
  currentUserId?: string;
}

export function DailyHero({ daily, currentUserId }: DailyHeroProps) {
  const { totalPlayers, winner, loser } = daily;

  // Frasi sfottò simpatiche per il perdente del giorno
  const getTauntMessage = (loserName: string, isMe: boolean) => {
    if (isMe) {
      return 'Oggi tocca a te pulire per terra. Il cucchiaio di legno è tuo!';
    }
    const taunts = [
      `Che disastro, ${loserName}! Oggi la vergogna è tutta tua.`,
      `Oggi tocca a ${loserName} pagare pegno. Prestazione da dimenticare!`,
      `Ha fatto pietà! Il cucchiaio di legno è ufficialmente assegnato.`,
      `Non si sa come, ma ${loserName} è riuscito a fare peggio di tutti.`,
    ];
    // Scegli in modo deterministico basato sulla lunghezza del nome o primo carattere
    const index = (loserName.charCodeAt(0) || 0) % taunts.length;
    return taunts[index];
  };

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

  const isWinnerMe = currentUserId && winner?.user.id === currentUserId;
  const isLoserMe = currentUserId && loser?.user.id === currentUserId;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
      {/* CARD DEL PERDENTE (SX) */}
      <div className="glass-card relative overflow-hidden rounded-3xl border-red-500/30 bg-gradient-to-br from-red-500/15 via-transparent to-transparent p-5 shadow-[0_0_25px_rgba(239,68,68,0.2)] sm:p-6">
        {/* Label Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg border border-red-500/40 bg-red-500/20 text-sm text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
              🥄
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-red-400">
              Il Perdente di Oggi
            </span>
          </div>
          {totalPlayers >= 2 && loser && (
            <span className="rounded-full border border-red-500/30 bg-red-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-red-300">
              Cucchiaio di Legno
            </span>
          )}
        </div>

        {/* Content del Perdente */}
        {totalPlayers < 2 || !loser ? (
          <div className="my-6 py-4 text-center">
            <span className="mb-2 block text-3xl">🤝</span>
            <h3 className="text-base font-bold text-white">Nessun perdente</h3>
            <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
              Ha giocato solo 1 persona. Serve almeno un avversario per poter
              assegnare il cucchiaio di legno!
            </p>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-4 sm:gap-5">
            <PlayerAvatar
              name={loser.user.name}
              image={loser.user.image}
              color={loser.user.color}
              size="lg"
              isLoser={true}
              className="shrink-0"
            />

            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-lg font-black text-white sm:text-xl">
                  {loser.user.name}
                </h3>
                {isLoserMe && (
                  <span className="rounded border border-red-500/40 bg-red-500/30 px-1.5 py-0.5 text-[10px] font-black uppercase text-red-300">
                    Sei Tu!
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-black tracking-tight text-red-400 sm:text-3xl">
                  {loser.normalizedScore}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  pt complessivi
                </span>
              </div>

              <p className="mt-2 line-clamp-2 text-xs italic text-red-300/80">
                &ldquo;{getTauntMessage(loser.user.name, Boolean(isLoserMe))}
                &rdquo;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CARD DEL VINCENTE (DX) */}
      <div className="glass-card relative overflow-hidden rounded-3xl border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-transparent to-transparent p-5 shadow-[0_0_25px_rgba(245,158,11,0.2)] sm:p-6">
        {/* Label Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/20 text-sm text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              🥇
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              Il Re della Giornata
            </span>
          </div>
          {winner && (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-300">
              1° Posto
            </span>
          )}
        </div>

        {/* Content del Vincente */}
        {winner ? (
          <div className="mt-4 flex items-center gap-4 sm:gap-5">
            <PlayerAvatar
              name={winner.user.name}
              image={winner.user.image}
              color={winner.user.color}
              size="lg"
              isWinner={true}
              className="shrink-0"
            />

            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-lg font-black text-white sm:text-xl">
                  {winner.user.name}
                </h3>
                {isWinnerMe && (
                  <span className="rounded border border-amber-500/40 bg-amber-500/30 px-1.5 py-0.5 text-[10px] font-black uppercase text-amber-300">
                    Sei Tu!
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-black tracking-tight text-amber-400 sm:text-3xl">
                  {winner.normalizedScore}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  pt complessivi
                </span>
              </div>

              <p className="mt-2 text-xs font-medium text-amber-300/80">
                Gloria eterna! Ha dominato la classifica odierna su{' '}
                {totalPlayers} {totalPlayers === 1 ? 'giocatore' : 'giocatori'}.
              </p>
            </div>
          </div>
        ) : (
          <div className="my-6 py-4 text-center">
            <span className="mb-2 block text-3xl">⏳</span>
            <h3 className="text-base font-bold text-white">Nessun vincitore</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              In attesa dei primi risultati per incoronare il leader.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
