"use client"

import { useEffect, useState, useCallback } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type LeaderboardTab, type Player, PLAYER_COLORS } from "@/lib/game-data"
import { ChartTooltip } from "@/components/molecules/ChartTooltip"
import { BarChart3 } from "lucide-react"

export function TrendChart({ tab }: { tab: LeaderboardTab }) {
  const [mounted, setMounted] = useState(false)
  const [chartData, setChartData] = useState<{ day: string; [key: string]: string | number }[]>([])
  const [activePlayers, setActivePlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadTrendData = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/dashboard")
      if (res.ok) {
        const json = await res.json()
        setChartData(json?.groupTrend?.[tab] || [])
        setActivePlayers(json?.players || [])
      }
    } catch (err) {
      console.error("Errore recupero trend dal DB:", err)
    } finally {
      setIsLoading(false)
    }
  }, [tab])

  useEffect(() => {
    setMounted(true)
    loadTrendData()

    const handleScoreUpdated = () => {
      loadTrendData()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scoreUpdated", handleScoreUpdated)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scoreUpdated", handleScoreUpdated)
      }
    }
  }, [loadTrendData])

  const hasData = chartData.length > 0 && activePlayers.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend del Gruppo - {tab}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] w-full">
          {!mounted || isLoading ? (
            <div className="h-full w-full rounded-xl bg-muted/20 animate-pulse" />
          ) : hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
                <YAxis axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
                <Tooltip content={<ChartTooltip />} />
                {activePlayers.map((player) => {
                  const color = PLAYER_COLORS[player.name] || "#8b5cf6"
                  return (
                    <Line
                      key={player.id}
                      type="monotone"
                      dataKey={player.name}
                      name={player.name}
                      stroke={color}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: color }}
                      activeDot={{ r: 5 }}
                    />
                  )
                })}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center text-muted-foreground">
              <BarChart3 className="size-8 opacity-40" />
              <p className="text-xs font-medium">Nessun andamento disponibile nel database.</p>
              <p className="text-[11px]">I grafici comparativi si popoleranno dopo la registrazione dei primi punteggi!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
