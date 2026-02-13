import assert from "node:assert/strict";
import test from "node:test";
import { evaluateOdds } from "../services/oddsService";

test("evaluateOdds returns invalid when fewer than two complete players", () => {
  const result = evaluateOdds({
    players: [{ id: "player-1", cards: ["Ah", "Kd"] }],
    board: [],
  });

  assert.equal(result.canCalculate, false);
  assert.equal(result.status, "invalid");
  assert.match(result.reasons.join(" "), /At least two players/);
});

test("evaluateOdds returns invalid when duplicate cards are present", () => {
  const result = evaluateOdds({
    players: [
      { id: "player-1", cards: ["Ah", "Kd"] },
      { id: "player-2", cards: ["Ah", "Qs"] },
    ],
    board: [],
  });

  assert.equal(result.canCalculate, false);
  assert.match(result.reasons.join(" "), /Duplicate cards/);
});

test("evaluateOdds returns ready for a valid preflop request", () => {
  const result = evaluateOdds({
    players: [
      { id: "player-1", cards: ["Ah", "Kd"] },
      { id: "player-2", cards: ["Qc", "Qs"] },
    ],
    board: [],
  });

  assert.equal(result.canCalculate, true);
  assert.equal(result.status, "ready");
  assert.equal(result.players.length, 2);
  assert.equal(result.players[0].id, "player-1");
  assert.ok(typeof result.players[0].equityPct === "number");
});
