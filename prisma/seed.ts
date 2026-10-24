import { PrismaClient, ScoreUnit, Role } from "@prisma/client"

type GameId = "Krilion" | "Metazooa" | "Chronophoto"

function calculateNormalizedScore(game: GameId, score: number): number {
  if (game === "Metazooa") {
    if (score <= 0 || score > 20) return 0
    return Math.max(0, Math.min(100, Math.round(((20 - score) / 19) * 100)))
  }
  if (game === "Chronophoto") {
    return Math.max(0, Math.min(100, Math.round((score / 5000) * 100)))
  }
  if (game === "Krilion") {
    return Math.max(0, Math.min(100, Math.round((score / 700) * 100)))
  }
  return Math.min(100, score)
}

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Avvio popolamento base del database...")

  // 1. Inserimento / Aggiornamento dei Giochi con colori ufficiali ed enum ScoreUnit
  const games = [
    { id: "Krilion", name: "Krilion", shortName: "KR", unit: ScoreUnit.POINTS, color: "#10b981", isLowerBetter: false },
    { id: "Metazooa", name: "Metazooa", shortName: "MZ", unit: ScoreUnit.ATTEMPTS, color: "#f97316", isLowerBetter: true },
    { id: "Chronophoto", name: "Chronophoto", shortName: "CH", unit: ScoreUnit.POINTS, color: "#8b5cf6", isLowerBetter: false },
  ]

  for (const game of games) {
    await prisma.game.upsert({
      where: { id: game.id },
      update: game,
      create: game,
    })
    console.log(`✅ Gioco configurato: ${game.name} (${game.shortName})`)
  }

  // Verifica se popolare anche i dati di test (solo in locale o se esplicitamente richiesto)
  const isProduction = process.env.NODE_ENV === "production"
  const seedDemoData = process.env.SEED_DEMO_DATA === "true"

  if (isProduction && !seedDemoData) {
    console.log("🔒 Ambiente di Produzione rilevato: configurati esclusivamente i giochi base. Dati demo e utenti fittizi saltati.")
    return
  }

  console.log("🧪 Popolamento dati di test (utenti fittizi e storico)...")

  // 2. Inserimento / Aggiornamento Utenti di Test
  const testUsers = [
    { id: "user-sara", name: "Sara Bianchi", email: "sara@whoislosing.local", initials: "SB", color: "#3b82f6", role: Role.PLAYER },
    { id: "user-marco", name: "Marco Rossi", email: "marco@whoislosing.local", initials: "MR", color: "#ef4444", role: Role.PLAYER },
    { id: "user-giulia", name: "Giulia Ferri", email: "giulia@whoislosing.local", initials: "GF", color: "#10b981", role: Role.PLAYER },
    { id: "user-luca", name: "Luca De Angelis", email: "luca@whoislosing.local", initials: "LD", color: "#8b5cf6", role: Role.ADMIN },
    { id: "user-anna", name: "Anna Conti", email: "anna@whoislosing.local", initials: "AC", color: "#f59e0b", role: Role.PLAYER },
  ]

  const createdUsers: Record<string, string> = {}

  for (const user of testUsers) {
    const upserted = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        initials: user.initials,
        color: user.color,
        role: user.role,
      },
      create: user,
    })
    createdUsers[user.id] = upserted.id

    // Inserisci anche in Whitelist per permettere login di test
    await prisma.whitelist.upsert({
      where: { email: user.email },
      update: { role: user.role },
      create: { email: user.email, role: user.role },
    })
  }
  console.log(`👤 ${testUsers.length} utenti di test e whitelist configurati.`)

  // 3. Inserimento Punteggi Storici (Ultimi 7 giorni)
  const userKeys = Object.keys(createdUsers)
  let scoreCount = 0

  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() - daysAgo)
    targetDate.setHours(0, 0, 0, 0)

    for (const userKey of userKeys) {
      const userId = createdUsers[userKey]

      const krilionScore = Math.floor(Math.random() * 400) + 200
      const metazooaAttempts = Math.floor(Math.random() * 8) + 1
      const chronophotoScore = Math.floor(Math.random() * 3000) + 1500

      const dailyScoresToInsert = [
        {
          gameId: "Krilion" as GameId,
          raw: krilionScore,
        },
        {
          gameId: "Metazooa" as GameId,
          raw: metazooaAttempts,
        },
        {
          gameId: "Chronophoto" as GameId,
          raw: chronophotoScore,
        },
      ]

      for (const item of dailyScoresToInsert) {
        const normalized = calculateNormalizedScore(item.gameId, item.raw)

        await prisma.dailyScore.upsert({
          where: {
            userId_gameId_scoreDate: {
              userId,
              gameId: item.gameId,
              scoreDate: targetDate,
            },
          },
          update: {
            rawScore: item.raw,
            normalizedScore: normalized,
          },
          create: {
            userId,
            gameId: item.gameId,
            rawScore: item.raw,
            normalizedScore: normalized,
            scoreDate: targetDate,
          },
        })
        scoreCount++
      }
    }
  }

  console.log(`📊 Inseriti/Aggiornati ${scoreCount} punteggi giornalieri negli ultimi 7 giorni.`)

  // 4. Inserimento Messaggi di Test in Bacheca
  const notesCount = await prisma.dailyNote.count()
  if (notesCount === 0) {
    await prisma.dailyNote.createMany({
      data: [
        {
          userId: createdUsers["user-sara"],
          content: "Oggi Chronophoto era difficilissimo, chi ha fatto più di 3000 punti è un robot! 🤖",
          createdAt: new Date(),
        },
        {
          userId: createdUsers["user-marco"],
          content: "Metazooa indovinato in 3 tentativi, oggi si punta al primo posto! 🔥",
          createdAt: new Date(Date.now() - 3600000 * 3),
        },
      ],
    })
    console.log("📝 Note della bacheca inserite con successo.")
  }

  console.log("🎉 Popolamento di base completato con successo! Database pronto all'uso.")
}

main()
  .catch((e) => {
    console.error("❌ Errore durante il popolamento:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
