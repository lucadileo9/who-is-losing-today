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
import { updateUserColorAction } from '@/app/actions/user';

interface GamerCardProps {
  profile: UserProfileDTO;
  isSelf?: boolean;
  className?: string;
}

const PRESET_COLORS = [
  '#06b6d4', // Cyan (Default brand)
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ef4444', // Red
  '#14b8a6', // Teal
];

export function GamerCard({
  profile,
  isSelf = true,
  className,
}: GamerCardProps) {
  const { user, role, streak, streakRecord, totalGamesPlayed, dailyWinsCount, woodenSpoonsCount } = profile;
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
        'glass-card relative overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-8 transition-all',
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

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white truncate">
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
                    className="size-2.5 rounded-full border border-white/20 ml-1 inline-block"
                    style={{ backgroundColor: currentColor }}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Griglia Statistiche Badge Rapidi */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {/* Streak Attuale */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center sm:min-w-[85px]">
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase">
              <Flame className="size-3.5" />
              Streak
            </span>
            <span className="mt-1 text-xl sm:text-2xl font-black text-white">
              {streak}
            </span>
            <span className="text-[10px] text-muted-foreground">
              Record: {streakRecord}
            </span>
          </div>

          {/* Vittorie Giornaliere */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center sm:min-w-[85px]">
            <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 uppercase">
              <Crown className="size-3.5" />
              Vittorie
            </span>
            <span className="mt-1 text-xl sm:text-2xl font-black text-white">
              {dailyWinsCount}
            </span>
            <span className="text-[10px] text-muted-foreground">1° posto</span>
          </div>

          {/* Cucchiai di Legno */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center sm:min-w-[85px]">
            <span className="flex items-center gap-1 text-[11px] font-bold text-red-400 uppercase">
              <Trophy className="size-3.5" />
              Cucchiai
            </span>
            <span className="mt-1 text-xl sm:text-2xl font-black text-white">
              {woodenSpoonsCount}
            </span>
            <span className="text-[10px] text-muted-foreground">Ultimo</span>
          </div>

          {/* Totale Sfide */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center sm:min-w-[85px]">
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 uppercase">
              <Gamepad2 className="size-3.5" />
              Partite
            </span>
            <span className="mt-1 text-xl sm:text-2xl font-black text-white">
              {totalGamesPlayed}
            </span>
            <span className="text-[10px] text-muted-foreground">Totali</span>
          </div>
        </div>
      </div>

      {/* Palette di colori a comparsa */}
      {showColorPicker && isSelf && (
        <div className="mt-6 border-t border-white/10 pt-4 animate-in fade-in">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
            Scegli il tuo colore neon distintivo:
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_COLORS.map((hex) => {
              const isSelected = currentColor.toLowerCase() === hex.toLowerCase();
              return (
                <button
                  key={hex}
                  type="button"
                  onClick={() => handleColorChange(hex)}
                  className={cn(
                    'flex size-8 cursor-pointer items-center justify-center rounded-xl border transition-all active:scale-95',
                    isSelected
                      ? 'border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                      : 'border-transparent hover:scale-105'
                  )}
                  style={{ backgroundColor: hex }}
                  title={hex}
                >
                  {isSelected && <Check className="size-4 text-black drop-shadow" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
