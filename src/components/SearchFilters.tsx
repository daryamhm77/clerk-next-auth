'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface SearchFiltersProps {
  searchTerm: string;
}

export default function SearchFilters({ searchTerm }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const year = searchParams.get('y') || '';
  const type = searchParams.get('type') || '';
  const page = searchParams.get('page') || '1';

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (year && key !== 'y') params.set('y', year);
    if (type && key !== 'type') params.set('type', type);
    if (page && key !== 'page') params.set('page', '1');
    if (value) params.set(key, value);
    router.push(`/search/${encodeURIComponent(searchTerm)}?${params.toString()}`);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 pb-2 pt-4">
      <input
        type="text"
        placeholder="Year"
        defaultValue={year}
        onBlur={(e) => updateFilter('y', e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') updateFilter('y', e.currentTarget.value);
        }}
        className="h-10 w-24 rounded-lg border border-card-border bg-input px-3 text-sm text-foreground outline-none transition focus:border-amber-500"
      />

      <select
        value={type}
        onChange={(e) => updateFilter('type', e.target.value)}
        className="h-10 rounded-lg border border-card-border bg-input px-3 text-sm text-foreground outline-none transition focus:border-amber-500"
      >
        <option value="">All Types</option>
        <option value="movie">Movies</option>
        <option value="series">TV Series</option>
        <option value="episode">Episodes</option>
      </select>
    </div>
  );
}
