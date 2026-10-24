# 🎨 UI & Frontend Architecture Blueprint: "Who Is Losing Today?"

Documento di specifica per il redesign completo e la re-ingegnerizzazione del frontend.
Definisce la filosofia visiva, la nuova mappa delle rotte, la gerarchia Atomic Design (DRY), il Design System tokenizzato e l'integrazione con i DTO tramite Server Components.

---

## 1. Filosofia di Design & Soluzione alle Criticità Attuali

### Mood & Identità Visiva
L'applicazione mantiene l'atmosfera amata dal gruppo: **Dark Synthwave / Cyberpunk Gaming**, con sfondo scuro profondo, vetro traslucido (*glassmorphism*), bagliori neon (*glow*) e un tono giocoso e irriverente (*"Who Is Losing Today?"*).

### Errori Critici della Vecchia Versione (Risolti dal Redesign)
1. **Navbar Mobile Rotta**: Nella versione attuale il logo e il titolo *"SEI UNA MERDA Who Is Losing"* si spezzano accavallandosi al badge *"Today?"*, mentre avatar, profilo, switch tema e logout sono compressi in uno spazio minuscolo.
   * **Soluzione**: Navbar mobile ultra-compatta (50px). A sinistra solo icona gamberetto + logo compatto; a destra un **singolo pulsante avatar con anello neon** che apre un dropdown con Profilo, Tema e Logout.
2. **"Above the Fold" Sprecato**: Su mobile, i primi 300px mostrano *"Giocatori registrati"* e *"Streak di gruppo"*, costringendo l'utente a scrollare per scoprire chi ha perso.
   * **Soluzione**: Eliminate le card inutili. La prima cosa visibile senza scrollare è: **Il Perdente di Oggi (Rosso 🥄) affiancato al Vincente (Oro 🥇)**.
3. **Affollamento della Dashboard**: La vecchia dashboard conteneva forzatamente il form di inserimento punteggi e la bacheca in riquadri minuscoli.
   * **Soluzione**: Spostamento di **Registrazione Partita** su una pagina/modal dedicato (`/submit`) e della **Bacheca Messaggi** su una pagina dedicata (`/bacheca`).

---

## 2. Nuova Mappa delle Pagine e Flusso Dati con DTO

### Come i Server Components usano i DTO
Nel Server Component `app/dashboard/page.tsx`, la chiamata alla funzione del Data Layer **restituisce direttamente il DTO fortemente tipizzato**:

```typescript
// app/dashboard/page.tsx (SERVER COMPONENT - ZERO JAVASCRIPT SCARICATO DAL BROWSER)
import { getDailyResults } from "@/lib/data/daily"
import { getPeriodResults } from "@/lib/data/period"
import { getHallOfFame } from "@/lib/data/hall-of-fame"
import type { DailyResultsDTO } from "@/lib/types/daily"
import type { PeriodResultsDTO, HallOfFameDTO } from "@/lib/types/period"
import { DashboardView } from "@/components/organisms/DashboardView"

interface PageProps {
  searchParams: Promise<{ date?: string; period?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { date, period } = await searchParams
  const selectedDate = date || new Date().toISOString().split("T")[0]
  const selectedPeriod = period || "month"

  // 1. Chiamate dirette al Data Layer: restituiscono i DTO tipizzati
  const dailyDTO: DailyResultsDTO = await getDailyResults(selectedDate)
  const periodDTO: PeriodResultsDTO = await getPeriodResults(selectedPeriod)
  const hallOfFameDTO: HallOfFameDTO = await getHallOfFame()

  // 2. I DTO vengono passati direttamente ai componenti React
  return (
    <DashboardView 
      daily={dailyDTO} 
      period={periodDTO} 
      hallOfFame={hallOfFameDTO} 
    />
  )
}
```

### Tabella delle Rotte della Piattaforma

