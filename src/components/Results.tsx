import Card from './Card';
import type { Movie } from '@/lib/types';

export default function Results({
  results,
}: {
  results: Movie[];
}) {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {results.map((movie) => (
        <Card key={movie.imdbID} result={movie} />
      ))}
    </section>
  );
}