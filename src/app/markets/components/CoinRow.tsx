'use client';

/**
 * Coin Row Component
 * Individual row in the coins table
 */

import Link from 'next/link';
import Image from 'next/image';
import type { TokenPrice } from '@/lib/market-data';
import { formatPrice, formatNumber, formatPercent } from '@/lib/market-data';
import SparklineCell from './SparklineCell';
import { useWatchlist } from '@/components/watchlist/WatchlistProvider';

interface CoinRowProps {
  coin: TokenPrice;
  showWatchlist?: boolean;
}

export default function CoinRow({ coin, showWatchlist = false }: CoinRowProps) {
  const { addToWatchlist, removeFromWatchlist, isWatchlisted } = useWatchlist();
  const isInWatchlist = isWatchlisted(coin.id);
  
  const supplyPercentage = coin.max_supply
    ? (coin.circulating_supply / coin.max_supply) * 100
    : null;

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchlist) {
      removeFromWatchlist(coin.id);
    } else {
      addToWatchlist(coin.id);
    }
  };

  return (
    <tr className="border-b border-surface-border hover:bg-surface-hover transition-colors group">
      {/* Rank */}
      <td className="p-4 text-text-muted text-sm">{coin.market_cap_rank}</td>

      {/* Coin */}
      <td className="p-4">
        <Link href={`/coin/${coin.id}`} className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex-shrink-0">
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
            <span className="font-medium text-text-primary group-hover:text-primary transition-colors">
              {coin.name}
            </span>
            <span className="text-text-muted text-sm ml-2">
              {coin.symbol.toUpperCase()}
            </span>
          </div>
        </Link>
      </td>

      {/* Price */}
      <td className="p-4 text-right font-medium text-text-primary">
        {formatPrice(coin.current_price)}
      </td>

      {/* 24h % */}
      <td
        className={`p-4 text-right font-medium hidden sm:table-cell ${
          (coin.price_change_percentage_24h || 0) >= 0
            ? 'text-gain'
            : 'text-loss'
        }`}
      >
        {formatPercent(coin.price_change_percentage_24h)}
      </td>

      {/* 7d % */}
      <td
        className={`p-4 text-right font-medium hidden md:table-cell ${
          (coin.price_change_percentage_7d_in_currency || 0) >= 0
            ? 'text-gain'
            : 'text-loss'
        }`}
      >
        {formatPercent(coin.price_change_percentage_7d_in_currency)}
      </td>

      {/* Market Cap */}
      <td className="p-4 text-right text-text-secondary hidden lg:table-cell">
        ${formatNumber(coin.market_cap)}
      </td>

      {/* 24h Volume */}
      <td className="p-4 text-right text-text-secondary hidden xl:table-cell">
        ${formatNumber(coin.total_volume)}
      </td>

      {/* Circulating Supply */}
      <td className="p-4 text-right hidden xl:table-cell">
        <div className="flex flex-col items-end">
          <span className="text-text-secondary">
            {formatNumber(coin.circulating_supply)} {coin.symbol.toUpperCase()}
          </span>
          {supplyPercentage !== null && (
            <div className="w-full max-w-[80px] mt-1">
              <div className="h-1.5 bg-surface-hover rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min(supplyPercentage, 100)}%` }}
                />
              </div>
              <span className="text-xs text-text-muted">
                {supplyPercentage.toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      </td>

      {/* 7d Chart */}
      <td className="p-4 hidden lg:table-cell">
        {coin.sparkline_in_7d?.price ? (
          <SparklineCell
            data={coin.sparkline_in_7d.price}
            change={coin.price_change_percentage_7d_in_currency || 0}
          />
        ) : (
          <div className="w-[100px] h-[32px] bg-surface-hover rounded" />
        )}
      </td>

      {/* Watchlist star */}
      {showWatchlist && (
        <td className="p-4 text-center">
          <button
            onClick={handleWatchlistToggle}
            className={`transition-colors ${
              isInWatchlist 
                ? 'text-warning hover:text-warning/80' 
                : 'text-text-muted hover:text-warning'
            }`}
            aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <svg 
              className="w-5 h-5" 
              fill={isInWatchlist ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        </td>
      )}
    </tr>
  );
}
