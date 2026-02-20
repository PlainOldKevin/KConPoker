import assert from "node:assert/strict";
import test from "node:test";
import { evaluateOdds } from "../services/oddsService";

// Validation: at least two fully-dealt hands are required for odds calculation
test("evaluateOdds returns invalid when fewer than two complete players", () => {
  const result = evaluateOdds({
    players: [{ id: "player-1", cards: ["Ah", "Kd"] }],
    board: [],
  });

  assert.equal(result.canCalculate, false);
  assert.equal(result.status, "invalid");
  assert.match(result.reasons.join(" "), /At least two players/);
});

// Validation: duplicate cards across hands/board must be rejected
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

// A normal preflop setup should produce a ready response with player odds
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

// Identical pocket pairs should be symmetric and non-zero for outright wins
test("evaluateOdds gives both players non-zero and equal win chance for identical pocket pairs", () => {
  const result = evaluateOdds({
    players: [
      { id: "player-1", cards: ["Ah", "Ad"] },
      { id: "player-2", cards: ["As", "Ac"] },
    ],
    board: [],
  });

  assert.equal(result.status, "ready");
  assert.equal(result.canCalculate, true);
  assert.equal(result.players.length, 2);

  const [hero, villain] = result.players;
  assert.ok(hero.winPct > 0);
  assert.equal(hero.winPct, villain.winPct);
  assert.equal(hero.tiePct, villain.tiePct);
});

// Board alone determines a 100% split pot for all players
test("evaluateOdds returns exact split-pot percentages on a locked river board", () => {
  const result = evaluateOdds({
    players: [
      { id: "player-1", cards: ["2c", "3d"] },
      { id: "player-2", cards: ["4h", "5s"] },
    ],
    board: ["Ah", "Kh", "Qh", "Jh", "10h"],
  });

  assert.equal(result.status, "ready");
  assert.equal(result.canCalculate, true);

  for (const player of result.players) {
    assert.equal(player.tiePct, 100);
    assert.equal(player.equityPct, 0);
    assert.equal(player.winPct, 0);
  }
});

// Monte Carlo sanity check: tie-heavy equivalent pairs should remain within stable bounds
test("evaluateOdds keeps equivalent pocket-pair preflop percentages in realistic bounds", () => {
  const result = evaluateOdds({
    players: [
      { id: "player-1", cards: ["Ah", "Ad"] },
      { id: "player-2", cards: ["As", "Ac"] },
    ],
    board: [],
  });

  assert.equal(result.status, "ready");
  assert.equal(result.canCalculate, true);

  for (const player of result.players) {
    assert.ok(player.tiePct >= 90);
    assert.ok(player.tiePct <= 99);
    assert.ok(player.equityPct >= 1);
    assert.ok(player.equityPct <= 10);
  }
});
