'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Gamepad2,
} from 'lucide-react';
import { NeonButton } from '@/components/atoms/NeonButton';
import { GoogleSignInButton } from '@/components/atoms/GoogleSignInButton';

interface LandingHeroProps {
  isAuthenticated: boolean;
  userName?: string | null;
}

export function LandingHero({ isAuthenticated, userName }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden py-12 md:py-20 lg:py-24">
      {/* Glow d'atmosfera sullo sfondo */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/15 blur-[120px] sm:size-[500px]" />

      <div className="mx-auto max-w-5xl text-center">
        {/* Pill Badge Introduttivo */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Sparkles className="size-3.5" />
          <span>La Sfida Quotidiana Ufficiale Tra Amici</span>
        </div>

        {/* Titolo Principale */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
          Who Is Losing{' '}
          <span className="relative inline-block rounded-xl border border-red-500/40 bg-red-500/15 px-3 py-0.5 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.35)]">
            TODAY?
          </span>
        </h1>

        {/* Payoff ed estratto invitante */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl">
          La sfida quotidiana definitiva per il nostro gruppo. Metti alla prova
          le tue abilità su <strong className="text-white">Krilion</strong>,{' '}
          <strong className="text-white">Metazooa</strong> e{' '}
          <strong className="text-white">Chronophoto</strong>: scala la
          classifica, conquista la gloria ed evita a tutti i costi l&apos;infamia
          del teschio quotidiano.
        </p>

        {/* CTA Dinamica */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <NeonButton
                variant="primary"
                size="lg"
                className="gap-2.5 px-8 text-base shadow-[0_0_25px_rgba(6,182,212,0.5)]"
              >
                <span>Bentornato{userName ? `, ${userName}` : ''}! Vai alla Dashboard</span>
                <ArrowRight className="size-5" />
              </NeonButton>
            </Link>
          ) : (
            <GoogleSignInButton size="lg" />
          )}

          <a
            href="#come-funziona"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-gray-300 transition-all hover:bg-white/10 hover:text-white"
          >
            <Gamepad2 className="size-4" />
            <span>Scopri le Regole</span>
          </a>
        </div>
      </div>
    </section>
  );
}
