import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

import { Adapter } from "next-auth/adapters"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
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
        // Se l'utente non esiste, lo crea al volo
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
  secret: process.env.NEXTAUTH_SECRET || "super_secret_local_dev_key_12345",
}
