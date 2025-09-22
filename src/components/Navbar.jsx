import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
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
    <nav className="sticky top-0 bg-neutral-900/95 backdrop-blur-lg border-b border-neutral-700/50 text-white shadow-xl z-50">
      <div className="flex justify-between items-center px-6 py-4">
        <Link
          to="/"
          className="group flex items-center no-underline text-white hover:text-primary-300 transition-all duration-300"
        >
          <div className="relative">
            <img
              src={logo}
              alt="Tasky Logo"
              className="h-10 mr-3 group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-neutral-200 bg-clip-text text-transparent group-hover:from-primary-300 group-hover:to-accent-300 transition-all duration-300">
            Tasky
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {!token ? (
            <Link
              to="/login"
              className="group relative px-6 py-3 font-semibold rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-500 hover:to-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25 no-underline"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-primary-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          ) : (
            <>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    bgcolor: "transparent",
                    background: "linear-gradient(135deg, #2563eb, #c026d3)",
                    width: 44,
                    height: 44,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    border: "2px solid rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                      boxShadow: "0 8px 25px rgba(37, 99, 235, 0.3)"
                    }
                  }}
                >
                  U
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    bgcolor: "rgba(23, 23, 23, 0.95)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    mt: 1,
                    minWidth: 180,
                    "& .MuiMenuItem-root": {
                      color: "white",
                      py: 1.5,
                      px: 2,
                      borderRadius: "8px",
                      mx: 1,
                      my: 0.5,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "rgba(37, 99, 235, 0.1)",
                        transform: "translateX(4px)"
                      }
                    }
                  }
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/profile");
                  }}
                >
                  <span className="mr-3">👤</span>
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleLogout();
                    navigate("/login");
                  }}
                >
                  <span className="mr-3">🚪</span>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
