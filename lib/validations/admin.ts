import { z } from 'zod';
import { Role, BugCategory, BugPriority } from '@prisma/client';

export const addWhitelistSchema = z.object({
  email: z.string().email('Indirizzo email non valido.').toLowerCase().trim(),
  role: z.nativeEnum(Role).default(Role.PLAYER),
});

export type AddWhitelistInput = z.infer<typeof addWhitelistSchema>;

export const submitBugSchema = z.object({
  description: z
    .string()
    .min(5, 'Descrizione troppo breve (min 5 caratteri).')
    .max(2000),
  category: z.nativeEnum(BugCategory).default(BugCategory.BUG),
  priority: z.nativeEnum(BugPriority).default(BugPriority.MEDIUM),
});

export type SubmitBugInput = z.infer<typeof submitBugSchema>;
