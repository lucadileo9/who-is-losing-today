import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { calculateNormalizedScore, type Game } from '@/lib/game-data';
import { DEFAULT_USER_COLOR } from '@/lib/theme/colors';
import type {
  UserProfileDTO,
  UserPersonalTrendPoint,
  ScoreRecord,
} from '@/lib/types/user';

/**
 * Calcola vittorie giornaliere (1°) e cucchiai di legno (ultimo con >= 2 giocatori)
 * per ciascun utente analizzando tutti i punteggi storici in un solo passaggio.
 */
function computeTrophies(allScores: ScoreRecord[]): {
  winsMap: Map<string, number>;
  spoonsMap: Map<string, number>;
} {
  const dateTotals = new Map<
    string,
    Map<string, { krNorm: number; mzNorm: number; chNorm: number }>
  >();

  allScores.forEach((sc) => {
    const dayStr = sc.scoreDate.toISOString().split('T')[0];
    if (!dateTotals.has(dayStr)) {
      dateTotals.set(dayStr, new Map());
    }
    const dayUsers = dateTotals.get(dayStr)!;
    if (!dayUsers.has(sc.userId)) {
      dayUsers.set(sc.userId, { krNorm: 0, mzNorm: 0, chNorm: 0 });
    }
    const entry = dayUsers.get(sc.userId)!;
    const norm =
      sc.normalizedScore ||
      calculateNormalizedScore(sc.gameId as Game, sc.rawScore);
    if (sc.gameId === 'Krilion') entry.krNorm = norm;
    if (sc.gameId === 'Metazooa') entry.mzNorm = norm;
    if (sc.gameId === 'Chronophoto') entry.chNorm = norm;
  });

  const winsMap = new Map<string, number>();
  const spoonsMap = new Map<string, number>();

  dateTotals.forEach((usersInDay) => {
    const totalParticipants = usersInDay.size;
    const rankings = Array.from(usersInDay.entries())
      .map(([uId, scores]) => ({
        userId: uId,
        overall: Math.round(
          (scores.krNorm + scores.mzNorm + scores.chNorm) / 3
        ),
      }))
      .sort((a, b) => b.overall - a.overall);

    if (rankings.length > 0) {
      const winnerId = rankings[0].userId;
      winsMap.set(winnerId, (winsMap.get(winnerId) || 0) + 1);
    }

    if (totalParticipants >= 2) {
      const lastId = rankings[rankings.length - 1].userId;
      spoonsMap.set(lastId, (spoonsMap.get(lastId) || 0) + 1);
    }
  });

  return { winsMap, spoonsMap };
}

/**
 * Calcola statistiche per gioco, trend personale e streak di un utente
 * a partire dai suoi dailyScores in memoria.
 */
function computeUserStatsAndStreaks(
  dailyScores: Array<{
    scoreDate: Date;
    gameId: string;
    rawScore: number;
    normalizedScore: number | null;
  }>
) {
  const gameStats = {
    krilion: { played: 0, sum: 0, bestScore: 0 },
    metazooa: { played: 0, sum: 0, bestScore: 999 },
    chronophoto: { played: 0, sum: 0, bestScore: 0 },
  };

  const personalDateMap = new Map<
    string,
    {
      kr?: number;
      mz?: number;
      ch?: number;
      krNorm: number;
      mzNorm: number;
      chNorm: number;
    }
  >();

  dailyScores.forEach((sc) => {
    const dayStr = sc.scoreDate.toISOString().split('T')[0];
    if (!personalDateMap.has(dayStr)) {
      personalDateMap.set(dayStr, { krNorm: 0, mzNorm: 0, chNorm: 0 });
    }
    const dayData = personalDateMap.get(dayStr)!;

    const norm =
      sc.normalizedScore ||
      calculateNormalizedScore(sc.gameId as Game, sc.rawScore);

    if (sc.gameId === 'Krilion') {
      gameStats.krilion.played++;
      gameStats.krilion.sum += sc.rawScore;
      if (sc.rawScore > gameStats.krilion.bestScore)
        gameStats.krilion.bestScore = sc.rawScore;
      dayData.kr = sc.rawScore;
      dayData.krNorm = norm;
    } else if (sc.gameId === 'Metazooa') {
      gameStats.metazooa.played++;
      gameStats.metazooa.sum += sc.rawScore;
      if (sc.rawScore > 0 && sc.rawScore < gameStats.metazooa.bestScore)
        gameStats.metazooa.bestScore = sc.rawScore;
      dayData.mz = sc.rawScore;
      dayData.mzNorm = norm;
    } else if (sc.gameId === 'Chronophoto') {
      gameStats.chronophoto.played++;
      gameStats.chronophoto.sum += sc.rawScore;
      if (sc.rawScore > gameStats.chronophoto.bestScore)
        gameStats.chronophoto.bestScore = sc.rawScore;
      dayData.ch = sc.rawScore;
      dayData.chNorm = norm;
    }
  });

  const personalTrend: UserPersonalTrendPoint[] = [];
  personalDateMap.forEach((val, dayIso) => {
    const d = new Date(dayIso);
    const dayLabel = d.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
    });
    const totalDaily = Math.round((val.krNorm + val.mzNorm + val.chNorm) / 3);

    personalTrend.push({
      date: dayLabel,
      krilion: val.kr,
      metazooa: val.mz,
      chronophoto: val.ch,
      totale: totalDaily > 0 ? totalDaily : undefined,
    });
  });

  const uniqueDatesDesc = Array.from(personalDateMap.keys()).sort().reverse();
  let currentStreak = 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (uniqueDatesDesc.length > 0) {
    const mostRecentDate = uniqueDatesDesc[0];
    if (mostRecentDate === todayStr || mostRecentDate === yesterdayStr) {
      const checkDate = new Date(mostRecentDate);
      for (const dStr of uniqueDatesDesc) {
        const expectedStr = checkDate.toISOString().split('T')[0];
        if (dStr === expectedStr) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }

  const uniqueDatesAsc = Array.from(personalDateMap.keys()).sort();
  let maxStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  uniqueDatesAsc.forEach((dStr) => {
    const currDate = new Date(dStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24)
      );
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    prevDate = currDate;
    if (tempStreak > maxStreak) maxStreak = tempStreak;
  });

  return {
    gameStats,
    personalTrend,
    currentStreak,
    maxStreak,
  };
}

