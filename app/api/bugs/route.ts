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
    const { description, pageUrl } = body

    if (!description || description.trim().length === 0) {
      return NextResponse.json({ error: "La descrizione del problema non può essere vuota." }, { status: 400 })
    }

    let userId: string | null = null
    const userEmail: string | null = session?.user?.email || null
    let userName: string = session?.user?.name || "Ospite"

    if (userEmail) {
      const dbUser = await prisma.user.findUnique({ where: { email: userEmail } })
      if (dbUser) {
        userId = dbUser.id
        userName = dbUser.name || userName
      }
    }

    const bugReport = await prisma.bugReport.create({
      data: {
        userId,
        userEmail,
        userName,
        description: description.trim(),
        pageUrl: pageUrl || "/",
        status: "OPEN",
      },
    })

    return NextResponse.json({ success: true, bugReport }, { status: 201 })
  } catch (error) {
    console.error("Errore POST /api/bugs:", error)
    return NextResponse.json({ error: "Impossibile salvare la segnalazione bug nel database." }, { status: 500 })
  }
}
