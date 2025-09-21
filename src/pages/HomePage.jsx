import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function HomePage({ token }) {
  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#fff",
        px: 3,
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
          url('https://images.unsplash.com/photo-1713245275828-a83869408f96?q=90&w=2500&auto=format&fit=crop')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Welcome to Tasky
        </Typography>
        <Typography variant="h6" sx={{ mb: 5, lineHeight: 1.6 }}>
          Tasky helps you organize your daily tasks efficiently and
          effortlessly. Stay on top of your schedule and boost your
          productivity.
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to={token ? "/projects" : "/login"}
          sx={{
            px: 5,
            py: 1.5,
            fontWeight: "bold",
            fontSize: "1.1rem",
            borderRadius: 3,
            textTransform: "none",
            bgcolor: "#4f46e5",
            color: "#fff",
            transition: "all 0.3s ease",
            "&:hover": { transform: "scale(1.05)", backgroundColor: "#3730a3" },
          }}
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
}
