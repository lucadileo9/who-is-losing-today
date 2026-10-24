import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Se l'utente cerca di accedere alla rotta admin ma non ha ruolo ADMIN, reindirizza
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Rotte pubbliche accessibili a tutti
        if (
          pathname === "/" ||
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/auth") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/favicon.ico")
        ) {
          return true
        }

        // Tutte le altre rotte private (profile, submit, bacheca, admin) richiedono login
        return Boolean(token)
      },
    },
    pages: {
      signIn: "/dashboard",
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/submit/:path*",
    "/bacheca/:path*",
  ],
}
