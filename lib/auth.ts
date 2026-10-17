import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { Adapter } from "next-auth/adapters"

const useSecureCookies = process.env.NODE_ENV === "production" || process.env.NEXTAUTH_URL?.startsWith("https://")

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  useSecureCookies,
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "demo-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo-google-client-secret",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Utente Demo (Locale)",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "sara@example.com" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        const targetEmail = credentials.email.trim().toLowerCase()
        const user = await prisma.user.findUnique({
          where: { email: targetEmail },
        })
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }
        }
        const newUser = await prisma.user.create({
          data: {
            email: targetEmail,
            name: targetEmail.split("@")[0],
            initials: targetEmail.substring(0, 2).toUpperCase(),
            color: "bg-chart-1",
          },
        })
        return {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          image: newUser.image,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        ;(session.user as { id?: string }).id = token.sub
      }
      return session
    },
  },
  // SEC-03 FIX: in produzione, NEXTAUTH_SECRET deve essere definita esplicitamente.
  // Il fallback hardcoded è accettabile solo in locale/dev.
  secret: (() => {
    if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXTAUTH_SECRET non è definita. Impostala come variabile d'ambiente in produzione."
      )
    }
    return process.env.NEXTAUTH_SECRET || "super_secret_local_dev_key_12345"
  })(),
}
