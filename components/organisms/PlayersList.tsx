'use client';

import React, { useMemo, useState } from 'react';
import { UserProfileDTO } from '@/lib/types/user';
import { CommunityStatsOverview } from '@/components/molecules/CommunityStatsOverview';
import {
  PlayersFilterBar,
  type PlayerSortOption,
} from '@/components/molecules/PlayersFilterBar';
import { PlayerCard } from '@/components/molecules/PlayerCard';

interface PlayersListProps {
  players: UserProfileDTO[];
  currentUserId?: string;
}

export function PlayersList({ players, currentUserId }: PlayersListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<PlayerSortOption>('wins');

  // Calcolo KPI riassuntivi della community
  const communityStats = useMemo(() => {
    const totalPlayers = players.length;
    const totalGames = players.reduce((acc, p) => acc + p.totalGamesPlayed, 0);

    const topWinner = [...players].sort(
      (a, b) => b.dailyWinsCount - a.dailyWinsCount
    )[0];

    const topStreak = [...players].sort((a, b) => b.streak - a.streak)[0];

    return {
      totalPlayers,
      totalGames,
      topWinner: topWinner && topWinner.dailyWinsCount > 0 ? topWinner : null,
      topStreak: topStreak && topStreak.streak > 0 ? topStreak : null,
    };
  }, [players]);

  // Filtra e ordina i giocatori
  const filteredAndSortedPlayers = useMemo(() => {
    return players
      .filter((p) =>
        p.user.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'wins') {
          if (b.dailyWinsCount !== a.dailyWinsCount) {
            return b.dailyWinsCount - a.dailyWinsCount;
          }
          return b.streak - a.streak;
        }
        if (sortBy === 'streak') {
          if (b.streak !== a.streak) {
            return b.streak - a.streak;
          }
          return b.dailyWinsCount - a.dailyWinsCount;
        }
        if (sortBy === 'games') {
          return b.totalGamesPlayed - a.totalGamesPlayed;
        }
        if (sortBy === 'spoons') {
          return b.woodenSpoonsCount - a.woodenSpoonsCount;
        }
        if (sortBy === 'name') {
          return a.user.name.localeCompare(b.user.name, 'it');
        }
        return 0;
      });
  }, [players, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* KPI Overview della Community (Molecule) */}
      <CommunityStatsOverview
        totalPlayers={communityStats.totalPlayers}
        totalGames={communityStats.totalGames}
        topWinner={communityStats.topWinner}
        topStreak={communityStats.topStreak}
      />

      {/* Barra Ricerca & Filtri Ordinamento (Molecule) */}
      <PlayersFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Grid delle Card dei Giocatori (Molecule) */}
      {filteredAndSortedPlayers.length === 0 ? (
        <div className="glass-card rounded-2xl border-white/5 p-12 text-center">
          <p className="text-sm text-muted-foreground">
            Nessun giocatore corrisponde a &quot;{searchQuery}&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {filteredAndSortedPlayers.map((player) => (
            <PlayerCard
              key={player.user.id}
              player={player}
              isSelf={currentUserId === player.user.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
