"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type LeaderboardTab, GAME_CONFIG } from "@/lib/game-data"
import { getTodayIsoString } from "@/lib/date-utils"
import { ChartTooltip } from "@/components/molecules/ChartTooltip"
import { DatePicker } from "@/components/molecules/DatePicker"
import { GameTabFilter } from "@/components/molecules/GameTabFilter"
import { useUserStats } from "@/lib/hooks/use-user-stats"
import { BarChart3 } from "lucide-react"

export function PersonalTrendChart() {
  const [mounted, setMounted] = useState(false)
  const [selectedTab, setSelectedTab] = useState<LeaderboardTab>("Totale")
  
  // Impostiamo l'intervallo predefinito degli ultimi 30 giorni
  const defaultFrom = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0]
  const [fromDate, setFromDate] = useState(defaultFrom)
  const [toDate, setToDate] = useState(getTodayIsoString())

  const { trend, isLoading } = useUserStats(fromDate, toDate)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mappa i dati del trend per il grafico Recharts
  const chartData = trend.map((d) => ({
    day: d.day,
    Punteggio: d[selectedTab] ?? 0,
  }))

  const hasData = chartData.some((item) => item.Punteggio > 0)
  const currentColor = selectedTab === "Totale" ? "#8b5cf6" : GAME_CONFIG[selectedTab].color

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Andamento Personale</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Visualizza il tuo progresso nel tempo</p>
        </div>

        {/* Filtro Giochi Reutilizzabile */}
        <GameTabFilter selectedTab={selectedTab} onSelectTab={setSelectedTab} showTotale={true} />
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-2">
        {/* Selettore intervallo date con DatePicker */}
        <div className="flex flex-wrap items-center justify-end gap-3 rounded-xl bg-muted/40 p-2 border">
          <DatePicker label="Da:" value={fromDate} onChange={setFromDate} />
          <DatePicker label="A:" value={toDate} onChange={setToDate} />
        </div>

        {/* Grafico Recharts */}
        <div className="h-[220px] w-full pt-2">
          {!mounted || isLoading ? (
            <div className="h-full w-full rounded-xl bg-muted/20 animate-pulse" />
          ) : hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
                <YAxis axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
                <Bar dataKey="Punteggio" fill={currentColor} radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center text-muted-foreground">
              <BarChart3 className="size-8 opacity-40" />
              <p className="text-xs font-medium">Nessun punteggio registrato in questo intervallo di date.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
