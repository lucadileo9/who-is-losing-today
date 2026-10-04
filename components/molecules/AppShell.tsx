"use client"

import React from "react"
import { Header } from "@/components/organisms/Header"
import { Footer } from "@/components/molecules/Footer"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
