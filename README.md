# **Next.js Template**

Benvenuto nel **Next.js Template**, uno starter kit completamente configurato per sviluppare applicazioni web moderne con Next.js. Questo template include configurazioni avanzate per garantire un codice pulito, coerente e privo di errori, oltre a strumenti per la formattazione, l'analisi statica del codice e l'integrazione di Tailwind CSS.

## **Caratteristiche Principali**
- **Next.js**: Framework React per applicazioni server-side rendering (SSR) e static site generation (SSG).
- **Tailwind CSS**: Framework CSS utility-first con breakpoint e classi personalizzate già configurate.
- **Atomic Design**: Organizzazione dei componenti basata sul principio dell'Atomic Design.
- **shadcn/ui**: Libreria di componenti UI predefiniti e personalizzabili.
- **Prettier**: Strumento di formattazione del codice per garantire uno stile uniforme.
- **ESLint**: Analizzatore di codice statico per identificare errori, bug e violazioni delle best practices.
- **Integrazione Prettier + ESLint**: Configurazione ottimizzata per far lavorare insieme Prettier e ESLint senza conflitti.
- **Script automatizzati**: Comandi predefiniti per formattare, analizzare e validare il codice.
- **Ignoramento intelligente**: File ignorati automaticamente per evitare modifiche indesiderate.

---

## **Script Utili**
Il file `package.json` include i seguenti script:

- **`npm run dev`**: Avvia il server di sviluppo.
  ```bash
  npm run dev
  ```

- **`npm run build`**: Crea una versione ottimizzata del progetto.
  ```bash
  npm run build
  ```

- **`npm run start`**: Avvia il server di produzione.
  ```bash
  npm run start
  ```

- **`npm run lint`**: Analizza il codice con ESLint e applica correzioni automatiche.
  ```bash
  npm run lint
  ```

- **`npm run format`**: Formatta il codice con Prettier.
  ```bash
  npm run format
  ```

- **`npm run validate`**: Combina analisi e formattazione in un unico comando. **Prima di eseguire il commit eseguire sempre questo comando**
  ```bash
  npm run validate
  ```
  
---

## **Path Configurati per gli Import**

Questo template utilizza alias di import configurati tramite `tsconfig.json` per semplificare l'organizzazione e il riferimento ai file. 

### **Come Funziona**
- **`@/*`**: Riferisce la root del progetto.
- **`@components/*`**: Riferisce la cartella `components`.
- **`@styles/*`**: Riferisce la cartella `styles`.
- **`@atoms/*`, `@molecules/*`, `@organisms/*`**: Riferiscono rispettivamente le sottocartelle `atoms`, `molecules` e `organisms` all'interno della cartella `components`.

### **Esempio di Utilizzo**
Invece di scrivere:
```javascript
import Button from '../../components/atoms/Button';
```
Devi scrivere:
```javascript
import Button from '@atoms/Button';
```
**Importante usare gli alias perchè rendono il progetto più flessibile**

---

## **Tailwind CSS**

Questo template utilizza **Tailwind CSS**, un framework CSS utility-first che permette di creare interfacce rapidamente e in modo modulare. Ecco i dettagli della configurazione:

### **1. Breakpoints Personalizzati**
I breakpoint sono stati configurati per adattarsi a diverse dimensioni di schermo. Sono presenti nel file `tailwind.config.js`.

Maggiori info qui: https://tailwindcss.com/docs/responsive-design 
### **2. Classe Container**
La classe `container` è stata configurata per centrare il contenuto e impostare una larghezza massima in base ai breakpoint, così da rendere il layout reattivo. 

Maggiori info: https://v3.tailwindcss.com/docs/container

