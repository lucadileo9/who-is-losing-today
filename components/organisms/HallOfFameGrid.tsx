'use client';

import React from 'react';
import { Crown } from 'lucide-react';
import { HallOfFameCard } from '@/components/molecules/HallOfFameCard';
import { HallOfFameDTO } from '@/lib/types/period';

interface HallOfFameGridProps {
  hallOfFame: HallOfFameDTO;
  className?: string;
}

export function HallOfFameGrid({ hallOfFame, className }: HallOfFameGridProps) {
  // Raccogli i record da byGame o dai campi di retrocompatibilità
  const records = [
    {
      id: 'Totale',
      name: 'Totale di Sempre',
      data: hallOfFame.totale,
    },
    {
      id: 'Krilion',
      name: 'Krilion',
      data: hallOfFame.byGame?.Krilion || hallOfFame.krilion || null,
    },
    {
      id: 'Metazooa',
      name: 'Metazooa',
      data: hallOfFame.byGame?.Metazooa || hallOfFame.metazooa || null,
    },
    {
      id: 'Chronophoto',
      name: 'Chronophoto',
      data: hallOfFame.byGame?.Chronophoto || hallOfFame.chronophoto || null,
    },
  ];

  return (
    <div className={className}>
      <div className="mb-4 flex items-center gap-2">
        <Crown className="size-5 text-amber-400" />
        <h2 className="text-lg font-black tracking-tight text-white md:text-xl">
          Hall of Fame — Record di Sempre
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {records.map((r) => (
          <HallOfFameCard
            key={r.id}
            gameId={r.id}
            gameName={r.name}
            record={r.data}
          />
        ))}
      </div>
    </div>
  );
}
