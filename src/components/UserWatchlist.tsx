'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { MdStar } from 'react-icons/md';

interface WatchlistItem {
  movieId: string;
  title: string;
  image: string;
  rating: string;
  dateReleased: string;
  list: string;
}

export default function UserWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    const fetchWatchlist = async () => {
      try {
        const res = await fetch('/api/user/fav?list=watchlist');
        if (res.ok) {
          const data = await res.json();
          setWatchlist(data.favs?.slice(0, 4) || []);
        }
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-card" />
        ))}
      </div>
    );
  }

  if (!isSignedIn || watchlist.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {watchlist.map((item) => (
        <Link
          key={item.movieId}
          href={`/movie/${item.movieId}`}
          className="flex items-center gap-4 rounded-2xl border border-card-border bg-card p-4 transition hover:border-red-500/20"
        >
          <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={item.image || 'https://placehold.co/100x150/171717/ffffff?text=N/A'}
              alt={item.title}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{item.title}</p>
            <p className="text-xs text-muted">
              {item.dateReleased} · Watchlist
            </p>
          </div>
          {item.rating && item.rating !== 'N/A' && (
            <div className="flex items-center gap-1 text-amber-400">
              <MdStar size={14} />
              <span className="font-bold">{item.rating}</span>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
