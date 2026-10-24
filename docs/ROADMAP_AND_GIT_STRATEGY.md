# 🗺️ Roadmap Esecutiva & Strategia Git: Refactoring "Who Is Losing Today?"

Documento operativo per la pianificazione delle attività, gestione dei branch GitHub, convenzioni di commit atomici e criteri di collaudo (Definition of Done).

---

## 🌳 Strategia Git & Branching Model

Per garantire la massima pulizia, isolamento delle modifiche e rollback sicuro in caso di problemi:
* Il branch `master` rimane sempre stabile e funzionante.
* Ogni blocco di lavoro viene sviluppato su un **feature branch dedicato**.
* I commit seguono la convenzione standard **Conventional Commits** (`feat(...)`, `fix(...)`, `refactor(...)`, `chore(...)`).
* Nessun branch viene mergiato senza prima aver superato il typecheck completo (`npx tsc --noEmit`).

```mermaid
gitGraph
   commit id: "baseline"
   branch feat/backend-dal
   checkout feat/backend-dal
   commit id: "feat(db): schema & migrations"
   commit id: "feat(types): DTO contracts"
   commit id: "feat(dal): data access layer"
   commit id: "feat(actions): server actions & zod"
   commit id: "feat(auth): whitelist & middleware"
   checkout master
   merge feat/backend-dal
   branch feat/ui-design-system
   checkout feat/ui-design-system
   commit id: "feat(theme): centralized colors"
   commit id: "feat(atoms): player avatar & badges"
   commit id: "feat(molecules): standings row & tabs"
   commit id: "feat(navbar): mobile responsive header"
   checkout master
   merge feat/ui-design-system
   branch feat/pages-assembly
   checkout feat/pages-assembly
   commit id: "feat(dashboard): assemble new dashboard"
   commit id: "feat(submit): dedicated score page"
   commit id: "feat(bacheca): dedicated chalkboard"
   commit id: "feat(profile): dynamic gamer card"
   checkout master
   merge feat/pages-assembly
   branch feat/cleanup-and-qa
   checkout feat/cleanup-and-qa
   commit id: "chore(api): remove deprecated routes"
   commit id: "test(mobile): viewport validation"
   checkout master
   merge feat/cleanup-and-qa
```

---

## 📋 I 4 Blocchi di Lavoro (Work Packages)

---

### BLOCCO 1 · Backend Core, Database & Server Actions
* **Branch Git**: `feat/backend-data-layer`
* **Cartelle e File Coinvolti**:
  * `prisma/schema.prisma`
  * `lib/types/` (`user.ts`, `daily.ts`, `period.ts`, `notes.ts`)
  * `lib/data/` (`daily.ts`, `period.ts`, `user.ts`, `hall-of-fame.ts`, `notes.ts`)
  * `app/actions/` (`scores.ts`, `notes.ts`, `user.ts`, `admin.ts`)
  * `lib/auth.ts`, `middleware.ts`

#### Checklist Attività & Commit Atomici:
1. [x] **`feat(db): update schema with @db.Date, whitelist, game colors and enums`**
   * Aggiunta tabella `Whitelist`, enum `Role`, `ScoreUnit`, `BugCategory`, `BugPriority`, `BugStatus`.
   * Conversione `scoreDate` a `@db.Date`.
   * Aggiunta `color` nel modello `Game`.
   * Indici composti su `DailyScore` e `DailyNote`.
2. [x] **`feat(types): implement all DTO interfaces and contracts`**
   * Creazione di `UserSummaryDTO`, `DailyResultsDTO`, `PeriodResultsDTO`, `HallOfFameDTO`, `UserProfileDTO`, `DailyNoteDTO`.
3. [x] **`feat(dal): implement Data Access Layer functions`**
   * Implementazione di `getDailyResults()`, `getPeriodResults()`, `getHallOfFame()`, `getUserProfile()`, `getActiveNotes()`.
   * Calcolo della formula totale (sempre divisa per 3 con penalizzazione per giochi saltati).
   * Calcolo vincitore e perdente (con regola: perdente `null` se $<2$ partecipanti).
4. [x] **`feat(actions): implement Server Actions with Zod schemas`**
   * `submitScoreAction`, `createNoteAction`, `deleteNoteAction`, `updateUserColorAction`.
   * Controllo sessione lato server con `getServerSession`.
5. [x] **`feat(auth): add whitelist verification in signIn callback and edge middleware`**
   * Blocco login per email non in whitelist e redirect a `/auth/unauthorized`.
   * Protezione delle rotte tramite `middleware.ts`.

* **Definition of Done (DoD)**: `npx tsc --noEmit` compila a 0 errori. Tutti i DTO e le funzioni DAL sono esportati e testabili.

---

### BLOCCO 2 · Design System, Atomi & Molecole UI
* **Branch Git**: `feat/ui-design-system`
* **Cartelle e File Coinvolti**:
  * `lib/theme/colors.ts`
  * `tailwind.config.js`
  * `app/globals.css`
  * `components/atoms/`
  * `components/molecules/`
  * `components/organisms/Navbar.tsx`

