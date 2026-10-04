"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, Avatar } from "@/components/atoms"
import { MessageSquare, Send, Sparkles, Trash2, LogIn } from "lucide-react"

export interface ChalkboardNote {
  id: string
  content: string
  dateLabel: string
  time: string
  author: {
    name: string
    initials: string
    color: string
    image?: string | null
  }
}

export function DailyChalkboard() {
  const { data: session } = useSession()
  const [notes, setNotes] = useState<ChalkboardNote[]>([])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes")
      if (res.ok) {
        const json = await res.json()
        setNotes(json.notes || [])
      }
    } catch (err) {
      console.error("Errore recupero messaggi bacheca:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || isSubmitting || !session) return

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inputText }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || "Impossibile inviare il messaggio.")
      } else {
        setInputText("")
        setNotes((prev) => [json.note, ...prev])
      }
    } catch (err) {
      console.error("Errore invio messaggio bacheca:", err)
      setError("Errore di connessione.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-card via-card to-amber-500/5 shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-amber-500" />
            <CardTitle>Bacheca del Gruppo</CardTitle>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <Trash2 className="size-3" /> Auto-pulizia 7 gg
          </span>
        </div>
        <CardDescription>Lavagna riservata ai giocatori per sfottò e commenti della settimana.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Form Invio Messaggio (Disponibile SOLO se AUTENTICATO) */}
        {session ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={280}
                placeholder="Scrivi qualcosa sulla lavagna..."
                className="flex-1 rounded-xl border bg-background/80 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <Button
                type="submit"
                disabled={!inputText.trim() || isSubmitting}
                className="bg-amber-500 hover:bg-amber-600 text-white cursor-pointer"
              >
                <Send className="size-4 mr-1.5" />
                Invia
              </Button>
            </div>
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
          </form>
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2 font-medium text-foreground">
              <LogIn className="size-4 text-amber-500" />
              Accedi con Google per pubblicare messaggi sulla lavagna.
            </span>
          </div>
        )}

        {/* Lista dei Messaggi della Settimana */}
        <div className="flex flex-col gap-2.5 max-h-[260px] overflow-y-auto pt-1 pr-1">
          {isLoading ? (
            <div className="h-16 w-full rounded-xl bg-muted/20 animate-pulse" />
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                className="flex items-start gap-3 rounded-xl border bg-card/80 p-3 shadow-2xs backdrop-blur-xs transition-all hover:border-amber-500/30"
              >
                <Avatar initials={note.author.initials} className={`size-8 text-xs font-bold ${note.author.color} text-white shrink-0`}>
                  {note.author.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={note.author.image} alt={note.author.name} className="size-full object-cover rounded-full" />
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold truncate">{note.author.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {note.dateLabel} · {note.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-foreground/90 break-words">{note.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 py-6 text-center text-muted-foreground">
              <MessageSquare className="size-7 opacity-30" />
              <p className="text-xs font-medium">La lavagna è vuota questa settimana.</p>
              <p className="text-[11px]">Accedi e scrivi il primo messaggio!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
