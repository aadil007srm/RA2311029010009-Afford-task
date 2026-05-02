/**
 * Authentication module for the Logging Middleware.
 * Handles obtaining and caching Bearer tokens from the evaluation server.
 */

import { LoggerConfig, AuthResponse } from "./types";

/** Base URL for the evaluation service */
const BASE_URL = "http://20.207.122.201/evaluation-service";

/** Cached auth token and its expiry timestamp */
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Obtains a Bearer token from the auth endpoint.
 * Caches the token and automatically refreshes it upon expiry.
 *
 * @param config - Logger configuration containing client credentials
 * @returns The Bearer access token string
 * @throws Error if authentication fails
 */
export async function getAuthToken(config: LoggerConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  /* Return cached token if still valid (with 60s buffer) */
  if (cachedToken && tokenExpiry > now + 60) {
    return cachedToken;
  }

  const requestBody = {
    email: config.email,
    name: config.name,
    rollNo: config.rollNo,
    accessCode: config.accessCode,
    clientID: config.clientID,
    clientSecret: config.clientSecret,
  };

  const response = await fetch(`${BASE_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Authentication failed (HTTP ${response.status}): ${errorText}`
    );
  }

  const data = (await response.json()) as AuthResponse;

  cachedToken = data.access_token;
  tokenExpiry = data.expires_in;

  return cachedToken;
}

/**
 * Clears the cached authentication token.
 * Useful for forcing re-authentication on the next log call.
 */
export function clearAuthCache(): void {
  cachedToken = null;
  tokenExpiry = 0;
}
