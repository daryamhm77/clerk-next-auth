import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getDbUser } from "@/lib/actions/user";
import { getMovieById } from "@/lib/api";

type FavItem = { movieId: string; rating: string };

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbUser = await getDbUser(user);

    if (!dbUser.favs || dbUser.favs.length === 0) {
      return NextResponse.json({ recommendations: [] }, { status: 200 });
    }

    // Get user's top-rated movies (rating >= 8.0)
    const topRatedMovies = dbUser.favs
      .filter((fav: FavItem) => fav.rating && parseFloat(fav.rating) >= 8.0)
      .slice(0, 5);

    if (topRatedMovies.length === 0) {
      // If no high-rated movies, return top-rated classics
      const classicIds = [
        'tt0111161', // The Shawshank Redemption
        'tt0068646', // The Godfather
        'tt0468569', // The Dark Knight
        'tt0071562', // The Godfather Part II
        'tt0050083', // 12 Angry Men
      ];
      
      const recommendations = [];
      for (const id of classicIds) {
        try {
          const movie = await getMovieById(id);
          if (movie) {
            recommendations.push({
              imdbID: movie.imdbID,
              Title: movie.Title,
              Year: movie.Year,
              Type: movie.Type,
              Poster: movie.Poster,
            });
          }
        } catch {
          continue;
        }
      }
      
      return NextResponse.json({ recommendations }, { status: 200 });
    }

    // Get genres from user's top-rated movies
    const genres = new Set<string>();
    await Promise.all(
      topRatedMovies.map(async (fav: FavItem) => {
        try {
          const movie = await getMovieById(fav.movieId);
          if (movie && movie.Genre) {
            movie.Genre.split(',').forEach((g: string) => genres.add(g.trim()));
          }
        } catch {
          // skip movies that fail to load
        }
      })
    );

    // Get recommendations based on genres (using top-rated movies from those genres)
    const genreBasedIds = [
      'tt0111161', 'tt0068646', 'tt0468569', // Drama/Crime
      'tt0816692', 'tt1630029', 'tt1345836', // Sci-Fi/Action
      'tt0109830', 'tt0110357', 'tt1375666', // Thriller/Mystery
      'tt0167260', 'tt0120915', 'tt0088763', // Adventure/Fantasy
      'tt0477347', 'tt5311514', 'tt6751668', // Action
    ];

    const recommendations = [];
    const seenIds = new Set(topRatedMovies.map((m: FavItem) => m.movieId));

    for (const id of genreBasedIds) {
      if (seenIds.has(id) || recommendations.length >= 10) break;
      
      try {
        const movie = await getMovieById(id);
        if (movie && movie.Genre) {
          const movieGenres = movie.Genre.split(',').map((g: string) => g.trim());
          const hasMatchingGenre = movieGenres.some((g: string) => genres.has(g));
          
          if (hasMatchingGenre) {
            recommendations.push({
              imdbID: movie.imdbID,
              Title: movie.Title,
              Year: movie.Year,
              Type: movie.Type,
              Poster: movie.Poster,
            });
            seenIds.add(id);
          }
        }
      } catch {
        continue;
      }
    }

    // If we don't have enough recommendations, fill with top-rated classics
    if (recommendations.length < 5) {
      const classicIds = [
        'tt0111161', 'tt0068646', 'tt0468569', 'tt0071562', 'tt0050083',
        'tt0108052', 'tt0167260', 'tt0110912', 'tt0080678', 'tt0060196',
      ];
      
      for (const id of classicIds) {
        if (seenIds.has(id) || recommendations.length >= 10) break;
        
        try {
          const movie = await getMovieById(id);
          if (movie) {
            recommendations.push({
              imdbID: movie.imdbID,
              Title: movie.Title,
              Year: movie.Year,
              Type: movie.Type,
              Poster: movie.Poster,
            });
            seenIds.add(id);
          }
        } catch {
          continue;
        }
      }
    }

    return NextResponse.json({ recommendations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Error fetching recommendations" },
      { status: 500 }
    );
  }
}
