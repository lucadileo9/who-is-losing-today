import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { ArrowLeft, User as UserIcon } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getUserProfile } from '@/lib/data/user';
import { AppShell } from '@/components/molecules/AppShell';
import { SectionHeading } from '@/components/atoms/SectionHeading';
import { GamerCard } from '@/components/molecules/GamerCard';
import { GameStatsOverview } from '@/components/molecules/GameStatsOverview';
import { PersonalChartSection } from '@/components/organisms/PersonalChartSection';

export const dynamic = 'force-dynamic';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await getUserProfile(id);

  if (!profile) {
    return {
      title: 'Giocatore non trovato - Who is Losing Today',
    };
  }

  return {
    title: `Profilo di ${profile.user.name} - Who is Losing Today`,
    description: `Statistiche, streak e andamento storico di ${profile.user.name}.`,
  };
}

export default async function PlayerProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const profile = await getUserProfile(id);

  if (!profile) {
    notFound();
  }

  const isSelf = session?.user?.id === profile.user.id;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8 px-3 py-6 sm:px-6 md:py-10">
        <div className="flex items-center justify-between">
          <Link
            href="/players"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-cyan-400"
          >
            <ArrowLeft className="size-3.5" />
            <span>Tutti i giocatori</span>
          </Link>
        </div>

        <SectionHeading
          title={isSelf ? 'Il mio Profilo' : `Profilo di ${profile.user.name}`}
          icon={UserIcon}
          iconColor="text-cyan-400"
          size="lg"
        />

        {/* Gamer Card con Statistiche Rapide */}
        <GamerCard profile={profile} isSelf={isSelf} />

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
