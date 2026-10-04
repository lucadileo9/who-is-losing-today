"use client"

import { useSession, signIn } from "next-auth/react"
import { AppShell } from "@/components/molecules/AppShell"
import { ProfileTemplate } from "@/components/templates/ProfileTemplate"
import { Avatar, Badge, Button } from "@/components/atoms"
import { PersonalStatsCard } from "@/components/organisms/PersonalStatsCard"
import { PersonalTrendChart } from "@/components/organisms/PersonalTrendChart"
import { ScoreHistoryList } from "@/components/organisms/ScoreHistoryList"
import { useUserStats } from "@/lib/hooks/use-user-stats"
import { Calendar, Flame, LogIn, Trophy } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const { stats, isLoading: isStatsLoading } = useUserStats()

  if (status === "loading" || (status === "authenticated" && isStatsLoading && !stats)) {
    return (
      <AppShell>
        <ProfileTemplate>
          <div className="flex h-64 items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </ProfileTemplate>
      </AppShell>
    )
  }

  if (status === "unauthenticated" || !session) {
    return (
      <AppShell>
        <ProfileTemplate>
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border bg-card p-12 text-center shadow-xs">
            <div className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <LogIn className="size-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Accedi per visualizzare il tuo profilo</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Effettua il login con Google per vedere le tue statistiche personali, la tua streak di vittorie ed i tuoi punteggi salvati.
            </p>
            <Button onClick={() => signIn("google")} className="mt-2 cursor-pointer">
              <LogIn className="size-4 mr-2" />
              Accedi con Google
            </Button>
          </div>
        </ProfileTemplate>
      </AppShell>
    )
  }

  const name = session.user?.name || "Giocatore"
  const email = session.user?.email || ""
  const image = session.user?.image
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  const played = stats?.played ?? 0
  const streak = stats?.streak ?? 0
  const rank = stats?.rank ?? "Nuovo Giocatore"
  const hasPlayedToday = stats?.hasPlayedToday ?? false

  return (
    <AppShell>
      <ProfileTemplate>
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Header Profilo */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Profilo Giocatore</h1>
            <p className="mt-1 text-sm text-muted-foreground">Panoramica del tuo rendimento personale e delle partite giocate.</p>
          </div>

          {/* Card Info Giocatore Reale da Sessione Google/NextAuth + DB */}
          <section className="flex flex-col gap-5 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between shadow-xs">
            <div className="flex items-center gap-4">
              <Avatar initials={initials} className="size-16 text-lg font-bold bg-chart-1 text-primary shadow-sm">
                {image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={image} alt={name} className="size-full object-cover rounded-full" />
                )}
              </Avatar>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight">{name}</h2>
                  <Badge variant="outline" className="text-xs font-semibold border-chart-2/40 bg-chart-2/10 text-chart-2">
                    <Trophy className="size-3 mr-1" /> {rank}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{email} · {played} {played === 1 ? "partita giocata" : "partite giocate"}</p>
                <div className="mt-2.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5 text-muted-foreground" /> {hasPlayedToday ? "Attivo oggi" : "Non ancora attivo oggi"}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-amber-500">
                    <Flame className="size-3.5" /> {streak} {streak === 1 ? "giorno" : "giorni"} di streak
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Statistiche & Grafico Andamento Personale */}
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <PersonalStatsCard stats={stats} isLoading={isStatsLoading} />
            <PersonalTrendChart />
          </div>

          {/* Storico Partite Recenti */}
          <ScoreHistoryList />
        </div>
      </ProfileTemplate>
    </AppShell>
  )
}
