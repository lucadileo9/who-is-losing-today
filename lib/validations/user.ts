import { z } from "zod"

export const updateUserColorSchema = z.object({
  colorHex: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Formato colore esadecimale non valido (es. #3b82f6)"),
})

export type UpdateUserColorInput = z.infer<typeof updateUserColorSchema>
