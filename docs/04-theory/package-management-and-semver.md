# 04. Teoria — Gestione Pacchetti, SemVer e Sicurezza

Questo documento spiega le regole del **Semantic Versioning**, il ruolo fondamentale del lockfile, la differenza tra i comandi di installazione e la guida pratica per interpretare i report di `npm outdated` e `npm audit`.

---

## 1. Semantic Versioning (SemVer: `MAJOR.MINOR.PATCH`)

Tutte le librerie moderne JavaScript/TypeScript adottano lo standard SemVer:

$$\text{versione} = \text{MAJOR}.\text{MINOR}.\text{PATCH}$$
*(Esempio: `15.3.1`)*

1. **MAJOR (15)**: Modifiche incompatibili con il passato (**Breaking Changes**). Funzionalità rimosse o firme di funzioni riscritte. Richiede revisione del codice dell'applicazione prima di aggiornare.
2. **MINOR (3)**: Nuove funzionalità aggiunte **in modo retrocompatibile**. Il codice esistente continua a funzionare senza modifiche.
3. **PATCH (1)**: Solo correzioni di bug interni o patch di sicurezza retrocompatibili.

---

## 2. I Simboli di Vincolo in `package.json`

Quando una dipendenza è dichiarata in `package.json`:

| Sintassi | Nome Simbolo | Comportamento durante `npm update` / `install` | Esempio |
| :--- | :--- | :--- | :--- |
| **`^1.2.7`** | **Caret** (cappellino) | Accetta qualsiasi aggiornamento **MINOR o PATCH** (tutta la famiglia `1.x.x`), ma **blocca le MAJOR** (non installerà mai la `2.0.0`). È il default di npm. | Da `1.2.7` a `1.3.1` $\rightarrow$ Consentito ✅<br>Da `1.2.7` a `2.0.0` $\rightarrow$ Bloccato 🛑 |
| **`~1.2.7`** | **Tilde** | Accetta solo aggiornamenti **PATCH** (bugfix, fino a `1.2.9`). Blocca anche le MINOR. | Da `1.2.7` a `1.2.8` $\rightarrow$ Consentito ✅<br>Da `1.2.7` a `1.3.0` $\rightarrow$ Bloccato 🛑 |
| **`6.4.0`** | **Versione Fissa** | **Nessun aggiornamento automatico**. npm installerà tassativamente solo e soltanto la `6.4.0`. | Ideale per componenti critici come Prisma ORM. |

---

## 3. Il Ruolo Vitale di `package-lock.json`

Mentre `package.json` definisce solo i vincoli ammissibili delle tue librerie dirette, **`package-lock.json` memorizza l'albero esatto al bit di tutte le migliaia di sotto-dipendenze interne**, inclusi gli URL dei pacchetti e i loro hash crittografici (`integrity: sha512-...`).

> [!CAUTION]
> **Mai inserire `package-lock.json` nel `.gitignore`!**  
> Se il lockfile non viene tracciato in Git, ogni volta che la CI o un collega esegue `npm install`, npm ricalcolerà l'albero delle sotto-dipendenze scaricando le ultime versioni disponibili. Una sotto-dipendenza interna aggiornata con un bug potrebbe far fallire la compilazione remota anche se in locale funzionava tutto.

---

## 4. `npm install` vs `npm ci`

| Proprietà | `npm install` | `npm ci` (Clean Install) |
| :--- | :--- | :--- |
| **Dove si usa** | Sul computer dello sviluppatore durante l'aggiunta di nuovi pacchetti. | **In CI/CD (GitHub Actions) e nel Dockerfile di produzione.** |
| **Requisito lockfile** | Se `package-lock.json` manca, lo genera da zero. | **Se `package-lock.json` manca, si blocca immediatamente con errore.** |
| **Modifica file** | Può aggiornare il lockfile se trova versioni più recenti compatibili. | **Non modifica mai il lockfile.** Rifiuta qualsiasi installazione se il lockfile non corrisponde perfettamente a `package.json`. |
| **Cartella `node_modules`** | Aggiunge o sovrascrive file nella cartella esistente. | **Cancella interamente la cartella `node_modules` preesistente** e ne crea una vergine e pulita. |
| **Velocità** | Più lenta (deve risolvere dipendenze e vincoli). | **Fino a 3x più veloce** (salta la risoluzione dei vincoli e decomprime direttamente l'albero congelato). |

---

## 5. Come Leggere la Tabella di `npm outdated`

Eseguendo `npm outdated` nel terminale si ottiene:

```text
Package                    Current   Wanted   Latest
@radix-ui/react-accordion  1.2.20    1.3.1    1.3.1
react                      18.3.1    18.3.1   19.3.1
tailwindcss                3.4.19    3.4.19   4.3.3
```

- **`Current`**: La versione fisicamente presente sul disco nella cartella `node_modules`.
- **`Wanted`**: La versione massima compatibile con le regole del tuo `package.json` (rispettando il `^` o `~`).
- **`Latest`**: L'ultimissima versione rilasciata nel mondo su npm.

### Regola di Interpretazione:
1. **Se `Current` < `Wanted`**: Aggiornamento **sicuro e consigliato**. È una minor/patch che rientra nei tuoi vincoli. Puoi eseguire `npm update` in totale tranquillità.
2. **Se `Wanted` < `Latest`**: C'è una **Major version successiva** (es. React 19 o Tailwind 4). npm non la scarica per proteggerti da breaking changes. L'aggiornamento si pianifica solo studiando la documentazione ufficiale della nuova versione.

---

## 6. Sicurezza e Vulnerabilità con `npm audit`

`npm audit` scansiona l'albero delle dipendenze alla ricerca di vulnerabilità note (CVE).

### Vulnerabilità a Runtime vs Tooling di Build
* **A Runtime (Priorità Alta)**: Bug in librerie che gestiscono input degli utenti sul server web (es. NextAuth, parser API). Vanno risolti tempestivamente.
* **A Build-Time / Tooling (Basso Rischio Reale)**: Bug in strumenti di compilazione CSS (es. PostCSS) o linter. Si attivano solo se qualcuno dà in pasto file CSS alterati al compilatore, ma nel tuo progetto il CSS è scritto dal team, non da utenti anonimi sul web.

### ⚠️ Perché NON Usare MAI `npm audit fix --force`
- **`npm audit fix`**: Aggiorna le sotto-dipendenze nel `package-lock.json` restando fedele alle major version del tuo progetto. **È sicuro.**
- **`npm audit fix --force`**: Ignora i vincoli di versione del tuo `package.json` e forza l'installazione anche di major versions incompatibili (es. installerebbe a forza Tailwind 4 e Next 16, distruggendo la compatibilità grafica e le API del progetto solo per rimuovere un avviso).
