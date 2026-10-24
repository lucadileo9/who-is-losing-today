"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateNormalizedScore, type Game } from "@/lib/game-data"
import { z } from "zod"

const SubmitScoreSchema = z.object({
  gameId: z.enum(["Krilion", "Metazooa", "Chronophoto"]),
  rawScore: z.number().int().min(0).max(100000),
  scoreDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato data non valido (YYYY-MM-DD)"),
  rawInputText: z.string().max(2000).optional(),
})

export type SubmitScoreInput = z.infer<typeof SubmitScoreSchema>

export async function submitScoreAction(formData: unknown) {
  try {
    // 1. Controllo Autenticazione Server-Side
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return { success: false, error: "Devi aver effettuato l'accesso per registrare un punteggio." }
    }

    // 2. Validazione Zod
    const parsed = SubmitScoreSchema.safeParse(formData)
    if (!parsed.success) {
      const msg = parsed.error.issues.map((i) => i.message).join(", ")
      return { success: false, error: msg || "Dati non validi." }
    }

    const { gameId, rawScore, scoreDate, rawInputText } = parsed.data

    // 3. Risoluzione Utente
    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
    })

    if (!user) {
      return { success: false, error: "Profilo utente non trovato nel database." }
    }

    // 4. Calcolo punteggio normalizzato
    const normalizedScore = calculateNormalizedScore(gameId as Game, rawScore)
    const targetDate = new Date(scoreDate)
    targetDate.setHours(0, 0, 0, 0)

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
    })

    // 6. Invalida le cache di Next.js per aggiornare istantaneamente la dashboard e il profilo
    revalidatePath("/dashboard")
    revalidatePath("/profile")
    revalidatePath(`/profile/${user.id}`)

    return { success: true, scoreId: saved.id }
  } catch (error) {
    console.error("Errore submitScoreAction:", error)
    return { success: false, error: "Errore durante il salvataggio del punteggio." }
  }
}