| Rotta | Tipo Componente | DTO Utilizzati | Scopo Principale |
|---|---|---|---|
| **`/dashboard`** | Server Component | `DailyResultsDTO`<br>`PeriodResultsDTO`<br>`HallOfFameDTO` | Schermata centrale: Data navigator, Perdente (SX) & Vincente (DX), Classifica del giorno, Hall of Fame e Sezione Storica. |
| **`/submit`** | Client Component + Action | — *(Usa Server Action `submitScoreAction`)* | Inserimento punteggio senza distrazioni (selettore gioco, incolla testo, feedback immediato). |
| **`/bacheca`** | Server Component + Action | `DailyNoteDTO[]` | La "Taverna Neon": chat e bacheca messaggi a 7 giorni, comoda da leggere su mobile. |
| **`/profile`** | Server Component | — | Reindirizza automaticamente a `/profile/[mioUserId]`. |
| **`/profile/[userId]`** | Server Component | `UserProfileDTO` | La "Gamer Card": avatar neon, trofei (cucchiai/vittorie), performance per gioco, grafico multi-linea e color-picker. |
| **`/admin`** | Server Component | `WhitelistDTO[]`<br>`BugReportDTO[]` | Gestione Whitelist e segnalazioni bug (riservata ad `ADMIN`). |

---

## 3. Design System & Token Visivi (Tailwind CSS)

### 1. Palette Colori Ufficiale

* **Superficie Base (Sfondo)**: `#0a0b14` (Deep Space Navy, scuro profondo).
* **Superficie Card (Glass)**: `#121526` con `border: 1px solid rgba(255, 255, 255, 0.08)`.
* **Accento Perdente (Vergogna / 🥄)**: `#ef4444` (Neon Crimson / Rosso lava).
* **Accento Vincente (Gloria / 🥇)**: `#f59e0b` (Cyber Gold / Oro ambra).
* **Colori Iconici dei Giochi**:
  * 🟢 **Krilion**: `#10b981` (Verde Smeraldo Neon)
  * 🟠 **Metazooa**: `#f97316` (Arancione Safari)
  * 🟣 **Chronophoto**: `#8b5cf6` (Viola Synthwave)
  * 🔵 **Totale**: `#3b82f6` (Blu Zaffiro)

### 2. Centralizzazione Colori: `lib/theme/colors.ts` & `tailwind.config.js`
Per garantire che **tutti i colori siano definiti in un solo punto** (Single Source of Truth), creiamo `lib/theme/colors.ts` che viene importato sia da `tailwind.config.js` sia dai componenti React (per grafici SVG Recharts):

```typescript
// lib/theme/colors.ts
export const BRAND_COLORS = {
  loser: "#ef4444",       // Neon Crimson
  winner: "#f59e0b",      // Cyber Gold
  krilion: "#10b981",     // Smeraldo Neon
  metazooa: "#f97316",    // Arancione Safari
  chronophoto: "#8b5cf6", // Viola Synthwave
  totale: "#3b82f6",      // Blu Zaffiro
  space: "#0a0b14",       // Sfondo deep space
  surface: "#121526",     // Superficie glass card
} as const
```

In `tailwind.config.js`:
```javascript
const { BRAND_COLORS } = require('./lib/theme/colors') // oppure definito direttamente qui

module.exports = {
  theme: {
    extend: {
      colors: {
        loser: BRAND_COLORS.loser,
        winner: BRAND_COLORS.winner,
        game: {
          krilion: BRAND_COLORS.krilion,
          metazooa: BRAND_COLORS.metazooa,
          chronophoto: BRAND_COLORS.chronophoto,
          totale: BRAND_COLORS.totale,
        },
        surface: BRAND_COLORS.surface,
        space: BRAND_COLORS.space,
      },
      boxShadow: {
        'glow-loser': '0 0 20px rgba(239, 68, 68, 0.35)',
        'glow-winner': '0 0 20px rgba(245, 158, 11, 0.35)',
        'glow-krilion': '0 0 15px rgba(16, 185, 129, 0.3)',
        'glow-metazooa': '0 0 15px rgba(249, 115, 22, 0.3)',
        'glow-chronophoto': '0 0 15px rgba(139, 92, 246, 0.3)',
      }
    }
  }
}
```

