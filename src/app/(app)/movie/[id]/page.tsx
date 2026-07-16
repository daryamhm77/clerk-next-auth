import type { Metadata } from 'next';
import Link from 'next/link';
import MovieDetail from '@/components/MovieDetail';
import { getMovieById } from '@/lib/api';

// Movie metadata is effectively immutable: cache each visited page (ISR)
// and refresh hourly. User-specific bits (AddToFav, RecordView) are client
// components that fetch after hydration, so they stay per-user.
export const revalidate = 3600;

interface MovieDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: MovieDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieById(id);

  if (!movie) return { title: 'Movie not found' };

  return {
    title: `${movie.Title} (${movie.Year})`,
    description: movie.Plot || `${movie.Title} movie details`,
    openGraph: {
      title: movie.Title,
      description: movie.Plot || undefined,
      images: movie.Poster ? [{ url: movie.Poster }] : [],
    },
  };
}

export default async function MovieDetailPage({
  params,
}: MovieDetailPageProps) {
  const { id } = await params;
  const movie = await getMovieById(id);

  if (!movie) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-400">
            Movie not found
          </h1>
          <Link
            href="/"
            className="rounded-lg bg-amber-500 px-6 py-2 font-semibold text-black transition hover:bg-amber-400"
          >
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return <MovieDetail movie={movie} />;
}
