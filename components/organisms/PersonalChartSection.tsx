'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { LineChart as LineChartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserPersonalTrendPoint } from '@/lib/types/user';
import { Game, GAME_CONFIG } from '@/lib/game-data';

interface PersonalChartSectionProps {
  trendData: UserPersonalTrendPoint[];
  className?: string;
}

type TabType = 'Totale' | Game;

export function PersonalChartSection({
  trendData,
  className,
}: PersonalChartSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Totale');

  const tabs: TabType[] = ['Totale', 'Krilion', 'Metazooa', 'Chronophoto'];

  // Determina quale chiave prendere da UserPersonalTrendPoint
  const dataKey =
    activeTab === 'Totale'
      ? 'totale'
      : activeTab === 'Krilion'
        ? 'krilion'
        : activeTab === 'Metazooa'
          ? 'metazooa'
          : 'chronophoto';

  const chartColor =
    activeTab === 'Totale'
      ? '#06b6d4'
      : GAME_CONFIG[activeTab]?.color || '#3b82f6';

  const unit =
    activeTab === 'Totale' ? 'pt' : GAME_CONFIG[activeTab]?.unit || 'pt';

  // Filtra i punti con dato presente
  const filteredData = trendData.filter(
    (pt) => pt[dataKey] !== undefined && pt[dataKey] !== null
  );

  return (
    <div
      className={cn(
        'glass-card rounded-3xl border border-white/10 p-5 shadow-[0_0_25px_rgba(6,182,212,0.1)] sm:p-6',
        className
      )}
    >
      {/* Header con Titolo e Filtro Tab */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/15 text-cyan-400">
            <LineChartIcon className="size-4" />
          </span>
          <h3 className="text-base font-bold text-white">
            Andamento Punteggi nel Tempo
          </h3>
        </div>

        {/* Tab di Selezione */}
        <div className="glass-card no-scrollbar flex items-center gap-1 overflow-x-auto rounded-xl border border-white/5 p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'cursor-pointer whitespace-nowrap rounded-lg px-3 py-1 text-xs font-bold transition-all',
                  isActive
                    ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grafico Recharts o Stato Vuoto */}
      {filteredData.length < 2 ? (
        <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
          <p className="text-sm font-semibold text-white">
            Dati insufficienti per il grafico
          </p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Inserisci i tuoi punteggi per almeno 2 giornate per visualizzare la
            curva dell&apos;andamento per {activeTab}.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="personalTrendGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={activeTab === 'Totale' ? [0, 1000] : ['auto', 'auto']}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const val = payload[0].value;
                    return (
                      <div className="glass-card rounded-xl border border-white/10 bg-[#0a0b14]/95 p-2.5 text-xs shadow-xl backdrop-blur-md">
                        <p className="mb-1 font-bold text-white">{label}</p>
                        <p className="font-extrabold text-cyan-300">
                          {val} {unit}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={chartColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#personalTrendGradient)"
                dot={{
                  r: 3.5,
                  fill: chartColor,
                  stroke: '#0a0b14',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: chartColor,
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
