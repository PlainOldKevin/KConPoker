// Util file that assigns ranks and suits to cards for frontend rendering and backend communication

// Ranks, suits, cardID
export type Rank =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "10"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";
export type Suit = "s" | "h" | "d" | "c"; // spade, heart, diamond, club
export type CardId = `${Rank}${Suit}`;

export const RANKS: Rank[] = [
  "A",
  "K",
  "Q",
  "J",
  "10",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];
export const SUITS: Suit[] = ["h", "d", "c", "s"];

// Export the label for external use
export const label = (id: CardId) => {
  const suit = id.slice(-1);
  const rank = id.slice(0, -1);
  const suitChar =
    suit === "h" ? "♥" : suit === "d" ? "♦" : suit === "c" ? "♣" : "♠";
  return `${rank}${suitChar}`;
};
