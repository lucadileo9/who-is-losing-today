'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateNavigatorProps {
  currentDate: string; // "YYYY-MM-DD"
  className?: string;
}

export function DateNavigator({ currentDate, className }: DateNavigatorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = currentDate === todayStr;

  const navigateToDate = (targetDateStr: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('date', targetDateStr);
    router.push(`/dashboard?${params.toString()}`);
  };

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    navigateToDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    navigateToDate(d.toISOString().split('T')[0]);
  };

  // Formattazione data in italiano estesa: "Dom 25 Ott 2026"
  const formattedDate = (() => {
    try {
      const [year, month, day] = currentDate.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('it-IT', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d);
    } catch {
      return currentDate;
    }
  })();

  return (
    <div className={cn('flex justify-center', className)}>
      <div className="glass-card flex items-center gap-1.5 sm:gap-2 rounded-2xl p-1.5 sm:p-2 shadow-sm">
        {/* Freccia Indietro */}
        <button
          type="button"
          onClick={handlePrevDay}
          title="Giorno precedente"
          className="flex size-8 sm:size-9 cursor-pointer items-center justify-center rounded-xl bg-white/5 text-muted-foreground transition-all hover:bg-white/10 hover:text-white active:scale-95"
        >
          <ChevronLeft className="size-4 sm:size-5" />
        </button>

        {/* Display Data Corrente */}
        <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.04] px-3 sm:px-3.5 py-1.5">
          <CalendarIcon className="size-3.5 sm:size-4 text-cyan-400" />
          <span className="text-xs sm:text-sm font-bold capitalize text-white">
            {formattedDate}
          </span>
          {isToday && (
            <span className="rounded-md border border-cyan-500/30 bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-black uppercase text-cyan-300">
              Oggi
            </span>
          )}
        </div>

        {/* Freccia Avanti */}
        <button
          type="button"
          onClick={handleNextDay}
          title="Giorno successivo"
          className="flex size-8 sm:size-9 cursor-pointer items-center justify-center rounded-xl bg-white/5 text-muted-foreground transition-all hover:bg-white/10 hover:text-white active:scale-95"
        >
          <ChevronRight className="size-4 sm:size-5" />
        </button>
      </div>
    </div>
  );
}
