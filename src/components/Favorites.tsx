'use client';

import { useState } from 'react';
import Results from '@/components/Results';
import type { UserFavItem } from '@/lib/types';

const tabs = [
  { key: 'favorite', label: 'Favorites' },
  { key: 'watchlist', label: 'Watchlist' },
  { key: 'watched', label: 'Watched' },
];

export default function Favorites({ favs }: { favs: UserFavItem[] }) {
  const [activeTab, setActiveTab] = useState('favorite');

  const visible = favs.filter((fav) => fav.list === activeTab);

  return (
    <div>
      <div className="mb-6 flex gap-4 border-b border-card-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 text-sm font-semibold transition ${
              activeTab === tab.key
                ? 'border-b-2 border-red-500 text-red-400'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <h1 className="pt-10 text-center text-2xl font-semibold text-muted">
          Nothing here yet
        </h1>
      ) : (
        <Results
          results={visible.map((fav) => ({
            imdbID: fav.movieId,
            Title: fav.title,
            Year: fav.dateReleased,
            Type: 'movie',
            Poster: fav.image || 'N/A',
          }))}
        />
      )}
    </div>
  );
}
