import { PrismaClient } from '@prisma/client';
import { validateEnv } from '@/lib/env';

// Verifica la correttezza delle variabili d'ambiente a runtime
validateEnv();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
