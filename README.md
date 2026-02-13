# Poker Odds Calculator

A web app that lets users input hole cards and community cards in Texas Hold’em, and calculates win/tie/lose probabilities for each player.

## 🚀 Features

- Interactive UI to select cards from a standard 52-card deck
- Add/remove up to 8 players
- Input community cards (Flop, Turn, River)
- Calculate real-time win/tie odds using backend logic
- Responsive design for desktop

## 🛠️ Tech Stack

**Frontend:**

- React + TypeScript + Vite

**Backend:**

- Node.js + Express + TypeScript
- `poker-odds-calculator` package

**Other Tools:**

- Git + GitHub

## 📁 Project Organization

```text
client/
  src/
    components/       # UI building blocks
    services/oddsApi  # HTTP calls to backend odds endpoints
    types/            # Shared front-end type definitions

server/
  src/
    index.ts          # Express entrypoint
    routes/oddsRoutes # API route wiring
    services/         # Odds + validation logic
    types/            # Request/response contracts
```

## 🔌 Backend API

### `POST /api/odds/evaluate`

The frontend sends the current table state:

```json
{
  "players": [
    { "id": "player-1", "cards": ["Ah", "Kd"] },
    { "id": "player-2", "cards": ["Qc", "Qs"] }
  ],
  "board": ["2h", "7d", "Jc"]
}
```

The backend validates whether the state can be calculated yet.

- **`canCalculate: false`**: returns validation reasons (not enough complete hands, invalid board size, duplicate cards, etc.)
- **`canCalculate: true`**: returns per-player equity/win/tie percentages and current hand rank snapshots

## ▶️ Run Locally

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

By default the frontend calls `http://localhost:3001`. Override with `VITE_API_BASE_URL` if needed.

## 📸 Screenshots

_(Coming soon)_
