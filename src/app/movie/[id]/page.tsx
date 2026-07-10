import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MdMovie, MdStar, MdCalendarToday, MdLanguage } from 'react-icons/md';
import AddToFav from '@/components/AddToFav';
import RecordView from '@/components/RecordView';

interface MovieDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: MovieDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${encodeURIComponent(
      id
    )}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return { title: 'Movie not found' };

  const movie = await res.json();

  if (movie.Error) return { title: 'Movie not found' };

  return {
    title: `${movie.Title} (${movie.Year})`,
    description: movie.Plot !== 'N/A' ? movie.Plot : `${movie.Title} movie details`,
    openGraph: {
      title: movie.Title,
      description: movie.Plot !== 'N/A' ? movie.Plot : undefined,
      images: movie.Poster !== 'N/A' ? [{ url: movie.Poster }] : [],
    },
  };
}

export default async function MovieDetailPage({
  params,
}: MovieDetailPageProps) {
  const { id } = await params;

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${encodeURIComponent(
      id
    )}&plot=full`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) throw new Error('Failed to fetch movie details');

  const movie = await res.json();

  if (movie.Error) {
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

  const poster =
    movie.Poster !== 'N/A'
      ? movie.Poster
      : 'https://placehold.co/500x750/171717/ffffff?text=No+Poster';

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <RecordView
        movieId={movie.imdbID}
        title={movie.Title}
        image={poster}
        year={movie.Year}
      />
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-amber-500"
      >
        &larr; Back to search
      </Link>

      <div className="grid gap-10 md:grid-cols-[400px_1fr]">
        <div className="relative h-[600px] w-full">
          <Image
            src={poster}
            alt={movie.Title}
            fill
            sizes="400px"
            className="rounded-xl border border-neutral-800 object-cover shadow-lg"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA="
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {movie.Title}{' '}
              <span className="text-xl text-gray-400">({movie.Year})</span>
            </h1>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-400">
              {movie.Rated !== 'N/A' && (
                <span className="rounded-md border border-neutral-700 px-2 py-1">
                  {movie.Rated}
                </span>
              )}
              {movie.Runtime !== 'N/A' && (
                <span className="rounded-md border border-neutral-700 px-2 py-1">
                  {movie.Runtime}
                </span>
              )}
              {movie.Genre !== 'N/A' && (
                <span className="rounded-md border border-neutral-700 px-2 py-1">
                  {movie.Genre}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            {movie.imdbRating !== 'N/A' && (
              <div className="flex items-center gap-2 text-amber-500">
                <MdStar size={20} />
                <span className="font-semibold text-white">
                  {movie.imdbRating}/10
                </span>
              </div>
            )}
            {movie.Year !== 'N/A' && (
              <div className="flex items-center gap-2 text-gray-400">
                <MdCalendarToday size={18} />
                <span>{movie.Year}</span>
              </div>
            )}
            {movie.Language !== 'N/A' && (
              <div className="flex items-center gap-2 text-gray-400">
                <MdLanguage size={18} />
                <span>{movie.Language}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-400">
              <MdMovie size={18} />
              <span className="capitalize">{movie.Type}</span>
            </div>
          </div>

          <AddToFav
            movieId={movie.imdbID}
            title={movie.Title}
            image={poster}
            description={movie.Plot !== 'N/A' ? movie.Plot : ''}
            dateReleased={movie.Year}
            rating={movie.imdbRating !== 'N/A' ? movie.imdbRating : ''}
          />

          {movie.Plot !== 'N/A' && (
            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">Plot</h2>
              <p className="leading-relaxed text-gray-300">{movie.Plot}</p>
            </div>
          )}

          {movie.Actors !== 'N/A' && (
            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">Cast</h2>
              <p className="text-gray-300">{movie.Actors}</p>
            </div>
          )}

          {movie.Director !== 'N/A' && (
            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">
                Director
              </h2>
              <p className="text-gray-300">{movie.Director}</p>
            </div>
          )}

          {movie.Ratings && movie.Ratings.length > 0 && (
            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">Ratings</h2>
              <div className="space-y-1">
                {movie.Ratings.map(
                  (rating: { Source: string; Value: string }, i: number) => (
                    <p key={i} className="text-sm text-gray-400">
                      {rating.Source}: {rating.Value}
                    </p>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
