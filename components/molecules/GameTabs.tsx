'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { BRAND_COLORS } from '@/lib/theme/colors';

export interface GameTabItem {
  id: string; // 'totale', 'krilion', 'metazooa', 'chronophoto'...
  label: string;
  color?: string;
}

interface GameTabsProps {
  games: GameTabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function GameTabs({
  games,
  activeTab,
  onTabChange,
  className,
}: GameTabsProps) {
  const getTabColor = (id: string, customColor?: string) => {
    if (customColor) return customColor;
    const lower = id.toLowerCase();
    if (lower === 'totale') return BRAND_COLORS.totale;
    if (lower === 'krilion') return BRAND_COLORS.krilion;
    if (lower === 'metazooa') return BRAND_COLORS.metazooa;
    if (lower === 'chronophoto') return BRAND_COLORS.chronophoto;
    return BRAND_COLORS.totale;
  };

  return (
    <div
      className={cn(
        'no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1',
        className
      )}
    >
      {games.map((g) => {
        const isActive = activeTab.toLowerCase() === g.id.toLowerCase();
        const color = getTabColor(g.id, g.color);

        return (
          <button
            key={g.id}
            type="button"
            onClick={() => onTabChange(g.id)}
            className={cn(
              'flex shrink-0 cursor-pointer select-none items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200',
              isActive
                ? 'border shadow-md'
                : 'border border-transparent text-muted-foreground hover:bg-white/[0.04] hover:text-white'
            )}
            style={
              isActive
                ? {
                    backgroundColor: `${color}20`,
                    borderColor: `${color}60`,
                    color: color,
                    boxShadow: `0 0 15px ${color}30`,
                  }
                : undefined
            }
          >
            <span
              className="size-2 rounded-full"
              style={{
                backgroundColor: color,
                boxShadow: isActive ? `0 0 8px ${color}` : undefined,
              }}
            />
            <span>{g.label}</span>
          </button>
        );
      })}
    </div>
  );
}
