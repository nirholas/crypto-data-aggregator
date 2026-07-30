/**
 * Pricing page view model.
 *
 * Everything here is derived from the single sources of truth in this folder:
 * `API_PRICING`, `API_TIERS` and `ENDPOINT_METADATA` in `./pricing`. The
 * pricing page is a client component, so it cannot read routes off the
 * filesystem; this module turns that config into the shapes the page renders.
 * Change a price in `./pricing` and this updates with it.
 */

import {
  API_PRICING,
  API_TIERS,
  getEndpointMetadata,
  type PricedEndpoint,
  type TierConfig,
} from './pricing';

// =============================================================================
// SUBSCRIPTION TIERS
// =============================================================================

export interface SubscriptionTier extends TierConfig {
  description: string;
  highlighted: boolean;
  cta: string;
  ctaLink: string;
}

const TIER_PRESENTATION: Record<
  string,
  { description: string; highlighted: boolean; cta: string; ctaLink: string }
> = {
  free: {
    description: 'Everything you need to start building, with no card and no key.',
    highlighted: false,
    cta: 'Start building',
    ctaLink: '/docs',
  },
  pro: {
    description: 'For production apps that need the full endpoint surface.',
    highlighted: true,
    cta: 'Upgrade to Pro',
    ctaLink: '/dashboard',
  },
  enterprise: {
    description: 'Unlimited volume, custom endpoints, and an SLA.',
    highlighted: false,
    cta: 'Contact sales',
    ctaLink: '/contact',
  },
};

/**
 * The three subscription tiers, in display order, built from API_TIERS.
 */
export const SUBSCRIPTION_TIERS: SubscriptionTier[] = ['free', 'pro', 'enterprise']
  .filter(id => id in API_TIERS)
  .map(id => ({
    ...API_TIERS[id],
    ...TIER_PRESENTATION[id],
  }));

// =============================================================================
// ENDPOINT CATEGORIES
// =============================================================================

export interface EndpointCategory {
  name: string;
  icon: string;
}

export const ENDPOINT_CATEGORIES: Record<string, EndpointCategory> = {
  market: { name: 'Market Data', icon: '📊' },
  defi: { name: 'DeFi', icon: '🏦' },
  analytics: { name: 'Analytics', icon: '🔬' },
  portfolio: { name: 'Portfolio', icon: '💼' },
  alerts: { name: 'Alerts', icon: '🔔' },
  historical: { name: 'Historical', icon: '🕰️' },
};

/**
 * Map a path onto one of ENDPOINT_CATEGORIES.
 */
function categorize(path: string): string {
  if (path.includes('/defi')) return 'defi';
  if (path.includes('/portfolio')) return 'portfolio';
  if (path.includes('/alerts') || path.includes('/webhooks')) return 'alerts';
  if (path.includes('/historical') || path.includes('/ohlc') || path.includes('/export')) {
    return 'historical';
  }
  if (
    path.includes('/correlation') ||
    path.includes('/screener') ||
    path.includes('/sentiment') ||
    path.includes('/whale')
  ) {
    return 'analytics';
  }
  return 'market';
}

// =============================================================================
// ENDPOINTS
// =============================================================================

export interface EndpointSummary {
  path: string;
  method: string;
  description: string;
  category: string;
  price: string;
  /** Human-readable rate limit note shown on the endpoint card. */
  rateLimit?: string;
}

/**
 * Endpoints that require payment, derived directly from API_PRICING.
 * Cheapest first, so the list opens with the lowest barrier to entry.
 */
export const PREMIUM_ENDPOINTS: EndpointSummary[] = (
  Object.keys(API_PRICING) as PricedEndpoint[]
)
  .map(path => ({
    path,
    method: path.includes('/webhooks') || path.includes('/alerts') ? 'POST' : 'GET',
    description: getEndpointMetadata(path).description,
    category: categorize(path),
    price: API_PRICING[path],
  }))
  .sort(
    (a, b) =>
      parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')) ||
      a.path.localeCompare(b.path)
  );

/**
 * Endpoints that stay free forever. These are the public read endpoints the
 * site itself runs on, so they are not in API_PRICING.
 */
