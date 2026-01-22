/**
 * Top Losers Page
 * Shows cryptocurrencies with the highest 24h losses
 */

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { getTopCoins, formatPrice, formatPercent, formatNumber } from '@/lib/market-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Top Losers - Crypto Markets - Crypto Data Aggregator',
  description: 'Cryptocurrencies with the highest price losses in the last 24 hours.',
};

export const revalidate = 60;

export default async function LosersPage() {
  const coins = await getTopCoins(250);

  // Sort by 24h change (ascending) and filter losers
  const losers = coins
    .filter((c) => (c.price_change_percentage_24h || 0) < 0)
    .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
    .slice(0, 100);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            <Link href="/markets" className="hover:text-neutral-900 dark:hover:text-white">
              Markets
            </Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white">Losers</span>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <svg
                className="w-7 h-7 text-neutral-500 dark:text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Top Losers</h1>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Cryptocurrencies with the highest 24h price drops
            </p>
          </div>

          {/* Losers Table */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left text-neutral-500 dark:text-neutral-400 text-sm font-medium p-4">
                      #
                    </th>
                    <th className="text-left text-neutral-500 dark:text-neutral-400 text-sm font-medium p-4">
                      Coin
                    </th>
                    <th className="text-right text-neutral-500 dark:text-neutral-400 text-sm font-medium p-4">
                      Price
                    </th>
                    <th className="text-right text-neutral-500 dark:text-neutral-400 text-sm font-medium p-4">
                      24h Change
                    </th>
                    <th className="text-right text-neutral-500 dark:text-neutral-400 text-sm font-medium p-4 hidden md:table-cell">
                      7d Change
                    </th>
                    <th className="text-right text-neutral-500 dark:text-neutral-400 text-sm font-medium p-4 hidden lg:table-cell">
                      Market Cap
                    </th>
                    <th className="text-right text-neutral-500 dark:text-neutral-400 text-sm font-medium p-4 hidden lg:table-cell">
                      Volume (24h)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {losers.map((coin, index) => (
                    <tr
                      key={coin.id}
                      className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="p-4 text-neutral-500 dark:text-neutral-400">{index + 1}</td>
                      <td className="p-4">
                        <Link href={`/coin/${coin.id}`} className="flex items-center gap-3">
                          <div className="relative w-8 h-8">
                            {coin.image && (
                              <Image
                                src={coin.image}
                                alt={coin.name}
                                fill
                                className="rounded-full object-cover"
                                unoptimized
                              />
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300">
                              {coin.name}
                            </span>
                            <span className="text-neutral-500 dark:text-neutral-400 text-sm ml-2">
                              {coin.symbol.toUpperCase()}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="p-4 text-right font-medium text-neutral-900 dark:text-white">
                        {formatPrice(coin.current_price)}
                      </td>
                      <td className="p-4 text-right font-semibold text-neutral-500 dark:text-neutral-400">
                        {formatPercent(coin.price_change_percentage_24h)}
                      </td>
                      <td
                        className={`p-4 text-right hidden md:table-cell ${
                          (coin.price_change_percentage_7d_in_currency || 0) >= 0
                            ? 'text-neutral-900 dark:text-white font-semibold'
                            : 'text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        {formatPercent(coin.price_change_percentage_7d_in_currency)}
                      </td>
                      <td className="p-4 text-right text-neutral-700 dark:text-neutral-300 hidden lg:table-cell">
                        ${formatNumber(coin.market_cap)}
                      </td>
                      <td className="p-4 text-right text-neutral-700 dark:text-neutral-300 hidden lg:table-cell">
                        ${formatNumber(coin.total_volume)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link href="/markets" className="text-neutral-900 dark:text-white hover:underline">
              ← Back to Markets
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
