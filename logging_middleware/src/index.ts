// Logging Middleware
// Sends structured logs to the evaluation server.
// Usage:
//   initLogger({ email, name, rollNo, accessCode, clientID, clientSecret });
//   await Log("backend", "info", "handler", "request processed");

import { Stack, Level, Package, LoggerConfig, LogResponse } from "./types";
import { getAuthToken, clearAuthCache } from "./auth";

const BASE_URL = "http://20.207.122.201/evaluation-service";

let loggerConfig: LoggerConfig | null = null;
let isInitialized = false;

// valid values for runtime checks
const VALID_STACKS = new Set(["backend", "frontend"]);
const VALID_LEVELS = new Set(["info", "warn", "error", "fatal"]);
const VALID_PACKAGES = new Set([
  "cache", "controller", "cron job", "db", "domain",
  "handler", "repository", "route", "service",
  "api", "component", "hook", "page", "state", "style",
  "auth", "config", "middleware", "utils",
]);

// Call this once at startup with your credentials
export function initLogger(config: LoggerConfig): void {
  if (!config.email || !config.clientID || !config.clientSecret) {
    throw new Error("Logger init failed: email, clientID, and clientSecret are required.");
  }
  loggerConfig = { ...config };
  isInitialized = true;
}

// Main logging function — sends a log entry to the server
export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<LogResponse | null> {
  if (!isInitialized || !loggerConfig) {
    console.error("[Logger] Not initialized. Call initLogger() first.");
    return null;
  }

  // quick validation before making the API call
  if (!VALID_STACKS.has(stack)) {
    console.error(`[Logger] Invalid stack: "${stack}"`);
    return null;
  }
  if (!VALID_LEVELS.has(level)) {
    console.error(`[Logger] Invalid level: "${level}"`);
    return null;
  }
  if (!VALID_PACKAGES.has(pkg)) {
    console.error(`[Logger] Invalid package: "${pkg}"`);
    return null;
  }
  if (!message || message.trim().length === 0) {
    console.error("[Logger] Message can't be empty.");
    return null;
  }

  try {
    const token = await getAuthToken(loggerConfig);

    const response = await fetch(`${BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Logger] API error (HTTP ${response.status}): ${errText}`);
      return null;
    }

    return (await response.json()) as LogResponse;
  } catch (error) {
    // don't call Log() here to avoid infinite recursion
    console.error("[Logger] Failed to send log:", error);
    return null;
  }
}

export { clearAuthCache } from "./auth";
export type {
  Stack, Level, Package,
  BackendPackage, FrontendPackage, SharedPackage,
  LoggerConfig, LogResponse, AuthResponse,
} from "./types";
