import { prisma } from "@/lib/prisma"
import { DEFAULT_USER_COLOR } from "@/lib/theme/colors"
import type { WhitelistDTO, BugReportDTO } from "@/lib/types/admin"

/**
 * Recupera tutte le email autorizzate in Whitelist per il pannello Admin.
 */
export async function getWhitelistUsers(): Promise<WhitelistDTO[]> {
  const list = await prisma.whitelist.findMany({
    orderBy: { createdAt: "desc" },
  })

  return list.map((item) => ({
    id: item.id,
    email: item.email,
    role: item.role,
    createdAt: item.createdAt.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }))
}

/**
 * Recupera tutte le segnalazioni di bug & feedback per il pannello Admin.
 */
export async function getBugReports(): Promise<BugReportDTO[]> {
  const reports = await prisma.bugReport.findMany({
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

  return reports.map((r) => ({
    id: r.id,
    userId: r.userId,
    author: {
      id: r.user.id,
      name: r.user.name || "Giocatore",
      color: r.user.color || DEFAULT_USER_COLOR,
      image: r.user.image,
    },
    description: r.description,
    category: r.category,
    priority: r.priority,
    status: r.status,
    createdAt: r.createdAt.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }))
}
