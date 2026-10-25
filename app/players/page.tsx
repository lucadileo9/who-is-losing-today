import React from 'react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Users } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getAllPlayers } from '@/lib/data/user';
import { AppShell } from '@/components/molecules/AppShell';
import { SectionHeading } from '@/components/atoms/SectionHeading';
import { PlayersList } from '@/components/organisms/PlayersList';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Giocatori - Who is Losing Today',
  description:
    'Esplora la classifica e i profili di tutti i giocatori della community, scopri i loro trofei e i loro andamenti.',
};

export default async function PlayersPage() {
  const session = await getServerSession(authOptions);
  const players = await getAllPlayers();

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-8 px-3 py-6 sm:px-6 md:py-10">
        <SectionHeading
          title="Giocatori"
          icon={Users}
          iconColor="text-cyan-400"
          size="lg"
        />

        <PlayersList players={players} currentUserId={session?.user?.id} />
      </div>
    </AppShell>
  );
}
