'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PlayerSortOption = 'wins' | 'streak' | 'games' | 'spoons' | 'name';

export interface PlayersFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: PlayerSortOption;
  onSortChange: (sort: PlayerSortOption) => void;
  className?: string;
}

const SORT_OPTIONS: { key: PlayerSortOption; label: string }[] = [
  { key: 'wins', label: 'Vittorie 🏆' },
  { key: 'streak', label: 'Streak 🔥' },
  { key: 'games', label: 'Partite 🎮' },
  { key: 'spoons', label: 'Cucchiai 🥄' },
  { key: 'name', label: 'Nome A-Z' },
];

export function PlayersFilterBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  className,
}: PlayersFilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      {/* Ricerca testuale */}
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cerca un giocatore..."
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 pl-10 pr-4 text-sm text-white placeholder-muted-foreground/60 transition-all focus:border-cyan-500/50 focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
        />
      </div>

      {/* Selettori Ordinamento */}
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSortChange(opt.key)}
            className={cn(
              'cursor-pointer whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200',
              sortBy === opt.key
                ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'text-muted-foreground hover:bg-white/10 hover:text-white'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
