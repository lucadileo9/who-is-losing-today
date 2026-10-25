# 02. Backend e DAL — Motore Multi-Gioco Dinamico

Questo documento descrive il funzionamento del motore multi-gioco dinamico introdotto con il refactoring del Data Access Layer e fornisce la guida passo-passo per aggiungere un nuovo gioco alla piattaforma.

---

## 1. Dall'Hardcoding all'Estensibilità Dinamica

Nel design iniziale dell'applicazione, i giochi (*Krilion*, *Metazooa*, *Chronophoto*) erano cablati rigidamente:
- La media del Totale divideva tassativamente per `3` (`/ 3`), anche se i giochi fossero stati 4 o se venissero aggiunti nuovi titoli.
- Le strutture dati usavano proprietà statiche (`krilion`, `metazooa`, `chronophoto`).

Con il refactoring del DAL:
1. **Dati guidati dal Database**: La lista dei giochi attivi viene letta dinamicamente dalla tabella `Game` di PostgreSQL.
2. **DTO Dinamici (`byGame`)**: Tutti i DTO (`DailyResultsDTO`, `PeriodResultsDTO`, `HallOfFameDTO`) espongono la proprietà:
   ```typescript
   byGame: Record<string, TData>
   ```
   che permette al frontend di generare tab, classifiche e grafici ciclando sui giochi presenti senza modifiche al codice di presentazione.
3. **Retrocompatibilità**: Per garantire il funzionamento dei componenti frontend esistenti durante la transizione, i DTO mantengono getter o campi opzionali per `krilion`, `metazooa` e `chronophoto`.

---

## 2. Configurazione e Fallback Centralizzati

Nel caso in cui il database sia vuoto o in fase di prima inizializzazione, il DAL utilizza la configurazione centralizzata definita in [lib/theme/colors.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/theme/colors.ts):

```typescript
export const DEFAULT_GAME_FALLBACKS = [
  { id: 'Krilion', name: 'Krilion', isLowerBetter: false, color: '#3b82f6' },
  { id: 'Metazooa', name: 'Metazooa', isLowerBetter: true, color: '#10b981' },
  { id: 'Chronophoto', name: 'Chronophoto', isLowerBetter: false, color: '#f59e0b' },
] as const;
```

---

## 3. Guida Passo-Passo: Come Aggiungere un Nuovo Gioco

Supponiamo di voler aggiungere un quarto gioco: **Wordle** (gioco a tentativi da 1 a 6, dove meno tentativi è meglio).

### Passo 1: Registrare il Gioco nel Database
Aggiungi il record nel database tramite SQL o aggiornando [prisma/seed.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/prisma/seed.ts):

```typescript
await prisma.game.upsert({
  where: { id: 'Wordle' },
  update: {},
  create: {
    id: 'Wordle',
    name: 'Wordle',
    shortName: 'WD',
    unit: 'ATTEMPTS',
    color: '#22c55e', // Verde neon
    isLowerBetter: true,
  },
});
```

---

### Passo 2: Definire la Normalizzazione del Punteggio
In [lib/game-data.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/game-data.ts), estendi la funzione `calculateNormalizedScore`:

```typescript
export function calculateNormalizedScore(game: string, score: number): number {
  // ... giochi esistenti ...

  if (game === 'Wordle') {
    // Range 1-6 tentativi: 1 tentativo = 1000 pt, 6 tentativi = 100 pt, fallito (>6 o 0) = 0 pt
    if (score <= 0 || score > 6) return 0;
    return Math.round(((7 - score) / 6) * 1000);
  }

  return Math.min(1000, score);
}
```

---

### Passo 3: Aggiungere il Parser del Testo Incollato
In [lib/game-data.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/game-data.ts), estendi la funzione `parseScore` per estrarre in automatico il punteggio dal testo copiato da appuntati:

```typescript
export function parseScore(text: string, game: string): number | null {
  const trimmed = text.trim();

  if (game === 'Wordle') {
    // Cerca pattern tipo "Wordle 1,024 3/6" o "3/6"
    const match = trimmed.match(/(\d)\/6/i);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }

  // fallback per altri giochi...
  const fallback = trimmed.match(/\d+/);
  return fallback ? parseInt(fallback[0], 10) : null;
}
```

---

### Passo 4: Centralizzare i Token Grafici
Aggiungi la configurazione estetica in [lib/theme/colors.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/theme/colors.ts) e in `GAME_CONFIG`:

```typescript
// In lib/theme/colors.ts:
export const DEFAULT_GAME_FALLBACKS = [
  // ...
  { id: 'Wordle', name: 'Wordle', isLowerBetter: true, color: '#22c55e' },
];

// In lib/game-data.ts (GAME_CONFIG):
Wordle: {
  id: 'Wordle',
  name: 'Wordle',
  shortName: 'WD',
  color: '#22c55e',
  tone: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  unit: 'tentativi',
  isLowerBetter: true,
}
```

---

## 4. Perché il DAL non richiede modifiche

Grazie all'architettura a dizionario `byGame`:
- `getDailyResults()` interroga `prisma.game.findMany()`, trova automaticamente anche `Wordle`, aggrega i punteggi per `Wordle` e calcola il divisore del Totale basandosi sul numero di giochi attivi (`activeGames.length`).
- `getPeriodResults()` genera la classifica e il trend per `Wordle` dentro `periodData.byGame['Wordle']`.
- L'interfaccia UI cicla su `Object.keys(results.rankings.byGame)` e visualizza automaticamente la nuova tab e la classifica senza refactoring.
