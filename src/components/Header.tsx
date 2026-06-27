"use client";

import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-red-900/30 bg-black/70 backdrop-blur-xl">
      {/* Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
      <div className="absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-red-600/20 blur-[120px]" />

      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-600 to-red-900 shadow-[0_0_30px_rgba(239,68,68,0.35)]">
            🎞️
          </div>

          <div>
            <h1 className="text-xl font-black tracking-wider text-white">
              Imdb<span className="text-red-500">Tracker</span>
            </h1>
            <p className="text-xs text-gray-500">
              Track • Analyze • Improve
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {["Dashboard", "Analytics", "Sleep", "Profile"].map((item) => (
            <a
              key={item}
              href="#"
              className="group relative text-sm font-medium text-gray-300 transition duration-300 hover:text-red-400"
            >
              {item}
              <span className="absolute -bottom-2 left-0 h-0.5 w-0 bg-red-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-xl border border-red-500/40 px-5 py-2 text-sm font-semibold text-red-400 hover:bg-red-600 hover:text-white transition">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;