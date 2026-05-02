// Home page — clean landing

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Log } from "@/lib/logger";

export default function HomePage() {
  useEffect(() => { Log("info", "page", "Home page loaded"); }, []);

  return (
    <Box sx={{ py: 6, maxWidth: 640, mx: "auto" }}>
      <Box sx={{ mb: 5 }}>
        <Box sx={{ width: 48, height: 48, backgroundColor: "#F7DF1E", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
          <Typography sx={{ color: "#1A1A1D", fontWeight: 800, fontSize: "1.1rem" }}>BB</Typography>
        </Box>
        <Typography variant="h4" sx={{ mb: 1 }}>Campus Notifications</Typography>
        <Typography sx={{ color: "#8B8B8B", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 480 }}>
          Real-time updates for placements, results, and events.
          Prioritized so you never miss what matters.
        </Typography>
      </Box>

      <Grid container spacing={1.5} sx={{ mb: 5 }}>
        {[
          { title: "All Notifications", desc: "Browse, filter, and track all updates", href: "/notifications" },
          { title: "Priority Inbox", desc: "Top notifications ranked by importance", href: "/priority" },
        ].map((item) => (
          <Grid size={{ xs: 12, sm: 6 }} key={item.href}>
            <Link href={item.href} style={{ textDecoration: "none" }}>
              <Box sx={{
                p: 2.5, borderRadius: 2, backgroundColor: "#2C2C2E", border: "1px solid #3A3A3C",
                transition: "all 0.15s", cursor: "pointer",
                "&:hover": { borderColor: "#F7DF1E50", transform: "translateY(-2px)" },
              }}>
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#E8E6E3", mb: 0.5 }}>{item.title}</Typography>
                <Typography sx={{ fontSize: "0.78rem", color: "#8B8B8B", mb: 1.5 }}>{item.desc}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#F7DF1E" }}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 500 }}>Open</Typography>
                  <ArrowForwardIcon sx={{ fontSize: 12 }} />
                </Box>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* scoring legend */}
      <Box sx={{ p: 2, borderRadius: 2, border: "1px solid #3A3A3C" }}>
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#F7DF1E", mb: 1, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Priority Scoring
        </Typography>
        <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
          {[
            { label: "Placement", weight: 30, color: "#4ADE80" },
            { label: "Result", weight: 20, color: "#60A5FA" },
            { label: "Event", weight: 10, color: "#F7DF1E" },
          ].map((t) => (
            <Box key={t.label} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: t.color }} />
              <Typography sx={{ fontSize: "0.75rem", color: "#8B8B8B" }}>
                {t.label} <span style={{ color: "#E8E6E3", fontWeight: 600 }}>({t.weight})</span>
              </Typography>
            </Box>
          ))}
          <Typography sx={{ fontSize: "0.75rem", color: "#666" }}>+ recency 0–10</Typography>
        </Box>
      </Box>
    </Box>
  );
}
