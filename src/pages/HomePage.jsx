import React from "react";
import { Link } from "react-router-dom";

export default function HomePage({ token }) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-primary-950 via-secondary-950 to-dark-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 py-12">
        <div className="max-w-5xl mx-auto text-center">
          {/* Hero Section */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 mb-8 glass-light rounded-full">
              <div className="w-2 h-2 bg-success-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-medium text-neutral-300">Boost Your Productivity</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-primary-500">
              Welcome to Tasky
            </h1>

            <p className="text-xl md:text-2xl mb-12 leading-relaxed text-neutral-300 max-w-3xl mx-auto">
              Transform the way you manage tasks with our intelligent,
              <span className="text-accent-400 font-semibold"> beautifully designed </span>
              productivity platform.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-light p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Organization</h3>
              <p className="text-sm text-neutral-400">AI-powered task categorization and priority management</p>
            </div>

            <div className="glass-light p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-sm text-neutral-400">Optimized performance for seamless task management</p>
            </div>

            <div className="glass-light p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-success-500 to-success-600 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Goal Focused</h3>
              <p className="text-sm text-neutral-400">Track progress and achieve your objectives efficiently</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link
              to={token ? "/projects" : "/login"}
              className="group relative inline-flex items-center px-8 py-4 font-bold text-lg rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/25 animate-pulse-glow"
            >
              <span className="relative z-10">Get Started</span>
              <span className="ml-2 text-xl group-hover:translate-x-1 transition-transform">→</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>

            <p className="mt-4 text-sm text-neutral-500">
              {token ? "Continue to your dashboard" : "Join thousands of productive users"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
