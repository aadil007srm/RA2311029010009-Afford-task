/**
 * FilterBar — Simple, clean controls for filtering notifications.
 */

"use client";

import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { NotificationType } from "@/lib/types";

interface FilterBarProps {
  activeFilter: NotificationType | "All";
  onFilterChange: (filter: NotificationType | "All") => void;
  totalCount: number;
  onRefresh: () => void;
  isLoading: boolean;
  topN?: number;
  onTopNChange?: (n: number) => void;
}

const filters: Array<{ value: NotificationType | "All"; label: string }> = [
  { value: "All", label: "All" },
  { value: "Placement", label: "Placement" },
  { value: "Result", label: "Result" },
  { value: "Event", label: "Event" },
];

const topNOptions = [5, 10, 15, 20];

export default function FilterBar({
  activeFilter,
  onFilterChange,
  totalCount,
  onRefresh,
  isLoading,
  topN,
  onTopNChange,
}: FilterBarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        gap: 1.5,
        mb: 2,
      }}
    >
      {/* Filter chips */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, alignItems: "center" }}>
        {filters.map((f) => (
          <Chip
            key={f.value}
            label={f.label}
            clickable
            onClick={() => onFilterChange(f.value)}
            size="small"
            sx={{
              backgroundColor: activeFilter === f.value ? "#1E293B" : "#F1F5F9",
              color: activeFilter === f.value ? "#FFF" : "#64748B",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: activeFilter === f.value ? "#334155" : "#E2E8F0",
              },
            }}
          />
        ))}
      </Box>

      {/* Right controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {topN !== undefined && onTopNChange && (
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <InputLabel id="topn-label" sx={{ fontSize: "0.8rem" }}>Top N</InputLabel>
            <Select
              labelId="topn-label"
              value={topN}
              label="Top N"
              onChange={(e: SelectChangeEvent<number>) => onTopNChange(Number(e.target.value))}
              sx={{ fontSize: "0.8rem", height: 32 }}
            >
              {topNOptions.map((n) => (
                <MenuItem key={n} value={n} sx={{ fontSize: "0.8rem" }}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8" }}>
          {totalCount} items
        </Typography>

        <IconButton size="small" onClick={onRefresh} disabled={isLoading} sx={{ color: "#64748B" }}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
