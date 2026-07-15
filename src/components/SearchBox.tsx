'use client';

import { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';

export default function SearchBox() {
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const lastNavigatedTerm = useRef('');

  const navigate = useCallback(
    (term: string) => {
      if (!term || term === lastNavigatedTerm.current) return;
      lastNavigatedTerm.current = term;
      startTransition(() => {
        router.push(`/search/${encodeURIComponent(term)}`);
      });
    },
    [router, startTransition]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(search.trim());
  };

  useEffect(() => {
    const timer = setTimeout(() => navigate(search.trim()), 500);
    return () => clearTimeout(timer);
  }, [search, navigate]);

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-5"
    >
      <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-12 flex-1 rounded-lg border border-card-border bg-input px-4 text-foreground outline-none transition focus:border-amber-500"
      />

      <button
        disabled={!search.trim() || isPending}
        className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
      >
        {isPending ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        {isPending ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}