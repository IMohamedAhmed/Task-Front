import React, { useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default React.memo(function Navbar({ token, user, userLoading, handleLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuToggle = useCallback(() => setIsMenuOpen(!isMenuOpen), [isMenuOpen]);
  const handleMenuClose = useCallback(() => setIsMenuOpen(false), []);

  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Background with Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 via-neutral-900/90 to-secondary-900/90 backdrop-blur-xl border-b border-neutral-700/30"></div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary-600/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent-600/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link
            to="/"
            className="group flex items-center no-underline text-white hover:text-primary-300 transition-all duration-500"
          >
            <div className="relative mr-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 p-2 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-primary-500/25">
                <div className="w-full h-full rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-lg font-black text-white">T</span>
                </div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-300"></div>
            </div>

            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-white via-neutral-100 to-primary-200 bg-clip-text text-transparent group-hover:from-primary-300 group-hover:via-accent-300 group-hover:to-primary-400 transition-all duration-500">
                Tasky
              </span>
              <span className="text-xs text-neutral-400 group-hover:text-primary-400 transition-colors duration-300 font-medium tracking-wider">
                PRODUCTIVITY
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {token && (
              <>
                <Link
                  to="/projects"
                  className="group relative px-4 py-2 text-neutral-300 hover:text-white transition-all duration-300 font-medium"
                >
                  <span className="relative z-10">Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600/0 to-accent-600/0 group-hover:from-primary-600/20 group-hover:to-accent-600/20 rounded-lg transition-all duration-300"></div>
                </Link>

              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {!token ? (
              isHomePage ? (
                // On homepage, show minimal subtle link
                <div className="hidden sm:block">
                  <span className="text-sm text-neutral-400 font-medium tracking-wide">
                    ✨ Ready to get productive?
                  </span>
                </div>
              ) : (
                // On other pages, show full auth buttons
                <div className="flex items-center gap-3">
                  <Link
                    to="/register"
                    className="hidden sm:block px-6 py-2.5 text-neutral-300 hover:text-white font-medium transition-all duration-300 hover:bg-white/5 rounded-xl"
                  >
                    Sign Up
                  </Link>

                  <Link
                    to="/login"
                    className="group relative px-6 py-2.5 font-semibold rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-500 hover:to-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25 no-underline"
                  >
                    <span className="relative z-10 flex items-center">
                      Sign In
                      <span className="ml-2 group-hover:translate-x-0.5 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-primary-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>
              )
            ) : (
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2.5 text-neutral-400 hover:text-white transition-colors duration-300 hover:bg-white/5 rounded-xl">
                  <span className="text-xl">🔔</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full animate-pulse"></div>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={handleMenuToggle}
                    className="group flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-all duration-300"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 p-0.5 group-hover:scale-105 transition-all duration-300">
                        <div className="w-full h-full rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {userLoading ? "..." : (user?.username?.charAt(0)?.toUpperCase() || "U")}
                          </span>
                        </div>
                      </div>
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl opacity-0 group-hover:opacity-50 blur transition-all duration-300"></div>
                    </div>

                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-medium text-white">
                        {userLoading ? "Loading..." : (user?.username || "User")}
                      </div>
                      <div className="text-xs text-neutral-400">Premium</div>
                    </div>

                    <span className="text-neutral-400 group-hover:text-white transition-colors text-sm">▼</span>
                  </button>

                  {/* Custom Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 glass rounded-2xl shadow-2xl border border-neutral-700/50 animate-slide-up">
                      <div className="p-4">
                        {/* User Info */}
                        <div className="flex items-center gap-3 pb-4 border-b border-neutral-700/50">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                            <span className="text-white font-bold">
                              {userLoading ? "..." : (user?.username?.charAt(0)?.toUpperCase() || "U")}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-semibold truncate">
                              {userLoading ? "Loading..." : (user?.username || "User Name")}
                            </div>
                            <div className="text-neutral-400 text-sm truncate">
                              {userLoading ? "Loading..." : (user?.email || "user@example.com")}
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2 space-y-1">
                          <button
                            onClick={() => {
                              handleMenuClose();
                              navigate("/profile");
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group"
                          >
                            <span className="text-lg">👤</span>
                            <span className="font-medium">Profile Settings</span>
                            <span className="ml-auto group-hover:translate-x-1 transition-transform">→</span>
                          </button>

                          <button
                            onClick={() => {
                              handleMenuClose();
                              navigate("/projects");
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group md:hidden"
                          >
                            <span className="text-lg">📊</span>
                            <span className="font-medium">Dashboard</span>
                            <span className="ml-auto group-hover:translate-x-1 transition-transform">→</span>
                          </button>

                        </div>

                        {/* Logout */}
                        <div className="pt-2 border-t border-neutral-700/50">
                          <button
                            onClick={() => {
                              handleMenuClose();
                              handleLogout();
                              navigate("/login");
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-danger-400 hover:text-danger-300 hover:bg-danger-500/10 rounded-xl transition-all duration-200 group"
                          >
                            <span className="text-lg">🚪</span>
                            <span className="font-medium">Sign Out</span>
                            <span className="ml-auto group-hover:translate-x-1 transition-transform">→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={handleMenuClose}
        />
      )}
    </nav>
  );
});
