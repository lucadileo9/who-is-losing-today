'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { NeonCard } from '@/components/atoms/NeonCard';
import { GameBadge } from '@/components/atoms/GameBadge';
import { Game } from '@/lib/game-data';

interface LandingGameCardProps {
  gameId: Game;
  name: string;
  url: string;
  category: string;
  rules: string;
  color: string;
}

export function LandingGameCard({
  gameId,
  name,
  url,
  category,
  rules,
  color,
}: LandingGameCardProps) {
  return (
    <NeonCard
      variant="default"
      glowColor={color}
      className="flex flex-col justify-between space-y-6 cursor-default transition-all duration-300 hover:border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
    >
      <div className="space-y-4">
        {/* Intestazione Card: Badge e Categoria a singola parola */}
        <div className="flex items-center justify-between">
          <GameBadge gameId={gameId} size="md" />
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-gray-300">
            {category}
          </span>
        </div>

        {/* Titolo e Descrizione */}
        <div>
          <h3 className="text-xl font-extrabold text-white">{name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">{rules}</p>
        </div>
      </div>

      {/* Link al Sito Ufficiale del Gioco */}
      <div className="pt-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition-all hover:border-white/30 hover:bg-white/10 active:scale-95"
        >
          <span>Gioca su {name}</span>
          <ExternalLink className="size-3.5 text-gray-400" />
        </a>
      </div>
    </NeonCard>
  );
}
