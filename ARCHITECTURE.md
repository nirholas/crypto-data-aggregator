# 🏗️ Architecture Overview

This document describes the architecture of Free Crypto News, a Next.js application that aggregates crypto news from 130+ sources across 21 categories.

---

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Core Modules](#core-modules)
- [Data Flow](#data-flow)
- [Caching Strategy](#caching-strategy)
- [API Design](#api-design)
- [Frontend Architecture](#frontend-architecture)
- [PWA Implementation](#pwa-implementation)
- [Integrations](#integrations)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENTS                                    │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────────┤
│   Web App   │   PWA       │   Bots      │   SDKs      │   MCP       │
│  (Next.js)  │  (Offline)  │ (Discord/   │ (Python/JS/ │  (Claude/   │
│             │             │  Telegram)  │  Go/PHP)    │   ChatGPT)  │
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────┘
       │             │             │             │             │
       └─────────────┴─────────────┴─────────────┴─────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │     Vercel Edge Network     │
                    │   (CDN + Edge Functions)    │
                    └──────────────┬──────────────┘
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       │                           │                           │
┌──────▼──────┐           ┌────────▼────────┐         ┌────────▼────────┐
│   API Layer │           │   App Router    │         │   Static Assets │
│  /api/*     │           │   Pages (SSR)   │         │   /public/*     │
└──────┬──────┘           └────────┬────────┘         └─────────────────┘
       │                           │
       └───────────────┬───────────┘
                       │
              ┌────────▼────────┐
              │   Core Library  │
              │   src/lib/*     │
              └────────┬────────┘
                       │
    ┌──────────────────┼──────────────────┐
    │                  │                  │
┌───▼───┐         ┌────▼────┐        ┌────▼────┐
│  RSS  │         │ Market  │        │   AI    │
│Fetcher│         │  Data   │        │ (Groq)  │
└───┬───┘         └────┬────┘        └────┬────┘
    │                  │                  │
┌───▼───────────┐ ┌────▼──────────┐  ┌────▼─────┐
│ 7 RSS Sources │ │  CoinGecko    │  │   Groq   │
│  CoinDesk     │ │  DeFiLlama    │  │   LLM    │
│  The Block    │ │  Alternative  │  │          │
│  Decrypt      │ │               │  │          │
│  etc.         │ │               │  │          │
└───────────────┘ └───────────────┘  └──────────┘
```

---

## Technology Stack

### Core

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 16 | React SSR + API routes |
| **Runtime** | Edge Runtime | Low-latency API responses |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **React** | React 19 | UI components |

### Backend Services

| Service | Provider | Purpose |
|---------|----------|---------|
| **Hosting** | Vercel | Serverless deployment |
| **AI/LLM** | Groq | Sentiment analysis, digests |
| **Market Data** | CoinGecko | Prices, trends |
| **DeFi Data** | DeFiLlama | TVL, protocol stats |
| **Fear & Greed** | Alternative.me | Market sentiment |

### Data Sources

We aggregate news from **200+ sources** across **130+ English sources** and **75 international sources** in **18 languages**.

#### English Sources (130+)

| Category | Sources |
|----------|---------|
| **General News** | CoinDesk, The Block, Decrypt, CoinTelegraph, Blockworks, CryptoSlate, NewsBTC, Crypto.news, CryptoPotato, Daily Hodl, CoinJournal, CryptoGlobe, ZyCrypto, Crypto Daily, Blockonomi, UseTheBitcoin, NullTX, Coinspeaker, CryptoNinjas, CoinGape |
| **Bitcoin** | Bitcoin Magazine, Bitcoinist, BTC Times, Lightning Labs, Stacker News |
| **DeFi** | The Defiant, DeFi Rate, Rekt News, DeFi Pulse, Bankless, DefiLlama, Yearn, Uniswap, Aave, Compound, MakerDAO |
| **NFT & Gaming** | NFT Now, NFT Evening, NFT Plazas, PlayToEarn, DappRadar |
| **Research** | Messari, Crypto Briefing, Glassnode, Delphi Digital, Paradigm, a16z Crypto, The Block Research |
| **Trading** | AMBCrypto, BeInCrypto, U.Today, FXStreet Crypto, TradingView, CryptoQuant |
| **Ethereum & L2** | Week in Ethereum, Etherscan, Ethereum Foundation, Optimism, Arbitrum, Polygon, StarkNet, zkSync, Base |
| **Alt L1s** | Solana, NEAR, Cosmos, Avalanche, Sui, Aptos, Cardano, Polkadot |
| **Security** | SlowMist, CertiK, OpenZeppelin, Trail of Bits, samczsun, Immunefi |
| **Developer** | Alchemy, Chainlink, Infura, The Graph, Hardhat, Foundry |
| **Mining** | Bitcoin Mining News, Hashrate Index, Compass Mining |
| **Mainstream** | Bloomberg Crypto, Reuters Crypto, Forbes Crypto, CNBC Crypto, Yahoo Finance, WSJ, Financial Times |
| **Institutional** | Coinbase Blog, Binance Blog, Circle, Tether |

#### International Sources (75)

| Language | Region | Sources |
|----------|--------|---------|
| 🇰🇷 Korean | Asia | Block Media, TokenPost, CoinDesk Korea, Blockchain Today, Decenter, The B.Chain |
| 🇨🇳 Chinese | Asia | 8BTC, Jinse Finance, Odaily, ChainNews, PANews, TechFlow, Foresight News |
| 🇯🇵 Japanese | Asia | CoinPost, CoinDesk Japan, Cointelegraph JP, btcnews.jp, Crypto Times JP, CoinJinja |
| 🇪🇸 Spanish | LATAM | Cointelegraph ES, Diario Bitcoin, CriptoNoticias, BeInCrypto ES, Bitcoiner Today |
| 🇧🇷 Portuguese | LATAM | Cointelegraph BR, Livecoins, Portal do Bitcoin, BeInCrypto BR, Bitcoin Block |
| 🇩🇪 German | Europe | BTC-ECHO, Cointelegraph DE, Coincierge, CryptoMonday |
| 🇫🇷 French | Europe | Journal du Coin, Cryptonaute, Cointelegraph FR, Cryptoast |
| 🇷🇺 Russian | Europe | ForkLog, Cointelegraph RU, Bits.Media |
| 🇹🇷 Turkish | Europe | Cointelegraph TR, Koin Medya, Coinsider |
| 🇮🇹 Italian | Europe | Cointelegraph IT, Cryptonomist, Criptovalute.it |
| 🇳🇱 Dutch | Europe | Bitcoin Magazine NL, Crypto Insiders |
| 🇵🇱 Polish | Europe | Kryptowaluty.pl, Bitcoin.pl |
| 🇮🇩 Indonesian | SEA | Cointelegraph ID, Blockchain Media, Pintu Academy |
| 🇻🇳 Vietnamese | SEA | Tạp chí Bitcoin, Coin68 |
| 🇹🇭 Thai | SEA | Siam Blockchain, Bitcoin Addict Thailand |
| 🇸🇦 Arabic | MENA | Cointelegraph AR, ArabiCrypto |

---

## Directory Structure

```
free-crypto-news/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes (32 endpoints)
│   │   │   ├── news/          # Main news endpoint
│   │   │   ├── bitcoin/       # Bitcoin-specific
│   │   │   ├── defi/          # DeFi news
│   │   │   ├── breaking/      # Breaking news (1min cache)
│   │   │   ├── search/        # Search endpoint
│   │   │   ├── trending/      # Trending topics
│   │   │   ├── sentiment/     # AI sentiment analysis
│   │   │   ├── digest/        # AI daily digest
│   │   │   ├── rss/           # RSS feed output
│   │   │   └── ...
│   │   ├── (pages)/           # Frontend pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── markets/       # Markets dashboard
│   │   │   ├── defi/          # DeFi dashboard
│   │   │   ├── trending/      # Trending page
│   │   │   └── ...
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components (50+)
│   │   ├── cards/             # Article card variants
│   │   │   ├── ArticleCardLarge.tsx
│   │   │   ├── ArticleCardMedium.tsx
│   │   │   └── ArticleCardSmall.tsx
│   │   ├── Hero.tsx           # Landing hero
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Footer.tsx         # Site footer
│   │   ├── MarketStats.tsx    # Market widget
│   │   ├── FeaturedArticle.tsx # Hero article
│   │   ├── BreakingNewsBanner.tsx
│   │   └── ...
│   │
│   ├── lib/                   # Core libraries
│   │   ├── crypto-news.ts     # RSS aggregator
│   │   ├── market-data.ts     # Market data service
│   │   ├── cache.ts           # Caching layer
│   │   ├── translate.ts       # i18n translation
│   │   ├── groq.ts            # AI integration
│   │   ├── api-utils.ts       # Response helpers
│   │   └── ...
│   │
│   └── middleware.ts          # Edge middleware
│
├── sdk/                       # Official SDKs
│   ├── python/
│   ├── javascript/
│   ├── typescript/
│   ├── react/
│   ├── go/
│   └── php/
│
├── mcp/                       # Model Context Protocol
│   ├── index.js               # MCP server (Claude)
│   └── http-server.js         # HTTP server (ChatGPT)
│
├── widget/                    # Embeddable widgets
│   ├── ticker.js
│   └── carousel.js
│
├── examples/                  # Integration examples
│   ├── discord-bot.js
│   ├── telegram-bot.py
│   ├── slack-bot.js
│   └── langchain-tool.py
│
├── scripts/                   # Build/utility scripts
│   ├── archive/               # Data archival
│   └── i18n/                  # Translation scripts
│
├── public/                    # Static assets
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
│
└── docs/                      # Documentation
    └── API.md
```

---

## Core Modules

### `src/lib/crypto-news.ts`

The heart of the aggregator. Fetches and normalizes RSS feeds.

```typescript
// Key exports
export async function getLatestNews(limit, source, options);
export async function getBitcoinNews(limit);
export async function getDefiNews(limit);
export async function getBreakingNews(limit);
export async function searchNews(query, limit);
export async function getSources();
```

**Features:**
- Parallel RSS fetching
- HTML sanitization
- Deduplication by URL
- Source normalization
- Time-ago calculation

### `src/lib/market-data.ts`

Market data integration with CoinGecko and DeFiLlama.

```typescript
// Key exports
export async function getMarketOverview();
export async function getTopCoins(limit);
export async function getTrendingCoins();
export async function getProtocolTVL();
export async function getFearGreedIndex();
```

### `src/lib/cache.ts`

In-memory caching layer with TTL support.

```typescript
// Key exports
export function getCached<T>(key: string): T | null;
export function setCached<T>(key: string, value: T, ttlSeconds: number);
export function invalidateCache(pattern: string);
```

### `src/lib/groq.ts`

AI/LLM integration for intelligent features.

```typescript
// Key exports
export async function promptGroqJson<T>(prompt: string, schema: object): Promise<T>;
export function isGroqConfigured(): boolean;
```

---

## Data Flow

### News Request Flow

```
Client Request
     │
     ▼
┌────────────────┐
│  Edge Runtime  │
│   (Vercel)     │
└───────┬────────┘
        │
        ▼
┌────────────────┐     ┌─────────────┐
│  Check Cache   │────▶│ Return if   │
│   (in-memory)  │     │   fresh     │
└───────┬────────┘     └─────────────┘
        │ miss
        ▼
┌────────────────┐
│  Fetch RSS     │
│  (parallel)    │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  Parse XML     │
│  Normalize     │
│  Sanitize      │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  Deduplicate   │
│  Sort by date  │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  Update Cache  │
│  (5 min TTL)   │
└───────┬────────┘
        │
        ▼
   JSON Response
```

### Translation Flow (i18n)

```
Articles (English)
        │
        ▼
┌────────────────┐
│ Check lang     │
│ parameter      │
└───────┬────────┘
        │ non-en
        ▼
┌────────────────┐
│ Batch titles   │
│ + descriptions │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Google Cloud   │
│ Translation    │
└───────┬────────┘
        │
        ▼
   Translated JSON
```

---

## Caching Strategy

### Cache Layers

| Layer | Location | TTL | Purpose |
|-------|----------|-----|---------|
| **Browser** | Client | 5 min | Reduce requests |
| **CDN** | Vercel Edge | 5 min | Geographic distribution |
| **Application** | Edge Function | 5 min | Avoid upstream calls |
| **Stale-While-Revalidate** | CDN | 10 min | Serve stale while updating |

### Cache Times by Endpoint

| Endpoint | Cache TTL | Reason |
|----------|-----------|--------|
| `/api/news` | 5 min | Balance freshness/load |
| `/api/breaking` | 1 min | Time-sensitive |
| `/api/sources` | 1 hour | Rarely changes |
| `/api/trending` | 5 min | Computed from news |
| `/api/digest` | 5 min | AI-generated |

### Cache Headers

```typescript
headers: {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  'CDN-Cache-Control': 'public, max-age=300',
  'Vercel-CDN-Cache-Control': 'public, max-age=300'
}
```

---

## API Design

### Design Principles

1. **RESTful** - Resource-based URLs
2. **JSON** - Standard response format
3. **No Auth** - 100% public endpoints
4. **CORS** - Open to all origins
5. **Cacheable** - Proper cache headers
6. **Paginated** - Large lists support pagination

### Response Envelope

All endpoints return consistent structure:

```typescript
interface ApiResponse<T> {
  data: T;
  fetchedAt: string;        // ISO timestamp
  responseTime: string;     // e.g., "245ms"
  pagination?: {
    page: number;
    perPage: number;
    totalPages: number;
    hasMore: boolean;
  };
}
```

### Error Handling

```typescript
interface ApiError {
  error: string;            // Error type
  message: string;          // Human-readable
  status: number;           // HTTP status code
}
```

---

## Frontend Architecture

### Component Hierarchy

```
App
├── ThemeProvider (dark mode)
├── PWAProvider (offline)
├── BookmarksProvider (local storage)
│
└── Layout
    ├── Header
    │   ├── Logo
    │   ├── CategoryNav
    │   ├── SearchModal
    │   └── ThemeToggle
    │
    ├── Main Content
    │   ├── Hero
    │   ├── BreakingNewsBanner
    │   ├── FeaturedArticle
    │   ├── Posts (grid)
    │   │   ├── ArticleCardLarge
    │   │   ├── ArticleCardMedium
    │   │   └── ArticleCardSmall
    │   ├── TrendingSidebar
    │   └── MarketStats
    │
    └── Footer
```

### Design System

**Colors (Brand):**
- Primary: `#F59E0B` (Amber 500)
- Dark mode: Slate palette

**Source-Specific Gradients:**
```typescript
const sourceStyles = {
  'CoinDesk': 'from-blue-700 via-blue-600 to-cyan-500',
  'CoinTelegraph': 'from-orange-700 via-amber-600 to-yellow-500',
  'The Block': 'from-purple-700 via-violet-600 to-indigo-500',
  'Decrypt': 'from-emerald-700 via-green-600 to-teal-500',
  'Bitcoin Magazine': 'from-orange-800 via-orange-600 to-amber-500',
  'Blockworks': 'from-slate-700 via-gray-600 to-zinc-500',
  'The Defiant': 'from-pink-700 via-rose-600 to-red-500',
};
```

### State Management

- **Server State**: React Server Components (RSC)
- **Client State**: React Context + useState
- **Persistence**: LocalStorage (bookmarks)
- **URL State**: Next.js searchParams

---

## PWA Implementation

### Service Worker Strategy

```javascript
// public/sw.js

// Cache strategies by content type
const strategies = {
  api: 'NetworkFirst',      // Fresh data, fallback to cache
  static: 'CacheFirst',     // Assets rarely change
  images: 'CacheFirst',     // Large, slow to fetch
  pages: 'NetworkFirst',    // Dynamic content
};
```

### Offline Support

| Feature | Strategy |
|---------|----------|
| **Pages** | Cache on visit, serve offline |
| **API** | Cache responses, show stale |
| **Images** | Cache first, 30-day TTL |
| **Assets** | Cache first, 7-day TTL |

### App Manifest

```json
{
  "name": "Free Crypto News",
  "short_name": "Crypto News",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#F59E0B",
  "shortcuts": [
    { "name": "Latest News", "url": "/" },
    { "name": "Breaking", "url": "/breaking" },
    { "name": "Bitcoin", "url": "/category/bitcoin" }
  ]
}
```

---

## Integrations

### MCP (Model Context Protocol)

Two server implementations:

1. **`mcp/index.js`** - STDIO server for Claude Desktop
2. **`mcp/http-server.js`** - HTTP server for ChatGPT Actions

**Tools Exposed:**
- `get_latest_news` - Fetch recent articles
- `get_bitcoin_news` - Bitcoin-specific
- `get_breaking_news` - Breaking stories
- `search_news` - Keyword search
- `get_trending` - Trending topics

### Widgets

Embeddable JavaScript widgets:

```html
<!-- Ticker widget -->
<script src="https://crypto-data-aggregator.modelcontextprotocol.name/widget/ticker.js"></script>
<div id="crypto-news-ticker"></div>

<!-- Carousel widget -->
<script src="https://crypto-data-aggregator.modelcontextprotocol.name/widget/carousel.js"></script>
<div id="crypto-news-carousel"></div>
```

### Webhooks

```
POST /api/webhooks
{
  "url": "https://your-server.com/webhook",
  "events": ["breaking", "bitcoin"],
  "secret": "your-webhook-secret"
}
```

---

## Performance

### Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| TTFB | < 200ms | ~150ms |
| LCP | < 2.5s | ~1.8s |
| FID | < 100ms | ~50ms |
| CLS | < 0.1 | ~0.02 |

### Optimizations

1. **Edge Runtime** - Run close to users
2. **Parallel Fetching** - Fetch all RSS simultaneously
3. **Streaming** - Stream large responses
4. **Image Optimization** - Next.js Image component
5. **Code Splitting** - Route-based chunks
6. **Prefetching** - Link prefetch on hover

---

## Security

### Measures

- **Input Validation** - Zod schemas for all inputs
- **HTML Sanitization** - sanitize-html for RSS content
- **CORS** - Configured per-endpoint
- **Rate Limiting** - Per-IP limits
- **No Secrets** - No API keys required (public)
- **CSP** - Content Security Policy headers

### Environment Variables

```bash
# Optional - enables AI features
GROQ_API_KEY=gsk_...

# Optional - enables translation
GOOGLE_CLOUD_API_KEY=...
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

---

## Related Documentation

- [API Reference](API.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Component Documentation](COMPONENTS.md)
