import { prisma } from "@/lib/prisma"
import { type Game, type LeaderboardTab, calculateNormalizedScore } from "@/lib/game-data"

export interface DbPlayer {
  id: string
  name: string
  initials: string
  color: string
  scores: Record<Game, number>
  streak: number
  played: number
}

export interface DbTrendData {
  [key: string]: { day: string; [key: string]: string | number }[]
}

/**
 * Recupera i giocatori dal database con i punteggi reali più recenti
 */
export async function getPlayersFromDb(): Promise<DbPlayer[]> {
  try {
    const users = await prisma.user.findMany({
      include: {
        dailyScores: {
          orderBy: { scoreDate: "desc" },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    return users.map((user) => {
      const scores: Record<Game, number> = {
        Krilion: 0,
        Metazooa: 0,
        Chronophoto: 0,
      }

      // Estrae il punteggio più recente per ogni gioco
      user.dailyScores.forEach((ds) => {
        const gameKey = ds.gameId as Game
        if (gameKey in scores && scores[gameKey] === 0) {
          scores[gameKey] = ds.rawScore
        }
      })

      // Conteggia le partite totali giocate da questo utente
      const playedCount = user.dailyScores.length

      // BUG-01 FIX: Calcola la streak reale (giorni consecutivi a ritroso)
      const uniqueDates = Array.from(
        new Set(user.dailyScores.map((s) => s.scoreDate.toISOString().split("T")[0]))
      ).sort().reverse()

      let streak = 0
      const todayStr = new Date().toISOString().split("T")[0]
      const yesterdayDate = new Date()
      yesterdayDate.setDate(yesterdayDate.getDate() - 1)
      const yesterdayStr = yesterdayDate.toISOString().split("T")[0]

      const startDate = uniqueDates.includes(todayStr)
        ? new Date(todayStr)
        : uniqueDates.includes(yesterdayStr)
        ? new Date(yesterdayStr)
        : null

      if (startDate) {
        const cursor = new Date(startDate)
        while (true) {
          const curStr = cursor.toISOString().split("T")[0]
          if (uniqueDates.includes(curStr)) {
            streak++
            cursor.setDate(cursor.getDate() - 1)
          } else {
            break
          }
        }
      }

      return {
        id: user.id,
        name: user.name || "Giocatore",
        initials: user.initials || "U",
        color: user.color || "bg-chart-1",
        scores,
        streak,
        played: playedCount,
      }
    })
  } catch (error) {
    console.error("Errore getPlayersFromDb:", error)
    return []
  }
}

/**
 * Recupera lo storico dei punteggi per ciascun giocatore raggruppato per data (per i grafici del gruppo)
 */
export async function getGroupPlayerTrendFromDb(): Promise<Record<LeaderboardTab, { day: string; [key: string]: string | number }[]>> {
  try {
    const allScores = await prisma.dailyScore.findMany({
      include: {
        user: { select: { name: true } },
      },
      orderBy: { scoreDate: "asc" },
    })

    // Raggruppa per data (YYYY-MM-DD o formato "DD mmm")
    const dateMap = new Map<string, Map<string, Record<Game, number>>>()

    allScores.forEach((sc) => {
      const dayLabel = sc.scoreDate.toLocaleDateString("it-IT", { day: "numeric", month: "short" })
      const userName = sc.user.name || "Utente"

      if (!dateMap.has(dayLabel)) {
        dateMap.set(dayLabel, new Map())
      }
      const dayUsers = dateMap.get(dayLabel)!
      if (!dayUsers.has(userName)) {
        dayUsers.set(userName, { Krilion: 0, Metazooa: 0, Chronophoto: 0 })
      }

      const userScores = dayUsers.get(userName)!
      if (sc.gameId in userScores) {
        userScores[sc.gameId as Game] = sc.rawScore
      }
    })

    const result: Record<LeaderboardTab, { day: string; [key: string]: string | number }[]> = {
      Totale: [],
      Krilion: [],
      Metazooa: [],
      Chronophoto: [],
    }

    dateMap.forEach((userMap, dayLabel) => {
      const totaleRow: { day: string; [key: string]: string | number } = { day: dayLabel }
      const krilionRow: { day: string; [key: string]: string | number } = { day: dayLabel }
      const metazooaRow: { day: string; [key: string]: string | number } = { day: dayLabel }
      const chronophotoRow: { day: string; [key: string]: string | number } = { day: dayLabel }

      userMap.forEach((scores, userName) => {
        const gamesPlayed = (scores.Krilion > 0 ? 1 : 0) + (scores.Metazooa > 0 ? 1 : 0) + (scores.Chronophoto > 0 ? 1 : 0)
        const krNorm = calculateNormalizedScore("Krilion", scores.Krilion)
        const mzNorm = calculateNormalizedScore("Metazooa", scores.Metazooa)
        const chNorm = calculateNormalizedScore("Chronophoto", scores.Chronophoto)
        // BUG-03 FIX: dividi per i giochi effettivamente giocati, non sempre per 3
        const overall = gamesPlayed > 0 ? Math.round((krNorm + mzNorm + chNorm) / gamesPlayed) : 0

        totaleRow[userName] = overall
        krilionRow[userName] = scores.Krilion
        metazooaRow[userName] = scores.Metazooa
        chronophotoRow[userName] = scores.Chronophoto
      })

      result.Totale.push(totaleRow)
      result.Krilion.push(krilionRow)
      result.Metazooa.push(metazooaRow)
      result.Chronophoto.push(chronophotoRow)
    })

    return result
  } catch (error) {
    console.error("Errore getGroupPlayerTrendFromDb:", error)
    return { Totale: [], Krilion: [], Metazooa: [], Chronophoto: [] }
  }
}

/**
 * Recupera i dati di riepilogo del giorno (Perdente e Classifica) per una data specifica
 */
export async function getDailySummaryFromDb(selectedDateStr: string) {
  try {
    const selectedDate = new Date(selectedDateStr)
    selectedDate.setHours(0, 0, 0, 0)

    const scoresForDate = await prisma.dailyScore.findMany({
      where: {
        scoreDate: selectedDate,
      },
      include: {
        user: { select: { id: true, name: true, initials: true, color: true } },
      },
    })

    // Raggruppa i punteggi per utente
    const userScoresMap = new Map<string, { user: { id: string; name: string; initials: string; color: string }; scores: Record<Game, number> }>()

    scoresForDate.forEach((sc) => {
      const u = sc.user
      if (!userScoresMap.has(u.id)) {
        userScoresMap.set(u.id, {
          user: { id: u.id, name: u.name || "Utente", initials: u.initials || "U", color: u.color || "bg-chart-1" },
          scores: { Krilion: 0, Metazooa: 0, Chronophoto: 0 },
        })
      }
      const entry = userScoresMap.get(u.id)!
      if (sc.gameId in entry.scores) {
        entry.scores[sc.gameId as Game] = sc.rawScore
      }
    })

    const ranked = Array.from(userScoresMap.values()).map(({ user, scores }) => {
      const gamesPlayed = (scores.Krilion > 0 ? 1 : 0) + (scores.Metazooa > 0 ? 1 : 0) + (scores.Chronophoto > 0 ? 1 : 0)
      const kr = calculateNormalizedScore("Krilion", scores.Krilion)
      const mz = calculateNormalizedScore("Metazooa", scores.Metazooa)
      const ch = calculateNormalizedScore("Chronophoto", scores.Chronophoto)
      // BUG-03 FIX: dividi per i giochi effettivamente giocati, non sempre per 3
      const total = gamesPlayed > 0 ? Math.round((kr + mz + ch) / gamesPlayed) : 0
      return {
        ...user,
        scores,
        overallScore: total,
      }
    })

    ranked.sort((a, b) => b.overallScore - a.overallScore)

    return {
      ranked,
      winner: ranked[0] || null,
      loser: ranked.length > 0 ? ranked[ranked.length - 1] : null,
    }
  } catch (error) {
    console.error("Errore getDailySummaryFromDb:", error)
    return { ranked: [], winner: null, loser: null }
  }
}
