"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedAdmin, getAuthenticatedUser } from "@/lib/auth-guard"
import { addWhitelistSchema, submitBugSchema } from "@/lib/validations/admin"
import { Role, BugStatus } from "@prisma/client"

export async function addToWhitelistAction(email: string, role: Role = Role.PLAYER) {
  try {
    const auth = await getAuthenticatedAdmin()
    if (!auth.success) return { success: false, error: auth.error }

    const parsed = addWhitelistSchema.safeParse({ email, role })
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
    const auth = await getAuthenticatedAdmin()
    if (!auth.success) return { success: false, error: auth.error }

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
    const auth = await getAuthenticatedAdmin()
    if (!auth.success) return { success: false, error: auth.error }

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
    const auth = await getAuthenticatedUser()
    if (!auth.success) return { success: false, error: auth.error }

    const parsed = submitBugSchema.safeParse(formData)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Dati non validi." }
    }

    const report = await prisma.bugReport.create({
      data: {
        userId: auth.user.id,
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
