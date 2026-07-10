"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import ThemeSwitch from "./ThemeSwitch";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Trending", href: "/top/trending" },
  { label: "Top Rated", href: "/top/top_rated" },
];

const Header = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-red-900/30 bg-black/70 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
      <div className="absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-red-600/20 blur-[120px]" />

      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-600 to-red-900 shadow-[0_0_30px_rgba(239,68,68,0.35)]">
            🎞️
          </div>

          <div>
            <h1 className="text-xl font-black tracking-wider text-white">
              Imdb<span className="text-red-500">Tracker</span>
            </h1>
            <p className="text-xs text-gray-500">Track • Analyze • Discover</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative text-sm font-medium transition duration-300 ${
                  isActive ? "text-red-400" : "text-gray-300 hover:text-red-400"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-2 left-0 h-0.5 bg-red-500 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeSwitch />

          <button
            className="text-white md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="hidden rounded-xl border border-red-500/40 px-5 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-600 hover:text-white md:inline-block">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="hidden rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 md:inline-block">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/favorites"
              className="hidden text-sm font-semibold text-gray-300 transition hover:text-red-400 md:inline"
            >
              Favorites
            </Link>
            <div className="hidden md:block">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-red-900/30 bg-black/95 px-6 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium transition ${
                    isActive ? "text-red-400" : "text-gray-300 hover:text-red-400"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <SignedIn>
              <Link
                href="/favorites"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-gray-300 transition hover:text-red-400"
              >
                Favorites
              </Link>
            </SignedIn>

            <div className="flex items-center gap-4 pt-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="rounded-xl border border-red-500/40 px-5 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-600 hover:text-white">
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
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
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
