/**
 * Campus Notifications — Stage 1 Entry Point
 *
 * Fetches notifications from the evaluation server and displays
 * the top 10 most important notifications using the Priority Inbox
 * algorithm (min-heap with type weight + recency scoring).
 *
 * Usage:
 *   npm run dev
 *
 * Prerequisites:
 *   Update ../credentials.json with your registered credentials.
 */

import { initLogger, Log } from "logging-middleware";
import { CONFIG } from "./config";
import { fetchNotifications } from "./notifications";
import { getTopNNotifications, formatNotification } from "./priorityInbox";

/** Number of top priority notifications to display */
const TOP_N = 10;

/**
 * Main application entry point.
 * Orchestrates initialization, data fetching, and priority computation.
 */
async function main(): Promise<void> {
  /* ── Step 1: Initialize the logging middleware ───────────────── */
  try {
    initLogger(CONFIG);
    await Log("backend", "info", "config", "Logger initialized");
  } catch (error) {
    console.error("Failed to initialize logger:", error);
    process.exit(1);
  }

  console.log("╔══════════════════════════════════════════════════════════════════╗");
  console.log("║           Campus Notifications — Priority Inbox                 ║");
  console.log("╚══════════════════════════════════════════════════════════════════╝");
  console.log();

  /* ── Step 2: Fetch all notifications from the API ────────────── */
  let notifications;
  try {
    await Log("backend", "info", "handler", "Starting notification fetch");
    notifications = await fetchNotifications();
    console.log(`📥 Fetched ${notifications.length} notifications from the server.\n`);
  } catch (error) {
    await Log(
      "backend",
      "fatal",
      "handler",
      `Fetch crashed: ${String(error).slice(0, 30)}`
    );
    console.error("❌ Failed to fetch notifications:", error);
    process.exit(1);
  }

  /* ── Step 3: Display all fetched notifications ───────────────── */
  console.log("─── All Notifications ─────────────────────────────────────────────");
  console.log(`  Total: ${notifications.length}\n`);

  for (let i = 0; i < notifications.length; i++) {
    const n = notifications[i];
    console.log(`  ${i + 1}. [${n.Type}] ${n.Message} — ${n.Timestamp}`);
  }
  console.log();

  /* ── Step 4: Compute and display top-N priority notifications ── */
  console.log(`─── Top ${TOP_N} Priority Notifications ─────────────────────────────────`);
  console.log("  (Ranked by: Type Weight × 10 + Recency Score)\n");
  console.log("  Rank | Type       | Message                                  | Timestamp");
  console.log("  ─────┼────────────┼──────────────────────────────────────────┼──────────────────────");

  try {
    const topNotifications = await getTopNNotifications(notifications, TOP_N);

    for (let i = 0; i < topNotifications.length; i++) {
      console.log(formatNotification(topNotifications[i], i + 1));
    }

    await Log(
      "backend",
      "info",
      "handler",
      `Displayed top ${TOP_N} notifications`
    );
  } catch (error) {
    await Log(
      "backend",
      "error",
      "handler",
      `Priority compute failed`
    );
    console.error("❌ Failed to compute priority inbox:", error);
  }

  console.log();
  console.log("═══════════════════════════════════════════════════════════════════");
  console.log("  Priority Weight: Placement(30) > Result(20) > Event(10)");
  console.log("  + Recency bonus (0-10 based on timestamp)");
  console.log("═══════════════════════════════════════════════════════════════════");
}

/* ── Execute ──────────────────────────────────────────────────── */
main().catch(async (error) => {
  try {
    await Log("backend", "fatal", "handler", "Unhandled error in main");
  } catch {
    /* Silently fail — can't log if logger itself is broken */
  }
  console.error("Fatal error:", error);
  process.exit(1);
});
