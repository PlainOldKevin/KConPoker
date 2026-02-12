/* Odds contract file for valid requests/responses */
// Incoming player shape from frontend request payload
export interface PlayerInput {
  id: string;
  cards: string[];
}

// Request contract for odds evaluation endpoint
export interface OddsRequest {
  players: PlayerInput[];
  board: string[];
}

// Per-player odds data returned on successful evaluation
export interface PlayerOdds {
  id: string;
  cards: string[];
  equityPct: number;
  tiePct: number;
  winPct: number;
  handRank: string;
}

// Response contract used for both validation and successful calculations
export interface OddsResponse {
  status: "ready" | "invalid";
  canCalculate: boolean;
  reasons: string[];
  players: PlayerOdds[];
  board: string[];
}
