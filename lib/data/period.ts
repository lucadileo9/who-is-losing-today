import { prisma } from "@/lib/prisma"
import { calculateNormalizedScore, type Game } from "@/lib/game-data"
import { DEFAULT_USER_COLOR } from "@/lib/theme/colors"
import type {
  PeriodResultsDTO,
  PeriodGameData,
  PeriodLeaderboardRow,
  TrendPointDTO,
  PeriodPreset,
} from "@/lib/types/period"
import type { UserSummaryDTO } from "@/lib/types/user"

export type { PeriodPreset }

export function resolvePeriodDates(presetOrRange: PeriodPreset | { startDate: Date; endDate: Date }): {
  startDate: Date
  endDate: Date
} {
  if (typeof presetOrRange === "object") {
    return presetOrRange
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

  switch (presetOrRange) {
    case "week": {
      const start = new Date(today)
      start.setDate(start.getDate() - 6)
      start.setHours(0, 0, 0, 0)
      return { startDate: start, endDate: today }
    }
    case "last_month": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0)
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
      return { startDate: start, endDate: end }
    }
    case "all": {
      const start = new Date(2020, 0, 1, 0, 0, 0, 0)
      return { startDate: start, endDate: today }
    }
    case "month":
    default: {
      // Default: dal 1° del mese corrente a oggi (oppure ultimi 30 giorni)
      const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
      return { startDate: start, endDate: today }
    }
  }
}

/**
 * Recupera e aggrega tutti i dati di periodo per la classifica storica e per i grafici Recharts.
 * Restituisce in un unico DTO le 4 schede (Totale, Krilion, Metazooa, Chronophoto).
 */
