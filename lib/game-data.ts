export type Game = "Krilion" | "Metazooa" | "Chronophoto"
export type LeaderboardTab = "Totale" | Game

export interface GameInfo {
  id: Game
  name: string
  shortName: string
  color: string        // Hex per Recharts
  tone: string         // Classi Tailwind per Badge/Card
  unit: string         // "pts" o "tentativi"
  isLowerBetter: boolean
}

export const GAME_CONFIG: Record<Game, GameInfo> = {
  Krilion: {
    id: "Krilion",
    name: "Krilion",
    shortName: "KR",
    color: "#3b82f6",
    tone: "bg-chart-1/15 text-chart-1 border-chart-1/25",
    unit: "pts",
    isLowerBetter: false,
  },
  Metazooa: {
    id: "Metazooa",
    name: "Metazooa",
    shortName: "MZ",
    color: "#10b981",
    tone: "bg-chart-2/15 text-chart-2 border-chart-2/25",
    unit: "tentativi",
    isLowerBetter: true,
  },
  Chronophoto: {
    id: "Chronophoto",
    name: "Chronophoto",
    shortName: "CH",
    color: "#f59e0b",
    tone: "bg-chart-3/15 text-chart-3 border-chart-3/25",
    unit: "pts",
    isLowerBetter: false,
  },
}

export type Player = {
  id: string
  name: string
  initials: string
  color: string
  scores: Record<Game, number>
  streak: number
  played: number
}

export const games: Game[] = ["Krilion", "Metazooa", "Chronophoto"]

export const players: Player[] = [
  { id: "sara", name: "Sara Bianchi", initials: "SB", color: "bg-chart-1", scores: { Krilion: 92, Metazooa: 3, Chronophoto: 3129 }, streak: 12, played: 54 },
  { id: "marco", name: "Marco Rossi", initials: "MR", color: "bg-chart-2", scores: { Krilion: 88, Metazooa: 5, Chronophoto: 2850 }, streak: 8, played: 51 },
  { id: "giulia", name: "Giulia Ferri", initials: "GF", color: "bg-chart-3", scores: { Krilion: 85, Metazooa: 4, Chronophoto: 2990 }, streak: 6, played: 48 },
  { id: "luca", name: "Luca De Angelis", initials: "LD", color: "bg-chart-4", scores: { Krilion: 78, Metazooa: 7, Chronophoto: 2400 }, streak: 4, played: 44 },
  { id: "anna", name: "Anna Conti", initials: "AC", color: "bg-chart-5", scores: { Krilion: 72, Metazooa: 9, Chronophoto: 2100 }, streak: 3, played: 39 },
]

export const PLAYER_COLORS: Record<string, string> = {
  "Sara Bianchi": "#8b5cf6",  // Purple
  "Marco Rossi": "#3b82f6",   // Blue
  "Giulia Ferri": "#10b981",  // Emerald
  "Luca De Angelis": "#f59e0b",// Amber
  "Anna Conti": "#ec4899",    // Pink
}

