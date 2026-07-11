import type { Metadata } from 'next';
import Results from '@/components/Results';
import SearchFilters from '@/components/SearchFilters';
import Pagination from '@/components/Pagination';
import { searchMovies } from '@/lib/api';

interface SearchPageProps {
  params: Promise<{
    searchTerm: string;
  }>;
  searchParams: Promise<{
    y?: string;
    type?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: SearchPageProps): Promise<Metadata> {
  const { searchTerm } = await params;
  return {
    title: `"${searchTerm}" — Search Results`,
    description: `Search results for "${searchTerm}" on IMDb Tracker`,
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { searchTerm } = await params;
  const { y, type, page } = await searchParams;

  const currentPage = parseInt(page || '1', 10);
  const { movies, totalResults } = await searchMovies(searchTerm, {
    y,
    type,
    page: currentPage,
  });

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="mx-auto max-w-7xl">
      <SearchFilters searchTerm={searchTerm} />

      {movies.length === 0 ? (
        <h1 className="pt-10 text-center text-2xl font-semibold text-muted">
          No movies found for &quot;{searchTerm}&quot;
        </h1>
      ) : (
        <>
          <p className="px-4 pt-4 text-sm text-muted">
            {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{searchTerm}&quot;
          </p>
          <Results results={movies} />
          {totalPages > 1 && (
            <Pagination
              searchTerm={searchTerm}
              currentPage={currentPage}
              totalPages={totalPages}
              y={y}
              type={type}
            />
          )}
        </>
      )}
    </div>
  );
}
