import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectsPage from "./pages/ProjectsPage";

export default React.memo(function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const fetchUser = useCallback(async (authToken) => {
    if (!authToken) return;

    setUserLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setUserLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    if (token) {
      fetchUser(token);
    }
  }, [token, fetchUser]);

  const handleLogin = useCallback((newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    fetchUser(newToken);
  }, [fetchUser]);

  return (
    <Router>
      <Navbar
        token={token}
        user={user}
        userLoading={userLoading}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<HomePage token={token} />} />
        <Route path="/login" element={<LoginPage setToken={handleLogin} />} />
        <Route
          path="/register"
          element={<RegisterPage setToken={handleLogin} />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/profile"
          element={<ProfilePage user={user} userLoading={userLoading} />}
        />
        <Route path="/projects" element={<ProjectsPage user={user} />} />
      </Routes>
    </Router>
  );
});
