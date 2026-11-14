'use client';

import React from 'react';
import { Calculator, Sparkles } from 'lucide-react';
import { SectionHeading } from '@/components/atoms/SectionHeading';
import { NeonCard } from '@/components/atoms/NeonCard';
import { LandingGameCard } from '@/components/molecules/LandingGameCard';
import { GAME_CONFIG } from '@/lib/game-data';

export function LandingGamesSection() {
  const gamesList = Object.values(GAME_CONFIG);

  return (
    <section id="giochi" className="py-12 sm:py-16">
      <SectionHeading
        title="I Tre Giochi Quotidiani"
        subtitle="Regole differenti, un'unica formula matematica centralizzata per rendere ogni sfida equa e comparabile."
        icon={Calculator}
      />

      {/* Griglia delle 3 Card dei Giochi */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {gamesList.map((g) => (
          <LandingGameCard
            key={g.id}
            gameId={g.id}
            name={g.name}
            url={g.url}
            category={g.category}
            rules={g.rules}
            color={g.color}
          />
        ))}
      </div>

      {/* Box esplicativo del Punteggio Totale e del Divisore Dinamico */}
      <NeonCard
        variant="default"
        className="mt-8 border-cyan-500/30"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
              <Sparkles className="size-4" />
              <span>Normalizzazione Matematica e Divisore Dinamico</span>
            </div>
            <p className="text-xs leading-relaxed text-gray-300 sm:text-sm">
              I giochi hanno sistemi di punteggio diversi: tentativi, punti
              storici o tempo. La nostra applicazione converte ogni risultato in
              un punteggio normalizzato tra <strong className="text-white">0 e 1.000 punti</strong>.
              Il punteggio complessivo giornaliero è la media calcolata
              esclusivamente sui giochi effettivamente disputati!
            </p>
          </div>

          <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 p-3 text-center sm:px-6">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Scala Universale
            </div>
            <div className="mt-0.5 text-2xl font-black text-white">0 - 1.000</div>
            <div className="text-[11px] text-cyan-400">punti per gioco</div>
          </div>
        </div>
      </NeonCard>
    </section>
  );
}
