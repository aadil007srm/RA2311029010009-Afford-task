/**
 * Navbar — Clean, minimal top navigation.
 */

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

const navItems = [
  { label: "All Notifications", href: "/notifications" },
  { label: "Priority Inbox", href: "/priority" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      <AppBar position="fixed" elevation={0}>
        <Toolbar sx={{ maxWidth: 900, width: "100%", mx: "auto", px: { xs: 2, md: 3 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 1, display: { md: "none" } }}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>

          <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
            <NotificationsNoneIcon sx={{ color: "#2563EB", fontSize: 22 }} />
            <Typography variant="h6" sx={{ color: "#1E293B", fontWeight: 700, fontSize: "1rem" }}>
              CampusNotify
            </Typography>
          </Link>

          <Box sx={{ display: { xs: "none", md: "flex" }, ml: "auto", gap: 0.5 }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <Button
                  size="small"
                  sx={{
                    color: pathname === item.href ? "#2563EB" : "#64748B",
                    fontWeight: pathname === item.href ? 600 : 400,
                    fontSize: "0.85rem",
                    "&:hover": { backgroundColor: "#F1F5F9" },
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 240, backgroundColor: "#FFF" },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#1E293B" }}>
            CampusNotify
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.href} disablePadding>
                <Link href={item.href} style={{ textDecoration: "none", width: "100%" }} onClick={() => setMobileOpen(false)}>
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      backgroundColor: pathname === item.href ? "#EFF6FF" : "transparent",
                      color: pathname === item.href ? "#2563EB" : "#64748B",
                    }}
                  >
                    <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontSize: "0.875rem" } } }} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Toolbar />
    </>
  );
}
