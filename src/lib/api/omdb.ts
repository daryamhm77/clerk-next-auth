import { Movie, MovieDetail } from '@/lib/types';
import { OMDB_API_KEY } from '@/lib/env';

function normalizeMovie(item: {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}): Movie {
  return {
    imdbID: item.imdbID,
    Title: item.Title,
    Year: item.Year,
    Type: item.Type,
    Poster: item.Poster !== 'N/A' ? item.Poster : '',
  };
}

export async function searchMovies(
  term: string,
  filters?: { y?: string; type?: string; page?: number }
): Promise<{ movies: Movie[]; totalResults: number }> {
  const url = new URL('https://www.omdbapi.com');
  url.searchParams.set('apikey', OMDB_API_KEY);
  url.searchParams.set('s', term);
  if (filters?.y) url.searchParams.set('y', filters.y);
  if (filters?.type) url.searchParams.set('type', filters.type);
  url.searchParams.set('page', String(filters?.page ?? 1));

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) return { movies: [], totalResults: 0 };

  const data = await res.json();
  return {
    movies: (data.Search ?? []).map(normalizeMovie),
    totalResults: parseInt(data.totalResults || '0', 10),
  };
}

export async function getMovieById(id: string): Promise<MovieDetail | null> {
  const url = new URL('https://www.omdbapi.com');
  url.searchParams.set('apikey', OMDB_API_KEY);
  url.searchParams.set('i', id);
  url.searchParams.set('plot', 'full');

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) return null;

  const data = await res.json();
  if (data.Error) return null;

  return data as MovieDetail;
}
