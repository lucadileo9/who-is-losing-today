"use client"

import { useState } from "react"
import { Check, Send } from "lucide-react"
import { useSession } from "next-auth/react"
import { Button, Input } from "@/components/atoms"
import { games, parseScore, type Game, gameTone } from "@/lib/game-data"
import { cn, apiFetch } from "@/lib/utils"

export function GameScoreInput() {
  const { data: session } = useSession()
  const [game, setGame] = useState<Game>("Krilion")
  const [value, setValue] = useState("")
  const [saved, setSaved] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [extractedScore, setExtractedScore] = useState<number | null>(null)
  const [error, setError] = useState("")

  const placeholderText =
    game === "Metazooa"
      ? 'Es: "... in 13 guesses!"'
      : game === "Chronophoto"
        ? 'Es: "Final Total: 3129"'
        : 'Es: "90" o "Ho fatto 90 in Krilion"'

  async function save() {
    const score = parseScore(value, game)
    if (score === null) {
      setError("Impossibile estrarre un punteggio valido dal testo inserito.")
      return
    }

    setError("")
    setIsSubmitting(true)

    try {
      const res = await apiFetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game,
          score,
          text: value,
          userEmail: session?.user?.email || null,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || "Impossibile salvare il punteggio nel database.")
        setIsSubmitting(false)
        return
      }

      setExtractedScore(score)
      setSaved(true)
      setValue("")

      // Notifica tutti i componenti della dashboard di ricaricare i dati in tempo reale
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("scoreUpdated"))
      }

      setTimeout(() => {
        setSaved(false)
        setExtractedScore(null)
      }, 3000)
    } catch (err) {
      console.error("Errore salvataggio punteggio:", err)
      setError("Errore di connessione al server.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-chart-2">Nuova partita</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Hai giocato oggi?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Incolla il testo del risultato per aggiungerlo alla classifica.</p>
        </div>

        {session?.user && (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
            Registri come: <strong>{session.user.name}</strong>
          </span>
        )}
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {games.map((item) => (
          <button
            key={item}
            onClick={() => {
              setGame(item)
              setError("")
            }}
            className={cn(
              "shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
              game === item ? gameTone[item] : "border-transparent bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (error) setError("")
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) save()
          }}
          placeholder={placeholderText}
          aria-label={`Punteggio ${game}`}
        />
        <Button onClick={save} disabled={isSubmitting} className="sm:w-auto cursor-pointer">
          {saved ? <Check className="size-4 mr-1.5" /> : <Send className="size-4 mr-1.5" />}
          {saved ? "Salvato!" : "Aggiungi punteggio"}
        </Button>
      </div>

      {saved && extractedScore !== null && (
        <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          ✓ Estratto punteggio: <strong>{extractedScore}</strong> per {game}!
        </p>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        Scrivi o incolla il testo originale: estraiamo automaticamente il punteggio numerico.
      </p>

      {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
    </section>
  )
}
