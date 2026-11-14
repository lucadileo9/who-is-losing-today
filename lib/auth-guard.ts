import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
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
 * Indicato per Route Handlers (API) e Server Actions.
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
 * Indicato per Route Handlers (API) e Server Actions amministrative.
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

/**
 * Guard server-side per pagine (Server Components).
 * Se l'utente non è autenticato con una sessione valida, reindirizza alla home ('/').
 * Se autenticato, restituisce la sessione tipizzata garantendo che l'utente sia presente.
 */
export async function requireAuthPage(redirectTo: string = '/'): Promise<Session> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(redirectTo);
  }

  return session;
}
