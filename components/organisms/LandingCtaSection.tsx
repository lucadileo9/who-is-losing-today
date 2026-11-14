'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { NeonCard } from '@/components/atoms/NeonCard';
import { NeonButton } from '@/components/atoms/NeonButton';
import { GoogleSignInButton } from '@/components/atoms/GoogleSignInButton';
import { BRAND_COLORS } from '@/lib/theme/colors';

interface LandingCtaSectionProps {
  isAuthenticated: boolean;
}

export function LandingCtaSection({ isAuthenticated }: LandingCtaSectionProps) {
  return (
    <section className="py-12 sm:py-20">
      <NeonCard
        variant="default"
        glowColor={BRAND_COLORS.cyan}
        className="relative overflow-hidden border-cyan-500/30 bg-gradient-to-br from-[#121526] via-[#101323] to-[#0a0c18] p-8 text-center sm:p-12 md:p-16"
      >
        {/* Glow circolare d'atmosfera */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-[100px]" />

        <div className="mx-auto max-w-2xl space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <ShieldCheck className="size-6" />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
            Pronto a scendere in campo oggi?
          </h2>

          <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
            L&apos;applicazione è riservata alla cerchia di amici autorizzati in
            Whitelist. Entra con il tuo account per scoprire chi sta perdendo
            oggi e non rimanere indietro nella classifica di periodo!
          </p>

          <div className="pt-4">
            {isAuthenticated ? (
              <Link href="/dashboard" className="inline-block">
                <NeonButton
                  variant="primary"
                  size="lg"
                  className="gap-2.5 px-8 text-base shadow-[0_0_25px_rgba(6,182,212,0.5)]"
                >
                  <span>Apri la Dashboard</span>
                  <ArrowRight className="size-5" />
                </NeonButton>
              </Link>
            ) : (
              <GoogleSignInButton size="lg" />
            )}
          </div>
        </div>
      </NeonCard>
    </section>
  );
}
