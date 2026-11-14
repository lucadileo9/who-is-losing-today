import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL è obbligatoria per il collegamento a PostgreSQL'),
  NEXTAUTH_SECRET: z
    .string()
    .min(16, 'NEXTAUTH_SECRET deve avere almeno 16 caratteri per garantire adeguata entropia')
    .optional(),
  NEXTAUTH_URL: z
    .string()
    .url('NEXTAUTH_URL deve essere un URL valido (es. http://localhost:3000)')
    .optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  ALLOWED_EMAILS: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

/**
 * Valida la configurazione delle variabili d'ambiente a runtime.
 * Previene avviamenti scorretti in produzione e fornisce messaggi diagnostici dettagliati.
 */
export function validateEnv(): Env {
  if (validatedEnv) return validatedEnv;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formattedErrors = result.error.issues
      .map((issue) => `  - [${issue.path.join('.')}] ${issue.message}`)
      .join('\n');

    console.warn(
      `\n⚠️ [CONFIG] Attenzione configurazione variabili d'ambiente:\n${formattedErrors}\n`
    );

    // Evita crash durante 'next build' o 'docker build' se i segreti vengono iniettati solo a runtime
    const isBuildPhase =
      process.env.NEXT_PHASE === 'phase-production-build' ||
      process.env.npm_lifecycle_event === 'build';

    if (process.env.NODE_ENV === 'production' && !isBuildPhase) {
      throw new Error(
        `Configurazione variabili d'ambiente non valida a runtime:\n${formattedErrors}`
      );
    }
  }

  validatedEnv = (result.success ? result.data : process.env) as Env;
  return validatedEnv;
}
