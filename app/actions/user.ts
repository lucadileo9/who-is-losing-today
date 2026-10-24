"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const UpdateColorSchema = z.object({
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Formato colore esadecimale non valido (es. #3b82f6)"),
})

export async function updateUserColorAction(colorHex: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return { success: false, error: "Non autorizzato." }
    }

    const parsed = UpdateColorSchema.safeParse({ colorHex })
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Colore non valido." }
    }

    const user = await prisma.user.update({
      where: { email: session.user.email.toLowerCase().trim() },
      data: { color: parsed.data.colorHex },
    })

    revalidatePath("/profile")
    revalidatePath(`/profile/${user.id}`)
    revalidatePath("/dashboard")

    return { success: true, newColor: user.color }
  } catch (error) {
    console.error("Errore updateUserColorAction:", error)
    return { success: false, error: "Impossibile aggiornare il colore." }
  }
}
