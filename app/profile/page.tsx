import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { User } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getUserProfile } from '@/lib/data/user';
import { AppShell } from '@/components/molecules/AppShell';
import { SectionHeading } from '@/components/atoms/SectionHeading';
import { GamerCard } from '@/components/molecules/GamerCard';
import { GameStatsOverview } from '@/components/molecules/GameStatsOverview';
import { PersonalChartSection } from '@/components/organisms/PersonalChartSection';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Profilo Giocatore - Who is Losing Today',
  description:
    'Visualizza le tue statistiche di gioco, streak, record e andamento personale.',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/profile');
  }

  // Recupera il profilo completo dal Data Access Layer
  const profile = await getUserProfile(session.user.id);

  if (!profile) {
    redirect('/dashboard');
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8 px-3 py-6 sm:px-6 md:py-10">
        <SectionHeading
          title="Profilo Giocatore"
          icon={User}
          iconColor="text-cyan-400"
          size="lg"
        />

        {/* Gamer Card con Statistiche Rapide e Cambio Colore Avatar */}
        <GamerCard profile={profile} isSelf={true} />

        {/* Panoramica Statistiche per Singolo Gioco */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Statistiche per Gioco
          </h3>
          <GameStatsOverview statsByGame={profile.statsByGame} />
        </div>

        {/* Grafico dell'Andamento Personale nel Tempo */}
        <PersonalChartSection trendData={profile.personalTrend} />
      </div>
    </AppShell>
  );
}
