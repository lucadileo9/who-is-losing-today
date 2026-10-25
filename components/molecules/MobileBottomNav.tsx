'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, PlusCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();

  const items = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/submit', label: 'Gioca', icon: PlusCircle, isPrimary: true },
    { href: '/bacheca', label: 'Bacheca', icon: MessageSquare },
    { href: '/profile', label: 'Profilo', icon: User },
  ];

  return (
    <nav
      aria-label="Navigazione mobile"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0a0b14]/90 px-2 py-1.5 backdrop-blur-2xl md:hidden"
    >
      <div className="flex items-center justify-around">
        {items.map(({ href, label, icon: Icon, isPrimary }) => {
          const isActive = pathname === href;

          if (isPrimary) {
            return (
              <Link
                key={href}
                href={href}
                className="group -mt-4 flex flex-col items-center focus:outline-none"
              >
                <div
                  className={cn(
                    'flex size-12 items-center justify-center rounded-full shadow-lg transition-transform group-active:scale-90',
                    isActive
                      ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                      : 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  )}
                >
                  <Icon className="size-6 stroke-[2.5]" />
                </div>
                <span className="mt-0.5 text-[10px] font-bold text-cyan-400">
                  {label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-xs font-semibold transition-colors focus:outline-none',
                isActive
                  ? 'text-cyan-400'
                  : 'text-muted-foreground hover:text-white'
              )}
            >
              <Icon className="size-5" />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
