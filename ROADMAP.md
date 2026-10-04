# 🚀 Who Is Losing Today? - Roadmap & Sviluppi Futuri

Questo documento raccoglie le funzionalità e i miglioramenti architetturali pianificati per le prossime fasi di sviluppo dell'applicazione.

---

### 1. 🔐 Autenticazione Utenti (Supabase Auth)
- Registrazione e Login utenti (Email/Password, OAuth Google/GitHub).
- Associazione dei punteggi salvati al profilo utente verificato (`user_id`).
- Gestione dei ruoli ed eventuale creazione di gruppi/stanze private tra amici.

---

### 2. 🗄️ Database Persistente (Supabase / PostgreSQL)
- **Tabella `players`**: Profilo dei giocatori, avatar, statistiche generali e streak.
- **Tabella `game_scores`**: Tracciamento storico di ciascuna partita (utente, tipo di gioco, punteggio grezzo, punteggio normalizzato, data e ora).
- **Tabella `games`**: Configurazione dei giochi supportati, regole di ordinamento (più alto è meglio vs meno tentativi è meglio) e formule di conversione.

---

### 3. 🧮 Formule Dedicate per il Punteggio Totale (Overall)
- Affinamento dell'algoritmo di normalizzazione dei punteggi per confrontare giochi diversi:
  - Conversioni percentuali / Z-score per giochi con metriche eterogenee.
  - Ponderazione dei giochi in caso di aggiunta di un 4° o 5° gioco in futuro.
  - Gestione di eventuali giornate in cui un giocatore salta un gioco (penalità o media).

---

### 4. 🧩 Modulo Parser Dedicato (`lib/score-parser.ts`)
- Creazione di un modulo autonomo e testato per l'estrazione intelligente del punteggio dal testo incollato dall'utente.
- Riconoscimento automatico del gioco dal formato del testo (senza necessità di selezionare manualmente il tab).
- Gestione avanzata di edge case (emoji, testo multilinea, formati ufficiali di condivisione di Krilion, Metazooa e Chronophoto).

---

### 5. Altro
- Aggiungere una home page
- Creare uno stile più unico e particolare
- Proteggere le pagine a seconda che si sia effettuato o no l'accesso
