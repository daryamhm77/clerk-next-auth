'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import {
  MdFavorite,
  MdBookmark,
  MdVisibility,
  MdStar,
  MdHistory,
} from 'react-icons/md';
import Loader from './Loader';

interface Stats {
  totalFavorites: number;
  totalWatchlist: number;
  totalWatched: number;
  total: number;
}

interface FavItem {
  movieId: string;
  title: string;
  image: string;
  rating: string;
}

interface ViewedItem {
  movieId: string;
  title: string;
  image: string;
  year: string;
}

export default function DashboardContent() {
  const [data, setData] = useState<{
    stats: Stats;
    recentlyViewed: ViewedItem[];
    topRated: FavItem[];
  } | null>(null);
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
      .then(setData)
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) return <Loader message="Loading dashboard..." />;

  if (!isSignedIn) {
    return (
      <div className="pt-10 text-center">
        <h1 className="text-xl text-muted">
          Please sign in to view your dashboard
        </h1>
      </div>
    );
  }

  if (!data) return null;

  const { stats, recentlyViewed, topRated } = data;

  const statCards = [
    { label: 'Favorites', value: stats.totalFavorites, icon: <MdFavorite size={24} />, color: 'text-red-500' },
    { label: 'Watchlist', value: stats.totalWatchlist, icon: <MdBookmark size={24} />, color: 'text-amber-500' },
    { label: 'Watched', value: stats.totalWatched, icon: <MdVisibility size={24} />, color: 'text-green-500' },
    { label: 'Total', value: stats.total, icon: <MdStar size={24} />, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-4 text-xl font-bold text-white">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-card-border bg-card p-5"
            >
              <div className={`mb-2 ${card.color}`}>{card.icon}</div>
              <p className="text-3xl font-black text-white">{card.value}</p>
              <p className="mt-1 text-sm text-muted">{card.label}</p>
            </div>
          ))}
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <MdHistory size={20} className="text-muted" />
            <h2 className="text-xl font-bold text-white">Recently Viewed</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {recentlyViewed.map((item) => (
              <Link
                key={item.movieId}
                href={`/movie/${item.movieId}`}
                className="group"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-card-border">
                  <Image
                    src={item.image || 'https://placehold.co/300x450/171717/ffffff?text=N/A'}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 truncate text-sm font-medium text-foreground group-hover:text-foreground">
                  {item.title}
                </p>
                {item.year && (
                  <p className="text-xs text-muted">{item.year}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {topRated.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <MdStar size={20} className="text-amber-500" />
            <h2 className="text-xl font-bold text-white">Top Rated Favorites</h2>
          </div>
          <div className="space-y-3">
            {topRated.map((item, i) => (
              <Link
                key={item.movieId}
                href={`/movie/${item.movieId}`}
                className="flex items-center gap-4 rounded-xl border border-card-border bg-card p-4 transition hover:border-amber-500"
              >
                <span className="w-6 text-center text-lg font-bold text-muted">
                  {i + 1}
                </span>
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={item.image || 'https://placehold.co/100x150/171717/ffffff?text=N/A'}
                    alt={item.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{item.title}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <MdStar size={16} />
                  <span className="font-semibold">{item.rating}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
