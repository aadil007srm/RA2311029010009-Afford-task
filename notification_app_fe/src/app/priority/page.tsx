/**
 * Priority Inbox Page — Displays top-N most important notifications.
 * Uses min-heap algorithm with type weight + recency scoring.
 * Supports configurable N, type filtering, and read/unread tracking.
 */

"use client";

import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import Chip from "@mui/material/Chip";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import NotificationCard from "@/components/NotificationCard";
import FilterBar from "@/components/FilterBar";
import { useNotifications } from "@/hooks/useNotifications";
import { useReadState } from "@/hooks/useReadState";
import { getTopNNotifications } from "@/lib/priorityUtils";
import { Notification, NotificationType } from "@/lib/types";
import { Log } from "@/lib/logger";

export default function PriorityPage() {
  const [activeFilter, setActiveFilter] = useState<NotificationType | "All">("All");
  const [topN, setTopN] = useState(10);
  const { isRead, markAsRead } = useReadState();

  /* Fetch all notifications */
  const { notifications, isLoading, error, refetch } = useNotifications();

  useEffect(() => {
    Log("info", "page", "Priority Inbox page loaded");
  }, []);

  /* Apply type filter first, then compute priority */
  const filteredNotifications = useMemo(() => {
    if (activeFilter === "All") return notifications;
    return notifications.filter((n: Notification) => n.Type === activeFilter);
  }, [notifications, activeFilter]);

  /* Compute top-N priority notifications */
  const priorityNotifications = useMemo(() => {
    const result = getTopNNotifications(filteredNotifications, topN);
    Log(
      "info",
      "page",
      `Priority computed: ${result.length} top notifications from ${filteredNotifications.length} total`
    );
    return result;
  }, [filteredNotifications, topN]);

  const handleFilterChange = (filter: NotificationType | "All") => {
    setActiveFilter(filter);
    Log("info", "page", `Priority filter changed to: ${filter}`);
  };

  const handleTopNChange = (n: number) => {
    setTopN(n);
    Log("info", "page", `Top N changed to: ${n}`);
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <EmojiEventsIcon sx={{ color: "#FFD700", fontSize: 32 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #FFD700, #FF9800)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Priority Inbox
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Top notifications ranked by importance (type weight × 10 + recency score).
        </Typography>
      </Box>

      {/* Algorithm Info Banner */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          p: 2,
          mb: 3,
          borderRadius: 2,
          backgroundColor: "rgba(124, 77, 255, 0.06)",
          border: "1px solid rgba(124, 77, 255, 0.15)",
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1, lineHeight: "32px" }}>
          Weights:
        </Typography>
        <Chip
          label="Placement = 30"
          size="small"
          sx={{ backgroundColor: "rgba(76, 175, 80, 0.15)", color: "#4CAF50" }}
        />
        <Chip
          label="Result = 20"
          size="small"
          sx={{ backgroundColor: "rgba(33, 150, 243, 0.15)", color: "#2196F3" }}
        />
        <Chip
          label="Event = 10"
          size="small"
          sx={{ backgroundColor: "rgba(255, 152, 0, 0.15)", color: "#FF9800" }}
        />
        <Chip
          label="+ Recency (0-10)"
          size="small"
          sx={{ backgroundColor: "rgba(124, 77, 255, 0.15)", color: "#B47CFF" }}
        />
      </Box>

      {/* Filter Bar with Top-N selector */}
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        totalCount={priorityNotifications.length}
        onRefresh={refetch}
        isLoading={isLoading}
        topN={topN}
        onTopNChange={handleTopNChange}
      />

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, backgroundColor: "rgba(211,47,47,0.1)" }}>
          Failed to load notifications: {error}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Box>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={100}
              sx={{ mb: 1.5, backgroundColor: "rgba(255,255,255,0.04)" }}
            />
          ))}
        </Box>
      )}

      {/* Priority Notification List */}
      {!isLoading && !error && (
        <>
          {priorityNotifications.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No notifications to prioritize
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {activeFilter !== "All"
                  ? `No ${activeFilter} notifications available.`
                  : "Check back later for new updates."}
              </Typography>
            </Box>
          ) : (
            <Box>
              {priorityNotifications.map((notification: Notification, index: number) => (
                <Fade
                  key={notification.ID}
                  in={true}
                  timeout={300 + index * 80}
                >
                  <div>
                    <NotificationCard
                      notification={notification}
                      isRead={isRead(notification.ID)}
                      onMarkRead={markAsRead}
                      rank={index + 1}
                    />
                  </div>
                </Fade>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
