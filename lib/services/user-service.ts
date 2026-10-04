import { prisma } from "@/lib/prisma"
import { type Game, calculateNormalizedScore } from "@/lib/game-data"

export interface UserGameStat {
  best: number | null
  average: number | null
  playedCount: number
  todayScore: number | null
}

export interface UserProfileStats {
  played: number
  streak: number
  rank: string
  todayTotal: number | null
  hasPlayedToday: boolean
  userGameScores: Record<Game, number | null>
  gameStats: Record<Game, UserGameStat>
}

export interface UserTrendItem {
  day: string
  dateStr: string
  Krilion: number | null
  Metazooa: number | null
  Chronophoto: number | null
  Totale: number | null
}

export interface UserHistoryItem {
  id: string
  game: Game
  score: number
  date: string
  time: string
}

/**
 * Calcola le statistiche generali del profilo utente dal DB
 */
export async function getUserProfileStats(userId: string): Promise<UserProfileStats> {
  const emptyScores: Record<Game, number | null> = { Krilion: null, Metazooa: null, Chronophoto: null }
  const emptyGameStats: Record<Game, UserGameStat> = {
    Krilion: { best: null, average: null, playedCount: 0, todayScore: null },
    Metazooa: { best: null, average: null, playedCount: 0, todayScore: null },
    Chronophoto: { best: null, average: null, playedCount: 0, todayScore: null },
  }

  if (!userId) {
    return {
      played: 0,
      streak: 0,
      rank: "N/A",
      todayTotal: null,
      hasPlayedToday: false,
      userGameScores: emptyScores,
      gameStats: emptyGameStats,
    }
  }

  try {
    const allUserScores = await prisma.dailyScore.findMany({
      where: { userId },
      orderBy: { scoreDate: "desc" },
    })

    if (allUserScores.length === 0) {
      return {
        played: 0,
        streak: 0,
        rank: "In attesa di partite",
        todayTotal: null,
        hasPlayedToday: false,
        userGameScores: emptyScores,
        gameStats: emptyGameStats,
      }
    }

    // 1. Partite totali
    const played = allUserScores.length

    // 2. Calcolo Streak (giorni consecutivi a partire da oggi o ieri)
    const uniqueDates = Array.from(
      new Set(allUserScores.map((s) => s.scoreDate.toISOString().split("T")[0]))
    ).sort().reverse()

    let streak = 0
    const todayStr = new Date().toISOString().split("T")[0]
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0]

    const checkDate = uniqueDates.includes(todayStr)
      ? new Date(todayStr)
      : uniqueDates.includes(yesterdayStr)
      ? new Date(yesterdayStr)
      : null

    if (checkDate) {
      while (true) {
        const curStr = checkDate.toISOString().split("T")[0]
        if (uniqueDates.includes(curStr)) {
          streak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }
    }

    // 3. Punteggi di Oggi
    const todayScores = allUserScores.filter(
      (s) => s.scoreDate.toISOString().split("T")[0] === todayStr
    )

    const userGameScores: Record<Game, number | null> = { Krilion: null, Metazooa: null, Chronophoto: null }
    let krNorm = 0, mzNorm = 0, chNorm = 0
    let gamesPlayedTodayCount = 0

    todayScores.forEach((s) => {
      const g = s.gameId as Game
      userGameScores[g] = s.rawScore
      gamesPlayedTodayCount++
      const norm = calculateNormalizedScore(g, s.rawScore)
      if (g === "Krilion") krNorm = norm
      if (g === "Metazooa") mzNorm = norm
      if (g === "Chronophoto") chNorm = norm
    })

    const hasPlayedToday = gamesPlayedTodayCount > 0
    const todayTotal = hasPlayedToday ? Math.round((krNorm + mzNorm + chNorm) / 3) : null

    // 4. Statistiche per singolo gioco (Migliore, Media, Conteggio)
    const gameStats: Record<Game, UserGameStat> = {
      Krilion: { best: null, average: null, playedCount: 0, todayScore: userGameScores.Krilion },
      Metazooa: { best: null, average: null, playedCount: 0, todayScore: userGameScores.Metazooa },
      Chronophoto: { best: null, average: null, playedCount: 0, todayScore: userGameScores.Chronophoto },
    }

    const gamesList: Game[] = ["Krilion", "Metazooa", "Chronophoto"]

    gamesList.forEach((g) => {
      const gameScores = allUserScores.filter((s) => s.gameId === g).map((s) => s.rawScore)
      if (gameScores.length > 0) {
        const count = gameScores.length
        const sum = gameScores.reduce((acc, curr) => acc + curr, 0)
        const avg = Math.round(sum / count)

        let best: number
        if (g === "Metazooa") {
          best = Math.min(...gameScores) // Minore tentativi è meglio
        } else {
          best = Math.max(...gameScores) // Maggiore punteggio è meglio
        }

        gameStats[g] = {
          best,
          average: avg,
          playedCount: count,
          todayScore: userGameScores[g],
        }
      }
    })

    // 5. Posizione in Classifica
    // Calcoliamo la posizione dell'utente in base alle partite giocate tot
    const userRankings = await prisma.user.findMany({
      select: {
        id: true,
        _count: { select: { dailyScores: true } },
      },
      orderBy: {
        dailyScores: { _count: "desc" },
      },
    })

    const rankIndex = userRankings.findIndex((u) => u.id === userId)
    const rank = rankIndex >= 0 ? `${rankIndex + 1}° Posto in Classifica` : "Classificato"

    return {
      played,
      streak,
      rank,
      todayTotal,
      hasPlayedToday,
      userGameScores,
      gameStats,
    }
  } catch (error) {
    console.error("Errore getUserProfileStats:", error)
    return {
      played: 0,
      streak: 0,
      rank: "N/A",
      todayTotal: null,
      hasPlayedToday: false,
      userGameScores: emptyScores,
      gameStats: emptyGameStats,
    }
  }
}

