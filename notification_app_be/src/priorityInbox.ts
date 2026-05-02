/**
 * Priority Inbox — Core Business Logic
 *
 * Computes the top-N most important unread notifications
 * using a combination of type weight and recency.
 *
 * Priority Formula:
 *   score = (typeWeight * WEIGHT_FACTOR) + recencyScore
 *
 * Where:
 *   - typeWeight:    Placement=3, Result=2, Event=1
 *   - recencyScore:  Normalized timestamp value (0-10 scale)
 *   - WEIGHT_FACTOR: 10 — ensures type dominance while allowing
 *                    recency to differentiate within the same type
 *
 * Data Structure: Min-heap of size N for O(M log N) efficiency
 */

import { Notification, TYPE_WEIGHT, NotificationType } from "./notifications";
import { MinHeap } from "./priorityQueue";
import { Log } from "logging-middleware";

/** Weight multiplier — controls how much type weight influences the score */
const WEIGHT_FACTOR = 10;

/** Recency normalization range */
const RECENCY_MAX_SCORE = 10;

/**
 * Computes a priority score for a single notification.
 *
 * @param notification  - The notification to score
 * @param minTimestamp  - Earliest timestamp in the dataset (for normalization)
 * @param maxTimestamp  - Latest timestamp in the dataset (for normalization)
 * @returns Numeric priority score (higher = more important)
 */
function computePriorityScore(
  notification: Notification,
  minTimestamp: number,
  maxTimestamp: number
): number {
  const typeWeight = TYPE_WEIGHT[notification.Type] || 1;
  const timestamp = new Date(notification.Timestamp).getTime();

  /* Normalize recency to [0, RECENCY_MAX_SCORE] range */
  const timeRange = maxTimestamp - minTimestamp;
  const recencyScore =
    timeRange > 0
      ? ((timestamp - minTimestamp) / timeRange) * RECENCY_MAX_SCORE
      : RECENCY_MAX_SCORE;

  return typeWeight * WEIGHT_FACTOR + recencyScore;
}

/**
 * Finds the top-N highest priority notifications using a min-heap.
 *
 * Algorithm:
 *   1. Compute timestamp bounds for recency normalization.
 *   2. For each notification, calculate its priority score.
 *   3. Insert into a min-heap of capacity N.
 *   4. Extract sorted results (highest priority first).
 *
 * Time Complexity:  O(M log N) where M = total notifications
 * Space Complexity: O(N) for the heap
 *
 * @param notifications - Full list of notifications from the API
 * @param topN          - Number of top notifications to return (default: 10)
 * @returns Sorted array of the topN highest-priority notifications
 */
export async function getTopNNotifications(
  notifications: Notification[],
  topN: number = 10
): Promise<Notification[]> {
  await Log(
    "backend",
    "info",
    "service",
    `Computing top ${topN} from ${notifications.length}`
  );

  if (notifications.length === 0) {
    await Log("backend", "warn", "service", "No notifications to prioritize");
    return [];
  }

  /* ── Step 1: Compute timestamp bounds ────────────────────────── */
  let minTimestamp = Infinity;
  let maxTimestamp = -Infinity;

  for (const n of notifications) {
    const ts = new Date(n.Timestamp).getTime();
    if (ts < minTimestamp) minTimestamp = ts;
    if (ts > maxTimestamp) maxTimestamp = ts;
  }

  /* ── Step 2 & 3: Score each notification and insert into heap ── */
  const heap = new MinHeap<Notification>(topN);

  for (const notification of notifications) {
    const score = computePriorityScore(notification, minTimestamp, maxTimestamp);
    heap.insert(score, notification);
  }

  /* ── Step 4: Extract sorted results ──────────────────────────── */
  const topNotifications = heap.extractAllSorted();

  await Log(
    "backend",
    "info",
    "service",
    `Top ${topNotifications.length} selected`
  );

  return topNotifications.map((item) => item.data);
}

/**
 * Formats a notification for display output.
 *
 * @param notification - Notification to format
 * @param rank         - Display rank (1-based)
 * @returns Formatted string representation
 */
export function formatNotification(notification: Notification, rank: number): string {
  const typeLabel = notification.Type.padEnd(10);
  return (
    `  #${String(rank).padStart(2, "0")} | ` +
    `${typeLabel} | ` +
    `${notification.Message.padEnd(40)} | ` +
    `${notification.Timestamp}`
  );
}
