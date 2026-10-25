# 04. Teoria — ORM, Prisma Client e Gestione del Database

Questo documento esplora i principi teorici dei sistemi **Object-Relational Mapping (ORM)**, il funzionamento del motore di **Prisma v6**, il confronto tra `prisma db push` e `prisma migrate`, e la gestione del connection pooling in architetture Next.js.

---

## 1. Cos'è un ORM e il "Disallineamento di Impedenza"

Nello sviluppo software esiste una fondamentale divergenza di paradigma nota come **Object-Relational Impedance Mismatch**:
- **Il Database Relazionale (SQL)**: Ragiona in termini di insiemi matematici, tabelle bidimensionali (righe e colonne), chiavi primarie e chiavi esterne (Foreign Keys).
- **Il Linguaggio Applicativo (TypeScript/JavaScript)**: Ragiona in termini di oggetti nidificati, riferimenti in memoria, interfacce tipizzate e array di elementi.

Un **ORM (Object-Relational Mapper)** agisce come un ponte trasparente tra questi due mondi:
1. **Mappa le tabelle in tipi TypeScript**: Una riga della tabella `users` diventa un oggetto tipizzato `User`.
2. **Genera query SQL ottimizzate**: Evita di scrivere manualmente query SQL in stringhe (`"SELECT * FROM users WHERE..."`), riducendo a zero il rischio di errori di battitura nei nomi di colonna.
3. **Protezione nativa da SQL Injection**: Tutte le query generate da Prisma sono rigorosamente parametrizzate, rendendo impossibile l'iniezione di codice SQL malevolo tramite input dell'utente.

---

## 2. Come Funziona Prisma: Dal Modello al TypeScript

L'architettura di Prisma si fonda su tre componenti:

```text
┌──────────────────────────┐
│   schema.prisma          │ (Modellazione dichiarativa delle entità)
└────────────┬─────────────┘
             │ npx prisma generate
             ▼
┌──────────────────────────┐
│   Prisma Query Engine    │ (Motore ad alte prestazioni scritto in Rust)
│   + @prisma/client       │ (Codice TypeScript generato su misura)
└────────────┬─────────────┘
             │ Import in lib/prisma.ts
             ▼
┌──────────────────────────┐
│   Codice Applicativo     │ (Autocompletamento completo dei tipi nell'IDE)
└──────────────────────────┘
```

Quando si esegue `npx prisma generate`:
1. Prisma analizza `schema.prisma`.
2. Genera all'interno di `node_modules/@prisma/client` le interfacce TypeScript corrispondenti ai tuoi modelli (`User`, `DailyScore`, etc.).
3. Se si rinomina un campo in `schema.prisma`, il compilatore TypeScript segnalerà immediatamente come errore qualsiasi riga di codice nel progetto che utilizzi ancora il vecchio nome prima ancora di lanciare l'app.

---

## 3. `prisma db push` vs `prisma migrate`: Quale Scegliere?

Prisma offre due diverse strategie per aggiornare la struttura del database PostgreSQL:

| Proprietà | `prisma db push` | `prisma migrate dev` |
| :--- | :--- | :--- |
| **Come opera** | Legge `schema.prisma`, ispeziona il database e applica direttamente i comandi DDL per allineare lo schema. | Genera un file `.sql` fisico incrementale (es. `migrations/20261025_add_role/migration.sql`) e lo esegue. |
| **File generati** | **Zero file generati.** Non sporca il repository Git con decine di file di migrazione. | Cartella `prisma/migrations` con la cronologia storica di tutti gli script SQL. |
| **Tabella di controllo** | Nessuna tabella interna. | Crea e consulta la tabella interna `_prisma_migrations`. |
| **Ideale per** | **Sviluppo rapido, prototipi, container Docker** (es. `who-is-losing-today-web` che aggiorna il DB all'avvio). | Grandi team enterprise, ambienti con DBA dedicati che devono revisionare manualmente ogni query SQL DDL. |
| **Scelta nel nostro progetto** | **`prisma db push`**: perfetto per la nostra architettura containerizzata dove il database si auto-allinea all'avvio del container. | Utilizzabile in futuro qualora servissero migrazioni complesse con trasformazioni dati a caldo. |

---

## 4. Il Problema del Connection Pooling con Next.js (HMR)

In ambiente di sviluppo locale, Next.js utilizza l'**Hot Module Replacement (HMR)** per aggiornare il codice nel browser senza riavviare il server.

### Il Rischio: Esaurimento Connessioni
Ogni volta che si modifica un file (es. `daily.ts`), Next.js ricompila ed esegue nuovamente i moduli. Se si istanziasse il client con un banale:
```typescript
// ❌ SBAGLIATO in Next.js:
export const prisma = new PrismaClient();
```
A ogni salvataggio di file verrebbe creata una **nuova istanza** di `PrismaClient`, che aprirebbe un nuovo pool di connessioni TCP verso PostgreSQL (tipicamente 10 connessioni ciascuno). Dopo pochi minuti, PostgreSQL raggiungerebbe il limite `max_connections` (100) e rifiuterebbe qualsiasi nuova query con l'errore:
`Error: Can't reach database server / Connection pool exhausted`.

### La Soluzione: Il Pattern Singleton ([lib/prisma.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/lib/prisma.ts))
```typescript
// ✅ CORRETTO:
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

// In sviluppo memorizza l'istanza su globalThis, sopravvivendo all'HMR
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```
Poiché l'oggetto `globalThis` di Node.js non viene resettato durante il ricaricamento dei moduli di Next.js, l'applicazione riutilizza sempre la stessa istanza del client e lo stesso pool di connessioni.

---

## 5. Seeding e Popolamento Dati

Il file [prisma/seed.ts](file:///c:/Users/lucad/my-projects/who-is-losing-today/prisma/seed.ts) è programmato per popolare l'istanza di database con:
- Il catalogo dei giochi di default (`Krilion`, `Metazooa`, `Chronophoto`).
- Utenti fittizi con colori distintivi.
- Punteggi storici per testare immediatamente grafici, andamenti e statistiche personali.

Viene registrato in `package.json`:
```json
"prisma": {
  "seed": "npx tsx prisma/seed.ts"
}
```
E può essere invocato in qualsiasi momento con il comando:
```bash
npx prisma db seed
```
