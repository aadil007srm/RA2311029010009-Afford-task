// Main entry point — fetches notifications and shows the top 10
// Run with: npm run dev

import { initLogger, Log } from "logging-middleware";
import { CONFIG } from "./config";
import { fetchNotifications } from "./notifications";
import { getTopNNotifications, formatNotification } from "./priorityInbox";

const TOP_N = 10;

async function main() {
  // set up the logger first
  try {
    initLogger(CONFIG);
    await Log("backend", "info", "config", "Logger initialized");
  } catch (err) {
    console.error("Failed to initialize logger:", err);
    process.exit(1);
  }

  console.log("╔══════════════════════════════════════════════════════════════════╗");
  console.log("║           Campus Notifications — Priority Inbox                 ║");
  console.log("╚══════════════════════════════════════════════════════════════════╝\n");

  // grab all notifications from the API
  let notifications;
  try {
    await Log("backend", "info", "handler", "Starting notification fetch");
    notifications = await fetchNotifications();
    console.log(`📥 Fetched ${notifications.length} notifications from the server.\n`);
  } catch (err) {
    await Log("backend", "fatal", "handler", `Fetch crashed: ${String(err).slice(0, 30)}`);
    console.error("❌ Failed to fetch notifications:", err);
    process.exit(1);
  }

  // show all notifications
  console.log("─── All Notifications ─────────────────────────────────────────────");
  console.log(`  Total: ${notifications.length}\n`);
  notifications.forEach((n, i) => {
    console.log(`  ${i + 1}. [${n.Type}] ${n.Message} — ${n.Timestamp}`);
  });
  console.log();

  // compute and show the top 10
  console.log(`─── Top ${TOP_N} Priority Notifications ─────────────────────────────────`);
  console.log("  (Ranked by: Type Weight × 10 + Recency Score)\n");
  console.log("  Rank | Type       | Message                                  | Timestamp");
  console.log("  ─────┼────────────┼──────────────────────────────────────────┼──────────────────────");

  try {
    const top = await getTopNNotifications(notifications, TOP_N);
    top.forEach((n, i) => console.log(formatNotification(n, i + 1)));
    await Log("backend", "info", "handler", `Displayed top ${TOP_N} notifications`);
  } catch (err) {
    await Log("backend", "error", "handler", "Priority compute failed");
    console.error("❌ Failed to compute priority inbox:", err);
  }

  console.log("\n═══════════════════════════════════════════════════════════════════");
  console.log("  Priority Weight: Placement(30) > Result(20) > Event(10)");
  console.log("  + Recency bonus (0-10 based on timestamp)");
  console.log("═══════════════════════════════════════════════════════════════════");
}

main().catch(async (err) => {
  try {
    await Log("backend", "fatal", "handler", "Unhandled error in main");
  } catch { /* can't log if the logger itself is broken */ }
  console.error("Fatal error:", err);
  process.exit(1);
});
