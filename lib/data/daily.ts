import { prisma } from "@/lib/prisma"
import { calculateNormalizedScore, type Game } from "@/lib/game-data"
import type { DailyResultsDTO, DailyPlayerScore } from "@/lib/types/daily"

/**
 * Recupera tutti i risultati di una singola data solare (YYYY-MM-DD).
 * Calcola i punteggi normalizzati per ciascun gioco e per il Totale (diviso sempre per 3).
 * Assegna il primo posto e l'ultimo posto (perdente null se meno di 2 giocatori).
 */
export async function getDailyResults(dateStr: string): Promise<DailyResultsDTO> {
  const targetDate = new Date(dateStr)
  targetDate.setHours(0, 0, 0, 0)

  // 1. Singola query mirata per scoreDate (PostgreSQL @db.Date ignora le ore)
  const scores = await prisma.dailyScore.findMany({
    where: {
      scoreDate: targetDate,
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
  })

  // Mappa temporanea per aggregare i 3 giochi per ciascun utente
  const userMap = new Map<
    string,
    {
      user: { id: string; name: string; color: string; image?: string | null }
      rawScores: Record<Game, number>
      normScores: Record<Game, number>
    }
  >()

  scores.forEach((sc) => {
    const userId = sc.userId
    if (!userMap.has(userId)) {
      userMap.set(userId, {
        user: {
          id: sc.user.id,
          name: sc.user.name || "Giocatore",
          color: sc.user.color || "#3b82f6",
          image: sc.user.image,
        },
        rawScores: { Krilion: 0, Metazooa: 0, Chronophoto: 0 },
        normScores: { Krilion: 0, Metazooa: 0, Chronophoto: 0 },
      })
    }

    const userData = userMap.get(userId)!
    const gameKey = sc.gameId as Game
    if (gameKey in userData.rawScores) {
      userData.rawScores[gameKey] = sc.rawScore
      userData.normScores[gameKey] = sc.normalizedScore || calculateNormalizedScore(gameKey, sc.rawScore)
    }
  })

  const usersList = Array.from(userMap.values())
  const totalPlayers = usersList.length

  // Helper per ordinare una classifica e assegnare rank 1, 2, 3...
  const sortAndRank = (
    items: { user: { id: string; name: string; color: string; image?: string | null }; rawScore: number; normalizedScore: number }[],
    isLowerBetter = false
  ): DailyPlayerScore[] => {
    const sorted = [...items].sort((a, b) => {
      if (isLowerBetter) {
        // Se a = 0 (non giocato), finisce in fondo
        if (a.rawScore === 0) return 1
        if (b.rawScore === 0) return -1
        return a.rawScore - b.rawScore
      }
      return b.normalizedScore - a.normalizedScore
    })

    return sorted.map((item, idx) => ({
      user: item.user,
      rawScore: item.rawScore,
      normalizedScore: item.normalizedScore,
      rank: idx + 1,
    }))
  }

  // 1. Classifica Krilion
  const krilionPlayers = sortAndRank(
    usersList
      .filter((u) => u.rawScores.Krilion > 0)
      .map((u) => ({
        user: u.user,
        rawScore: u.rawScores.Krilion,
        normalizedScore: u.normScores.Krilion,
      }))
  )

  // 2. Classifica Metazooa (meno tentativi = migliore)
  const metazooaPlayers = sortAndRank(
    usersList
      .filter((u) => u.rawScores.Metazooa > 0)
      .map((u) => ({
        user: u.user,
        rawScore: u.rawScores.Metazooa,
        normalizedScore: u.normScores.Metazooa,
      })),
    true
  )

  // 3. Classifica Chronophoto
  const chronophotoPlayers = sortAndRank(
    usersList
      .filter((u) => u.rawScores.Chronophoto > 0)
      .map((u) => ({
        user: u.user,
        rawScore: u.rawScores.Chronophoto,
        normalizedScore: u.normScores.Chronophoto,
      }))
  )

  // 4. Classifica Totale Giornaliera: REGOLA: sempre divisa per 3! Chi non gioca prende 0.
  const totalePlayers = sortAndRank(
    usersList.map((u) => {
      const overallNorm = Math.round(
        (u.normScores.Krilion + u.normScores.Metazooa + u.normScores.Chronophoto) / 3
      )
      return {
        user: u.user,
        rawScore: overallNorm, // Nel totale, raw e norm coincidono con la media ponderata
        normalizedScore: overallNorm,
      }
    })
  )

  // Determinazione vincente e perdente del giorno
  const winner = totalePlayers.length > 0 ? totalePlayers[0] : null
  // REGOLA: Il perdente si assegna SOLO se hanno giocato almeno in 2
  const loser = totalPlayers >= 2 ? totalePlayers[totalePlayers.length - 1] : null

  return {
    date: dateStr,
    totalPlayers,
    winner,
    loser,
    rankings: {
      totale: totalePlayers,
      krilion: krilionPlayers,
      metazooa: metazooaPlayers,
      chronophoto: chronophotoPlayers,
    },
  }
}
