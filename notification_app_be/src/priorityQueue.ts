// Min-heap for efficiently finding top-N items
// Instead of sorting everything (O(M log M)), we use a heap of size N
// so the total work is O(M log N) — much better when N is small

export interface HeapItem<T> {
  score: number;
  data: T;
}

export class MinHeap<T> {
  private heap: HeapItem<T>[] = [];
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get size(): number {
    return this.heap.length;
  }

  // insert a new item — if heap is full, only insert if score beats the minimum
  insert(score: number, data: T): void {
    if (this.heap.length < this.capacity) {
      this.heap.push({ score, data });
      this.bubbleUp(this.heap.length - 1);
    } else if (score > this.heap[0].score) {
      // replace the smallest item with this better one
      this.heap[0] = { score, data };
      this.sinkDown(0);
    }
  }

  // pull everything out, sorted highest score first
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

    // we extracted mins first, so reverse to get descending order
    return result.reverse();
  }

  // standard heap bubble-up
  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].score <= this.heap[i].score) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  // standard heap sink-down
  private sinkDown(i: number): void {
    const len = this.heap.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < len && this.heap[left].score < this.heap[smallest].score) smallest = left;
      if (right < len && this.heap[right].score < this.heap[smallest].score) smallest = right;
      if (smallest === i) break;

      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}
