import type { Metadata } from 'next';
import DashboardContent from '@/components/DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your movie tracking dashboard',
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-white">Dashboard</h1>
      <DashboardContent />
    </div>
  );
}
