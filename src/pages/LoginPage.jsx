import { useState, useEffect } from "react";
import axios from "axios";
import { Container, TextField, Button, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ setToken }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/sign-in`,
        {
          email: emailOrPhone,
          password,
        }
      );

      localStorage.setItem("token", response.data.data);
      setToken(response.data.data);
      navigate("/");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // reset when component unmounts
    };
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1713245275828-a83869408f96?q=90&w=2500&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            padding: 5,
            marginTop: -20,
            bgcolor: "rgba(0, 0, 0, 0.6)",
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              placeholder="Email or Phone Number"
              type="text"
              fullWidth
              margin="normal"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              InputLabelProps={{ shrink: false }} // remove label shrink
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "#fff",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#404040ff",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#9046e5ff",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255,255,255,0.7)",
                },
              }}
            />
            <TextField
              placeholder="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ shrink: false }} // remove label shrink
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "#fff",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#404040ff",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#9046e5ff",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255,255,255,0.7)",
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                bgcolor: "#4f46e5",
                "&:hover": { bgcolor: "#3730a3" },
                fontWeight: 600,
              }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
