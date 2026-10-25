# Guida alla Configurazione di Google OAuth (Accedi con Google)

Questa guida spiega passo-passo come ottenere le chiavi **`GOOGLE_CLIENT_ID`** e
**`GOOGLE_CLIENT_SECRET`** dalla Google Cloud Console per abilitare il pulsante
"Accedi con Google" nell'applicazione **Who Is Losing Today**.

> **Nota**: Questa procedura va eseguita **una sola volta** dallo sviluppatore
> dell'app. Gli utenti finali ed i tuoi amici dovranno semplicemente fare un
> click su "Accedi con Google" dal browser!

---

## Step 1: Accedi a Google Cloud Console

1. Vai su **[console.cloud.google.com](https://console.cloud.google.com/)**.
2. Fai il login con un qualsiasi tuo account Google / Gmail.

---

## Step 2: Crea un nuovo Progetto

1. In alto a sinistra (accanto al logo Google Cloud), clicca sul menu a discesa
   dei progetti.
2. Clicca su **"Nuovo progetto"** (_New Project_).
3. Inserisci il nome del progetto: **`Who Is Losing Today`**.
4. Lascia l'organizzazione predefinita e clicca su **Crea**.
5. Assicurati che il nuovo progetto sia quello selezionato in alto nel menu a
   discesa.

---

## Step 3: Configura la schermata di consenso OAuth (OAuth Consent Screen)

1. Nel menu di navigazione a sinistra, vai su **APIs & Services** **OAuth
   consent screen** (Schermata di consenso OAuth).
2. Seleziona **External** (Esterno) come tipo di utente e clicca su **Crea**.
3. Compila le informazioni di base dell'applicazione:

- **App name**: `Who Is Losing Today`
- **User support email**: la tua email Gmail
- **Developer contact information**: la tua email Gmail

4. Clicca su **Save and Continue** (Salva e continua).
5. Nella sezione **Scopes** (Ambito), clicca su **Save and Continue** (i
   permessi base `email`, `profile`, `openid` sono già inclusi di default).
6. Nella sezione **Test users** (Utenti di test), aggiungi la tua email e le
   email dei tuoi amici che vorranno provarla in fase di test.
7. Clicca su **Save and Continue** **Back to Dashboard**.

---

## Step 4: Genera il Client ID e Client Secret

1. Nel menu a sinistra, vai su **Credentials** (Credenziali).
2. In alto, clicca su **+ Create Credentials** (+ Crea credenziali) e seleziona
   **OAuth client ID**.
3. Compila i campi:

- **Application type**: seleziona **Web application** (Applicazione web).
- **Name**: `Who Is Losing Today Web Client`
- **Authorized JavaScript origins** (Origini JavaScript autorizzate):
- Aggiungi la riga: `http://localhost:3000`
- **Authorized redirect URIs** (URI di reindirizzamento autorizzati):
- Aggiungi la riga: `http://localhost:3000/api/auth/callback/google`

4. Clicca su **Create** (Crea).

---

## Step 5: Inserisci le chiavi nel file `.env.local`

Si aprirà un popup con le tue due chiavi segrete. Copiale ed incollale nel file
`.env.local` nella radice del tuo progetto:

```env
# NextAuth Session Secret (Generabile con qualsiasi stringa casuale)
NEXTAUTH_SECRET="la_tua_stringa_segreta_generata_casualmente"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="il_tuo_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-il_tuo_client_secret"
```

**Fatto!** Ora qualsiasi utente potrà fare il login con Google sulla tua
applicazione in locale ed in produzione.
