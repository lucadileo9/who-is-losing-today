import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { DEFAULT_USER_COLOR } from '@/lib/theme/colors';
import { Adapter } from 'next-auth/adapters';
import { Role } from '@prisma/client';

const useSecureCookies =
  process.env.NODE_ENV === 'production' ||
  process.env.NEXTAUTH_URL?.startsWith('https://');

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  useSecureCookies,
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo-google-client-id',
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || 'demo-google-client-secret',
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Utente Demo (Locale)',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'sara@whoislosing.local',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const targetEmail = credentials.email.trim().toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email: targetEmail },
        });
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            color: user.color,
          };
        }
        const newUser = await prisma.user.create({
          data: {
            email: targetEmail,
            name: targetEmail.split('@')[0],
            initials: targetEmail.substring(0, 2).toUpperCase(),
            color: DEFAULT_USER_COLOR,
            role: Role.PLAYER,
          },
        });
        return {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          image: newUser.image,
          role: newUser.role,
          color: newUser.color,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    error: '/auth/unauthorized',
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const email = user.email.toLowerCase().trim();

      // 1. Verifica Whitelist dal database
      const allowed = await prisma.whitelist.findUnique({
        where: { email },
      });

      // 2. Controllo variabile d'ambiente per fallback iniziale o seed (se definita)
      const envAllowed = process.env.ALLOWED_EMAILS?.toLowerCase()
        .split(',')
        .map((e) => e.trim());

      const isAllowed = Boolean(
        allowed || (envAllowed && envAllowed.includes(email))
      );

      if (!isAllowed) {
        console.warn(
          `[AUTH] Accesso negato per email non in whitelist: ${email}`
        );
        return '/auth/unauthorized';
      }

      // Se l'utente non ha ancora un ruolo allineato, aggiornalo con quello della whitelist
      if (allowed) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser && existingUser.role !== allowed.role) {
          await prisma.user.update({
            where: { email },
            data: { role: allowed.role },
          });
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const email = user.email.toLowerCase().trim();
        const dbUser = await prisma.user.findUnique({
          where: { email },
          select: { id: true, role: true, color: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.color = dbUser.color;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.role = (token.role as Role) || Role.PLAYER;
        session.user.color = (token.color as string) || DEFAULT_USER_COLOR;
      }
      return session;
    },
  },
  // In produzione a runtime NextAuth esige NEXTAUTH_SECRET (o AUTH_SECRET).
  // A build-time (es. docker build) Next.js esegue le route per static analysis: usiamo un fallback per non far fallire la compilazione.
  secret:
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    'super_secret_local_dev_key_12345',
};
