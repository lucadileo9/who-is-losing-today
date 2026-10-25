# Who Is Losing Today? — Documentazione di Sistema

Benvenuto nella documentazione tecnica ufficiale di **Who Is Losing Today?**.  
Questa documentazione descrive l'architettura, la logica applicativa, l'infrastruttura e i concetti teorici alla base del progetto, aggiornata al refactoring architetturale di produzione.

---

## Struttura della Documentazione

La documentazione è suddivisa in 4 aree modulari tematiche:

```text
docs/
├── README.md                          # Questo indice generale
│
├── 01-architecture/                   # Architettura e Sicurezza
│   ├── overview.md                    # Stack tecnologico, Next.js 15 App Router e flussi
│   ├── database-and-models.md         # Schema Prisma, modelli, relazioni, indici ed enum
│   └── auth-and-security.md           # NextAuth, Google OAuth, Whitelist gating, RBAC e Zod
│
├── 02-backend-and-dal/                # Data Access Layer & Logica di Business
│   ├── dal-design.md                  # Architettura DAL (daily, period, hall-of-fame, user)
│   ├── dynamic-games.md               # Sistema multi-gioco dinamico e guida aggiunta giochi
│   ├── scoring-and-rankings.md        # Algoritmi di calcolo, divisori dinamici, tie-break e record
│   └── api-and-actions.md             # Specifica completa di Server Actions e Route Handlers
│
├── 03-infrastructure-and-devops/      # Ambienti, Container e CI/CD
│   ├── local-development.md           # Setup locale, PostgreSQL con Docker Compose, seed e comandi
│   ├── ci-cd-pipeline.md              # Workflow GitHub Actions (lint, typecheck, build, lockfile)
│   ├── docker-deployment.md           # Dockerfile multi-stage, produzione e Cloudflare Tunnel
│   └── scripts-and-tooling.md         # Script npm per validazione, pulizia e sviluppo
│
├── 04-theory/                         # Concetti Teorici e Apprendimenti
│   ├── sso-and-oauth.md               # Teoria SSO, OAuth 2.0 / OIDC, JWT e Sessioni
│   ├── package-management-and-semver.md # SemVer, `^` vs `~`, lockfile, audit e strategie di aggiornamento
│   ├── build-vs-runtime.md            # Static analysis, page collection, segreti ed env vars
│   └── prisma-and-orm.md              # ORM, differenze tra `db push` e migrations, connection pooling
│
└── OLD/                               # Archivio storico della documentazione pre-refactoring
```

---

## Indice dei Contenuti

### [Architettura e Sicurezza](./01-architecture/)
- **[Panoramica del Sistema](./01-architecture/overview.md)**: Panoramica dell'applicazione, Next.js 15 con App Router, separazione Server/Client Components.
- **[Database e Modelli](./01-architecture/database-and-models.md)**: Database PostgreSQL, schema Prisma v6, modelli `User`, `Account`, `Session`, `Whitelist`, `Score`, `DailyNote`, `BugReport` ed enum.
- **[Autenticazione e Sicurezza](./01-architecture/auth-and-security.md)**: Flusso Google OAuth, controllo autorizzativo tramite Whitelist database-first, controllo ruoli RBAC (`ADMIN` / `PLAYER`), middleware e validazione centralizzata Zod con `auth-guard.ts`.

### [Backend e Data Access Layer](./02-backend-and-dal/)
- **[Design del DAL](./02-backend-and-dal/dal-design.md)**: Pattern Data Access Layer per query performanti e riutilizzabili (`lib/data/`).
- **[Motore Multi-Gioco Dinamico](./02-backend-and-dal/dynamic-games.md)**: Supporto a giochi dinamici (`byGame`), configurazione estendibile e guida passo-passo per aggiungere un nuovo gioco.
- **[Algoritmi di Punteggio e Classifiche](./02-backend-and-dal/scoring-and-rankings.md)**: Formule per i punteggi aggregati, calcolo del divisore dinamico basato sui giochi effettivamente disputati, regole di spareggio e tracciamento record (Hall of Fame).
- **[Server Actions e API Reference](./02-backend-and-dal/api-and-actions.md)**: Contratti dettagliati di tutte le Server Actions (`app/actions/`) e Route Handlers (`app/api/`) con schemi Zod.

### [Infrastruttura e DevOps](./03-infrastructure-and-devops/)
- **[Sviluppo Locale](./03-infrastructure-and-devops/local-development.md)**: Avvio rapido con Docker Compose locale (`who-is-losing-today-db-local`), configurazione `.env.local` e seeding.
- **[Pipeline CI/CD](./03-infrastructure-and-devops/ci-cd-pipeline.md)**: Pipeline GitHub Actions, test di formattazione, linting, typechecking e build automatica su push e pull request.
- **[Deploy con Docker](./03-infrastructure-and-devops/docker-deployment.md)**: Architettura Docker multi-stage (deps, builder, runner), modalità Next.js standalone e tunneling Cloudflare.
- **[Script e Tooling](./03-infrastructure-and-devops/scripts-and-tooling.md)**: Guida ai comandi npm (`validate`, `check:ci`, `typecheck`, `db:reset`).

### [Teoria e Apprendimenti](./04-theory/)
- **[SSO e Protocolli OAuth 2.0](./04-theory/sso-and-oauth.md)**: Come funziona il Single Sign-On, delegazione dell'autenticazione, callback OAuth e gestione sessioni JWT.
- **[Gestione Pacchetti e SemVer](./04-theory/package-management-and-semver.md)**: Semantic Versioning (`MAJOR.MINOR.PATCH`), differenze tra `Current`, `Wanted` e `Latest`, ruolo di `package-lock.json`, comandi `npm outdated` e `npm audit`.
- **[Build-time vs Runtime](./04-theory/build-vs-runtime.md)**: Analisi statica Next.js durante `next build`, isolamento dei segreti di produzione e prevenzione dei crash di build.
- **[Prisma e ORM](./04-theory/prisma-and-orm.md)**: Come funziona un ORM, differenze tra migrazioni dichiarative e `prisma db push`, generazione tipi e gestione connessioni.

---

### [Archivio Storico (OLD)](./OLD/)
Contiene la documentazione originale e gli appunti di sviluppo redatti prima del refactoring modulare.
