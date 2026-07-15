'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-500/10 p-5">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>

        <h1 className="mb-3 text-4xl font-bold text-foreground">
          Oops! Something went wrong.
        </h1>

        <p className="mb-8 text-muted">
          We couldn&apos;t load this page. It might be a temporary issue with the
          server or your connection.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
          >
            <RefreshCw size={18} />
            Try Again
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-card-border px-6 py-3 text-foreground transition hover:border-amber-500 hover:text-amber-500"
          >
            <Home size={18} />
            Back Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-8 overflow-auto rounded-lg bg-card p-4 text-left text-xs text-red-400">
            {error.message}
          </pre>
        )}
      </div>
    </main>
  );
}