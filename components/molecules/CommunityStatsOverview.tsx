import React from 'react';
import { Users, Gamepad2, Trophy, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommunityStatCard } from '@/components/atoms/CommunityStatCard';
import { UserProfileDTO } from '@/lib/types/user';

export interface CommunityStatsOverviewProps {
  totalPlayers: number;
  totalGames: number;
  topWinner: UserProfileDTO | null;
  topStreak: UserProfileDTO | null;
  className?: string;
}

export function CommunityStatsOverview({
  totalPlayers,
  totalGames,
  topWinner,
  topStreak,
  className,
}: CommunityStatsOverviewProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4',
        className
      )}
    >
      <CommunityStatCard
        label="Giocatori"
        value={totalPlayers}
        subtext="Membri attivi"
        icon={Users}
        iconColor="text-cyan-400"
      />

      <CommunityStatCard
        label="Partite Totali"
        value={totalGames}
        subtext="Completate nel gruppo"
        icon={Gamepad2}
        iconColor="text-indigo-400"
      />

      <CommunityStatCard
        label="Top Vincitore"
        value={topWinner?.user.name || 'Nessuno'}
        valueColor="text-white text-base sm:text-lg"
        subtext={
          topWinner
            ? `${topWinner.dailyWinsCount} ${
                topWinner.dailyWinsCount === 1 ? 'vittoria' : 'vittorie'
              }`
            : 'Nessun record'
        }
        subtextColor="text-amber-400/80 font-semibold"
        icon={Trophy}
        iconColor="text-amber-400"
      />

      <CommunityStatCard
        label="Top Streak"
        value={topStreak?.user.name || 'Nessuno'}
        valueColor="text-white text-base sm:text-lg"
        subtext={
          topStreak
            ? `${topStreak.streak} ${
                topStreak.streak === 1 ? 'giorno' : 'giorni'
              } di fila`
            : '0 giorni attivi'
        }
        subtextColor="text-orange-400/80 font-semibold"
        icon={Flame}
        iconColor="text-orange-400"
      />
    </div>
  );
}
