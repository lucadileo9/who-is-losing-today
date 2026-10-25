# Guida Completa Componenti UI e Funzioni Utility

Questo documento offre un'analisi esaustiva ed approfondita di **ogni singolo
componente dell'interfaccia utente** (suddiviso secondo la metodologia Atomic
Design) e di **tutte le funzioni logiche e di utility** presenti nel codebase di
_Who Is Losing Today_.

---

## Parte 1: Componenti UI (Atomic Design)

L'applicazione segue la metodologia **Atomic Design** per garantire massima
riutilizzabilità, coerenza visiva e separazione delle responsabilità.

```text
components/
├── atoms/ # Elementi base indivisibili (Button, Input, Badge, Avatar)
├── molecules/ # Combinazioni di atomi (DatePicker, GameScoreInput, ChartTooltip, GameTabFilter)
├── organisms/ # Sezioni complesse autonome (Header, LeaderboardTable, TrendChart, DailySummaryCards)
└── templates/ # Layout strutturali delle pagine (DashboardTemplate, ProfileTemplate)
```

---

### 1. ATOMS (Componenti Base)

Gli atomi sono gli elementi grafici primari dell'applicazione. Non contengono
logica di business e dipendono esclusivamente dalle `props` ricevute.

#### `Button` ([`components/atoms/index.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/atoms/index.tsx))

- **Descrizione**: Wrapper riutilizzabile sul componente `Button` di Shadcn UI.
- **Responsabilità**: Gestisce gli stati dei pulsanti (primary, secondary,
  ghost, outline, destructive, size) garantendo feedback visivo al passaggio del
  mouse (_hover_) e al click (_active_).
- **Utilizzo**: Usato per pulsanti di invio, cambio schede e navigazione.

#### `Input` ([`components/atoms/index.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/atoms/index.tsx))

- **Descrizione**: Campo di testo personalizzato con stili Tailwind unificati
  (`border-input`, `focus-visible:ring-2`).
- **Responsabilità**: Cattura l'input testuale dell'utente (es. punteggi
  incollati o date).
- **Props principali**: `value`, `onChange`, `placeholder`, `type`, `onKeyDown`.

#### `Badge` ([`components/atoms/index.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/atoms/index.tsx))

- **Descrizione**: Etichetta visiva compatta per evidenziare posizioni in
  classifica o stati dei giochi.
- **Responsabilità**: Mostrare informazioni secondarie in pillole colorate con
  opacità variabile (`bg-chart-1/15`).

#### `Avatar` ([`components/atoms/index.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/atoms/index.tsx))

- **Descrizione**: Cerchio contenente le iniziali dell'utente o l'immagine di
  profilo caricata tramite Google Auth.
- **Responsabilità**: Se l'utente ha un'immagine di profilo
  (`session.user.image`), la visualizza in formato circolare; in alternativa,
  genera un fallback con le sue iniziali (es. "SB" per Sara Bianchi) sul colore
  del tema assegnato.

#### `ThemeProvider` ([`components/atoms/ThemeProvider.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/atoms/ThemeProvider.tsx))

- **Descrizione**: Wrapper basato su `next-themes`.
- **Responsabilità**: Abilita il cambio dinamico del tema (Dark Mode / Light
  Mode) senza flickering all'avvio dell'applicazione.

#### `Providers` ([`components/atoms/Providers.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/atoms/Providers.tsx))

- **Descrizione**: Wrapper globale per `SessionProvider` di NextAuth.
- **Responsabilità**: Mantiene attivo il contesto di sessione dell'utente
  autenticato su tutte le pagine del client Next.js.

---

### 2. MOLECULES (Molecole)

Le molecole combinano più atomi per creare unità funzionali riutilizzabili.

#### `ChartTooltip` ([`components/molecules/ChartTooltip.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/molecules/ChartTooltip.tsx))

- **Descrizione**: Tooltip personalizzato per i grafici della libreria Recharts.
- **Problema risolto**: Sostituisce il tooltip standard che causava la
  sovrapposizione di testo arancione su sfondo arancione.
- **Responsabilità**: Quando l'utente passa il mouse su una colonna o riga del
  grafico, mostra una scheda scura elegante con la data, il colore
  identificativo ed i valori precisi dei punteggi.

#### `DatePicker` ([`components/molecules/DatePicker.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/molecules/DatePicker.tsx))

