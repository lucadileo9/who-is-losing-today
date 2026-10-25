import { prisma } from "@/lib/prisma"
import { calculateNormalizedScore, type Game } from "@/lib/game-data"
import { DEFAULT_USER_COLOR } from "@/lib/theme/colors"
import type { UserProfileDTO, UserPersonalTrendPoint } from "@/lib/types/user"

/**
 * Recupera e calcola il profilo completo di un utente per la sua "Gamer Card":
 * - Statistiche trofei (vittorie e cucchiai di legno subiti con >= 2 giocatori)
 * - Streak reale attuale e record di streak
 * - Medie e record per singolo gioco
 * - Serie temporale per il grafico personale a 3 linee
 */
export async function getUserProfile(userId: string): Promise<UserProfileDTO | null> {
  // 1. Trova l'utente con tutti i suoi punteggi ordinati
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      dailyScores: {
        orderBy: { scoreDate: "asc" },
      },
    },
  })

  if (!user) return null

  // 2. Calcola le statistiche per singolo gioco
  const gameStats = {
    krilion: { played: 0, sum: 0, bestScore: 0 },
    metazooa: { played: 0, sum: 0, bestScore: 999 },
    chronophoto: { played: 0, sum: 0, bestScore: 0 },
  }

  // Mappa data -> { krilion, metazooa, chronophoto, totale } per il trend personale
  const personalDateMap = new Map<
    string,
    { kr?: number; mz?: number; ch?: number; krNorm: number; mzNorm: number; chNorm: number }
  >()

  user.dailyScores.forEach((sc) => {
    const dayStr = sc.scoreDate.toISOString().split("T")[0]
    if (!personalDateMap.has(dayStr)) {
      personalDateMap.set(dayStr, { krNorm: 0, mzNorm: 0, chNorm: 0 })
    }
    const dayData = personalDateMap.get(dayStr)!

    const norm = sc.normalizedScore || calculateNormalizedScore(sc.gameId as Game, sc.rawScore)

    if (sc.gameId === "Krilion") {
      gameStats.krilion.played++
      gameStats.krilion.sum += sc.rawScore
      if (sc.rawScore > gameStats.krilion.bestScore) gameStats.krilion.bestScore = sc.rawScore
      dayData.kr = sc.rawScore
      dayData.krNorm = norm
    } else if (sc.gameId === "Metazooa") {
      gameStats.metazooa.played++
      gameStats.metazooa.sum += sc.rawScore
      if (sc.rawScore > 0 && sc.rawScore < gameStats.metazooa.bestScore) gameStats.metazooa.bestScore = sc.rawScore
      dayData.mz = sc.rawScore
      dayData.mzNorm = norm
    } else if (sc.gameId === "Chronophoto") {
      gameStats.chronophoto.played++
      gameStats.chronophoto.sum += sc.rawScore
      if (sc.rawScore > gameStats.chronophoto.bestScore) gameStats.chronophoto.bestScore = sc.rawScore
      dayData.ch = sc.rawScore
      dayData.chNorm = norm
    }
  })

  // Costruisci il trend personale
  const personalTrend: UserPersonalTrendPoint[] = []
  personalDateMap.forEach((val, dayIso) => {
    const d = new Date(dayIso)
    const dayLabel = d.toLocaleDateString("it-IT", { day: "numeric", month: "short" })

    // Formula totale: diviso 3
    const totalDaily = Math.round((val.krNorm + val.mzNorm + val.chNorm) / 3)

    personalTrend.push({
      date: dayLabel,
      krilion: val.kr,
      metazooa: val.mz,
      chronophoto: val.ch,
      totale: totalDaily > 0 ? totalDaily : undefined,
    })
  })

  // 3. Calcolo Streak Reale (Attuale e Record)
  // Estrai date uniche ordinate cronologicamente
  const uniqueDatesDesc = Array.from(personalDateMap.keys()).sort().reverse()

  let currentStreak = 0
  const todayStr = new Date().toISOString().split("T")[0]
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split("T")[0]

  if (uniqueDatesDesc.length > 0) {
    const mostRecentDate = uniqueDatesDesc[0]
    // La streak è attiva se l'utente ha giocato oggi o ieri
    if (mostRecentDate === todayStr || mostRecentDate === yesterdayStr) {
      let checkDate = new Date(mostRecentDate)

      for (const dStr of uniqueDatesDesc) {
        const expectedStr = checkDate.toISOString().split("T")[0]
        if (dStr === expectedStr) {
          currentStreak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }
    }
  }

  // Calcolo streak record storico (massimo consecutivo)
  const uniqueDatesAsc = Array.from(personalDateMap.keys()).sort()
  let maxStreak = 0
  let tempStreak = 0
  let prevDate: Date | null = null

  uniqueDatesAsc.forEach((dStr) => {
    const currDate = new Date(dStr)
    if (!prevDate) {
      tempStreak = 1
    } else {
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24))
      if (diffDays === 1) {
        tempStreak++
      } else if (diffDays > 1) {
        tempStreak = 1
      }
    }
    prevDate = currDate
    if (tempStreak > maxStreak) maxStreak = tempStreak
  })

  // 4. Calcolo Vincite Giornaliere (1°) e Cucchiai di Legno (ultimo con >= 2 giocatori)
  // Legge tutti i punteggi storici raggruppati per data per sapere come si è posizionato l'utente
  const allScores = await prisma.dailyScore.findMany({
    select: {
      userId: true,
      scoreDate: true,
      gameId: true,
      rawScore: true,
      normalizedScore: true,
    },
  })

  // Mappa: DataStr -> Map<UserId, { normScores: Record<Game, number> }>
  const dateTotals = new Map<string, Map<string, { krNorm: number; mzNorm: number; chNorm: number }>>()

  allScores.forEach((sc) => {
    const dayStr = sc.scoreDate.toISOString().split("T")[0]
    if (!dateTotals.has(dayStr)) {
      dateTotals.set(dayStr, new Map())
    }
    const dayUsers = dateTotals.get(dayStr)!
    if (!dayUsers.has(sc.userId)) {
      dayUsers.set(sc.userId, { krNorm: 0, mzNorm: 0, chNorm: 0 })
    }
    const entry = dayUsers.get(sc.userId)!
    const norm = sc.normalizedScore || calculateNormalizedScore(sc.gameId as Game, sc.rawScore)
    if (sc.gameId === "Krilion") entry.krNorm = norm
    if (sc.gameId === "Metazooa") entry.mzNorm = norm
    if (sc.gameId === "Chronophoto") entry.chNorm = norm
  })

  let dailyWinsCount = 0
  let woodenSpoonsCount = 0

  dateTotals.forEach((usersInDay) => {
    // Se l'utente non ha partecipato in questa data, salta
    if (!usersInDay.has(userId)) return

    const totalParticipants = usersInDay.size
    // Calcola il totale giornaliero per ciascun partecipante (diviso 3)
    const rankings = Array.from(usersInDay.entries())
      .map(([uId, scores]) => ({
        userId: uId,
        overall: Math.round((scores.krNorm + scores.mzNorm + scores.chNorm) / 3),
      }))
      .sort((a, b) => b.overall - a.overall)

    if (rankings.length > 0 && rankings[0].userId === userId) {
      dailyWinsCount++
    }

    // REGOLA: Il cucchiaio di legno si assegna SOLO se c'erano almeno 2 partecipanti!
    if (totalParticipants >= 2 && rankings[rankings.length - 1].userId === userId) {
      woodenSpoonsCount++
    }
  })

  return {
    user: {
      id: user.id,
      name: user.name || "Giocatore",
      color: user.color || DEFAULT_USER_COLOR,
      image: user.image,
    },
    role: user.role,
    streak: currentStreak,
    streakRecord: Math.max(maxStreak, currentStreak),
    totalGamesPlayed: user.dailyScores.length,
    woodenSpoonsCount,
    dailyWinsCount,
    statsByGame: {
      krilion: {
        played: gameStats.krilion.played,
        averageScore: gameStats.krilion.played > 0 ? Math.round(gameStats.krilion.sum / gameStats.krilion.played) : 0,
        bestScore: gameStats.krilion.bestScore,
      },
      metazooa: {
        played: gameStats.metazooa.played,
        averageScore:
          gameStats.metazooa.played > 0 ? Number((gameStats.metazooa.sum / gameStats.metazooa.played).toFixed(1)) : 0,
        bestScore: gameStats.metazooa.bestScore === 999 ? 0 : gameStats.metazooa.bestScore,
      },
      chronophoto: {
        played: gameStats.chronophoto.played,
        averageScore:
          gameStats.chronophoto.played > 0 ? Math.round(gameStats.chronophoto.sum / gameStats.chronophoto.played) : 0,
        bestScore: gameStats.chronophoto.bestScore,
      },
    },
    personalTrend,
  }
}
