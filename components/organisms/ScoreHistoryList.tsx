"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { gameShort, gameTone, isLowerBetter, GAME_CONFIG } from "@/lib/game-data"
import { useUserStats } from "@/lib/hooks/use-user-stats"
import { Gamepad2 } from "lucide-react"

export function ScoreHistoryList() {
  const { history, isLoading } = useUserStats()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Partite recenti</CardTitle>
          <CardDescription>Il tuo storico dettagliato</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 w-full rounded-xl bg-muted/20 animate-pulse" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partite recenti</CardTitle>
        <CardDescription>Il tuo storico dettagliato</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {history.length > 0 ? (
          history.map((item) => {
            const config = GAME_CONFIG[item.game]
            return (
              <div key={item.id} className="flex items-center justify-between rounded-xl border p-3">
                <div className="flex items-center gap-3">
                  <span className={`grid size-9 place-items-center rounded-lg border text-xs font-semibold ${gameTone[item.game]}`}>
                    {gameShort[item.game]}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{config?.name || item.game}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.date} {item.time ? `· ${item.time}` : ""}
                    </p>
                  </div>
                </div>
                <span className="font-semibold">
                  {item.score}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    {isLowerBetter(item.game) ? "tentativi" : "pts"}
                  </span>
                </span>
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            <Gamepad2 className="size-8 opacity-40" />
            <p className="text-sm font-medium">Nessuna partita giocata ancora.</p>
            <p className="text-xs text-muted-foreground">Incolla o registra il tuo primo punteggio dalla home per iniziare!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