- **Descrizione**: Selettore di data compatto composto da un'icona `Calendar` di
  Lucide ed un input nativo HTML `type="date"`.
- **Responsabilità**: Permette all'utente di scegliere un giorno specifico o un
  intervallo di date (inizio/fine) per filtrare le statistiche ed i grafici
  storici.

#### `GameTabFilter` ([`components/molecules/GameTabFilter.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/molecules/GameTabFilter.tsx))

- **Descrizione**: Barra di navigazione a schede orizzontale (`Totale`,
  `Krilion`, `Metazooa`, `Chronophoto`).
- **Responsabilità**: Permette di commutare la visualizzazione tra la classifica
  totale aggregata ed i singoli giochi. Utilizzata sia nella Dashboard che nel
  Profilo.

#### `GameScoreInput` ([`components/molecules/GameScoreInput.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/molecules/GameScoreInput.tsx))

- **Descrizione**: Modulo principale per la registrazione dei punteggi
  quotidiani.
- **Responsabilità**:

1.  Permette di selezionare il gioco desiderato.
2.  Riceve il testo libero o incollato dall'utente.
3.  Invoca la funzione di parsing `parseScore()` per estrarre il valore
    numerico.
4.  Invia una richiesta `POST` all'endpoint `/api/scores` associando il
    risultato all'utente loggato.

#### `AppShell` ([`components/molecules/AppShell.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/molecules/AppShell.tsx))

- **Descrizione**: Contenitore principale dell'applicazione.
- **Responsabilità**: Include la barra di navigazione `Header` in alto ed il
  `Footer` in basso, racchiudendo il contenuto centrale delle pagine.

---

### 3. ORGANISMS (Organismi)

Gli organismi sono sezioni complesse dell'interfaccia che assemblano molecole e
atomi in blocchi completi di funzionalità.

#### `Header` ([`components/organisms/Header.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/organisms/Header.tsx))

- **Descrizione**: Barra di navigazione principale superiore dell'applicazione.
- **Responsabilità**: Contiene il logo del brand, i link di navigazione
  (`Dashboard`, `Profilo`), l'interruttore del tema Dark/Light e lo stato
  dell'autenticazione:

* Se disconnesso: mostra il pulsante _"Accedi"_.
* Se connesso: mostra il nome, l'avatar Google e il pulsante _"Disconnetti"_.

#### `DailySummaryCards` ([`components/organisms/DailySummaryCards.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/organisms/DailySummaryCards.tsx))

- **Descrizione**: Blocco visivo primario della Dashboard.
- **Responsabilità**:

* Contiene il navigatore della data (pulsanti _Precedente_, _Oggi_, _Successivo_
  e `DatePicker`).
* Renderizza la scheda **"Il Perdente di Oggi"** evidenziando in rosso l'ultimo
  classificato della giornata.
* Renderizza la scheda **"Classifica della Giornata"** con il podio dei primi 3
  posti per il giorno selezionato.

#### `LeaderboardTable` ([`components/organisms/LeaderboardTable.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/organisms/LeaderboardTable.tsx))

- **Descrizione**: Tabella della classifica generale e per singoli giochi.
- **Responsabilità**: Mostra la lista di tutti i giocatori ordinati per
  punteggio. Include l'icona della corona per il 1° posto, la posizione
  numerica, le avatar e la streak di giorni consecutivi.

#### `TrendChart` ([`components/organisms/TrendChart.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/organisms/TrendChart.tsx))

- **Descrizione**: Grafico a linee orizzontale Recharts per l'andamento del
  gruppo.
- **Responsabilità**: Traccia **una linea colorata per ciascun utente** lungo i
  giorni dello storico, consentendo di confrontare i progressi del gruppo nel
  tempo.

#### `PersonalStatsCard` ([`components/organisms/PersonalStatsCard.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/organisms/PersonalStatsCard.tsx))

- **Descrizione**: Griglia di statistiche individuali nella pagina Profilo.
- **Responsabilità**: Mostra 6 schede riassuntive: _Punteggio di Oggi_, _Partite
  Giocate_, _Streak Attiva_, e le 3 schede dedicate a _Krilion_, _Metazooa_ e
  _Chronophoto_.

#### `PersonalTrendChart` ([`components/organisms/PersonalTrendChart.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/organisms/PersonalTrendChart.tsx))

