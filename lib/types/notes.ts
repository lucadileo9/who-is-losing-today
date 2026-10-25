import { UserSummaryDTO } from './user';

export interface DailyNoteDTO {
  id: string;
  content: string;
  createdAt: string; // Data e ora formattata (es: "18 Ott, 10:30")
  rawCreatedAt: Date;
  isAuthor: boolean; // true se l'utente loggato è l'autore (può eliminare)
  author: UserSummaryDTO;
}
