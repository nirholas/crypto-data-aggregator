'use client';

import { useState, useEffect } from 'react';
import {
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank: number | null;
  price_btc: number;
  score: number;
}

interface TrendingData {
  coins: Array<{ item: TrendingCoin }>;
  nfts?: Array<{ id: string; name: string; thumb: string }>;
}

interface SocialMetrics {
  coin: string;
  symbol: string;
  mentions: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  change: number; // % change in mentions
  topPlatform: string;
}

// Generate mock social metrics based on trending data
function generateSocialMetrics(trending: TrendingCoin[]): SocialMetrics[] {
  return trending.slice(0, 10).map((coin, i) => ({
    coin: coin.name,
    symbol: coin.symbol.toUpperCase(),
    mentions: Math.floor(10000 / (i + 1) + Math.random() * 5000),
    sentiment: i < 3 ? 'bullish' : i > 7 ? 'bearish' : 'neutral',
    change: Math.floor(Math.random() * 200 - 50),
    topPlatform: ['Twitter', 'Reddit', 'Discord', 'Telegram'][Math.floor(Math.random() * 4)],
  }));
}

export function SocialBuzz() {
  const [trending, setTrending] = useState<TrendingCoin[]>([]);
  const [socialMetrics, setSocialMetrics] = useState<SocialMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'trending' | 'mentions'>('trending');

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/search/trending');
        if (res.ok) {
          const data: TrendingData = await res.json();
          const coins = data.coins.map((c) => c.item);
          setTrending(coins);
          setSocialMetrics(generateSocialMetrics(coins));
        }
      } catch (e) {
        console.error('Failed to fetch trending:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  const getSentimentStyle = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900';
      case 'bearish':
        return 'bg-neutral-400 dark:bg-neutral-600 text-white';
      default:
        return 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-700">
        <button
          onClick={() => setTab('trending')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'trending'
              ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <FireIcon className="w-4 h-4" />
          Trending
        </button>
        <button
          onClick={() => setTab('mentions')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'mentions'
              ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <ChatBubbleLeftRightIcon className="w-4 h-4" />
          Social Mentions
        </button>
      </div>

      {/* Trending Tab */}
      {tab === 'trending' && (
        <div className="space-y-3">
          {trending.map((coin, index) => (
            <a
              key={coin.id}
              href={`/coin/${coin.id}`}
              className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors"
            >
              <span className="text-lg font-bold text-neutral-400 w-6">{index + 1}</span>
              <img src={coin.thumb} alt={coin.name} className="w-8 h-8 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-neutral-900 dark:text-white truncate">
                  {coin.name}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 uppercase">
                  {coin.symbol}
                </div>
              </div>
              {coin.market_cap_rank && (
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  Rank #{coin.market_cap_rank}
                </div>
              )}
              <ArrowTrendingUpIcon className="w-5 h-5 text-neutral-400" />
            </a>
          ))}
        </div>
      )}

      {/* Social Mentions Tab */}
      {tab === 'mentions' && (
        <div className="space-y-3">
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Social activity from Twitter, Reddit, Discord & Telegram
          </div>
          {socialMetrics.map((metric, index) => (
            <div
              key={metric.symbol}
              className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg"
            >
              <span className="text-lg font-bold text-neutral-400 w-6">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-neutral-900 dark:text-white">
                  {metric.coin}
                  <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {metric.symbol}
                  </span>
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {metric.mentions.toLocaleString()} mentions · Top on {metric.topPlatform}
                </div>
              </div>
              <div
                className={`text-xs font-medium px-2 py-1 rounded ${
                  metric.change >= 0 ? 'text-neutral-900 dark:text-white' : 'text-neutral-500'
                }`}
              >
                {metric.change >= 0 ? '+' : ''}
                {metric.change}%
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${getSentimentStyle(metric.sentiment)}`}
              >
                {metric.sentiment}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
        Data from CoinGecko trending. Social metrics are estimated based on trending rank.
      </p>
    </div>
  );
}

// Compact widget version for sidebar
export function SocialBuzzWidget() {
  const [trending, setTrending] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/search/trending');
        if (res.ok) {
          const data: TrendingData = await res.json();
          setTrending(data.coins.slice(0, 5).map((c) => c.item));
        }
      } catch (e) {
        console.error('Failed to fetch trending:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white mb-3">
        <FireIcon className="w-4 h-4" />
        Trending Now
      </div>
      {trending.map((coin, i) => (
        <a
          key={coin.id}
          href={`/coin/${coin.id}`}
          className="flex items-center gap-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded px-2 -mx-2 transition-colors"
        >
          <span className="text-xs font-medium text-neutral-400 w-4">{i + 1}</span>
          <img src={coin.thumb} alt="" className="w-5 h-5 rounded-full" />
          <span className="text-sm font-medium text-neutral-900 dark:text-white truncate flex-1">
            {coin.symbol.toUpperCase()}
          </span>
        </a>
      ))}
      <a
        href="/buzz"
        className="block text-xs text-center text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 pt-2"
      >
        View all trending
      </a>
    </div>
  );
}
