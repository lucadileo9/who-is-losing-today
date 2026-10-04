import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateNormalizedScore, type Game } from "@/lib/game-data"

export async function GET() {
  try {
    const scores = await prisma.dailyScore.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, initials: true, color: true } },
        game: { select: { name: true, unit: true } },
      },
    })
    return NextResponse.json({ scores, source: "database" })
  } catch (err) {
    console.error("Errore GET /api/scores:", err)
    return NextResponse.json({ error: "Errore durante il recupero dei punteggi" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { game, score, text, userEmail } = body

    if (!game || typeof score !== "number") {
      return NextResponse.json({ error: "Gioco e punteggio numerico sono obbligatori." }, { status: 400 })
    }

    const targetEmail = userEmail || session?.user?.email || null
    let user = null

    // 1. Cerca l'utente nel DB tramite email
    if (targetEmail) {
      user = await prisma.user.findUnique({
        where: { email: targetEmail },
      })

      // Se l'utente si è loggato con Google ma non è ancora presente nella tabella users, crealo al volo
      if (!user) {
        const userName = session?.user?.name || targetEmail.split("@")[0]
        const initials = userName
          .split(" ")
          .map((s: string) => s[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()

        user = await prisma.user.create({
          data: {
            email: targetEmail,
            name: userName,
            image: session?.user?.image || null,
            initials,
            color: "bg-chart-1",
          },
        })
      }
    }

    // 2. Se non c'è una sessione, prendiamo il primo utente o creiamo un utente Ospite locale per i test
    if (!user) {
      user = await prisma.user.findFirst({
        orderBy: { createdAt: "asc" },
      })
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "ospite@whoislosing.local",
          name: "Giocatore Ospite",
          initials: "GO",
          color: "bg-chart-1",
        },
      })
    }

    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)

    const normalizedScore = calculateNormalizedScore(game as Game, score)

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
    })

    return NextResponse.json({ score: savedScore, user: user.name, source: "database" }, { status: 201 })
  } catch (err: unknown) {
    console.error("Errore salvataggio DB /api/scores:", err)
    return NextResponse.json({ error: "Impossibile salvare il punteggio nel database." }, { status: 500 })
  }
}
