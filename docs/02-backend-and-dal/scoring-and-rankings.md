# Backend e DAL — Algoritmi di Punteggio e Classifiche

Questo documento descrive formalmente le formule matematiche di normalizzazione,
il calcolo della classifica del giorno, le condizioni di assegnazione del
perdente e le aggregazioni storiche.

---

## Il Problema della Normalizzazione

L'applicazione confronta giochi con unità di misura e metriche profondamente
disomogenee:

- **Chronophoto**: Punti da 0 a 5.000 (più alto è meglio).
- **Krilion**: Punti da 0 a circa 700 (più alto è meglio).
- **Metazooa**: Tentativi da 1 a 20 (meno tentativi è meglio; se fallito,
  punteggio nullo).

Sommare i punteggi grezzi favorirebbe in modo sproporzionato Chronophoto,
rendendo irrilevanti gli altri due giochi. Per questo, ogni punteggio viene
scalato in un intervallo standard **`0 - 1000`** prima di qualsiasi
aggregazione.

---

## Formule di Normalizzazione per Singolo Gioco

Le funzioni risiedono in
[lib/game-data.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/game-data.ts):

### Chronophoto (Punti: Higher is Better)

Il punteggio massimo teorico è 5.000:
$$\text{NormScore}_{\text{Chronophoto}} = \min\left(1000, \max\left(0, \text{round}\left(\frac{\text{rawScore}}{5000} \times 1000\right)\right)\right)$$

_Esempi:_

- `5000` pt $\rightarrow$ **`1000`**
- `3129` pt $\rightarrow$ **`626`**
- `0` pt $\rightarrow$ **`0`**

---

### Krilion (Punti: Higher is Better)

Il punteggio di riferimento massimo è 700:
$$\text{NormScore}_{\text{Krilion}} = \min\left(1000, \max\left(0, \text{round}\left(\frac{\text{rawScore}}{700} \times 1000\right)\right)\right)$$

_Esempi:_

- `700` pt (o superiore) $\rightarrow$ **`1000`**
- `616` pt $\rightarrow$ **`880`**
- `350` pt $\rightarrow$ **`500`**

---

### Metazooa (Tentativi: Lower is Better)

Si basa su un massimo di 20 tentativi. Indovinare in 1 tentativo rappresenta la
perfezione (1000 pt), 20 tentativi rappresenta il minimo (0 pt):

$$ \text{NormScore}_{\text{Metazooa}} = \begin{cases}
0 & \text{se } \text{rawScore} \le 0 \text{ o } \text{rawScore} > 20 \\
\min\left(1000, \max\left(0, \text{round}\left(\frac{20 - \text{rawScore}}{19} \times 1000\right)\right)\right) & \text{se } 1 \le \text{rawScore} \le 20
\end{cases}$$

*Esempi:*
- `1` tentativo $\rightarrow$ $\frac{19}{19} \times 1000 =$ **`1000`**
- `3` tentativi $\rightarrow$ $\frac{17}{19} \times 1000 =$ **`895`**
- `10` tentativi $\rightarrow$ $\frac{10}{19} \times 1000 =$ **`526`**
- `20` tentativi $\rightarrow$ $\frac{0}{19} \times 1000 =$ **`0`**

---

## Punteggio Complessivo Giornaliero ("Totale")

Il punteggio del Totale giornaliero per ciascun giocatore è la media aritmetica dei punteggi normalizzati di tutti i giochi attivi configurati nel sistema:

$$\text{Totale} = \text{round}\left(\frac{\sum_{i=1}^{N} \text{NormScore}_{i}}{N}\right)$$
dove $N$ è il numero totale di giochi attivi nella giornata.

> [!WARNING]
> **Penalità per partite saltate**: Se un giocatore inserisce il punteggio solo per 1 gioco su 3, i rimanenti 2 giochi valgono `0`. La sua media viene comunque divisa per $3$, portando il suo Totale verso il fondo della classifica. Questa regola incentiva tutti i giocatori a completare l'intera trilogia quotidiana.

---

## Assegnazione di Vincitore e Perdente del Giorno

In [lib/data/daily.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/data/daily.ts):

1. **Ordinamento**: La lista giocatori viene ordinata per `normalizedScore` decrescente:
   - Rank 1: **Vincitore del Giorno** (`winner`).
   - Rank $N$: Ultimo classificato.
2. **Regola di Salvaguardia del Perdente**:
   ```typescript
   loser: totalPlayers >= 2 ? (rankedTotale[totalPlayers - 1] ?? null) : null
   ```
   > [!IMPORTANT]
   > Se in una giornata gioca **un solo utente**, egli viene registrato come partecipante ma **NON** come perdente (`loser: null`). Non ha senso assegnare il cucchiaio di legno a chi gioca da solo.

---

## Algoritmo di Spareggio (Tie-Breaking)

Quando due o più giocatori ottengono lo stesso punteggio normalizzato:
- **Nei singoli giochi**: Viene confrontato il punteggio grezzo (`rawScore`):
  - Se `isLowerBetter === true`: vince chi ha il `rawScore` minore.
  - Se `isLowerBetter === false`: vince chi ha il `rawScore` maggiore.
- **Nel Totale**: Se la media normalizzata coincide perfettamente, i giocatori condividono la stessa posizione di classifica (pari merito).

---

## Statistiche di Periodo e Hall of Fame

### Classifiche di Periodo ([lib/data/period.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/data/period.ts))
Nei filtri per periodo (`week`, `month`, `last_month`, `all`), l'ordinamento primario è determinato da:
$$\text{averageScore} = \text{round}\left(\frac{\text{totalPoints}}{\text{playedCount}}\right)$$
I criteri secondari di ordinamento sono `playedCount` (a parità di media, premia la costanza) e `bestScore`.

### Hall of Fame ([lib/data/hall-of-fame.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/data/hall-of-fame.ts))
Estrae i record storici assoluti:
- **Record Krilion**: `orderBy: { rawScore: 'desc' }`.
- **Record Metazooa**: `where: { rawScore: { gt: 0 } }, orderBy: { rawScore: 'asc' }`.
- **Record Chronophoto**: `orderBy: { rawScore: 'desc' }`.
- **Record Totale di Sempre**: La combinazione `userId + scoreDate` con la media giornaliera su 3 giochi più alta mai registrata.
$$
