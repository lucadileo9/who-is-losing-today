import { UserSummaryDTO } from "./user"

export const PERIOD_PRESETS = ["week", "month", "last_month", "all"] as const
export type PeriodPreset = (typeof PERIOD_PRESETS)[number]

export interface PeriodLeaderboardRow {
  user: UserSummaryDTO
  playedCount: number // Quante partite ha completato nel periodo
  totalPoints: number // Somma di tutti i punti nel periodo
  averageScore: number // Media normalizzata del periodo (ordinamento principale)
  bestScore: number // Punteggio più alto registrato nel periodo
  rank: number // Posizione: 1, 2, 3...
}

export interface TrendPointDTO {
  date: string // "12 Ott", "13 Ott"...
  [userId: string]: string | number // Punteggi per userId: es { date: "12 Ott", "user_1": 85, "user_2": 40 }
}

export interface PeriodGameData {
  leaderboard: PeriodLeaderboardRow[]
  trendData: TrendPointDTO[]
}

export interface PeriodResultsDTO {
  startDate: string
  endDate: string
  players: UserSummaryDTO[] // Lista giocatori per associare Line stroke={player.color}
  totale: PeriodGameData
  krilion: PeriodGameData
  metazooa: PeriodGameData
  chronophoto: PeriodGameData
}

export interface AllTimeRecordItem {
  gameId: string
  score: number
  unit: string
  date: string // "YYYY-MM-DD" o formattata
  holder: UserSummaryDTO
}

export interface HallOfFameDTO {
  krilion: AllTimeRecordItem | null
  metazooa: AllTimeRecordItem | null
  chronophoto: AllTimeRecordItem | null
  totale: AllTimeRecordItem | null
}
