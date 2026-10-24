import { Role } from "@prisma/client"

export interface UserSummaryDTO {
  id: string
  name: string
  color: string // Hex es: "#3b82f6"
  image?: string | null
}

export interface GameStatsSummary {
  played: number
  averageScore: number
  bestScore: number
}

export interface UserPersonalTrendPoint {
  date: string // "18 Ott"
  krilion?: number
  metazooa?: number
  chronophoto?: number
  totale?: number
}

export interface UserProfileDTO {
  user: UserSummaryDTO
  role: Role
  streak: number // Giorni consecutivi attuali
  streakRecord: number // Record storico di giorni consecutivi
  totalGamesPlayed: number // Somma di tutte le partite
  woodenSpoonsCount: number // Quante volte è arrivato ultimo del giorno con >= 2 giocatori 🥄
  dailyWinsCount: number // Quante volte è arrivato primo del giorno 🥇
  statsByGame: {
    krilion: GameStatsSummary
    metazooa: GameStatsSummary
    chronophoto: GameStatsSummary
  }
  personalTrend: UserPersonalTrendPoint[]
}
