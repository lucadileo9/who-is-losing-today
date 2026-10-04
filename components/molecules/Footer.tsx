import { Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-card/50 py-6 text-sm text-muted-foreground mt-auto">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
            <Sparkles className="size-3.5" />
          </span>
          <span className="font-semibold text-foreground">Who Is Losing Today?</span>
          <span>· Sfida tra amici</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Krilion · Metazooa · Chronophoto — Gestione punteggi quotidiani
        </p>
      </div>
    </footer>
  )
}
