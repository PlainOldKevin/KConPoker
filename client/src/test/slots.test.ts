import { describe, expect, it } from "vitest";
import {
  ALL_SLOTS,
  BOARD_SLOTS,
  PLAYER_HAND_SLOT_PAIRS,
  PLAYER_HAND_SLOTS,
} from "../types/slots";

describe("slots model", () => {
  it("defines 8 players with 2 hand slots each", () => {
    expect(PLAYER_HAND_SLOT_PAIRS).toHaveLength(8);
    expect(PLAYER_HAND_SLOT_PAIRS.every((pair) => pair.length === 2)).toBe(
      true,
    );
    expect(PLAYER_HAND_SLOTS).toHaveLength(16);
  });

  it("defines board slots in flop/turn/river order", () => {
    expect(BOARD_SLOTS).toEqual([
      "board-1",
      "board-2",
      "board-3",
      "board-4",
      "board-5",
    ]);
  });

  it("contains every hand and board slot in ALL_SLOTS", () => {
    expect(ALL_SLOTS).toHaveLength(
      PLAYER_HAND_SLOTS.length + BOARD_SLOTS.length,
    );

    const all = new Set(ALL_SLOTS);
    PLAYER_HAND_SLOTS.forEach((slot) => expect(all.has(slot)).toBe(true));
    BOARD_SLOTS.forEach((slot) => expect(all.has(slot)).toBe(true));
  });
});
