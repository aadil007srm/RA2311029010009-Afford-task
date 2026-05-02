/**
 * Home Page — Simple landing with quick links.
 */

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Log } from "@/lib/logger";

export default function HomePage() {
  useEffect(() => {
    Log("info", "page", "Home page loaded");
  }, []);

  return (
    <Box sx={{ py: 4, maxWidth: 700, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Campus Notifications
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748B", lineHeight: 1.6 }}>
          Stay on top of placements, results, and events.
          View all updates or check your priority inbox.
        </Typography>
      </Box>

      {/* Quick Links */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Link href="/notifications" style={{ textDecoration: "none" }}>
            <Card>
              <CardActionArea>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#1E293B", mb: 0.5 }}>
                    All Notifications
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: "#64748B", mb: 2 }}>
                    Browse and filter all campus updates with read tracking.
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#2563EB" }}>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 500 }}>View all</Typography>
                    <ArrowForwardIcon sx={{ fontSize: 14 }} />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Link href="/priority" style={{ textDecoration: "none" }}>
            <Card>
              <CardActionArea>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#1E293B", mb: 0.5 }}>
                    Priority Inbox
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: "#64748B", mb: 2 }}>
                    Top notifications ranked by type and recency.
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#2563EB" }}>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 500 }}>View inbox</Typography>
                    <ArrowForwardIcon sx={{ fontSize: 14 }} />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>
      </Grid>

      {/* Type Legend */}
      <Box sx={{ mt: 4, p: 2.5, borderRadius: 2, border: "1px solid #E2E8F0", backgroundColor: "#FFF" }}>
        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#1E293B", mb: 1.5 }}>
          Priority Scoring
        </Typography>
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {[
            { type: "Placement", weight: 30, color: "#16A34A" },
            { type: "Result", weight: 20, color: "#2563EB" },
            { type: "Event", weight: 10, color: "#D97706" },
          ].map((item) => (
            <Box key={item.type} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: item.color }} />
              <Typography sx={{ fontSize: "0.78rem", color: "#64748B" }}>
                {item.type} <span style={{ fontWeight: 600, color: "#1E293B" }}>({item.weight})</span>
              </Typography>
            </Box>
          ))}
          <Typography sx={{ fontSize: "0.78rem", color: "#94A3B8" }}>
            + recency (0–10)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
