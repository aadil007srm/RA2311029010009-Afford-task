/**
 * FilterBar — Controls for filtering and configuring notification display.
 * Includes type filter chips, top-N selector, and notification counters.
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
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import WorkIcon from "@mui/icons-material/Work";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CelebrationIcon from "@mui/icons-material/Celebration";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import { NotificationType, TYPE_COLORS } from "@/lib/types";

interface FilterBarProps {
  activeFilter: NotificationType | "All";
  onFilterChange: (filter: NotificationType | "All") => void;
  totalCount: number;
  onRefresh: () => void;
  isLoading: boolean;
  /** Only shown on the priority page */
  topN?: number;
  onTopNChange?: (n: number) => void;
}

const filterOptions: Array<{ value: NotificationType | "All"; label: string; icon: React.ReactNode; color: string }> = [
  { value: "All", label: "All", icon: <AllInboxIcon fontSize="small" />, color: "#7C4DFF" },
  { value: "Placement", label: "Placement", icon: <WorkIcon fontSize="small" />, color: TYPE_COLORS.Placement },
  { value: "Result", label: "Result", icon: <AssessmentIcon fontSize="small" />, color: TYPE_COLORS.Result },
  { value: "Event", label: "Event", icon: <CelebrationIcon fontSize="small" />, color: TYPE_COLORS.Event },
];

const topNOptions = [5, 10, 15, 20, 25];

export default function FilterBar({
  activeFilter,
  onFilterChange,
  totalCount,
  onRefresh,
  isLoading,
  topN,
  onTopNChange,
}: FilterBarProps) {
  const handleTopNChange = (event: SelectChangeEvent<number>) => {
    onTopNChange?.(Number(event.target.value));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        p: 2,
        borderRadius: 3,
        backgroundColor: "rgba(17, 24, 39, 0.6)",
        border: "1px solid rgba(255,255,255,0.06)",
        mb: 3,
      }}
    >
      {/* Filter chips */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          Filter:
        </Typography>
        {filterOptions.map((opt) => (
          <Chip
            key={opt.value}
            icon={opt.icon as React.ReactElement}
            label={opt.label}
            clickable
            onClick={() => onFilterChange(opt.value)}
            variant={activeFilter === opt.value ? "filled" : "outlined"}
            sx={{
              backgroundColor: activeFilter === opt.value ? `${opt.color}22` : "transparent",
              color: activeFilter === opt.value ? opt.color : "#9AA0A6",
              borderColor: activeFilter === opt.value ? opt.color : "rgba(255,255,255,0.12)",
              "& .MuiChip-icon": {
                color: activeFilter === opt.value ? opt.color : "#9AA0A6",
              },
              "&:hover": {
                backgroundColor: `${opt.color}15`,
              },
            }}
          />
        ))}
      </Box>

      {/* Right side: Top N selector + counter + refresh */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        {/* Top-N selector (only on priority page) */}
        {topN !== undefined && onTopNChange && (
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel
              id="top-n-label"
              sx={{ color: "#9AA0A6" }}
            >
              Top N
            </InputLabel>
            <Select
              labelId="top-n-label"
              id="top-n-select"
              value={topN}
              label="Top N"
              onChange={handleTopNChange}
              sx={{
                color: "#E8EAED",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.12)",
                },
              }}
            >
              {topNOptions.map((n) => (
                <MenuItem key={n} value={n}>
                  Top {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Count badge */}
        <Chip
          label={`${totalCount} notifications`}
          size="small"
          sx={{
            backgroundColor: "rgba(124, 77, 255, 0.12)",
            color: "#B47CFF",
          }}
        />

        {/* Refresh button */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          disabled={isLoading}
          sx={{
            borderColor: "rgba(255,255,255,0.12)",
            color: "#9AA0A6",
            "&:hover": {
              borderColor: "#7C4DFF",
              color: "#7C4DFF",
            },
          }}
        >
          Refresh
        </Button>
      </Box>
    </Box>
  );
}
