import type { Metadata } from 'next';
import { LiquidationsFeed } from '@/components/LiquidationsFeed';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Liquidations | Live Futures Liquidation Feed',
  description:
    'Real-time cryptocurrency futures liquidations across major exchanges. Track longs and shorts getting liquidated.',
  openGraph: {
    title: 'Liquidations | Live Futures Liquidation Feed',
    description: 'Real-time cryptocurrency futures liquidations across major exchanges.',
  },
};

export default function LiquidationsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <Header />
      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Liquidations Feed
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Live futures liquidations across major exchanges. See who&apos;s getting rekt in
            real-time.
          </p>
        </div>

        <LiquidationsFeed />
      </main>
      <Footer />
    </div>
  );
}
