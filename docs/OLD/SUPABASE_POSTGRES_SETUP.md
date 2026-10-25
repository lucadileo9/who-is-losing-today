# Guida alla Configurazione di PostgreSQL (Docker Locale & Supabase Cloud)

Questa guida illustra come avviare il database PostgreSQL in **locale tramite
Docker** e come effettuare la migrazione online su **Supabase Cloud** tramite
Prisma ORM.

---

## Opzione 1: Database PostgreSQL Locale con Docker (Sviluppo Offline)

Se vuoi sviluppare e testare offline sul tuo computer in locale:

### 1. Avvia il container Docker

Assicurati che **Docker Desktop** sia in esecuzione sul tuo PC, poi apri il
terminale nella cartella del progetto ed esegui:

```bash
docker compose up -d
```

_(Questo comando scaricherà l'immagine di PostgreSQL 16 ed avvierà un database
sulla porta `5432`)_.

### 2. Configura le variabili in `.env.local`

Nel file `.env.local` inserisci i parametri di connessione locali:

```env
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/who_is_losing_today?schema=public"
DIRECT_URL="postgresql://postgres:mysecretpassword@localhost:5432/who_is_losing_today?schema=public"
```

### 3. Crea le tabelle ed inserisci i dati di test

Esegui da terminale:

```bash
# 1. Crea la struttura delle tabelle (Utenti, Punteggi, Giochi)
npx prisma db push

# 2. Popola il DB con 14 giorni di storico e 5 giocatori di test
npx prisma db seed
```

### 4. Esplora il DB con Prisma Studio

Per aprire la dashboard visiva del tuo database locale:

```bash
npx prisma studio
```

Si aprirà nel browser a `http://localhost:5555`.

---

## Opzione 2: Database PostgreSQL su Supabase Cloud (Produzione)

Se vuoi pubblicare il database online su Supabase:

### 1. Crea il progetto su Supabase

1. Vai su **[supabase.com](https://supabase.com)** e fai il login.
2. Clicca su **New Project**:

- **Name**: `who-is-losing-today`
- **Database Password**: Scegli una password sicura e salvala.
- **Region**: Frankfurt (EU).

### 2. Copia le chiavi di connessione

1. Vai in **Project Settings** **Database**.
2. Copia la **Pooled Connection String** (porta `6543`) ed incollala in
   `DATABASE_URL`.
3. Copia la **Direct Connection String** (porta `5432`) ed incollala in
   `DIRECT_URL`.

### 3. Effettua la migrazione con 1 comando

Incolla le chiavi nel tuo `.env.local` e lancia:

```bash
npx prisma db push
```

Tutte le tabelle verranno create istantaneamente su Supabase!
