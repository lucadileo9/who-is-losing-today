# Documentazione Componente: `Header`

## 1\. Panoramica

`Header` è un componente React moderno, interattivo e responsive per la
navigazione principale di un'applicazione web. È stato progettato per offrire
un'esperienza utente ricca e fluida attraverso animazioni sofisticate, rimanendo
al contempo facile da configurare e mantenere.

### Funzionalità Principali

- **Responsive Design**: Si adatta elegantemente da schermi desktop a
  dispositivi mobili.
- **Animazioni 3D**: I link del menu hanno un effetto "flip" 3D al passaggio del
  mouse o al tocco.
- **Effetti di Luce (Glow)**: Effetti di bagliore sottili e animati per
  migliorare il feedback visivo.
- **Menu Mobile a Cascata**: Un menu mobile a tendina con animazioni di entrata
  e uscita fluide e link che appaiono in sequenza.
- **Theming**: Pienamente compatibile con il cambio di tema chiaro/scuro.

### Tecnologie Utilizzate

- **React**: Per la costruzione dell'interfaccia.
- **Framer Motion**: Per tutte le animazioni del componente.
- **Tailwind CSS**: Per lo styling e il layout.
- **Lucide React**: Per le icone.
- **Next-Themes**: Per la gestione del tema.

## 2\. Integrazione e Utilizzo

Per utilizzare il componente `Header`, importalo e inseriscilo nel layout
principale della tua applicazione.

**Esempio in `Layout.tsx`:**