/**
 * Recupera l'andamento nel tempo (Trend) dell'utente per i grafici
 */
export async function getUserTrend(
  userId: string,
  fromDateStr?: string,
  toDateStr?: string
): Promise<UserTrendItem[]> {
  if (!userId) return []

  try {
    const whereClause: { userId: string; scoreDate?: { gte?: Date; lte?: Date } } = { userId }

    if (fromDateStr || toDateStr) {
      whereClause.scoreDate = {}
      if (fromDateStr) whereClause.scoreDate.gte = new Date(fromDateStr)
      if (toDateStr) {
        const endDate = new Date(toDateStr)
        endDate.setHours(23, 59, 59, 999)
        whereClause.scoreDate.lte = endDate
      }
    }

    const scores = await prisma.dailyScore.findMany({
      where: whereClause,
      orderBy: { scoreDate: "asc" },
    })

    // Raggruppamento per data
    const dateMap = new Map<string, { dateObj: Date; scores: Partial<Record<Game, number>> }>()

    scores.forEach((s) => {
      const dateKey = s.scoreDate.toISOString().split("T")[0]
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, { dateObj: s.scoreDate, scores: {} })
      }
      dateMap.get(dateKey)!.scores[s.gameId as Game] = s.rawScore
    })

    const result: UserTrendItem[] = []

    dateMap.forEach(({ dateObj, scores }, dateStr) => {
      const dayLabel = dateObj.toLocaleDateString("it-IT", { day: "numeric", month: "short" })

      const kr = scores.Krilion ?? null
      const mz = scores.Metazooa ?? null
      const ch = scores.Chronophoto ?? null

      let total: number | null = null
      if (kr !== null || mz !== null || ch !== null) {
        const krNorm = kr !== null ? calculateNormalizedScore("Krilion", kr) : 0
        const mzNorm = mz !== null ? calculateNormalizedScore("Metazooa", mz) : 0
        const chNorm = ch !== null ? calculateNormalizedScore("Chronophoto", ch) : 0
        total = Math.round((krNorm + mzNorm + chNorm) / 3)
      }

      result.push({
        day: dayLabel,
        dateStr,
        Krilion: kr,
        Metazooa: mz,
        Chronophoto: ch,
        Totale: total,
      })
    })

    return result
  } catch (error) {
    console.error("Errore getUserTrend:", error)
    return []
  }
}

/**
 * Recupera lo storico dettagliato delle partite giocate dall'utente
 */
export async function getUserScoreHistory(userId: string, limit = 15): Promise<UserHistoryItem[]> {
  if (!userId) return []

  try {
    const scores = await prisma.dailyScore.findMany({
      where: { userId },
      orderBy: [{ scoreDate: "desc" }, { createdAt: "desc" }],
      take: limit,
    })

    return scores.map((s) => {
      const dateFormatted = s.scoreDate.toLocaleDateString("it-IT", { day: "numeric", month: "short" })
      const timeFormatted = s.createdAt.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })

      return {
        id: s.id,
        game: s.gameId as Game,
        score: s.rawScore,
        date: dateFormatted,
        time: timeFormatted,
      }
    })
  } catch (error) {
    console.error("Errore getUserScoreHistory:", error)
    return []
  }
}
