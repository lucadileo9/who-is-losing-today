import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AppShell } from '@/components/molecules/AppShell';
import { LandingHero } from '@/components/organisms/LandingHero';
import { LandingGamesSection } from '@/components/organisms/LandingGamesSection';
import { LandingHowItWorks } from '@/components/organisms/LandingHowItWorks';
import { LandingFeaturesSection } from '@/components/organisms/LandingFeaturesSection';
import { LandingCtaSection } from '@/components/organisms/LandingCtaSection';

export const metadata = {
  title: 'Who Is Losing Today? — La Sfida Quotidiana tra Amici',
  description:
    'La piattaforma ufficiale per il monitoraggio quotidiano dei punteggi di Krilion, Metazooa e Chronophoto tra amici.',
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = Boolean(session?.user);
  const userName = session?.user?.name;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section Principale */}
        <LandingHero isAuthenticated={isAuthenticated} userName={userName} />

        {/* Presentazione dei 3 Giochi e Normalizzazione Punteggi */}
        <LandingGamesSection />

        {/* Come Funziona la Sfida in 3 Semplici Step */}
        <LandingHowItWorks />

        {/* Cosa c'è Dentro l'App: Perdenti, Hall of Fame, Classifiche, Andamento, Bacheca, Giocatori */}
        <LandingFeaturesSection />

        {/* Call to Action Finale */}
        <LandingCtaSection isAuthenticated={isAuthenticated} />
      </div>
    </AppShell>
  );
}
