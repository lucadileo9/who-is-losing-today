# DevOps — Ambiente di Sviluppo Locale

Questo documento è la guida operativa per configurare, avviare e manutenere
l'ambiente di sviluppo locale di **Who Is Losing Today?**.

---

## Prerequisiti di Sistema

Prima di iniziare, verificare che siano installati sul proprio computer:

- **Node.js**: Versione **22 LTS** (`node -v`).
- **npm**: Versione 10+ (`npm -v`).
- **Docker & Docker Compose**: Per eseguire il database PostgreSQL in locale
  (`docker --version`).
- **Git**: Per il controllo versione.

---

## Configurazione delle Variabili d'Ambiente

Creare o modificare i file [.env](../../.env) e [.env.local](../../.env.local)
nella radice del progetto:

```env
# ------------------------------------------------------------------------------
# DATABASE POSTGRESQL LOCALE
# ------------------------------------------------------------------------------
POSTGRES_USER="user"
POSTGRES_PASSWORD="user"
POSTGRES_DB="who_is_losing_today_local"

# Connection strings per Prisma (porta mappata sull'host 5432)
DATABASE_URL="postgresql://user:user@localhost:5432/who_is_losing_today_local?schema=public"
DIRECT_URL="postgresql://user:user@localhost:5432/who_is_losing_today_local?schema=public"

# ------------------------------------------------------------------------------
# NEXTAUTH & SICUREZZA
# ------------------------------------------------------------------------------
NEXTAUTH_SECRET="sviluppo_locale_chiave_segreta_minimo_32_caratteri"
NEXTAUTH_URL="http://localhost:3000"

# ------------------------------------------------------------------------------
# GOOGLE OAUTH 2.0 (Google Cloud Console)
# ------------------------------------------------------------------------------
GOOGLE_CLIENT_ID="il-tuo-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="il-tuo-client-secret"
```

> [!TIP] Su Google Cloud Console, assicurarsi di aver registrato come URI di
> reindirizzamento autorizzato: `http://localhost:3000/api/auth/callback/google`

---

## Modalità di Avvio

### Modalità A: Hybrid (Consigliata)

> **Database in Docker + Web App in Node.js nativo sull'host.**  
> Questa modalità offre le prestazioni migliori: Hot Module Reloading (HMR)
> istantaneo, notifiche immediate del compilatore TypeScript e tempi di risposta
> sub-millisecondo.

#### Passo 1: Avviare solo il Database PostgreSQL

```bash
docker compose -f docker-compose.local.yml up who-is-losing-today-db-local -d
```

Il container PostgreSQL 16 sarà attivo in background sulla porta `5432` con
healthcheck automatico.

#### Passo 2: Sincronizzare lo Schema e Popolare i Dati

```bash
# Applica lo schema Prisma al DB locale
npx prisma db push

# Popola il DB con gli utenti di test, giochi e punteggi fittizi
npx prisma db seed
```

#### Passo 3: Abilitare il proprio Account Google in Whitelist

Per poter accedere con il proprio account personale senza essere bloccati dalla
pagina di accesso non autorizzato:

```bash
docker exec -i who-is-losing-today-db-local psql -U user -d who_is_losing_today_local -c "INSERT INTO whitelist (id, email, role, \"createdAt\") VALUES ('wl-myuser', 'tua_email@gmail.com', 'ADMIN', NOW()) ON CONFLICT (email) DO UPDATE SET role = 'ADMIN';"
```

#### Passo 4: Avviare il Dev Server

```bash
npm run dev
```

L'applicazione sarà raggiungibile su
[http://localhost:3000](http://localhost:3000).

---

### Modalità B: Full Docker

> **Sia il Database che l'App Web girano dentro container Docker isolati.**  
> Utile per testare la build di produzione prima del deploy o per verificare il
> comportamento su container puliti.

```bash
docker compose -f docker-compose.local.yml up --build
```

- L'app web compila tramite il Dockerfile multi-stage e si avvia sulla porta
  `3000`.
- Per arrestare i container: premere `Ctrl + C` oppure eseguire
  `docker compose -f docker-compose.local.yml down`.

---

## Reset Rapido del Database Locale

Se si desidera cancellare tutti i dati e ricreare il database da zero con i seed
iniziali:

```bash
npm run db:reset
```

Questo comando esegue internamente:
`prisma db push --force-reset && prisma db seed`

---

## Risoluzione Problemi Comuni (Troubleshooting)

### Errore: `Port 5432 is already allocated`

- **Causa**: Un'altra istanza di PostgreSQL (es. servizio locale Windows o
  vecchio container) sta occupando la porta.
- **Soluzione**: Verificare i container attivi con `docker ps` o arrestare il
  servizio PostgreSQL locale nei servizi di sistema.

### Errore: `Authentication failed against database server at localhost`

- **Causa**: Le credenziali in `.env` differiscono da quelle con cui è stato
  inizializzato il volume Docker `pg_data_local`.
- **Soluzione**: Verificare utente e password nel file `.env` (devono
  corrispondere a `user:user` per il container locale). Se necessario, eliminare
  il volume orfano con `docker volume rm who-is-losing-today_pg_data_local` e
  riavviare.
