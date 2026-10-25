'use client';

import React, { useState, useTransition } from 'react';
import {
  Flame,
  Crown,
  Trophy,
  Palette,
  ShieldCheck,
  Gamepad2,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserProfileDTO } from '@/lib/types/user';
import { PlayerAvatar } from '@/components/atoms/PlayerAvatar';
import { StatCard } from '@/components/atoms/StatCard';
import { USER_PALETTE_PRESETS } from '@/lib/theme/colors';
import { updateUserColorAction } from '@/app/actions/user';

interface GamerCardProps {
  profile: UserProfileDTO;
  isSelf?: boolean;
  className?: string;
}

export function GamerCard({
  profile,
  isSelf = true,
  className,
}: GamerCardProps) {
  const {
    user,
    role,
    streak,
    streakRecord,
    totalGamesPlayed,
    dailyWinsCount,
    woodenSpoonsCount,
  } = profile;
  const [currentColor, setCurrentColor] = useState(user.color || '#06b6d4');
  const [isPending, startTransition] = useTransition();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = (newColor: string) => {
    if (newColor === currentColor || isPending) return;
    setCurrentColor(newColor);
    startTransition(async () => {
      await updateUserColorAction(newColor);
    });
  };

  return (
    <div
      className={cn(
        'glass-card relative overflow-hidden rounded-3xl border border-white/10 p-6 transition-all sm:p-8',
        className
      )}
    >
      {/* Glow d'accento di sfondo sul colore personalizzato */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full opacity-20 blur-3xl transition-colors duration-500"
        style={{ backgroundColor: currentColor }}
      />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Identità Giocatore */}
        <div className="flex items-center gap-4 sm:gap-5">
          <PlayerAvatar
            name={user.name}
            image={user.image}
            color={currentColor}
            size="xl"
            className="shrink-0 shadow-lg"
          />

          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-xl font-black text-white sm:text-2xl">
                {user.name}
              </h2>
              {role === 'ADMIN' && (
                <span className="flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-black text-amber-400">
                  <ShieldCheck className="size-3" />
                  ADMIN
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {totalGamesPlayed} partite completate
            </p>

            {/* Tasto per personalizzare il colore avatar */}
            {isSelf && (
              <div className="mt-2.5">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-all hover:bg-white/10 hover:text-white"
                >
                  <Palette className="size-3 text-cyan-400" />
                  <span>Personalizza Colore</span>
                  <span
                    className="ml-1 inline-block size-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: currentColor }}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Griglia Statistiche Badge Rapidi con StatCard */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          <StatCard
            label="Streak"
            value={streak}
            icon={Flame}
            iconColor="text-amber-400"
            subtext={`Record: ${streakRecord}`}
          />
          <StatCard
            label="Vittorie"
            value={dailyWinsCount}
            icon={Crown}
            iconColor="text-cyan-400"
            subtext="1° posto"
          />
          <StatCard
            label="Cucchiai"
            value={woodenSpoonsCount}
            icon={Trophy}
            iconColor="text-red-400"
            subtext="Ultimo"
          />
          <StatCard
            label="Partite"
            value={totalGamesPlayed}
            icon={Gamepad2}
            iconColor="text-emerald-400"
            subtext="Totali"
          />
        </div>
      </div>

      {/* Palette di colori a comparsa */}
      {showColorPicker && isSelf && (
        <div className="mt-6 border-t border-white/10 pt-4 animate-in fade-in">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Scegli il tuo colore neon distintivo:
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {USER_PALETTE_PRESETS.map((hex) => {
              const isSelected =
                currentColor.toLowerCase() === hex.toLowerCase();
              return (
                <button
                  key={hex}
                  type="button"
                  onClick={() => handleColorChange(hex)}
                  className={cn(
                    'flex size-8 cursor-pointer items-center justify-center rounded-xl border transition-all active:scale-95',
                    isSelected
                      ? 'scale-110 border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                      : 'border-transparent hover:scale-105'
                  )}
                  style={{ backgroundColor: hex }}
                  title={hex}
                >
                  {isSelected && (
                    <Check className="size-4 text-black drop-shadow" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
