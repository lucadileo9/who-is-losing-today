import { Metadata } from "next"
import React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/atoms/ThemeProvider"
import { Providers } from "@/components/atoms/Providers"

export const metadata: Metadata = {
  title: "Who is Losing Today - Classifica Punteggi",
  description: "Gestione punteggi e sfide tra amici per Krilion, Metazooa e Chronophoto",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
