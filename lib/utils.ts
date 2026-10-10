import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BASE_PATH = "/who-is-losing-today"

/**
 * Restituisce il percorso API completo aggiungendo il basePath se necessario
 */
export function getApiPath(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  if (cleanPath.startsWith(BASE_PATH)) return cleanPath
  return `${BASE_PATH}${cleanPath}`
}

/**
 * Wrapper per fetch che aggiunge automaticamente il basePath per le chiamate API
 */
export function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  return fetch(getApiPath(input), init)
}
