import { prisma } from "@/lib/prisma"
import type { DailyNoteDTO } from "@/lib/types/notes"

/**
 * Recupera tutte le note della bacheca create negli ultimi 7 giorni.
 * Inietta il flag isAuthor per permettere la cancellazione se l'utente corrente è l'autore.
 */
export async function getActiveNotes(currentUserId?: string): Promise<DailyNoteDTO[]> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const notes = await prisma.dailyNote.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          color: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return notes.map((n) => {
    const d = new Date(n.createdAt)
    const formattedDate = d.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })

    return {
      id: n.id,
      content: n.content,
      createdAt: formattedDate,
      rawCreatedAt: n.createdAt,
      isAuthor: Boolean(currentUserId && n.userId === currentUserId),
      author: {
        id: n.user.id,
        name: n.user.name || "Giocatore",
        color: n.user.color || "#3b82f6",
        image: n.user.image,
      },
    }
  })
}
