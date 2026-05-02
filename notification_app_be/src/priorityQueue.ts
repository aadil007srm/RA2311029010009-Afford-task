/**
 * MinHeap implementation for efficient Top-N Priority Inbox.
 *
 * Uses a min-heap of fixed size N so that:
 *  - We always keep the N highest-priority notifications.
 *  - Insertion is O(log N) per notification.
 *  - Overall complexity for M notifications is O(M log N).
 *
 * This is significantly more efficient than sorting all M notifications
 * (which would be O(M log M)) when M >> N.
 */

export interface HeapItem<T> {
  score: number;
  data: T;
}

/**
 * A generic min-heap with a configurable maximum capacity.
 * When the heap reaches capacity, new items replace the minimum
 * only if they have a higher score — ensuring the heap always
 * contains the top-N highest-scoring items.
 */
export class MinHeap<T> {
  private heap: HeapItem<T>[] = [];
  private readonly capacity: number;

  constructor(capacity: number) {
    if (capacity < 1) {
      throw new Error("Heap capacity must be at least 1.");
    }
    this.capacity = capacity;
  }

  /** Current number of items in the heap */
  get size(): number {
    return this.heap.length;
  }

  /**
   * Inserts an item into the heap.
   * If at capacity, only inserts if the item's score exceeds the current minimum.
   *
   * @param score - Priority score (higher = more important)
   * @param data  - The associated data payload
   */
  insert(score: number, data: T): void {
    if (this.heap.length < this.capacity) {
      this.heap.push({ score, data });
      this.bubbleUp(this.heap.length - 1);
    } else if (score > this.heap[0].score) {
      /* Replace the root (minimum) with the new, higher-scoring item */
      this.heap[0] = { score, data };
      this.sinkDown(0);
    }
  }

  /**
   * Extracts all items from the heap, sorted by score descending.
   * This empties the heap.
   *
   * @returns Array of items sorted from highest to lowest score
   */
  extractAllSorted(): HeapItem<T>[] {
    const result: HeapItem<T>[] = [];

    while (this.heap.length > 0) {
      result.push(this.heap[0]);

      const last = this.heap.pop()!;
      if (this.heap.length > 0) {
        this.heap[0] = last;
        this.sinkDown(0);
      }
    }

    /* Reverse because we extracted minimums first; we want descending order */
    return result.reverse();
  }

  /**
   * Returns a copy of all items sorted by score descending,
   * without modifying the heap.
   */
  peekAllSorted(): HeapItem<T>[] {
    return [...this.heap]
      .sort((a, b) => b.score - a.score);
  }

  /* ── Internal heap operations ───────────────────────────────── */

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      if (this.heap[parentIdx].score <= this.heap[index].score) break;

      [this.heap[parentIdx], this.heap[index]] = [this.heap[index], this.heap[parentIdx]];
      index = parentIdx;
    }
  }

  private sinkDown(index: number): void {
    const length = this.heap.length;

    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < length && this.heap[left].score < this.heap[smallest].score) {
        smallest = left;
      }
      if (right < length && this.heap[right].score < this.heap[smallest].score) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
      index = smallest;
    }
  }
}
