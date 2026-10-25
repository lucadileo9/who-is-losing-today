'use client';

import React from 'react';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/molecules/Footer';
import { MobileBottomNav } from '@/components/molecules/MobileBottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
