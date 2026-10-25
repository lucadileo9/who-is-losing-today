'use client';

import { useEffect, useState, useCallback } from 'react';
import { AppShell } from '@/components/molecules/AppShell';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge, Button } from '@/components/atoms';
import { apiFetch } from '@/lib/utils';
import {
  Bug,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

export interface BugReportItem {
  id: string;
  userId?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  description: string;
  category: 'BUG' | 'UI_UX' | 'FEATURE' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; emoji: string; tone: string }
> = {
  BUG: {
    label: 'Bug / Errore',
    emoji: '🐛',
    tone: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
  },
  UI_UX: {
    label: 'UI / UX',
    emoji: '🎨',
    tone: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
  },
  FEATURE: {
    label: 'Funzionalità',
    emoji: '💡',
    tone: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  },
  OTHER: {
    label: 'Altro',
    emoji: '💬',
    tone: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/30',
  },
};

const PRIORITY_CONFIG: Record<string, { label: string; tone: string }> = {
  LOW: {
    label: 'Bassa',
    tone: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30',
  },
  MEDIUM: {
    label: 'Media',
    tone: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  },
  HIGH: {
    label: 'Alta',
    tone: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
  CRITICAL: {
    label: 'Critica',
    tone: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/40',
  },
};

export default function AdminBugsPage() {
  const [bugs, setBugs] = useState<BugReportItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>(
    'ALL'
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchBugs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/bugs');
      if (res.ok) {
        const json = await res.json();
        setBugs(json.bugs || []);
      }
    } catch (err) {
      console.error('Errore fetch bug reports:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'OPEN' ? 'RESOLVED' : 'OPEN';
    setActionLoadingId(id);

    try {
      const res = await apiFetch(`/api/bugs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setBugs((prev) =>
          prev.map((b) =>
            b.id === id
              ? { ...b, status: newStatus as BugReportItem['status'] }
              : b
          )
        );
      }
    } catch (err) {
      console.error('Errore aggiornamento stato bug:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const updatePriority = async (id: string, newPriority: string) => {
    setActionLoadingId(id);

    try {
      const res = await apiFetch(`/api/bugs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (res.ok) {
        setBugs((prev) =>
          prev.map((b) =>
            b.id === id
              ? { ...b, priority: newPriority as BugReportItem['priority'] }
              : b
          )
        );
      }
    } catch (err) {
      console.error('Errore aggiornamento priorità bug:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const updateCategory = async (id: string, newCategory: string) => {
    setActionLoadingId(id);

    try {
      const res = await apiFetch(`/api/bugs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory }),
      });

      if (res.ok) {
        setBugs((prev) =>
          prev.map((b) =>
            b.id === id
              ? { ...b, category: newCategory as BugReportItem['category'] }
              : b
          )
        );
      }
    } catch (err) {
      console.error('Errore aggiornamento categoria bug:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const deleteBug = async (id: string) => {
    if (
      !confirm(
        'Sei sicuro di voler eliminare questa segnalazione dal database?'
      )
    )
      return;
    setActionLoadingId(id);

    try {
      const res = await apiFetch(`/api/bugs/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setBugs((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error('Errore eliminazione bug:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalCount = bugs.length;
  const openCount = bugs.filter((b) => b.status === 'OPEN').length;
  const resolvedCount = bugs.filter(
    (b) => b.status === 'RESOLVED' || b.status === 'CLOSED'
  ).length;

  const filteredBugs = bugs.filter((b) => {
    if (statusFilter === 'OPEN' && b.status !== 'OPEN') return false;
    if (
      statusFilter === 'RESOLVED' &&
      b.status !== 'RESOLVED' &&
      b.status !== 'CLOSED'
    )
      return false;
    if (categoryFilter !== 'ALL' && b.category !== categoryFilter) return false;
    if (priorityFilter !== 'ALL' && b.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {/* Header Pagina Admin */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-6 text-amber-500" />
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Pannello Amministrazione Bug
                </h1>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Gestisci le segnalazioni di problemi e i suggerimenti inviati
                dai giocatori.
              </p>
            </div>

            <Button
              onClick={fetchBugs}
              variant="outline"
              size="sm"
              className="w-fit cursor-pointer"
            >
              <RefreshCw className="mr-2 size-4" />
              Aggiorna Lista
            </Button>
          </div>

          {/* Cards Statistiche Veloci */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="shadow-xs rounded-2xl border bg-card p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Totale Segnalazioni
                </span>
                <Bug className="size-4 text-amber-500" />
              </div>
              <p className="mt-2 text-2xl font-bold">{totalCount}</p>
            </div>

            <div className="shadow-xs rounded-2xl border bg-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Aperti / Da Risolvere
                </span>
                <AlertCircle className="size-4" />
              </div>
              <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                {openCount}
              </p>
            </div>

            <div className="shadow-xs rounded-2xl border bg-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Risolti
                </span>
                <CheckCircle2 className="size-4" />
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {resolvedCount}
              </p>
            </div>
          </div>

          {/* Filtri Tabelle e Contenuto */}
          <Card>
            <CardHeader className="flex flex-col gap-4 pb-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Registro Segnalazioni</CardTitle>
                  <CardDescription>
                    Elenco completo dei feedback nel database PostgreSQL
                  </CardDescription>
                </div>

                {/* Filtri Stato */}
                <div className="flex w-fit gap-1.5 rounded-xl border bg-muted p-1">
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                      statusFilter === 'ALL'
                        ? 'shadow-xs bg-background text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Tutti ({totalCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('OPEN')}
                    className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                      statusFilter === 'OPEN'
                        ? 'shadow-xs bg-background text-amber-500'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Aperti ({openCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('RESOLVED')}
                    className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                      statusFilter === 'RESOLVED'
                        ? 'shadow-xs bg-background text-emerald-500'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Risolti ({resolvedCount})
                  </button>
                </div>
              </div>

              {/* Filtri secondari: Categoria e Priorità */}
              <div className="flex flex-wrap items-center gap-3 border-t pt-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-muted-foreground">
                    Argomento:
                  </span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="cursor-pointer rounded-lg border bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="ALL">Tutti gli argomenti</option>
                    <option value="BUG">🐛 Bug / Errore</option>
                    <option value="UI_UX">🎨 UI / UX</option>
                    <option value="FEATURE">💡 Funzionalità</option>
                    <option value="OTHER">💬 Altro</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-muted-foreground">
                    Priorità:
                  </span>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="cursor-pointer rounded-lg border bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="ALL">Tutte le priorità</option>
                    <option value="CRITICAL">🔴 Critica</option>
                    <option value="HIGH">🟠 Alta</option>
                    <option value="MEDIUM">🟡 Media</option>
                    <option value="LOW">🟢 Bassa</option>
                  </select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 pt-2">
              {isLoading ? (
                <div className="flex flex-col gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-24 w-full animate-pulse rounded-xl bg-muted/20"
                    />
                  ))}
                </div>
              ) : filteredBugs.length > 0 ? (
                filteredBugs.map((bug) => {
                  const isResolved =
                    bug.status === 'RESOLVED' || bug.status === 'CLOSED';
                  const catCfg =
                    CATEGORY_CONFIG[bug.category] || CATEGORY_CONFIG.OTHER;
                  const prioCfg =
                    PRIORITY_CONFIG[bug.priority] || PRIORITY_CONFIG.MEDIUM;
                  const dateFormatted = new Date(
                    bug.createdAt
                  ).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={bug.id}
                      className={`shadow-2xs flex flex-col gap-3 rounded-xl border p-4 transition-all ${
                        isResolved
                          ? 'border-border/50 bg-card/50 opacity-75'
                          : 'border-amber-500/30 bg-card'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={isResolved ? 'outline' : 'default'}
                            className={
                              isResolved
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-500 text-white'
                            }
                          >
                            {isResolved ? 'RISOLTO' : 'APERTO'}
                          </Badge>

                          {/* Selettore Argomento inline per lo sviluppatore */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-muted-foreground">
                              Argomento:
                            </span>
                            <select
                              value={bug.category || 'BUG'}
                              disabled={actionLoadingId === bug.id}
                              onChange={(e) =>
                                updateCategory(bug.id, e.target.value)
                              }
                              className={`cursor-pointer rounded-md border px-2 py-0.5 text-xs font-medium ${catCfg.tone}`}
                            >
                              <option value="BUG">🐛 Bug / Errore</option>
                              <option value="UI_UX">🎨 UI / UX</option>
                              <option value="FEATURE">💡 Funzionalità</option>
                              <option value="OTHER">💬 Altro</option>
                            </select>
                          </div>

                          {/* Selettore Priorità inline per lo sviluppatore */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-muted-foreground">
                              Priorità:
                            </span>
                            <select
                              value={bug.priority || 'MEDIUM'}
                              disabled={actionLoadingId === bug.id}
                              onChange={(e) =>
                                updatePriority(bug.id, e.target.value)
                              }
                              className={`cursor-pointer rounded-md border px-2 py-0.5 text-xs font-medium ${prioCfg.tone}`}
                            >
                              <option value="LOW">🟢 Bassa</option>
                              <option value="MEDIUM">🟡 Media</option>
                              <option value="HIGH">🟠 Alta</option>
                              <option value="CRITICAL">🔴 Critica</option>
                            </select>
                          </div>

                          <span className="text-xs font-semibold">
                            {bug.userName || 'Ospite'}
                          </span>
                          {bug.userEmail && (
                            <span className="text-xs text-muted-foreground">
                              ({bug.userEmail})
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <span>{dateFormatted}</span>
                        </div>
                      </div>

                      <p className="whitespace-pre-wrap rounded-lg border border-border/40 bg-muted/40 p-3 font-mono text-sm text-xs leading-relaxed text-foreground/90">
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
                              <AlertCircle className="mr-1.5 size-3.5 text-amber-500" />
                              Riapri Segnalazione
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="mr-1.5 size-3.5 text-emerald-500" />
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
                          <Trash2 className="mr-1.5 size-3.5" />
                          Elimina
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
                  <Bug className="size-10 text-amber-500 opacity-30" />
                  <p className="text-sm font-semibold">
                    Nessuna segnalazione bug trovata.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Non ci sono segnalazioni corrispondenti ai filtri
                    selezionati.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
