# Changelog

All notable changes to Crypto Data Aggregator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Comprehensive documentation overhaul
- JSDoc comments for all library functions
- TESTING.md guide for Vitest setup
- COMPONENTS.md for UI documentation
- PWA.md for Progressive Web App features
- SECURITY.md for security best practices

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
