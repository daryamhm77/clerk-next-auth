import Card from './Card';
import { getTrending } from '@/lib/api';

export default async function HomeMovieGrid() {
  const movies = await getTrending();
  const display = movies.slice(0, 10);

  if (display.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Trending This Week
        </h2>
        <a
          href="/top/trending"
          className="text-sm font-semibold text-amber-500 transition hover:text-amber-400"
        >
          View All &rarr;
        </a>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {display.map((movie) => (
          <Card key={movie.imdbID} result={movie} />
        ))}
      </div>
    </section>
  );
}
