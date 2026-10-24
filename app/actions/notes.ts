"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const CreateNoteSchema = z.object({
  content: z.string().trim().min(1, "Il messaggio non può essere vuoto.").max(500, "Messaggio troppo lungo (max 500 caratteri)."),
})

export async function createNoteAction(content: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return { success: false, error: "Devi aver effettuato l'accesso per pubblicare un messaggio." }
    }

    const parsed = CreateNoteSchema.safeParse({ content })
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Testo non valido." }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
    })

    if (!user) {
      return { success: false, error: "Profilo utente non trovato." }
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return { success: false, error: "Non autorizzato." }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
    })

    if (!user) {
      return { success: false, error: "Utente non trovato." }
    }

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
