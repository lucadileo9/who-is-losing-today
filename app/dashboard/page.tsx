import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDailyResults } from '@/lib/data/daily';
import { getPeriodResults } from '@/lib/data/period';
import { getHallOfFame } from '@/lib/data/hall-of-fame';
import { PeriodPreset } from '@/lib/types/period';
import { AppShell } from '@/components/molecules/AppShell';
import { DateNavigator } from '@/components/molecules/DateNavigator';
import { DailyHero } from '@/components/organisms/DailyHero';
import { DailyTable } from '@/components/organisms/DailyTable';
import { PeriodSection } from '@/components/organisms/PeriodSection';
import { HallOfFameGrid } from '@/components/organisms/HallOfFameGrid';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ date?: string; period?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const todayStr = new Date().toISOString().split('T')[0];
  const selectedDate = resolvedParams.date || todayStr;
  const selectedPeriod = (resolvedParams.period as PeriodPreset) || 'month';

  // Caricamento parallelo sul server tramite Data Access Layer (DTO puri)
  const [daily, periodData, hallOfFame, session] = await Promise.all([
    getDailyResults(selectedDate),
    getPeriodResults(selectedPeriod),
    getHallOfFame(),
    getServerSession(authOptions),
  ]);

  const currentUserId = session?.user?.id;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8 px-3 py-5 sm:px-6 md:py-8 lg:px-8">
        {/* Barra di Navigazione della Data */}
        <DateNavigator currentDate={selectedDate} />

        {/* Above the Fold: Hero Cards con Perdente (SX) e Vincente (DX) */}
        <DailyHero daily={daily} currentUserId={currentUserId} />

        {/* Tabella interattiva della classifica giornaliera con filtri per gioco */}
        <DailyTable daily={daily} currentUserId={currentUserId} />

        {/* Sezione Andamenti e Classifica di Periodo con Grafico Recharts */}
        <PeriodSection
          period={periodData}
          currentPeriod={selectedPeriod}
          currentUserId={currentUserId}
        />

        {/* Hall of Fame: Record storici di sempre */}
        <HallOfFameGrid hallOfFame={hallOfFame} />
      </div>
    </AppShell>
  );
}
