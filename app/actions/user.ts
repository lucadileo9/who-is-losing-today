'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-guard';
import { updateUserColorSchema } from '@/lib/validations/user';

export async function updateUserColorAction(colorHex: string) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.success) {
      return { success: false, error: auth.error };
    }

    const parsed = updateUserColorSchema.safeParse({ colorHex });
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || 'Colore non valido.',
      };
    }

    const user = await prisma.user.update({
      where: { id: auth.user.id },
      data: { color: parsed.data.colorHex },
    });

    revalidatePath('/profile');
    revalidatePath(`/profile/${user.id}`);
    revalidatePath('/dashboard');

    return { success: true, newColor: user.color };
  } catch (error) {
    console.error('Errore updateUserColorAction:', error);
    return { success: false, error: 'Impossibile aggiornare il colore.' };
  }
}
