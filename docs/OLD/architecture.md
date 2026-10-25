# Architettura Generale dell'Applicazione

Questo documento descrive la visione d'insieme dell'architettura di **Who Is
Losing Today**, illustrando il modello delle responsabilità, il flusso dei dati
ed i layer tecnologici.

---

## 1. Mappa dei Layer Architetturali

L'applicazione segue un'architettura a **Layer Decoppiati** basata su Next.js
App Router:

```text
+-----------------------------------------------------------------------+
| 1. PRESENTATION LAYER (React Client & Server Components) |
| - Pages: /dashboard, /profile |
| - Organisms: Header, DailySummaryCards, LeaderboardTable, etc. |
| - Molecules & Atoms (Atomic Design) |
+-----------------------------------------------------------------------+
 │
 ▼
+-----------------------------------------------------------------------+
| 2. API & SERVICE LAYER (Next.js Route Handlers) |
| - GET /api/dashboard (Interroga db-service) |
| - POST /api/scores (Invia nuovi punteggi) |
| - /api/auth/[...nextauth] (Gestisce OAuth e Sessioni) |
+-----------------------------------------------------------------------+
 │
 ▼
+-----------------------------------------------------------------------+
| 3. DATA ACCESS LAYER (Prisma ORM & Services) |
| - Singleton Prisma Client (lib/prisma.ts) |
| - Servizio Query Database (lib/services/db-service.ts) |
| - Adapter Autenticazione (@auth/prisma-adapter) |
+-----------------------------------------------------------------------+
 │
 ▼
+-----------------------------------------------------------------------+
| 4. INFRASTRUCTURE & STORAGE LAYER (PostgreSQL) |
| - Docker PostgreSQL Container (Sviluppo Locale) |
| - Supabase Cloud PostgreSQL (Produzione) |
+-----------------------------------------------------------------------+
```

---

## 2. Flusso di Esecuzione Principale: Registrazione Punteggio

Ecco la sequenza esatta delle operazioni quando un utente registra un punteggio:

1. **Input Utente**: L'utente seleziona il gioco e incolla il testo del
   risultato nel componente `GameScoreInput`.
2. **Parsing Regex**: Viene invocata la funzione `parseScore(text, game)` che
   estrae il valore numerico grezzo.
3. **Chiamata API**: `GameScoreInput` invia una richiesta `POST /api/scores`
   includendo il punteggio grezzo, l'email dell'utente e la data.
4. **Normalizzazione Matematica**: L'endpoint API calcola il punteggio
   normalizzato su scala 0-100 tramite `calculateNormalizedScore(game, score)`.
5. **Persistenza su PostgreSQL**: Prisma esegue una `upsert` sulla tabella
   `daily_scores` aggiornando o creando il record per la giornata.
6. **Re-render Reattivo**: Le componenti della Dashboard (`DailySummaryCards`,
   `LeaderboardTable`, `TrendChart`) aggiornano la propria vista riflettendo la
   nuova classifica.

---

## 3. Indice di Navigazione della Documentazione

Per approfondire ciascun singolo modulo dell'applicazione:

- **[Teoria Autenticazione SSO](theory/sso-authentication.md)**
- **[Teoria Database & Prisma ORM](theory/prisma-and-orm.md)**
- **[Teoria Infrastruttura & Deployment](theory/deployment-and-infrastructure.md)**
- **[Registro delle API REST](api-reference.md)**
- **[Guida per Aggiungere Nuovi Giochi](adding-games.md)**
- **[Componenti Atomi](components/atoms.md)**
- **[Componenti Molecole](components/molecules.md)**
- **[Componenti Organismi](components/organisms.md)**
- **[Componenti Template](components/templates.md)**
- **[Guida Completa Funzioni & Utility](components/functions-and-utilities.md)**
