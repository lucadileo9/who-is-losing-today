# Manuale dello Sviluppatore ed Estensione del Progetto

Questo documento è dedicato a chi desidera contribuire al progetto **Who Is Losing Today**, estenderne le funzionalità, aggiungere nuovi giochi o pubblicare l'applicazione in produzione.

---

## Parte 1: Come Aggiungere un Nuovo Gioco (in 5 Minuti)

L'architettura del progetto è stata progettata per consentire l'aggiunta di un quarto o quinto gioco (es. *Wordle*, *Tradle*, *GeoGuessr*) senza dover rifattorizzare i componenti grafici.

### Step 1: Aggiornare la Definizione dei Tipi ([`lib/game-data.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/game-data.ts))
Modifica il tipo TypeScript `Game` ed aggiungi la configurazione in `GAME_CONFIG`:

```ts
// 1. Aggiungi il nuovo gioco al tipo union
export type Game = "Krilion" | "Metazooa" | "Chronophoto" | "Wordle"

// 2. Registra le informazioni del nuovo gioco in GAME_CONFIG
export const GAME_CONFIG: Record<Game, GameInfo> = {
 // ... giochi esistenti ...
 Wordle: {
 id: "Wordle",
 name: "Wordle",
 shortName: "WO",
 color: "#65a30d", // Colore Hex per i grafici (es. Verde Lime)
 tone: "bg-lime-500/15 text-lime-500 border-lime-500/25", // Classi Tailwind per i badge
 unit: "tentativi",
 isLowerBetter: true,
 },
}
```

### Step 2: Aggiungere il Parser Regex ([`lib/game-data.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/game-data.ts))
Aggiorna la funzione `parseScore` per estrarre il punteggio dal testo incollato:

```ts
if (game === "Wordle") {
 const match = trimmed.match(/Wordle\s+\d+\s+(\d|X)\/6/i)
 if (match && match[1]) {
 return match[1] === "X" ? 7 : parseInt(match[1], 10)
 }
}
```

### Step 3: Definire la Formula di Normalizzazione ([`lib/game-data.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/game-data.ts))
In `calculateNormalizedScore`, definisci come convertire il risultato in scala 0-100:

```ts
if (game === "Wordle") {
 // 1/6 = 100 pt, 2/6 = 90 pt ... 6/6 = 50 pt, X/6 = 0 pt
 return Math.max(0, 110 - score * 10)
}
```

### Step 4: Aggiornare il Database e lo Script di Seed
1. Aggiungi il nuovo gioco nello script [`prisma/seed.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/prisma/seed.ts).
2. Esegui il seed: `npx prisma db seed`.

 **Fatto!** Il nuovo gioco apparirà automaticamente nei filtri a schede, nelle tabelle di classifica, nelle schede profilo e nei grafici Recharts!

---

## Parte 2: Registro degli Endpoint API

Tutti gli endpoint REST sono collocati nella cartella `app/api/`.

### 1. `GET /api/dashboard`
* **Query Parameters**: `date` (opzionale, formato `YYYY-MM-DD`).
* **Descrizione**: Restituisce lo stato completo del database per la Dashboard.
* **Risposta Esempio**:
```json
{
 "players": [...],
 "groupTrend": { "Totale": [...], "Krilion": [...] },
 "dailySummary": { "ranked": [...], "winner": {...}, "loser": {...} },
 "source": "database"
}
```

### 2. `POST /api/scores`
* **Body Request**:
```json
{
 "game": "Krilion",
 "score": 92,
 "text": "Ho fatto 92 in Krilion!",
 "userEmail": "sara@example.com"
}
```
* **Descrizione**: Salva o aggiorna un punteggio giornaliero nella tabella `daily_scores` di PostgreSQL.

### 3. `GET/POST /api/auth/[...nextauth]`
* **Descrizione**: Rotta NextAuth che gestisce le sessioni, il redirect a Google OAuth, il login ed il logout.

---

## Parte 3: Guida al Deployment in Produzione (Vercel + Supabase)

### 1. Database su Supabase
1. Segui la guida [`docs/SUPABASE_POSTGRES_SETUP.md`](file:///c:/Users/lucad/my-projects/who-is-losing-today/docs/SUPABASE_POSTGRES_SETUP.md) per creare un database gratuito.
2. Esegui `npx prisma db push` per creare la struttura delle tabelle.

### 2. Deployment su Vercel
1. Collega il tuo repository GitHub a **Vercel**.
2. Nella sezione **Environment Variables** di Vercel, aggiungi:
 - `DATABASE_URL` (Pooled connection string)
 - `DIRECT_URL` (Direct connection string)
 - `NEXTAUTH_SECRET` (Stringa casuale)
 - `NEXTAUTH_URL` (`https://tuo-dominio.vercel.app`)
 - `GOOGLE_CLIENT_ID`
 - `GOOGLE_CLIENT_SECRET`
3. Clicca su **Deploy**. Vercel eseguirà automaticamente `next build` e pubblicherà la tua applicazione online in pochi secondi!
