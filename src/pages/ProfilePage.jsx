import React from "react";

export default function ProfilePage({ user, userLoading }) {
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-secondary-950 to-dark-950 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-24">
          <div className="glass p-8 rounded-3xl shadow-2xl animate-slide-up">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
              <p className="text-neutral-300">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-secondary-950 to-dark-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-24">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl mb-6 shadow-lg">
              <span className="text-3xl font-bold text-white">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {user?.username || "User Profile"}
            </h1>
            <p className="text-neutral-400">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="glass p-8 rounded-3xl shadow-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-6">
              {/* User Info Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white border-b border-neutral-700/50 pb-2">
                  Account Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-400">Username</label>
                    <div className="p-4 bg-neutral-800/30 rounded-xl border border-neutral-600/50">
                      <span className="text-white">{user?.username || "Not available"}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-400">Email</label>
                    <div className="p-4 bg-neutral-800/30 rounded-xl border border-neutral-600/50">
                      <span className="text-white">{user?.email || "Not available"}</span>
                    </div>
                  </div>
                </div>

                {user?.createdAt && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-400">Member Since</label>
                    <div className="p-4 bg-neutral-800/30 rounded-xl border border-neutral-600/50">
                      <span className="text-white">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-light p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-primary-400 mb-1">0</div>
                  <div className="text-sm text-neutral-400">Projects</div>
                </div>

                <div className="glass-light p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-accent-400 mb-1">0</div>
                  <div className="text-sm text-neutral-400">Tasks</div>
                </div>

                <div className="glass-light p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-success-400 mb-1">Premium</div>
                  <div className="text-sm text-neutral-400">Plan</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-700/50">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25">
                    Edit Profile
                  </button>

                  <button className="flex-1 py-3 px-6 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-600/50 hover:border-neutral-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="text-center mt-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
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
}
