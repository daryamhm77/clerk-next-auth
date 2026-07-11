import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-8xl font-black text-red-600">404</h1>
      <p className="mt-4 text-xl text-muted">Page not found</p>
      <p className="mt-2 max-w-md text-sm text-muted">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
      >
        Back Home
      </Link>
    </div>
  );
}
