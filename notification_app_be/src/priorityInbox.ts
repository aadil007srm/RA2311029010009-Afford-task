// Priority inbox logic
// Scores notifications using: score = (typeWeight * 10) + recencyScore
// Then uses a min-heap to efficiently grab the top N

import { Notification, TYPE_WEIGHT, NotificationType } from "./notifications";
import { MinHeap } from "./priorityQueue";
import { Log } from "logging-middleware";

const WEIGHT_FACTOR = 10;
const RECENCY_MAX = 10;

function computeScore(n: Notification, minTs: number, maxTs: number): number {
  const weight = TYPE_WEIGHT[n.Type] || 1;
  const ts = new Date(n.Timestamp).getTime();

  // normalize recency to 0-10 range
  const range = maxTs - minTs;
  const recency = range > 0 ? ((ts - minTs) / range) * RECENCY_MAX : RECENCY_MAX;

  return weight * WEIGHT_FACTOR + recency;
}

// returns the top N notifications sorted by priority (highest first)
export async function getTopNNotifications(
  notifications: Notification[],
  topN: number = 10
): Promise<Notification[]> {
  await Log("backend", "info", "service", `Computing top ${topN} from ${notifications.length}`);

  if (notifications.length === 0) {
    await Log("backend", "warn", "service", "No notifications to prioritize");
    return [];
  }

  // find the time range for normalization
  let minTs = Infinity;
  let maxTs = -Infinity;
  for (const n of notifications) {
    const ts = new Date(n.Timestamp).getTime();
    if (ts < minTs) minTs = ts;
    if (ts > maxTs) maxTs = ts;
  }

  // feed everything into the heap — it keeps only the top N
  const heap = new MinHeap<Notification>(topN);
  for (const n of notifications) {
    heap.insert(computeScore(n, minTs, maxTs), n);
  }

  const results = heap.extractAllSorted();
  await Log("backend", "info", "service", `Top ${results.length} selected`);

  return results.map((item) => item.data);
}

// formats a notification for console output
export function formatNotification(n: Notification, rank: number): string {
  const type = n.Type.padEnd(10);
  return `  #${String(rank).padStart(2, "0")} | ${type} | ${n.Message.padEnd(40)} | ${n.Timestamp}`;
}
