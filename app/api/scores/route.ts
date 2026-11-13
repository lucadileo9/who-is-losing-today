import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-guard';
import { calculateNormalizedScore, type Game } from '@/lib/game-data';

export async function GET() {
  try {
    const scores = await prisma.dailyScore.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, initials: true, color: true } },
        game: { select: { name: true, unit: true } },
      },
    });
    return NextResponse.json({ scores, source: 'database' });
  } catch (err) {
    console.error('Errore GET /api/scores:', err);
    return NextResponse.json(
      { error: 'Errore durante il recupero dei punteggi' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.success) {
      return NextResponse.json(
        { error: 'Autenticazione richiesta per registrare un punteggio.' },
        { status: 401 }
      );
    }
    const user = auth.user;

    const body = await request.json();
    const { game, score, text } = body;

    if (!game || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Gioco e punteggio numerico sono obbligatori.' },
        { status: 400 }
      );
    }

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const normalizedScore = calculateNormalizedScore(game as Game, score);

    const savedScore = await prisma.dailyScore.upsert({
      where: {
        userId_gameId_scoreDate: {
          userId: user.id,
          gameId: game,
          scoreDate: todayDate,
        },
      },
      update: {
        rawScore: score,
        normalizedScore,
        rawInputText: text || null,
      },
      create: {
        userId: user.id,
        gameId: game,
        scoreDate: todayDate,
        rawScore: score,
        normalizedScore,
        rawInputText: text || null,
      },
    });

    return NextResponse.json(
      { score: savedScore, user: user.name, source: 'database' },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('Errore salvataggio DB /api/scores:', err);
    return NextResponse.json(
      { error: 'Impossibile salvare il punteggio nel database.' },
      { status: 500 }
    );
  }
}
