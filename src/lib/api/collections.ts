import { Movie } from '@/lib/types';
import { getMovieById } from './omdb';

const TRENDING_IDS = [
  'tt15398776', // Oppenheimer
  'tt1517268', // Dune: Part Two
  'tt9362722', // Everything Everywhere All at Once
  'tt1630029', // Avatar: The Way of Water
  'tt6751668', // The Batman
  'tt9114286', // Top Gun: Maverick
  'tt6710474', // Spider-Man: No Way Home
  'tt10872600', // The Super Mario Bros. Movie
  'tt5433140', // A Quiet Place
  'tt4154756', // Avengers: Infinity War
];

const TOP_RATED_IDS = [
  'tt0111161', // The Shawshank Redemption
  'tt0068646', // The Godfather
  'tt0468569', // The Dark Knight
  'tt0071562', // The Godfather Part II
  'tt0050083', // 12 Angry Men
  'tt0108052', // Schindler's List
  'tt0167260', // The Lord of the Rings: The Return of the King
  'tt0110912', // Pulp Fiction
  'tt0080678', // Star Wars: Episode V - The Empire Strikes Back
  'tt0060196', // The Good, the Bad and the Ugly
];

async function getMoviesByIds(ids: string[]): Promise<Movie[]> {
  const results = await Promise.all(
    ids.map((id) => getMovieById(id).catch(() => null))
  );

  return results
    .filter((movie): movie is NonNullable<typeof movie> => movie !== null)
    .map((movie) => ({
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Type: movie.Type,
      Poster: movie.Poster,
    }));
}

export const getTrending = () => getMoviesByIds(TRENDING_IDS);

export const getTopRated = () => getMoviesByIds(TOP_RATED_IDS);
