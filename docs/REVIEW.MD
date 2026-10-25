# Code Review Completa — Who Is Losing Today?

> Revisione indipendente dell'intero codebase. Stack: Next.js 15 (App Router) ·
> React 18 · Prisma 6.4 · NextAuth v4 · PostgreSQL · Tailwind CSS

---

## Indice

1. [ Bug ed Errori Logici](#-bug-ed-errori-logici)
2. [ Sicurezza](#-sicurezza)
3. [ Codice Duplicato / Ripetuto](#-codice-duplicato--ripetuto)
4. [ Architettura & Best Practices](#-architettura--best-practices)
5. [ Performance & Ottimizzazione](#-performance--ottimizzazione)
6. [ Documentazione & README](#-documentazione--readme)
7. [ Codice Morto / Inutilizzato](#-codice-morto--inutilizzato)
8. [ UI/UX & Componenti](#-uiux--componenti)
9. [ Dipendenze & Configurazione](#-dipendenze--configurazione)
10. [ Tabella Riepilogativa](#-tabella-riepilogativa)

---

## Bug ed Errori Logici

### BUG-01 · `getPlayersFromDb()` — Calcolo streak falso

**File:**
[`db-service.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/services/db-service.ts#L56)
**Severità:** Alta

```typescript
streak: Math.min(14, Math.max(1, playedCount)),
```

La streak è calcolata come `min(14, max(1, playedCount))` — cioè è **sempre ≥
1** e al massimo 14. Questo non è una streak reale (giorni consecutivi di
gioco), è solo il numero totale di punteggi clampato. Un utente che ha giocato
50 partite sparse nell'arco di mesi vedrà "streak: 14" anche se non gioca da
settimane.

> [!IMPORTANT] Il calcolo della streak reale esiste **correttamente** in
> [`user-service.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/services/user-service.ts#L82-L107),
> ma `db-service.ts` usa una formula inventata. Questo causa un'incoerenza tra i
> dati della dashboard (streak falsa) e quelli del profilo (streak vera).

**Fix:** Replicare la logica corretta di `getUserProfileStats()` anche in
`getPlayersFromDb()`, oppure centralizzare il calcolo in un'unica funzione
condivisa.

---

### BUG-02 · `calculateNormalizedScore` per Metazooa — Score negativo possibile

**File:**
[`game-data.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/game-data.ts#L134-L138)
**Severità:** Media

```typescript
if (game === 'Metazooa') {
  return Math.max(0, 100 - (score - 1) * 10);
}
```

Se `score = 0` (Metazooa con 0 tentativi — dato invalido), il risultato è
`Math.max(0, 100 - (-1) * 10) = 110`. Il `Math.max(0, ...)` protegge dal
negativo, ma non dal **superamento di 100**. Se score è 0, dovrebbe ritornare 0
o essere validato come input invalido.

**Fix:** Aggiungere `Math.min(100, ...)` o validare `score >= 1`.

---

### BUG-03 · Media "Totale" calcolata su 3 giochi anche se ne mancano

**File:**
[`user-service.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/services/user-service.ts#L129)
e
[`db-service.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/services/db-service.ts#L116)
**Severità:** Alta

```typescript
const todayTotal = hasPlayedToday
  ? Math.round((krNorm + mzNorm + chNorm) / 3)
  : null;
```

Se un utente ha giocato solo a Krilion oggi (krNorm=90, mzNorm=0, chNorm=0), il
totale è `90 / 3 = 30`. Ma l'utente ha fatto un'ottima partita! La divisione è
sempre per 3 anche se ha giocato un solo gioco.

Lo stesso problema si ripete in:

- [`db-service.ts:116`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/services/db-service.ts#L116)
  (`getGroupPlayerTrendFromDb`)
- [`db-service.ts:174-175`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/services/db-service.ts#L174-L175)
  (`getDailySummaryFromDb`)
- [`user-service.ts:251-254`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/services/user-service.ts#L251-L254)
  (`getUserTrend`)

**Fix:** Dividere per il numero di giochi effettivamente giocati
(`count > 0 ? sum / count : 0`).

---

### BUG-04 · `date-utils.ts` — Fuso orario inconsistente

**File:**
[`date-utils.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/date-utils.ts#L5-L7)
**Severità:** Media

```typescript
export function getTodayIsoString(): string {
  return new Date().toISOString().split('T')[0];
}
```

`new Date().toISOString()` restituisce la data in **UTC**. Se l'utente gioca
alle 23:30 ora italiana (UTC+2), `toISOString()` ritorna la data del giorno
successivo (01:30 UTC). Questo impatta:

- `selectedDateStr` in `DailySummaryCards` (potrebbe mostrare la giornata
  sbagliata)
- Calcolo streak in `user-service.ts` (stesse stringhe UTC)
- `todayDate` in `POST /api/scores` (almeno qui usa `setHours(0,0,0,0)` locale,
  creando incoerenza con il resto)

**Fix:** Usare una funzione che calcola la data nel fuso orario locale o fissare
un fuso orario di riferimento (es. `Europe/Rome`).

---

### BUG-05 · `POST /api/scores` — Utente fantasma senza auth

**File:**
[`scores/route.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/api/scores/route.ts#L66-L70)
**Severità:** Media

```typescript
if (!user) {
  user = await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' },
  });
}
```

Se non c'è sessione e non c'è email, il punteggio viene assegnato **al primo
utente mai creato nel database**. Questo significa che chiunque può inviare
richieste non autenticate e far risultare punteggi sotto il profilo di un altro
utente reale.

**Fix:** Se non c'è sessione, restituire 401. Il fallback al primo utente è
pericoloso.

---

### BUG-06 · `GET /api/notes` — Side-effect distruttivo su operazione di lettura

**File:**
[`notes/route.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/api/notes/route.ts#L11-L18)
**Severità:** Media

```typescript
// Auto-pulizia: DELETE dentro una GET
await prisma.dailyNote.deleteMany({
  where: { createdAt: { lt: sevenDaysAgo } },
});
```

Una `GET` non dovrebbe avere side-effect distruttivi. Se il browser o un proxy
fa prefetch/cache di questa route, potrebbe scatenare cancellazioni
indesiderate. Inoltre, ogni singola GET fa una DELETE, il che è inefficiente.

**Fix:** Spostare la pulizia in un cron job o in un middleware dedicato.

---

## Sicurezza

### SEC-01 · Pagina admin senza protezione

**File:**
[`admin/bugs/page.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/admin/bugs/page.tsx)
**Severità:** Critica

La pagina `/admin/bugs` è accessibile a **qualsiasi utente** (anche non
autenticato). Non c'è alcun middleware o controllo di ruolo. Chiunque conosce
l'URL può:

- Leggere tutte le segnalazioni bug (con email degli utenti)
- Eliminare qualsiasi segnalazione (`DELETE /api/bugs/[id]`)
- Cambiare lo stato dei bug (`PATCH /api/bugs/[id]`)

Le relative API
([`/api/bugs`](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/api/bugs/route.ts)
e
[`/api/bugs/[id]`](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/api/bugs/%5Bid%5D/route.ts))
non hanno nessun controllo di autenticazione né di autorizzazione.

**Fix:**

1. Aggiungere un middleware Next.js per le route `/admin/*`
2. Verificare il ruolo admin nelle API `PATCH` e `DELETE`
3. Aggiungere un campo `role` allo schema User in Prisma

---

### SEC-02 · `GET /api/dashboard` — Dati sensibili esposti senza auth

**File:**
[`dashboard/route.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/api/dashboard/route.ts)
**Severità:** Media

La route `/api/dashboard` restituisce tutti i giocatori con ID, nomi, colori,
punteggi e trend senza richiedere autenticazione. Per un'app tra amici può
essere accettabile, ma è da documentare come scelta consapevole.

---

### SEC-03 · Secret NextAuth hardcoded nel fallback

**File:**
[`auth.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/auth.ts#L65)
**Severità:** Media

```typescript
secret: process.env.NEXTAUTH_SECRET || "super_secret_local_dev_key_12345",
```

Il fallback hardcoded finisce in produzione se la env var manca. In deploy
Vercel, `NEXTAUTH_SECRET` potrebbe non essere settata e il server userebbe un
segreto noto pubblicamente (è nel README e nel `.env.example`).

**Fix:** Lanciare un errore esplicito se `NEXTAUTH_SECRET` non è definita in
produzione.

---

### SEC-04 · `allowDangerousEmailAccountLinking: true`

**File:**
[`auth.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/auth.ts#L15)
**Severità:** Media

Questo flag permette a chiunque con accesso a un indirizzo email di collegare un
account Google esistente. Se un attaccante ha un account Google con la stessa
email di un utente demo (creato via Credentials provider), potrebbe prendere il
controllo dell'account.

---

### SEC-05 · Nessuna validazione/sanitizzazione input nelle API

**File:** Tutte le route API **Severità:** Media

Non viene usata nessuna libreria di validazione (Zod, Yup, Valibot). I parametri
sono estratti con `body.game`, `body.score`, ecc. senza type-checking runtime.
Prisma protegge da SQL injection, ma manca protezione contro:

- Payload malformati
- Tipi inaspettati (`score` stringa anziché numero)
- XSS nel campo `description` dei bug report o `content` delle note
  (visualizzato in JSX, React fa escape automatico — ma è best practice validare
  comunque server-side)

---

## Codice Duplicato / Ripetuto

### DUP-01 · Pattern `scoreUpdated` Event ripetuto in 5 componenti

**Severità:** Media

Il pattern identico di listener per l'evento `scoreUpdated` è copiato in:

| Componente          | File                                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `DashboardPage`     | [`dashboard/page.tsx:39-51`](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/dashboard/page.tsx#L39-L51)                        |
| `DailySummaryCards` | [`DailySummaryCards.tsx:45-57`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/organisms/DailySummaryCards.tsx#L45-L57) |
| `LeaderboardTable`  | [`LeaderboardTable.tsx:30-46`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/organisms/LeaderboardTable.tsx#L30-L46)   |
| `TrendChart`        | [`TrendChart.tsx:32-49`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/organisms/TrendChart.tsx#L32-L49)               |
| `useUserStats`      | [`use-user-stats.ts:82-98`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/hooks/use-user-stats.ts#L82-L98)                    |

**Fix:** Estrarre un hook custom `useScoreUpdateListener(callback)`.

---

### DUP-02 · Calcolo iniziali utente duplicato in 4 punti

**Severità:** Bassa

Il codice per calcolare le iniziali dall'nome è ripetuto identicamente in:

- [`Header.tsx:27-34`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/organisms/Header.tsx#L27-L34)
- [`profile/page.tsx:54-59`](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/profile/page.tsx#L54-L59)
- [`notes/route.ts:64-68`](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/api/notes/route.ts#L64-L68)
  (due volte: GET e POST)
- [`scores/route.ts:46-51`](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/api/scores/route.ts#L46-L51)

**Fix:** Creare una funzione `getInitials(name: string): string` in `utils.ts`.

---

### DUP-03 · Fetch `/api/dashboard` duplicato in 3 componenti

**Severità:** Media

Tre componenti nella stessa pagina Dashboard (`DashboardPage`,
`LeaderboardTable`, `TrendChart`) fetchano ciascuno `/api/dashboard`
**indipendentemente**, causando 3 richieste HTTP identiche al caricamento. E ad
ogni `scoreUpdated`, scattano **altre 3 richieste**.

**Fix:** Centralizzare i dati della dashboard in un Context o in un hook
condiviso, oppure usare SWR/React Query con deduplicazione automatica.

---

### DUP-04 · `DashboardTemplate` e `ProfileTemplate` — Identici

**File:**
[`DashboardTemplate.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/templates/DashboardTemplate.tsx)
e
[`ProfileTemplate.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/templates/ProfileTemplate.tsx)
**Severità:** Bassa

I due template sono **esattamente identici**:

```tsx
// DashboardTemplate
<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>

// ProfileTemplate
<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
```

**Fix:** Unificare in un unico `PageTemplate` con eventuale prop per
differenziazione futura.

---

### DUP-05 · `gameTone` e `gameShort` — Wrapper superflui di `GAME_CONFIG`

**File:**
[`game-data.ts:190-200`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/game-data.ts#L190-L200)
**Severità:** Bassa

```typescript
export const gameTone: Record<Game, string> = {
  Krilion: GAME_CONFIG.Krilion.tone,
  Metazooa: GAME_CONFIG.Metazooa.tone,
  Chronophoto: GAME_CONFIG.Chronophoto.tone,
};
```

Queste costanti replicano dati già in `GAME_CONFIG`. Si potrebbe usare
direttamente `GAME_CONFIG[game].tone` e `GAME_CONFIG[game].shortName`.

---

## Architettura & Best Practices

### ARCH-01 · Tutte le pagine sono `"use client"` — Nessun Server Component

**Severità:** Alta

Le pagine
[`dashboard/page.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/dashboard/page.tsx)
e
[`profile/page.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/profile/page.tsx)
sono interamente client-side. Questo significa:

- **Zero SSR**: Il contenuto non è pre-renderizzato, danneggiando SEO e First
  Contentful Paint
- **Waterfall di fetch**: Il browser deve caricare il JS → renderizzare il
  componente → eseguire `useEffect` → fare fetch → ri-renderizzare con i dati
- **Non si sfrutta il modello App Router di Next.js 15**: Il punto forte di
  Next.js 15 sono i React Server Components (RSC) che possono fare fetch
  direttamente server-side

**Fix:** Convertire le pagine in Server Component che fetchano i dati iniziali
server-side e passano i dati ai client component come props.

---

### ARCH-02 · NextAuth v4 con `strategy: "jwt"` + PrismaAdapter — Conflitto documentato

**File:**
[`auth.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/auth.ts#L54-L56)
**Severità:** Media

NextAuth v4 con un database adapter (PrismaAdapter) utilizza di default la
strategia `database` per le sessioni. Forzare `strategy: "jwt"` disabilita la
persistenza delle sessioni nel DB, rendendo la tabella `sessions` inutilizzata.

Inoltre il CredentialsProvider con PrismaAdapter + JWT è un pattern noto per
avere problemi: NextAuth
[avverte nella documentazione ufficiale](https://next-auth.js.org/providers/credentials)
che CredentialsProvider non è supportato con database adapter per le sessioni.

---

### ARCH-03 · Nessun middleware Next.js

**Severità:** Media

Non c'è un file `middleware.ts` per:

- Protezione delle route autenticate (`/profile`, `/admin/*`)
- Redirect degli utenti non autenticati
- Rate limiting base

---

### ARCH-04 · Import dinamico del prisma client nella route API

**File:**
[`user/me/route.ts:20`](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/api/user/me/route.ts#L20)
**Severità:** Bassa

```typescript
const { prisma } = await import('@/lib/prisma');
```

Usa un import dinamico anziché il normale import statico (che è già usato in
tutti gli altri file). Questo crea un'inconsistenza senza benefici reali.

---

### ARCH-05 · `BugReport.status` — Stringa libera invece di enum Prisma

**File:**
[`schema.prisma:140`](file:///c:/Users/lucad/my-projects/who-is-losing-today/prisma/schema.prisma#L140)
**Severità:** Bassa

```prisma
status String @default("OPEN") // "OPEN", "RESOLVED", "CLOSED"
```

Il campo `status` è un `String` libero anziché un `enum`. Questo permette
inserimenti di valori invalidi a livello DB.

**Fix:** Definire un enum Prisma `BugStatus { OPEN RESOLVED CLOSED }`.

---

### ARCH-06 · `DailyScore.scoreDate` — Tipo `DateTime` inadatto per una data senza orario

**File:**
[`schema.prisma:101`](file:///c:/Users/lucad/my-projects/who-is-losing-today/prisma/schema.prisma#L101)
**Severità:** Media

`scoreDate DateTime @default(now())` salva un timestamp completo, ma
concettualmente rappresenta solo una **data** (YYYY-MM-DD). Le comparazioni con
`setHours(0,0,0,0)` nel codice sono fragili e timezone-dependent.

**Fix:** Usare un tipo Prisma che mappi a `DATE` in PostgreSQL, o utilizzare il
tipo `@db.Date`.

---

## Performance & Ottimizzazione

### PERF-01 · `getPlayersFromDb()` scarica TUTTI i punteggi di TUTTI gli utenti

**File:**
[`db-service.ts:22-30`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/services/db-service.ts#L22-L30)
**Severità:** Alta

```typescript
const users = await prisma.user.findMany({
  include: {
    dailyScores: {
      orderBy: { scoreDate: 'desc' },
    },
  },
});
```

Nessun `take`, nessun filtro sulla data. Se un utente ha giocato 1000 partite,
vengono tutte caricate in memoria solo per estrarre il punteggio più recente per
gioco. Con 5 utenti × 1000 punteggi = 5000 record caricati per rispondere a una
singola GET.

**Fix:** Usare una subquery o query raw per selezionare solo il punteggio più
recente per ciascun (userId, gameId).

---

### PERF-02 · `getGroupPlayerTrendFromDb()` scarica TUTTI i punteggi mai registrati

**File:**
[`db-service.ts:71-76`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/services/db-service.ts#L71-L76)
**Severità:** Alta

```typescript
const allScores = await prisma.dailyScore.findMany({
  include: { user: { select: { name: true } } },
  orderBy: { scoreDate: 'asc' },
});
```

Nessun limite temporale. In produzione, con mesi di dati, questa query diventa
pesantissima.

**Fix:** Limitare con un filtro `where: { scoreDate: { gte: nDaysAgo } }` (es.
ultimi 30 giorni).

---

### PERF-03 · Dashboard fa 3 fetch identiche in parallelo

**Severità:** Media

Come descritto in DUP-03, al mount della dashboard partono 3 richieste GET
`/api/dashboard` indipendenti, e ciascuna scatena le stesse pesanti query del
database (PERF-01 + PERF-02).

---

### PERF-04 · Nessun indice aggiuntivo su colonne frequentemente filtrate

**File:**
[`schema.prisma`](file:///c:/Users/lucad/my-projects/who-is-losing-today/prisma/schema.prisma)
**Severità:** Media

Le query filtrano spesso per `scoreDate`, `userId`, `gameId`, ma non ci sono
indici espliciti oltre all'indice composto
`@@unique([userId, gameId, scoreDate])`. Servirebbero:

- `@@index([scoreDate])` su `DailyScore`
- `@@index([userId])` su `DailyScore` (le FK non creano automaticamente indici
  in PostgreSQL)

---

### PERF-05 · `useUserStats` viene chiamato 3 volte con parametri diversi nella pagina profilo

**Severità:** Media

`PersonalTrendChart` chiama `useUserStats(fromDate, toDate)` e
`ScoreHistoryList` chiama `useUserStats()` — ciascuno fa una propria fetch a
`/api/user/me`. Sono 2 fetch separate (più quella dalla pagina profilo stessa).

---

## Documentazione & README

### DOC-01 · README incoerente col progetto reale

**File:**
[`README.md`](file:///c:/Users/lucad/my-projects/who-is-losing-today/README.md)
**Severità:** Media

| Problema                                                 | Dettaglio                                                                                                                                                                                                                           |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React 19 nel README, React 18 in package.json            | Il README dice "React 19" (riga 9), ma `package.json` ha `"react": "^18.3.1"`                                                                                                                                                       |
| `.env.local` vs `.env`                                   | README dice di creare `.env.local` (riga 72), ma il progetto ha `.env` e Prisma legge da `.env` non `.env.local`                                                                                                                    |
| Seed descritto come "14 giorni di storico e 5 giocatori" | README riga 89 dice "Inserisce 14 giorni di storico e 5 giocatori di test", ma il [seed reale](file:///c:/Users/lucad/my-projects/who-is-losing-today/prisma/seed.ts) inserisce solo i 3 giochi, nessun giocatore e nessuno storico |
| TypeScript 5.3 nel README, `^5.3.0` in package.json      | In realtà potrebbe essere risolto a versione diversa                                                                                                                                                                                |

---

### DOC-02 · ROADMAP obsoleta

**File:**
[`ROADMAP.md`](file:///c:/Users/lucad/my-projects/who-is-losing-today/ROADMAP.md)
**Severità:** Bassa

Il ROADMAP parla di "Supabase Auth" e di tabelle `players` / `game_scores` come
se fossero future, ma sono già implementate (con nomi diversi: `users`,
`daily_scores`). Il documento non riflette lo stato attuale del progetto.

---

### DOC-03 · Nessun commento JSDoc sulle API route

**Severità:** Bassa

Le route API non hanno JSDoc che descrivano il formato di request/response. La
documentazione esiste in `docs/api-reference.md`, ma non è inline.

---

## Codice Morto / Inutilizzato

### DEAD-01 · Dati statici mock in `game-data.ts` — Mai usati con dati reali

**File:**
[`game-data.ts:56-129`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/game-data.ts#L56-L129)
**Severità:** Media

Le seguenti esportazioni sono **dati mock statici** che sembravano servire prima
dell'integrazione con il DB:

| Export                 | Riga    | Descrizione                                                     |
| ---------------------- | ------- | --------------------------------------------------------------- |
| `players`              | 56-62   | Array di giocatori fittizi                                      |
| `PLAYER_COLORS`        | 64-70   | Colori fissi per nomi specifici (non funziona con utenti reali) |
| `groupPlayerTrendData` | 72-109  | Trend group fittizio                                            |
| `personalTrendData`    | 111-119 | Trend personale fittizio                                        |
| `trendData`            | 121     | Alias di `groupPlayerTrendData.Totale`                          |
| `history`              | 123-129 | Storico fittizio                                                |

Questi dati sono importati solo dal `TrendChart` che usa `PLAYER_COLORS` (che
**non funziona con utenti reali** — i nomi sono hardcoded come "Sara Bianchi",
ecc.).

> [!WARNING] `PLAYER_COLORS` è usato in
> [`TrendChart.tsx:70`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/organisms/TrendChart.tsx#L70):
> se il nome reale dell'utente non è uno tra i 5 hardcoded, il grafico usa il
> fallback `#8b5cf6` per tutti → **tutte le linee hanno lo stesso colore**.

**Fix:** Generare i colori dinamicamente basandosi sull'indice o sull'hash del
nome dell'utente.

---

### DEAD-02 · `lib/supabase/client.ts` — Mock inutilizzato

**File:**
[`lib/supabase/client.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/supabase/client.ts)
**Severità:** Bassa

Questo file è un client Supabase stub/mock che non è importato da nessuna parte.
È dead code.

**Fix:** Eliminare il file e la directory `lib/supabase/`.

---

### DEAD-03 · `ProfileHeader.tsx` — Componente con dati hardcoded, mai usato dalla pagina profilo

**File:**
[`ProfileHeader.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/molecules/ProfileHeader.tsx)
**Severità:** Bassa

```tsx
<h1>Luca Rossi</h1>
<p>Membro dal 2024</p>
```

Il componente ha nome e data hardcoded e non è usato nella pagina `/profile`
(che costruisce il suo header direttamente). È dead code.

---

### DEAD-04 · `Player` type in `game-data.ts` usato anche per dati DB

**File:**
[`game-data.ts:44-52`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/game-data.ts#L44-L52)
**Severità:** Bassa

Il tipo `Player` è definito in `game-data.ts` (file dei mock), ma `DbPlayer` in
`db-service.ts` ha **la stessa identica struttura**. `LeaderboardTable` importa
`Player` da `game-data.ts` — ma i dati arrivano dal DB tramite `DbPlayer`.
Funziona solo perché le interfacce sono identiche strutturalmente (duck typing).

**Fix:** Unificare i tipi in un unico posto (es. `types.ts`).

---

## UI/UX & Componenti

### UI-01 · `Avatar` non usa `next/image`

**File:**
[`Header.tsx:85`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/organisms/Header.tsx#L85),
[`DailyChalkboard.tsx:139`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/organisms/DailyChalkboard.tsx#L139),
[`profile/page.tsx:82`](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/profile/page.tsx#L82)
**Severità:** Media

Immagini utente Google usano `<img>` nativo con
`eslint-disable-next-line @next/next/no-img-element`. Usando `next/image` si
otterrebbero:

- Ottimizzazione automatica delle immagini
- Lazy loading nativo
- Prevenzione layout shift

**Fix:** Configurare il dominio Google in `next.config.js` e usare `<Image>`.

---

### UI-02 · `GameTabFilter` manca `cursor-pointer`

**File:**
[`GameTabFilter.tsx:17-28`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/molecules/GameTabFilter.tsx#L17-L28)
**Severità:** Bassa

A differenza di tutti gli altri bottoni del progetto (che hanno `cursor-pointer`
esplicito), i tab del filtro giochi non ce l'hanno.

---

## Dipendenze & Configurazione

### DEP-01 · `prisma` nelle `dependencies` anziché `devDependencies`

**File:**
[`package.json:44`](file:///c:/Users/lucad/my-projects/who-is-losing-today/package.json#L44)
**Severità:** Bassa

```json
"prisma": "6.4.0"
```

Il CLI `prisma` è uno strumento di sviluppo e dovrebbe stare in
`devDependencies`. Solo `@prisma/client` serve in produzione. (Nota: per Vercel
questo è spesso necessario per il postinstall, ma va documentato il motivo).

---

### DEP-02 · `next.config.js` — Configurazione vuota

**File:**
[`next.config.js`](file:///c:/Users/lucad/my-projects/who-is-losing-today/next.config.js)
**Severità:** Bassa

La configurazione è completamente vuota. Mancano almeno:

- `images.remotePatterns` per le immagini Google (`lh3.googleusercontent.com`)
- `typescript.ignoreBuildErrors` o build-time checks

---

### DEP-03 · ESLint disabilita `@typescript-eslint/no-unused-vars`

**File:**
[`eslint.config.mjs:62`](file:///c:/Users/lucad/my-projects/who-is-losing-today/eslint.config.mjs#L62)
**Severità:** Bassa

```javascript
"@typescript-eslint/no-unused-vars": "off",
```

Disabilitare completamente il controllo delle variabili inutilizzate nasconde
potenziali problemi. Meglio usare `"warn"` con pattern di ignore per underscore
(`"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]`).

---

### DEP-04 · Versione `docker-compose.yml` deprecata

**File:**
[`docker-compose.yml:1`](file:///c:/Users/lucad/my-projects/who-is-losing-today/docker-compose.yml#L1)
**Severità:** Bassa

```yaml
version: '3.8'
```

Il campo `version` in docker-compose è deprecato da Docker Compose V2. Può
essere rimosso.

---

## Tabella Riepilogativa

| ID      | Categoria    | Severità | Descrizione                                                     |
| ------- | ------------ | -------- | --------------------------------------------------------------- |
| BUG-01  | Bug          | Alta     | Streak calcolata come clamp del totale partite, non consecutivo |
| BUG-02  | Bug          | Media    | Score Metazooa 0 produce 110/100                                |
| BUG-03  | Bug          | Alta     | Media divisa per 3 anche con 1 solo gioco giocato               |
| BUG-04  | Bug          | Media    | Date UTC causano giornata sbagliata dopo le 22:00 CET           |
| BUG-05  | Bug          | Media    | Score POST senza auth scrive sotto il primo utente              |
| BUG-06  | Bug          | Media    | DELETE distruttiva in una GET HTTP                              |
| SEC-01  | Sicurezza    | Critica  | Pagina admin e API admin senza autenticazione                   |
| SEC-02  | Sicurezza    | Media    | Dati dashboard esposti senza auth                               |
| SEC-03  | Sicurezza    | Media    | NEXTAUTH_SECRET con fallback hardcoded                          |
| SEC-04  | Sicurezza    | Media    | `allowDangerousEmailAccountLinking`                             |
| SEC-05  | Sicurezza    | Media    | Nessuna validazione input con Zod/simili                        |
| DUP-01  | Duplicato    | Media    | Pattern `scoreUpdated` ripetuto in 5 componenti                 |
| DUP-02  | Duplicato    | Bassa    | Calcolo iniziali duplicato in 4 file                            |
| DUP-03  | Duplicato    | Media    | 3 fetch identiche `/api/dashboard` nella stessa pagina          |
| DUP-04  | Duplicato    | Bassa    | DashboardTemplate e ProfileTemplate identici                    |
| DUP-05  | Duplicato    | Bassa    | `gameTone`/`gameShort` duplicano `GAME_CONFIG`                  |
| ARCH-01 | Architettura | Alta     | Zero Server Components — tutto client-side                      |
| ARCH-02 | Architettura | Media    | JWT strategy con PrismaAdapter — conflitto noto                 |
| ARCH-03 | Architettura | Media    | Nessun middleware Next.js                                       |
| ARCH-04 | Architettura | Bassa    | Import dinamico inconsistente in user/me                        |
| ARCH-05 | Architettura | Bassa    | Status bug come stringa libera anziché enum                     |
| ARCH-06 | Architettura | Media    | `scoreDate` DateTime anziché Date                               |
| PERF-01 | Performance  | Alta     | Query senza limiti carica tutti i punteggi                      |
| PERF-02 | Performance  | Alta     | Trend carica l'intero storico senza filtro data                 |
| PERF-03 | Performance  | Media    | 3 fetch duplicate nella stessa pagina                           |
| PERF-04 | Performance  | Media    | Indici mancanti nel DB                                          |
| PERF-05 | Performance  | Media    | useUserStats chiamato multiplo volte                            |
| DOC-01  | Doc          | Media    | README con info errate (React 19, seed, .env.local)             |
| DOC-02  | Doc          | Bassa    | ROADMAP non aggiornata                                          |
| DOC-03  | Doc          | Bassa    | Nessun JSDoc nelle API                                          |
| DEAD-01 | Dead code    | Media    | Dati mock + PLAYER_COLORS hardcoded (bug colori)                |
| DEAD-02 | Dead code    | Bassa    | Supabase client mock inutilizzato                               |
| DEAD-03 | Dead code    | Bassa    | ProfileHeader con dati hardcoded                                |
| DEAD-04 | Dead code    | Bassa    | Type Player duplicato con DbPlayer                              |
| UI-01   | UI           | Media    | `<img>` anziché `next/image`                                    |
| UI-02   | UI           | Bassa    | Manca cursor-pointer su GameTabFilter                           |
| DEP-01  | Deps         | Bassa    | prisma CLI nelle dependencies                                   |
| DEP-02  | Deps         | Bassa    | next.config.js vuoto                                            |
| DEP-03  | Deps         | Bassa    | no-unused-vars disabilitato                                     |
| DEP-04  | Deps         | Bassa    | docker-compose version deprecata                                |

---

## Conteggio per priorità

| Severità       | Conteggio |
| -------------- | --------- |
| Alta / Critica | **7**     |
| Media          | **18**    |
| Bassa          | **14**    |
| **Totale**     | **39**    |

---

> [!TIP] **Ordine consigliato di intervento:**
>
> 1. **SEC-01** — Proteggere le route admin (critica, immediata)
> 2. **BUG-03** — Correggere il calcolo della media totale (alta priorità,
>    impatto dati)
> 3. **BUG-01** — Correggere la streak in db-service (incoerenza
>    dashboard/profilo)
> 4. **PERF-01/02** — Limitare le query al DB (prima che i dati crescano)
> 5. **DUP-03** — Centralizzare i dati dashboard (risolve anche PERF-03)
> 6. **DEAD-01** — Fixare PLAYER_COLORS per utenti reali (bug visivo grafici)
> 7. **ARCH-01** — Graduale migrazione a Server Components
