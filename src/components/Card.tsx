import Link from 'next/link';
import Image from 'next/image';
import { MdMovie } from 'react-icons/md';
import type { Movie } from '@/lib/types';

export default function Card({ result }: { result: Movie }) {
  const poster = result.Poster || 'https://placehold.co/500x750/171717/ffffff?text=No+Poster';

  return (
    <div className="group overflow-hidden rounded-xl border border-card-border bg-card transition duration-300 hover:-translate-y-1 hover:border-amber-500 hover:shadow-xl">
      <Link href={`/movie/${result.imdbID}`}>
        <div className="relative h-[420px] w-full">
          <Image
            src={poster}
            alt={result.Title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA="
          />
        </div>

        <div className="space-y-2 p-4">
          <h2 className="truncate text-lg font-semibold text-white">
            {result.Title}
          </h2>

          <div className="flex items-center justify-between text-sm text-muted">
            <span>{result.Year}</span>

            <span className="flex items-center gap-1 capitalize">
              <MdMovie />
              {result.Type}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
