import Link from "next/link"
import { AppShell } from "@/components/molecules/AppShell"
import { Button } from "@/components/atoms"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="grid size-16 place-items-center rounded-2xl bg-amber-500/10 text-amber-500">
          <FileQuestion className="size-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Pagina non trovata</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <Button asChild className="mt-2">
          <Link href="/dashboard">Torna alla Dashboard</Link>
        </Button>
      </div>
    </AppShell>
  )
}
