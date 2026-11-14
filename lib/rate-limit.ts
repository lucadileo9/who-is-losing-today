/**
 * In-memory sliding window rate limiter.
 * Implementazione leggera senza dipendenze esterne (es. Redis),
 * specificamente progettata per container singoli Node.js / Next.js standalone.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Pulizia periodica automatica ogni 10 minuti per prevenire memory leak
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 10 * 60 * 1000);

  // In ambiente Node.js, unref() evita che il timer mantenga attivo il processo
  if (typeof timer.unref === 'function') {
    timer.unref();
  }
}

export interface RateLimitOptions {
  /**
   * Numero massimo di richieste consentite nella finestra temporale.
   */
  limit: number;
  /**
   * Finestra temporale in millisecondi (es. 60_000 = 1 minuto).
   */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

/**
 * Verifica se l'identificatore fornito ha superato la soglia di richieste consentite.
 * @param identifier Chiave univoca (es. `score:userId` o `ip:address`)
 * @param options Configurazione di limite e finestra temporale
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const existing = rateLimitStore.get(identifier);

  if (!existing || now > existing.resetTime) {
    const record: RateLimitRecord = {
      count: 1,
      resetTime: now + options.windowMs,
    };
    rateLimitStore.set(identifier, record);
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      resetTime: record.resetTime,
    };
  }

  if (existing.count >= options.limit) {
    existing.count += 1;
    console.warn(
      `[SECURITY WARNING] Rate limit superato per "${identifier}": ` +
        `${existing.count} richieste effettuate (limite massimo: ${options.limit} ogni ${Math.round(options.windowMs / 1000)}s)`
    );

    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      resetTime: existing.resetTime,
    };
  }

  existing.count += 1;
  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - existing.count,
    resetTime: existing.resetTime,
  };
}
