# Registro delle API REST (API Reference)

Questo documento fornisce la specifica tecnica di tutti gli endpoint API
dell'applicazione **Who Is Losing Today**.

---

## 1. `GET /api/dashboard`

Recupera lo stato aggregato del database per alimentare la Dashboard principale.

- **URL**: `/api/dashboard`
- **Metodo HTTP**: `GET`
- **Query Parameters**:

* `date` _(opzionale)_: Data di riferimento in formato ISO `YYYY-MM-DD` (es.
  `2026-10-03`). Se omesso, utilizza la data odierna.

### **Risposta di Esempio (`200 OK`)**:

```json
{
 "players": [
 {
 "id": "cm8...1",
 "name": "Sara Bianchi",
 "initials": "SB",
 "color": "bg-chart-1",
 "scores": { "Krilion": 92, "Metazooa": 3, "Chronophoto": 3129 },
 "streak": 12,
 "played": 54
 }
 ],
 "groupTrend": {
 "Totale": [
 { "day": "12 mar", "Sara Bianchi": 84, "Marco Rossi": 78 }
 ],
 "Krilion": [...],
 "Metazooa": [...],
 "Chronophoto": [...]
 },
 "dailySummary": {
 "ranked": [
 { "id": "cm8...1", "name": "Sara Bianchi", "overallScore": 91 }
 ],
 "winner": { "name": "Sara Bianchi", "overallScore": 91 },
 "loser": { "name": "Luca De Angelis", "overallScore": 65 }
 },
 "source": "database"
}
```

---

## 2. `POST /api/scores`

Registra o aggiorna un nuovo punteggio quotidiano per un utente ed un gioco.

- **URL**: `/api/scores`
- **Metodo HTTP**: `POST`
- **Header**: `Content-Type: application/json`

### **Body della Richiesta**:

```json
{
  "game": "Krilion",
  "score": 92,
  "text": "Ho fatto 92 in Krilion!",
  "userEmail": "sara@example.com"
}
```

### **Risposta di Esempio (`201 Created`)**:

```json
{
  "score": {
    "id": "cm8...9",
    "userId": "cm8...1",
    "gameId": "Krilion",
    "rawScore": 92,
    "normalizedScore": 92,
    "scoreDate": "2026-10-03T00:00:00.000Z",
    "rawInputText": "Ho fatto 92 in Krilion!",
    "createdAt": "2026-10-03T17:12:00.000Z"
  },
  "user": "Sara Bianchi",
  "source": "database"
}
```

---

## 3. `GET /api/scores`

Recupera gli ultimi punteggi salvati a livello globale per il feed dello
storico.

- **URL**: `/api/scores`
- **Metodo HTTP**: `GET`
- **Risposta di Esempio (`200 OK`)**:

```json
{
  "scores": [
    {
      "id": "cm8...9",
      "rawScore": 92,
      "scoreDate": "2026-10-03T00:00:00.000Z",
      "user": {
        "name": "Sara Bianchi",
        "initials": "SB",
        "color": "bg-chart-1"
      },
      "game": { "name": "Krilion", "unit": "pts" }
    }
  ],
  "source": "database"
}
```

---

## 4. `GET/POST /api/auth/[...nextauth]`

Gestisce il ciclo di vita delle sessioni utente e le rotte di callback per
l'autenticazione federata.

- **Endpoints Gestiti Automaticamente**:

* `GET /api/auth/signin`: Pagina/flusso di login.
* `POST /api/auth/signin/google`: Avvia il flusso OAuth 2.0 verso Google.
* `GET /api/auth/callback/google`: Endpoint di callback dove Google invia
  l'Authorization Code.
* `POST /api/auth/signout`: Distrugge il cookie di sessione.
* `GET /api/auth/session`: Restituisce il profilo dell'utente loggato in formato
  JSON.
