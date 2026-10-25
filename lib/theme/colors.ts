/**
 * Single Source of Truth per la palette colori dell'applicazione.
 * Importato da tailwind.config.js, componenti React (Recharts SVG) e DAL.
 */

import brandColors from './brand-colors.json';

export const BRAND_COLORS = brandColors as {
  readonly loser: '#ef4444';
  readonly winner: '#f59e0b';
  readonly krilion: '#10b981';
  readonly metazooa: '#f97316';
  readonly chronophoto: '#8b5cf6';
  readonly totale: '#3b82f6';
  readonly space: '#0a0b14';
  readonly surface: '#121526';
};

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
