# Teoria dell'Infrastruttura: Locale, Container Docker e Cloud

Questo documento analizza l'architettura delle infrastrutture di esecuzione per
**Who Is Losing Today**, offrendo un confronto teorico e pratico tra lo
**Sviluppo Locale in Container Docker** ed il **Deployment in Produzione su
Supabase e Vercel**.

---

## 1. Sviluppo Locale con Container Docker

Nello sviluppo software moderno, riprodurre localmente un ambiente identico alla
produzione senza inquinare il sistema operativo del computer principale è una
sfida fondamentale.

### 1.1 Concetti di Containerizzazione

Un **Container Docker** è un ambiente isolato che impacchetta il motore del
database (PostgreSQL 16) con tutte le librerie ed i file di configurazione
necessari.

```text
+-------------------------------------------------------------------+
| Host Operating System (Windows / macOS / Linux) |
| |
| +-----------------------------------------------------------+ |
| | Docker Engine | |
| | | |
| | +---------------------------------------------------+ | |
| | | Container: who_is_losing_today_db (postgres:16) | | |
| | | Porta Interna: 5432 <---> Mappata Host: 5432 | | |
| | +---------------------------------------------------+ | |
| | | | |
| | v | |
| | Volume Persistente: postgres_data | |
| +-----------------------------------------------------------+ |
+-------------------------------------------------------------------+
```

### 1.2 Architettura di `docker-compose.yml` ([`docker-compose.yml`](file:///c:/Users/lucad/my-projects/who-is-losing-today/docker-compose.yml))

Il file di orchestrazione dichiara le risorse necessarie per il DB locale:

- **Immagine Base**: `postgres:16-alpine` (versione ottimizzata e leggera di
  PostgreSQL).
- **Port Mapping (`5432:5432`)**: Collega la porta `5432` del contenitore alla
  porta `5432` di `localhost`.
- **Volumi Persistenti (`postgres_data`)**: I file del database vengono scritti
  all'interno di un volume gestito da Docker. Anche se il contenitore viene
  arrestato (`docker compose down`), i dati rimangono intatti al riavvio
  successivo (`docker compose up -d`).

---

## 2. Infrastruttura Cloud: Supabase e Vercel

Quando l'applicazione viene distribuita per essere usata dai tuoi amici via
Internet, l'infrastruttura si sposta su due piattaforme Cloud leader di mercato:

```text
[ Utenti su Internet ]
 │
 ▼
+-----------------------+ +------------------------------------+
| Vercel Serverless | | Supabase Cloud |
| Next.js App Router | -- Transaction -> | PostgreSQL 16 Database |
| API Routes & Client | Pooler (6543) | Connection Pooler (PgBouncer) |
+-----------------------+ +------------------------------------+
 │
 Direct Connection
 (5432)
 │
 [ Prisma DB Push Migration ]
```

### 2.1 Supabase PostgreSQL & Connection Pooling (PgBouncer)

In ambienti Serverless (come Vercel), ogni richiesta degli utenti può avviare un
nuovo processo server temporaneo. Se 100 utenti aprono l'app contemporaneamente,
potrebbero essere tentate 100 connessioni simultanee al database, esaurendo
rapidamente la memoria di PostgreSQL.

Per risolvere questo problema, Supabase fornisce due stringhe di connessione:

1. **`DATABASE_URL` (Pooled Connection - Porta 6543)**: Passa attraverso un
   **Connection Pooler (PgBouncer)**. Pgbouncer riutilizza un numero ristretto
   di connessioni fisiche verso PostgreSQL distribuendole efficientemente tra
   centinaia di funzioni serverless temporanee.
2. **`DIRECT_URL` (Direct Connection - Porta 5432)**: Connessione diretta senza
   intermediari, indispensabile per comandi di migrazione DDL come
   `npx prisma db push` che richiedono il controllo completo delle transazioni
   sulla struttura delle tabelle.

---

## 3. Confronto Comparativo tra Locale e Produzione

| Caratteristica          | Locale (Docker + Node.js)                | Produzione (Supabase + Vercel)               |
| :---------------------- | :--------------------------------------- | :------------------------------------------- |
| **Ambiente DB**         | PostgreSQL 16 in Container Docker        | PostgreSQL 16 su AWS/Supabase Cloud          |
| **Host Application**    | `localhost:3000` (Server Node.js locale) | CDN Vercel Serverless Edge                   |
| **Connessione DB**      | Diretta su `localhost:5432`              | Connection Pooler PgBouncer (`porta 6543`)   |
| **Costo**               | 100% Gratuito (Risorse del proprio PC)   | Tier Gratuito (Supabase Free + Vercel Hobby) |
| **Dipendenza Internet** | Nessuna (Funziona anche offline)         | Richiede connessione Internet attiva         |
| **Autenticazione**      | Google OAuth o Provider Demo Locale      | Google OAuth nativo in HTTPS                 |
