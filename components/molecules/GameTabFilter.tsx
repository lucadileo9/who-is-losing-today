'use client';

import { games, type LeaderboardTab } from '@/lib/game-data';

interface GameTabFilterProps {
  selectedTab: LeaderboardTab;
  onSelectTab: (tab: LeaderboardTab) => void;
  showTotale?: boolean;
}

export function GameTabFilter({
  selectedTab,
  onSelectTab,
  showTotale = true,
}: GameTabFilterProps) {
  const tabs: LeaderboardTab[] = showTotale ? ['Totale', ...games] : games;

  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl border bg-muted p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelectTab(tab)}
          className={`shrink-0 cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
            selectedTab === tab
              ? 'shadow-xs bg-background text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
