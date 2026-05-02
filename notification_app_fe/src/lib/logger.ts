/**
 * Frontend Logging Middleware Integration.
 *
 * Provides a Log function that sends structured log entries to the
 * evaluation server. This is the frontend equivalent of the reusable
 * logging-middleware package, adapted for browser environments.
 */

import { CONFIG } from "./config";
import { getAuthToken } from "./auth";

/** Valid log severity levels */
type Level = "info" | "warn" | "error" | "fatal";

/** Valid frontend package names */
type FrontendPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style"
  | "auth"
  | "config"
  | "middleware"
  | "utils";

/**
 * Sends a structured log entry to the evaluation server.
 * Always uses "frontend" as the stack value.
 *
 * @param level   - Severity: "info" | "warn" | "error" | "fatal"
 * @param pkg     - The originating package/module
 * @param message - Descriptive log message
 */
export async function Log(
  level: Level,
  pkg: FrontendPackage,
  message: string
): Promise<void> {
  try {
    const token = await getAuthToken();

    await fetch(`${CONFIG.BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack: "frontend",
        level,
        package: pkg,
        message,
      }),
    });
  } catch (error) {
    /* Silently fail — do not disrupt the user experience for logging failures */
    console.error("[Logger] Failed to send log:", error);
  }
}
