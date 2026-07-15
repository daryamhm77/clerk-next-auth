import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import DashboardContent from '@/components/DashboardContent';
import { getDbUser } from '@/lib/actions/user';
import {
  computeDashboardData,
  toFavItems,
  toRecentlyViewedItems,
} from '@/lib/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your movie tracking dashboard',
};

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const dbUser = await getDbUser(user);
  const data = computeDashboardData(
    toFavItems(dbUser.favs),
    toRecentlyViewedItems(dbUser.recentlyViewed)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Dashboard</h1>
      <DashboardContent {...data} />
    </div>
  );
}
