# Changelog

All notable changes to Crypto Data Aggregator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- **Complete Multi-Source Data Integration** - Full API integrations with 4 new data providers
  - **CryptoCompare** (`src/lib/cryptocompare.ts`): 600+ lines
    - Historical OHLCV data (daily/hourly/minute intervals)
    - Social stats (Twitter followers, Reddit subscribers, GitHub activity)
    - Real-time and full price data
    - Top coins by volume and market cap
    - News aggregation
    - Blockchain data (latest/historical)
  - **Messari** (`src/lib/messari.ts`): 700+ lines
    - Asset profiles and fundamentals
    - Market metrics (ROI, developer activity, mining stats)
    - Asset markets and exchanges
    - Sector classification
    - Research news feed
    - Global market metrics
  - **Coinglass** (`src/lib/coinglass.ts`): 600+ lines
    - Open interest (aggregated and by symbol)
    - Funding rates and averages
    - Liquidation data and summaries
    - Long/short ratios (global and by account)
    - Options data
    - Exchange derivatives info
    - Market sentiment analysis
  - **Etherscan Multi-Chain** (`src/lib/etherscan.ts`): 700+ lines
    - Support for 7 EVM chains (Ethereum, Base, Arbitrum, Polygon, Optimism, BSC, Avalanche)
    - Gas oracle with safe/standard/fast prices
    - ETH price and supply stats
    - Wallet balances and transactions
    - Token transfers and contract verification
    - Network statistics and gas comparison

- **5 New API Routes** - RESTful endpoints for all new data sources
  - `/api/market/cryptocompare` - 11 actions (price, history, news, blockchain, etc.)
  - `/api/market/messari` - 11 actions (assets, metrics, profile, sectors, etc.)
  - `/api/market/coinglass` - 9 actions (openinterest, funding, liquidations, etc.)
  - `/api/market/etherscan` - 12 actions (gas, price, supply, wallet, etc.)
  - `/api/market/aggregated` - 6 types (overview, prices, derivatives, onchain, fundamental, full)

- **30+ React Hooks** (`src/hooks/data-sources.ts`): 800+ lines
  - CryptoCompare hooks: `useCryptoComparePrice`, `useCryptoCompareTopVolume`, `useCryptoCompareHistory`, `useCryptoCompareNews`, `useCryptoCompareBlockchain`
  - Messari hooks: `useMessariGlobal`, `useMessariAssets`, `useMessariAsset`, `useMessariProfile`, `useMessariMetrics`, `useMessariComprehensive`, `useMessariNews`, `useMessariSectors`
  - Coinglass hooks: `useCoinglassOverview`, `useCoinglassOpenInterest`, `useCoinglassFunding`, `useCoinglassLiquidations`, `useCoinglassLongShort`, `useCoinglassGlobalLongShort`, `useCoinglassSymbol`, `useCoinglassExchanges`
  - Etherscan hooks: `useEtherscanStats`, `useMultiChainGas`, `useGasComparison`, `useEthereumGas`, `useEthereumPrice`, `useWalletData`
  - Aggregated hooks: `useAggregatedOverview`, `useAggregatedPrices`, `useAggregatedDerivatives`, `useAggregatedOnchain`, `useAggregatedFundamental`, `useAggregatedFull`
  - Utility hooks: `useFormattedNumber`, `useFormattedPercentage`, `useDataSourceHealth`

- **6 New UI Components** - Production-ready data visualization
  - `DerivativesDashboard` - Liquidations, L/S ratios, open interest tables
  - `MultiChainGasTracker` - Gas prices across 7 EVM chains
  - `FundamentalDataCard` - Messari fundamentals with ROI, supply, markets
  - `AggregatedMarketOverview` - Multi-source global market data
  - `PriceHistoryChart` - SVG price charts with timeframe selection
  - `CryptoNewsAggregator` - Combined news from CryptoCompare and Messari

- **Environment Configuration** - Updated `.env.example` with new API keys
  - CRYPTOCOMPARE_API_KEY
  - MESSARI_API_KEY
  - COINGLASS_API_KEY
  - ETHERSCAN_API_KEY, BASESCAN_API_KEY, ARBISCAN_API_KEY
  - POLYGONSCAN_API_KEY, OPTIMISTIC_ETHERSCAN_API_KEY
  - BSCSCAN_API_KEY, SNOWTRACE_API_KEY

- **13 New Free Data Sources** (previous) - Expanded data aggregation capabilities
  - CryptoCompare: Historical OHLCV data, social stats (Twitter, Reddit, GitHub)
  - Blockchain.com: Bitcoin on-chain stats, block height, network difficulty
  - Messari: Research data, asset metrics (FREE tier: 20 requests/minute)
  - CoinGlass: Funding rates, open interest across exchanges
  - GoPlus Labs: Token security analysis (honeypot detection, tax check, trust score)
  - Etherscan: Gas oracle, ETH supply stats (FREE tier: 5 calls/sec)
  - Token Unlocks: Vesting schedule data for upcoming token unlocks
