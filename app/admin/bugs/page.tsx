"use client"

import { useEffect, useState, useCallback } from "react"
import { AppShell } from "@/components/molecules/AppShell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge, Button } from "@/components/atoms"
import { apiFetch } from "@/lib/utils"
import { Bug, CheckCircle2, AlertCircle, Trash2, RefreshCw, ExternalLink, ShieldCheck } from "lucide-react"

export interface BugReportItem {
  id: string
  userId?: string | null
  userEmail?: string | null
  userName?: string | null
  description: string
  pageUrl?: string | null
  status: "OPEN" | "RESOLVED" | "CLOSED"
  createdAt: string
}

export default function AdminBugsPage() {
  const [bugs, setBugs] = useState<BugReportItem[]>([])
  const [filter, setFilter] = useState<"ALL" | "OPEN" | "RESOLVED">("ALL")
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const fetchBugs = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await apiFetch("/api/bugs")
      if (res.ok) {
        const json = await res.json()
        setBugs(json.bugs || [])
      }
    } catch (err) {
      console.error("Errore fetch bug reports:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBugs()
  }, [fetchBugs])

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "OPEN" ? "RESOLVED" : "OPEN"
    setActionLoadingId(id)

    try {
      const res = await apiFetch(`/api/bugs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setBugs((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus as BugReportItem["status"] } : b))
        )
      }
    } catch (err) {
      console.error("Errore aggiornamento bug:", err)
    } finally {
      setActionLoadingId(null)
    }
  }

  const deleteBug = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa segnalazione dal database?")) return
    setActionLoadingId(id)

    try {
      const res = await apiFetch(`/api/bugs/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setBugs((prev) => prev.filter((b) => b.id !== id))
      }
    } catch (err) {
      console.error("Errore eliminazione bug:", err)
    } finally {
      setActionLoadingId(null)
    }
  }

  const totalCount = bugs.length
  const openCount = bugs.filter((b) => b.status === "OPEN").length
  const resolvedCount = bugs.filter((b) => b.status === "RESOLVED" || b.status === "CLOSED").length

  const filteredBugs = bugs.filter((b) => {
    if (filter === "OPEN") return b.status === "OPEN"
    if (filter === "RESOLVED") return b.status === "RESOLVED" || b.status === "CLOSED"
    return true
  })

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {/* Header Pagina Admin */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-6 text-amber-500" />
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Pannello Amministrazione Bug</h1>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Gestisci le segnalazioni di problemi e i suggerimenti inviati dai giocatori.
              </p>
            </div>

            <Button onClick={fetchBugs} variant="outline" size="sm" className="w-fit cursor-pointer">
              <RefreshCw className="size-4 mr-2" />
              Aggiorna Lista
            </Button>
          </div>

          {/* Cards Statistiche Veloci */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium uppercase tracking-wider">Totale Segnalazioni</span>
                <Bug className="size-4 text-amber-500" />
              </div>
              <p className="mt-2 text-2xl font-bold">{totalCount}</p>
            </div>

            <div className="rounded-2xl border bg-amber-500/20 bg-amber-500/5 p-4 shadow-xs">
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Aperti / Da Risolvere</span>
                <AlertCircle className="size-4" />
              </div>
              <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{openCount}</p>
            </div>

            <div className="rounded-2xl border bg-emerald-500/20 bg-emerald-500/5 p-4 shadow-xs">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Risolti</span>
                <CheckCircle2 className="size-4" />
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{resolvedCount}</p>
            </div>
          </div>

          {/* Filtri Tabelle e Contenuto */}
          <Card>
            <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Registro Segnalazioni</CardTitle>
                <CardDescription>Elenco completo dei feedback nel database PostgreSQL</CardDescription>
              </div>

              {/* Filtri Stato */}
              <div className="flex gap-1.5 rounded-xl bg-muted p-1 border">
                <button
                  onClick={() => setFilter("ALL")}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    filter === "ALL" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Tutti ({totalCount})
                </button>
                <button
                  onClick={() => setFilter("OPEN")}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    filter === "OPEN" ? "bg-background text-amber-500 shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Aperti ({openCount})
                </button>
                <button
                  onClick={() => setFilter("RESOLVED")}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    filter === "RESOLVED" ? "bg-background text-emerald-500 shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Risolti ({resolvedCount})
                </button>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 pt-2">
              {isLoading ? (
                <div className="flex flex-col gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 w-full rounded-xl bg-muted/20 animate-pulse" />
                  ))}
                </div>
              ) : filteredBugs.length > 0 ? (
                filteredBugs.map((bug) => {
                  const isResolved = bug.status === "RESOLVED" || bug.status === "CLOSED"
                  const dateFormatted = new Date(bug.createdAt).toLocaleDateString("it-IT", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })

                  return (
                    <div
                      key={bug.id}
                      className={`flex flex-col gap-3 rounded-xl border p-4 shadow-2xs transition-all ${
                        isResolved ? "bg-card/50 opacity-75 border-border/50" : "bg-card border-amber-500/30"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={isResolved ? "outline" : "default"}
                            className={
                              isResolved
                                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-amber-500 text-white"
                            }
                          >
                            {isResolved ? "RISOLTO" : "APERTO"}
                          </Badge>
                          <span className="text-xs font-semibold">{bug.userName || "Ospite"}</span>
                          {bug.userEmail && (
                            <span className="text-xs text-muted-foreground">({bug.userEmail})</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {bug.pageUrl && (
                            <span className="flex items-center gap-1 font-mono text-[11px] bg-muted px-2 py-0.5 rounded">
                              <ExternalLink className="size-3" /> {bug.pageUrl}
                            </span>
                          )}
                          <span>{dateFormatted}</span>
                        </div>
                      </div>

                      <p className="text-sm text-foreground/90 whitespace-pre-wrap rounded-lg bg-muted/40 p-3 border border-border/40 font-mono text-xs leading-relaxed">
                        {bug.description}
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoadingId === bug.id}
                          onClick={() => toggleStatus(bug.id, bug.status)}
                          className="cursor-pointer"
                        >
                          {isResolved ? (
                            <>
                              <AlertCircle className="size-3.5 mr-1.5 text-amber-500" />
                              Riapri Segnalazione
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="size-3.5 mr-1.5 text-emerald-500" />
                              Segna come Risolto
                            </>
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={actionLoadingId === bug.id}
                          onClick={() => deleteBug(bug.id)}
                          className="cursor-pointer"
                        >
                          <Trash2 className="size-3.5 mr-1.5" />
                          Elimina
                        </Button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
                  <Bug className="size-10 opacity-30 text-amber-500" />
                  <p className="text-sm font-semibold">Nessuna segnalazione bug trovata.</p>
                  <p className="text-xs text-muted-foreground">
                    {filter === "ALL"
                      ? "Il database è pulito e non ci sono problemi segnalati dai giocatori!"
                      : `Nessuna segnalazione nello stato "${filter}".`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
