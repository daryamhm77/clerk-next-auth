'use client';

import Link from 'next/link';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

interface PaginationProps {
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  y?: string;
  type?: string;
}

export default function Pagination({
  searchTerm,
  currentPage,
  totalPages,
  y,
  type,
}: PaginationProps) {
  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (y) params.set('y', y);
    if (type) params.set('type', type);
    params.set('page', String(page));
    return `/search/${encodeURIComponent(searchTerm)}?${params.toString()}`;
  };

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <div className="flex items-center justify-center gap-4 px-4 pb-8">
      <Link
        href={prevDisabled ? '#' : buildHref(currentPage - 1)}
        className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
          prevDisabled
            ? 'cursor-not-allowed text-neutral-600'
            : 'border border-card-border text-foreground hover:border-amber-500 hover:text-amber-500'
        }`}
        aria-disabled={prevDisabled}
        onClick={(e) => prevDisabled && e.preventDefault()}
      >
        <MdChevronLeft size={18} />
        Previous
      </Link>

      <span className="text-sm text-muted">
        Page {currentPage} of {totalPages}
      </span>

      <Link
        href={nextDisabled ? '#' : buildHref(currentPage + 1)}
        className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
          nextDisabled
            ? 'cursor-not-allowed text-neutral-600'
            : 'border border-card-border text-foreground hover:border-amber-500 hover:text-amber-500'
        }`}
        aria-disabled={nextDisabled}
        onClick={(e) => nextDisabled && e.preventDefault()}
      >
        Next
        <MdChevronRight size={18} />
      </Link>
    </div>
  );
}
