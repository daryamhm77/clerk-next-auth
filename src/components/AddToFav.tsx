'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  MdFavorite,
  MdFavoriteBorder,
  MdBookmarkBorder,
  MdBookmark,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md';
import { useToast } from './Toast';

interface AddToFavProps {
  movieId: string;
  title: string;
  image: string;
  description: string;
  dateReleased: string;
  rating: string;
}

type ListType = 'favorite' | 'watchlist' | 'watched';

const listConfig: Record<ListType, { icon: React.ReactNode; iconActive: React.ReactNode; label: string; activeLabel: string }> = {
  favorite: {
    icon: <MdFavoriteBorder size={20} />,
    iconActive: <MdFavorite size={20} />,
    label: 'Favorite',
    activeLabel: 'Favorited',
  },
  watchlist: {
    icon: <MdBookmarkBorder size={20} />,
    iconActive: <MdBookmark size={20} />,
    label: 'Watchlist',
    activeLabel: 'In Watchlist',
  },
  watched: {
    icon: <MdVisibilityOff size={20} />,
    iconActive: <MdVisibility size={20} />,
    label: 'Watched',
    activeLabel: 'Watched',
  },
};

export default function AddToFav({
  movieId,
  title,
  image,
  description,
  dateReleased,
  rating,
}: AddToFavProps) {
  const [currentList, setCurrentList] = useState<ListType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const favs = user.publicMetadata?.favs as
        | { movieId: string; list: string }[]
        | undefined;
      const found = favs?.find((f) => f.movieId === movieId);
      setCurrentList((found?.list as ListType) ?? null);
    }
  }, [movieId, isLoaded, isSignedIn, user]);

  const handleClick = async (list: ListType) => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/user/fav', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId,
          title,
          description,
          dateReleased,
          rating,
          image,
          list,
        }),
      });

      if (res.ok) {
        const newList = currentList === list ? null : list;
        setCurrentList(newList);
        if (newList) {
          showToast(`Added "${title}" to ${listConfig[newList].label}`);
        } else {
          showToast(`Removed "${title}"`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(listConfig) as ListType[]).map((list) => {
        const active = currentList === list;
        const cfg = listConfig[list];
        return (
          <button
            key={list}
            onClick={() => handleClick(list)}
            disabled={isLoading}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              active
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'border border-card-border text-foreground hover:border-red-500 hover:text-red-500'
            }`}
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : active ? (
              cfg.iconActive
            ) : (
              cfg.icon
            )}
            {active ? cfg.activeLabel : cfg.label}
          </button>
        );
      })}
    </div>
  );
}
