/* File to interpret the payload from the frontend */
import { CardGroup, OddsCalculator } from "poker-odds-calculator";
import type { OddsRequest, OddsResponse, PlayerOdds } from "../types/odds";

// Accepted card format from UI (e.g., Ah, 10d, Ks).
const VALID_CARD_PATTERN = /^(A|K|Q|J|10|[2-9])[shdc]$/;

// Convert frontend card IDs into calculator format (10 -> T, lowercase suit).
const normalizeCard = (card: string): string => {
  const rank = card.slice(0, -1);
  const suit = card.slice(-1).toLowerCase();
  const normalizedRank = rank === "10" ? "T" : rank;
  return `${normalizedRank}${suit}`;
};