export const FREE_ENDPOINTS: EndpointSummary[] = [
  { path: '/api/news', method: 'GET', description: 'Latest aggregated crypto news across every source.' },
  { path: '/api/breaking', method: 'GET', description: 'Breaking stories from the last few hours.' },
  { path: '/api/search', method: 'GET', description: 'Full-text search across the news archive.' },
  { path: '/api/sources', method: 'GET', description: 'Every RSS source with its current availability.' },
  { path: '/api/trending', method: 'GET', description: 'Stories multiple outlets are covering right now.' },
  { path: '/api/rss', method: 'GET', description: 'The aggregated feed as RSS.' },
  { path: '/api/atom', method: 'GET', description: 'The aggregated feed as Atom.' },
  { path: '/api/prices', method: 'GET', description: 'Spot prices for the major assets.' },
  { path: '/api/market/coins', method: 'GET', description: 'Top coins with market cap and 24h change.' },
  { path: '/api/market/search', method: 'GET', description: 'Search coins, exchanges, and categories.' },
  { path: '/api/market/exchanges', method: 'GET', description: 'Exchange listings with volume.' },
  { path: '/api/market/categories', method: 'GET', description: 'Market sectors and their performance.' },
  { path: '/api/defi', method: 'GET', description: 'DeFi overview: total TVL and top protocols.' },
  { path: '/api/archive', method: 'GET', description: 'Browse the historical news archive.' },
  { path: '/api/article', method: 'GET', description: 'A single enriched article by ID.' },
  { path: '/api/health', method: 'GET', description: 'Service health and upstream status.' },
  { path: '/api/docs', method: 'GET', description: 'The OpenAPI description of this API.' },
].map(endpoint => ({
  ...endpoint,
  category: categorize(endpoint.path),
  price: 'Free',
  rateLimit: API_TIERS.free?.rateLimit ?? '100/day',
}));

// =============================================================================
// PAY PER REQUEST
// =============================================================================

export const PAY_PER_REQUEST = {
  title: 'Pay per request with x402',
  description:
    'No subscription, no signup, no API key. Your agent calls an endpoint, gets a 402 with the price, pays in USDC, and gets the data. Settlement happens in the same request.',
  benefits: [
    'No account and no API key to manage',
    'Pay only for the calls you actually make',
    'Machine-native: agents can pay without a human in the loop',
    'Priced per call from a fraction of a cent',
    'Same endpoints and same responses as a subscription',
  ],
};

// =============================================================================
// FEATURE COMPARISON
// =============================================================================

export interface FeatureComparisonRow {
  feature: string;
  description: string;
  free: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

export const FEATURE_COMPARISON: FeatureComparisonRow[] = [
  {
    feature: 'Requests per day',
    description: 'How many API calls each tier allows.',
    free: API_TIERS.free?.rateLimit ?? '100/day',
    pro: API_TIERS.pro?.rateLimit ?? '10,000/day',
    enterprise: API_TIERS.enterprise?.rateLimit ?? 'Unlimited',
  },
  {
    feature: 'News and market endpoints',
    description: 'The free public endpoints this site runs on.',
    free: true,
    pro: true,
    enterprise: true,
  },
  {
    feature: 'Priced v1 endpoints',
    description: 'The full /api/v1 surface, including DeFi and analytics.',
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    feature: 'Historical data',
    description: 'How far back OHLC and snapshot history goes.',
    free: '7 days',
    pro: '1 year',
    enterprise: 'Full history',
  },
  {
    feature: 'Data exports',
    description: 'Bulk CSV and JSON export of query results.',
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    feature: 'Webhooks',
    description: 'Push alerts to your own endpoint.',
    free: false,
    pro: '10 active',
    enterprise: 'Unlimited',
  },
  {
    feature: 'Whale alerts',
    description: 'Large on-chain transfers as they land.',
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    feature: 'Correlation and screener',
    description: 'Cross-asset correlation and the custom screener.',
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    feature: 'Pay per request (x402)',
    description: 'Call any priced endpoint without an account.',
    free: true,
    pro: true,
    enterprise: true,
  },
  {
    feature: 'Custom endpoints',
    description: 'Endpoints built for your workload.',
    free: false,
    pro: false,
    enterprise: true,
  },
  {
    feature: 'Uptime SLA',
    description: 'Contractual availability guarantee.',
    free: false,
    pro: false,
    enterprise: '99.9%',
  },
  {
    feature: 'Support',
    description: 'How you reach us when something breaks.',
    free: 'Community',
    pro: 'Priority',
    enterprise: 'Dedicated',
  },
];

// =============================================================================
// DERIVED COUNTS
// =============================================================================

/** How many endpoints are free. */
export function getFreeEndpointCount(): number {
  return FREE_ENDPOINTS.length;
}

/** How many endpoints require payment. */
export function getPremiumEndpointCount(): number {
  return PREMIUM_ENDPOINTS.length;
}

/** The lowest per-call price on the priced surface, as a display string. */
export function getCheapestPrice(): string {
  if (PREMIUM_ENDPOINTS.length === 0) return '$0.001';
  return PREMIUM_ENDPOINTS[0].price;
}
