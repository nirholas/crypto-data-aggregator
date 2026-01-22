# API Reference

Complete API documentation for Crypto Data Aggregator.

All endpoints are prefixed with `/api/` and return JSON responses.

---

## Table of Contents

- [Market Data](#market-data)
  - [Get Coins](#get-coins)
  - [Get Coin Snapshot](#get-coin-snapshot)
  - [Get Historical Prices](#get-historical-prices)
  - [Get OHLC Data](#get-ohlc-data)
  - [Search Coins](#search-coins)
  - [Compare Coins](#compare-coins)
  - [Get Tickers](#get-tickers)
  - [Get Social Data](#get-social-data)
- [Categories](#categories)
  - [List Categories](#list-categories)
  - [Get Category Coins](#get-category-coins)
- [Exchanges](#exchanges)
  - [List Exchanges](#list-exchanges)
  - [Get Exchange Details](#get-exchange-details)
- [DeFi](#defi)
  - [Get Protocols](#get-protocols)
  - [Get DeFi Market](#get-defi-market)
- [Trending & Sentiment](#trending--sentiment)
  - [Get Trending](#get-trending)
  - [Get Sentiment](#get-sentiment)
- [Charts](#charts)
  - [Get Chart Data](#get-chart-data)
- [Portfolio](#portfolio)
  - [Get Portfolio](#get-portfolio)
  - [Add Holding](#add-holding)
  - [Remove Holding](#remove-holding)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)
- [Rate Limits](#rate-limits)

---

## Market Data

### Get Coins

Get list of coins with market data.

```
GET /api/market/coins
```

#### Query Parameters

| Parameter | Type   | Default | Description                                        |
| --------- | ------ | ------- | -------------------------------------------------- |
| `type`    | string | `top`   | `list` for all coins, `top` for market cap ranking |
| `limit`   | number | `100`   | Number of results (max 250)                        |

#### Examples

```bash
# Get top 100 coins by market cap
curl "http://localhost:3000/api/market/coins"

# Get top 10 coins
curl "http://localhost:3000/api/market/coins?type=top&limit=10"

# Get all coins for autocomplete
curl "http://localhost:3000/api/market/coins?type=list"
```

#### Response

```json
{
  "coins": [
    {
      "id": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "current_price": 45000,
      "market_cap": 850000000000,
      "market_cap_rank": 1,
      "total_volume": 25000000000,
      "price_change_percentage_24h": 2.5,
      "price_change_percentage_7d_in_currency": 5.2,
      "circulating_supply": 19000000,
      "image": "https://..."
    }
  ],
  "total": 100
}
```

---

### Get Coin Snapshot

Get detailed data for a single coin.

```
GET /api/market/snapshot/[coinId]
```

#### Path Parameters

| Parameter | Type   | Description                                     |
| --------- | ------ | ----------------------------------------------- |
| `coinId`  | string | CoinGecko coin ID (e.g., `bitcoin`, `ethereum`) |

#### Examples

```bash
# Get Bitcoin details
curl "http://localhost:3000/api/market/snapshot/bitcoin"

# Get Ethereum details
curl "http://localhost:3000/api/market/snapshot/ethereum"
```

#### Response

```json
{
  "id": "bitcoin",
  "symbol": "btc",
  "name": "Bitcoin",
  "description": "Bitcoin is the first...",
  "image": {
    "thumb": "https://...",
    "small": "https://...",
    "large": "https://..."
  },
  "market_data": {
    "current_price": { "usd": 45000 },
    "market_cap": { "usd": 850000000000 },
    "total_volume": { "usd": 25000000000 },
    "high_24h": { "usd": 46000 },
    "low_24h": { "usd": 44000 },
    "price_change_24h": 1200,
    "price_change_percentage_24h": 2.5,
    "circulating_supply": 19000000,
    "total_supply": 21000000,
    "ath": { "usd": 69000 },
    "atl": { "usd": 67 }
  },
  "links": {
    "homepage": ["https://bitcoin.org"],
    "blockchain_site": ["https://blockchain.com"],
    "twitter_screen_name": "bitcoin"
  }
}
```

---

### Get Historical Prices

Get historical price, market cap, and volume data.

```
GET /api/market/history/[coinId]
```

#### Path Parameters

| Parameter | Type   | Description       |
| --------- | ------ | ----------------- |
| `coinId`  | string | CoinGecko coin ID |

#### Query Parameters

| Parameter  | Type   | Default | Description                                        |
| ---------- | ------ | ------- | -------------------------------------------------- |
| `days`     | number | `7`     | Historical range (1, 7, 14, 30, 90, 180, 365, max) |
| `interval` | string | auto    | Data granularity: `minutely`, `hourly`, `daily`    |

#### Examples

```bash
# Get 7-day history for Bitcoin
curl "http://localhost:3000/api/market/history/bitcoin?days=7"

# Get 30-day daily history
curl "http://localhost:3000/api/market/history/ethereum?days=30&interval=daily"

# Get 1-day minutely data
curl "http://localhost:3000/api/market/history/bitcoin?days=1&interval=minutely"
```

#### Response

```json
{
  "prices": [
    [1705881600000, 42500.25],
    [1705885200000, 42650.5]
  ],
  "market_caps": [
    [1705881600000, 832000000000],
    [1705885200000, 835000000000]
  ],
  "total_volumes": [
    [1705881600000, 24500000000],
    [1705885200000, 25100000000]
  ]
}
```

---

### Get OHLC Data

Get candlestick (OHLC) data for charts.

```
GET /api/market/ohlc/[coinId]
```

#### Query Parameters

| Parameter | Type   | Default | Description                       |
| --------- | ------ | ------- | --------------------------------- |
| `days`    | number | `7`     | Range: 1, 7, 14, 30, 90, 180, 365 |

#### Examples

```bash
# Get 7-day OHLC for Bitcoin
curl "http://localhost:3000/api/market/ohlc/bitcoin?days=7"

# Get 30-day OHLC for Ethereum
curl "http://localhost:3000/api/market/ohlc/ethereum?days=30"
```

#### Response

```json
{
  "ohlc": [
    {
      "timestamp": 1705881600000,
      "open": 42500,
      "high": 43200,
      "low": 42300,
      "close": 43100
    }
  ]
}
```

---

### Search Coins

Search for coins, exchanges, and categories.

```
GET /api/market/search
```

#### Query Parameters

| Parameter | Type   | Description                     |
| --------- | ------ | ------------------------------- |
| `q`       | string | Search query (min 2 characters) |

#### Examples

```bash
# Search for "ethereum"
curl "http://localhost:3000/api/market/search?q=ethereum"

# Search for "sol"
curl "http://localhost:3000/api/market/search?q=sol"
```

#### Response

```json
{
  "coins": [
    {
      "id": "ethereum",
      "name": "Ethereum",
      "symbol": "eth",
      "market_cap_rank": 2,
      "thumb": "https://...",
      "large": "https://..."
    }
  ],
  "exchanges": [],
  "categories": []
}
```

---

### Compare Coins

Compare multiple coins side by side.

```
GET /api/market/compare
```

#### Query Parameters

| Parameter | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| `ids`     | string | Comma-separated coin IDs (max 25) |

#### Examples

```bash
# Compare Bitcoin, Ethereum, and Solana
curl "http://localhost:3000/api/market/compare?ids=bitcoin,ethereum,solana"
```

#### Response

```json
{
  "coins": [
    {
      "id": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "current_price": 45000,
      "market_cap": 850000000000,
      "price_change_percentage_24h": 2.5,
      "price_change_percentage_7d": 5.2,
      "price_change_percentage_30d": 12.5
    }
  ],
  "comparison_date": "2024-01-22T12:00:00.000Z"
}
```

---

### Get Tickers

Get trading pairs for a coin.

```
GET /api/market/tickers/[coinId]
```

#### Query Parameters

| Parameter | Type   | Default | Description                |
| --------- | ------ | ------- | -------------------------- |
| `page`    | number | `1`     | Page number for pagination |

#### Examples

```bash
# Get Bitcoin trading pairs
curl "http://localhost:3000/api/market/tickers/bitcoin"
```

#### Response

```json
{
  "name": "Bitcoin",
  "tickers": [
    {
      "base": "BTC",
      "target": "USDT",
      "market": {
        "name": "Binance",
        "identifier": "binance",
        "logo": "https://..."
      },
      "last": 45000,
      "volume": 15000,
      "trust_score": "green",
      "trade_url": "https://..."
    }
  ]
}
```

---

### Get Social Data

Get community and developer statistics.

```
GET /api/market/social/[coinId]
```

#### Examples

```bash
# Get Bitcoin social stats
curl "http://localhost:3000/api/market/social/bitcoin"
```

#### Response

```json
{
  "community": {
    "twitter_followers": 5500000,
    "reddit_subscribers": 4500000,
    "telegram_channel_user_count": 350000
  },
  "developer": {
    "forks": 35000,
    "stars": 72000,
    "commit_count_4_weeks": 250
  }
}
```

---

## Categories

### List Categories

Get all coin categories.

```
GET /api/market/categories
```

#### Examples

```bash
curl "http://localhost:3000/api/market/categories"
```

#### Response

```json
{
  "categories": [
    {
      "category_id": "decentralized-finance-defi",
      "name": "DeFi",
      "market_cap": 85000000000,
      "market_cap_change_24h": 3.5,
      "volume_24h": 8500000000
    }
  ]
}
```

---

### Get Category Coins

Get coins in a specific category.

```
GET /api/market/categories/[categoryId]
```

#### Query Parameters

| Parameter  | Type   | Default | Description      |
| ---------- | ------ | ------- | ---------------- |
| `per_page` | number | `100`   | Results per page |
| `page`     | number | `1`     | Page number      |

#### Examples

```bash
# Get DeFi coins
curl "http://localhost:3000/api/market/categories/decentralized-finance-defi"
```

---

## Exchanges

### List Exchanges

Get exchange rankings by volume.

```
GET /api/market/exchanges
```

#### Query Parameters

| Parameter  | Type   | Default | Description                |
| ---------- | ------ | ------- | -------------------------- |
| `per_page` | number | `100`   | Results per page (max 250) |
| `page`     | number | `1`     | Page number                |

#### Examples

```bash
# Get top 100 exchanges
curl "http://localhost:3000/api/market/exchanges"

# Get top 10 exchanges
curl "http://localhost:3000/api/market/exchanges?per_page=10"
```

#### Response

```json
{
  "exchanges": [
    {
      "id": "binance",
      "name": "Binance",
      "year_established": 2017,
      "country": "Cayman Islands",
      "trust_score": 10,
      "trust_score_rank": 1,
      "trade_volume_24h_btc": 500000
    }
  ]
}
```

---

### Get Exchange Details

Get detailed information about an exchange.

```
GET /api/market/exchanges/[exchangeId]
```

#### Examples

```bash
# Get Binance details
curl "http://localhost:3000/api/market/exchanges/binance"
```

---

## DeFi

### Get Protocols

Get DeFi protocols ranked by TVL.

```
GET /api/defi
```

#### Query Parameters

| Parameter | Type   | Default | Description         |
| --------- | ------ | ------- | ------------------- |
| `limit`   | number | `100`   | Number of protocols |

#### Examples

```bash
# Get top 100 DeFi protocols
curl "http://localhost:3000/api/defi"

# Get top 20 protocols
curl "http://localhost:3000/api/defi?limit=20"
```

#### Response

```json
{
  "protocols": [
    {
      "id": "lido",
      "name": "Lido",
      "symbol": "LDO",
      "chain": "Ethereum",
      "chains": ["Ethereum", "Polygon", "Solana"],
      "tvl": 25000000000,
      "change_1h": 0.1,
      "change_1d": 1.5,
      "change_7d": 3.2,
      "category": "Liquid Staking",
      "logo": "https://..."
    }
  ],
  "total": 100
}
```

---

### Get DeFi Market

Get global DeFi market statistics.

```
GET /api/market/defi
```

#### Examples

```bash
curl "http://localhost:3000/api/market/defi"
```

#### Response

```json
{
  "defi_market_cap": "85000000000",
  "defi_dominance": "4.5",
  "top_coin_name": "Lido",
  "top_coin_defi_dominance": 15.2
}
```

---

## Trending & Sentiment

### Get Trending

Get trending coins.

```
GET /api/trending
```

#### Examples

```bash
curl "http://localhost:3000/api/trending"
```

#### Response

```json
{
  "coins": [
    {
      "id": "pepe",
      "name": "Pepe",
      "symbol": "pepe",
      "market_cap_rank": 45,
      "thumb": "https://...",
      "price_btc": 0.00000001,
      "score": 0
    }
  ]
}
```

---

### Get Sentiment

Get Fear & Greed Index.

```
GET /api/sentiment
```

#### Examples

```bash
curl "http://localhost:3000/api/sentiment"
```

#### Response

```json
{
  "value": 72,
  "value_classification": "Greed",
  "timestamp": "2024-01-22T00:00:00.000Z",
  "time_until_update": "8 hours"
}
```

---

## Charts

### Get Chart Data

Get formatted chart data for a coin.

```
GET /api/charts
```

#### Query Parameters

| Parameter | Type   | Default  | Description       |
| --------- | ------ | -------- | ----------------- |
| `coinId`  | string | required | CoinGecko coin ID |
| `days`    | number | `7`      | Historical range  |

#### Examples

```bash
# Get 7-day chart data for Bitcoin
curl "http://localhost:3000/api/charts?coinId=bitcoin&days=7"
```

---

## Portfolio

### Get Portfolio

Get portfolio with calculated values.

```
GET /api/portfolio
```

#### Query Parameters

| Parameter     | Type   | Description  |
| ------------- | ------ | ------------ |
| `portfolioId` | string | Portfolio ID |

#### Examples

```bash
curl "http://localhost:3000/api/portfolio?portfolioId=pf_123"
```

---

### Add Holding

Add a coin to portfolio.

```
POST /api/portfolio/holding
```

#### Request Body

```json
{
  "portfolioId": "pf_123",
  "coinId": "bitcoin",
  "symbol": "btc",
  "name": "Bitcoin",
  "amount": 0.5,
  "averageBuyPrice": 40000
}
```

#### Examples

```bash
curl -X POST "http://localhost:3000/api/portfolio/holding" \
  -H "Content-Type: application/json" \
  -d '{
    "portfolioId": "pf_123",
    "coinId": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "amount": 0.5,
    "averageBuyPrice": 40000
  }'
```

---

### Remove Holding

Remove a coin from portfolio.

```
DELETE /api/portfolio/holding
```

#### Query Parameters

| Parameter     | Type   | Description       |
| ------------- | ------ | ----------------- |
| `portfolioId` | string | Portfolio ID      |
| `coinId`      | string | Coin ID to remove |

#### Examples

```bash
curl -X DELETE "http://localhost:3000/api/portfolio/holding?portfolioId=pf_123&coinId=bitcoin"
```

---

## Response Formats

### Success Response

All successful responses return JSON with appropriate HTTP status codes:

- `200 OK` - Request succeeded
- `201 Created` - Resource created
- `304 Not Modified` - Cached response (ETag match)

### Error Response

```json
{
  "error": "Error message",
  "details": "Additional context",
  "timestamp": "2024-01-22T12:00:00.000Z"
}
```

---

## Error Handling

| Status | Description                        |
| ------ | ---------------------------------- |
| `400`  | Bad Request - Invalid parameters   |
| `404`  | Not Found - Resource doesn't exist |
| `429`  | Too Many Requests - Rate limited   |
| `500`  | Internal Server Error              |

---

## Rate Limits

### CoinGecko API

| Tier | Limit         | Notes                      |
| ---- | ------------- | -------------------------- |
| Free | 10-30 req/min | Sufficient for development |
| Pro  | 500 req/min   | Recommended for production |

### Internal Rate Limiting

The API implements client-side rate limiting:

- Max 25 requests per minute window
- Automatic backoff on 429 responses
- Stale-while-revalidate caching

### Cache TTLs

| Data Type            | TTL   |
| -------------------- | ----- |
| Live prices          | 30s   |
| 1-day historical     | 60s   |
| 7-day historical     | 5min  |
| 30-day historical    | 15min |
| Exchange/Ticker data | 2min  |
| Static data          | 1hr   |

---

## Headers

### Request Headers

| Header          | Value              | Description              |
| --------------- | ------------------ | ------------------------ |
| `Accept`        | `application/json` | Expected response format |
| `If-None-Match` | ETag value         | For conditional requests |

### Response Headers

| Header                        | Description            |
| ----------------------------- | ---------------------- |
| `Cache-Control`               | Caching directives     |
| `ETag`                        | Entity tag for caching |
| `Access-Control-Allow-Origin` | CORS header (`*`)      |

---

## SDK Usage

### Using SWR (Recommended)

```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useTopCoins(limit = 10) {
  return useSWR(`/api/market/coins?type=top&limit=${limit}`, fetcher, {
    refreshInterval: 30000, // Refresh every 30s
  });
}

// Usage in component
const { data, error, isLoading } = useTopCoins(10);
```

### Using Fetch

```typescript
async function getTopCoins(limit = 10) {
  const res = await fetch(`/api/market/coins?type=top&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
```
