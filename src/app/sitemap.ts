/**
 * Dynamic Sitemap Generation
 * Generates sitemap for all routes including dynamic coin pages
 */

import { MetadataRoute } from 'next';

const BASE_URL = 'https://crypto-data-aggregator.vercel.app';

// Top coins for static generation
const TOP_COINS = [
  'bitcoin',
  'ethereum',
  'tether',
  'binancecoin',
  'solana',
  'ripple',
  'usd-coin',
  'cardano',
  'dogecoin',
  'avalanche-2',
  'polkadot',
  'chainlink',
  'polygon',
  'litecoin',
  'uniswap',
  'bitcoin-cash',
  'stellar',
  'cosmos',
  'monero',
  'ethereum-classic',
  'filecoin',
  'internet-computer',
  'hedera-hashgraph',
  'vechain',
  'near',
  'algorand',
  'fantom',
  'the-sandbox',
  'decentraland',
  'axie-infinity',
  'tezos',
  'theta-token',
  'elrond-erd-2',
  'aave',
  'compound-governance-token',
  'maker',
  'curve-dao-token',
  'sushi',
  'pancakeswap-token',
  'yearn-finance',
];

// News categories
const CATEGORIES = [
  'bitcoin',
  'ethereum',
  'defi',
  'nft',
  'regulation',
  'altcoins',
  'markets',
  'technology',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/markets`,
      lastModified: now,
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/markets/trending`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/markets/gainers`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/markets/losers`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/defi`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/movers`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/sentiment`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/trending`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/watchlist`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Dynamic coin routes
  const coinRoutes: MetadataRoute.Sitemap = TOP_COINS.map((coinId) => ({
    url: `${BASE_URL}/coin/${coinId}`,
    lastModified: now,
    changeFrequency: 'hourly' as const,
    priority: 0.7,
  }));

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${BASE_URL}/category/${category}`,
    lastModified: now,
    changeFrequency: 'hourly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...coinRoutes, ...categoryRoutes];
}
