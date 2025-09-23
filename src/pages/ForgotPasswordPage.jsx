import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);


  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/user/forgot-password`, {
        email,
      });

      setEmailSent(true);
      setCountdown(60); // 60 second countdown
    } catch (error) {
      console.error("Forgot password failed:", error);
      alert(error.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0) return;

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/user/forgot-password`, {
        email,
      });
      setCountdown(60);
    } catch (error) {
      console.error("Resend failed:", error);
      alert(error.response?.data?.message || "Failed to resend email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-secondary-950 to-primary-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-80 h-80 bg-warning-600/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-600/3 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-warning-600 to-accent-600 rounded-2xl mb-6 shadow-lg">
              <span className="text-2xl">🔑</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {emailSent ? "Check Your Email" : "Forgot Password?"}
            </h1>
            <p className="text-neutral-400">
              {emailSent
                ? "We've sent a password reset link to your email address"
                : "Enter your email and we'll send you a reset link"
              }
            </p>
          </div>

          {/* Form or Success Message */}
          <div className="glass p-8 rounded-3xl shadow-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full p-4 bg-neutral-800/30 text-white border border-neutral-600/50 rounded-xl placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 hover:border-neutral-500 transition-all duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-600/0 to-accent-600/0 group-focus-within:from-primary-600/10 group-focus-within:to-accent-600/10 transition-all duration-300 pointer-events-none"></div>
                </div>

                <button
                  type="submit"
                  className="group relative w-full py-4 bg-gradient-to-r from-warning-600 to-warning-700 hover:from-warning-500 hover:to-warning-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-warning-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={loading}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">📧</span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-warning-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-gradient-to-r from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">✅</span>
                </div>

                {/* Email Display */}
                <div className="p-4 bg-neutral-800/30 rounded-xl border border-neutral-600/50">
                  <p className="text-sm text-neutral-400 mb-1">Reset link sent to:</p>
                  <p className="text-white font-medium">{email}</p>
                </div>

                {/* Instructions */}
                <div className="text-left space-y-3 p-4 bg-primary-600/10 rounded-xl border border-primary-600/20">
                  <h3 className="text-white font-semibold text-sm">Next Steps:</h3>
                  <ul className="text-sm text-neutral-300 space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary-400 mr-2">1.</span>
                      Check your email inbox (and spam folder)
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-400 mr-2">2.</span>
                      Click the reset link in the email
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-400 mr-2">3.</span>
                      Create a new password
                    </li>
                  </ul>
                </div>

                {/* Resend Button */}
                <button
                  onClick={handleResendEmail}
                  disabled={countdown > 0 || loading}
                  className="group relative w-full py-3 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-600/50 hover:border-neutral-500 text-white font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Resending...
                      </>
                    ) : countdown > 0 ? (
                      <>
                        Resend in {countdown}s
                        <span className="ml-2">⏱️</span>
                      </>
                    ) : (
                      <>
                        Resend Email
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">📧</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            )}

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-neutral-400 hover:text-primary-300 transition-colors group"
              >
                <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                Back to Sign In
              </Link>
            </div>
          </div>

          {/* Help Section */}
          <div className="text-center mt-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="inline-flex items-center px-4 py-2 glass-light rounded-full">
              <div className="w-2 h-2 bg-warning-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs text-neutral-400">
                {emailSent
                  ? "Didn't receive the email? Check your spam folder"
                  : "Remember your password?"
                }
              </span>
              {!emailSent && (
                <Link to="/login" className="text-primary-400 hover:text-primary-300 ml-1 text-xs font-medium">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}