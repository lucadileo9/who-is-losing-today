/**
 * Utility per la gestione e formattazione delle date.
 * IMPORTANTE: tutte le funzioni usano il fuso orario locale del browser/server
 * per evitare BUG-04: con UTC, chi gioca dopo le 22:00 (ora italiana) vedrebbe
 * la data del giorno successivo.
 */

/**
 * Restituisce la data di oggi come stringa ISO (YYYY-MM-DD) nel fuso orario locale.
 */
export function getTodayIsoString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Sposta una data ISO (YYYY-MM-DD) di `days` giorni e restituisce la nuova stringa ISO.
 * Lavora in locale per restare coerente con getTodayIsoString.
 */
export function shiftIsoDate(isoString: string, days: number): string {
  // Parsing manuale: evita l'interpretazione UTC di new Date("YYYY-MM-DD")
  const [year, month, day] = isoString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatItalianDate(
  isoString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  // Parsing manuale per evitare shift UTC
  const [year, month, day] = isoString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(
    'it-IT',
    options || {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  );
}
