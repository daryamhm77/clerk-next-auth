import { Movie } from '@/lib/types';
import { API_KEY } from '@/lib/env';

const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';

function normalizeItem(item: {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  poster_path?: string | null;
}): Movie {
  return {
    imdbID: String(item.id),
    Title: item.title ?? item.name ?? 'Untitled',
    Year: (item.release_date ?? item.first_air_date ?? '').slice(0, 4),
    Type: item.media_type ?? 'movie',
    Poster: item.poster_path ? `${TMDB_IMG}${item.poster_path}` : '',
  };
}

export async function getTrending(): Promise<Movie[]> {
  if (!API_KEY) return [];

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).map(normalizeItem);
  } catch {
    return [];
  }
}

export async function getTopRated(): Promise<Movie[]> {
  if (!API_KEY) return [];

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).map((item: Parameters<typeof normalizeItem>[0]) =>
      normalizeItem({ ...item, media_type: 'movie' })
    );
  } catch {
    return [];
  }
}
