// Imports
import type { OddsRequest, OddsResponse } from "../types/odds";

// Frontend-configurable API host. Defaults to local backend for development
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

// Calls backend odds endpoint with the current table state
export const evaluateOdds = async (
  payload: OddsRequest,
): Promise<OddsResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/odds/evaluate`, {
    method: "POST",
    headers: {
      // Backend expects JSON body
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // Bubble up non-2xx responses to caller so UI can handle failure state
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Odds request failed (${response.status}). ${text}`);
  }

  // Response shape follows OddsResponse contract
  return (await response.json()) as OddsResponse;
};
