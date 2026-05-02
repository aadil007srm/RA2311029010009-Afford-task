/**
 * Priority Inbox utility for the frontend.
 * Computes top-N priority notifications using a min-heap.
 */

import { Notification, TYPE_WEIGHT } from "./types";

/** Weight multiplier for type-based scoring */
const WEIGHT_FACTOR = 10;
/** Maximum recency score */
const RECENCY_MAX_SCORE = 10;

/** Min-heap item */
interface HeapItem {
  score: number;
  data: Notification;
}

/**
 * Min-heap implementation for efficient top-N extraction.
 */
class MinHeap {
  private heap: HeapItem[] = [];
  private readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  insert(score: number, data: Notification): void {
    if (this.heap.length < this.capacity) {
      this.heap.push({ score, data });
      this.bubbleUp(this.heap.length - 1);
    } else if (score > this.heap[0].score) {
      this.heap[0] = { score, data };
      this.sinkDown(0);
    }
  }

  extractAllSorted(): HeapItem[] {
    const result: HeapItem[] = [];
    while (this.heap.length > 0) {
      result.push(this.heap[0]);
      const last = this.heap.pop()!;
      if (this.heap.length > 0) {
        this.heap[0] = last;
        this.sinkDown(0);
      }
    }
    return result.reverse();
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent].score <= this.heap[index].score) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  private sinkDown(index: number): void {
    const len = this.heap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      if (left < len && this.heap[left].score < this.heap[smallest].score) smallest = left;
      if (right < len && this.heap[right].score < this.heap[smallest].score) smallest = right;
      if (smallest === index) break;
      [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
      index = smallest;
    }
  }
}

/**
 * Computes the top-N priority notifications.
 *
 * @param notifications - All notifications
 * @param topN - Number of top notifications to return
 * @returns Sorted array of top-N notifications (highest priority first)
 */
export function getTopNNotifications(
  notifications: Notification[],
  topN: number = 10
): Notification[] {
  if (notifications.length === 0) return [];

  /* Compute timestamp bounds */
  let minTs = Infinity;
  let maxTs = -Infinity;
  for (const n of notifications) {
    const ts = new Date(n.Timestamp).getTime();
    if (ts < minTs) minTs = ts;
    if (ts > maxTs) maxTs = ts;
  }

  const heap = new MinHeap(topN);
  const timeRange = maxTs - minTs;

  for (const n of notifications) {
    const typeWeight = TYPE_WEIGHT[n.Type] || 1;
    const ts = new Date(n.Timestamp).getTime();
    const recencyScore = timeRange > 0
      ? ((ts - minTs) / timeRange) * RECENCY_MAX_SCORE
      : RECENCY_MAX_SCORE;

    const score = typeWeight * WEIGHT_FACTOR + recencyScore;
    heap.insert(score, n);
  }

  return heap.extractAllSorted().map((item) => item.data);
}
