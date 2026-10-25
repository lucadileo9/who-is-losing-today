# DevOps — Script e Tooling di Sviluppo

Questo documento illustra tutti gli script npm configurati in
[package.json](file:///c:/Users/lucad/my-projects/who-is-losing-today/package.json),
i tool di qualità del codice e le convenzioni per i commit e il branching Git.

---

## Mappa Completa degli Script npm

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "new-component": "plop component",
  "new-route": "plop route",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "db:reset": "prisma db push --force-reset && prisma db seed",
  "validate": "npm run format && npm run lint && npm run typecheck",
  "check:ci": "npm run lint && npm run typecheck && npm run build"
}
```

---

## Dettaglio dei Comandi

### Esecuzione e Compilazione

- **`npm run dev`**: Avvia l'ambiente di sviluppo locale su
  `http://localhost:3000` con Hot Module Reloading (HMR).
- **`npm run build`**: Esegue la compilazione di produzione (`next build`),
  generando i file compressi e verificando le pagine statiche.
- **`npm run start`**: Avvia l'applicazione precedentemente compilata con
  `npm run build` (simulando l'ambiente di produzione).

---

### Controllo Qualità e Formattazione

- **`npm run format`**: Riformatta l'intero codebase (TypeScript, CSS, JSON,
  Markdown) secondo le regole definite nel file
  [.prettierrc](file:///c:/Users/lucad/my-projects/who-is-losing-today/.prettierrc).
- **`npm run format:check`**: Verifica che tutti i file siano correttamente
  formattati senza applicare modifiche (utile in CI).
- **`npm run lint`**: Esegue il linter ESLint 9 con configurazione Flat Config
  ([eslint.config.mjs](file:///c:/Users/lucad/my-projects/who-is-losing-today/eslint.config.mjs)).
- **`npm run typecheck`**: Lancia il compilatore TypeScript (`tsc --noEmit`) su
  tutto il progetto. Non genera file JavaScript ma intercetta errori di typing,
  proprietà mancanti o incompatibilità di interfacce.

---

### Workflow di Controllo Rapido

| Comando                | Quando usarlo                   | Cosa fa                                                                                                                                                                    |
| :--------------------- | :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`npm run validate`** | **Prima di ogni commit locale** | Esegue in sequenza `format` $\rightarrow$ `lint` $\rightarrow$ `typecheck`. Riformatta il codice e controlla che non ci siano errori di stile o di tipo.                   |
| **`npm run check:ci`** | **Prima di fare un `git push`** | Esegue esattamente gli stessi controlli della pipeline remota GitHub Actions (`lint` $\rightarrow$ `typecheck` $\rightarrow$ `build`). Se passa, la CI sarà verde al 100%. |

---

### Gestione Database

- **`npm run db:reset`**: Esegue il reset distruttivo del database locale
  (`prisma db push --force-reset`), ricrea le tabelle secondo `schema.prisma` e
  lancia il seed automatico
  ([prisma/seed.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/prisma/seed.ts))
  ripopolando i giocatori e i punteggi dimostrativi.

---

### Scaffolding Automatico (Plop.js)

- **`npm run new-component`**: Generatore interattivo da terminale per creare un
  nuovo componente React rispettando la gerarchia Atomic Design (`atoms`,
  `molecules`, `organisms`).
- **`npm run new-route`**: Generatore per creare una nuova pagina o Route
  Handler nel Next.js App Router.

---

## Convenzioni Git del Progetto

1. **Strategia dei Branch**:
   - `master`: Ramo protetto e sempre stabile. I merge avvengono solo tramite
     Pull Request con CI approvata.
   - `feat/*`: Nuove funzionalità (es. `feat/backend-data-layer`,
     `feat/frontend-ui`).
   - `docs/*`: Documentazione e guide tecniche (es.
     `docs/backend-and-architecture`).
   - `fix/*`: Risoluzione di bug specifici.
2. **Messaggi di Commit Convenzionali (Conventional Commits)**:
   - `feat(ambito): descrizione` $\rightarrow$ Nuova funzionalità.
   - `fix(ambito): descrizione` $\rightarrow$ Correzione bug.
   - `docs(ambito): descrizione` $\rightarrow$ Documentazione.
   - `refactor(ambito): descrizione` $\rightarrow$ Ristrutturazione codice senza
     modifiche funzionali.
   - `chore(ambito): descrizione` $\rightarrow$ Manutenzione configurazioni,
     dipendenze o script.
3. **Controllo dei Push**:
   - I commit sono sempre registrati a livello locale per permettere revisioni
     atomiche. I comandi `git push` sono affidati al responsabile del
     repository.