```tsx
import { Header } from '@/components/ui/Header'; // Assicurati che il percorso sia corretto

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Assicurati che il ThemeProvider avvolga la tua app */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Nota:** Il componente si aspetta di essere avvolto da un `ThemeProvider` di
`next-themes` per il corretto funzionamento del cambio di tema.

## 3\. Struttura del Codice

Il componente è suddiviso logicamente per massimizzare la leggibilità e la
manutenibilità.

### `menu-data.tsx` - I Dati di Navigazione

Per separare i dati dalla logica di visualizzazione, tutti i link e le loro
proprietà sono definiti in questo file. Questo rende estremamente facile
aggiungere, rimuovere o modificare le voci del menu senza toccare il codice del
componente.

**Struttura di un `MenuItem`:**

```typescript
export interface MenuItem {
  icon: IconName; // Il nome dell'icona (da Lucide React)
  label: string; // Il testo del link
  href: string; // Il link di destinazione (es. "#sezione" o "/pagina")
  gradient: string; // Il gradiente radiale per l'effetto glow
  iconColor: string; // La classe Tailwind per il colore dell'icona al passaggio del mouse
}
```

### `Header.tsx` - Il Componente

Questo file contiene tutta la logica JSX e di animazione. La sua struttura è
pensata per essere il più dichiarativa possibile: la logica di animazione è
incapsulata in "ricette" predefinite, e la struttura JSX le applica ai vari
elementi.

## 4\. Le Ricette di Animazione (`variants`)

Le animazioni sono definite in oggetti chiamati `variants`. Ogni oggetto
descrive gli stati di un elemento (es. `initial`, `hover`) e Framer Motion si
occupa della transizione fluida tra di essi.

### `itemVariants` & `backVariants` (L'Effetto Flip 3D)

Questi due lavorano in coppia. Immagina un biglietto da visita.

- **`itemVariants` (Faccia Frontale)**: Definisce il comportamento della faccia
  che vedi all'inizio. Nello stato `initial` è piatta e visibile. Nello stato
  `hover`, si ribalta all'indietro di 90 gradi (`rotateX: -90`) e svanisce, come
  se la stessi girando.
- **`backVariants` (Faccia Posteriore)**: Definisce la faccia nascosta. Nello
  stato `initial` è già ruotata di 90 gradi e invisibile. Nello stato `hover`,
  ruota per prendere il posto della faccia frontale, diventando piatta e
  visibile.

### `glowVariants` (Bagliore del Singolo Link)

Questa ricetta crea l'alone di luce che appare dietro a un link quando
interagisci con esso.

- **`initial`**: Il bagliore è invisibile (`opacity: 0`) e leggermente
  rimpicciolito (`scale: 0.8`).
- **`hover`**: Il bagliore diventa visibile e si espande (`opacity: 1`,
  `scale: 1.5`). La transizione usa una fisica di tipo "molla" (`spring`), che
  le conferisce un effetto elastico e naturale.

### `navGlowVariants` (Bagliore Ambientale)

Simile al precedente, ma più semplice. Si applica a un bagliore decorativo per
l'intera barra di navigazione quando il mouse entra nella sua area. Passa
semplicemente da `opacity: 0` a `opacity: 1`.

### `mobileMenuVariants` (Contenitore del Menu Mobile)

Gestisce l'apparizione e la scomparsa dell'intero menu a tendina.

- **`closed`**: Lo stato "chiuso". Il menu è invisibile, spostato leggermente
  verso l'alto (`y: -20`) e rimpicciolito. Questo crea l'effetto che il menu si
  "ritiri" quando scompare.
- **`open`**: Lo stato "aperto". Il menu diventa visibile, scende alla sua
  posizione finale e torna alla sua dimensione normale.

### `mobileItemVariants` (Animazione a Cascata)

Questa è la ricetta per l'entrata in scena dei singoli link nel menu mobile.

- **`closed`**: Il link è invisibile e spostato leggermente a sinistra
  (`x: -20`).
- **`open`**: È una funzione che calcola un **ritardo (`delay`)** basato sulla
  posizione del link nella lista. Questo fa sì che i link non appaiano tutti
  insieme, ma uno dopo l'altro, con un elegante effetto a cascata.

## 5\. Anatomia dell'Header

L'Header è una composizione di più parti animate che lavorano in sinergia.

### Struttura Generale (`<header>` e `<nav>`)

- Il tag `<header>` è il contenitore principale, fissato in cima alla pagina
  (`position: fixed`) con uno `z-index` elevato per rimanere sempre in primo
  piano. Lo stile `backdrop-blur` gli conferisce un aspetto moderno "vetro
  smerigliato".
- Al suo interno, il tag `<nav>` funge da "palcoscenico" 3D grazie alla
  proprietà `perspective`. È anche il "sensore" principale per le animazioni al
  passaggio del mouse: il suo `whileHover="hover"` attiva gli stati `hover` in
  tutti i suoi figli animati.

### Menu Desktop

Visibile solo su schermi grandi, è dove l'effetto 3D è più prominente. Ogni link
è una micro-scena composta da 3 strati sovrapposti:

1.  **Strato Posteriore (Glow)**: Un `div` con lo sfondo a gradiente che si
    anima usando `glowVariants`. È puramente decorativo.
2.  **Strato Intermedio (Faccia Frontale)**: Il link `<a>` visibile di default.
    La sua animazione (`itemVariants`) lo fa ruotare all'indietro dal suo
    **bordo inferiore** (`transform-origin: center bottom`).
3.  **Strato Anteriore (Faccia Posteriore)**: Un secondo link `<a>` identico,
    inizialmente invisibile. La sua animazione (`backVariants`) lo fa ruotare in
    avanti dal suo **bordo superiore** (`transform-origin: center top`).

La rotazione simultanea ma con punti di perno opposti crea l'illusione perfetta
di un singolo oggetto che si gira attorno al suo asse centrale.

### Menu Mobile

È un sistema perfettamente orchestrato di 4 elementi che si attivano quando
l'utente clicca il bottone "hamburger":

1.  **Il Bottone di Attivazione**: Non solo cambia lo stato dell'applicazione
    per aprire il menu, ma anima anche la propria icona, che ruota per
    trasformarsi da "hamburger" a "X".
2.  **L'Overlay del Menu**: È il contenitore a tendina che scivola dall'alto. La
    sua animazione di entrata e uscita è gestita dal componente
    `<AnimatePresence>` di Framer Motion, che assicura una transizione fluida
    anche in chiusura.
3.  **I Link del Menu**: Sono il cuore del menu. Ognuno di essi esegue due
    animazioni: prima, un'**animazione di entrata a cascata** (grazie a
    `mobileItemVariants` e al `delay` calcolato dinamicamente) che li fa
    apparire uno dopo l'altro; poi, una volta visibili, offrono la **stessa
    animazione di flip 3D** del menu desktop per un'esperienza coerente.
4.  **Il Backdrop**: È lo sfondo scuro che appare dietro al menu. Ha il duplice
    scopo di focalizzare l'attenzione dell'utente e di funzionare come un'area
    "cliccabile" per chiudere il menu, un dettaglio di usabilità molto
    importante.

## 6\. Personalizzazione e Modifiche

Per modificare il componente, segui queste linee guida.

### Aggiungere/Modificare Link del Menu

Tutte le modifiche relative ai contenuti del menu devono essere fatte
esclusivamente nel file `menu-data.tsx`. È sufficiente aggiungere, rimuovere o
modificare gli oggetti all'interno dell'array `menuItems`. Ogni oggetto deve
rispettare la struttura definita dall'interfaccia `MenuItem`, fornendo un'icona,
un'etichetta, un link, un gradiente per il bagliore e una classe di colore per
l'icona.

### Modificare le Animazioni

Le caratteristiche fisiche e temporali delle animazioni, come la velocità,
l'effetto "molla" o la durata, possono essere regolate agendo direttamente sui
valori numerici degli oggetti `variants`. Questi oggetti si trovano tutti
raggruppati all'inizio del file `Header.tsx` per un facile accesso.

### Modificare Colori e Stile

Lo stile generale del componente è gestito tramite classi Tailwind CSS
direttamente nel codice JSX. Per i colori specifici delle interazioni, come il
bagliore o il colore dell'icona al passaggio del mouse, i valori sono definiti
come stringhe all'interno degli oggetti nel file `menu-data.tsx`. È fondamentale
ricordare che, a causa del funzionamento del compilatore di Tailwind, ogni nuova
classe di colore che si desidera utilizzare per un'interazione (come
`group-hover:text-nuovocolore-500`) deve essere esplicitamente aggiunta alla
`safelist` nel file di configurazione `tailwind.config.js`. Questo assicura che
la classe venga inclusa nel foglio di stile finale e che l'effetto visivo
funzioni correttamente.

# CODICE

```tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useState } from 'react';

