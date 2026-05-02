// Navbar — yellow accent nav

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

const navItems = [
  { label: "Notifications", href: "/notifications" },
  { label: "Priority", href: "/priority" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <AppBar position="fixed" elevation={0}>
        <Toolbar sx={{ maxWidth: 800, width: "100%", mx: "auto", px: { xs: 2, md: 3 }, minHeight: "56px !important" }}>
          <IconButton color="inherit" edge="start" onClick={() => setOpen(true)} sx={{ mr: 1, display: { md: "none" } }}>
            <MenuIcon sx={{ color: "#F7DF1E" }} />
          </IconButton>

          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <Box sx={{ width: 28, height: 28, backgroundColor: "#F7DF1E", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography sx={{ color: "#1A1A1D", fontWeight: 800, fontSize: "0.75rem" }}>BB</Typography>
            </Box>
            <Typography sx={{ color: "#E8E6E3", fontWeight: 600, fontSize: "0.95rem" }}>
              BuzzBoard
            </Typography>
          </Link>

          <Box sx={{ display: { xs: "none", md: "flex" }, ml: "auto", gap: 0.5 }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <Button
                  size="small"
                  sx={{
                    color: pathname === item.href ? "#F7DF1E" : "#8B8B8B",
                    fontWeight: pathname === item.href ? 600 : 400,
                    fontSize: "0.85rem",
                    px: 1.5,
                    "&:hover": { color: "#F7DF1E", backgroundColor: "transparent" },
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={() => setOpen(false)} sx={{ "& .MuiDrawer-paper": { width: 220, backgroundColor: "#2C2C2E", borderRight: "1px solid #3A3A3C" } }}>
        <Box sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 700, color: "#F7DF1E", mb: 2, fontSize: "0.95rem" }}>BuzzBoard</Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.href} disablePadding>
                <Link href={item.href} style={{ textDecoration: "none", width: "100%" }} onClick={() => setOpen(false)}>
                  <ListItemButton sx={{
                    borderRadius: 1.5, mb: 0.5,
                    backgroundColor: pathname === item.href ? "#F7DF1E15" : "transparent",
                    color: pathname === item.href ? "#F7DF1E" : "#8B8B8B",
                  }}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Toolbar sx={{ minHeight: "56px !important" }} />
    </>
  );
}
