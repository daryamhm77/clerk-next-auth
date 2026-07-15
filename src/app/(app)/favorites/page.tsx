import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import Favorites from '@/components/Favorites';
import { getDbUser } from '@/lib/actions/user';
import { toFavItems } from '@/lib/dashboard';

export const metadata: Metadata = {
  title: 'My Favorites',
  description: 'Your saved favorite movies',
};

export default async function FavoritesPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const dbUser = await getDbUser(user);
  const favs = toFavItems(dbUser.favs);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">My Favorites</h1>
      <Favorites favs={favs} />
    </div>
  );
}
