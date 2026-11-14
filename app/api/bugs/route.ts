import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin, getAuthenticatedUser } from '@/lib/auth-guard';
import { BugCategory, BugPriority } from '@prisma/client';
import { enforceUserRateLimit, RATE_LIMIT_POLICIES } from '@/lib/rate-limit';

// GET /api/bugs - Recupera la lista dei bug segnalati (Solo ADMIN)
export async function GET() {
  try {
    const auth = await getAuthenticatedAdmin();
    if (!auth.success) {
      const status = auth.error.includes('Accesso negato') ? 403 : 401;
      return NextResponse.json({ error: auth.error }, { status });
    }

    const rawBugs = await prisma.bugReport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const bugs = rawBugs.map((bug) => ({
      id: bug.id,
      userId: bug.userId,
      userName: bug.user?.name ?? null,
      userEmail: bug.user?.email ?? null,
      description: bug.description,
      category: bug.category,
      priority: bug.priority,
      status: bug.status,
      createdAt: bug.createdAt.toISOString(),
    }));

    return NextResponse.json({ bugs });
  } catch (error) {
    console.error('Errore GET /api/bugs:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero dei segnalazioni.' },
      { status: 500 }
    );
  }
}

// POST /api/bugs - Invia una nuova segnalazione bug (Utenti autenticati)
export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.success) {
      return NextResponse.json(
        { error: 'Devi essere autenticato per inviare una segnalazione.' },
        { status: 401 }
      );
    }

    // Protezione Rate Limiting Centralizzata (con Progressive Jail)
    const rateLimit = enforceUserRateLimit(auth.user, 'bug', RATE_LIMIT_POLICIES.BUGS);
    if (!rateLimit.ok) {
      return NextResponse.json({ error: rateLimit.error }, { status: 429 });
    }

    const body = await request.json();
    const { description, category = 'BUG', priority = 'MEDIUM' } = body;

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'La descrizione del problema non può essere vuota.' },
        { status: 400 }
      );
    }

    const validCategories = ['BUG', 'UI_UX', 'FEATURE', 'OTHER'];
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    const safeCategory = validCategories.includes(category) ? category : 'BUG';
    const safePriority = validPriorities.includes(priority)
      ? priority
      : 'MEDIUM';

    const bugReport = await prisma.bugReport.create({
      data: {
        userId: auth.user.id,
        description: description.trim(),
        category: safeCategory as BugCategory,
        priority: safePriority as BugPriority,
        status: 'OPEN',
      },
    });

    return NextResponse.json({ success: true, bugReport }, { status: 201 });
  } catch (error) {
    console.error('Errore POST /api/bugs:', error);
    return NextResponse.json(
      { error: 'Impossibile salvare la segnalazione bug nel database.' },
      { status: 500 }
    );
  }
}
