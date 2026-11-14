'use client';

import React from 'react';
import {
  Skull,
  ListOrdered,
  TrendingUp,
  Award,
  Users,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { SectionHeading } from '@/components/atoms/SectionHeading';
import { LandingFeatureCard } from '@/components/molecules/LandingFeatureCard';
import { BRAND_COLORS } from '@/lib/theme/colors';

export function LandingFeaturesSection() {
  const features = [
    {
      icon: Skull,
      iconColor: BRAND_COLORS.loser,
      title: 'Il Perdente & il Vincente del Giorno',
      description:
        "In cima alla dashboard compaiono le due Hero Card: chi ha totalizzato il miglior punteggio indossa la corona della gloria, mentre chi ha fatto la peggior prestazione riceve l'ambito teschio del Perdente del Giorno.",
    },
    {
      icon: ListOrdered,
      iconColor: BRAND_COLORS.cyan,
      title: 'Classifica di Giornata & Filtri per Gioco',
      description:
        'Consulta la graduatoria complessiva di oggi o filtra i risultati per singolo gioco (Krilion, Metazooa, Chronophoto) con punteggi originali e punteggi normalizzati.',
    },
    {
      icon: TrendingUp,
      iconColor: BRAND_COLORS.totale,
      title: 'Andamento Temporale & Statistiche di Periodo',
      description:
        "Grafici multi-linea interattivi su base 7 giorni, mese corrente o anno intero per seguire l'evoluzione delle prestazioni e i momenti di forma nel tempo.",
    },
    {
      icon: Award,
      iconColor: BRAND_COLORS.winner,
      title: 'Hall of Fame & Medagliere Trofei',
      description:
        'Il pantheon dei primati storici: il punteggio record di sempre, la disfatta più clamorosa, le strisce di vittorie consecutive e il conteggio delle medaglie.',
    },
    {
      icon: Users,
      iconColor: BRAND_COLORS.metazooa,
      title: 'Lista Giocatori & Profili Personalizzati',
      description:
        'Tutti gli amici del gruppo in un unico elenco: statistiche individuali, colore distintivo, percentuale di vittorie e storico dettagliato di ogni sfida.',
    },
    {
      icon: MessageSquare,
      iconColor: BRAND_COLORS.pink,
      title: 'Bacheca Messaggi & Sfottò Quotidiani',
      description:
        'La piazza virtuale per commentare le partite della giornata, festeggiare una vittoria fortunata o prendere bonariamente in giro il perdente di turno.',
    },
  ];

  return (
    <section id="funzionalita" className="py-12 sm:py-16">
      <SectionHeading
        title="Cosa c'è dentro l'App"
        subtitle="Un'esperienza ricca, pensata per trasformare semplici puzzle game giornalieri in un campionato continuo."
        icon={Sparkles}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <LandingFeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}
