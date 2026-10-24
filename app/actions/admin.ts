"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Role, BugCategory, BugPriority, BugStatus } from "@prisma/client"
import { z } from "zod"

const AddWhitelistSchema = z.object({
  email: z.string().email("Indirizzo email non valido.").toLowerCase().trim(),
  role: z.nativeEnum(Role).default(Role.PLAYER),
})

const SubmitBugSchema = z.object({
  description: z.string().min(5, "Descrizione troppo breve (min 5 caratteri).").max(2000),
  category: z.nativeEnum(BugCategory).default(BugCategory.BUG),
  priority: z.nativeEnum(BugPriority).default(BugPriority.MEDIUM),
})

export async function addToWhitelistAction(email: string, role: Role = Role.PLAYER) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return { success: false, error: "Non autorizzato." }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
    })

    if (adminUser?.role !== Role.ADMIN) {
      return { success: false, error: "Permessi insufficienti (richiesto ruolo ADMIN)." }
    }

    const parsed = AddWhitelistSchema.safeParse({ email, role })
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Email non valida." }
    }

    const entry = await prisma.whitelist.upsert({
      where: { email: parsed.data.email },
      update: { role: parsed.data.role },
      create: { email: parsed.data.email, role: parsed.data.role },
    })

    revalidatePath("/admin")
    return { success: true, entry }
  } catch (error) {
    console.error("Errore addToWhitelistAction:", error)
    return { success: false, error: "Impossibile aggiungere l'email alla whitelist." }
  }
}

export async function removeFromWhitelistAction(whitelistId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return { success: false, error: "Non autorizzato." }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
    })

    if (adminUser?.role !== Role.ADMIN) {
      return { success: false, error: "Permessi insufficienti (richiesto ruolo ADMIN)." }
    }

    await prisma.whitelist.delete({
      where: { id: whitelistId },
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Errore removeFromWhitelistAction:", error)
    return { success: false, error: "Impossibile rimuovere l'email dalla whitelist." }
  }
}

export async function updateBugStatusAction(reportId: string, status: BugStatus) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return { success: false, error: "Non autorizzato." }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
    })

    if (adminUser?.role !== Role.ADMIN) {
      return { success: false, error: "Permessi insufficienti (richiesto ruolo ADMIN)." }
    }

    await prisma.bugReport.update({
      where: { id: reportId },
      data: { status },
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Errore updateBugStatusAction:", error)
    return { success: false, error: "Impossibile aggiornare lo stato del bug." }
  }
}

export async function submitBugReportAction(formData: unknown) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return { success: false, error: "Devi aver effettuato l'accesso per inviare una segnalazione." }
    }

    const parsed = SubmitBugSchema.safeParse(formData)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Dati non validi." }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
    })

    if (!user) {
      return { success: false, error: "Utente non trovato." }
    }

    const report = await prisma.bugReport.create({
      data: {
        userId: user.id,
        description: parsed.data.description,
        category: parsed.data.category,
        priority: parsed.data.priority,
        status: BugStatus.OPEN,
      },
    })

    revalidatePath("/admin")
    return { success: true, reportId: report.id }
  } catch (error) {
    console.error("Errore submitBugReportAction:", error)
    return { success: false, error: "Impossibile registrare la segnalazione." }
  }
}
