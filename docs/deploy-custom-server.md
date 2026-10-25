# Guida al Deployment sul proprio Server e Accesso con Tailscale

Questa guida spiega come installare e spostare l'applicazione **Who Is Losing
Today** sul tuo server casalingo/personale (accesso tramite SSH), e come
renderla accessibile in modo sicuro con **Tailscale** o tramite domini pubblici.

---

## 1. Spostamento del Codice dal PC Locale al Server (SSH)

Puoi trasferire il codice dal tuo computer di sviluppo al tuo server privato in
due modi principali:

### Metodo A: Repository Git (Consigliato)

Sul tuo PC locale fai il push delle modifiche sul repository GitHub/GitLab:

```bash
git add .
git commit -m "Pronto per il deploy"
git push origin main
```

Sul tuo server (collegato via SSH):

```bash
# Esegui il clone la prima volta
git clone https://github.com/tuo-username/who-is-losing-today.git
cd who-is-losing-today

# Per gli aggiornamenti futuri:
git pull origin main
```

### Metodo B: Trasferimento diretto con `rsync` / `scp` (Senza passare da Git)

Dal terminale del tuo PC locale, puoi copiare direttamente la cartella
escludendo `node_modules` e `.next`:

```bash
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' ./ utente@ip-server:/home/utente/who-is-losing-today/
```

---

## 2. Accesso tramite Tailscale (Private Mesh & Funnel)

Se gestisci il tuo server con **Tailscale**, hai due possibilità straordinarie
per accedere all'app:

### Opzione A: Accesso Privato (Solo dispositivi nella tua rete Tailscale)

Se tutti i membri del gruppo usano già Tailscale o sono collegati alla tua rete:

1. Trova l'IP Tailscale del tuo server o il nome MagicDNS (es.
   `http://100.x.y.z:3000` o `http://mio-server:3000`).
2. Configura le variabili d'ambiente nel file `.env` sul server:
   ```env

   ```

NEXTAUTH_URL="http://100.x.y.z:3000"

````
3. Su **Google Cloud Console**, aggiungi l'URI di reindirizzamento:
* **Authorized redirect URIs**: `http://100.x.y.z:3000/api/auth/callback/google`

### Opzione B: Accesso Pubblico da Qualsiasi Browser via **Tailscale Funnel**
Se vuoi che l'app sia raggiungibile in HTTPS da qualsiasi smartphone/PC senza che gli altri debbano installare Tailscale, usa **Tailscale Funnel**:
1. Esegui questo comando sul server:
```bash
tailscale funnel 3000
````

2. Tailscale genererà un dominio HTTPS pubblico gratuito, come
   `https://mio-server.tailscale.net`.
3. Imposta `.env` sul server:
   ```env

   ```

NEXTAUTH_URL="https://mio-server.tailscale.net"

````
4. Su **Google Cloud Console**, aggiungi l'URI di reindirizzamento:
* **Authorized redirect URIs**: `https://mio-server.tailscale.net/api/auth/callback/google`

---

## 3. Altro Metodo: Cloudflare Tunnel (100% Sicuro e Zero Porte sul Router)

In alternativa a Tailscale Funnel, puoi usare **Cloudflare Tunnels (Zero Trust)** per associare un tuo dominio personalizzato:

1. Installa `cloudflared` sul tuo server:
```bash
sudo apt-get install cloudflared
````

2. Autentica ed avvia il tunnel verso la porta 3000:
   ```bash

   ```

cloudflared tunnel login cloudflared tunnel create who-is-losing-today
cloudflared tunnel run --url http://localhost:3000 who-is-losing-today

````

---

## 4. Docker Compose sul proprio Server

Sul server, per far girare sia PostgreSQL che l'applicazione Next.js in sottofondo:

### **File `docker-compose.prod.yml`**:
```yaml
version: '3.8'

services:
database:
image: postgres:16-alpine
container_name: app_postgres
restart: always
environment:
POSTGRES_USER: postgres
POSTGRES_PASSWORD: password_super_segreta
POSTGRES_DB: who_is_losing_today
volumes:
- postgres_data:/var/lib/postgresql/data

app:
build: .
container_name: app_nextjs
restart: always
ports:
- "3000:3000"
environment:
DATABASE_URL: "postgresql://postgres:password_super_segreta@database:5432/who_is_losing_today?schema=public"
DIRECT_URL: "postgresql://postgres:password_super_segreta@database:5432/who_is_losing_today?schema=public"
NEXTAUTH_SECRET: "stringa_segreta_produzione_123"
NEXTAUTH_URL: "https://mio-server.tailscale.net"
GOOGLE_CLIENT_ID: "tuo_google_client_id"
GOOGLE_CLIENT_SECRET: "tuo_google_client_secret"
depends_on:
- database

volumes:
postgres_data:
````

### **Comandi di avvio e reset del DB sul server**:

```bash
# Avvia i container in background
docker compose -f docker-compose.prod.yml up -d --build

# Inizializza il database e crea i 3 giochi
docker compose exec app npx prisma db push
docker compose exec app npx prisma db seed
```

---

## 5. Checklist Credenziali Google Cloud Console

Quando sposti l'app in produzione (sia via Tailscale Funnel che dominio
personalizzato):

1. Vai su **Google Cloud Console** **APIs & Services** **Credentials**.
2. Modifica il tuo OAuth 2.0 Client ID.
3. In **Authorized JavaScript origins**: Aggiungi l'URL base (es.
   `https://mio-server.tailscale.net`).
4. In **Authorized redirect URIs**: Aggiungi l'URL di callback esatto (es.
   `https://mio-server.tailscale.net/api/auth/callback/google`).
