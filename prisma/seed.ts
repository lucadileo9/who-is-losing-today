import { PrismaClient } from '@prisma/client';

type GameId = 'Krilion' | 'Metazooa' | 'Chronophoto';

function calculateNormalizedScore(game: GameId, score: number): number {
  if (game === 'Metazooa') {
    if (score <= 0 || score > 20) return 0;
    return Math.max(0, Math.min(1000, Math.round(((20 - score) / 19) * 1000)));
  }
  if (game === 'Chronophoto') {
    return Math.max(0, Math.min(1000, Math.round((score / 5000) * 1000)));
  }
  if (game === 'Krilion') {
    return Math.max(0, Math.min(1000, Math.round((score / 700) * 1000)));
  }
  return Math.min(1000, score);
}

const prisma = new PrismaClient();

async function main() {
  console.log('[SEED] Avvio popolamento base del database...');

  // 1. Inserimento / Aggiornamento dei Giochi
  const games = [
    {
      id: 'Krilion',
      name: 'Krilion',
      shortName: 'KR',
      unit: 'pts',
      isLowerBetter: false,
    },
    {
      id: 'Metazooa',
      name: 'Metazooa',
      shortName: 'MZ',
      unit: 'tentativi',
      isLowerBetter: true,
    },
    {
      id: 'Chronophoto',
      name: 'Chronophoto',
      shortName: 'CH',
      unit: 'pts',
      isLowerBetter: false,
    },
  ];

  for (const game of games) {
    await prisma.game.upsert({
      where: { id: game.id },
      update: game,
      create: game,
    });
    console.log(`[OK] Gioco configurato: ${game.name} (${game.shortName})`);
  }

  // Verifica se popolare anche i dati di test (solo in locale o se esplicitamente richiesto)
  const isProduction = process.env.NODE_ENV === 'production';
  const seedDemoData = process.env.SEED_DEMO_DATA === 'true';

  if (isProduction && !seedDemoData) {
    console.log(
      '[INFO] Ambiente di Produzione rilevato: configurati esclusivamente i giochi base. Dati demo e utenti fittizi saltati.'
    );
    return;
  }

  console.log('[SEED] Popolamento dati di test (utenti fittizi e storico)...');

  // 2. Inserimento / Aggiornamento Utenti di Test
  const testUsers = [
    {
      id: 'user-sara',
      name: 'Sara Bianchi',
      email: 'sara@whoislosing.local',
      initials: 'SB',
      color: 'bg-chart-1',
    },
    {
      id: 'user-marco',
      name: 'Marco Rossi',
      email: 'marco@whoislosing.local',
      initials: 'MR',
      color: 'bg-chart-2',
    },
    {
      id: 'user-giulia',
      name: 'Giulia Ferri',
      email: 'giulia@whoislosing.local',
      initials: 'GF',
      color: 'bg-chart-3',
    },
    {
      id: 'user-luca',
      name: 'Luca De Angelis',
      email: 'luca@whoislosing.local',
      initials: 'LD',
      color: 'bg-chart-4',
    },
    {
      id: 'user-anna',
      name: 'Anna Conti',
      email: 'anna@whoislosing.local',
      initials: 'AC',
      color: 'bg-chart-5',
    },
  ];

  const createdUsers: Record<string, string> = {};

  for (const u of testUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, initials: u.initials, color: u.color },
      create: u,
    });
    createdUsers[u.name] = user.id;
    console.log(`[USER] Utente configurato: ${user.name}`);
  }

  // 3. Generazione Storico Punteggi per gli ultimi 7 giorni (incluso oggi)
  const userScoreProfiles: Record<
    string,
    { krBase: number; mzBase: number; chBase: number }
  > = {
    'Sara Bianchi': { krBase: 630, mzBase: 3, chBase: 3100 },
    'Marco Rossi': { krBase: 600, mzBase: 5, chBase: 2850 },
    'Giulia Ferri': { krBase: 580, mzBase: 4, chBase: 2950 },
    'Luca De Angelis': { krBase: 530, mzBase: 7, chBase: 2400 },
    'Anna Conti': { krBase: 490, mzBase: 9, chBase: 2100 },
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let scoreCount = 0;

  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    const scoreDate = new Date(today);
    scoreDate.setDate(scoreDate.getDate() - daysAgo);
    scoreDate.setHours(0, 0, 0, 0);

    for (const [name, userId] of Object.entries(createdUsers)) {
      const profile = userScoreProfiles[name];
      if (!profile) continue;

      // Leggera variazione per ogni giorno
      const variance = (daysAgo % 3) - 1; // -1, 0, 1
      const krScore = Math.max(
        300,
        Math.min(700, profile.krBase + variance * 25)
      );
      const mzScore = Math.max(1, Math.min(18, profile.mzBase + variance));
      const chScore = Math.max(
        1200,
        Math.min(4800, profile.chBase + variance * 180)
      );

      const dayGames: { game: GameId; rawScore: number }[] = [
        { game: 'Krilion', rawScore: krScore },
        { game: 'Metazooa', rawScore: mzScore },
        { game: 'Chronophoto', rawScore: chScore },
      ];

      for (const dg of dayGames) {
        const norm = calculateNormalizedScore(dg.game, dg.rawScore);
        await prisma.dailyScore.upsert({
          where: {
            userId_gameId_scoreDate: {
              userId,
              gameId: dg.game,
              scoreDate,
            },
          },
          update: {
            rawScore: dg.rawScore,
            normalizedScore: norm,
          },
          create: {
            userId,
            gameId: dg.game,
            rawScore: dg.rawScore,
            normalizedScore: norm,
            scoreDate,
            createdAt: scoreDate,
          },
        });
        scoreCount++;
      }
    }
  }

  console.log(
    `[SCORES] Inseriti/Aggiornati ${scoreCount} punteggi giornalieri negli ultimi 7 giorni.`
  );

  // 4. Inserimento Messaggi di Test in Bacheca
  const notesCount = await prisma.dailyNote.count();
  if (notesCount === 0) {
    await prisma.dailyNote.createMany({
      data: [
        {
          authorName: 'Sara Bianchi',
          authorColor: 'bg-chart-1',
          content:
            'Oggi Chronophoto era difficilissimo, chi ha fatto più di 3000 punti è un robot!',
          createdAt: new Date(),
        },
        {
          authorName: 'Marco Rossi',
          authorColor: 'bg-chart-2',
          content:
            'Metazooa indovinato in 3 tentativi, oggi si punta al primo posto!',
          createdAt: new Date(Date.now() - 3600000 * 3),
        },
      ],
    });
    console.log('[NOTES] Note della bacheca inserite con successo.');
  }

  console.log(
    "[SUCCESS] Popolamento di base completato con successo! Database pronto all'uso."
  );
}

main()
  .catch((e) => {
    console.error('[ERROR] Errore durante il popolamento:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
