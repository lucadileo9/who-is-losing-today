import { prisma } from '@/lib/prisma';
import { calculateNormalizedScore, type Game } from '@/lib/game-data';
import { DEFAULT_USER_COLOR } from '@/lib/theme/colors';
import type { HallOfFameDTO, AllTimeRecordItem } from '@/lib/types/period';

/**
 * Recupera i record assoluti di sempre (Hall of Fame) per ciascun gioco e per il Totale.
 */
export async function getHallOfFame(): Promise<HallOfFameDTO> {
  // 1. Record Krilion (Punteggio più alto)
  const bestKrilion = await prisma.dailyScore.findFirst({
    where: { gameId: 'Krilion' },
    orderBy: { rawScore: 'desc' },
    include: {
      user: { select: { id: true, name: true, color: true, image: true } },
    },
  });

  // 2. Record Metazooa (Minor numero di tentativi > 0)
  const bestMetazooa = await prisma.dailyScore.findFirst({
    where: {
      gameId: 'Metazooa',
      rawScore: { gt: 0 },
    },
    orderBy: { rawScore: 'asc' },
    include: {
      user: { select: { id: true, name: true, color: true, image: true } },
    },
  });

  // 3. Record Chronophoto (Punteggio più alto)
  const bestChronophoto = await prisma.dailyScore.findFirst({
    where: { gameId: 'Chronophoto' },
    orderBy: { rawScore: 'desc' },
    include: {
      user: { select: { id: true, name: true, color: true, image: true } },
    },
  });

  // 4. Record Totale Giornaliero di sempre:
  // Seleziona solo i campi essenziali senza JOIN pesanti con User su tutta la tabella
  const allScores = await prisma.dailyScore.findMany({
    select: {
      userId: true,
      scoreDate: true,
      gameId: true,
      rawScore: true,
      normalizedScore: true,
    },
  });

  // Mappa: `userId_scoreDate` -> { userId, date, krNorm, mzNorm, chNorm }
  const dailyUserTotals = new Map<
    string,
    {
      userId: string;
      date: string;
      krNorm: number;
      mzNorm: number;
      chNorm: number;
    }
  >();

  allScores.forEach((sc) => {
    const dayStr = sc.scoreDate.toISOString().split('T')[0];
    const key = `${sc.userId}_${dayStr}`;

    if (!dailyUserTotals.has(key)) {
      dailyUserTotals.set(key, {
        userId: sc.userId,
        date: dayStr,
        krNorm: 0,
        mzNorm: 0,
        chNorm: 0,
      });
    }

    const item = dailyUserTotals.get(key)!;
    const norm =
      sc.normalizedScore ||
      calculateNormalizedScore(sc.gameId as Game, sc.rawScore);
    if (sc.gameId === 'Krilion') item.krNorm = norm;
    if (sc.gameId === 'Metazooa') item.mzNorm = norm;
    if (sc.gameId === 'Chronophoto') item.chNorm = norm;
  });

  let bestTotaleScore = 0;
  let bestTotaleDate = '';
  let bestUserId = '';

  dailyUserTotals.forEach((entry) => {
    // Formula ufficiale totale: diviso 3
    const avg = Math.round((entry.krNorm + entry.mzNorm + entry.chNorm) / 3);
    if (avg > bestTotaleScore) {
      bestTotaleScore = avg;
      bestTotaleDate = entry.date;
      bestUserId = entry.userId;
    }
  });

  let bestTotaleHolder: AllTimeRecordItem | null = null;
  if (bestUserId) {
    // Recupera i dati anagrafici una sola volta per il singolo utente record
    const bestUser = await prisma.user.findUnique({
      where: { id: bestUserId },
      select: { id: true, name: true, color: true, image: true },
    });

    if (bestUser) {
      bestTotaleHolder = {
        gameId: 'Totale',
        score: bestTotaleScore,
        unit: 'pt',
        date: bestTotaleDate,
        holder: {
          id: bestUser.id,
          name: bestUser.name || 'Giocatore',
          color: bestUser.color || DEFAULT_USER_COLOR,
          image: bestUser.image,
        },
      };
    }
  }

  const krilionRecord = bestKrilion
    ? {
        gameId: 'Krilion',
        score: bestKrilion.rawScore,
        unit: 'pts',
        date: bestKrilion.scoreDate.toISOString().split('T')[0],
        holder: {
          id: bestKrilion.user.id,
          name: bestKrilion.user.name || 'Giocatore',
          color: bestKrilion.user.color || DEFAULT_USER_COLOR,
          image: bestKrilion.user.image,
        },
      }
    : null;

  const metazooaRecord = bestMetazooa
    ? {
        gameId: 'Metazooa',
        score: bestMetazooa.rawScore,
        unit: 'tentativi',
        date: bestMetazooa.scoreDate.toISOString().split('T')[0],
        holder: {
          id: bestMetazooa.user.id,
          name: bestMetazooa.user.name || 'Giocatore',
          color: bestMetazooa.user.color || DEFAULT_USER_COLOR,
          image: bestMetazooa.user.image,
        },
      }
    : null;

  const chronophotoRecord = bestChronophoto
    ? {
        gameId: 'Chronophoto',
        score: bestChronophoto.rawScore,
        unit: 'pts',
        date: bestChronophoto.scoreDate.toISOString().split('T')[0],
        holder: {
          id: bestChronophoto.user.id,
          name: bestChronophoto.user.name || 'Giocatore',
          color: bestChronophoto.user.color || DEFAULT_USER_COLOR,
          image: bestChronophoto.user.image,
        },
      }
    : null;

  const byGame: Record<string, AllTimeRecordItem> = {};
  if (krilionRecord) byGame['Krilion'] = krilionRecord;
  if (metazooaRecord) byGame['Metazooa'] = metazooaRecord;
  if (chronophotoRecord) byGame['Chronophoto'] = chronophotoRecord;

  return {
    totale: bestTotaleHolder,
    byGame,
    krilion: krilionRecord,
    metazooa: metazooaRecord,
    chronophoto: chronophotoRecord,
  };
}
