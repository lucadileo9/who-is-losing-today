"use client"

import { games, type LeaderboardTab } from "@/lib/game-data"

interface GameTabFilterProps {
  selectedTab: LeaderboardTab
  onSelectTab: (tab: LeaderboardTab) => void
  showTotale?: boolean
}

export function GameTabFilter({ selectedTab, onSelectTab, showTotale = true }: GameTabFilterProps) {
  const tabs: LeaderboardTab[] = showTotale ? ["Totale", ...games] : games

  return (
    <div className="flex gap-1 rounded-xl bg-muted p-1 border overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelectTab(tab)}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all shrink-0 ${
            selectedTab === tab
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
