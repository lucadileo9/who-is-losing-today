# Guida per Aggiungere Nuovi Giochi

L'architettura del sistema è stata progettata per essere totalmente estensibile.
Questa guida illustra come aggiungere un nuovo gioco (es. _Wordle_, _Tradle_,
_GeoGuessr_) in 4 semplici passaggi senza dover modificare i componenti grafici
dell'applicazione.

---

## Step 1: Aggiornare la Definizione dei Tipi ([`lib/game-data.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/game-data.ts))

Apri il file
[`lib/game-data.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/game-data.ts)
ed aggiungi il nuovo gioco sia al tipo union `Game` sia al dizionario
`GAME_CONFIG`:

```ts
// 1. Aggiungi la stringa identificativa al tipo union
export type Game = 'Krilion' | 'Metazooa' | 'Chronophoto' | 'Wordle';

// 2. Registra la configurazione visuale e le regole del gioco
export const GAME_CONFIG: Record<Game, GameInfo> = {
  // ... giochi esistenti ...
  Wordle: {
    id: 'Wordle',
    name: 'Wordle',
    shortName: 'WO',
    color: '#84cc16', // Colore Hex per i grafici Recharts
    tone: 'bg-lime-500/15 text-lime-500 border-lime-500/25', // Classi Tailwind per i badge
    unit: 'tentativi',
    isLowerBetter: true,
  },
};
```

---

## Step 2: Aggiungere le Regole di Parsing Regex ([`lib/game-data.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/game-data.ts))

Nella funzione `parseScore`, aggiungi la regola Regex per identificare ed
estrarre il punteggio dal testo incollato dall'utente:

```ts
if (game === 'Wordle') {
  const match = trimmed.match(/Wordle\s+\d+\s+(\d|X)\/6/i);
  if (match && match[1]) {
    return match[1] === 'X' ? 7 : parseInt(match[1], 10);
  }
}
```

---

## Step 3: Definire la Formula di Normalizzazione 0-100 ([`lib/game-data.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/game-data.ts))

Nella funzione `calculateNormalizedScore`, definisci come convertire il
risultato del gioco su scala uniforme 0-100:

```ts
if (game === 'Wordle') {
  // 1/6 = 100 pt, 2/6 = 90 pt, 3/6 = 80 pt ... X/6 = 0 pt
  return Math.max(0, 110 - score * 10);
}
```

---

## Step 4: Sincronizzare il Database

1. Inserisci il nuovo gioco nello script di popolamento
   [`prisma/seed.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/prisma/seed.ts):

```ts
{ id: "Wordle", name: "Wordle", shortName: "WO", unit: "tentativi", isLowerBetter: true }
```

2. Esegui da terminale:

```bash
npx prisma db seed
```

**Fatto!** Il nuovo gioco comparirà automaticamente nei tab filtri della
Dashboard, nella classifica generale, nelle schede profilo e nei grafici
Recharts.
