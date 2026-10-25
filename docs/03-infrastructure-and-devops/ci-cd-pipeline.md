# 03. DevOps — Pipeline CI/CD (GitHub Actions)

Questo documento descrive il funzionamento della pipeline di **Continuous Integration (CI)** configurata con GitHub Actions per garantire la stabilità del codice ed evitare fallimenti di build in produzione.

---

## 1. Obiettivi della Pipeline

La pipeline ([.github/workflows/ci.yml](file:///c:/Users/lucad/my-projects/who-is-losing-today/.github/workflows/ci.yml)) agisce come un cancello di controllo automatico prima che qualsiasi modifica venga integrata nel ramo `master`.

Ogni volta che viene eseguito un `push` o una `pull_request`, la CI verifica in un ambiente vergine Ubuntu:
1. **Integrità delle dipendenze**: Il lockfile `package-lock.json` è sincronizzato e non corrotto.
2. **Qualità del codice (Linting)**: Rispetto delle regole ESLint (assenza di `any` espliciti, variabili non utilizzate, etc.).
3. **Rigore dei tipi (Typecheck)**: Nessun errore di tipo TypeScript nell'intero codebase (`tsc --noEmit`).
4. **Compilazione di Produzione (Build)**: La compilazione `next build` genera con successo tutte le route e i bundle JavaScript.

---

## 2. Trigger e Concurrency Control

```yaml
on:
  push:
    branches:
      - master
      - 'feat/**'
      - 'fix/**'
  pull_request:
    branches:
      - master

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

* **Branch monitorati**: `master`, qualsiasi ramo di funzionalità (`feat/**`) o di correzione (`fix/**`).
* **`cancel-in-progress: true`**: Se uno sviluppatore invia più commit in rapida successione sullo stesso branch, GitHub Actions interrompe immediatamente i job precedenti ancora in esecuzione per risparmiare minuti di calcolo e concentrarsi solo sull'ultimo commit.

---

## 3. Anatomia degli Step del Workflow

Il workflow esegue un singolo job snello (`validate`) su `ubuntu-latest`:

### A. Setup e Caching
```yaml
- name: Setup Node.js 22 LTS
  uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: 'npm'
```
Configura il runtime Node.js 22 e sfrutta il meccanismo di cache nativo di GitHub Actions sulla cartella `~/.npm`. Questo riduce il tempo di download dei pacchetti da minuti a pochi secondi.

### B. `npm ci` (Clean Install)
```yaml
- name: Install Dependencies
  run: npm ci
```
> [!IMPORTANT]
> **Perché `npm ci` invece di `npm install`?**  
> `npm ci` richiede la presenza tassativa di `package-lock.json`, elimina la cartella `node_modules` preesistente e installa **esattamente** le versioni registrate nel lockfile senza mai alterarlo. In questo modo è impossibile che un aggiornamento imprevisto di una sotto-dipendenza rompa la build sul server.

### C. Generazione Tipi Prisma
```yaml
- name: Generate Prisma Client
  run: npx prisma generate
```
Prima di procedere al controllo dei tipi TypeScript, è necessario che i tipi di Prisma Client (`@prisma/client`) vengano generati a partire dal file `prisma/schema.prisma`.

### D. Controlli Separati di Qualità
Invece di un comando cumulativo opaco, la CI mantiene gli step distinti:
1. `run: npm run lint` $\rightarrow$ ESLint 9 analizza stile e best practices.
2. `run: npm run typecheck` $\rightarrow$ `tsc --noEmit` verifica i contratti statici.
3. `run: npm run build` $\rightarrow$ `next build` crea i chunk ottimizzati e convalida la raccolta dati delle route.

Se uno qualsiasi di questi passaggi fallisce, la pipeline si blocca e indica chiaramente riga e file colpevole.

---

## 4. Gestione delle Variabili d'Ambiente in CI

In un ambiente di CI puro non è presente un database PostgreSQL attivo. Tuttavia, Next.js a build-time richiede le variabili di ambiente per validare i moduli:

```yaml
env:
  DATABASE_URL: 'postgresql://ci_dummy_user:ci_dummy_pass@localhost:5432/ci_db?schema=public'
  NEXTAUTH_SECRET: 'ci_secret_only_for_build_validation_purposes_32chars'
  NEXTAUTH_URL: 'http://localhost:3000'
```
Queste variabili fittizie soddisfano i controlli statici di Next.js e Prisma senza esporre credenziali reali.

---

## 5. Replica del Controllo CI in Locale

Prima di effettuare un commit o un push, lo sviluppatore può replicare esattamente l'intera pipeline sul proprio computer con il comando:

```bash
npm run check:ci
```
Se questo comando restituisce codice di uscita `0`, la pipeline GitHub Actions sul server remoto passerà con esito verde garantito.
