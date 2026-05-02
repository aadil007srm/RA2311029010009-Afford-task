// Frontend logger — sends logs to the evaluation server
// Always uses "frontend" as stack

import { CONFIG } from "./config";
import { getAuthToken } from "./auth";

type Level = "info" | "warn" | "error" | "fatal";
type FrontendPackage =
  | "api" | "component" | "hook" | "page" | "state" | "style"
  | "auth" | "config" | "middleware" | "utils";

export async function Log(level: Level, pkg: FrontendPackage, message: string): Promise<void> {
  try {
    const token = await getAuthToken();
    await fetch(`${CONFIG.BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stack: "frontend", level, package: pkg, message }),
    });
  } catch {
    // silently fail — don't break the UI over a logging failure
  }
}
