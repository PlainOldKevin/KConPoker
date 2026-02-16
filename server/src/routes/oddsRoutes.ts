// Imports
import { Router } from "express";
import { evaluateOdds } from "../services/oddsService";
import type { OddsRequest } from "../types/odds";

// Router dedicated to poker odds endpoints.
const oddsRouter = Router();

// Evaluate current table state and return either validation reasons or odds
oddsRouter.post("/evaluate", (req, res) => {
  const payload = req.body as OddsRequest;

  const response = evaluateOdds(payload);

  /* Intentionally returning 200 for both ready/invalid states so the frontend
     can treat this as normal domain validation instead of transport failure */
  return res.status(200).json(response);
});

export default oddsRouter;
