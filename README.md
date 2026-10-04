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

## ⚡ Guida Rapida di Avvio (Quickstart)

### 1. Clona il Repository ed Installa le Dipendenze
```bash
git clone https://github.com/lucadileo9/who-is-losing-today.git
cd who-is-losing-today
npm install
```

### 2. Avvia il Database PostgreSQL Locale con Docker
Assicurati che **Docker Desktop** sia aperto sul tuo PC, poi esegui:
```bash
docker compose up -d
```

### 3. Configura il File `.env.local`
Crea un file `.env.local` nella radice del progetto:
```env
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/who_is_losing_today?schema=public"
DIRECT_URL="postgresql://postgres:mysecretpassword@localhost:5432/who_is_losing_today?schema=public"

NEXTAUTH_SECRET="super_secret_key_12345"
NEXTAUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="il_tuo_client_id_google"
GOOGLE_CLIENT_SECRET="il_tuo_client_secret_google"
```

### 4. Crea le Tabelle e Popola lo Storico di Test (Seed)
```bash
# 1. Genera le tabelle in PostgreSQL
npx prisma db push

# 2. Inserisce 14 giorni di storico e 5 giocatori di test
npx prisma db seed
```

### 5. Avvia il Server di Sviluppo
```bash
npm run dev
```
Apri il browser su **`http://localhost:3000`**.
