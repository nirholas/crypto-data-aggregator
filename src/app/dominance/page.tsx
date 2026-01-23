import type { Metadata } from 'next';
import { DominanceChart } from '@/components/DominanceChart';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Market Dominance | Crypto Market Share',
  description:
    'Visualize cryptocurrency market dominance. See the market share of Bitcoin, Ethereum, and other top cryptocurrencies.',
  openGraph: {
    title: 'Market Dominance | Crypto Market Share',
    description: 'Visualize cryptocurrency market dominance and market share.',
  },
};

async function getCoins() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false',
      { next: { revalidate: 300 } }
    );
    if (res.ok) return res.json();
  } catch (e) {
    console.error('Failed to fetch coins:', e);
  }
  return [];
}

export default async function DominancePage() {
  const coins = await getCoins();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Market Dominance
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Visualize market share across the crypto ecosystem. See how BTC and ETH compare to
            altcoins.
          </p>
        </div>

        <DominanceChart coins={coins} />
      </main>
      <Footer />
    </div>
  );
}
