import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserProfileStats, getUserTrend, getUserScoreHistory } from "@/lib/services/user-service"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorizzato. Effettua il login." }, { status: 401 })
    }

    const userId = (session.user as { id?: string }).id
    const userEmail = session.user.email

    // Se l'ID utente non è presente nel token JWT, cerchiamolo via email nel DB
    let targetUserId = userId
    if (!targetUserId && userEmail) {
      const { prisma } = await import("@/lib/prisma")
      const foundUser = await prisma.user.findUnique({ where: { email: userEmail } })
      if (foundUser) targetUserId = foundUser.id
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "Utente non trovato nel sistema." }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const fromDate = searchParams.get("fromDate") || undefined
    const toDate = searchParams.get("toDate") || undefined

    const [stats, trend, history] = await Promise.all([
      getUserProfileStats(targetUserId),
      getUserTrend(targetUserId, fromDate, toDate),
      getUserScoreHistory(targetUserId),
    ])

    return NextResponse.json({
      user: {
        id: targetUserId,
        name: session.user.name || "Giocatore",
        email: session.user.email,
        image: session.user.image,
      },
      stats,
      trend,
      history,
    })
  } catch (error) {
    console.error("Errore API /api/user/me:", error)
    return NextResponse.json({ error: "Errore durante il recupero dei dati utente." }, { status: 500 })
  }
}