export async function getPeriodResults(
  presetOrRange: PeriodPreset | { startDate: Date; endDate: Date } = "month"
): Promise<PeriodResultsDTO> {
  const { startDate, endDate } = resolvePeriodDates(presetOrRange)

  // 1. Singola query mirata sull'intervallo temporale
  const scores = await prisma.dailyScore.findMany({
    where: {
      scoreDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          color: true,
          image: true,
        },
      },
    },
    orderBy: { scoreDate: "asc" },
  })

  // Estrai la lista unica di tutti i giocatori partecipanti nel periodo
  const usersMap = new Map<string, UserSummaryDTO>()
  scores.forEach((s) => {
    if (!usersMap.has(s.userId)) {
      usersMap.set(s.userId, {
        id: s.user.id,
        name: s.user.name || "Giocatore",
        color: s.user.color || DEFAULT_USER_COLOR,
        image: s.user.image,
      })
    }
  })
  const players = Array.from(usersMap.values())

  // Mappa di calcolo aggregato:
  // DataStr -> Map<UserId, { raw: Record<Game, number>, norm: Record<Game, number> }>
  const dateMap = new Map<
    string,
    Map<string, { raw: Record<Game, number>; norm: Record<Game, number> }>
  >()

  scores.forEach((sc) => {
    const dayKey = sc.scoreDate.toISOString().split("T")[0] // "YYYY-MM-DD"
    if (!dateMap.has(dayKey)) {
      dateMap.set(dayKey, new Map())
    }

    const dayUsers = dateMap.get(dayKey)!
    if (!dayUsers.has(sc.userId)) {
      dayUsers.set(sc.userId, {
        raw: { Krilion: 0, Metazooa: 0, Chronophoto: 0 },
        norm: { Krilion: 0, Metazooa: 0, Chronophoto: 0 },
      })
    }

    const userEntry = dayUsers.get(sc.userId)!
    const gameKey = sc.gameId as Game
    if (gameKey in userEntry.raw) {
      userEntry.raw[gameKey] = sc.rawScore
      userEntry.norm[gameKey] = sc.normalizedScore || calculateNormalizedScore(gameKey, sc.rawScore)
    }
  })

  // Helper per costruire la serie temporale per Recharts (date: "18 Ott", "user_1": 85)
  const buildTrend = (
    extractScore: (entry: { raw: Record<Game, number>; norm: Record<Game, number> }) => number | null
  ): TrendPointDTO[] => {
    const trend: TrendPointDTO[] = []

    dateMap.forEach((userEntries, dayIso) => {
      const d = new Date(dayIso)
      const dayLabel = d.toLocaleDateString("it-IT", { day: "numeric", month: "short" })

      const point: TrendPointDTO = { date: dayLabel }
      userEntries.forEach((entry, userId) => {
        const val = extractScore(entry)
        if (val !== null && val > 0) {
          point[userId] = val
        }
      })

      trend.push(point)
    })

    return trend
  }

  // Helper per calcolare la classifica di periodo per un gioco o per il totale
  const buildLeaderboard = (
    extractScore: (entry: { raw: Record<Game, number>; norm: Record<Game, number> }) => number | null,
    isLowerBetter = false
  ): PeriodLeaderboardRow[] => {
    const statsByUser = new Map<
      string,
      {
        user: UserSummaryDTO
        playedCount: number
        totalPoints: number
        bestScore: number
        scoresList: number[]
      }
    >()

    players.forEach((p) => {
      statsByUser.set(p.id, {
        user: p,
        playedCount: 0,
        totalPoints: 0,
        bestScore: isLowerBetter ? 999999 : 0,
        scoresList: [],
      })
    })

    dateMap.forEach((userEntries) => {
      userEntries.forEach((entry, userId) => {
        const val = extractScore(entry)
        if (val !== null && val > 0) {
          const stats = statsByUser.get(userId)
          if (stats) {
            stats.playedCount++
            stats.totalPoints += val
            stats.scoresList.push(val)
            if (isLowerBetter) {
              if (val < stats.bestScore) stats.bestScore = val
            } else {
              if (val > stats.bestScore) stats.bestScore = val
            }
          }
        }
      })
    })

    // Ordina i giocatori per media punti decrescente (o tentativi crescenti)
    const rows = Array.from(statsByUser.values())
      .filter((s) => s.playedCount > 0)
      .map((s) => {
        const averageScore = Math.round(s.totalPoints / s.playedCount)
        return {
          user: s.user,
          playedCount: s.playedCount,
          totalPoints: s.totalPoints,
          averageScore,
          bestScore: s.bestScore === 999999 ? 0 : s.bestScore,
          rank: 0,
        }
      })
      .sort((a, b) => {
        if (isLowerBetter) return a.averageScore - b.averageScore
        return b.averageScore - a.averageScore
      })

    return rows.map((r, i) => ({ ...r, rank: i + 1 }))
  }

  // Costruisci i dati per ciascuna delle 4 tab:
  // 1. Totale: somma dei 3 giochi diviso 3
  const totaleData: PeriodGameData = {
    leaderboard: buildLeaderboard((entry) => {
      const played = (entry.raw.Krilion > 0 ? 1 : 0) + (entry.raw.Metazooa > 0 ? 1 : 0) + (entry.raw.Chronophoto > 0 ? 1 : 0)
      if (played === 0) return null
      // Penalità: chi non gioca prende 0, dividi sempre per 3
      return Math.round((entry.norm.Krilion + entry.norm.Metazooa + entry.norm.Chronophoto) / 3)
    }),
    trendData: buildTrend((entry) => {
      const played = (entry.raw.Krilion > 0 ? 1 : 0) + (entry.raw.Metazooa > 0 ? 1 : 0) + (entry.raw.Chronophoto > 0 ? 1 : 0)
      if (played === 0) return null
      return Math.round((entry.norm.Krilion + entry.norm.Metazooa + entry.norm.Chronophoto) / 3)
    }),
  }

  // 2. Krilion
  const krilionData: PeriodGameData = {
    leaderboard: buildLeaderboard((entry) => (entry.raw.Krilion > 0 ? entry.raw.Krilion : null)),
    trendData: buildTrend((entry) => (entry.raw.Krilion > 0 ? entry.raw.Krilion : null)),
  }

  // 3. Metazooa (meno tentativi = meglio)
  const metazooaData: PeriodGameData = {
    leaderboard: buildLeaderboard((entry) => (entry.raw.Metazooa > 0 ? entry.raw.Metazooa : null), true),
    trendData: buildTrend((entry) => (entry.raw.Metazooa > 0 ? entry.raw.Metazooa : null)),
  }

  // 4. Chronophoto
  const chronophotoData: PeriodGameData = {
    leaderboard: buildLeaderboard((entry) => (entry.raw.Chronophoto > 0 ? entry.raw.Chronophoto : null)),
    trendData: buildTrend((entry) => (entry.raw.Chronophoto > 0 ? entry.raw.Chronophoto : null)),
  }

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    players,
    totale: totaleData,
    byGame: {
      Krilion: krilionData,
      Metazooa: metazooaData,
      Chronophoto: chronophotoData,
    },
    krilion: krilionData,
    metazooa: metazooaData,
    chronophoto: chronophotoData,
  }
}
