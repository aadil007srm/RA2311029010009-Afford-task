// Filter bar with yellow active state

"use client";

import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { NotificationType } from "@/lib/types";

interface Props {
  activeFilter: NotificationType | "All";
  onFilterChange: (f: NotificationType | "All") => void;
  totalCount: number;
  onRefresh: () => void;
  isLoading: boolean;
  topN?: number;
  onTopNChange?: (n: number) => void;
}

const filters: (NotificationType | "All")[] = ["All", "Placement", "Result", "Event"];

export default function FilterBar({ activeFilter, onFilterChange, totalCount, onRefresh, isLoading, topN, onTopNChange }: Props) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1.5, mb: 2.5 }}>
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {filters.map((f) => (
          <Chip
            key={f}
            label={f}
            clickable
            size="small"
            onClick={() => onFilterChange(f)}
            sx={{
              backgroundColor: activeFilter === f ? "#F7DF1E" : "#3A3A3C",
              color: activeFilter === f ? "#1A1A1D" : "#8B8B8B",
              fontWeight: activeFilter === f ? 600 : 400,
              "&:hover": { backgroundColor: activeFilter === f ? "#F7DF1E" : "#4A4A4C" },
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {topN !== undefined && onTopNChange && (
          <FormControl size="small">
            <Select
              value={topN}
              onChange={(e: SelectChangeEvent<number>) => onTopNChange(Number(e.target.value))}
              sx={{ fontSize: "0.78rem", height: 30, color: "#E8E6E3", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#3A3A3C" } }}
            >
              {[5, 10, 15, 20].map((n) => <MenuItem key={n} value={n} sx={{ fontSize: "0.78rem" }}>Top {n}</MenuItem>)}
            </Select>
          </FormControl>
        )}

        <Typography sx={{ fontSize: "0.72rem", color: "#666" }}>{totalCount} items</Typography>

        <IconButton size="small" onClick={onRefresh} disabled={isLoading} sx={{ color: "#8B8B8B", "&:hover": { color: "#F7DF1E" } }}>
          <RefreshIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
