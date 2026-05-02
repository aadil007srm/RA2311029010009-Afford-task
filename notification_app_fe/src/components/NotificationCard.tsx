/**
 * NotificationCard — Displays a single notification with read/unread state.
 * Features type-colored left border, hover animation, and click-to-mark-read.
 */

"use client";

import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import WorkIcon from "@mui/icons-material/Work";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CelebrationIcon from "@mui/icons-material/Celebration";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Notification, TYPE_COLORS, NotificationType } from "@/lib/types";

interface NotificationCardProps {
  notification: Notification;
  isRead: boolean;
  onMarkRead: (id: string) => void;
  rank?: number;
}

/** Icon mapping for notification types */
const typeIcons: Record<NotificationType, React.ReactNode> = {
  Placement: <WorkIcon fontSize="small" />,
  Result: <AssessmentIcon fontSize="small" />,
  Event: <CelebrationIcon fontSize="small" />,
};

/**
 * Formats an ISO timestamp into a human-readable relative or absolute string.
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function NotificationCard({
  notification,
  isRead,
  onMarkRead,
  rank,
}: NotificationCardProps) {
  const typeColor = TYPE_COLORS[notification.Type];

  const handleClick = () => {
    if (!isRead) {
      onMarkRead(notification.ID);
    }
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: !isRead ? "pointer" : "default",
        position: "relative",
        borderLeft: `4px solid ${typeColor}`,
        opacity: isRead ? 0.65 : 1,
        backgroundColor: isRead ? "rgba(17, 24, 39, 0.6)" : "rgba(17, 24, 39, 0.95)",
        mb: 1.5,
        "&::before": !isRead
          ? {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${typeColor}08, transparent 50%)`,
              pointerEvents: "none",
              borderRadius: "inherit",
            }
          : {},
      }}
    >
      <CardContent sx={{ py: 2, px: 2.5, "&:last-child": { pb: 2 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          {/* Left: rank + type icon + content */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, flex: 1, minWidth: 0 }}>
            {/* Rank badge (for priority view) */}
            {rank !== undefined && (
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: `${typeColor}22`,
                  color: typeColor,
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  flexShrink: 0,
                }}
              >
                {rank}
              </Box>
            )}

            {/* Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                <Chip
                  icon={typeIcons[notification.Type] as React.ReactElement}
                  label={notification.Type}
                  size="small"
                  sx={{
                    backgroundColor: `${typeColor}22`,
                    color: typeColor,
                    border: `1px solid ${typeColor}44`,
                    "& .MuiChip-icon": { color: typeColor },
                  }}
                />
                {!isRead && (
                  <Tooltip title="New — click to mark as read">
                    <FiberNewIcon
                      sx={{
                        color: "#FF4081",
                        fontSize: "1.2rem",
                        animation: "pulse 2s infinite",
                        "@keyframes pulse": {
                          "0%, 100%": { opacity: 1 },
                          "50%": { opacity: 0.5 },
                        },
                      }}
                    />
                  </Tooltip>
                )}
              </Box>

              <Typography
                variant="body1"
                sx={{
                  fontWeight: isRead ? 400 : 600,
                  color: isRead ? "#9AA0A6" : "#E8EAED",
                  textTransform: "capitalize",
                  mb: 0.5,
                }}
              >
                {notification.Message}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: "0.75rem", color: "#6B7280" }} />
                <Typography variant="caption" color="text.secondary">
                  {formatTimestamp(notification.Timestamp)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
