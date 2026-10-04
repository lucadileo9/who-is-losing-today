"use client"

import type { ReactNode } from "react"
import { Avatar as ShadcnAvatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge as ShadcnBadge } from "@/components/ui/badge"
import { Button as ShadcnButton } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Button(props: React.ComponentProps<typeof ShadcnButton>) {
  return <ShadcnButton {...props} />
}

export function Input(props: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        props.className
      )}
      {...props}
    />
  )
}

export function Badge(props: React.ComponentProps<typeof ShadcnBadge>) {
  return <ShadcnBadge {...props} />
}

export function Avatar({ initials, className, children }: { initials?: string; className?: string; children?: ReactNode }) {
  return <ShadcnAvatar className={className}>{children ?? <AvatarFallback>{initials}</AvatarFallback>}</ShadcnAvatar>
}

export { ThemeProvider } from "./ThemeProvider"
export { Providers } from "./Providers"
