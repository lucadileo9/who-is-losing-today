"use client"

import { useEffect, useState, useCallback } from "react"
import { Crown, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar } from "@/components/atoms"
import { type LeaderboardTab, type Player, isLowerBetter, calculateOverallScore } from "@/lib/game-data"

export function LeaderboardTable({ tab }: { tab: LeaderboardTab }) {
  const isOverall = tab === "Totale"
  const [playerList, setPlayerList] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadPlayers = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/dashboard")
      if (res.ok) {
        const json = await res.json()
        setPlayerList(json?.players || [])
      }
    } catch (err) {
      console.error("Errore caricamento giocatori dal DB:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPlayers()

    const handleScoreUpdated = () => {
      loadPlayers()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scoreUpdated", handleScoreUpdated)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scoreUpdated", handleScoreUpdated)
      }
    }
  }, [loadPlayers])

  const ranked = [...playerList].sort((a, b) => {
    if (isOverall) {
      return calculateOverallScore(b) - calculateOverallScore(a)
    }
    if (isLowerBetter(tab)) {
      return a.scores[tab] - b.scores[tab]
    }
    return b.scores[tab] - a.scores[tab]
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classifica generale - {tab}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-48 w-full rounded-xl bg-muted/20 animate-pulse" />
        ) : ranked.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posizione</TableHead>
                <TableHead>Giocatore</TableHead>
                <TableHead className="text-right">Risultato</TableHead>
                <TableHead className="hidden text-right sm:table-cell">Streak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranked.map((player, index) => {
                const overallScore = calculateOverallScore(player)

                return (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">
                      {index === 0 ? (
                        <Crown className="size-4 text-amber-500" />
                      ) : (
                        <span className="pl-1 text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar initials={player.initials} className={`size-8 text-xs ${player.color}`} />
                        <span className="font-medium">{player.name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right text-base font-semibold">
                      {isOverall ? (
                        <div className="flex flex-col items-end">
                          <span>{overallScore} <span className="text-xs font-normal text-muted-foreground">pt tot</span></span>
                        </div>
                      ) : (
                        <span>
                          {player.scores[tab]}{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            {isLowerBetter(tab) ? "tentativi" : "pts"}
                          </span>
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="hidden text-right text-muted-foreground sm:table-cell">
                      {player.streak} giorni
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
            <Trophy className="size-10 opacity-30" />
            <p className="text-sm font-semibold">Nessun giocatore ancora in classifica.</p>
            <p className="text-xs text-muted-foreground">Registra una partita in alto per comparire nella classifica del gruppo!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
