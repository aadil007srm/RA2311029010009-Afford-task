// Handles getting auth tokens from the evaluation server
// Tokens are cached and refreshed automatically when they expire

import { LoggerConfig, AuthResponse } from "./types";

const BASE_URL = "http://20.207.122.201/evaluation-service";

let cachedToken: string | null = null;
let tokenExpiry = 0;

// Gets a bearer token, caching it until it expires
export async function getAuthToken(config: LoggerConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // reuse cached token if it's still valid (with a 60s safety margin)
  if (cachedToken && tokenExpiry > now + 60) {
    return cachedToken;
  }

  const response = await fetch(`${BASE_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: config.email,
      name: config.name,
      rollNo: config.rollNo,
      accessCode: config.accessCode,
      clientID: config.clientID,
      clientSecret: config.clientSecret,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Authentication failed (HTTP ${response.status}): ${errText}`);
  }

  const data = (await response.json()) as AuthResponse;
  cachedToken = data.access_token;
  tokenExpiry = data.expires_in;

  return cachedToken;
}

// Wipes the cached token so the next call re-authenticates
export function clearAuthCache(): void {
  cachedToken = null;
  tokenExpiry = 0;
}
