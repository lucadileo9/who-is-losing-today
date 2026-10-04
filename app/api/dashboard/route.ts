import { NextResponse } from "next/server"
import { getPlayersFromDb, getGroupPlayerTrendFromDb, getDailySummaryFromDb } from "@/lib/services/db-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get("date") || new Date().toISOString().split("T")[0]

    const [players, groupTrend, dailySummary] = await Promise.all([
      getPlayersFromDb(),
      getGroupPlayerTrendFromDb(),
      getDailySummaryFromDb(dateStr),
    ])

    const activePlayersCount = players.length
    const maxGroupStreak = players.length > 0 ? Math.max(...players.map((p) => p.streak)) : 0

    return NextResponse.json({
      activePlayersCount,
      maxGroupStreak,
      players,
      groupTrend,
      dailySummary,
      source: "database",
    })
  } catch (error) {
    console.error("Errore API /api/dashboard:", error)
    return NextResponse.json({ error: "Errore durante il recupero dei dati dal database." }, { status: 500 })
  }
}
