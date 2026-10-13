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
  { id: "sara", name: "Sara Bianchi", initials: "SB", color: "bg-chart-1", scores: { Krilion: 644, Metazooa: 3, Chronophoto: 3129 }, streak: 12, played: 54 },
  { id: "marco", name: "Marco Rossi", initials: "MR", color: "bg-chart-2", scores: { Krilion: 616, Metazooa: 5, Chronophoto: 2850 }, streak: 8, played: 51 },
  { id: "giulia", name: "Giulia Ferri", initials: "GF", color: "bg-chart-3", scores: { Krilion: 595, Metazooa: 4, Chronophoto: 2990 }, streak: 6, played: 48 },
  { id: "luca", name: "Luca De Angelis", initials: "LD", color: "bg-chart-4", scores: { Krilion: 546, Metazooa: 7, Chronophoto: 2400 }, streak: 4, played: 44 },
  { id: "anna", name: "Anna Conti", initials: "AC", color: "bg-chart-5", scores: { Krilion: 504, Metazooa: 9, Chronophoto: 2100 }, streak: 3, played: 39 },
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
    { day: "12 mar", "Sara Bianchi": 574, "Marco Rossi": 532, "Giulia Ferri": 511, "Luca De Angelis": 476, "Anna Conti": 434 },
    { day: "13 mar", "Sara Bianchi": 595, "Marco Rossi": 546, "Giulia Ferri": 532, "Luca De Angelis": 490, "Anna Conti": 455 },
    { day: "14 mar", "Sara Bianchi": 588, "Marco Rossi": 567, "Giulia Ferri": 553, "Luca De Angelis": 504, "Anna Conti": 476 },
    { day: "15 mar", "Sara Bianchi": 616, "Marco Rossi": 581, "Giulia Ferri": 567, "Luca De Angelis": 518, "Anna Conti": 490 },
    { day: "16 mar", "Sara Bianchi": 630, "Marco Rossi": 595, "Giulia Ferri": 581, "Luca De Angelis": 532, "Anna Conti": 497 },
    { day: "17 mar", "Sara Bianchi": 637, "Marco Rossi": 602, "Giulia Ferri": 588, "Luca De Angelis": 539, "Anna Conti": 504 },
    { day: "18 mar", "Sara Bianchi": 644, "Marco Rossi": 616, "Giulia Ferri": 595, "Luca De Angelis": 546, "Anna Conti": 504 },
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
  { day: "12 mar", Krilion: 504, Metazooa: 8, Chronophoto: 2100 },
  { day: "13 mar", Krilion: 532, Metazooa: 7, Chronophoto: 2350 },
  { day: "14 mar", Krilion: 511, Metazooa: 6, Chronophoto: 2500 },
  { day: "15 mar", Krilion: 567, Metazooa: 5, Chronophoto: 2800 },
  { day: "16 mar", Krilion: 588, Metazooa: 4, Chronophoto: 2950 },
  { day: "17 mar", Krilion: 602, Metazooa: 4, Chronophoto: 3050 },
  { day: "18 mar", Krilion: 616, Metazooa: 3, Chronophoto: 3129 },
]

export const trendData = groupPlayerTrendData.Totale

export const history = [
  { game: "Krilion" as Game, score: 644, date: "Oggi, 09:32", time: "00:42" },
  { game: "Metazooa" as Game, score: 3, date: "Ieri, 18:14", time: "01:05" },
  { game: "Chronophoto" as Game, score: 3129, date: "Ieri, 08:47", time: "00:38" },
  { game: "Krilion" as Game, score: 623, date: "17 mar, 12:20", time: "00:45" },
  { game: "Metazooa" as Game, score: 4, date: "16 mar, 19:02", time: "01:12" },
]

/**
 * Calcola il punteggio normalizzato (0 - 100) per ciascun gioco
 * - Metazooa: max 20 tentativi. Più è grande meglio è (20 - n tentativi).
 *   1 tentativo (ottimo) = 20 - 1 = 19 (100%), 20 tentativi = 0 (0%).
 * - Chronophoto: max 5000 punti.
 * - Krilion: max 700 punti.
 */
export function calculateNormalizedScore(game: Game, score: number): number {
  if (game === "Metazooa") {
    if (score <= 0 || score > 20) return 0
    return Math.max(0, Math.min(100, Math.round(((20 - score) / 19) * 100)))
  }
  if (game === "Chronophoto") {
    // Chronophoto scala fino a 5.000 -> normalizzato in 0-100
    return Math.max(0, Math.min(100, Math.round((score / 5000) * 100)))
  }
  if (game === "Krilion") {
    // Krilion scala fino a 700 -> normalizzato in 0-100
    return Math.max(0, Math.min(100, Math.round((score / 700) * 100)))
  }
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