export const groupPlayerTrendData: Record<LeaderboardTab, { day: string; [key: string]: string | number }[]> = {
  Totale: [
    { day: "12 mar", "Sara Bianchi": 84, "Marco Rossi": 78, "Giulia Ferri": 72, "Luca De Angelis": 65, "Anna Conti": 58 },
    { day: "13 mar", "Sara Bianchi": 86, "Marco Rossi": 80, "Giulia Ferri": 75, "Luca De Angelis": 68, "Anna Conti": 60 },
    { day: "14 mar", "Sara Bianchi": 85, "Marco Rossi": 82, "Giulia Ferri": 78, "Luca De Angelis": 70, "Anna Conti": 64 },
    { day: "15 mar", "Sara Bianchi": 89, "Marco Rossi": 84, "Giulia Ferri": 80, "Luca De Angelis": 73, "Anna Conti": 67 },
    { day: "16 mar", "Sara Bianchi": 90, "Marco Rossi": 85, "Giulia Ferri": 81, "Luca De Angelis": 75, "Anna Conti": 69 },
    { day: "17 mar", "Sara Bianchi": 92, "Marco Rossi": 87, "Giulia Ferri": 83, "Luca De Angelis": 77, "Anna Conti": 71 },
    { day: "18 mar", "Sara Bianchi": 94, "Marco Rossi": 88, "Giulia Ferri": 85, "Luca De Angelis": 79, "Anna Conti": 72 },
  ],
  Krilion: [
    { day: "12 mar", "Sara Bianchi": 82, "Marco Rossi": 76, "Giulia Ferri": 73, "Luca De Angelis": 68, "Anna Conti": 62 },
    { day: "13 mar", "Sara Bianchi": 85, "Marco Rossi": 78, "Giulia Ferri": 76, "Luca De Angelis": 70, "Anna Conti": 65 },
    { day: "14 mar", "Sara Bianchi": 84, "Marco Rossi": 81, "Giulia Ferri": 79, "Luca De Angelis": 72, "Anna Conti": 68 },
    { day: "15 mar", "Sara Bianchi": 88, "Marco Rossi": 83, "Giulia Ferri": 81, "Luca De Angelis": 74, "Anna Conti": 70 },
    { day: "16 mar", "Sara Bianchi": 90, "Marco Rossi": 85, "Giulia Ferri": 83, "Luca De Angelis": 76, "Anna Conti": 71 },
    { day: "17 mar", "Sara Bianchi": 91, "Marco Rossi": 86, "Giulia Ferri": 84, "Luca De Angelis": 77, "Anna Conti": 72 },
    { day: "18 mar", "Sara Bianchi": 92, "Marco Rossi": 88, "Giulia Ferri": 85, "Luca De Angelis": 78, "Anna Conti": 72 },
  ],
  Metazooa: [
    { day: "12 mar", "Sara Bianchi": 5, "Marco Rossi": 6, "Giulia Ferri": 7, "Luca De Angelis": 8, "Anna Conti": 10 },
    { day: "13 mar", "Sara Bianchi": 4, "Marco Rossi": 5, "Giulia Ferri": 6, "Luca De Angelis": 7, "Anna Conti": 9 },
    { day: "14 mar", "Sara Bianchi": 4, "Marco Rossi": 5, "Giulia Ferri": 5, "Luca De Angelis": 7, "Anna Conti": 9 },
    { day: "15 mar", "Sara Bianchi": 3, "Marco Rossi": 5, "Giulia Ferri": 5, "Luca De Angelis": 7, "Anna Conti": 9 },
    { day: "16 mar", "Sara Bianchi": 3, "Marco Rossi": 5, "Giulia Ferri": 4, "Luca De Angelis": 7, "Anna Conti": 9 },
    { day: "17 mar", "Sara Bianchi": 3, "Marco Rossi": 5, "Giulia Ferri": 4, "Luca De Angelis": 7, "Anna Conti": 9 },
    { day: "18 mar", "Sara Bianchi": 3, "Marco Rossi": 5, "Giulia Ferri": 4, "Luca De Angelis": 7, "Anna Conti": 9 },
  ],
  Chronophoto: [
    { day: "12 mar", "Sara Bianchi": 2700, "Marco Rossi": 2400, "Giulia Ferri": 2200, "Luca De Angelis": 1900, "Anna Conti": 1700 },
    { day: "13 mar", "Sara Bianchi": 2850, "Marco Rossi": 2550, "Giulia Ferri": 2400, "Luca De Angelis": 2050, "Anna Conti": 1800 },
    { day: "14 mar", "Sara Bianchi": 2900, "Marco Rossi": 2600, "Giulia Ferri": 2500, "Luca De Angelis": 2100, "Anna Conti": 1900 },
    { day: "15 mar", "Sara Bianchi": 3000, "Marco Rossi": 2700, "Giulia Ferri": 2700, "Luca De Angelis": 2250, "Anna Conti": 1950 },
    { day: "16 mar", "Sara Bianchi": 3050, "Marco Rossi": 2750, "Giulia Ferri": 2800, "Luca De Angelis": 2300, "Anna Conti": 2000 },
    { day: "17 mar", "Sara Bianchi": 3100, "Marco Rossi": 2800, "Giulia Ferri": 2900, "Luca De Angelis": 2350, "Anna Conti": 2050 },
    { day: "18 mar", "Sara Bianchi": 3129, "Marco Rossi": 2850, "Giulia Ferri": 2990, "Luca De Angelis": 2400, "Anna Conti": 2100 },
  ],
}

