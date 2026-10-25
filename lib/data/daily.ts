import { prisma } from '@/lib/prisma';
import { calculateNormalizedScore, type Game } from '@/lib/game-data';
import { DEFAULT_GAME_FALLBACKS, DEFAULT_USER_COLOR } from '@/lib/theme/colors';
import type { DailyResultsDTO, DailyPlayerScore } from '@/lib/types/daily';

/**
 * Recupera tutti i risultati di una singola data solare (YYYY-MM-DD).
 * Calcola i punteggi normalizzati per ciascun gioco e per il Totale (diviso sempre per 3).
 * Assegna il primo posto e l'ultimo posto (perdente null se meno di 2 giocatori).
 */
export async function getDailyResults(
  dateStr: string
): Promise<DailyResultsDTO> {
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);

  // 1. Recupera i giochi configurati dal DB per supportare N giochi dinamicamente
  const dbGames = await prisma.game.findMany({
    select: {
      id: true,
      name: true,
      isLowerBetter: true,
      color: true,
    },
  });

  // Fallback centralizzato ai giochi standard nel caso il DB non sia ancora popolato
  const activeGames = dbGames.length > 0 ? dbGames : DEFAULT_GAME_FALLBACKS;
  const totalGamesCount = activeGames.length;

  // 2. Singola query mirata per scoreDate (PostgreSQL @db.Date ignora le ore)
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
  });

  // Mappa temporanea per aggregare i giochi dinamici per ciascun utente
  const userMap = new Map<
    string,
    {
      user: { id: string; name: string; color: string; image?: string | null };
      rawScores: Record<string, number>;
      normScores: Record<string, number>;
    }
  >();

  scores.forEach((sc) => {
    const userId = sc.userId;
    if (!userMap.has(userId)) {
      const initialRaw: Record<string, number> = {};
      const initialNorm: Record<string, number> = {};
      activeGames.forEach((g) => {
        initialRaw[g.id] = 0;
        initialNorm[g.id] = 0;
      });

      userMap.set(userId, {
        user: {
          id: sc.user.id,
          name: sc.user.name || 'Giocatore',
          color: sc.user.color || DEFAULT_USER_COLOR,
          image: sc.user.image,
        },
        rawScores: initialRaw,
        normScores: initialNorm,
      });
    }

    const userData = userMap.get(userId)!;
    userData.rawScores[sc.gameId] = sc.rawScore;
    userData.normScores[sc.gameId] =
      sc.normalizedScore ||
      calculateNormalizedScore(sc.gameId as Game, sc.rawScore);
  });

  const usersList = Array.from(userMap.values());
  const totalPlayers = usersList.length;

  // Helper per ordinare una classifica e assegnare rank 1, 2, 3...
  const sortAndRank = (
    items: {
      user: { id: string; name: string; color: string; image?: string | null };
      rawScore: number;
      normalizedScore: number;
    }[],
    isLowerBetter = false
  ): DailyPlayerScore[] => {
    const sorted = [...items].sort((a, b) => {
      if (isLowerBetter) {
        // Se a = 0 (non giocato), finisce in fondo
        if (a.rawScore === 0) return 1;
        if (b.rawScore === 0) return -1;
        return a.rawScore - b.rawScore;
      }
      return b.normalizedScore - a.normalizedScore;
    });

    return sorted.map((item, idx) => ({
      user: item.user,
      rawScore: item.rawScore,
      normalizedScore: item.normalizedScore,
      rank: idx + 1,
    }));
  };

  // 3. Costruzione dinamica delle classifiche per ciascun gioco configurato
  const byGame: Record<string, DailyPlayerScore[]> = {};

  activeGames.forEach((g) => {
    byGame[g.id] = sortAndRank(
      usersList
        .filter((u) => (u.rawScores[g.id] ?? 0) > 0)
        .map((u) => ({
          user: u.user,
          rawScore: u.rawScores[g.id] ?? 0,
          normalizedScore: u.normScores[g.id] ?? 0,
        })),
      g.isLowerBetter
    );
  });

  // 4. Classifica Totale Giornaliera: REGOLA: divisa per il numero totale di giochi attivi! Chi non gioca prende 0.
  const totalePlayers = sortAndRank(
    usersList.map((u) => {
      let sumNorm = 0;
      activeGames.forEach((g) => {
        sumNorm += u.normScores[g.id] ?? 0;
      });
      const overallNorm = Math.round(sumNorm / totalGamesCount);
      return {
        user: u.user,
        rawScore: overallNorm, // Nel totale, raw e norm coincidono con la media ponderata
        normalizedScore: overallNorm,
      };
    })
  );

  // Determinazione vincente e perdente del giorno
  const winner = totalePlayers.length > 0 ? totalePlayers[0] : null;
  // REGOLA: Il perdente si assegna SOLO se hanno giocato almeno in 2
  const loser =
    totalPlayers >= 2 ? totalePlayers[totalePlayers.length - 1] : null;

  return {
    date: dateStr,
    totalPlayers,
    winner,
    loser,
    rankings: {
      totale: totalePlayers,
      byGame,
      krilion: byGame['Krilion'] || [],
      metazooa: byGame['Metazooa'] || [],
      chronophoto: byGame['Chronophoto'] || [],
    },
  };
}
