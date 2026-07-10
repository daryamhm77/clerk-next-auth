import Card from './Card';

interface MovieItem {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  poster_path?: string;
}

export default async function HomeMovieGrid() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.API_KEY}&language=en-US&page=1`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return null;

  const data = await res.json();

  const movies = (data.results ?? []).slice(0, 10).map(
    (item: MovieItem) => ({
      imdbID: String(item.id),
      Title: item.title ?? item.name ?? 'Untitled',
      Year: (item.release_date ?? item.first_air_date ?? '').slice(0, 4),
      Type: item.media_type ?? 'movie',
      Poster: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : 'N/A',
    })
  );

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
        {movies.map((movie: { imdbID: string; Title: string; Year: string; Type: string; Poster: string }) => (
          <Card key={movie.imdbID} result={movie} />
        ))}
      </div>
    </section>
  );
}