/**
 * Assembla il DTO del profilo utente combinando le statistiche in memoria con i trofei calcolati.
 */
function buildUserProfileDTO(
  user: {
    id: string;
    name: string | null;
    color: string | null;
    image: string | null;
    role: Role;
    dailyScores: Array<{
      scoreDate: Date;
      gameId: string;
      rawScore: number;
      normalizedScore: number | null;
    }>;
  },
  dailyWinsCount: number,
  woodenSpoonsCount: number
): UserProfileDTO {
  const { gameStats, personalTrend, currentStreak, maxStreak } =
    computeUserStatsAndStreaks(user.dailyScores);

  return {
    user: {
      id: user.id,
      name: user.name || 'Giocatore',
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
        averageScore:
          gameStats.krilion.played > 0
            ? Math.round(gameStats.krilion.sum / gameStats.krilion.played)
            : 0,
        bestScore: gameStats.krilion.bestScore,
      },
      metazooa: {
        played: gameStats.metazooa.played,
        averageScore:
          gameStats.metazooa.played > 0
            ? Number(
                (gameStats.metazooa.sum / gameStats.metazooa.played).toFixed(1)
              )
            : 0,
        bestScore:
          gameStats.metazooa.bestScore === 999
            ? 0
            : gameStats.metazooa.bestScore,
      },
      chronophoto: {
        played: gameStats.chronophoto.played,
        averageScore:
          gameStats.chronophoto.played > 0
            ? Math.round(
                gameStats.chronophoto.sum / gameStats.chronophoto.played
              )
            : 0,
        bestScore: gameStats.chronophoto.bestScore,
      },
    },
    personalTrend,
  };
}

/**
 * Recupera e calcola il profilo completo di un utente per la sua "Gamer Card":
 * - Statistiche trofei (vittorie e cucchiai di legno subiti con >= 2 giocatori)
 * - Streak reale attuale e record di streak
 * - Medie e record per singolo gioco
 * - Serie temporale per il grafico personale a 3 linee
 */
export async function getUserProfile(
  userId: string
): Promise<UserProfileDTO | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      dailyScores: {
        orderBy: { scoreDate: 'asc' },
      },
    },
  });

  if (!user) return null;

  // Calcolo performante direttamente su PostgreSQL (Soluzione B)
  // Calcola vittorie e cucchiai di legno aggregati sul motore DB senza caricare dati storici in Node.js
  const trophyResult = await prisma.$queryRaw<
    Array<{ dailyWinsCount: number; woodenSpoonsCount: number }>
  >`
    WITH user_daily_totals AS (
      SELECT
        "userId",
        "scoreDate",
        ROUND(SUM("normalizedScore")::numeric / 3.0) AS overall
      FROM "daily_scores"
      GROUP BY "userId", "scoreDate"
    ),
    ranked_days AS (
      SELECT
        "userId",
        "scoreDate",
        ROW_NUMBER() OVER (PARTITION BY "scoreDate" ORDER BY overall DESC) as rank_desc,
        ROW_NUMBER() OVER (PARTITION BY "scoreDate" ORDER BY overall ASC) as rank_asc,
        COUNT(*) OVER (PARTITION BY "scoreDate") as total_participants
      FROM user_daily_totals
    )
    SELECT
      COALESCE(COUNT(*) FILTER (WHERE rank_desc = 1), 0)::int AS "dailyWinsCount",
      COALESCE(COUNT(*) FILTER (WHERE rank_asc = 1 AND total_participants >= 2), 0)::int AS "woodenSpoonsCount"
    FROM ranked_days
    WHERE "userId" = ${userId};
  `;

  const dailyWinsCount = trophyResult[0]?.dailyWinsCount ?? 0;
  const woodenSpoonsCount = trophyResult[0]?.woodenSpoonsCount ?? 0;

  return buildUserProfileDTO(user, dailyWinsCount, woodenSpoonsCount);
}

/**
 * Recupera l'elenco completo di tutti i giocatori registrati con le loro statistiche e profili
 * in una sola query al database, eliminando il problema N+1.
 */
export async function getAllPlayers(): Promise<UserProfileDTO[]> {
  const users = await prisma.user.findMany({
    include: {
      dailyScores: {
        orderBy: { scoreDate: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  });

  const allScores = users.flatMap((u) =>
    u.dailyScores.map((s) => ({
      userId: u.id,
      scoreDate: s.scoreDate,
      gameId: s.gameId,
      rawScore: s.rawScore,
      normalizedScore: s.normalizedScore,
    }))
  );

  const { winsMap, spoonsMap } = computeTrophies(allScores);

  return users.map((u) =>
    buildUserProfileDTO(
      u,
      winsMap.get(u.id) || 0,
      spoonsMap.get(u.id) || 0
    )
  );
}