#### Vantaggi immediati:
1. **Classi Tailwind semantiche**: `border-loser`, `bg-loser/10`, `text-game-krilion`, `shadow-glow-loser`.
2. **Recharts & Canvas**: `import { BRAND_COLORS } from "@/lib/theme/colors"` e `<Line stroke={BRAND_COLORS.krilion} />`.
3. **Modifica a costo zero**: Modifichi il valore in un solo punto e si aggiorna ovunque.

### 3. Classi Utility Glassmorphism (in `globals.css`)
```css
/* Card in vetro scuro con backdrop blur */
.glass-card {
  background: rgba(18, 21, 38, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
}
```

---

## 4. Architettura dei Componenti: Atomic Design Rigoroso (DRY)

```
components/
  ├── atoms/                    <-- Zero logica, solo stile puro e token
  │     ├── PlayerAvatar.tsx    <-- UNICO punto dove vive l'avatar con anello neon
  │     ├── GameBadge.tsx       <-- Badge con i colori iconici dei 4 giochi
  │     ├── RankBadge.tsx       <-- Medaglie 🥇 🥈 🥉 e Cucchiaio 🥄
  │     ├── NeonCard.tsx        <-- Wrapper card con varianti semantiche
  │     └── NeonButton.tsx      <-- Pulsanti interattivi con hover glow
  │
  ├── molecules/                <-- Componenti funzionali compatti
  │     ├── DateNavigator.tsx   <-- Barra data: [ < ] [ Data ] [ > ] [ Oggi ]
  │     ├── GameTabs.tsx        <-- Linguette per i 4 giochi con colori iconici
  │     ├── PeriodFilter.tsx    <-- Tasti: [ Settimana | Mese | Mese Scorso | Tutto ]
  │     ├── StandingsRow.tsx    <-- RIGA UNIVERSALE della classifica (giorno E periodo!)
  │     ├── HallOfFameCard.tsx  <-- Singola card record di sempre
  │     └── ColorPicker.tsx     <-- Griglia a 8 colori neon per il profilo
  │
  ├── organisms/                <-- Sezioni composite della pagina
  │     ├── Navbar.tsx          <-- Header ultra-compatto: Logo + Tasto "+ Partita" + Avatar Dropdown
  │     ├── DailyHero.tsx       <-- Il blocco a 2 colonne: Perdente (SX) e Vincente (DX)
  │     ├── DailyTable.tsx      <-- Classifica completa della giornata
  │     ├── HallOfFameGrid.tsx  <-- Griglia a 4 card dei record storici
  │     ├── PeriodSection.tsx   <-- Tabella periodo + Grafico Recharts
  │     ├── ChalkboardFeed.tsx  <-- Lista messaggi bacheca + box scrittura
  │     └── ScoreSubmitForm.tsx <-- Form inserimento punteggio
  │
  └── templates/
        └── AppShell.tsx        <-- Layout unificato (Navbar + Main + Footer)
```

---

## 5. Dettaglio dei Componenti e Layout delle Pagine

### 🏠 A. Layout della Dashboard (`/dashboard`)

