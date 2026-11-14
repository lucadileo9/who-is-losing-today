'use client';

import React from 'react';
import { Gamepad2, ClipboardCheck, Trophy, HelpCircle } from 'lucide-react';
import { SectionHeading } from '@/components/atoms/SectionHeading';
import { LandingStepCard } from '@/components/molecules/LandingStepCard';
import { BRAND_COLORS } from '@/lib/theme/colors';

export function LandingHowItWorks() {
  const steps = [
    {
      stepNumber: '1',
      title: 'Gioca la tua Partita Quotidiana',
      description:
        'Accedi ai siti web ufficiali di Krilion, Metazooa e Chronophoto ed esegui la sfida del giorno dal tuo smartphone o computer.',
      icon: Gamepad2,
      color: BRAND_COLORS.krilion,
    },
    {
      stepNumber: '2',
      title: 'Incolla il Risultato Negli Appunti',
      description:
        'Copia il messaggio di vittoria o condividi il risultato. Nella pagina "Gioca", il sistema legge il testo e compila automaticamente il punteggio.',
      icon: ClipboardCheck,
      color: BRAND_COLORS.metazooa,
    },
    {
      stepNumber: '3',
      title: 'Scopri il Verdetto del Giorno',
      description:
        'La classifica si aggiorna in tempo reale: scopri chi trionfa e chi si aggiudica l’iconico teschio del Perdente del Giorno con commenti in bacheca!',
      icon: Trophy,
      color: BRAND_COLORS.loser,
    },
  ];

  return (
    <section id="come-funziona" className="py-12 sm:py-16">
      <SectionHeading
        title="Come Funziona la Sfida"
        subtitle="Un flusso di gioco fluido, immediato e pensato per la condivisione tra amici."
        icon={HelpCircle}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <LandingStepCard key={s.stepNumber} {...s} />
        ))}
      </div>
    </section>
  );
}
