import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import logo from "../assets/logo.svg";

export default function Navbar({ token, handleLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="sticky"
      sx={{ bgcolor: "#1f1f1f", color: "#fff" }}
      elevation={6}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <img
            src={logo}
            alt="Tasky Logo"
            style={{ height: 40, marginRight: 10 }}
          />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Tasky
          </Typography>
        </Link>

        <Box sx={{ display: "flex", gap: 2 }}>
          {!token ? (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                fontWeight: "bold",
                borderRadius: 2,
                textTransform: "none",
                bgcolor: "#4f46e5",
                "&:hover": { backgroundColor: "#3730a3" },
              }}
            >
              Login
            </Button>
          ) : (
            <>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: "#4f46e5" }}>ThisUserImage</Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/profile");
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleLogout();
                    navigate("/login");
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
