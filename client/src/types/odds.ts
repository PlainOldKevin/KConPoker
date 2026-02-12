/* Odds contract file for valid requests/responses */
import type { CardId } from "./cards";

// A single player's payload coming from the table state
export interface OddsRequestPlayer {
  id: string;
  cards: CardId[];
}

// Request sent from frontend -> backend
export interface OddsRequest {
  players: OddsRequestPlayer[];
  board: CardId[];
}

// Per-player odds result returned by backend
export interface PlayerOdds {
  id: string;
  cards: CardId[];
  equityPct: number;
  tiePct: number;
  winPct: number;
  handRank: string;
}

// Full backend response for odds evaluation attempt
export interface OddsResponse {
  status: "ready" | "invalid";
  canCalculate: boolean;
  reasons: string[];
  players: PlayerOdds[];
  board: CardId[];
}
