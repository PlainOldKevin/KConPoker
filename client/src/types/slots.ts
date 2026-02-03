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

export type PlayerHandSlot = (typeof PLAYER_HAND_SLOTS)[number];
export const BOARD_SLOTS = [
  "board-1",
  "board-2",
  "board-3",
  "board-4",
  "board-5",
] as const;

export const ALL_SLOTS = [...PLAYER_HAND_SLOTS, ...BOARD_SLOTS] as const;

export type SlotId = (typeof ALL_SLOTS)[number];
