import { Suspense } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import HomeMovieGrid from "@/components/HomeMovieGrid";
import Loader from "@/components/Loader";
import UserWatchlist from "@/components/UserWatchlist";
import UserStats from "@/components/UserStats";
import Recommendations from "@/components/Recommendations";

const features = [
  {
    icon: "🎬",
    title: "Log Every Watch",
    description:
      "Mark movies as watched, rate them, and jot down quick notes — your personal film diary, always in sync.",
  },
  {
    icon: "📊",
    title: "Visualize Your Taste",
    description:
      "Charts break down your genres, directors, and ratings so you can see patterns in what you love.",
  },
  {
    icon: "🏆",
    title: "Hit Your Goals",
    description:
      "Set yearly watch targets, track streaks, and celebrate milestones as your catalog grows.",
  },
  {
    icon: "🔍",
    title: "Discover Smarter",
    description:
      "Get recommendations based on your history — fewer scrolls, more great picks.",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-background text-foreground">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-red-600/10 blur-[120px]" />
        <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-amber-500/5 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-red-900/10 blur-[80px]" />
        {/* Film strip pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, currentColor 0px, currentColor 8px, transparent 8px, transparent 24px)",
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 md:pt-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-100 px-4 py-1.5 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Your cinema journey starts here
            </div>

            <h1 className="text-5xl font-black leading-[1.1] tracking-tight md:text-7xl">
              Every film you watch,{" "}
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-amber-400 bg-clip-text text-transparent">
                remembered.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              IMDb Tracker is your personal movie companion — log watches, rate
              favorites, and uncover insights about your viewing habits. Like a
              letterboxd for power users, built with modern tech.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="group relative overflow-hidden rounded-2xl bg-red-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(239,68,68,0.35)] transition hover:bg-red-500">
                    <span className="relative z-10">Start Tracking Free</span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition group-hover:translate-x-full duration-700" />
                  </button>
                </SignUpButton>
                <Link
                  href="/about"
                  className="rounded-2xl border border-card-border px-8 py-4 text-base font-semibold text-foreground transition hover:border-red-500/40"
                >
                  Learn More
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="rounded-2xl bg-red-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(239,68,68,0.35)] transition hover:bg-red-500"
                >
                  Go to Dashboard
                </Link>
              </SignedIn>
            </div>

            <div className="mt-12 flex items-center gap-8 text-sm text-muted">
              <div>
                <p className="text-2xl font-bold text-foreground">10k+</p>
                <p>Films tracked</p>
              </div>
              <div className="h-8 w-px bg-card-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">2.4k</p>
                <p>Active cinephiles</p>
              </div>
              <div className="h-8 w-px bg-card-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">4.9★</p>
                <p>User rating</p>
              </div>
            </div>
          </div>

          {/* Hero visual — mock dashboard card */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-red-600/20 to-transparent blur-2xl" />
            <div className="relative rounded-3xl border border-card-border bg-gradient-to-br from-card to-background p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-muted">
                  Your Watchlist
                </p>
                <span className="rounded-full bg-red-600/20 px-3 py-1 text-xs font-medium text-red-400">
                  This Month
                </span>
              </div>

              <div className="space-y-3">
                <UserWatchlist />
              </div>

              <UserStats />
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="relative border-t border-card-border bg-card/40 py-16">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-6">
              <Loader message="Loading trending..." />
            </div>
          }
        >
          <HomeMovieGrid />
        </Suspense>
      </section>

      {/* Recommendations */}
      <SignedIn>
        <Recommendations />
      </SignedIn>

      {/* Features */}
      <section className="relative border-t border-card-border bg-card/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-black md:text-5xl">
              Built for{" "}
              <span className="text-red-500">movie lovers</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Everything you need to turn casual watching into a curated
              collection you&apos;re proud of.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-card-border bg-card p-6 transition hover:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-950/10"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 text-2xl transition group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-center text-3xl font-black md:text-5xl">
            Three steps to{" "}
            <span className="text-red-500">cinematic clarity</span>
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create your account",
                desc: "Sign up in seconds with Clerk — secure, fast, and hassle-free.",
              },
              {
                step: "02",
                title: "Log your films",
                desc: "Search IMDb's catalog, mark watches, and rate each title.",
              },
              {
                step: "03",
                title: "Explore insights",
                desc: "Charts and stats reveal your taste — genre breakdowns, streaks, and more.",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-100 text-2xl font-black text-red-600 dark:bg-red-950/30 dark:text-red-500">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                <p className="text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-card-border py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-100 to-background p-12 dark:from-red-950/40 dark:to-black">
            <h2 className="text-3xl font-black md:text-4xl">
              Ready to roll the credits on forgetfulness?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">
              Join thousands of film fans who never lose track of a great
              movie again.
            </p>
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="mt-8 rounded-2xl bg-red-600 px-10 py-4 text-base font-bold text-white transition hover:bg-red-500">
                  Get Started — It&apos;s Free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="mt-8 inline-block rounded-2xl bg-red-600 px-10 py-4 text-base font-bold text-white transition hover:bg-red-500"
              >
                Open Your Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>
    </div>
  );
}
