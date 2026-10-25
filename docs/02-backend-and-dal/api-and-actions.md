# 02. Backend e DAL — Server Actions e API Reference

Questo documento descrive le **Server Actions** e i **Route Handlers** REST disponibili nell'applicazione, con i rispettivi payload Zod, controlli di autorizzazione e codici di ritorno.

---

## 1. Server Actions (`app/actions/`)

Le Server Actions costituiscono il canale primario di mutazione dati nel Next.js App Router. Ogni action esegue la guardia di autorizzazione (`lib/auth-guard.ts`), la validazione runtime Zod e l'invalidazione della cache tramite `revalidatePath()`.

---

### A. Dominio Punteggi ([app/actions/scores.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/actions/scores.ts))

#### `submitScoreAction(formData: unknown)`
Inserisce o aggiorna il punteggio di un giocatore per un determinato gioco e data solare.

* **Autorizzazione**: Utente autenticato (`PLAYER` o `ADMIN`).
* **Schema di Validazione**: `submitScoreSchema`
  ```typescript
  {
    gameId: string;       // es. "Krilion", "Metazooa", "Chronophoto"
    rawScore: number;     // intero >= 0 e <= 100000
    scoreDate: string;    // regex YYYY-MM-DD
    rawInputText?: string // testo incollato opzionale (max 2000 car.)
  }
  ```
* **Comportamento Database**: `prisma.dailyScore.upsert()` sul vincolo composito `[userId, gameId, scoreDate]`. Calcola automaticamente il `normalizedScore` corrispondente.
* **Cache Revalidation**: `/dashboard`, `/profile`, `/profile/[userId]`.
* **Ritorno**:
  ```typescript
  { success: true; scoreId: string } | { success: false; error: string }
  ```

---

### B. Dominio Bacheca ([app/actions/notes.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/actions/notes.ts))

#### `createNoteAction(content: string)`
Pubblica un nuovo messaggio/sfottò sulla bacheca giornaliera.
* **Autorizzazione**: Utente autenticato.
* **Schema**: `content`: stringa compresa tra 1 e 500 caratteri.
* **Ritorno**: `{ success: true; noteId: string } | { success: false; error: string }`.

#### `deleteNoteAction(noteId: string)`
Elimina un messaggio dalla bacheca.
* **Autorizzazione**: Solo l'autore del messaggio (`note.userId === user.id`) oppure un `ADMIN`.
* **Ritorno**: `{ success: true } | { success: false; error: string }`.

---

### C. Dominio Profilo Utente ([app/actions/user.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/actions/user.ts))

#### `updateUserPreferencesAction(data: unknown)`
Aggiorna il colore distintivo del giocatore (usato nei grafici Recharts e bordo avatar) e le iniziali.
* **Autorizzazione**: Utente autenticato (aggiorna solo il proprio profilo di sessione).
* **Schema**:
  ```typescript
  {
    color: string;     // Regex Hex: #RRGGBB o #RGB
    initials?: string; // Max 3 caratteri (opzionale)
  }
  ```
* **Ritorno**: `{ success: true } | { success: false; error: string }`.

---

### D. Dominio Amministrazione ([app/actions/admin.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/app/actions/admin.ts))

> [!CAUTION]
> Tutte le action di questo dominio richiedono la guardia `getAuthenticatedAdmin()`. Se l'utente non ha ruolo `ADMIN`, l'operazione viene respinta con errore 403 immediato.

| Server Action | Payload | Descrizione |
| :--- | :--- | :--- |
| `addToWhitelistAction` | `{ email: string, role?: Role }` | Aggiunge un indirizzo email alla Whitelist permettendogli di effettuare il login. |
| `removeFromWhitelistAction` | `email: string` | Rimuove un indirizzo email dalla Whitelist (revoca accesso). |
| `updateUserRoleAction` | `{ userId: string, role: Role }` | Modifica il ruolo di un utente esistente (`ADMIN` $\leftrightarrow$ `PLAYER`). |
| `updateBugReportStatusAction` | `{ bugId: string, status: BugStatus }` | Aggiorna lo stato di avanzamento di una segnalazione (`OPEN`, `RESOLVED`, `CLOSED`). |

---

## 2. Route Handlers REST (`app/api/`)

Utilizzati per interrogazioni programmatiche, esportazioni o chiamate da componenti client.

### `GET /api/dashboard`
Restituisce i dati aggregati del giorno e del periodo per popolare la schermata principale.
* **Query Parameters**:
  - `date`: `YYYY-MM-DD` (default: oggi)
  - `period`: `week` | `month` | `last_month` | `all` (default: `month`)
* **Risposta (200 OK)**:
  ```json
  {
    "daily": { ...DailyResultsDTO },
    "period": { ...PeriodResultsDTO },
    "hallOfFame": { ...HallOfFameDTO }
  }
  ```

---

### `GET /api/notes`
Restituisce la lista dei messaggi recenti della bacheca (ultimi 7 giorni).
* **Query Parameters**: `limit` (opzionale, default: 50).
* **Risposta (200 OK)**: Array di `{ id, content, createdAt, user: { id, name, color, image } }`.

---

### `GET /api/user/me`
Restituisce il profilo, le preferenze e le statistiche complete del giocatore attualmente autenticato.
* **Risposta (200 OK)**: Oggetto `UserProfileDTO` con storico partite, streak e record personali.
* **Risposta (401 Unauthorized)**: Se la sessione non è presente o è scaduta.

---

### `POST /api/bugs` e `PATCH /api/bugs/[id]`
Sistema di gestione segnalazioni bug:
- `POST /api/bugs`: Invio di una segnalazione (`description`, `category`, `priority`).
- `PATCH /api/bugs/[id]`: Aggiornamento dello stato (riservato agli amministratori).
