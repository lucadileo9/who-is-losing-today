"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CircleUserRound, LayoutDashboard, Sparkles, Sun, Moon, LogIn, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Avatar, Button } from "@/components/atoms"

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "Profilo", icon: CircleUserRound },
  ]

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "SB"

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-4" />
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold tracking-tight text-base sm:text-lg">Who Is Losing</span>
            <span className="rounded-md bg-chart-2/15 px-1.5 py-0.5 text-xs font-semibold text-chart-2">Today?</span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
                pathname === href && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-sm"
              )}
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {mounted && (
            <button
              aria-label="Cambia tema"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="grid size-9 place-items-center rounded-xl border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          )}

          {session?.user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" title="Vai al profilo" className="flex items-center gap-2">
                <Avatar initials={userInitials} className="size-9 bg-chart-1 text-xs font-semibold text-primary shadow-sm hover:ring-2 hover:ring-primary/40 transition-all">
                  {session.user.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={session.user.image} alt={session.user.name || "User"} className="size-full object-cover rounded-full" />
                  )}
                </Avatar>
                <span className="text-xs font-semibold hidden md:inline">{session.user.name}</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                title="Disconnetti"
              >
                <LogOut className="size-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => signIn("google")}
              className="h-9 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="size-3.5" />
              <span>Accedi</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
