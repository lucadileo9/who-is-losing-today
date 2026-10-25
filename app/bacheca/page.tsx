import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { MessageSquare } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getActiveNotes } from '@/lib/data/notes';
import { AppShell } from '@/components/molecules/AppShell';
import { SectionHeading } from '@/components/atoms/SectionHeading';
import { BachecaBoard } from '@/components/organisms/BachecaBoard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bacheca e Sfottò - Who is Losing Today',
  description:
    'Lascia un commento sulla giornata, commenta le partite o prendi in giro il perdente del giorno.',
};

export default async function BachecaPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/bacheca');
  }

  const currentUserId = session.user.id;
  const isAdmin = session.user.role === 'ADMIN';

  // Caricamento Server-Side delle note tramite Data Access Layer
  const notes = await getActiveNotes(currentUserId);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6 px-3 py-6 sm:px-6 md:py-10">
        <SectionHeading
          title="Bacheca e Sfottò"
          subtitle="La lavagna virtuale del gruppo. Commenta i risultati odierni, festeggia il re della giornata o prendi in giro il perdente!"
          icon={MessageSquare}
          iconColor="text-cyan-400"
          size="lg"
        />

        <BachecaBoard
          notes={notes}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
        />
      </div>
    </AppShell>
  );
}
