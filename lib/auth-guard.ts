import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: Role;
  color: string;
}

type AuthResult =
  | { success: true; user: AuthenticatedUser }
  | { success: false; error: string };

type AdminResult =
  | { success: true; admin: AuthenticatedUser }
  | { success: false; error: string };

/**
 * Verifica che l'utente corrente sia autenticato con una sessione valida.
 * Restituisce l'utente tipizzato con id, role, color, ecc., oppure un messaggio di errore standard.
 */
export async function getAuthenticatedUser(): Promise<AuthResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session?.user?.email) {
    return {
      success: false,
      error: "Devi aver effettuato l'accesso per compiere questa operazione.",
    };
  }

  return {
    success: true,
    user: session.user as AuthenticatedUser,
  };
}

/**
 * Verifica che l'utente corrente sia autenticato e possieda il ruolo ADMIN.
 */
export async function getAuthenticatedAdmin(): Promise<AdminResult> {
  const auth = await getAuthenticatedUser();

  if (!auth.success) {
    return auth;
  }

  if (auth.user.role !== 'ADMIN') {
    return {
      success: false,
      error:
        'Accesso negato: questa operazione richiede privilegi di amministratore.',
    };
  }

  return {
    success: true,
    admin: auth.user,
  };
}
