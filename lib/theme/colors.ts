/**
 * Single Source of Truth per la palette colori dell'applicazione.
 * Importato da tailwind.config.js, componenti React (Recharts SVG) e DAL.
 */

export const BRAND_COLORS = {
  loser: '#ef4444', // Neon Crimson (perdente)
  winner: '#f59e0b', // Cyber Gold (vincente)
  krilion: '#10b981', // Smeraldo Neon
  metazooa: '#f97316', // Arancione Safari
  chronophoto: '#8b5cf6', // Viola Synthwave
  totale: '#3b82f6', // Blu Zaffiro
  space: '#0a0b14', // Sfondo dark deep space
  surface: '#121526', // Superficie card glassmorphism
} as const;

export const DEFAULT_USER_COLOR = '#3b82f6';

export const DEFAULT_GAME_FALLBACKS = [
  {
    id: 'Krilion',
    name: 'Krilion',
    shortName: 'KR',
    isLowerBetter: false,
    color: BRAND_COLORS.krilion,
  },
  {
    id: 'Metazooa',
    name: 'Metazooa',
    shortName: 'MZ',
    isLowerBetter: true,
    color: BRAND_COLORS.metazooa,
  },
  {
    id: 'Chronophoto',
    name: 'Chronophoto',
    shortName: 'CH',
    isLowerBetter: false,
    color: BRAND_COLORS.chronophoto,
  },
] as const;

export const USER_PALETTE_PRESETS = [
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#84cc16', // Lime
] as const;
