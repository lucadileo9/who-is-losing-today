import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/bugs - Recupera la lista dei bug segnalati
export async function GET() {
  try {
    const bugs = await prisma.bugReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return NextResponse.json({ bugs })
  } catch (error) {
    console.error("Errore GET /api/bugs:", error)
    return NextResponse.json({ error: "Errore durante il recupero dei segnalazioni." }, { status: 500 })
  }
}

// POST /api/bugs - Invia una nuova segnalazione bug
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { description, category = "BUG", priority = "MEDIUM" } = body

    if (!description || description.trim().length === 0) {
      return NextResponse.json({ error: "La descrizione del problema non può essere vuota." }, { status: 400 })
    }

    const validCategories = ["BUG", "UI_UX", "FEATURE", "OTHER"]
    const validPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

    const safeCategory = validCategories.includes(category) ? category : "BUG"
    const safePriority = validPriorities.includes(priority) ? priority : "MEDIUM"

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Devi essere autenticato per inviare una segnalazione." }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!dbUser) {
      return NextResponse.json({ error: "Utente non trovato." }, { status: 404 })
    }

    const bugReport = await prisma.bugReport.create({
      data: {
        userId: dbUser.id,
        description: description.trim(),
        category: safeCategory as any,
        priority: safePriority as any,
        status: "OPEN",
      },
    })

    return NextResponse.json({ success: true, bugReport }, { status: 201 })
  } catch (error) {
    console.error("Errore POST /api/bugs:", error)
    return NextResponse.json({ error: "Impossibile salvare la segnalazione bug nel database." }, { status: 500 })
  }
}