#### Checklist Attività & Commit Atomici:
1. [ ] **`feat(theme): centralize brand colors in colors.ts and tailwind config`**
   * Creazione di `lib/theme/colors.ts` con i token ufficiali: perdente (`#ef4444`), vincente (`#f59e0b`), Krilion (`#10b981`), Metazooa (`#f97316`), Chronophoto (`#8b5cf6`), Totale (`#3b82f6`).
   * Configurazione classi semantiche e ombre neon in `tailwind.config.js`.
   * Aggiunta utility glassmorphism `.glass-card` in `globals.css`.
2. [ ] **`feat(atoms): create PlayerAvatar, GameBadge, RankBadge, NeonCard, NeonButton`**
   * Componente unificato `PlayerAvatar` (foto Google, iniziali fallback e anello neon con il colore del giocatore).
   * Badge colorati per i singoli giochi.
   * Wrapper `NeonCard` con varianti `default`, `loser`, `winner`.
3. [ ] **`feat(molecules): create DateNavigator, GameTabs, PeriodFilter, StandingsRow`**
   * `DateNavigator` compatto: `[ < ] [ Data ] [ > ] [ Oggi ]`.
   * `GameTabs` scorrevole con indicatori cromatici.
   * Componente universale `StandingsRow` per renderizzare qualsiasi riga di classifica (giornaliera e storica).
   * Card `HallOfFameCard` per i record di sempre e `ColorPicker` per la selezione colore.
4. [ ] **`feat(navbar): redesign mobile-friendly navbar with user dropdown`**
   * Risoluzione del bug visibile da smartphone: logo compatto a sinistra, tasto "+ Partita", e singolo avatar a destra con menu a comparsa (Profilo, Tema, Logout).

* **Definition of Done (DoD)**: I componenti atomici e molecolari sono indipendenti, riutilizzabili e non hanno errori di compilazione.

---

### BLOCCO 3 · Assemblaggio Pagine & Routing (App Assembly)
* **Branch Git**: `feat/pages-assembly`
* **Cartelle e File Coinvolti**:
  * `app/dashboard/`
  * `app/submit/`
  * `app/bacheca/`
  * `app/profile/`
  * `app/admin/`

#### Checklist Attività & Commit Atomici:
1. [ ] **`feat(dashboard): assemble new dashboard layout with hero, standings and trends`**
   * Trasformazione di `app/dashboard/page.tsx` in Server Component che riceve `DailyResultsDTO`, `PeriodResultsDTO`, `HallOfFameDTO`.
   * Layout: DateNavigator in alto, card Perdente a SX (Rosso) e Vincente a DX (Oro), Classifica della giornata, Hall of Fame a 4 card, Sezione Storica con TrendChart.
2. [ ] **`feat(submit): create dedicated score submission page`**
   * Creazione della rotta `/submit` per la registrazione delle partite senza distrazioni, collegata a `submitScoreAction`.
3. [ ] **`feat(bacheca): create dedicated 7-day chalkboard message feed`**
   * Creazione della rotta `/bacheca` ("Taverna Neon") per gli sfottò e i messaggi del gruppo, con eliminazione note per l'autore.
4. [ ] **`feat(profile): create dynamic gamer card profile with trophies and multi-line chart`**
   * Creazione di `/profile/[userId]`: card con trofei (cucchiai di legno vs vittorie), streak reale, statistiche giochi e grafico a linee colorate.
   * Color-picker attivo solo sul proprio profilo.
5. [ ] **`feat(admin): build whitelist and bug report management screens`**
   * Rotta protetta `/admin` per invitare/revocare email e visualizzare i feedback.

* **Definition of Done (DoD)**: Tutte le pagine sono navigabili e interattive sia da desktop che da smartphone.

---

### BLOCCO 4 · Cleanup, Deprecazioni & Collaudo Finale
* **Branch Git**: `feat/cleanup-and-qa`

#### Checklist Attività & Commit Atomici:
1. [ ] **`chore(api): remove deprecated legacy API routes`**
   * Rimozione delle vecchie route `/api/scores`, `/api/summary`, ecc., ora sostituite dal Data Layer e dalle Server Actions.
2. [ ] **`test(mobile): verify responsive design and touch targets`**
   * Verifica su viewport mobile (390px / 414px) per garantire zero overflow orizzontale.
3. [ ] **`build: verify clean production build`**
   * Esecuzione di `npm run build` con 0 errori TypeScript o di linting.

---

## 📌 Guida ai Comandi Git per ogni Blocco

```bash
# 1. Avviare un nuovo blocco di lavoro
git checkout master
git pull origin master
git checkout -b feat/nome-blocco

# 2. Lavorare e creare commit atomici
git add <file-modificati>
git commit -m "feat(scope): descrizione chiara e concisa"

# 3. Verificare che compili sempre
npx tsc --noEmit

# 4. Al termine del blocco, merge su master
git checkout master
git merge feat/nome-blocco
git push origin master
```
