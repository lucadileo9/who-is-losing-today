/**
 * Utility per la gestione e formattazione delle date
 */

export function getTodayIsoString(): string {
  return new Date().toISOString().split("T")[0]
}

export function shiftIsoDate(isoString: string, days: number): string {
  const current = new Date(isoString)
  current.setDate(current.getDate() + days)
  return current.toISOString().split("T")[0]
}

export function formatItalianDate(isoString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(isoString)
  return date.toLocaleDateString("it-IT", options || {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
