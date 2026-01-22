import type { Metadata } from 'next';
import { CorrelationMatrix } from '@/components/CorrelationMatrix';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Correlation Matrix | Crypto Asset Correlations',
  description:
    'Analyze correlations between cryptocurrencies. See which coins move together and build a diversified portfolio.',
  openGraph: {
    title: 'Correlation Matrix | Crypto Asset Correlations',
    description: 'Analyze correlations between cryptocurrencies.',
  },
};

export default function CorrelationPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <Header />
      <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Correlation Matrix
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Analyze how cryptocurrencies move in relation to each other. Useful for portfolio
            diversification.
          </p>
        </div>

        <CorrelationMatrix />
      </main>
      <Footer />
    </div>
  );
}
