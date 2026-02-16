import assert from "node:assert/strict";
import { AddressInfo } from "node:net";
import test from "node:test";
import express from "express";
import oddsRouter from "../routes/oddsRoutes";

const startTestServer = async () => {
  const app = express();
  app.use(express.json());
  app.use("/api/odds", oddsRouter);

  const server = await new Promise<import("node:http").Server>((resolve) => {
    const started = app.listen(0, () => resolve(started));
  });

  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  return {
    baseUrl,
    close: async () => {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    },
  };
};

test("POST /api/odds/evaluate returns 200 + canCalculate false for invalid payload", async () => {
  const server = await startTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/api/odds/evaluate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        players: [{ id: "player-1", cards: ["Ah", "Kd"] }],
        board: [],
      }),
    });

    assert.equal(response.status, 200);

    const payload = (await response.json()) as {
      canCalculate: boolean;
      status: string;
      reasons: string[];
    };

    assert.equal(payload.canCalculate, false);
    assert.equal(payload.status, "invalid");
    assert.match(payload.reasons.join(" "), /At least two players/);
  } finally {
    await server.close();
  }
});

test("POST /api/odds/evaluate returns 200 + ready for valid request", async () => {
  const server = await startTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/api/odds/evaluate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        players: [
          { id: "player-1", cards: ["Ah", "Kd"] },
          { id: "player-2", cards: ["Qc", "Qs"] },
        ],
        board: [],
      }),
    });

    assert.equal(response.status, 200);

    const payload = (await response.json()) as {
      canCalculate: boolean;
      status: string;
      players: Array<{ id: string }>;
    };

    assert.equal(payload.canCalculate, true);
    assert.equal(payload.status, "ready");
    assert.equal(payload.players.length, 2);
  } finally {
    await server.close();
  }
});
