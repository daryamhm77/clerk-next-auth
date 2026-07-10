import type { Metadata } from 'next';
import Results from '@/components/Results';

interface GenrePageProps {
  params: Promise<{
    genre: string;
  }>;
}

export async function generateMetadata({
  params,
}: GenrePageProps): Promise<Metadata> {
  const { genre } = await params;
  const title = genre === 'top_rated' ? 'Top Rated' : 'Trending';
  return {
    title: `${title} Movies`,
    description: `Browse ${title.toLowerCase()} movies and TV shows`,
  };
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { genre } = await params;

  const res = await fetch(
    `https://api.themoviedb.org/3${
      genre === 'top_rated' ? '/movie/top_rated' : '/trending/all/week'
    }?api_key=${process.env.API_KEY}&language=en-US&page=1`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) throw new Error('Failed to fetch data');

  const data = await res.json();

  const results = (data.results ?? []).map(
    (item: {
      id: number;
      title?: string;
      name?: string;
      release_date?: string;
      first_air_date?: string;
      media_type?: string;
      poster_path?: string;
    }) => ({
      imdbID: String(item.id),
      Title: item.title ?? item.name ?? 'Untitled',
      Year: (item.release_date ?? item.first_air_date ?? '').slice(0, 4),
      Type: item.media_type ?? (genre === 'top_rated' ? 'movie' : ''),
      Poster: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : 'N/A',
    })
  );

  return (
    <div className="mx-auto max-w-7xl">
      {results.length === 0 ? (
        <h1 className="pt-10 text-center text-2xl font-semibold text-gray-400">
          No results found
        </h1>
      ) : (
        <Results results={results} />
      )}
    </div>
  );
}
