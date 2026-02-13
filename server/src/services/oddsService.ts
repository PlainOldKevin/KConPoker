/* File to interpret the payload from the frontend.
   Basically this file just checks for payload validity and
   normalizes it for the frontend response (the UI is quite 
   structured in what can be sent to the backend, so it is mainly 
   for bug-catching, test inputs, and POSTs from alternate means 
   like Postman or REST client). */

// Imports
import { CardGroup, OddsCalculator } from "poker-odds-calculator";
import type { OddsRequest, OddsResponse, PlayerOdds } from "../types/odds";

// Accepted card format from UI (Ah, 10d, Ks, etc)
const VALID_CARD_PATTERN = /^(A|K|Q|J|10|[2-9])[shdc]$/;

// Convert frontend card IDs into calculator format (10 -> T, lowercase suit)
const normalizeCard = (card: string): string => {
  const rank = card.slice(0, -1);
  const suit = card.slice(-1).toLowerCase();
  const normalizedRank = rank === "10" ? "T" : rank;
  return `${normalizedRank}${suit}`;
};

// Validate incoming card string
const isValidCard = (card: string): boolean => VALID_CARD_PATTERN.test(card);

// Numeric output for UI percentages
const roundPercentages = (value: number): number => Number(value.toFixed(2));

// Main function of this service file: validates request and computes odds/returns errors
// export const evaluateOdds = (payload: OddsRequest): OddsResponse => {};
