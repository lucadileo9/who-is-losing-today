"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Avatar({
  className,
  children,
  initials,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { initials?: string }) {
  return (
    <div
      className={cn(
        "relative flex size-9 shrink-0 overflow-hidden rounded-full bg-muted items-center justify-center text-sm font-semibold select-none",
        className
      )}
      {...props}
    >
      {children ?? <span className="uppercase">{initials}</span>}
    </div>
  )
}

function AvatarFallback({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground", className)} {...props}>
      {children}
    </div>
  )
}

function AvatarImage({ className, alt = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={cn("aspect-square size-full object-cover", className)} alt={alt} {...props} />
}

export { Avatar, AvatarImage, AvatarFallback }
