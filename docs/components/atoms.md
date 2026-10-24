# Atomi (Atoms)

Gli **Atomi** sono gli elementi base indivisibili dell'interfaccia utente. Non contengono logica di business e dipendono unicamente dalle `props` ricevute dal genitore.

---

## 1. `Button` ([`components/atoms/index.tsx`](../../components/atoms/index.tsx))

Wrapper stilizzato sul componente `Button` fornito dalla libreria Shadcn UI.

### **Responsabilità**:
- Fornisce lo stile visivo dei pulsanti nell'applicazione.
- Supporta diverse varianti di stile (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`) e dimensioni (`default`, `sm`, `lg`, `icon`).
- Fornisce feedback visivo per le interazioni (*hover*, *active*, *disabled*).

---

## 2. `Input` ([`components/atoms/index.tsx`](../../components/atoms/index.tsx))

Campo di testo nativo HTML racchiuso in classi Tailwind unificate.

### **Responsabilità**:
- Gestisce la cattura dell'input testuale dell'utente.
- Applica lo stile visivo per il bordo (`border-input`), il focus (`focus-visible:ring-2`) e la disabilitazione.

---

## 3. `Badge` ([`components/atoms/index.tsx`](../../components/atoms/index.tsx))

Etichetta o pillola di testo compatta.

### **Responsabilità**:
- Evidenziare stati secondari, come il 1° posto in classifica o il codice identificativo del gioco (es. `KR`, `MZ`, `CH`).

---

## 4. `Avatar` ([`components/atoms/index.tsx`](../../components/atoms/index.tsx))

Componente per la visualizzazione dell'immagine di profilo o delle iniziali dell'utente.

### **Responsabilità**:
- Se l'utente dispone di un'URL immagine (es. da Google OAuth), la visualizza all'interno di un contenitore circolare.
- In caso contrario, genera un fallback visivo con le sue iniziali (es. "SB") su sfondo colorato.

---

## 5. `ThemeProvider` ([`components/atoms/ThemeProvider.tsx`](../../components/atoms/ThemeProvider.tsx))

Provider per il tema grafico basato sulla libreria `next-themes`.

### **Responsabilità**:
- Gestisce il cambio dinamico della modalità scura (*Dark Mode*) e chiara (*Light Mode*) tramite la classe `dark` applicata al tag `<html>`.

---

## 6. `Providers` ([`components/atoms/Providers.tsx`](../../components/atoms/Providers.tsx))

Wrapper per il `SessionProvider` di NextAuth.

### **Responsabilità**:
- Mantiene sincronizzato lo stato dell'autenticazione utente su tutti i componenti client dell'applicazione.
