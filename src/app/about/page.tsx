import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";

const techStack = [
  { name: "Next.js 15", role: "App framework & SSR" },
  { name: "Clerk", role: "Authentication & user management" },
  { name: "MongoDB", role: "User profiles & watch data" },
  { name: "Chart.js", role: "Viewing analytics & insights" },
  { name: "Tailwind CSS", role: "Cinema-inspired UI" },
];

const values = [
  {
    title: "Passion for Film",
    description:
      "We built IMDb Tracker because keeping a personal film log shouldn't require spreadsheets or scattered notes. Every feature exists to celebrate the art of cinema.",
    icon: "🎭",
  },
  {
    title: "Privacy First",
    description:
      "Your watch history is yours. We sync only what you need for the app to work — no selling data, no creepy tracking beyond your own stats.",
    icon: "🔒",
  },
  {
    title: "Insight Over Noise",
    description:
      "Instead of endless feeds, we focus on meaningful analytics: genre trends, rating patterns, and goals that help you watch more intentionally.",
    icon: "✨",
  },
];

export const metadata = {
  title: "About Us | IMDb Tracker",
  description:
    "Learn about IMDb Tracker — the personal movie logging and analytics app for film enthusiasts.",
};

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-red-600/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-amber-500/5 blur-[80px]" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-4xl px-6 pb-16 pt-16 text-center md:pt-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-red-400">
          About IMDb Tracker
        </p>
        <h1 className="text-4xl font-black leading-tight md:text-6xl">
          Your personal{" "}
          <span className="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
            film archive
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          IMDb Tracker helps movie lovers log what they watch, rate their
          favorites, and understand their viewing habits through beautiful
          analytics. Think of it as a digital scrapbook for your cinematic life
          — powered by modern web technology.
        </p>
      </section>

      {/* Mission */}
      <section className="relative border-t border-card-border py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black md:text-4xl">Our Mission</h2>
            <p className="mt-6 leading-relaxed text-muted">
              Streaming has made more films accessible than ever, but it&apos;s
              also easier to forget what you&apos;ve seen. IMDb Tracker exists
              to solve that — giving every viewer a persistent, searchable
              record of their film journey.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Whether you&apos;re a casual weekend watcher or a dedicated
              cinephile chasing a 100-film year, our tools adapt to how{" "}
              <em>you</em> watch. Log films in seconds, revisit your ratings,
              and let the charts tell the story of your taste over time.
            </p>
          </div>

          <div className="rounded-3xl border border-card-border bg-gradient-to-br from-card to-background p-8">
            <div className="mb-6 text-6xl">🎬</div>
            <blockquote className="text-xl font-medium leading-relaxed text-foreground">
              &ldquo;The best movie tracker is the one you actually use. We
              designed every screen to be fast, dark, and distraction-free —
              like a theater before the lights dim.&rdquo;
            </blockquote>
            <p className="mt-6 text-sm text-muted">
              — The IMDb Tracker Team
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative border-t border-card-border bg-card/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-3xl font-black md:text-4xl">
            What We Stand For
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-card-border bg-card p-8"
              >
                <div className="mb-4 text-4xl">{value.icon}</div>
                <h3 className="mb-3 text-xl font-bold">{value.title}</h3>
                <p className="text-sm leading-relaxed text-muted">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black md:text-4xl">Built With</h2>
            <p className="mt-4 text-muted">
              A modern, production-ready stack chosen for speed, security, and
              scalability.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-4 rounded-xl border border-card-border bg-card px-6 py-4"
              >
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div>
                  <p className="font-semibold">{tech.name}</p>
                  <p className="text-sm text-muted">{tech.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap teaser */}
      <section className="relative border-t border-card-border py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-black md:text-4xl">What&apos;s Next</h2>
          <p className="mt-4 text-muted">
            We&apos;re actively building out the core experience. Here&apos;s
            what&apos;s on the horizon:
          </p>
          <ul className="mt-8 space-y-3 text-left">
            {[
              "Full IMDb API integration for search & metadata",
              "Personal dashboard with watch history & filters",
              "Interactive charts — genres, ratings, directors",
              "Watchlist & yearly goal tracking",
              "Social features — share lists with friends",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-xl border border-card-border bg-card px-5 py-3 text-sm text-foreground"
              >
                <span className="text-red-400">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-card-border pb-24 pt-16">
        <div className="mx-auto max-w-xl px-6 text-center">
          <h2 className="text-2xl font-black">Ready to start your log?</h2>
          <p className="mt-3 text-muted">
            Create a free account and begin tracking today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <SignUpButton mode="modal">
              <button className="rounded-2xl bg-red-600 px-8 py-3 font-bold text-white transition hover:bg-red-500">
                Sign Up Free
              </button>
            </SignUpButton>
            <Link
              href="/"
              className="rounded-2xl border border-card-border px-8 py-3 font-semibold text-foreground transition hover:border-red-500/40"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
