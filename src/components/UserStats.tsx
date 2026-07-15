'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface Stats {
  totalFavorites: number;
  totalWatchlist: number;
  totalWatched: number;
  total: number;
  avgRating: string | null;
}

const sampleStats = [
  { label: 'Watched', value: '47' },
  { label: 'Avg Rating', value: '7.8' },
  { label: 'Watchlist', value: '12' },
];

export default function UserStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    fetch('/api/user/dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error && data.stats) {
          setStats(data.stats);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[74px] animate-pulse rounded-xl border border-card-border bg-card"
          />
        ))}
      </div>
    );
  }

  const display = stats
    ? [
        { label: 'Watched', value: String(stats.totalWatched) },
        { label: 'Avg Rating', value: stats.avgRating ?? '—' },
        { label: 'Watchlist', value: String(stats.totalWatchlist) },
      ]
    : sampleStats;

  return (
    <div className="mt-6 grid grid-cols-3 gap-3">
      {display.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-card-border bg-card p-3 text-center"
        >
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            {stat.value}
          </p>
          <p className="text-xs text-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
