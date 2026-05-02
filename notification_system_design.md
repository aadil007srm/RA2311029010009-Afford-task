# Notification System Design

## Stage 1

### Problem Statement

Users of the campus notification platform are overwhelmed by a high volume of notifications, causing them to miss important updates. The task is to implement a **Priority Inbox** that displays the top *N* most important unread notifications, determined by a combination of **notification type weight** and **recency**.

---

### Approach: Min-Heap Based Priority Inbox

#### Priority Scoring Formula

```
score = (type_weight × WEIGHT_FACTOR) + recency_score
```

| Component        | Description                                          |
|------------------|------------------------------------------------------|
| `type_weight`    | Placement = 3, Result = 2, Event = 1                |
| `WEIGHT_FACTOR`  | 10 — ensures type dominance in scoring               |
| `recency_score`  | Normalized to [0, 10] based on timestamp range       |

**Score Examples:**
- Recent Placement: 30 + 9.5 = **39.5**
- Old Placement: 30 + 1.2 = **31.2**
- Recent Result: 20 + 9.8 = **29.8**
- Recent Event: 10 + 10.0 = **20.0**

This formula ensures:
1. **Type weight is primary** — Placements always rank above Events for similar time periods.
2. **Recency breaks ties** — Among same-type notifications, more recent ones rank higher.
3. **Cross-type recency matters** — A very recent Result can still rank above an older Placement in edge cases.

---

### Data Structure: Min-Heap (Fixed Capacity N)

#### Why a Min-Heap?

| Approach          | Time Complexity | Space Complexity |
|-------------------|-----------------|------------------|
| Sort all, take N  | O(M log M)      | O(M)             |
| **Min-Heap (N)**  | **O(M log N)**   | **O(N)**          |
| Linear scan       | O(M × N)        | O(N)             |

For M notifications and top-N results, the min-heap is optimal because:
- We only need the **top N**, not a full sort.
- Insert is **O(log N)** per notification.
- Total: **O(M log N)**, where typically N << M.

#### Algorithm

```
1. Initialize a min-heap with capacity N
2. For each notification:
   a. Compute priority score
   b. If heap size < N: insert
   c. Else if score > heap minimum: replace minimum and re-heapify
3. Extract all items from heap, sorted descending by score
```

#### Handling New Notifications Efficiently

Since new notifications continuously arrive, the min-heap approach is ideal:

- **Incremental updates**: When a new notification arrives, compute its score and attempt to insert it into the existing heap — O(log N) per new notification.
- **No re-computation needed**: The heap always maintains the current top-N. Only notifications scoring higher than the current minimum can displace existing items.
- **Memory efficient**: Only N items are stored at any time, regardless of total notification volume.

```
New notification arrives →
  Compute score →
    If score > heap.min → Replace min, re-heapify → O(log N)
    Else → Discard → O(1)
```

---

### Implementation Architecture

```
notification_app_be/
├── src/
│   ├── index.ts           # Entry point — orchestrates fetch + priority computation
│   ├── config.ts          # Loads credentials from credentials.json
│   ├── auth.ts            # Obtains Bearer token for API access
│   ├── notifications.ts   # Fetches notifications from evaluation server
│   ├── priorityQueue.ts   # Generic MinHeap<T> implementation
│   └── priorityInbox.ts   # Priority scoring + top-N extraction logic
├── package.json
└── tsconfig.json
```

#### Key Design Decisions

1. **Generic MinHeap<T>**: The heap is parameterized by a generic type, making it reusable for any scoreable data — not just notifications.

2. **Normalized Recency**: Timestamps are normalized to a [0, 10] range using the dataset's min/max bounds. This prevents raw timestamp values from dominating the score.

3. **Separation of Concerns**: Scoring logic, heap operations, and API communication are in separate modules for testability and maintainability.

4. **Logging Integration**: Every significant operation (fetch, score computation, errors) is logged via the reusable Logging Middleware for full observability.

---

### Output Format

