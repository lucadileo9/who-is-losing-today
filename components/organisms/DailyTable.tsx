'use client';

import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { GameTabs, GameTabItem } from '@/components/molecules/GameTabs';
import { StandingsRow } from '@/components/molecules/StandingsRow';
import { DailyResultsDTO, DailyPlayerScore } from '@/lib/types/daily';

interface DailyTableProps {
  daily: DailyResultsDTO;
  currentUserId?: string;
  className?: string;
}

export function DailyTable({
  daily,
  currentUserId,
  className,
}: DailyTableProps) {
  const [activeGame, setActiveGame] = useState<string>('totale');

  // Prepara l'elenco dei tab dinamicamente
  const tabs: GameTabItem[] = [{ id: 'totale', label: 'Totale' }];

  // Aggiungi giochi dinamici presenti in byGame
  if (daily.rankings.byGame) {
    Object.keys(daily.rankings.byGame).forEach((gameId) => {
      tabs.push({ id: gameId.toLowerCase(), label: gameId });
    });
  } else {
    // Fallback retrocompatibile
    if (daily.rankings.krilion) tabs.push({ id: 'krilion', label: 'Krilion' });
    if (daily.rankings.metazooa)
      tabs.push({ id: 'metazooa', label: 'Metazooa' });
    if (daily.rankings.chronophoto)
      tabs.push({ id: 'chronophoto', label: 'Chronophoto' });
  }

  // Seleziona la lista di giocatori per il tab attivo
  const getActiveScores = (): DailyPlayerScore[] => {
    const key = activeGame.toLowerCase();
    if (key === 'totale') {
      return daily.rankings.totale || [];
    }

    if (daily.rankings.byGame) {
      // Cerca case-insensitive
      const matchKey = Object.keys(daily.rankings.byGame).find(
        (k) => k.toLowerCase() === key
      );
      if (matchKey && daily.rankings.byGame[matchKey]) {
        return daily.rankings.byGame[matchKey];
      }
    }

    // Fallback retrocompatibilità
    if (key === 'krilion') return daily.rankings.krilion || [];
    if (key === 'metazooa') return daily.rankings.metazooa || [];
    if (key === 'chronophoto') return daily.rankings.chronophoto || [];

    return [];
  };

  const scores = getActiveScores();
  const isTotale = activeGame.toLowerCase() === 'totale';

  // Helper unità per singoli giochi
  const getScoreUnit = (gameKey: string) => {
    const k = gameKey.toLowerCase();
    if (k === 'metazooa') return 'tentativi';
    if (k === 'chronophoto' || k === 'krilion') return 'pt';
    return '';
  };

  return (
    <div className={className}>
      {/* Header Sezione: Titolo + Game Tabs */}
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Trophy className="size-5 text-cyan-400" />
          <h2 className="text-lg font-black tracking-tight text-white md:text-xl">
            Classifica della Giornata
          </h2>
        </div>

        <GameTabs
          games={tabs}
          activeTab={activeGame}
          onTabChange={setActiveGame}
        />
      </div>

      {/* Lista Giocatori */}
      {scores.length === 0 ? (
        <div className="glass-card rounded-2xl border-white/5 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nessun punteggio registrato per questo gioco nella data selezionata.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {scores.map((item, index) => {
            const isWinner = item.rank === 1;
            const isLoser =
              isTotale &&
              daily.totalPlayers >= 2 &&
              daily.loser?.user.id === item.user.id;
            const isMe = currentUserId === item.user.id;

            return (
              <StandingsRow
                key={item.user.id}
                rank={item.rank || index + 1}
                user={item.user}
                normalizedScore={item.normalizedScore}
                rawScore={!isTotale ? item.rawScore : undefined}
                scoreUnit={getScoreUnit(activeGame)}
                isWinner={isWinner}
                isLoser={isLoser}
                isCurrentUser={isMe}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