```
┌────────────────────────────────────────────────────────────────────────┐
│  BARRA DATA:  [ < ]    VEN 24 OTTOBRE 2026    [ > ]    [ OGGI ]        │
│  TAB GIOCO:   [ Totale ]  [ Krilion ]  [ Metazooa ]  [ Chronophoto ]   │
└────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────┬────────────────────────────────────┐
│ 🥄 IL PERDENTE DI OGGI (Rosso)    │ 🥇 IL MIGLIORE DI OGGI (Oro)       │
│                                   │                                    │
│  (🔴 Avatar) Luca Di Leo          │  (🟡 Avatar) Antonio Melchionda    │
│  464 pt complessivi               │  609 pt complessivi                │
│  "Cucchiaio di legno assicurato!" │  "Campione indiscusso del giorno!" │
└───────────────────────────────────┴────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ 📊 CLASSIFICA DELLA GIORNATA (Tutti i partecipanti di oggi)            │
├────────────────────────────────────────────────────────────────────────┤
│ #1 🥇  (🟡) Antonio Melchionda    KR: 3200  MZ: 4  CH: 4100  │  609 pt │
│ #2 🥈  (🔵) Marco Rossi           KR: 2800  MZ: 5  CH: 3900  │  540 pt │
│ #3 🥄  (🔴) Luca Di Leo           KR: 2100  MZ: 8  CH: 3100  │  464 pt │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ 👑 HALL OF FAME — RECORD ASSOLUTI DI SEMPRE                            │
├──────────────────┬──────────────────┬──────────────────┬───────────────┤
│ 🟢 Krilion       │ 🟠 Metazooa      │ 🟣 Chronophoto   │ 🔵 Totale     │
│ 4.850 pt (Luca)  │ 2 tent. (Marco)  │ 4.920 pt (Andrea)│ 96.0 pt (Luca)│
└──────────────────┴──────────────────┴──────────────────┴───────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ 📈 SEZIONE STORICA & ANDAMENTO                                         │
│ Filtri: [ Questa Settimana | Questo Mese | Mese Scorso | All-Time ]    │
│ Tab:    [ Totale | Krilion | Metazooa | Chronophoto ]                  │
│                                                                        │
│ [ Tabella Classifica di Periodo ]    │   [ Grafico Recharts a Linee ]  │
└──────────────────────────────────────┴─────────────────────────────────┘
```

