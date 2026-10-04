"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { games, GAME_CONFIG } from "@/lib/game-data"
import { UserProfileStats } from "@/lib/services/user-service"

interface PersonalStatsCardProps {
  stats?: UserProfileStats | null
  isLoading?: boolean
}

export function PersonalStatsCard({ stats, isLoading }: PersonalStatsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Le tue statistiche</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl border bg-muted/20 animate-pulse p-4" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const hasPlayedToday = stats?.hasPlayedToday ?? false
  const todayTotal = stats?.todayTotal
  const played = stats?.played ?? 0
  const streak = stats?.streak ?? 0
  const gameScores = stats?.userGameScores

  return (
    <Card>
      <CardHeader>
        <CardTitle>Le tue statistiche</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Punteggio di Oggi */}
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Punteggio di Oggi</p>
          </div>
          {hasPlayedToday && todayTotal !== null && todayTotal !== undefined ? (
            <p className="mt-1.5 text-2xl font-bold">{todayTotal} <span className="text-xs font-normal text-muted-foreground">pt tot</span></p>
          ) : (
            <p className="mt-1.5 text-sm font-semibold text-muted-foreground italic">Non ancora registrato</p>
          )}
        </div>

        {/* Partite giocate */}
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Partite Giocate</p>
          </div>
          <p className="mt-1.5 text-2xl font-bold">{played}</p>
        </div>

        {/* Streak attiva */}
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Streak Attiva</p>
          </div>
          <p className="mt-1.5 text-2xl font-bold text-amber-500">{streak} <span className="text-xs font-normal text-muted-foreground">giorni</span></p>
        </div>

        {/* Card dinamiche per ciascun gioco */}
        {games.map((gameKey) => {
          const config = GAME_CONFIG[gameKey]
          const todayScore = gameScores ? gameScores[gameKey] : null
          const gameStat = stats?.gameStats?.[gameKey]
          const displayScore = todayScore !== null && todayScore !== undefined ? todayScore : gameStat?.best

          return (
            <div key={gameKey} className="rounded-xl border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{config.name}</p>
                {todayScore !== null && todayScore !== undefined && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">Oggi</span>
                )}
              </div>
              {displayScore !== null && displayScore !== undefined ? (
                <p className="mt-1.5 text-2xl font-bold">
                  {displayScore} <span className="text-xs font-normal text-muted-foreground">{config.unit}</span>
                </p>
              ) : (
                <p className="mt-1.5 text-sm font-medium text-muted-foreground italic">Non giocato</p>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
