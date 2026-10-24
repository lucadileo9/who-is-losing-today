# Template (Templates)

I **Template** definiscono la struttura di layout di pagina dell'applicazione, posizionando gli organismi, le molecole e gli atomi nelle griglie e nei contenitori principali.

---

## 1. `DashboardTemplate` ([`components/templates/DashboardTemplate.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/templates/DashboardTemplate.tsx))

Template di layout per la pagina principale `/dashboard`.

### **Responsabilità**:
- Organizza il layout responsivo a due colonne su schermi grandi:
 - Header della Dashboard e Statistiche veloci in alto.
 - Card del Perdente di Oggi e Podio della giornata.
 - Modulo di inserimento punteggio `GameScoreInput`.
 - Griglia della Classifica Generale (`LeaderboardTable`) e del Trend di Gruppo (`TrendChart`).

---

## 2. `ProfileTemplate` ([`components/templates/ProfileTemplate.tsx`](file:///c:/Users/lucad/my-projects/who-is-losing-today/components/templates/ProfileTemplate.tsx))

Template di layout per la pagina del profilo utente `/profile`.

### **Responsabilità**:
- Organizza la disposizione della scheda info giocatore, delle schede di statistica personale (`PersonalStatsCard`), del grafico di andamento personale (`PersonalTrendChart`) e dello storico delle partite recenti (`ScoreHistoryList`).
