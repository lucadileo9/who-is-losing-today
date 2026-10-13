# 🏆 Who Is Losing Today?

> **Chi sta perdendo oggi?** — L'applicazione web moderna per tracciare i punteggi quotidiani delle sfide tra amici nei giochi **Krilion**, **Metazooa** e **Chronophoto**.

---

## 🚀 Panoramica del Progetto

**Who Is Losing Today** è una web app Full-Stack sviluppata con **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, **Prisma ORM**, **PostgreSQL** e **NextAuth (Google OAuth)**.

L'applicazione permette a un gruppo di amici di:
1. **Registrare i punteggi quotidiani** incollando direttamente il testo del risultato (con parsing Regex automatico).
2. **Consultare la Classifica Generale e per Singoli Giochi** con normalizzazione uniforme dei punteggi su scala 0-100.
3. **Identificare "Il Perdente del Giorno"** ed il podio della giornata per qualsiasi data selezionabile da un widget calendario.
4. **Analizzare l'Andamento Storico** tramite grafici interattivi per gruppo e per singolo utente.
5. **Autenticarsi con Google OAuth 2.0** o in modalità test locale.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 15.5 (App Router & React Server Components)
* **Linguaggio**: TypeScript 5.3
* **Styling & UI**: Tailwind CSS, Shadcn UI, Lucide Icons, Next-Themes (Dark/Light mode)
* **Grafici**: Recharts (con Custom Tooltip ad alto contrasto)
* **Database & ORM**: PostgreSQL 16 (Docker Locale / Supabase Cloud), Prisma ORM 6.4
* **Autenticazione**: NextAuth.js (Google OAuth 2.0 & Prisma Adapter)

---

## 📚 Hub della Documentazione Dettagliata

La documentazione del repository è suddivisa in sezioni specializzate all'interno della cartella [`docs/`](docs/):

### 🏛️ Architettura Generale & Teoria
* 🏛️ **[`docs/architecture.md`](docs/architecture.md)**: Architettura generale dell'applicazione e flusso dei dati.
* 🔐 **[`docs/theory/sso-authentication.md`](docs/theory/sso-authentication.md)**: Teoria dell'autenticazione SSO, OAuth 2.0, JWT e Cookies.
* 🗄️ **[`docs/theory/prisma-and-orm.md`](docs/theory/prisma-and-orm.md)**: Teoria dei database relazionali RDBMS e Prisma ORM.
* 🚢 **[`docs/theory/deployment-and-infrastructure.md`](docs/theory/deployment-and-infrastructure.md)**: Confronto tra ambiente Docker Locale, Supabase e Vercel.

### 🔌 API, Configurazione & Estensioni
* 🔌 **[`docs/api-reference.md`](docs/api-reference.md)**: Registro completo delle rotte API REST.
* 🎮 **[`docs/adding-games.md`](docs/adding-games.md)**: Guida passo-passo per aggiungere un nuovo gioco in 5 minuti.
* 🔑 **[`docs/GOOGLE_AUTH_SETUP.md`](docs/GOOGLE_AUTH_SETUP.md)**: Guida per sviluppatori per configurare Google Cloud Console.
* 🗄️ **[`docs/SUPABASE_POSTGRES_SETUP.md`](docs/SUPABASE_POSTGRES_SETUP.md)**: Guida operativa per avviare il DB su Docker o Supabase.

### 🧩 Componenti UI (Atomic Design) e Funzioni
* ⚛️ **[`docs/components/atoms.md`](docs/components/atoms.md)**: Guida a tutti i componenti Atomi (`Button`, `Input`, `Avatar`, `Badge`, `Providers`).
* 🧬 **[`docs/components/molecules.md`](docs/components/molecules.md)**: Guida a tutte le Molecole (`GameScoreInput`, `DatePicker`, `ChartTooltip`, `GameTabFilter`).
* 🏢 **[`docs/components/organisms.md`](docs/components/organisms.md)**: Guida a tutti gli Organismi (`Header`, `DailySummaryCards`, `LeaderboardTable`, `TrendChart`).
* 📄 **[`docs/components/templates.md`](docs/components/templates.md)**: Guida ai Template di pagina (`DashboardTemplate`, `ProfileTemplate`).
* ⚙️ **[`docs/components/functions-and-utilities.md`](docs/components/functions-and-utilities.md)**: Guida completa a tutte le funzioni matematiche, helper e di query DB.

---

## ⚡ Guida Rapida di Avvio (Come far partire l'app)

Puoi avviare l'applicazione in **due modalità principali** a seconda delle tue esigenze:

---

### 🚀 Modalità 1: Full-Stack con Docker (Consigliata per testare l'ambiente di produzione)

Questa modalità avvia sia il database PostgreSQL che l'applicazione Next.js containerizzata esattamente come girerà in produzione. All'avvio del container vengono eseguiti **automaticamente** la migrazione dello schema e il **seeding** completo dei giochi e degli utenti di test con storico.

1. Assicurati che **Docker Desktop** sia in esecuzione sul tuo PC.
2. Esegui il comando:
   ```bash
   docker compose -f docker-compose.local.yml up --build
   ```
3. Apri il browser su **`http://localhost:3000`**.
4. Per fermare i container: `Ctrl + C` oppure `docker compose -f docker-compose.local.yml down`.

---

### 💻 Modalità 2: Sviluppo Locale Rapido (`npm run dev` + DB Docker)

Ideale mentre programmi, per avere l'**Hot Reloading istantaneo** di Next.js:

1. **Clona il repository ed installa le dipendenze**:
   ```bash
   npm install
   ```

2. **Avvia solo il Database PostgreSQL locale**:
   ```bash
   docker compose -f docker-compose.local.yml up who-is-losing-today-db-local -d
   ```

3. **Configura il file `.env.local`**:
   Copia il template `.env.example` in `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/who_is_losing_today_local?schema=public"
   DIRECT_URL="postgresql://postgres:postgres@localhost:5432/who_is_losing_today_local?schema=public"

   NEXTAUTH_SECRET="sviluppo_locale_chiave_segreta_minimo_32_caratteri"
   NEXTAUTH_URL="http://localhost:3000"

   # Opzionali per sviluppo locale senza login Google:
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   ```

4. **Inizializza il Database e popola i dati di test (Seed)**:
   ```bash
   # 1. Crea le tabelle nel DB
   npx prisma db push

   # 2. Popola giochi, 5 utenti di test, 7 giorni di storico e bacheca
   npx prisma db seed
   ```

5. **Avvia il server di sviluppo Next.js**:
   ```bash
   npm run dev
   ```
   Apri **`http://localhost:3000`**.

---

### 🛠️ Comandi Utili per il Database & Sviluppo

* **`npx prisma db seed`**: Esegue lo script di seeding ([`prisma/seed.ts`](prisma/seed.ts)) in modo idempotente (aggiunge giochi e utenti di test se non presenti).
* **`npm run db:reset`**: Resetta completamente il database, elimina tutti i dati, riapplica lo schema ed esegue il seed da zero.
* **`npx prisma studio`**: Apre una comoda interfaccia grafica web su `http://localhost:5555` per ispezionare e modificare direttamente le tabelle del database.
* **`npm run validate`**: Esegue ESLint e Prettier per verificare la qualità del codice.