- **additional-sources.ts** - New utility library with typed helper functions
  - `getHistoricalOHLCV()` - Fetch historical price data with configurable intervals
  - `getSocialStats()` - Get Twitter/Reddit/GitHub metrics for coins
  - `getBitcoinStats()` - Bitcoin network stats (hashrate, difficulty, fees)
  - `getFundingRates()` - Perpetual futures funding rates by exchange
  - `getOpenInterest()` - Futures open interest aggregated across exchanges
  - `getTokenSecurity()` - Honeypot/scam detection with calculated trust score
  - `getEthGasOracle()` - Real-time Ethereum gas prices (safe, standard, fast)
  - `getUpcomingUnlocks()` - Token vesting unlock schedules
- **MarketMoodRing Component** - Animated SVG circular gauge displaying Fear & Greed Index
  - Gradient-filled rings with pulsing glow effects
  - 5 mood states: Extreme Fear, Fear, Neutral, Greed, Extreme Greed
  - Interactive hover states with detailed tooltips
  - Multiple size variants (sm, md, lg, xl)
  - Full accessibility support with ARIA labels
  - Companion components: `MarketMoodBadge`, `MarketMoodSparkline`
- **MarketMoodWidget** - Ready-to-use widget with real-time data
  - Full, compact, and minimal variants
  - Auto-refresh functionality
  - Sidebar and header variants included
- **useMarketMood Hook** - Real-time Fear & Greed Index data fetching
  - Auto-refresh every 5 minutes
  - Response caching to reduce API calls
  - 7-day historical data support
  - Helper functions: `getMoodColor()`, `getMoodLabel()`
- Comprehensive documentation overhaul
- JSDoc comments for all library functions
- TESTING.md guide for Vitest setup
- COMPONENTS.md for UI documentation
- PWA.md for Progressive Web App features
- SECURITY.md for security best practices

### Changed

- **Design Token Migration (Complete)** - Migrated all components from hardcoded colors to
  centralized design tokens
  - Data visualization components: charts.tsx, coin-charts, Screener, MarketStats,
    SentimentDashboard, CorrelationMatrix, DominanceChart, GasTracker, LiquidationsFeed, PriceWidget
  - All 16 loading.tsx skeleton files
  - Error boundary components
  - Utility components: Skeletons, LoadingSpinner, ErrorBoundary, ExportData, KeyboardShortcuts,
    PriceAlerts
  - Portfolio and watchlist components
  - Replaced `dark:` prefix patterns with semantic tokens
  - Charts now use `chartColors` from `src/lib/colors.ts` for Recharts compatibility

---

## [1.0.0] - 2026-01-22

### Added

#### Core Features

- Real-time cryptocurrency market data from CoinGecko API
- Track 10,000+ cryptocurrencies with live prices
- DeFi protocol analytics with DeFiLlama integration
- Fear & Greed Index sentiment tracking
- Global market statistics dashboard

#### Portfolio Management

- Create multiple portfolios
- Add/remove/update holdings
- Real-time portfolio valuation
- Performance tracking with profit/loss calculations
- Portfolio news feed

#### Watchlist

- Create custom watchlists
- Quick add/remove coins
- Organize by custom order
- Persist across sessions (localStorage)

#### Price Alerts

- Price threshold alerts (above/below)
- Percentage change alerts (24h)
- Keyword mention alerts
- Push notification support
- Multiple notification channels

#### Charts & Analytics

- Interactive price charts with Recharts
- Multiple timeframes (24h, 7d, 30d, 1y, max)
- OHLC candlestick charts
- Volume overlay
- Sparkline mini-charts

#### Market Views

- Top coins by market cap
- Trending coins (24h)
- Top gainers and losers
- New listings
- Category browsing
- Exchange listings

#### News & Content

- Aggregated crypto news
- Breaking news highlights
- Category-based filtering
- Article bookmarking
- Read later queue

#### User Experience

- Progressive Web App (PWA)
- Offline support with service worker
- Dark/light/system theme
- Keyboard shortcuts
- Global search (Cmd+K)
- Responsive design (mobile-first)

#### Developer Experience

- TypeScript throughout
- Comprehensive API routes
- Edge Runtime support
- Vitest test suite
- ESLint + Prettier
- Husky pre-commit hooks

### Technical Stack

- Next.js 16 with App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- SWR for data fetching
- Recharts for visualization
- Framer Motion for animations

---

## Version History Format

### [X.Y.Z] - YYYY-MM-DD

#### Added

- New features

#### Changed

- Changes to existing functionality

#### Deprecated

- Features to be removed in future versions

#### Removed

- Features removed in this version

#### Fixed

- Bug fixes

#### Security

- Security patches

---

## Upgrade Guide

### From 0.x to 1.0.0

This is the initial stable release. If upgrading from a pre-release version:

1. **Clear localStorage** - Data format has changed

   ```javascript
   localStorage.clear();
   ```

2. **Update dependencies**

   ```bash
   npm install
   ```

3. **Rebuild the application**

   ```bash
   npm run build
   ```

4. **Clear service worker cache**
   - Open DevTools → Application → Service Workers
   - Click "Unregister"
   - Reload the page

---

## Links

- [GitHub Releases](https://github.com/nirholas/crypto-data-aggregator/releases)
- [Migration Guides](./MIGRATION.md)
- [Contributing](../CONTRIBUTING.md)
