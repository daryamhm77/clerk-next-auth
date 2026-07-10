import type { Metadata } from 'next';
import Favorites from '@/components/Favorites';

export const metadata: Metadata = {
  title: 'My Favorites',
  description: 'Your saved favorite movies',
};

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-white">My Favorites</h1>
      <Favorites />
    </div>
  );
}