```
╔══════════════════════════════════════════════════════════════════╗
║           Campus Notifications — Priority Inbox                 ║
╚══════════════════════════════════════════════════════════════════╝

📥 Fetched 10 notifications from the server.

─── Top 10 Priority Notifications ─────────────────────────────────
  Rank | Type       | Message                    | Timestamp
  ─────┼────────────┼────────────────────────────┼─────────────────
  #01  | Placement  | CSX Corporation hiring     | 2026-04-22 17:51:18
  #02  | Placement  | AMD hiring                 | 2026-04-22 17:49:42
  #03  | Result     | mid-sem                    | 2026-04-22 17:51:30
  ...
```

---

## Stage 2

### Frontend Architecture

The frontend is built with **Next.js (App Router)** and **Material UI** for styling, running exclusively on `http://localhost:3000`.

#### Pages

| Route             | Description                                        |
|-------------------|----------------------------------------------------|
| `/`               | Landing page with feature overview and navigation  |
| `/notifications`  | All notifications with filtering and pagination    |
| `/priority`       | Priority Inbox with top-N selection and ranking     |

#### Key Features

1. **Read/Unread Tracking**: Uses `localStorage` to persist which notifications have been viewed. Unread notifications display a pulsing "NEW" indicator and bold text. Clicking marks them as read.

2. **Type Filtering**: Chip-based filter bar allows viewing only Placement, Result, or Event notifications.

3. **Pagination**: All Notifications page displays 10 items per page with MUI Pagination controls.

4. **Top-N Selection**: Priority Inbox page includes a dropdown to choose N (5, 10, 15, 20, 25).

5. **Responsive Design**: Mobile-first layout with a hamburger drawer navigation on small screens.

6. **Visual Differentiation**: Each notification type has a distinct color (Green=Placement, Blue=Result, Orange=Event) with colored left borders and type chips.

7. **Staggered Animations**: Notifications fade in sequentially for a polished user experience.

#### Frontend Component Tree

```
RootLayout
├── ThemeProvider (MUI Dark Theme)
├── Navbar (glassmorphism, responsive drawer)
└── Page Content
    ├── HomePage
    │   ├── Hero section with gradient text
    │   ├── Feature cards (All Notifications, Priority Inbox)
    │   └── Notification type info cards
    ├── NotificationsPage
    │   ├── FilterBar (type chips, refresh, count)
    │   ├── NotificationCard[] (with read/unread state)
    │   └── Pagination
    └── PriorityPage
        ├── Algorithm info banner
        ├── FilterBar (type chips, top-N selector, refresh)
        └── NotificationCard[] (with rank badges)
```

#### API Integration

The frontend uses the evaluation server's notification API with query parameters:

```
GET /evaluation-service/notifications?limit=10&page=1&notification_type=Placement
```

Authorization via Bearer token obtained from the auth endpoint.

#### Logging Integration

The frontend extensively uses the Logging Middleware:
- **Page loads**: Logged with `Log("info", "page", ...)`
- **API calls**: Logged with `Log("info", "api", ...)` and `Log("error", "api", ...)`
- **User interactions**: Filter changes, pagination, read state changes
- **Hook lifecycle**: Data fetch results, state changes

---

### Technology Stack

| Technology    | Purpose                              |
|---------------|--------------------------------------|
| Next.js 16    | React framework with App Router      |
| TypeScript    | Type safety across all modules       |
| Material UI 9 | Component library and theming        |
| localStorage  | Persistent read/unread state         |

---

### Logging Middleware

The logging middleware is a reusable TypeScript package that:

1. Exports `initLogger(config)` for initialization with credentials
2. Exports `Log(stack, level, package, message)` for structured logging
3. Automatically obtains and caches Bearer tokens
4. Validates all parameters against allowed values at runtime
5. Is consumed by both backend and frontend applications

```typescript
// Usage in backend
import { initLogger, Log } from "logging-middleware";
initLogger(credentials);
await Log("backend", "error", "handler", "received string, expected bool");

// Usage in frontend (adapted for browser)
import { Log } from "@/lib/logger";
await Log("info", "page", "Home page loaded");
```
