import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default React.memo(function RegisterPage({ setToken }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/sign-up`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
      );

      localStorage.setItem("token", response.data.data);
      setToken(response.data.data);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseToken = await result.user.getIdToken();

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/oauth/sign-up`,
        {
          token: firebaseToken,
        }
      );

      localStorage.setItem("token", response.data.data);
      setToken(response.data.data);
      navigate("/");
    } catch (error) {
      console.error("Google sign-up failed:", error);
      alert(error.response?.data?.message || "Google sign-up failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-secondary-950 to-primary-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-600/5 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 left-0 w-80 h-80 bg-primary-600/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-secondary-600/3 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl mb-6 shadow-lg">
              <span className="text-2xl font-bold text-white">T</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-neutral-400">
              Join Tasky and boost your productivity
            </p>
          </div>

          {/* Register Form */}
          <div
            className="glass p-8 rounded-3xl shadow-2xl animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="relative group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className={`w-full p-4 bg-neutral-800/30 text-white border rounded-xl placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 hover:border-neutral-500 transition-all duration-300 ${
                    errors.username
                      ? "border-danger-500 focus:border-danger-500"
                      : "border-neutral-600/50 focus:border-primary-500"
                  }`}
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                {errors.username && (
                  <p className="text-danger-400 text-sm mt-1">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className={`w-full p-4 bg-neutral-800/30 text-white border rounded-xl placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 hover:border-neutral-500 transition-all duration-300 ${
                    errors.email
                      ? "border-danger-500 focus:border-danger-500"
                      : "border-neutral-600/50 focus:border-primary-500"
                  }`}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && (
                  <p className="text-danger-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`w-full p-4 bg-neutral-800/30 text-white border rounded-xl placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 hover:border-neutral-500 transition-all duration-300 ${
                    errors.password
                      ? "border-danger-500 focus:border-danger-500"
                      : "border-neutral-600/50 focus:border-primary-500"
                  }`}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {errors.password && (
                  <p className="text-danger-400 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={`w-full p-4 bg-neutral-800/30 text-white border rounded-xl placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 hover:border-neutral-500 transition-all duration-300 ${
                    errors.confirmPassword
                      ? "border-danger-500 focus:border-danger-500"
                      : "border-neutral-600/50 focus:border-primary-500"
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-danger-400 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="group relative w-full py-4 mt-6 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={loading || googleLoading}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-primary-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent"></div>
                <span className="px-4 text-sm text-neutral-400 font-medium">
                  or
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent"></div>
              </div>

              {/* Google Sign-Up Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="group relative w-full py-4 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-600/50 hover:border-neutral-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={loading || googleLoading}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {googleLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Signing up with Google...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path
                          fill="#4285f4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34a853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#fbbc05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#ea4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-700/30 to-neutral-600/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-400">
                Already have an account?
                <Link
                  to="/login"
                  className="text-primary-400 hover:text-primary-300 ml-1 font-medium transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div
            className="text-center mt-6 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="inline-flex items-center px-4 py-2 glass-light rounded-full">
              <div className="w-2 h-2 bg-success-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs text-neutral-400">
                Your data is protected with enterprise-grade security
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
