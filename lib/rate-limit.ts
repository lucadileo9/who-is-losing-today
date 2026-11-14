/**
 * In-memory sliding window rate limiter con penalità progressiva (Jail).
 * Implementazione leggera senza dipendenze esterne (es. Redis),
 * specificamente progettata per container singoli Node.js / Next.js standalone.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
  violations: number;
  isJailed: boolean;
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
   * Finestra temporale base in millisecondi (es. 60_000 = 1 minuto).
   */
  windowMs: number;
  /**
   * Etichetta leggibile opzionale per i log di sicurezza (es. "Mario Rossi (mario@email.com)").
   */
  label?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  isJailed: boolean;
  retryAfterSeconds: number;
}

/**
 * Durate di penalità incrementale (Jail) in millisecondi:
 * - 1° livello di insistenza (2x limite): 5 minuti di blocco
 * - 2° livello di insistenza (4x limite): 30 minuti di blocco esteso
 */
const JAIL_LEVEL_1_MS = 5 * 60 * 1000;
const JAIL_LEVEL_2_MS = 30 * 60 * 1000;

/**
 * Verifica se l'identificatore fornito ha superato la soglia di richieste consentite
 * e applica penalità progressive (Jail) in caso di tentativi massivi continuati.
 *
 * @param identifier Chiave univoca (es. `score:userId` o `ip:address`)
 * @param options Configurazione di limite, finestra temporale e label utente
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const existing = rateLimitStore.get(identifier);
  const displayLabel = options.label ? `"${options.label}" [${identifier}]` : `"${identifier}"`;

  // Nuova finestra o record scaduto: reset completo
  if (!existing || now > existing.resetTime) {
    const record: RateLimitRecord = {
      count: 1,
      resetTime: now + options.windowMs,
      violations: 0,
      isJailed: false,
    };
    rateLimitStore.set(identifier, record);
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      resetTime: record.resetTime,
      isJailed: false,
      retryAfterSeconds: Math.ceil(options.windowMs / 1000),
    };
  }

  // Se l'utente ha raggiunto o superato il limite consentito
  if (existing.count >= options.limit) {
    existing.count += 1;
    const retryAfter = Math.max(1, Math.ceil((existing.resetTime - now) / 1000));

    // Livello 2 di Jail: insistenza massiva (>= 4x limite)
    if (existing.count >= options.limit * 4) {
      if (!existing.isJailed || existing.violations < 2) {
        existing.isJailed = true;
        existing.violations = 2;
        existing.resetTime = now + JAIL_LEVEL_2_MS;
        console.error(
          `🚨 [SECURITY CRITICAL JAIL] Soglia critica superata per ${displayLabel}: ` +
            `${existing.count} tentativi massivi. Attivata sospensione estesa (Jail) di 30 minuti.`
        );
      }
      return {
        success: false,
        limit: options.limit,
        remaining: 0,
        resetTime: existing.resetTime,
        isJailed: true,
        retryAfterSeconds: Math.max(1, Math.ceil((existing.resetTime - now) / 1000)),
      };
    }

    // Livello 1 di Jail: insistenza media (>= 2x limite)
    if (existing.count >= options.limit * 2) {
      if (!existing.isJailed) {
        existing.isJailed = true;
        existing.violations = 1;
        existing.resetTime = now + JAIL_LEVEL_1_MS;
        console.warn(
          `⚠️ [SECURITY JAIL] Penalità progressiva attivata per ${displayLabel}: ` +
            `${existing.count} richieste consecutive. Sospensione temporanea estesa a 5 minuti.`
        );
      }
      return {
        success: false,
        limit: options.limit,
        remaining: 0,
        resetTime: existing.resetTime,
        isJailed: true,
        retryAfterSeconds: Math.max(1, Math.ceil((existing.resetTime - now) / 1000)),
      };
    }

    // Violazione standard (primo superamento limite entro la finestra)
    console.warn(
      `[SECURITY WARNING] Rate limit superato per ${displayLabel}: ` +
        `${existing.count} richieste effettuate (limite massimo: ${options.limit} ogni ${Math.round(options.windowMs / 1000)}s)`
    );

    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      resetTime: existing.resetTime,
      isJailed: existing.isJailed,
      retryAfterSeconds: retryAfter,
    };
  }

  // Richiesta lecita all'interno della soglia
  existing.count += 1;
  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - existing.count,
    resetTime: existing.resetTime,
    isJailed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetTime - now) / 1000)),
  };
}
