import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PATCH /api/bugs/[id] - Aggiorna lo stato di un bug (OPEN / RESOLVED)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !["OPEN", "RESOLVED", "CLOSED"].includes(status)) {
      return NextResponse.json({ error: "Stato non valido." }, { status: 400 })
    }

    const updatedBug = await prisma.bugReport.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ bugReport: updatedBug })
  } catch (error) {
    console.error("Errore PATCH /api/bugs/[id]:", error)
    return NextResponse.json({ error: "Impossibile aggiornare la segnalazione." }, { status: 500 })
  }
}

// DELETE /api/bugs/[id] - Elimina una segnalazione dal DB
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.bugReport.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Errore DELETE /api/bugs/[id]:", error)
    return NextResponse.json({ error: "Impossibile eliminare la segnalazione." }, { status: 500 })
  }
}
