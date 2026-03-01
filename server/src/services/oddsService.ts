/* File to interpret the payload from the frontend.
   Basically this file just checks for payload validity and
   normalizes it for the frontend response (the UI is quite 
   structured in what can be sent to the backend, so it is mainly 
   for bug-catching, test inputs, and POSTs from alternate means 
   like Postman or REST client). */

/* An example (valid) JSON payload (OddsRequest) would be something like:
    {
        "players": [
            { "id": "player-1", "cards": ["Ah", "Kd"] },
            { "id": "player-2", "cards": ["Qc", "Qs"] }
        ],
    "board": ["2h", "7d", "Jc"]
    }
*/

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
//const roundPercentages = (value: number): number => Number(value.toFixed(2));

// Main function of this service file: validates request and computes odds/returns errors
export const evaluateOdds = (payload: OddsRequest): OddsResponse => {
  const reasons: string[] = [];

  // Payload shape guard
  if (!Array.isArray(payload.players) || !Array.isArray(payload.board)) {
    return {
      status: "invalid",
      canCalculate: false,
      reasons: ["Payload must include players[] and board[]."],
      players: [],
      board: [],
    };
  }

  // Separate players by hand completeness
  const completePlayers = payload.players.filter(
    (player) => player.cards.length === 2,
  );
  const incompletePlayers = payload.players.filter(
    (player) => player.cards.length === 1,
  );

  // Need at least two complete two-card hands to calculate odds
  if (completePlayers.length < 2) {
    reasons.push("At least two players with two cards each are required.");
  }

  // Prevent mixed complete/incomplete active seats
  if (incompletePlayers.length > 0) {
    reasons.push("Every active player must have exactly two cards.");
  }

  // Board states: preflop(0), flop(3), turn(4), river(5)
  if (![0, 3, 4, 5].includes(payload.board.length)) {
    reasons.push("Board must contain 0, 3, 4, or 5 cards.");
  }

  // Flatten all card strings so format + duplicate checks use one list
  const allCards = [
    ...completePlayers.flatMap((player) => player.cards),
    ...incompletePlayers.flatMap((player) => player.cards),
    ...payload.board,
  ];

  // Enforce card ID format for every card
  const invalidCards = allCards.filter((card) => !isValidCard(card));
  if (invalidCards.length > 0) {
    reasons.push(
      `Invalid card format: ${invalidCards.join(", ")}. Expected values like Ah, 10d, Ks.`,
    );
  }

  // Reject duplicate cards across players + board
  const normalizedCards = allCards.map((card) => normalizeCard(card));
  const uniqueCards = new Set(normalizedCards);
  if (uniqueCards.size !== normalizedCards.length) {
    reasons.push("Duplicate cards detected in players and/or board.");
  }

  // Return validation result when state is not calculation-ready
  if (reasons.length > 0) {
    return {
      status: "invalid",
      canCalculate: false,
      reasons,
      players: [],
      board: payload.board,
    };
  }

  // Convert each complete player hand to calculator CardGroup
  const playerGroups = completePlayers.map((player) =>
    CardGroup.fromString(
      player.cards.map((card) => normalizeCard(card)).join(""),
    ),
  );

  // Convert current board to calculator CardGroup
  const board = CardGroup.fromString(
    payload.board.map((card) => normalizeCard(card)).join(""),
  );

  // Run actual odds calculation
  const calculation = OddsCalculator.calculate(playerGroups, board);

  // Shape output for frontend consumption
  const players: PlayerOdds[] = completePlayers.map((player, index) => {
    const equity = calculation.equities[index].getEquity();
    const tie = calculation.equities[index].getTiePercentage();

    // Returns players array of PlayerOdds for final return statement
    return {
      id: player.id,
      cards: player.cards,
      equityPct: equity,
      tiePct: tie,
      winPct: equity,
      handRank: calculation.getHandRank(index).toString(),
    };
  });

  // Return statement for valid request
  return {
    status: "ready",
    canCalculate: true,
    reasons: [],
    players,
    board: payload.board,
  };
};
