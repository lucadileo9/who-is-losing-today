# Teoria del Database e Prisma ORM

Questo documento esamina la teoria dei **Database Relazionali (RDBMS)**, il funzionamento di **Prisma ORM** e l'architettura dei dati per l'applicazione **Who Is Losing Today**.

---

## 1. Perché un Database Relazionale (PostgreSQL)?

Nello sviluppo web moderno si sceglie spesso tra **Database Relazionali (SQL)** e **Database Non Relazionali (NoSQL / Documenti)**. Per la nostra applicazione di tracciamento punteggi e classifiche, PostgreSQL è la scelta architetturale perfetta per tre motivi:

### 1.1 Integrità Referenziale e Vincoli di Chiave Esterna (Foreign Keys)
I dati di *Who Is Losing Today* hanno relazioni stringenti:
- Un punteggio (`daily_scores`) **deve** appartenere a un utente reale (`users`) ed a un gioco esistente (`games`).
- Se un utente viene eliminato, la regola `ON DELETE CASCADE` garantisce che i suoi punteggi vengano rimossi automaticamente evitando dati "orfani" o corrotti.

### 1.2 Vincoli di Unicità Composta (`@@unique`)
L'applicazione vieta che uno stesso utente inserisca due punteggi distinti per lo stesso gioco nel medesimo giorno. PostgreSQL garantisce questa regola a livello di motore di database con l'indice composito unico:
```prisma
@@unique([userId, gameId, scoreDate])
```

### 1.3 Garanzie ACID (Atomicità, Coerenza, Isolamento, Durabilità)
Qualsiasi operazione di scrittura sui punteggi e sulle classifiche viene eseguita all'interno di transazioni ACID, assicurando che non si verifichino mai disallineamenti nei calcoli del podio o delle media anche in presenza di scritture simultanee.

---

## 2. Cos'è un ORM e perché Prisma?

Un **ORM (Object-Relational Mapper)** è uno strato software che traduce le tabelle ed i record di un database relazionale in oggetti nativi del linguaggio di programmazione (in questo caso TypeScript).

```text
+-----------------------+ +--------------------------+ +-------------------+
| Codice TypeScript | <---> | Prisma Client | <---> | Database |
| const users = | | Engine Query SQL | | PostgreSQL |
| await prisma.user... | | SELECT * FROM "users"... | | (Docker/Supabase) |
+-----------------------+ +--------------------------+ +-------------------+
```

### **I Vantaggi di Prisma ORM**:

1. **Type-Safety Assoluto**: Quando modifichi lo schema, Prisma rigenera il client TypeScript (`@prisma/client`). Se provi a richiedere un campo inesistente o di tipo errato, TypeScript segnala l'errore direttamente nell'IDE prima ancora di eseguire il codice.
2. **Astrazione del Motore SQL**: Puoi scrivere le query in TypeScript (`prisma.dailyScore.findMany()`) senza dover comporre stringhe SQL manuali soggette a SQL Injection.
3. **Portabilità dell'Infrastruttura**: Lo stesso codice TypeScript funziona senza modifiche sia sul database PostgreSQL locale in Docker che su Supabase Cloud in produzione.

---

## 3. Struttura dello Schema Prisma ([`prisma/schema.prisma`](file:///c:/Users/lucad/my-projects/who-is-losing-today/prisma/schema.prisma))

Il file di schema è suddiviso in due sezioni logiche: **Modelli Autenticazione** e **Modelli Dominio Giochi**.

```prisma
datasource db {
 provider = "postgresql"
 url = env("DATABASE_URL")
 directUrl = env("DIRECT_URL")
}

generator client {
 provider = "prisma-client-js"
}
```

### 3.1 Modelli di Autenticazione (NextAuth)

* **`User`**: Rappresenta il profilo del giocatore.
 - `id`: Identificativo unico CUID (`cuid()`).
 - `email`: Indirizzo univoco dell'utente.
 - `name`, `image`: Nome e foto avatar sincronizzati da Google OAuth.
 - `initials`, `color`: Iniziali stilizzate e classe colore del tema visivo.

* **`Account`**: Mantiene il collegamento tra l'utente ed il provider federato (Google).
 - `provider`, `providerAccountId`: Identificativo unico restituito da Google.
 - `access_token`, `refresh_token`: Token crittografici inoltrati da OAuth.

* **`Session` & `VerificationToken`**: Gestione sessioni e token di verifica temporanei.

### 3.2 Modelli di Dominio (Punteggi e Giochi)

* **`Game`**: Registro dei giochi supportati (*Krilion*, *Metazooa*, *Chronophoto*).
 - `id`: Stringa univoca identificativa del gioco (es. `"Krilion"`).
 - `name`: Nome visibile nell'interfaccia.
 - `unit`: Unità di misura (`"pts"` oppure `"tentativi"`).
 - `isLowerBetter`: Booleano per definire se un valore più basso corrisponde a una posizione migliore (es. `true` per Metazooa).

* **`DailyScore`**: Registro storico di tutti i punteggi quotidiani inseriti.
 - `userId`: Chiave esterna verso `User`.
 - `gameId`: Chiave esterna verso `Game`.
 - `rawScore`: Punteggio grezzo originale (es. 3129 o 3 tentativi).
 - `normalizedScore`: Punteggio convertito in scala uniforme 0-100.
 - `scoreDate`: Data di riferimento del punteggio (YYYY-MM-DD).

---

## 4. Ciclo di Vita delle Migrazioni ed Inizializzazione Dati

Prisma mette a disposizione tre comandi principali durante lo sviluppo:

### 1. `npx prisma db push`
Sincronizza direttamente lo schema definitivo `schema.prisma` con il database di destinazione senza creare file di migrazione storici. Ideale per la fase di prototyping veloce.

### 2. `npx prisma generate`
Legge lo schema PSL e genera i tipi TypeScript all'interno del pacchetto `node_modules/@prisma/client`.

### 3. `npx prisma db seed`
Esegue lo script [`prisma/seed.ts`](file:///c:/Users/lucad/my-projects/who-is-losing-today/prisma/seed.ts) per alimentare il database con i giochi di default ed uno storico realistico di punteggi di test su 14 giorni.
