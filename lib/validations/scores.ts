import { z } from "zod"

export const submitScoreSchema = z.object({
  gameId: z.string().min(1, "Il gioco è obbligatorio"),
  rawScore: z.number().int().min(0, "Il punteggio non può essere negativo").max(100000, "Punteggio troppo elevato"),
  scoreDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato data non valido (YYYY-MM-DD)"),
  rawInputText: z.string().max(2000).optional(),
})

export type SubmitScoreInput = z.infer<typeof submitScoreSchema>