* **Desktop**: Le card del Perdente e del Vincente sono affiancate 50/50.
* **Mobile**: Si impilano verticalmente (Perdente in cima per l'impatto visivo).

---

### 👤 B. Layout della Pagina Profilo (`/profile/[userId]`)

Concepita come una **"Gamer Card"** cyberpunk con statistiche identitarie:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 🎮 GAMER CARD                                                          │
│                                                                        │
│   (Avatar con Cerchio Neon)   Luca Di Leo                              │
│                               luca@gmail.com  •  Ruolo: GIOCATORE      │
│                                                                        │
│   Scegli il tuo colore neon:  [🔵] [🟣] [🟢] [🟠] [🔴] [🟡] [🌸] [⚪]   │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ 🏆 TROFEI & STATISTICHE CHIAVE                                         │
├────────────────────┬────────────────────┬──────────────┬───────────────┤
│ 🎮 Partite Totali  │ 🥄 Cucchiai Subiti │ 🥇 Vittorie  │ 🔥 Streak     │
│ 142 giocate        │ 18 volte ultimo    │ 34 volte 1°  │ 12 giorni     │
└────────────────────┴────────────────────┴──────────────┴───────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ 🎯 PRESTAZIONI PER SINGOLO GIOCO                                       │
├──────────────────────┬──────────────────────┬──────────────────────────┤
│ 🟢 KRILION           │ 🟠 METAZOOA          │ 🟣 CHRONOPHOTO           │
│ Partite: 48          │ Partite: 46          │ Partite: 48              │
│ Media: 3.420 pt      │ Media: 5.2 tentativi │ Media: 3.890 pt          │
│ Record: 4.850 pt 👑  │ Record: 3 tentativi  │ Record: 4.600 pt         │
└──────────────────────┴──────────────────────┴──────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ 📈 ANDAMENTO PERSONALE NEL TEMPO                                       │
│ Grafico a linee con i 4 colori dei giochi:                             │
│ 🟢 Krilion  |  🟠 Metazooa  |  🟣 Chronophoto  |  🔵 Totale             │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 🎮 C. Pagina Registra Partita (`/submit`)

Pagina focalizzata ed essenziale per registrare i punteggi quotidiani:
1. **Selettore Gioco a 3 pulsanti giganti** con i colori ufficiali (Krilion verde, Metazooa arancione, Chronophoto viola).
2. **Textarea intelligente**: incollare il testo condiviso dal gioco compila automaticamente il punteggio grezzo.
3. **Pulsante d'invio al neon**: invia tramite `submitScoreAction` con stato di caricamento e reindirizza alla dashboard o mostra la spunta di successo.

---

### 💬 D. Pagina Bacheca Messaggi (`/bacheca`)

La "Taverna Neon" per gli sfottò e le comunicazioni del gruppo:
* Feed verticale di messaggi ordinati per data/ora decrescente.
* Ogni messaggio ha una barra laterale con il colore personale dell'autore.
* Pulsante cestino per eliminare il messaggio (visibile solo all'autore o all'admin).
* Box di digitazione rapido in basso con pulsante invio al neon.

---

## 6. Il Componente Universale: `StandingsRow` (DRY al 100%)

Invece di avere 3 tabelle diverse con markup duplicato, creiamo un unico atomo/molecola `StandingsRow`:

```typescript
// components/molecules/StandingsRow.tsx
import { UserSummaryDTO } from "@/lib/types/user"
import { PlayerAvatar } from "@/components/atoms/PlayerAvatar"
import { RankBadge } from "@/components/atoms/RankBadge"
import Link from "next/link"

interface StandingsRowProps {
  rank: number
  user: UserSummaryDTO
  mainScore: string | number     // es. "86.4 pt" o "3450 pt"
  secondaryDetail?: string       // es. "28/30 partite" o "KR: 3200 | MZ: 4"
  isHighlighted?: boolean       // true se è l'utente loggato
}

export function StandingsRow({ rank, user, mainScore, secondaryDetail, isHighlighted }: StandingsRowProps) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
      isHighlighted ? "bg-primary/10 border-primary/40 shadow-sm" : "bg-card/40 border-white/5 hover:border-white/15"
    }`}>
      <div className="flex items-center gap-3">
        <RankBadge rank={rank} />
        <Link href={`/profile/${user.id}`} className="flex items-center gap-2.5 group">
          <PlayerAvatar user={user} size="sm" />
          <span className="font-semibold text-sm group-hover:text-primary transition-colors">
            {user.name}
          </span>
        </Link>
      </div>

      <div className="text-right">
        <span className="font-bold text-sm tracking-tight text-foreground">{mainScore}</span>
        {secondaryDetail && (
          <p className="text-[11px] text-muted-foreground">{secondaryDetail}</p>
        )}
      </div>
    </div>
  )
}
```

Questo singolo componente renderizza perfettamente:
1. La classifica giornaliera della Dashboard.
2. La classifica storica di periodo.
3. Le classifiche per singolo gioco.
Zero duplicazione di layout, zero stili sparsi.

---

## 7. Piano Esecutivo di Implementazione

1. **Step 1 · Fondamenta e Stile**:
   * Aggiornare `globals.css` con le classi `.glass-card`, `.glow-loser`, `.glow-winner` e i token dei giochi.
2. **Step 2 · Atomi Base**:
   * Creare `PlayerAvatar`, `GameBadge`, `RankBadge`, `NeonButton`.
3. **Step 3 · Molecole & Componente Universale**:
   * Creare `DateNavigator`, `GameTabs`, `StandingsRow`.
4. **Step 4 · Navbar e Shell**:
   * Ricostruire `Navbar.tsx` con dropdown mobile e link puliti (`/dashboard`, `/submit`, `/bacheca`, `/profile`).
5. **Step 5 · Riorganizzazione delle Pagine**:
   * Implementare `/dashboard` (Server Component con DTO, Perdente SX / Vincente DX).
   * Creare la pagina `/submit`.
   * Creare la pagina `/bacheca`.
   * Creare la nuova Gamer Card `/profile/[userId]`.
