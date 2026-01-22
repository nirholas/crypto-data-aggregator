# Data Sources & Caching

Documentation for external APIs, data flow, and caching strategies.

---

## Table of Contents

- [Overview](#overview)
- [External APIs](#external-apis)
  - [CoinGecko](#coingecko)
  - [DeFiLlama](#defillama)
  - [Alternative.me](#alternativeme)
- [Caching Strategy](#caching-strategy)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Overview

Crypto Data Aggregator fetches data from three free, public APIs:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   CoinGecko     │     │   DeFiLlama     │     │  Alternative.me │
│  (Market Data)  │     │  (DeFi TVL)     │     │ (Fear & Greed)  │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    Memory Cache (TTL)   │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     API Routes (/api)   │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     SWR Client Cache    │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      React Components   │
                    └─────────────────────────┘
```

---

## External APIs

### CoinGecko

**Base URL**: `https://api.coingecko.com/api/v3`

**Authentication**: None required (free tier)

**Rate Limits**: ~50 requests/minute

#### Endpoints Used

| Endpoint                       | Purpose                     | Cache TTL |
| ------------------------------ | --------------------------- | --------- |
| `GET /coins/markets`           | Top coins with market data  | 60s       |
| `GET /coins/{id}`              | Detailed coin information   | 120s      |
| `GET /coins/{id}/market_chart` | Historical price data       | 300s      |
| `GET /coins/{id}/ohlc`         | OHLC candlestick data       | 300s      |
| `GET /search/trending`         | Trending coins              | 300s      |
| `GET /coins/categories/list`   | Category list               | 3600s     |
| `GET /coins/categories`        | Categories with market data | 600s      |
| `GET /exchanges`               | Exchange list               | 600s      |
| `GET /exchanges/{id}`          | Exchange details            | 600s      |
| `GET /search`                  | Search coins                | 60s       |

#### Example Responses

**GET /coins/markets**

```json
[
  {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    "current_price": 95000,
    "market_cap": 1870000000000,
    "market_cap_rank": 1,
    "fully_diluted_valuation": 1990000000000,
    "total_volume": 45000000000,
    "high_24h": 96500,
    "low_24h": 93200,
    "price_change_24h": 1500,
    "price_change_percentage_24h": 1.6,
    "price_change_percentage_7d_in_currency": 5.2,
    "price_change_percentage_30d_in_currency": 12.5,
    "circulating_supply": 19600000,
    "total_supply": 21000000,
    "max_supply": 21000000,
    "ath": 100000,
    "ath_change_percentage": -5,
    "ath_date": "2025-01-15T00:00:00.000Z",
    "atl": 67.81,
    "atl_change_percentage": 139900,
    "atl_date": "2013-07-06T00:00:00.000Z",
    "last_updated": "2026-01-22T10:00:00.000Z",
    "sparkline_in_7d": {
      "price": [91000, 92500, 93000, ...]
    }
  }
]
```

**GET /coins/{id}**

```json
{
  "id": "bitcoin",
  "symbol": "btc",
  "name": "Bitcoin",
  "description": {
    "en": "Bitcoin is the first successful..."
  },
  "links": {
    "homepage": ["https://bitcoin.org"],
    "blockchain_site": ["https://blockchair.com/bitcoin"],
    "repos_url": {
      "github": ["https://github.com/bitcoin/bitcoin"]
    }
  },
  "market_data": {
    "current_price": { "usd": 95000 },
    "market_cap": { "usd": 1870000000000 },
    "total_volume": { "usd": 45000000000 }
  },
  "community_data": {
    "twitter_followers": 6500000,
    "reddit_subscribers": 5000000
  },
  "developer_data": {
    "stars": 75000,
    "forks": 35000,
    "subscribers": 4000
  }
}
```

---

### DeFiLlama

**Base URL**: `https://api.llama.fi`

**Authentication**: None required

**Rate Limits**: Very generous (no documented limits)

#### Endpoints Used

| Endpoint               | Purpose                    | Cache TTL |
| ---------------------- | -------------------------- | --------- |
| `GET /protocols`       | All DeFi protocols         | 300s      |
| `GET /chains`          | All chains with TVL        | 300s      |
| `GET /protocol/{name}` | Protocol details & history | 300s      |
| `GET /tvl/{protocol}`  | Protocol TVL               | 300s      |

#### Example Responses

**GET /protocols**

```json
[
  {
    "id": "1",
    "name": "Lido",
    "symbol": "LDO",
    "url": "https://lido.fi",
    "description": "Liquid staking for Ethereum",
    "chain": "Multi-Chain",
    "logo": "https://defillama.com/icons/lido.png",
    "tvl": 35000000000,
    "chainTvls": {
      "Ethereum": 32000000000,
      "Polygon": 500000000,
      "Solana": 2500000000
    },
    "change_1h": 0.1,
    "change_1d": 1.5,
    "change_7d": 3.2,
    "category": "Liquid Staking"
  }
]
```

---

### Alternative.me

**Base URL**: `https://api.alternative.me`

**Authentication**: None required

**Rate Limits**: Unknown (generous)

#### Endpoints Used

| Endpoint             | Purpose                    | Cache TTL |
| -------------------- | -------------------------- | --------- |
| `GET /fng/`          | Current Fear & Greed Index | 3600s     |
| `GET /fng/?limit=30` | Historical Fear & Greed    | 3600s     |

#### Example Response

**GET /fng/**

```json
{
  "name": "Fear and Greed Index",
  "data": [
    {
      "value": "72",
      "value_classification": "Greed",
      "timestamp": "1737504000",
      "time_until_update": "43200"
    }
  ],
  "metadata": {
    "error": null
  }
}
```

---

## Caching Strategy

### Multi-Layer Cache

```
┌──────────────────────────────────────────────────┐
│  Layer 1: SWR Client Cache (Browser)             │
│  - Stale-while-revalidate pattern                │
│  - Automatic revalidation on focus               │
│  - Deduplication of concurrent requests          │
├──────────────────────────────────────────────────┤
│  Layer 2: Memory Cache (Edge/Server)             │
│  - TTL-based expiration                          │
│  - LRU eviction when memory limit reached        │
│  - Shared across API route invocations           │
├──────────────────────────────────────────────────┤
│  Layer 3: HTTP Cache Headers                     │
│  - Cache-Control headers                         │
│  - ETag for conditional requests                 │
│  - CDN/browser caching                           │
└──────────────────────────────────────────────────┘
```

### Cache Implementation

**Location**: `src/lib/cache.ts`

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private maxSize: number = 100;

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl: number): void {
    // LRU eviction if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }
}

export const cache = new MemoryCache();
```

### Cache TTL by Data Type

| Data Type         | TTL   | Reason                           |
| ----------------- | ----- | -------------------------------- |
| Coin prices       | 60s   | Balance freshness vs. API limits |
| Coin details      | 120s  | Less volatile data               |
| Historical charts | 300s  | Historical data doesn't change   |
| Trending          | 300s  | Updates hourly on source         |
| Categories list   | 3600s | Rarely changes                   |
| DeFi protocols    | 300s  | TVL updates frequently           |
| Fear & Greed      | 3600s | Updates daily                    |

### SWR Configuration

```typescript
// Global SWR config
<SWRConfig
  value={{
    fetcher: (url) => fetch(url).then((r) => r.json()),
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    errorRetryCount: 3,
  }}
>
  <App />
</SWRConfig>

// Per-hook config
const { data } = useSWR('/api/market/coins', fetcher, {
  refreshInterval: 30000,  // Refresh every 30s
  revalidateIfStale: true,
  revalidateOnMount: true,
});
```

---

## Data Models

### CoinData

```typescript
interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}
```

### DeFiProtocol

```typescript
interface DeFiProtocol {
  id: string;
  name: string;
  symbol: string;
  url: string;
  description: string;
  chain: string;
  chains: string[];
  logo: string;
  tvl: number;
  change_1h: number;
  change_1d: number;
  change_7d: number;
  category: string;
  chainTvls: Record<string, number>;
}
```

### PriceAlert

```typescript
interface PriceAlert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: 'above' | 'below';
  targetPrice: number;
  currentPrice: number;
  enabled: boolean;
  triggered: boolean;
  createdAt: string;
  triggeredAt?: string;
}
```

### PortfolioHolding

```typescript
interface PortfolioHolding {
  coinId: string;
  symbol: string;
  name: string;
  amount: number;
  averagePrice: number;
  notes?: string;
  addedAt: string;
}
```

---

## Error Handling

### API Error Response

```typescript
interface APIError {
  error: string;
  code: string;
  details?: unknown;
}

// Example error response
{
  "error": "Failed to fetch market data",
  "code": "UPSTREAM_ERROR",
  "details": {
    "status": 429,
    "message": "Rate limit exceeded"
  }
}
```

### Error Handling Pattern

```typescript
// In API route
export async function GET(request: Request) {
  try {
    const data = await fetchMarketData();
    return Response.json(data);
  } catch (error) {
    console.error('Market data fetch failed:', error);

    if (error instanceof RateLimitError) {
      return Response.json({ error: 'Rate limit exceeded', code: 'RATE_LIMIT' }, { status: 429 });
    }

    // Try to return cached data on error
    const cached = cache.get('market-data-fallback');
    if (cached) {
      return Response.json({
        ...cached,
        _stale: true,
        _cachedAt: cached._timestamp,
      });
    }

    return Response.json({ error: 'Service unavailable', code: 'SERVICE_ERROR' }, { status: 503 });
  }
}
```

### Client-Side Error Handling

```typescript
const { data, error, isLoading } = useSWR('/api/market/coins', fetcher, {
  onError: (err) => {
    console.error('Failed to fetch:', err);
    showToast({ type: 'error', message: 'Failed to load market data' });
  },
  errorRetryCount: 3,
  errorRetryInterval: 5000,
});

if (error) {
  return <ErrorState message="Unable to load data" onRetry={mutate} />;
}
```

---

## Rate Limiting

### Strategy

To stay within free tier limits, we:

1. **Cache aggressively** - Reduce duplicate requests
2. **Batch requests** - Combine multiple coin requests
3. **Debounce user actions** - Prevent rapid-fire requests
4. **Fallback to cached data** - Serve stale data on rate limit

### Implementation

```typescript
// Debounced search
const debouncedSearch = useMemo(
  () =>
    debounce((query: string) => {
      mutate(`/api/search?q=${query}`);
    }, 300),
  []
);

// Request batching for coin prices
async function getBatchedPrices(coinIds: string[]): Promise<PriceMap> {
  // CoinGecko allows up to 250 coins per request
  const batches = chunk(coinIds, 250);
  const results = await Promise.all(
    batches.map((batch) => fetch(`/api/market/coins?ids=${batch.join(',')}`))
  );
  return mergeResults(results);
}
```

### Rate Limit Headers

API routes return rate limit headers:

```http
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1737550000
```

---

## Data Freshness Indicators

Components can show data freshness:

```tsx
interface DataWithMeta<T> {
  data: T;
  _cachedAt: number;
  _stale: boolean;
}

function PriceDisplay({ price, cachedAt, stale }: Props) {
  const age = Date.now() - cachedAt;

  return (
    <div>
      <span>${price}</span>
      {stale && <span className="text-yellow-500 text-xs">(cached {formatAge(age)} ago)</span>}
    </div>
  );
}
```