import MyIcon from '@/components/atoms/MyIcon';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';

import HeaderProps from './index.types';
import { menuItems } from './menu-data';

// Questa due variabili definiscono le animazioni "3D" per gli elementi del menu
const itemVariants = {
  initial: { rotateX: 0, opacity: 1 }, // stato iniziale: gli elementi sono visibili e non ruotati
  hover: { rotateX: -90, opacity: 0 }, // stato al passaggio del mouse: ruota l'elemento e lo rende invisibile
};
const backVariants = {
  initial: { rotateX: 90, opacity: 0 }, // stato iniziale: l'elemento di sfondo è ruotato e invisibile
  hover: { rotateX: 0, opacity: 1 }, // stato al passaggio del mouse: ruota l'elemento di sfondo e lo rende visibile
};

// Queste variabili definiscono le animazioni per gli effetti di glow e transizione del menu
const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 1.5,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
      scale: {
        duration: 0.5,
        type: 'spring' as const,
        stiffness: 300,
        damping: 25,
      },
    },
  },
};

// Queste variabili definiscono le animazioni per il menu mobile
const mobileMenuVariants = {
  closed: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};
const mobileItemVariants = {
  closed: { opacity: 0, x: -20 },
  open: (i: number) => ({
    // funzione per animare ogni elemento con un ritardo
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1, // ritardo basato sull'indice dell'elemento
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
};
// Questa variabile definisce la transizione condivisa per gli elementi del menu
const sharedTransition = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

const Header: FC<HeaderProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };
  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50 border-b border-border/40 bg-background/80 shadow-lg backdrop-blur-lg"
      initial="initial"
    >
      <motion.nav
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        whileHover="hover"
      >
        <div className="relative z-10 flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo_jemore.png"
                alt="Logo"
                width={80}
                height={80}
                className="item-start cursor-pointer justify-center"
              />
            </Link>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-1 lg:gap-2">
              {menuItems.map((item) => (
                <motion.li key={item.label} className="relative">
                  <motion.div
                    className="group relative block overflow-visible rounded-xl"
                    style={{ perspective: '600px' }}
                    whileHover="hover"
                    initial="initial"
                  >
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-0"
                      variants={glowVariants}
                      style={{
                        background: item.gradient,
                        opacity: 0,
                        borderRadius: '12px',
                      }}
                    />
                    <motion.a
                      href={item.href}
                      className="relative z-10 flex items-center gap-2 rounded-xl bg-transparent px-3 py-2 text-sm text-muted-foreground transition-colors group-hover:text-foreground lg:px-4 lg:text-base"
                      variants={itemVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: 'preserve-3d',
                        transformOrigin: 'center bottom',
                      }}
                    >
                      <span
                        className={`transition-colors duration-300 group-hover:${item.iconColor} flex-shrink-0 text-foreground`}
                      >
                        <MyIcon name={item.icon} className="h-5 w-5" />
                      </span>
                      <span className="hidden lg:inline">{item.label}</span>
                    </motion.a>
                    <motion.a
                      href={item.href}
                      className="absolute inset-0 z-10 flex items-center gap-2 rounded-xl bg-transparent px-3 py-2 text-sm text-muted-foreground transition-colors group-hover:text-foreground lg:px-4 lg:text-base"
                      variants={backVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: 'preserve-3d',
                        transformOrigin: 'center top',
                        rotateX: 90,
                      }}
                    >
                      <span
                        className={`transition-colors duration-300 group-hover:${item.iconColor} flex-shrink-0 text-foreground`}
                      >
                        <MyIcon name={item.icon} className="h-5 w-5" />
                      </span>
                      <span className="hidden lg:inline">{item.label}</span>
                    </motion.a>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle - Always visible */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <motion.button
              className="rounded-lg p-2 text-foreground transition-colors hover:bg-accent md:hidden"
              onClick={handleMobileMenuToggle}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle mobile menu"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="absolute left-0 right-0 top-full z-50 border-b border-border/40 bg-background/95 shadow-lg backdrop-blur-lg md:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="space-y-2 px-4 py-6">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="relative"
                    variants={mobileItemVariants}
                    initial="closed"
                    animate="open"
                    custom={index}
                  >
                    <motion.div
                      className="group relative block overflow-visible rounded-xl"
                      style={{ perspective: '600px' }}
                      whileHover="hover"
                      initial="initial"
                    >
                      <motion.div
                        className="pointer-events-none absolute inset-0 z-0"
                        variants={glowVariants}
                        style={{
                          background: item.gradient,
                          opacity: 0,
                          borderRadius: '12px',
                        }}
                      />
                      <motion.a
                        href={item.href}
                        className="relative z-10 flex w-full items-center gap-3 rounded-xl bg-transparent px-4 py-3 text-base text-muted-foreground transition-colors group-hover:text-foreground"
                        variants={itemVariants}
                        transition={sharedTransition}
                        style={{
                          transformStyle: 'preserve-3d',
                          transformOrigin: 'center bottom',
                        }}
                        onClick={handleMobileMenuClose}
                      >
                        <span
                          className={`transition-colors duration-300 group-hover:${item.iconColor} flex-shrink-0 text-foreground`}
                        >
                          <MyIcon name={item.icon} className="h-5 w-5" />
                        </span>
                        <span>{item.label}</span>
                      </motion.a>
                      <motion.a
                        href={item.href}
                        className="absolute inset-0 z-10 flex w-full items-center gap-3 rounded-xl bg-transparent px-4 py-3 text-base text-muted-foreground transition-colors group-hover:text-foreground"
                        variants={backVariants}
                        transition={sharedTransition}
                        style={{
                          transformStyle: 'preserve-3d',
                          transformOrigin: 'center top',
                          rotateX: 90,
                        }}
                        onClick={handleMobileMenuClose}
                      >
                        <span
                          className={`transition-colors duration-300 group-hover:${item.iconColor} flex-shrink-0 text-foreground`}
                        >
                          <MyIcon name={item.icon} className="h-5 w-5" />
                        </span>
                        <span>{item.label}</span>
                      </motion.a>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleMobileMenuClose}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
```

```tsx
import { IconName } from '@/components/atoms/MyIcon/index.types';
export interface MenuItem {
  icon: IconName; // L'icona del componente (da Lucide React)
  label: string; // Il testo del link
  href: string; // Il link di destinazione (es. "#sezione" o "/pagina")
  gradient: string; // Il gradiente radiale per l'effetto glow
  iconColor: string; // La classe Tailwind per il colore dell'icona al passaggio del mouse
}
export const menuItems: MenuItem[] = [
  {
    icon: 'home',
    label: 'Home',
    href: '/',
    gradient:
      'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)',
    iconColor: 'text-blue-500',
  },
  {
    icon: 'users',
    label: 'Advisory Board',
    href: '/advisory-board',
    gradient:
      'radial-gradient(circle, rgba(139,69,19,0.15) 0%, rgba(120,53,15,0.06) 50%, rgba(101,45,13,0) 100%)',
    iconColor: 'text-amber-600',
  },
  {
    icon: 'building2',
    label: 'Companies',
    href: '/companies',
    gradient:
      'radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)',
    iconColor: 'text-green-500',
  },
  {
    icon: 'user-plus',
    label: 'Recruitment',
    href: '/recruitment',
    gradient:
      'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(147,51,234,0.06) 50%, rgba(126,34,206,0) 100%)',
    iconColor: 'text-purple-500',
  },
  {
    icon: 'briefcase',
    label: 'Portfolio',
    href: '#portfolio',
    gradient:
      'radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)',
    iconColor: 'text-orange-500',
  },
  {
    icon: 'message-circle-question',
    label: 'Faq',
    href: '/faq',
    gradient:
      'radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)',
    iconColor: 'text-red-500',
  },
];
```

```tsx
export default interface HeaderProps {}
```
