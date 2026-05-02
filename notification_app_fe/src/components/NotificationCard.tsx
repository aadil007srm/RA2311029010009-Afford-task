/**
 * NotificationCard — Clean, minimal notification display.
 */

"use client";

import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { Notification, NotificationType } from "@/lib/types";

interface NotificationCardProps {
  notification: Notification;
  isRead: boolean;
  onMarkRead: (id: string) => void;
  rank?: number;
}

/** Muted colors per notification type */
const typeStyles: Record<NotificationType, { bg: string; color: string; dot: string }> = {
  Placement: { bg: "#F0FDF4", color: "#16A34A", dot: "#22C55E" },
  Result: { bg: "#EFF6FF", color: "#2563EB", dot: "#3B82F6" },
  Event: { bg: "#FFFBEB", color: "#D97706", dot: "#F59E0B" },
};

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffHrs < 48) return "Yesterday";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function NotificationCard({ notification, isRead, onMarkRead, rank }: NotificationCardProps) {
  const style = typeStyles[notification.Type];

  return (
    <Card
      onClick={() => !isRead && onMarkRead(notification.ID)}
      sx={{
        cursor: !isRead ? "pointer" : "default",
        mb: 1,
        opacity: isRead ? 0.6 : 1,
        borderLeft: `3px solid ${style.dot}`,
        "&:hover": { boxShadow: !isRead ? "0 4px 16px rgba(0,0,0,0.1)" : undefined },
      }}
    >
      <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Rank */}
          {rank !== undefined && (
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.8rem",
                color: "#94A3B8",
                minWidth: 24,
                textAlign: "center",
              }}
            >
              {rank}
            </Typography>
          )}

          {/* Unread dot */}
          {!isRead && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#2563EB",
                flexShrink: 0,
              }}
            />
          )}

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3 }}>
              <Typography
                sx={{
                  fontWeight: isRead ? 400 : 600,
                  fontSize: "0.875rem",
                  color: isRead ? "#94A3B8" : "#1E293B",
                  textTransform: "capitalize",
                }}
              >
                {notification.Message}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8" }}>
              {formatTime(notification.Timestamp)}
            </Typography>
          </Box>

          {/* Type chip */}
          <Chip
            label={notification.Type}
            size="small"
            sx={{
              backgroundColor: style.bg,
              color: style.color,
              fontWeight: 500,
              fontSize: "0.7rem",
              height: 24,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
