import type { Metadata } from 'next';
import Results from '@/components/Results';
import { getTrending, getTopRated } from '@/lib/api';

// Curated lists change rarely: prerender both pages, refresh hourly.
export const revalidate = 3600;

export function generateStaticParams() {
  return [{ genre: 'trending' }, { genre: 'top_rated' }];
}

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

  const movies =
    genre === 'top_rated' ? await getTopRated() : await getTrending();

  return (
    <div className="mx-auto max-w-7xl">
      {movies.length === 0 ? (
        <h1 className="pt-10 text-center text-2xl font-semibold text-muted">
          No results found
        </h1>
      ) : (
        <Results results={movies} />
      )}
    </div>
  );
}
