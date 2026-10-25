'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { BarChart3, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/atoms';
import { StandingsRow } from '@/components/molecules/StandingsRow';
import {
  PeriodResultsDTO,
  PeriodPreset,
  PERIOD_PRESETS,
} from '@/lib/types/period';

interface PeriodSectionProps {
  period: PeriodResultsDTO;
  currentPeriod: PeriodPreset;
  currentUserId?: string;
  className?: string;
}

const PRESET_LABELS: Record<PeriodPreset, string> = {
  week: 'Questa Settimana',
  month: 'Questo Mese',
  last_month: 'Mese Scorso',
  all: 'Di Sempre',
};

export function PeriodSection({
  period,
  currentPeriod,
  currentUserId,
  className,
}: PeriodSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePeriodChange = (preset: PeriodPreset) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('period', preset);
    router.push(`/dashboard?${params.toString()}`, { scroll: false });
  };

  const leaderboard = period.totale?.leaderboard || [];
  const trendData = period.totale?.trendData || [];
  const players = period.players || [];

  return (
    <div className={className}>
      {/* Header Sezione: Titolo + Filtri Periodo */}
      <SectionHeading
        title="Andamento storico"
        icon={BarChart3}
        iconColor="text-cyan-400"
        action={
          <div className="glass-card no-scrollbar flex items-center gap-1 overflow-x-auto rounded-xl border-white/5 p-1">
            {PERIOD_PRESETS.map((p) => {
              const isActive = currentPeriod === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePeriodChange(p)}
                  className={cn(
                    'cursor-pointer select-none whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200',
                    isActive
                      ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                  )}
                >
                  {PRESET_LABELS[p]}
                </button>
              );
            })}
          </div>
        }
        className="mb-4"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Colonna SX: Tabella Classifica Periodo (5 colonne su 12) */}
        <div className="flex flex-col gap-2 lg:col-span-5">
          <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Media Punti Normalizzata
          </h3>

          {leaderboard.length === 0 ? (
            <div className="glass-card rounded-2xl border-white/5 p-6 text-center">
              <p className="text-xs text-muted-foreground">
                Nessuna partita completata nel periodo selezionato.
              </p>
            </div>
          ) : (
            leaderboard.map((row) => (
              <StandingsRow
                key={row.user.id}
                rank={row.rank}
                user={row.user}
                normalizedScore={row.averageScore}
                secondaryInfo={`${row.playedCount} ${row.playedCount === 1 ? 'partita' : 'partite'} • Best: ${row.bestScore}`}
                isWinner={row.rank === 1}
                isCurrentUser={currentUserId === row.user.id}
              />
            ))
          )}
        </div>

        {/* Colonna DX: Grafico Multi-Linea Recharts (7 colonne su 12) */}
        <div className="glass-card flex flex-col justify-between rounded-2xl p-4 sm:p-5 lg:col-span-7">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Grafico Punteggi Giornalieri
            </h3>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="size-3" />
              {period.startDate} &rarr; {period.endDate}
            </span>
          </div>

          {trendData.length === 0 || !mounted ? (
            <div className="flex h-56 items-center justify-center text-center md:h-64">
              <p className="text-xs text-muted-foreground">
                Dati storici insufficienti per tracciare il grafico in questo
                periodo.
              </p>
            </div>
          ) : (
            <div className="h-56 w-full md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 255, 255, 0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 1000]}
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    ticks={[0, 250, 500, 750, 1000]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121526',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  {players.map((p) => (
                    <Line
                      key={p.id}
                      type="monotone"
                      dataKey={p.id}
                      name={p.name}
                      stroke={p.color || '#3b82f6'}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: p.color || '#3b82f6' }}
                      activeDot={{ r: 5 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Legenda Giocatori in basso al grafico */}
          {players.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 border-t border-white/5 pt-3">
              {players.map((p) => (
                <div key={p.id} className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: p.color || '#3b82f6' }}
                  />
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
