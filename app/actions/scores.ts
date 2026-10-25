'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-guard';
import { submitScoreSchema } from '@/lib/validations/scores';
import { calculateNormalizedScore, type Game } from '@/lib/game-data';

export async function submitScoreAction(formData: unknown) {
  try {
    // 1. Controllo Autenticazione Centralizzato
    const auth = await getAuthenticatedUser();
    if (!auth.success) {
      return { success: false, error: auth.error };
    }
    const user = auth.user;

    // 2. Validazione Zod
    const parsed = submitScoreSchema.safeParse(formData);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((i) => i.message).join(', ');
      return { success: false, error: msg || 'Dati non validi.' };
    }

    const { gameId, rawScore, scoreDate, rawInputText } = parsed.data;

    // 4. Calcolo punteggio normalizzato
    const normalizedScore = calculateNormalizedScore(gameId as Game, rawScore);
    const targetDate = new Date(scoreDate);
    targetDate.setHours(0, 0, 0, 0);

    // 5. Upsert su PostgreSQL con @db.Date per evitare duplicati
    const saved = await prisma.dailyScore.upsert({
      where: {
        userId_gameId_scoreDate: {
          userId: user.id,
          gameId,
          scoreDate: targetDate,
        },
      },
      update: {
        rawScore,
        normalizedScore,
        rawInputText,
      },
      create: {
        userId: user.id,
        gameId,
        rawScore,
        normalizedScore,
        scoreDate: targetDate,
        rawInputText,
      },
    });

    // 6. Invalida le cache di Next.js per aggiornare istantaneamente la dashboard e il profilo
    revalidatePath('/dashboard');
    revalidatePath('/profile');
    revalidatePath(`/profile/${user.id}`);

    return { success: true, scoreId: saved.id };
  } catch (error) {
    console.error('Errore submitScoreAction:', error);
    return {
      success: false,
      error: 'Errore durante il salvataggio del punteggio.',
    };
  }
}
