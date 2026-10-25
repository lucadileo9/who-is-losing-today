'use client';

import React from 'react';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/molecules/Footer';
import { MobileBottomNav } from '@/components/molecules/MobileBottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden text-foreground">
      {/* Sfondo fisso cyberpunk con griglia e particelle neon */}
      <div
        className="pointer-events-none fixed inset-0 z-[-2] bg-[#060814] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background.jpg')" }}
      />
      {/* Overlay gradiente per garantire massima leggibilità del testo e delle glass card */}
      <div className="pointer-events-none fixed inset-0 z-[-1] bg-[#060814]/60" />

      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
