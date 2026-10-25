'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  LogIn,
  LogOut,
  ShieldAlert,
  User,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlayerAvatar } from '@/components/atoms/PlayerAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Chiudi il menu mobile al cambio di rotta
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/submit', label: 'Gioca', icon: PlusCircle },
    { href: '/bacheca', label: 'Bacheca', icon: MessageSquare },
    { href: '/players', label: 'Giocatori', icon: Users },
  ];

  const user = session?.user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#0a0b14]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6 md:h-16 lg:px-8">
        {/* Brand Logo - non si accavalla mai su mobile */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="relative size-8 shrink-0 overflow-hidden rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.35)] sm:size-9">
            <Image
              src="/logo.jpeg"
              alt="Who Is Losing Today"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-sm font-extrabold tracking-tight sm:text-base md:text-lg">
              <span className="text-white">Who Is Losing </span>
            </span>
            <span className="rounded-md border border-red-500/40 bg-red-500/15 px-1.5 py-0.5 text-[10px] font-black tracking-wide text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)] sm:text-xs">
              TODAY?
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all',
                  isActive
                    ? 'border border-cyan-500/30 bg-white/10 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className="size-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Section / Avatar Dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Menu profilo"
                  className="cursor-pointer rounded-full outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <PlayerAvatar
                    name={user.name || 'Utente'}
                    image={user.image}
                    color={user.color || '#3b82f6'}
                    size="sm"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="glass-card w-56 border-white/10 bg-[#121526] p-1.5 text-foreground shadow-2xl"
              >
                <DropdownMenuLabel className="p-2 font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    {isAdmin && (
                      <span className="mt-1 inline-flex w-fit items-center gap-1 rounded border border-amber-500/30 bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                        <ShieldAlert className="size-2.5" /> ADMIN
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-white/10 hover:text-white"
                    >
                      <User className="size-4 text-cyan-400" />
                      <span>Il mio Profilo</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/players"
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-white/10 hover:text-white"
                    >
                      <Users className="size-4 text-cyan-400" />
                      <span>Tutti i Giocatori</span>
                    </Link>
                  </DropdownMenuItem>

                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/bugs"
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-amber-400 hover:bg-amber-500/15"
                      >
                        <ShieldAlert className="size-4" />
                        <span>Pannello Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/dashboard' })}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-red-400 hover:bg-red-500/15 focus:text-red-400"
                >
                  <LogOut className="size-4" />
                  <span>Disconnetti</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-cyan-500 px-3 py-1.5 text-xs font-bold text-black shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all hover:bg-cyan-400 active:scale-95"
            >
              <LogIn className="size-3.5" />
              <span>Accedi</span>
            </button>
          )}

          {/* Hamburger Menu Toggle (visibile solo su mobile) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
            className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition-colors hover:bg-white/10 active:scale-95 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="size-5 text-cyan-400" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Menu a tendina per Mobile (apribile dall'header) */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#0a0b14]/95 px-4 py-3 backdrop-blur-2xl duration-200 animate-in slide-in-from-top-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all',
                    isActive
                      ? 'border border-cyan-500/30 bg-cyan-500/10 font-bold text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {user && (
            <div className="mt-3 flex flex-col gap-1 border-t border-white/10 pt-3">
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-semibold text-muted-foreground hover:bg-white/5 hover:text-white"
              >
                <User className="size-4 text-cyan-400" />
                <span>Il mio Profilo</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin/bugs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-semibold text-amber-400 hover:bg-amber-500/10"
                >
                  <ShieldAlert className="size-4" />
                  <span>Pannello Admin</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/dashboard' });
                }}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-left text-sm font-semibold text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="size-4" />
                <span>Disconnetti</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