### **3. Colori Personalizzati**
è possibile definire dei colori personalizzati per il tuo progetto. Questi colori possono essere utilizzati in tutto il progetto per garantire coerenza visiva. Puoi definire i tuoi colori nel file `tailwind.config.js` sotto la sezione `theme.extend.colors`, riga da 44 a 51. Servono per avere compatibilità con lo standard di shadcn/ui
### **4. Come Usare Tailwind**
Per utilizzare Tailwind, aggiungi le classi direttamente nei tuoi componenti React. Ad esempio:

```jsx
<div className="container mx-auto p-4 bg-primary text-light">
  <h1 className="text-3xl font-bold">Hello, World!</h1>
</div>
```

---

## **Aggiunta di Componenti e Routes**

### **1. Plop: Generazione Automatica di Componenti e Routes**
Questo template include **Plop**, uno strumento che semplifica la creazione di nuovi componenti e routes seguendo una struttura predefinita. Ecco come usarlo:

#### **Comando per Creare un Nuovo Componente**
Per creare un nuovo componente, esegui:

```bash
npm run new-component
```
Plop ti chiederà il nome del componente, il suo livello [(atomic design)](#2-atomic-design-organizzazione-dei-componenti) e lo genererà automaticamente nella cartella appropriata.

#### **Comando per Creare una Nuova Route**
Per creare una nuova rotta, esegui:

```bash
npm run new-route
```
Plop ti chiederà il nome della rotta e genererà automaticamente un file nella cartella `app`.

---

## **Atomic Design: Organizzazione dei Componenti**
Questo template segue il principio dell'**Atomic Design**, che organizza i componenti in 3 livelli gerarchici:

1. **Atoms**: Componenti atomici, ovvero i blocchi di base dell'interfaccia (es. bottoni, input, icone).
2. **Molecules**: Gruppi di atomi che formano componenti più complessi (es. form con campi di input).
3. **Organisms**: Gruppi di molecole che formano sezioni complete dell'interfaccia (es. header, footer).

La struttura delle cartelle riflette questa organizzazione:
```
components/
  atoms/
  molecules/
  organisms/
  ui/ # vedi sezione successiva
```
---

## **shadcn/ui: Componenti UI Predefiniti**
Questo template integra **shadcn/ui**, una libreria di componenti UI basata su **Tailwind CSS**. I componenti sono altamente personalizzabili e possono essere facilmente integrati nel tuo progetto.

### **Aggiunta di Componenti**
Per aggiungere un componente predefinito (es. button, modal), esegui:
```bash
npx shadcn-ui@latest add button
```
Il componente verrà aggiunto alla cartella `components/ui` e potrà essere importato direttamente nel tuo codice.

### **Personalizzazione**
I componenti di shadcn/ui sono basati su Tailwind CSS, quindi puoi personalizzarli modificando il file `tailwind.config.js` o aggiungendo classi Tailwind direttamente nei componenti.

---
## **Formattazione e Analisi del Codice**

### **1. Prettier**
Il file `.prettierrc` contiene le regole di formattazione del codice utilizzate da **Prettier**. Ecco una descrizione delle principali regole:

#### **Dettagli delle Regole**
- **`semi: true`**: Aggiunge punti e virgola alla fine delle istruzioni.
- **`singleQuote: true`**: Usa apici singoli invece di doppi.
- **`tabWidth: 2`**: Indenta con 2 spazi.
- **`trailingComma: "es5"`**: Aggiunge virgole finali negli oggetti e negli array.
- **`printWidth: 80`**: Imposta la larghezza massima della riga a 80 caratteri.
- **`bracketSpacing: true`**: Aggiunge spazi tra parentesi graffe.
- **`jsxBracketSameLine: false`**: Chiude i tag JSX su una nuova riga.
- **`arrowParens: "always"`**: Aggiunge sempre parentesi attorno ai parametri delle funzioni freccia.
- **`proseWrap: "always"`**: Va sempre a capo quando il testo supera la larghezza massima.
- **`quoteProps: "consistent"`**: Usa virgolette attorno alle proprietà degli oggetti in modo coerente.
- **`plugins: ["prettier-plugin-tailwindcss"]`**: Abilita e utilizza il plugin prettier-plugin-tailwindcss per ordinare automaticamente le classi Tailwind CSS.

### **2. ESLint**
Il file `.eslintrc.json` definisce le regole per l'analisi statica del codice del nostro progetto utilizzando ESLint. Questa configurazione ci aiuta a mantenere uno stile di codice consistente, a identificare potenziali errori e a migliorare la qualità generale del software. Di seguito è riportata una descrizione delle principali configurazioni e regole adottate:

#### Configurazione di Base

* **Parser:** Utilizziamo `@typescript-eslint/parser` per permettere a ESLint di comprendere il codice TypeScript.
* **Opzioni del Parser:** Configuriamo ESLint per supportare ECMAScript 2020, i moduli ES e JSX.
* **Estensioni (Extends):** La nostra configurazione estende diversi set di regole predefinite e raccomandate:
    * `eslint:recommended`: Regole base di ESLint.
    * `plugin:react/recommended`: Regole raccomandate per React.
    * `plugin:@typescript-eslint/recommended`: Regole raccomandate per TypeScript.
    * `next/core-web-vitals`: Regole specifiche per Next.js e Core Web Vitals.
    * `plugin:prettier/recommended`: Integra Prettier disattivando le regole di stile di ESLint che potrebbero entrare in conflitto.
* **Plugin:** Aggiungiamo funzionalità specifiche attraverso i seguenti plugin:
    * `prettier`: Per l'integrazione con Prettier.
    * `import`: Per gestire e ordinare gli import.
    * `unused-imports`: Per identificare e gestire import e variabili non utilizzati.
    * `react`: Per le regole specifiche di React.
    * `@typescript-eslint`: Per le regole specifiche di TypeScript.
* **Impostazioni (Settings):**
    * `react`: Rileva automaticamente la versione di React utilizzata.
    * `import/resolver`: Configura il resolver di import per TypeScript, aiutando a risolvere i percorsi dei moduli.

#### Dettagli delle Regole Principali

Ecco una spiegazione delle regole personalizzate o particolarmente rilevanti nel nostro file `.eslintrc.json`:

* **`prettier/prettier`: `"off"`**: Disattiva le regole di Prettier all'interno di ESLint. Questo previene conflitti, poiché la formattazione è gestita direttamente da Prettier, mentre ESLint si concentra sulla qualità e sugli errori del codice.
* **`no-unused-vars` e `@typescript-eslint/no-unused-vars`: `"off"`**: Queste regole base sono disattivate perché utilizziamo il plugin `unused-imports` per una gestione più specifica e avanzata.
* **`unused-imports/no-unused-imports`: `"warn"`**: Segnala come *warning* (avviso) gli import che non vengono utilizzati nel codice.
* **`unused-imports/no-unused-vars`: `["warn", { ... }]`**: Segnala come *warning* le variabili e gli argomenti delle funzioni non utilizzati, con la possibilità di ignorare quelli che iniziano con un underscore (`_`).
* **`react/react-in-jsx-scope`: `"off"`**: Disabilita la necessità di importare `React` in ogni file che utilizza JSX, come richiesto dalle versioni più recenti di React e Next.js.
* **`react-hooks/rules-of-hooks`: `"error"`**: Forza il rispetto delle regole fondamentali degli Hooks di React, segnalando le violazioni come *error* (errore).
* **`react-hooks/exhaustive-deps`: `"warn"`**: Verifica che tutte le dipendenze esterne utilizzate all'interno di `useEffect`, `useCallback`, ecc., siano incluse nell'array delle dipendenze, segnalando mancanze come *warning*.
* **`react/prop-types`: `"off"`**: Disabilita la verifica dei `PropTypes` di React, poiché utilizziamo TypeScript per la tipizzazione dei componenti.
* **`@typescript-eslint/no-empty-object-type`: `"off"`**: Permette l'uso di tipi oggetto vuoti (`{}`) in TypeScript. *Nota: Assicurati che questa sia l'intenzione corretta, potresti voler usare `@typescript-eslint/no-empty-interface` se stai usando interfacce.*
* **`eqeqeq`: `"warn"`**: Sconsiglia l'uso degli operatori di uguaglianza non stretta (`==` e `!=`), promuovendo l'uso di quelli stretti (`===` e `!==`) per evitare conversioni di tipo implicite e potenziali bug.
* **`no-console`: `["warn", { "allow": ["warn", "error"] }]`**: Segnala come *warning* l'uso di `console` (ad es. `console.log`), ma permette l'uso di `console.warn` e `console.error`.
* **`no-magic-numbers`: `["warn", { ... }]`**: Vieta l'uso di "numeri magici" (numeri hardcoded senza una chiara spiegazione) nel codice, segnalandoli come *warning*. Sono previste eccezioni per i numeri `0`, `1`, `-1`, `2`, `100` e per gli indici degli array.
* **`prefer-const`: `"warn"`**: Suggerisce di utilizzare `const` invece di `let` per le variabili che non vengono riassegnate, promuovendo l'immutabilità.
* **`import/order`: `["error", { ... }]`**: Forza un ordine specifico per gli import, raggruppandoli (builtin, external, internal, ecc.), aggiungendo una linea vuota tra i gruppi e ordinandoli alfabeticamente. Le violazioni sono segnalate come *error*.
* **`import/no-duplicates`: `"error"`**: Impedisce l'importazione duplicata dello stesso modulo nello stesso file.
* **`no-empty-pattern`: `"warn"`**: Segnala come *warning* l'uso di pattern di destrutturazione vuoti (ad es., `const {} = myObject;`).

---

## **Come Iniziare**

Per iniziare a utilizzare il template, segui questi passaggi:

1. **Installa le Dipendenze**
   Esegui il comando seguente per installare tutte le dipendenze necessarie:
   ```bash
   npm install
   ```

2. **Modifica la Struttura delle Pagine**
   - Modifica il file `app/page.tsx` o aggiungi nuove routes.

3. **Avvia il Server di Sviluppo**
   Una volta completate le modifiche, avvia il server di sviluppo con:
   ```bash
   npm run dev
   ```
   Apri il browser all'indirizzo `http://localhost:3000` per vedere il tuo progetto in azione.

---

## **Gestione dei temi colori**

I temi attualmente configurati si trovano nel file `website.config.ts`, alla voce `color_themes`.
- Il tema system è il tema (chiaro o scuro) preferito dal browser dell'utente.
- i restanti temi sono personalizzati, in questo caso di esempio abbiamo creato un tema `jemore-theme-light` per il tema chiaro e `jemore-theme-dark` per il tema scuro.

Per aggiungere un tema:
  1. Aggiungi il nome tema alla variabile `color_themes` nel file `website.config.ts`.
  2. Aggiungi le classi css per il tema dentro il file `styles/globals.css`. La classe deve avere lo stesso nome del tema
     - la classe css create deve **avere obbligatoriamente tutte le variabili di colore definite nel file `tailwind.config.js`** alla voce `theme.extend.colors`. Sono quelle di shadcn/ui. Puoi copiare i nomi dai temi già esistenti.
     - Obbligatorio dichiarare i colori in formato `hsl`, *senza* usare la color space function (`hsl()`)
  3. Aggiungere al componente `ThemeSelector` il nuovo tema, in modo che sia selezionabile dall'utente. Copiare il codice di un tema già esistente e modificarlo con il nome del nuovo tema.
  4. Il tema sarà disponibile in tutto il progetto e potrà essere settato utilizzando l'apposito componente `ThemeSelector`. (viene automaticamente assegnato dinamicamente alla root)

È possibile avere delle varianti dello stesso tema:
1. creare una classe css con il nome del tema seguito da `-variant-<number>`, ad esempio `jemore-theme-variant-1`
   - importante che la classe css sia dichiarata come figlia della classe del tema principale, ad esempio:
   ```css
   .jemore-theme-light {
    --primary: 40deg 20% 10%;
   }
   
   .jemore-theme-light .jemore-theme-variant-1 {
     --primary: 10deg 20% 50%;
   }
   ```
   - da notare che quindi la classe variante non è autonoma, ma deve essere sempre figlia della classe del tema principale, e se viene usata, tutti i temi implementati devono prevederla.
2. all'interno della classe css, riassegnare le variabili colore che si vogliono cambiare
3. assegnare questa classe solo alle componenti che devono avere il tema variante

Esempio completo di un tema con una variante:
```css
  .jemore-theme-dark {
    --background: 240 22% 15%; /* --blu-scuro */
    --foreground: 0 60% 98%; /* --bianco-latte */

    --card: 233 19% 27%; /* --blu-petrolio */
    --card-foreground: 0 60% 98%; /* --bianco-latte */

    --popover: 240 22% 15%; /* --blu-scuro */
    --popover-foreground: 0 60% 98%; /* --bianco-latte */

    --primary: 233 57% 31%; /* --blu */
    --primary-foreground: 50 100% 51%; /* --giallo per un contrasto più forte */

    --secondary: 50 100% 51%; /* --giallo */
    --secondary-foreground: 240 22% 15%; /* --blu-scuro */

    --muted: 232, 19%, 80%; /* --blu-petrolio */
    --muted-foreground: 0 60% 95%; /* --bianco-latte leggermente più scuro */

    --accent: 50 100% 51%; /* --giallo */
    --accent-foreground: 240 22% 15%; /* --blu-scuro */

    --destructive: 0 70% 55%; /* Rosso più vibrante per il tema scuro */
    --destructive-foreground: 0 60% 98%;

    --border: 20 0% 50%;
    --input: 233 20% 35%; /* Un blu leggermente più chiaro per l'input */
    --ring: 50 100% 51%; /* --giallo per l'outline del focus */

    --radius: 0.5rem;

    @apply font-opensans;
  }

  .jemore-theme-dark .jemore-theme-variant-1 {
    --background: 233 19% 27%;
    --foreground: 0 60% 90%;
  }

  .jemore-theme-variant-1 hr {
    @apply border-foreground;
  }
```

---

## **Fonts**

Nel file `lib/fonts.ts` sono stati importati dei font che piacciono al team di sviluppo. Solitamente sono quelli richiesti dal marketing. 
Nel caso tu voglia aggiungere un font:
1. Dichiararlo nel file `lib/fonts.ts`
2. Inserirlo dentro la variabile `fonts`.
3. Aggiungere la variabile nella apposita sezione del file `tailwind.config.js`, `theme.extend.fontFamily`
4. il font sarà disponibile in tutto il progetto e potrà essere utilizzato nelle tue classi css utilizzando la direttiva `@apply font-<name>`.

Esempio:
```ts
const merriweather: NextFontWithVariable = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather',
  display: 'swap',
});

export const fonts = {
  merriweather,
};
```
dentro il file `tailwind.config.js`:
```js
theme: {
  extend: {
    fontFamily: {
      merriweather: ['var(--font-merriweather)', 'system-ui', 'serif']
    }
  }
}
```

## **Website Config**

Il file website.config.ts contiene le configurazioni principali del sito, come il titolo, la descrizione,
i colori dei temi e altre impostazioni globali. Queste configurazioni sono utilizzate in tutto il progetto per garantire coerenza e facilità di gestione.
È utile per avere un controllo centralizzato.

---

## **Conclusione**
Grazie per aver scelto questo **Next.js Template** per il tuo progetto. Con le sue configurazioni avanzate, strumenti integrati e approccio modulare, speriamo che tu possa sviluppare applicazioni web moderne in modo rapido ed efficiente. 

Se hai domande o suggerimenti contatta il team di sviluppo. Buon coding!

---
