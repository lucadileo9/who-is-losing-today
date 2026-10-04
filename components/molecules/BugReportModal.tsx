"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/atoms"
import { Bug, Check, Send } from "lucide-react"

export function BugReportModal() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim() || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const pageUrl = typeof window !== "undefined" ? window.location.pathname : "/"
      const res = await fetch("/api/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          pageUrl,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || "Impossibile inviare la segnalazione.")
      } else {
        setSubmitted(true)
        setDescription("")
        setTimeout(() => {
          setSubmitted(false)
          setOpen(false)
        }, 2500)
      }
    } catch (err) {
      console.error("Errore invio bug:", err)
      setError("Errore di connessione al server.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber-500 transition-colors cursor-pointer">
          <Bug className="size-3.5" />
          <span>Segnala un Bug</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-500">
            <Bug className="size-5" />
            <DialogTitle>Segnala un problema / Bug 🐛</DialogTitle>
          </div>
          <DialogDescription>
            Hai notato qualcosa che non funziona o hai un suggerimento per migliorare l&apos;app?
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-center text-emerald-600 dark:text-emerald-400">
            <div className="grid size-12 place-items-center rounded-full bg-emerald-500/10">
              <Check className="size-6" />
            </div>
            <p className="text-sm font-semibold">Segnalazione inviata con successo!</p>
            <p className="text-xs text-muted-foreground">Grazie per il tuo aiuto nel migliorare Who Is Losing Today.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bug-desc" className="text-xs font-medium text-muted-foreground">
                Descrivi cosa è successo o cosa vorresti migliorare:
              </label>
              <textarea
                id="bug-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Es: Il grafico del trend non carica se cambio scheda..."
                rows={4}
                required
                className="w-full rounded-xl border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {session?.user && (
              <p className="text-[11px] text-muted-foreground">
                Inviando come: <strong>{session.user.name}</strong> ({session.user.email})
              </p>
            )}

            {error && <p className="text-xs font-medium text-destructive">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={!description.trim() || isSubmitting}
                className="bg-amber-500 hover:bg-amber-600 text-white cursor-pointer"
              >
                <Send className="size-4 mr-1.5" />
                Invia segnalazione
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
