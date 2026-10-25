"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/auth-guard"
import { z } from "zod"

const CreateNoteSchema = z.object({
  content: z.string().trim().min(1, "Il messaggio non può essere vuoto.").max(500, "Messaggio troppo lungo (max 500 caratteri)."),
})

export async function createNoteAction(content: string) {
  try {
    const auth = await getAuthenticatedUser()
    if (!auth.success) {
      return { success: false, error: auth.error }
    }
    const user = auth.user

    const parsed = CreateNoteSchema.safeParse({ content })
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Testo non valido." }
    }

    const note = await prisma.dailyNote.create({
      data: {
        userId: user.id,
        content: parsed.data.content,
      },
    })

    revalidatePath("/bacheca")
    revalidatePath("/dashboard")

    return { success: true, noteId: note.id }
  } catch (error) {
    console.error("Errore createNoteAction:", error)
    return { success: false, error: "Impossibile pubblicare il messaggio." }
  }
}

export async function deleteNoteAction(noteId: string) {
  try {
    const auth = await getAuthenticatedUser()
    if (!auth.success) {
      return { success: false, error: auth.error }
    }
    const user = auth.user

    const note = await prisma.dailyNote.findUnique({
      where: { id: noteId },
    })

    if (!note) {
      return { success: false, error: "Messaggio non trovato." }
    }

    // Autorizzato se l'utente è l'autore oppure se è un ADMIN
    const isAuthor = note.userId === user.id
    const isAdmin = user.role === "ADMIN"

    if (!isAuthor && !isAdmin) {
      return { success: false, error: "Puoi eliminare solo i tuoi messaggi." }
    }

    await prisma.dailyNote.delete({
      where: { id: noteId },
    })

    revalidatePath("/bacheca")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Errore deleteNoteAction:", error)
    return { success: false, error: "Impossibile eliminare il messaggio." }
  }
}
