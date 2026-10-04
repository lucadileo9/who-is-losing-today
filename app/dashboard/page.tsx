"use client"

import { useEffect, useState, useCallback } from "react"
import { GameScoreInput } from "@/components/molecules/GameScoreInput"
import { AppShell } from "@/components/molecules/AppShell"
import { LeaderboardTable } from "@/components/organisms/LeaderboardTable"
import { TrendChart } from "@/components/organisms/TrendChart"
import { DailySummaryCards } from "@/components/organisms/DailySummaryCards"
import { DailyChalkboard } from "@/components/organisms/DailyChalkboard"
import { type LeaderboardTab } from "@/lib/game-data"
import { Users, Flame } from "lucide-react"
import { DashboardTemplate } from "@/components/templates/DashboardTemplate"
import { GameTabFilter } from "@/components/molecules/GameTabFilter"

export default function DashboardPage() {
  const [tab, setTab] = useState<LeaderboardTab>("Totale")
  const [fastStats, setFastStats] = useState<{ activePlayersCount: number; maxGroupStreak: number }>({
    activePlayersCount: 0,
    maxGroupStreak: 0,
  })

  const fetchFastStats = useCallback(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.activePlayersCount === "number") {
          setFastStats({
            activePlayersCount: data.activePlayersCount,
            maxGroupStreak: data.maxGroupStreak || 0,
          })
        }
      })
      .catch((err) => console.error("Errore fetch fastStats:", err))
  }, [])

  useEffect(() => {
    fetchFastStats()

    const handleScoreUpdated = () => {
      fetchFastStats()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scoreUpdated", handleScoreUpdated)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scoreUpdated", handleScoreUpdated)
      }
    }
  }, [fetchFastStats])

  return (
    <AppShell>
      <DashboardTemplate>
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Header Dashboard */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Classifica & Risultati</h1>
            <p className="mt-1 text-sm text-muted-foreground">Confronta i punteggi del gruppo e registra le partite di oggi.</p>
          </div>

          {/* Statistiche veloci in evidenza (Dinamiche dal DB) */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Giocatori registrati</span>
                <Users className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-bold sm:text-3xl">{fastStats.activePlayersCount}</p>
              <p className="mt-1 text-xs text-muted-foreground">Membri del gruppo partecipanti</p>
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Streak di Gruppo</span>
                <Flame className="size-4 text-amber-500" />
              </div>
              <p className="mt-2 text-2xl font-bold sm:text-3xl">{fastStats.maxGroupStreak} <span className="text-sm font-normal text-muted-foreground">giorni</span></p>
              <p className="mt-1 text-xs text-muted-foreground">Massima streak attiva nel gruppo</p>
            </div>
          </div>

          {/* CARD PRIMARIA: IL PERDENTE DI OGGI & CLASSIFICA DELLA GIORNATA */}
          <DailySummaryCards />

          {/* FORM INSERIMENTO PUNTEGGIO & BACHECA DEL GIORNO */}
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <GameScoreInput />
            <DailyChalkboard />
          </div>

          {/* SEZIONE CLASSIFICA GENERALE & TREND DEL GRUPPO */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Classifica Generale & Singoli Giochi</h2>
              <p className="text-sm text-muted-foreground">Seleziona la scheda per consultare i risultati singoli o la classifica totale.</p>
            </div>
            
            {/* Componente Reutilizzabile GameTabFilter */}
            <GameTabFilter selectedTab={tab} onSelectTab={setTab} showTotale={true} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
            <LeaderboardTable tab={tab} />
            <TrendChart tab={tab} />
          </div>
        </div>
      </DashboardTemplate>
    </AppShell>
  )
}
