import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Avvio popolamento base del database...")

  // Inserimento / Aggiornamento dei Giochi di base
  const games = [
    { id: "Krilion", name: "Krilion", shortName: "KR", unit: "pts", isLowerBetter: false },
    { id: "Metazooa", name: "Metazooa", shortName: "MZ", unit: "tentativi", isLowerBetter: true },
    { id: "Chronophoto", name: "Chronophoto", shortName: "CH", unit: "pts", isLowerBetter: false },
  ]

  for (const game of games) {
    await prisma.game.upsert({
      where: { id: game.id },
      update: game,
      create: game,
    })
    console.log(`✅ Gioco configurato: ${game.name} (${game.shortName})`)
  }

  console.log("🎉 Popolamento di base completato con successo! Database pronto per l'uso reale.")
}

main()
  .catch((e) => {
    console.error("❌ Errore durante il popolamento:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
