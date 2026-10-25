import { UserSummaryDTO } from './user';

export interface DailyPlayerScore {
  user: UserSummaryDTO;
  rawScore: number; // Punteggio grezzo (es. 3200 o 3)
  normalizedScore: number; // Normalizzato 0-100
  rank: number; // Posizione: 1, 2, 3...
}

export interface DailyResultsDTO {
  date: string; // "YYYY-MM-DD"
  totalPlayers: number; // Numero di giocatori partecipanti in questa data
  winner: DailyPlayerScore | null;
  loser: DailyPlayerScore | null; // null se totalPlayers < 2
  rankings: {
    totale: DailyPlayerScore[];
    byGame: Record<string, DailyPlayerScore[]>;
    krilion?: DailyPlayerScore[];
    metazooa?: DailyPlayerScore[];
    chronophoto?: DailyPlayerScore[];
    [key: string]:
      DailyPlayerScore[] | Record<string, DailyPlayerScore[]> | undefined;
  };
}
