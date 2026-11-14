import React from 'react';
import { Metadata } from 'next';
import { PlusCircle } from 'lucide-react';
import { requireAuthPage } from '@/lib/auth-guard';
import { AppShell } from '@/components/molecules/AppShell';
import { SectionHeading } from '@/components/atoms/SectionHeading';
import { ScoreSubmitForm } from '@/components/organisms/ScoreSubmitForm';

export const metadata: Metadata = {
  title: 'Inserisci Partita - Who is Losing Today',
  description:
    'Registra i tuoi punteggi per Krilion, Metazooa e Chronophoto e sfida i tuoi amici.',
};

interface SubmitPageProps {
  searchParams: Promise<{ date?: string; game?: string }>;
}

export default async function SubmitPage({ searchParams }: SubmitPageProps) {
  await requireAuthPage();

  const resolvedParams = await searchParams;
  const initialDate = resolvedParams.date;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6 px-3 py-6 sm:px-6 md:py-10">
        <SectionHeading
          title="Inserisci Partita"
          icon={PlusCircle}
          iconColor="text-cyan-400"
          size="lg"
        />

        <div className="glass-card rounded-3xl border border-white/10 p-5 sm:p-8">
          <ScoreSubmitForm defaultDate={initialDate} />
        </div>
      </div>
    </AppShell>
  );
}
