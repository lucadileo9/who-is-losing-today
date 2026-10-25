# 01. Architettura — Panoramica del Sistema

Questo documento descrive la visione d'insieme, lo stack tecnologico e i pattern architetturali di **Who Is Losing Today?**.

---

## 1. Visione del Progetto

**Who Is Losing Today?** è una web application pensata per tracciare e confrontare quotidianamente i punteggi di una serie di giochi online (attualmente *Krilion*, *Metazooa* e *Chronophoto*) disputati tra un gruppo ristretto di amici.

L'applicazione si occupa di:
- **Registrare i punteggi giornalieri** dei giocatori per ciascun gioco.
- **Calcolare il "Perdente del Giorno"** attraverso un sistema ponderato che tiene conto dei giochi effettivamente disputati.
- **Offrire una Bacheca Condivisa** (Chalkboard) con note, sfottò e commenti giornalieri.
- **Visualizzare Statistiche Storiche**: andamento temporale, classifiche per periodo (settimana, mese, anno, all-time) e Hall of Fame (record di vittorie, peggiori serie di sconfitte, cucchiaio di legno).
- **Garantire Accesso Sicuro**: solo gli utenti invitati e presenti nella Whitelist possono autenticarsi tramite Google OAuth.

---

## 2. Stack Tecnologico

Il progetto è costruito su tecnologie moderne, stabili e orientate alla manutenibilità a lungo termine:

