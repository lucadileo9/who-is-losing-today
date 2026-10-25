import { z } from "zod"

export const createNoteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Il messaggio non può essere vuoto.")
    .max(500, "Messaggio troppo lungo (max 500 caratteri)."),
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>
