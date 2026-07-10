import type { Metadata } from 'next';
import Results from '@/components/Results';
import SearchFilters from '@/components/SearchFilters';
import Pagination from '@/components/Pagination';

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

  const searchUrl = new URL('https://www.omdbapi.com');
  searchUrl.searchParams.set('apikey', process.env.OMDB_API_KEY!);
  searchUrl.searchParams.set('s', searchTerm);
  if (y) searchUrl.searchParams.set('y', y);
  if (type) searchUrl.searchParams.set('type', type);
  const currentPage = parseInt(page || '1', 10);
  searchUrl.searchParams.set('page', String(currentPage));

  const res = await fetch(searchUrl.toString(), { next: { revalidate: 60 } });
  const data = await res.json();
  const results = data.Search ?? [];
  const totalResults = parseInt(data.totalResults || '0', 10);
  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="mx-auto max-w-7xl">
      <SearchFilters searchTerm={searchTerm} />

      {results.length === 0 ? (
        <h1 className="pt-10 text-center text-2xl font-semibold text-gray-400">
          No movies found for &quot;{searchTerm}&quot;
        </h1>
      ) : (
        <>
          <p className="px-4 pt-4 text-sm text-gray-500">
            {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{searchTerm}&quot;
          </p>
          <Results results={results} />
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
