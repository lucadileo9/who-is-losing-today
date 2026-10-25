# 03. DevOps — Deploy con Docker e Cloudflare

Questo documento descrive l'architettura di produzione containerizzata, la build multi-stage del `Dockerfile`, la modalità standalone di Next.js e l'esposizione sicura tramite Cloudflare Tunnel.

---

## 1. Architettura di Produzione

In ambiente di produzione (su server Linux/Debian), l'infrastruttura è orchestrata tramite Docker Compose su una rete interna isolata (`storage_default`):

```text
[ Utente Web / Smartphone ]
              │ HTTPS (Porta 443)
              ▼
    [ Rete Cloudflare Edge ]
              │ Cloudflare Tunnel cifrato (Zero Open Ports)
              ▼
   ┌────────────────────────────────────────────────────────┐
   │ SERVER HOST (Docker Environment)                       │
   │                                                        │
   │  ┌──────────────────┐                                  │
   │  │   cloudflared    │ (Container Tunnel)               │
   │  └────────┬─────────┘                                  │
   │           │ HTTP (Rete storage_default interna)        │
   │           ▼                                            │
   │  ┌───────────────────────────┐                         │
   │  │  who-is-losing-today-web  │ (Next.js 15 Standalone) │
   │  └────────┬──────────────────┘                         │
   │           │ TCP 5432 (Rete storage_default interna)    │
   │           ▼                                            │
   │  ┌───────────────────────────┐                         │
   │  │   who-is-losing-today-db  │ (PostgreSQL 16 Alpine)  │
   │  └────────┬──────────────────┘                         │
   │           │ Volume Fisico Persistente                  │
   │           ▼                                            │
   │   /srv/storage/docker/who-is-losing-today/postgres     │
   └────────────────────────────────────────────────────────┘
```

---

## 2. Il Dockerfile Multi-Stage ([Dockerfile](file:///c:/Users/lucad/my-projects/who-is-losing-today/Dockerfile))

La compilazione dell'immagine usa la tecnica **Multi-Stage Build** per ridurre le dimensioni finali dell'immagine da oltre 1.2 GB a circa 150 MB:

### Stage 1: `base`
```dockerfile
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
```
Fornisce la base Alpine Linux con le librerie native C e OpenSSL richieste dal motore binario di Prisma.

### Stage 2: `deps`
```dockerfile
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci
```
Installa tutte le dipendenze (incluse quelle di sviluppo necessarie a compilare) in modo deterministico tramite `npm ci`. Viene copiato anche `prisma/` per generare gli agganci al database.

### Stage 3: `builder`
```dockerfile
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
```
Genera il client tipizzato Prisma ed esegue la compilazione Next.js di produzione.
Grazie all'opzione `output: 'standalone'` in `next.config.js`, Next.js traccia l'albero di import effettivo e produce una cartella `.next/standalone` contenente un mini-server Node.js con solo le dipendenze strettamente necessarie.

### Stage 4: `runner` (Immagine finale snella)
```dockerfile
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push && npx prisma db seed && node server.js"]
```
All'avvio del container:
1. `npx prisma db push`: Sincronizza istantaneamente le tabelle del database di produzione se ci sono nuove colonne.
2. `npx prisma db seed`: Garantisce che i giochi base e i ruoli siano presenti.
3. `node server.js`: Avvia il server HTTP ultra-veloce di Next.js.

---

## 3. Configurazione Docker Compose di Produzione ([docker-compose.yml](file:///c:/Users/lucad/my-projects/who-is-losing-today/docker-compose.yml))

### Servizio Database (`who-is-losing-today-db`)
- Immagine: `postgres:16-alpine`.
- **Persistenza**: Volume host montato su `/srv/storage/docker/who-is-losing-today/postgres`. Anche se il container viene distrutto o aggiornato, i punteggi rimangono intatti sul disco del server.

### Servizio Web (`who-is-losing-today-web`)
- Connessione DB:
  `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@who-is-losing-today-db:5432/${POSTGRES_DB}?schema=public`
- `AUTH_TRUST_HOST: 'true'`: Istruisce NextAuth a fidarsi dei forward proxy e degli header inoltrati da Cloudflare Tunnel.

### Servizio Cloudflare Tunnel (`cloudflared`)
- Immagine: `cloudflare/cloudflared:latest`.
- Non richiede l'apertura di alcuna porta sul router (nessun port forwarding né IP statico pubblico necessario).
- Stabilisce una connessione in uscita cifrata verso i server Cloudflare usando il `TUNNEL_TOKEN`.

---

## 4. Guida al Deploy e Aggiornamento sul Server

Per rilasciare una nuova versione sul server:

```bash
# 1. Scaricare il codice aggiornato
git pull origin master

# 2. Ricostruire l'immagine ed eseguire il restart dei container con zero downtime prolungato
docker compose up -d --build

# 3. Verificare i log di avvio
docker compose logs -f who-is-losing-today-web
```
Se il log mostra:
`✓ Ready in ...ms` e `✓ Compiled successfully`, l'applicazione è online e pronta.
