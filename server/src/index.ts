// Imports
import cors from "cors";
import express from "express";
import oddsRouter from "./routes/oddsRoutes";

// Main Express app instance.
const app = express();

// Server port can be overridden by environment
const port = Number(process.env.PORT ?? 3001);

// Middleware: allow cross-origin frontend calls + parse JSON request bodies
app.use(cors());
app.use(express.json());

// Lightweight health endpoint for local checks/deploy probes
app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

// Mount odds endpoints under /api/odds.
app.use("/api/odds", oddsRouter);

// Start listening for HTTP requests
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
