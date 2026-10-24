# Guida Completa alle Funzioni e Utility

Questo documento fornisce una descrizione dettagliata ed esaustiva di tutte le funzioni helper, matematiche, di query e degli hook presenti nell'applicazione.

---

## 1. Funzioni dei Giochi e dei Punteggi ([`lib/game-data.ts`](../../lib/game-data.ts))

### `calculateNormalizedScore(game: Game, score: number): number`
* **Scopo**: Converte i punteggi grezzi dei tre diversi giochi in una scala universale ed omogenea da **0 a 100 punti**.
 * **Metazooa**: `100 - (tentativi - 1) * 10` (1 tentativo = 100pt, 2 = 90pt, ...).
 * **Chronophoto**: `(score / 5000) * 100` (scala da 0 a 5.000).
 * **Krilion**: Già in scala 0-100.

### `calculateOverallScore(player: Player): number`
* **Scopo**: Calcola il punteggio complessivo aggregato di un giocatore per la classifica generale (media dei 3 giochi).

### `parseScore(text: string, game: Game): number | null`
* **Scopo**: Parser di testo intelligente basato su Espressioni Regolari (Regex) che estrae automaticamente il punteggio numerico da un testo libero o incollato.
 * **Metazooa**: Cerca pattern tipo `"in 3 guesses"` o `"4 guesses"`.
 * **Chronophoto**: Cerca pattern tipo `"Final Total: 3129"`.
 * **Krilion**: Cerca pattern tipo `"Krilion 88"` o numeri isolati.
 * **Fallback**: Estrae la prima sequenza numerica presente nella stringa.

### `isLowerBetter(game: Game): boolean`
* **Scopo**: Determina la polarità di ordinamento (`true` per Metazooa dove meno tentativi equivalgono ad un risultato migliore).

---

## 2. Servizio Statistiche Utente ([`lib/services/user-service.ts`](../../lib/services/user-service.ts))

### `getUserProfileStats(userId: string): Promise<UserProfileStats>`
* **Scopo**: Calcola dinamicamente le metriche del profilo utente dal DB: partite giocate, streak attiva di giorni consecutivi, punteggi del giorno e statistiche per singolo gioco.

### `getUserTrend(userId: string, fromDate?: string, toDate?: string): Promise<UserTrendItem[]>`
* **Scopo**: Raggruppa i punteggi storici dell'utente per data per alimentare i grafici di andamento personale.

### `getUserScoreHistory(userId: string, limit?: number): Promise<UserHistoryItem[]>`
* **Scopo**: Restituisce lo storico recente delle partite giocate con data e ora di registrazione.

---

## 3. Hook Reattivi Client ([`lib/hooks/use-user-stats.ts`](../../lib/hooks/use-user-stats.ts))

### `useUserStats(fromDate?: string, toDate?: string): UserStatsHookResult`
* **Scopo**: Hook React per consumare in modo reattivo i dati dell'endpoint `/api/user/me`. Gestisce lo stato di caricamento skeleton, gli errori e la funzione `refetch()`.

---

## 4. Eventi Reattivi per l'Aggiornamento in Tempo Reale
* **`scoreUpdated`**: Evento personalizzato scatenato da `GameScoreInput` dopo il salvataggio di un punteggio. Viene ascoltato da `DailySummaryCards`, `LeaderboardTable`, `TrendChart` e `DashboardPage` per aggiornare istantaneamente la vista senza ricaricare la pagina.
