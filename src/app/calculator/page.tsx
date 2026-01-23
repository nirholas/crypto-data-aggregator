import type { Metadata } from 'next';
import { CryptoCalculator } from '@/components/CryptoCalculator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Crypto Calculator | Convert & Calculate Profits',
  description:
    'Convert between cryptocurrencies and calculate your potential profits. Free crypto converter and profit/loss calculator.',
  openGraph: {
    title: 'Crypto Calculator | Convert & Calculate Profits',
    description: 'Convert between cryptocurrencies and calculate your potential profits.',
  },
};

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Crypto Calculator
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Convert between cryptocurrencies and calculate your potential profits or losses.
          </p>
        </div>

        <CryptoCalculator />
      </main>
      <Footer />
    </div>
  );
}
