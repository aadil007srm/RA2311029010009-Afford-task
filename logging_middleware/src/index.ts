/**
 * Logging Middleware — Main Entry Point
 *
 * A reusable logging package that sends structured log entries
 * to the evaluation server. Designed to be consumed by both
 * backend and frontend applications.
 *
 * Usage:
 *   import { initLogger, Log } from "logging-middleware";
 *
 *   initLogger({ email, name, rollNo, accessCode, clientID, clientSecret });
 *   await Log("backend", "info", "handler", "Request received for /api/data");
 */

import { Stack, Level, Package, LoggerConfig, LogResponse } from "./types";
import { getAuthToken, clearAuthCache } from "./auth";

/** Base URL for the evaluation service */
const BASE_URL = "http://20.207.122.201/evaluation-service";

/** Internal logger configuration state */
let loggerConfig: LoggerConfig | null = null;

/** Whether the logger has been initialized */
let isInitialized = false;

/* ── Valid value sets for runtime validation ──────────────────────── */

const VALID_STACKS: ReadonlySet<string> = new Set(["backend", "frontend"]);

const VALID_LEVELS: ReadonlySet<string> = new Set([
  "info",
  "warn",
  "error",
  "fatal",
]);

const VALID_PACKAGES: ReadonlySet<string> = new Set([
  /* Backend-only */
  "cache", "controller", "cron job", "db", "domain",
  "handler", "repository", "route", "service",
  /* Frontend-only */
  "api", "component", "hook", "page", "state", "style",
  /* Shared */
  "auth", "config", "middleware", "utils",
]);

/**
 * Initializes the logger with the provided credentials.
 * Must be called before any `Log()` invocations.
 *
 * @param config - Client credentials for the evaluation server
 */
export function initLogger(config: LoggerConfig): void {
  if (!config.email || !config.clientID || !config.clientSecret) {
    throw new Error(
      "Logger initialization failed: email, clientID, and clientSecret are required."
    );
  }

  loggerConfig = { ...config };
  isInitialized = true;
}

/**
 * Sends a structured log entry to the evaluation server.
 *
 * @param stack   - The application layer: "backend" | "frontend"
 * @param level   - Severity level: "info" | "warn" | "error" | "fatal"
 * @param pkg     - The package/module originating the log
 * @param message - Descriptive log message with context
 * @returns The log response containing the generated logID
 *
 * @example
 * await Log("backend", "error", "handler", "received string, expected bool");
 * await Log("frontend", "info", "component", "NotificationCard rendered successfully");
 */
export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<LogResponse | null> {
  /* ── Guard: ensure logger is initialized ─────────────────────── */
  if (!isInitialized || !loggerConfig) {
    console.error(
      "[LoggingMiddleware] Logger not initialized. Call initLogger() first."
    );
    return null;
  }

  /* ── Runtime validation of parameters ────────────────────────── */
  if (!VALID_STACKS.has(stack)) {
    console.error(`[LoggingMiddleware] Invalid stack: "${stack}"`);
    return null;
  }
  if (!VALID_LEVELS.has(level)) {
    console.error(`[LoggingMiddleware] Invalid level: "${level}"`);
    return null;
  }
  if (!VALID_PACKAGES.has(pkg)) {
    console.error(`[LoggingMiddleware] Invalid package: "${pkg}"`);
    return null;
  }
  if (!message || message.trim().length === 0) {
    console.error("[LoggingMiddleware] Log message cannot be empty.");
    return null;
  }

  try {
    /* ── Obtain auth token (auto-cached & refreshed) ───────────── */
    const token = await getAuthToken(loggerConfig);

    /* ── Send log to evaluation server ─────────────────────────── */
    const response = await fetch(`${BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[LoggingMiddleware] Log API error (HTTP ${response.status}): ${errorText}`
      );
      return null;
    }

    const data = (await response.json()) as LogResponse;
    return data;
  } catch (error) {
    /* Avoid infinite loops — do not call Log() inside catch */
    console.error("[LoggingMiddleware] Failed to send log:", error);
    return null;
  }
}

/* ── Re-export types and utilities ─────────────────────────────── */
export { clearAuthCache } from "./auth";
export type {
  Stack,
  Level,
  Package,
  BackendPackage,
  FrontendPackage,
  SharedPackage,
  LoggerConfig,
  LogResponse,
  AuthResponse,
} from "./types";
