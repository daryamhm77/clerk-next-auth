'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Card from './Card';
import Loader from './Loader';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/user/recommendations');
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data.recommendations || []);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Recommended For You
          </h2>
        </div>
        <Loader message="Loading recommendations..." />
      </div>
    );
  }

  if (!isSignedIn || recommendations.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Recommended For You
        </h2>
        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-400">
          Based on your taste
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {recommendations.map((movie) => (
          <Card key={movie.imdbID} result={movie} />
        ))}
      </div>
    </section>
  );
}
