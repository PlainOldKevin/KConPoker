/* Util file to define all the possible slot types for cards to be in. 
   Used for rendering on the table as well as backend communication for odds calculation */

/* Slot pairs, used for keeping track of cards in a specific player's hand. 
   Grouped by player for two-card hand logic (auto-advance, etc.) */
export const PLAYER_HAND_SLOT_PAIRS = [
  ["player-1-1", "player-1-2"],
  ["player-2-1", "player-2-2"],
  ["player-3-1", "player-3-2"],
  ["player-4-1", "player-4-2"],
  ["player-5-1", "player-5-2"],
  ["player-6-1", "player-6-2"],
  ["player-7-1", "player-7-2"],
  ["player-8-1", "player-8-2"],
] as const;

/* All possible player hand slots. Used for data validation:
  (Are there enough cards in play to run a calculation?) */
export const PLAYER_HAND_SLOTS = [
  "player-1-1",
  "player-1-2",
  "player-2-1",
  "player-2-2",
  "player-3-1",
  "player-3-2",
  "player-4-1",
  "player-4-2",
  "player-5-1",
  "player-5-2",
  "player-6-1",
  "player-6-2",
  "player-7-1",
  "player-7-2",
  "player-8-1",
  "player-8-2",
] as const;

// Exported type of any player hand slot
export type PlayerHandSlot = (typeof PLAYER_HAND_SLOTS)[number];

// Union of all board card slots to track cards on the board
export const BOARD_SLOTS = [
  "board-1",
  "board-2",
  "board-3",
  "board-4",
  "board-5",
] as const;

// Union type for any single board slot
export type BoardSlot = (typeof BOARD_SLOTS)[number];

// Union of all slots across player hands + board
export const ALL_SLOTS = [...PLAYER_HAND_SLOTS, ...BOARD_SLOTS] as const;

// Exported type of any globally-accessible slot (read-only tuple that can be indexed by number)
export type SlotId = (typeof ALL_SLOTS)[number];