- **Descrizione**: Grafico a barre orizzontale Recharts per il profilo utente.
- **Responsabilità**: Visualizza i punteggi individuali dell'utente divisi per
  giorno, consentendo di selezionare sia il gioco desiderato che l'intervallo di
  date (_Da / A_).

---

## Parte 2: Logica e Funzioni Utility

In questa sezione viene spiegato il funzionamento di tutte le funzioni helper e
dei servizi dati dell'applicazione.

---

### 1. Utility dei Giochi e Punteggi ([`lib/game-data.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/game-data.ts))

#### `calculateNormalizedScore(game: Game, score: number): number`

- **Scopo**: Converte i punteggi grezzi dei 3 diversi giochi in una scala
  universale omogenea da **0 a 100 punti**.
- **Logica interna**:

* **Krilion**: Il punteggio è già in scala 0-100, quindi ritorna direttamente
  `Math.min(100, score)`.
* **Metazooa**: In Metazooa meno tentativi si fanno, migliore è il risultato (1
  tentativo = 100 pt, 2 = 90 pt, 3 = 80 pt...). La formula applicata è:
  `Math.max(0, 100 - (score - 1) * 10)`.
* **Chronophoto**: I punteggi variano da 0 a 5.000 punti tempo. La formula
  applicata è: `Math.min(100, Math.round((score / 5000) * 100))`.

#### `calculateOverallScore(player: Player): number`

- **Scopo**: Calcola il punteggio complessivo del giocatore per la classifica
  generale.
- **Logica**: Calcola i 3 punteggi normalizzati con `calculateNormalizedScore` e
  ne restituisce la media aritmetica arrotondata:
  `Math.round((kr + mz + ch) / 3)`.

#### `parseScore(text: string, game: Game): number | null`

- **Scopo**: Parser di testo intelligente tramite Espressioni Regolari (Regex)
  per estrarre automaticamente il punteggio dal testo incollato dall'utente.
- **Logica**:

* Per **Metazooa**: cerca pattern tipo `/in\s+(\d+)\s+guesses/i` o
  `/(\d+)\s+guesses/i`.
* Per **Chronophoto**: cerca pattern tipo `/Final\s+Total:?\s*(\d+)/i`.
* Per **Krilion**: cerca numeri anteceduti dal nome del gioco.
* **Fallback**: Se non trova un pattern specifico, estrae il primo numero arabo
  presente nel testo.

#### `isLowerBetter(game: Game): boolean`

- **Scopo**: Determina la polarità dell'ordinamento per un gioco.
- **Logica**: Ritorna `true` se il gioco è **Metazooa** (dove 1 tentativo è
  migliore di 8 tentativi), altrimenti `false`.

---

### 2. Utility per la Gestione delle Date ([`lib/date-utils.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/date-utils.ts))

#### `getTodayIsoString(): string`

- **Scopo**: Restituisce la data odierna nel formato standard ISO `YYYY-MM-DD`
  (es. `"2026-10-03"`), utilizzata per i campi `<input type="date">` e per le
  query nel database.

#### `shiftIsoDate(isoString: string, days: number): string`

- **Scopo**: Aggiunge o sottrae un numero intero di giorni da una data ISO data.
- **Utilizzo**: Utilizzata nei pulsanti _Precedente_ (`-1`) e _Successivo_
  (`+1`) del navigatore della data.

#### `formatItalianDate(isoString: string, options?: Intl.DateTimeFormatOptions): string`

- **Scopo**: Converte una data ISO in formato testuale italiano leggibile (es.
  `"sab 3 ott 2026"`).

---

### 3. Servizio Database Prisma ([`lib/services/db-service.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/services/db-service.ts))

#### `getPlayersFromDb(): Promise<DbPlayer[]>`

- **Scopo**: Esegue una query PostgreSQL tramite Prisma per recuperare tutti gli
  utenti registrati ed i loro punteggi più recenti per ciascun gioco.

#### `getGroupPlayerTrendFromDb(): Promise<Record<LeaderboardTab, ...>>`

- **Scopo**: Esegue una query aggregata sullo storico della tabella
  `daily_scores`, raggruppando i punteggi per data e per utente, formattando la
  struttura dati per il grafico `TrendChart`.

#### `getDailySummaryFromDb(selectedDateStr: string)`

- **Scopo**: Recupera tutti i punteggi per la data specificata e calcola in
  tempo reale la classifica di quella giornata, restituendo sia il primo
  classificato (_winner_) che il perdente (_loser_).
