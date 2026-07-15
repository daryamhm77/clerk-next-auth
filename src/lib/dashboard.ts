import type { UserFavItem, RecentlyViewedItem } from './types';

export interface DashboardStats {
  totalFavorites: number;
  totalWatchlist: number;
  totalWatched: number;
  total: number;
  avgRating: string | null;
}

export interface DashboardData {
  stats: DashboardStats;
  recentlyViewed: RecentlyViewedItem[];
  topRated: UserFavItem[];
}

/** Map mongoose subdocuments to plain serializable objects. */
export function toFavItems(favs: UserFavItem[] | undefined): UserFavItem[] {
  return (favs ?? []).map((f) => ({
    movieId: f.movieId,
    title: f.title,
    image: f.image,
    description: f.description,
    dateReleased: f.dateReleased,
    rating: f.rating,
    list: f.list,
  }));
}

export function toRecentlyViewedItems(
  items: RecentlyViewedItem[] | undefined
): RecentlyViewedItem[] {
  return (items ?? []).map((v) => ({
    movieId: v.movieId,
    title: v.title,
    image: v.image,
    year: v.year,
  }));
}

export function computeDashboardData(
  favs: UserFavItem[],
  recentlyViewed: RecentlyViewedItem[]
): DashboardData {
  const totalFavorites = favs.filter((f) => f.list === 'favorite').length;
  const totalWatchlist = favs.filter((f) => f.list === 'watchlist').length;
  const totalWatched = favs.filter((f) => f.list === 'watched').length;

  // A movie may be in several lists at once; dedupe by movieId
  const uniqueMovies = new Map<string, UserFavItem>();
  for (const f of favs) {
    if (!uniqueMovies.has(f.movieId)) {
      uniqueMovies.set(f.movieId, f);
    }
  }

  const ratedMovies = [...uniqueMovies.values()].filter(
    (f) => f.rating && f.rating !== 'N/A'
  );

  const topRated = [...ratedMovies]
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 10);

  const avgRating =
    ratedMovies.length > 0
      ? (
          ratedMovies.reduce((sum, f) => sum + parseFloat(f.rating), 0) /
          ratedMovies.length
        ).toFixed(1)
      : null;

  return {
    stats: {
      totalFavorites,
      totalWatchlist,
      totalWatched,
      total: uniqueMovies.size,
      avgRating,
    },
    recentlyViewed: recentlyViewed.slice(0, 10),
    topRated,
  };
}