| Componente | Tecnologia | Ruolo e Motivazione |
| :--- | :--- | :--- |
| **Framework Web** | [Next.js 15](https://nextjs.org/) (App Router) | Rendering ibrido (Server/Client Components), Server Actions per mutazioni sicure, routing file-based. |
| **Linguaggio** | [TypeScript](https://www.typescriptlang.org/) (v5.9+) | Tipizzazione statica rigorosa su tutto il codebase (`tsc --noEmit`), prevenzione bug a build-time. |
| **Runtime** | [Node.js 22 LTS](https://nodejs.org/) (Alpine Linux) | Ambiente di esecuzione moderno, compatto e performante per l'ambiente Docker e locale. |
| **Database** | [PostgreSQL 16](https://www.postgresql.org/) | RDBMS transazionale relazionale ACID per l'archiviazione consistente di punteggi, utenti e audit log. |
| **ORM** | [Prisma v6](https://www.prisma.io/) (v6.4.0) | Modellazione tipi dal database (`schema.prisma`), query type-safe e migrazioni dichiarative. |
| **Autenticazione** | [NextAuth.js v4](https://next-auth.js.org/) | Protocollo Google OAuth 2.0 / OIDC con adapter Prisma e gating di autorizzazione basato su Whitelist. |
| **Validazione Dati** | [Zod](https://zod.dev/) (v4) | Validazione schema a runtime per tutte le Server Actions e API REST; inferenza diretta dei tipi TS. |
| **Styling & Design** | [Tailwind CSS v3](https://tailwindcss.com/) | Utility-first CSS con palette personalizzata Synthwave/Cyberpunk scura, glassmorphism e neon glow. |
| **Componenti UI** | [Radix UI](https://www.radix-ui.com/) + [Lucide Icons](https://lucide.dev/) | Primitive accessibili e unstyled per modali, dropdown e accordion; icone SVG leggere. |
| **Visualizzazioni** | [Recharts](https://recharts.org/) | Grafici interattivi (andamento punteggi nel tempo, barre e trend percentuali). |
| **CI / CD & Tooling** | GitHub Actions, ESLint 9 (Flat Config), Prettier | Pipeline automatizzata di linting, typecheck e build; formattazione uniforme del codice. |

---

## 3. Pattern Architetturali di Next.js App Router

L'architettura dell'applicazione sfrutta appieno i concetti avanzati del Next.js App Router:

### A. Server Components vs Client Components
- **Server Components (RSC) by default**: La maggior parte dell'applicazione (es. pagine radice, fetch dei dati, layout strutturali) viene renderizzata sul server. Questo garantisce zero impatto sul bundle JavaScript del client, massima velocità di caricamento e sicurezza totale nelle query al database.
- **Client Components (`'use client'`)**: Riservati esclusivamente a componenti che richiedono interazione utente (es. selettore date `DatePicker`, form di inserimento punteggi `GameScoreInput`, modale segnalazione bug `BugReportModal`, grafici animati `TrendChart`).

### B. Mutazioni con Server Actions
Invece di richiedere tradizionali endpoint REST `fetch()` per ogni operazione di scrittura, l'applicazione usa **Next.js Server Actions** (collocate in `app/actions/`):
- `submitScores`: Inserimento o aggiornamento dei punteggi giornalieri.
- `saveDailyNote`: Scrittura della nota/commento giornaliero.
- `updateUserPreferences`: Modifica delle impostazioni del giocatore (colore tema, avatar).
- `manageWhitelist` / `updateUserRole`: Operazioni amministrative protette da controllo di ruolo.

Ogni Server Action valida i dati in ingresso tramite uno schema **Zod** ed esegue l'autenticazione tramite la funzione di guardia `getAuthenticatedUser()`.

### C. Route Handlers (`app/api/`)
Mantenuti per:
- Il flusso di callback di NextAuth: `/api/auth/[...nextauth]`.
- API programmatiche o export di dati: `/api/dashboard`, `/api/scores`, `/api/notes`, `/api/bugs`.

### D. Middleware di Protezione (`middleware.ts`)
Un middleware Edge intercetta tutte le rotte applicative protette (es. `/dashboard`, `/profile`, `/admin/*`), verificando la presenza di un token di sessione valido prima ancora che la richiesta raggiunga il server applicativo.

---

## 4. Struttura delle Directory

L'albero del codice sorgente segue una rigida separazione delle responsabilità:

```text
who-is-losing-today/
├── app/                       # Next.js App Router
│   ├── actions/               # Server Actions (scores, notes, user, admin)
│   ├── admin/                 # Rotte riservate ad amministratori (/admin/bugs, etc.)
│   ├── api/                   # Route Handlers REST e NextAuth endpoints
│   ├── auth/                  # Pagine dedicate all'autenticazione (/auth/unauthorized)
│   ├── dashboard/             # Pagina principale della classifica e statistiche
│   ├── profile/               # Profilo utente e personalizzazione giocatore
│   ├── globals.css            # Stili globali, classi neon e utility glassmorphism
│   ├── layout.tsx             # Root layout con Providers (NextAuth, Theme, Session)
│   └── page.tsx               # Redirect automatico alla dashboard
│
├── components/                # Atomic Design Component Architecture
│   ├── atoms/                 # Componenti base (Avatar, Badge, Bottoni, ThemeProvider)
│   ├── molecules/             # Combinazioni atomiche (DateNavigator, GameTab, Footer)
│   ├── organisms/             # Sezioni complesse (LeaderboardTable, Chalkboard, TrendChart)
│   └── templates/             # Layout di pagina completi (DashboardTemplate, ProfileTemplate)
│
├── lib/                       # Logica di Business e Utilità
│   ├── auth.ts                # Configurazione NextAuth (Google Provider, session, callbacks)
│   ├── auth-guard.ts          # Guardie di sicurezza per Server Actions (RBAC)
│   ├── prisma.ts              # Singleton del client Prisma (gestione connection pooling)
│   ├── data/                  # Data Access Layer (DAL: daily, period, hall-of-fame, user)
│   ├── theme/                 # Centralizzazione token colore Synthwave (colors.ts)
│   ├── types/                 # Interfacce TypeScript condivise (daily, period, admin, etc.)
│   └── validations/           # Schemi di validazione runtime Zod (scores, notes, user)
│
├── prisma/                    # Configurazione Database
│   ├── schema.prisma          # Definizione modelli, enum e relazioni
│   └── seed.ts                # Script di popolazione dati di test e utenti mock
│
├── docs/                      # Documentazione Tecnica Modulare
│   ├── 01-architecture/       # Architettura e Sicurezza (questo modulo)
│   ├── 02-backend-and-dal/    # Data Access Layer e Logica
│   ├── 03-infrastructure-and-devops/ # DevOps, Docker e CI/CD
│   ├── 04-theory/             # Fondamenti teorici e best practices
│   └── OLD/                   # Archivio storico
│
├── .github/workflows/ci.yml   # Pipeline CI/CD automatica
├── docker-compose.yml         # Configurazione container di produzione
├── docker-compose.local.yml   # Configurazione container di sviluppo locale (Postgres)
└── Dockerfile                 # Multi-stage build per Node.js 22 Alpine
```
