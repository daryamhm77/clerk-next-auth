'use client';

import Results from '@/components/Results';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Loader from './Loader';

interface FavItem {
  movieId: string;
  title: string;
  image: string;
  description: string;
  dateReleased: string;
  rating: string;
  list: string;
}

const tabs = [
  { key: 'favorite', label: 'Favorites' },
  { key: 'watchlist', label: 'Watchlist' },
  { key: 'watched', label: 'Watched' },
];

export default function Favorites() {
  const [favs, setFavs] = useState<FavItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('favorite');
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    const fetchFavs = async () => {
      try {
        const res = await fetch(`/api/user/fav?list=${activeTab}`);
        if (res.ok) {
          const data = await res.json();
          setFavs(data.favs ?? []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchFavs();
  }, [isLoaded, isSignedIn, activeTab]);

  if (!isLoaded || loading) return <Loader message="Loading..." />;

  if (!isSignedIn) {
    return (
      <div className="pt-10 text-center">
        <h1 className="text-xl text-muted">
          Please sign in to view your list
        </h1>
      </div>
    );
  }

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

      {!favs || favs.length === 0 ? (
        <h1 className="pt-10 text-center text-2xl font-semibold text-muted">
          Nothing here yet
        </h1>
      ) : (
        <Results
          results={favs.map((fav) => ({
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