export const personalTrendData: { day: string; Krilion: number; Metazooa: number; Chronophoto: number }[] = [
  { day: "12 mar", Krilion: 72, Metazooa: 8, Chronophoto: 2100 },
  { day: "13 mar", Krilion: 76, Metazooa: 7, Chronophoto: 2350 },
  { day: "14 mar", Krilion: 73, Metazooa: 6, Chronophoto: 2500 },
  { day: "15 mar", Krilion: 81, Metazooa: 5, Chronophoto: 2800 },
  { day: "16 mar", Krilion: 84, Metazooa: 4, Chronophoto: 2950 },
  { day: "17 mar", Krilion: 86, Metazooa: 4, Chronophoto: 3050 },
  { day: "18 mar", Krilion: 88, Metazooa: 3, Chronophoto: 3129 },
]

export const trendData = groupPlayerTrendData.Totale

export const history = [
  { game: "Krilion" as Game, score: 92, date: "Oggi, 09:32", time: "00:42" },
  { game: "Metazooa" as Game, score: 3, date: "Ieri, 18:14", time: "01:05" },
  { game: "Chronophoto" as Game, score: 3129, date: "Ieri, 08:47", time: "00:38" },
  { game: "Krilion" as Game, score: 89, date: "17 mar, 12:20", time: "00:45" },
  { game: "Metazooa" as Game, score: 4, date: "16 mar, 19:02", time: "01:12" },
]

/**
 * Calcola il punteggio normalizzato (0 - 100) per ciascun gioco
 */
export function calculateNormalizedScore(game: Game, score: number): number {
  if (game === "Metazooa") {
    // 1 tentativo = 100 pt, 2 = 90 pt, 3 = 80 pt ...
    return Math.max(0, 100 - (score - 1) * 10)
  }
  if (game === "Chronophoto") {
    // Chronophoto scala fino a 5.000 -> normalizzato in 0-100
    return Math.min(100, Math.round((score / 5000) * 100))
  }
  // Krilion: già in scala 0-100
  return Math.min(100, score)
}

/**
 * Calcola il Punteggio Complessivo Totale del giocatore (Media dei 3 giochi)
 */
export function calculateOverallScore(player: Player): number {
  const kr = calculateNormalizedScore("Krilion", player.scores.Krilion)
  const mz = calculateNormalizedScore("Metazooa", player.scores.Metazooa)
  const ch = calculateNormalizedScore("Chronophoto", player.scores.Chronophoto)
  return Math.round((kr + mz + ch) / 3)
}

export function parseScore(text: string, game: Game): number | null {
  if (!text) return null
  const trimmed = text.trim()

  if (game === "Metazooa") {
    const match = trimmed.match(/in\s+(\d+)\s+guesses/i) || trimmed.match(/(\d+)\s+guesses/i)
    if (match && match[1]) {
      return parseInt(match[1], 10)
    }
  }

  if (game === "Chronophoto") {
    const match = trimmed.match(/Final\s+Total:?\s*(\d+)/i)
    if (match && match[1]) {
      return parseInt(match[1], 10)
    }
  }

  if (game === "Krilion") {
    const match = trimmed.match(/(?:Krilion\s*)?(\d+)/i)
    if (match && match[1]) {
      return parseInt(match[1], 10)
    }
  }

  const fallback = trimmed.match(/\d+/)
  return fallback ? parseInt(fallback[0], 10) : null
}

export function isLowerBetter(game: Game): boolean {
  return GAME_CONFIG[game]?.isLowerBetter ?? false
}

export const gameTone: Record<Game, string> = {
  Krilion: GAME_CONFIG.Krilion.tone,
  Metazooa: GAME_CONFIG.Metazooa.tone,
  Chronophoto: GAME_CONFIG.Chronophoto.tone,
}

export const gameShort: Record<Game, string> = {
  Krilion: GAME_CONFIG.Krilion.shortName,
  Metazooa: GAME_CONFIG.Metazooa.shortName,
  Chronophoto: GAME_CONFIG.Chronophoto.shortName,
}
