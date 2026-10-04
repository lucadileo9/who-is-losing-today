import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/notes
export async function GET() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000)

    // 1. Auto-pulizia automatica dal DB: cancella i messaggi più vecchi di 7 giorni
    await prisma.dailyNote.deleteMany({
      where: {
        createdAt: {
          lt: sevenDaysAgo,
        },
      },
    })

    // 2. Recupera tutti i messaggi degli ultimi 7 giorni
    const notes = await prisma.dailyNote.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            initials: true,
            color: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const todayStr = new Date().toISOString().split("T")[0]
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0]

    const formattedNotes = notes.map((n) => {
      const noteDateStr = n.createdAt.toISOString().split("T")[0]
      let dateLabel = n.createdAt.toLocaleDateString("it-IT", { day: "numeric", month: "short" })

      if (noteDateStr === todayStr) {
        dateLabel = "Oggi"
      } else if (noteDateStr === yesterdayStr) {
        dateLabel = "Ieri"
      }

      const timeStr = n.createdAt.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
      const name = n.user?.name || n.authorName || "Giocatore"

      return {
        id: n.id,
        content: n.content,
        dateLabel,
        time: timeStr,
        author: {
          name,
          initials: name
            .split(" ")
            .map((s) => s[0])
            .join("")
            .substring(0, 2)
            .toUpperCase(),
          color: n.user?.color || n.authorColor || "bg-chart-1",
          image: n.user?.image || null,
        },
      }
    })

    return NextResponse.json({ notes: formattedNotes })
  } catch (error) {
    console.error("Errore API GET /api/notes:", error)
    return NextResponse.json({ error: "Errore durante il recupero dei messaggi." }, { status: 500 })
  }
}

// POST /api/notes
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Obbligo di autenticazione per pubblicare sulla lavagna
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Devi essere autenticato con Google per pubblicare sulla lavagna." }, { status: 401 })
    }

    const body = await request.json()
    const content = body?.content?.trim()

    if (!content || content.length === 0) {
      return NextResponse.json({ error: "Il testo del messaggio non può essere vuoto." }, { status: 400 })
    }

    if (content.length > 280) {
      return NextResponse.json({ error: "Il messaggio supera il limite di 280 caratteri." }, { status: 400 })
    }

    // Trova l'utente nel DB
    let targetUserId: string | null = null
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } })

    if (dbUser) {
      targetUserId = dbUser.id
    }

    const authorName = dbUser?.name || session.user.name || "Giocatore"

    const note = await prisma.dailyNote.create({
      data: {
        userId: targetUserId,
        authorName,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            initials: true,
            color: true,
            image: true,
          },
        },
      },
    })

    const timeStr = note.createdAt.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
    const name = note.user?.name || note.authorName || "Giocatore"

    return NextResponse.json({
      note: {
        id: note.id,
        content: note.content,
        dateLabel: "Oggi",
        time: timeStr,
        author: {
          name,
          initials: name
            .split(" ")
            .map((s) => s[0])
            .join("")
            .substring(0, 2)
            .toUpperCase(),
          color: note.user?.color || note.authorColor || "bg-chart-1",
          image: note.user?.image || null,
        },
      },
    })
  } catch (error) {
    console.error("Errore API POST /api/notes:", error)
    return NextResponse.json({ error: "Impossibile salvare il messaggio sulla lavagna." }, { status: 500 })
  }
}
