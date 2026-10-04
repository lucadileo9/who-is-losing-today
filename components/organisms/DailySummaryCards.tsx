"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, Crown, Frown, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar } from "@/components/atoms"
import { getTodayIsoString, shiftIsoDate, formatItalianDate } from "@/lib/date-utils"
import { DatePicker } from "@/components/molecules/DatePicker"

interface RankedPlayer {
  id: string
  name: string
  initials: string
  color: string
  overallScore: number
}

export function DailySummaryCards() {
  const [selectedDateStr, setSelectedDateStr] = useState<string>(getTodayIsoString)
  const [rankedToday, setRankedToday] = useState<RankedPlayer[]>([])
  const [loading, setLoading] = useState(true)

  const shiftDate = (days: number) => {
    setSelectedDateStr((prev) => shiftIsoDate(prev, days))
  }

  const fetchDailyData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard?date=${selectedDateStr}`)
      if (res.ok) {
        const json = await res.json()
        setRankedToday(json?.dailySummary?.ranked || [])
      }
    } catch (err) {
      console.error("Errore fetch dal DB:", err)
    } finally {
      setLoading(false)
    }
  }, [selectedDateStr])

  useEffect(() => {
    fetchDailyData()

    const handleScoreUpdated = () => {
      fetchDailyData()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scoreUpdated", handleScoreUpdated)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scoreUpdated", handleScoreUpdated)
      }
    }
  }, [fetchDailyData])

  const loser = rankedToday.length > 0 ? rankedToday[rankedToday.length - 1] : null

  return (
    <div className="flex flex-col gap-4">
      {/* Navigatore Data Interattivo */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-3 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => shiftDate(-1)}
            className="flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4" />
            Precedente
          </button>
          <button
            onClick={() => setSelectedDateStr(getTodayIsoString())}
            className="rounded-xl border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
          >
            Oggi
          </button>
          <button
            onClick={() => shiftDate(1)}
            className="flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
          >
            Successivo
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Picker Calendario Diretto */}
        <DatePicker label="Scegli data:" value={selectedDateStr} onChange={setSelectedDateStr} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* CARD IL PERDENTE DEL GIORNO */}
        <Card className="border-rose-500/30 bg-rose-500/5 relative overflow-hidden flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                <Frown className="size-4" /> Il Perdente di Oggi
              </span>
              <span className="text-xs font-medium text-muted-foreground capitalize">
                {formatItalianDate(selectedDateStr)}
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            {loading ? (
              <div className="h-14 animate-pulse rounded-xl bg-muted/20" />
            ) : loser ? (
              <div className="flex items-center gap-4">
                <Avatar initials={loser.initials} className={`size-14 text-base font-bold ${loser.color} shadow-sm`} />
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{loser.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">Punteggio complessivo: <span className="font-semibold text-foreground">{loser.overallScore} pt</span></p>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    Ultimo classificato per la data selezionata
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 py-4 text-center text-muted-foreground">
                <Trophy className="size-8 opacity-30" />
                <p className="text-xs font-medium">Nessun punteggio per questa data.</p>
                <p className="text-[11px]">Registra una partita per decretare il perdente!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CARD PODIO DI OGGI (CLASSIFICA RAPIDA) */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Crown className="size-4 text-amber-500" /> Classifica della Giornata
              </span>
              <span className="text-xs font-medium text-muted-foreground capitalize">
                {formatItalianDate(selectedDateStr)}
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="flex flex-col gap-2.5">
              {loading ? (
                <div className="h-20 animate-pulse rounded-xl bg-muted/20" />
              ) : rankedToday.length > 0 ? (
                rankedToday.slice(0, 3).map((player, idx) => (
                  <div key={player.id} className="flex items-center justify-between rounded-xl bg-muted/40 p-2.5 border">
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center text-xs font-bold text-muted-foreground">#{idx + 1}</span>
                      <Avatar initials={player.initials} className={`size-7 text-xs ${player.color}`} />
                      <span className="text-sm font-semibold">{player.name}</span>
                    </div>
                    <span className="text-xs font-bold">{player.overallScore} pt</span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 py-4 text-center text-muted-foreground">
                  <p className="text-xs font-medium">Nessun giocatore in classifica oggi.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
