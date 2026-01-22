# 📊 Crypto Data Aggregator

<p align="center">
  <a href="https://github.com/nirholas/crypto-data-aggregator/stargazers"><img src="https://img.shields.io/github/stars/nirholas/crypto-data-aggregator?style=for-the-badge&logo=github&color=yellow" alt="GitHub Stars"></a>
  <a href="https://github.com/nirholas/crypto-data-aggregator/blob/main/LICENSE"><img src="https://img.shields.io/github/license/nirholas/crypto-data-aggregator?style=for-the-badge&color=blue" alt="License"></a>
  <a href="https://github.com/nirholas/crypto-data-aggregator/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/nirholas/crypto-data-aggregator/ci.yml?style=for-the-badge&logo=github-actions&label=CI" alt="CI Status"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript 5.0">
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS 4">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19">
</p>

<p align="center">
  <b>🆓 100% Free • 🔑 No API Keys Required • ⚡ Real-Time Data • 📱 PWA Ready</b>
</p>

<p align="center">
  Real-time cryptocurrency market data aggregator. Track 10,000+ coins, monitor 200+ DeFi protocols,<br>
  manage portfolios, set price alerts, and analyze market sentiment—all in one place.
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-feature-deep-dive">Deep Dive</a> •
  <a href="#-api-endpoints">API</a> •
  <a href="#-deployment">Deploy</a> •
  <a href="docs/API.md">Docs</a>
</p>

---

## ⚡ Quick Start

```bash
# Clone and run in 30 seconds
git clone https://github.com/nirholas/crypto-data-aggregator.git
cd crypto-data-aggregator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — no API keys needed! 🎉

---

## 🎯 Why This Project?

| Feature         | Crypto Data Aggregator | Paid Alternatives |
| --------------- | ---------------------- | ----------------- |
| **API Key**     | ❌ None needed         | Required          |
| **Rate Limit**  | ✅ Generous free tier  | Limited           |
| **Self-Host**   | ✅ One click           | No                |
| **PWA**         | ✅ Installable         | Rarely            |
| **Open Source** | ✅ MIT License         | No                |
| **DeFi Data**   | ✅ 200+ protocols      | Extra cost        |

---

## ✨ Features

### 📈 Market Data

- **Live Prices** — Real-time prices for 10,000+ cryptocurrencies
- **Market Rankings** — Market cap, volume, and supply data
- **Gainers & Losers** — Track top movers (1h, 24h, 7d, 30d)
- **Trending Coins** — CoinGecko trending + social signals
- **Categories** — Filter by DeFi, Gaming, Layer 2, Memecoins, and more
- **New Listings** — Discover newly listed tokens

### 🏦 DeFi Dashboard

- **200+ Protocols** — TVL rankings from DeFiLlama
- **Chain Analytics** — Ethereum, Solana, Arbitrum, Base, and 50+ chains
- **Category Filters** — DEX, Lending, Bridges, Liquid Staking, Derivatives
- **Protocol Comparison** — Side-by-side TVL and metrics comparison

### 📊 Advanced Tools

| Tool             | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| **🔥 Heatmap**   | Visual market overview with size-by-market-cap                 |
| **🔍 Screener**  | Filter coins by market cap, volume, price change, ATH distance |
| **⚖️ Compare**   | Compare up to 5 coins side-by-side with historical charts      |
| **📉 Charts**    | Interactive price charts with OHLC candlesticks                |
| **😱 Sentiment** | Fear & Greed Index with historical trends                      |

### 💼 Portfolio & Tracking

| Feature             | Description                                         |
| ------------------- | --------------------------------------------------- |
| **💰 Portfolio**    | Track holdings with P&L, cost basis, and allocation |
| **⭐ Watchlist**    | Custom watchlists with drag-and-drop reordering     |
| **🔔 Price Alerts** | Set alerts for price targets (above/below)          |
| **📤 Export**       | Export portfolio & watchlist as JSON/CSV            |

### ⚡ Power User Features

- **⌨️ Keyboard Shortcuts** — Vim-style navigation (`j/k`, `g+h/t/w/p`)
- **🔎 Command Palette** — Quick actions with `Cmd+K` / `Ctrl+K`
- **🌙 Dark Mode** — Beautiful dark theme with `d` toggle
- **📱 PWA** — Install as app on mobile & desktop
- **🔄 Cross-Tab Sync** — Watchlist syncs across browser tabs

---

## � Feature Deep Dive

### Market Heatmap

Visualize the entire crypto market at a glance with our interactive heatmap.

| Feature                  | Description                                                 |
| ------------------------ | ----------------------------------------------------------- |
| **Size by Market Cap**   | Larger tiles = larger market cap (uses square root scaling) |
| **Color by Performance** | Light = gains, Dark = losses (monochrome gradient)          |
| **Timeframe Toggle**     | Switch between 24h and 7d performance                       |
| **Top N Filter**         | Show top 25, 50, or 100 coins                               |
| **Sort Options**         | Sort by market cap or absolute change                       |
| **Interactive Tiles**    | Click any coin to view details                              |

**Color Scale:**

- `+20%+` — Lightest (near white)
- `+10%` — Light gray
- `0%` — Mid gray
- `-10%` — Dark gray
- `-20%+` — Darkest (near black)

---

### Advanced Screener

Find coins matching your exact criteria with powerful filters and presets.

**Filter Options:**

| Filter       | Range   | Example         |
| ------------ | ------- | --------------- |
| Market Cap   | Min/Max | $1B - $10B      |
| 24h Volume   | Min/Max | $100M+          |
| Price        | Min/Max | $0.01 - $100    |
| 24h Change   | Min/Max | +5% to +50%     |
| ATH Distance | Min/Max | -10% (near ATH) |

**Built-in Presets:**

| Preset          | Criteria                |
| --------------- | ----------------------- |
| 🐋 Large Caps   | Market Cap > $10B       |
| 🦈 Mid Caps     | $1B - $10B              |
| 🐟 Small Caps   | $100M - $1B             |
| 🦐 Micro Caps   | < $100M                 |
| 🔥 Hot Today    | 24h Change > +10%       |
| 📉 Dipping      | 24h Change < -10%       |
| 🎯 Near ATH     | Within -10% of ATH      |
| 💎 Far From ATH | More than -50% from ATH |
| 📊 High Volume  | Volume > $1B            |

**Additional Features:**

- Real-time search with instant filtering
- Multi-column sorting (click any header)
- Add to watchlist directly from results
- Export filtered results to CSV

---

### Coin Comparison

Compare up to 5 cryptocurrencies side-by-side with synchronized charts.

**Metrics Compared:**

| Metric             | Description                 |
| ------------------ | --------------------------- |
| Current Price      | Live price in USD           |
| Market Cap         | Total market capitalization |
| 24h Volume         | Trading volume              |
| 24h/7d/30d Change  | Price change percentages    |
| All-Time High      | ATH price and distance      |
| Circulating Supply | Coins in circulation        |

**Chart Features:**

- Synchronized historical charts
- Time range: 24h, 7d, 30d, 90d, 1Y
- Normalized percentage view
- Share comparison via URL

**Quick Compare:** Popular pairs pre-loaded: BTC vs ETH, SOL vs ADA, etc.

---

### Sentiment Analysis

Track market psychology with Fear & Greed metrics and social signals.

**Fear & Greed Index:**

| Value  | Label            | Market Condition             |
| ------ | ---------------- | ---------------------------- |
| 0-20   | 😱 Extreme Fear  | Potential buying opportunity |
| 21-40  | 😰 Fear          | Cautious sentiment           |
| 41-60  | 😐 Neutral       | Balanced market              |
| 61-80  | 😊 Greed         | Optimistic sentiment         |
| 81-100 | 🤑 Extreme Greed | Potential correction         |

**Dashboard Components:**

- Real-time Fear & Greed gauge
- Historical sentiment chart (30 days)
- Bullish/Bearish/Neutral breakdown
- Social volume metrics
- Top trending coins by sentiment

---

### Portfolio Tracker

Professional-grade portfolio management with real-time P&L.

**Portfolio Features:**

| Feature             | Description                                |
| ------------------- | ------------------------------------------ |
| **Holdings**        | Add coins with amount, buy price, and date |
| **Real-Time Value** | Live portfolio value calculation           |
| **P&L Tracking**    | Profit/loss per coin and total             |
| **Cost Basis**      | Average purchase price calculation         |
| **Allocation**      | Pie chart of portfolio distribution        |
| **24h Change**      | Daily portfolio performance                |

**Transaction Types:**

- Buy — Add to position
- Sell — Reduce position
- Transfer — Move between wallets

**Import/Export:**

```json
// Export format
{
  "holdings": [
    {
      "coinId": "bitcoin",
      "amount": 0.5,
      "totalCost": 25000,
      "averagePrice": 50000
    }
  ],
  "exportedAt": "2026-01-22T..."
}
```

---

### Watchlist

Create and manage custom watchlists with real-time updates.

**Features:**

| Feature                | Description                          |
| ---------------------- | ------------------------------------ |
| **Unlimited Lists**    | Create multiple watchlists           |
| **Drag & Drop**        | Reorder coins to your preference     |
| **Quick Add**          | Star icon on any coin card           |
| **Bulk Actions**       | Select multiple for batch operations |
| **Cross-Tab Sync**     | Changes sync instantly across tabs   |
| **Persistent Storage** | Saved to localStorage                |

**Export Formats:**

- JSON — Full data with metadata
- CSV — Spreadsheet compatible
- Plain Text — Simple list of symbols

---

### Price Alerts

Set price targets and get notified when coins hit your levels.

**Alert Types:**

| Type            | Trigger                              |
| --------------- | ------------------------------------ |
| **Price Above** | Notify when price exceeds target     |
| **Price Below** | Notify when price drops below target |

**Alert Features:**

- Multiple alerts per coin
- Real-time price monitoring
- Visual notification when triggered
- Alert history with timestamps
- Enable/disable individual alerts

**Example Alerts:**

```
BTC > $100,000  →  "Bitcoin just broke $100K!"
ETH < $2,000    →  "Ethereum dipped below $2K"
SOL > $200      →  "Solana hit your target"
```

---

### DeFi Dashboard

Comprehensive DeFi analytics powered by DeFiLlama.

**Protocol Data:**

| Metric         | Description                    |
| -------------- | ------------------------------ |
| **TVL**        | Total Value Locked in protocol |
| **24h Change** | TVL change in last 24 hours    |
| **7d Change**  | TVL change over 7 days         |
| **Category**   | DEX, Lending, Bridge, etc.     |
| **Chains**     | Supported blockchains          |
| **Audits**     | Security audit status          |

**Chain Analytics:**

- TVL by chain (Ethereum, Solana, etc.)
- Chain dominance percentages
- Cross-chain protocol distribution
- Bridge TVL tracking

**Categories Tracked:**

- 🔄 DEXes (Uniswap, Curve, etc.)
- 🏦 Lending (Aave, Compound, etc.)
- 🌉 Bridges (Stargate, Across, etc.)
- 💧 Liquid Staking (Lido, Rocket Pool, etc.)
- 📈 Derivatives (GMX, dYdX, etc.)
- 🎰 Yield Aggregators (Yearn, Beefy, etc.)

---

### Charts & Technical Data

Interactive price charts with multiple timeframes and data types.

**Chart Types:**

| Type            | Description                 |
| --------------- | --------------------------- |
| **Line Chart**  | Simple price over time      |
| **OHLC**        | Open, High, Low, Close bars |
| **Candlestick** | Traditional trading view    |

**Timeframes:**

- 24 hours
- 7 days
- 30 days
- 90 days
- 1 year
- Max (all available data)

**Data Points:**

- Price history
- Volume overlay
- Market cap history
- Price change annotations

---

## �🖥️ Pages & Routes

### Market Data

| Route                 | Description                         |
| --------------------- | ----------------------------------- |
| `/`                   | Markets dashboard with global stats |
| `/markets`            | Full coin rankings table            |
| `/markets/trending`   | Trending coins                      |
| `/markets/gainers`    | Top gainers by % change             |
| `/markets/losers`     | Top losers by % change              |
| `/markets/categories` | Browse by category                  |
| `/markets/exchanges`  | Exchange volume rankings            |
| `/markets/new`        | Recently listed coins               |

### Coin Details

| Route            | Description                                      |
| ---------------- | ------------------------------------------------ |
| `/coin/[coinId]` | Detailed coin page with charts, stats, and links |

### Analytics

| Route        | Description                            |
| ------------ | -------------------------------------- |
| `/defi`      | DeFi dashboard with protocols & chains |
| `/heatmap`   | Visual market heatmap                  |
| `/screener`  | Advanced coin screener with filters    |
| `/compare`   | Compare multiple coins                 |
| `/sentiment` | Fear & Greed analysis                  |
| `/movers`    | Top movers overview                    |

### User Features

| Route        | Description           |
| ------------ | --------------------- |
| `/portfolio` | Portfolio tracker     |
| `/watchlist` | Saved coins watchlist |

---

## 🔌 API Endpoints

All endpoints return JSON. No API key required.

### Market Data

```bash
# Get top 100 coins by market cap
curl "http://localhost:3000/api/market/coins"

# Get top 10 coins
curl "http://localhost:3000/api/market/coins?type=top&limit=10"

# Get coin details
curl "http://localhost:3000/api/market/snapshot/bitcoin"

# Get price history (7 days)
curl "http://localhost:3000/api/market/history/bitcoin?days=7"

# Get OHLC candlestick data
curl "http://localhost:3000/api/market/ohlc/bitcoin?days=14"

# Search coins
curl "http://localhost:3000/api/market/search?q=ethereum"
```

### DeFi & Analytics

```bash
# Get DeFi protocol rankings
curl "http://localhost:3000/api/defi"

# Get trending coins
curl "http://localhost:3000/api/trending"

# Get Fear & Greed Index
curl "http://localhost:3000/api/sentiment"
```

### Endpoint Reference

| Endpoint                        | Method | Description                          |
| ------------------------------- | ------ | ------------------------------------ |
| `/api/market/coins`             | GET    | Paginated coin list with market data |
| `/api/market/snapshot/[coinId]` | GET    | Detailed coin data                   |
| `/api/market/history/[coinId]`  | GET    | Historical price data                |
| `/api/market/ohlc/[coinId]`     | GET    | OHLC candlestick data                |
| `/api/market/search`            | GET    | Search coins by name/symbol          |
| `/api/market/categories`        | GET    | List all categories                  |
| `/api/market/exchanges`         | GET    | Exchange rankings                    |
| `/api/defi`                     | GET    | Protocol TVL rankings                |
| `/api/trending`                 | GET    | Trending coins                       |
| `/api/sentiment`                | GET    | Fear & Greed index                   |
| `/api/charts/[coinId]`          | GET    | Chart data for visualization         |

📚 See [docs/API.md](docs/API.md) for complete API reference with examples.

---

## 📡 Data Sources

All data is fetched from free, public APIs — no API keys required for basic usage.

### CoinGecko

| Data Type    | Endpoint                   | Rate Limit      |
| ------------ | -------------------------- | --------------- |
| Coin Prices  | `/coins/markets`           | 10-50 calls/min |
| Coin Details | `/coins/{id}`              | 10-50 calls/min |
| Historical   | `/coins/{id}/market_chart` | 10-50 calls/min |
| OHLC         | `/coins/{id}/ohlc`         | 10-50 calls/min |
| Search       | `/search`                  | 10-50 calls/min |
| Trending     | `/search/trending`         | 10-50 calls/min |
| Categories   | `/coins/categories`        | 10-50 calls/min |
| Exchanges    | `/exchanges`               | 10-50 calls/min |

> 💡 **Pro Tip:** Set `COINGECKO_API_KEY` for 500+ calls/min with Pro plan.

### DeFiLlama

| Data Type | Endpoint          | Rate Limit |
| --------- | ----------------- | ---------- |
| Protocols | `/protocols`      | Unlimited  |
| TVL       | `/tvl/{protocol}` | Unlimited  |
| Chains    | `/chains`         | Unlimited  |

### Alternative.me

| Data Type    | Endpoint | Rate Limit |
| ------------ | -------- | ---------- |
| Fear & Greed | `/fng/`  | Unlimited  |

---

## 🔎 Command Palette

Power user's best friend — access any feature instantly with `Cmd+K` / `Ctrl+K`.

### Available Commands

**Navigation:** | Command | Description | |---------|-------------| | 🏠 Go to Home | Navigate to
markets dashboard | | 📈 Go to Markets | Full coin rankings | | 🏦 Go to DeFi | DeFi protocol
dashboard | | 🔥 Go to Trending | Trending coins | | 🚀 Go to Movers | Top gainers and losers | | ⭐
Go to Watchlist | Your saved coins | | 💼 Go to Portfolio | Portfolio tracker | | ⚖️ Go to Compare |
Coin comparison | | 🔥 Go to Heatmap | Market heatmap | | 🔍 Go to Screener | Advanced screener |

**Actions:** | Command | Description | |---------|-------------| | 🌙 Toggle Dark Mode | Switch
theme | | 🔔 Manage Alerts | Open alerts panel | | ⌨️ Keyboard Shortcuts | Show help modal |

**Search:** Type any coin name to search instantly!

---

## ⌨️ Keyboard Shortcuts

Power user navigation — works everywhere!

### Navigation

| Key       | Action                    |
| --------- | ------------------------- |
| `j` / `k` | Navigate down/up in lists |
| `Enter`   | Open selected item        |
| `Escape`  | Close modal / blur input  |

### Quick Access (`g` + key)

| Key   | Action          |
| ----- | --------------- |
| `g h` | Go to Home      |
| `g t` | Go to Trending  |
| `g w` | Go to Watchlist |
| `g p` | Go to Portfolio |
| `g c` | Go to Compare   |
| `g d` | Go to DeFi      |

### Actions

| Key            | Action                        |
| -------------- | ----------------------------- |
| `/` or `Cmd+K` | Open search / command palette |
| `d`            | Toggle dark mode              |
| `?`            | Show shortcuts help           |

---

## 📱 Progressive Web App (PWA)

Install Crypto Data Aggregator as an app on any device!

### Features

| Feature             | Description                            |
| ------------------- | -------------------------------------- |
| 📲 **Installable**  | Add to home screen on mobile & desktop |
| 📴 **Offline Mode** | Browse cached data without internet    |
| ⚡ **Fast Loading** | Aggressive caching strategies          |
| 🔄 **Auto Updates** | Seamless background updates            |

### Install

**Desktop (Chrome/Edge):**

1. Click the install icon in the address bar
2. Or use Menu → "Install Crypto Data Aggregator"

**Mobile:**

1. Open in Safari (iOS) or Chrome (Android)
2. Tap "Add to Home Screen"

---

## 🚀 Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnirholas%2Fcrypto-data-aggregator)

### Docker

```bash
# Build and run
docker build -t crypto-data-aggregator .
docker run -p 3000:3000 crypto-data-aggregator
```

### Manual Deployment

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

---

## 🔧 Environment Variables

| Variable             | Required | Default                            | Description                        |
| -------------------- | -------- | ---------------------------------- | ---------------------------------- |
| `COINGECKO_API_KEY`  | No       | -                                  | Pro API key for higher rate limits |
| `COINGECKO_BASE_URL` | No       | `https://api.coingecko.com/api/v3` | API base URL                       |
| `DEFILLAMA_BASE_URL` | No       | `https://api.llama.fi`             | DeFiLlama API URL                  |

Create `.env.local` for local development:

```env
# Optional: For production with higher rate limits
COINGECKO_API_KEY=your_api_key
COINGECKO_BASE_URL=https://pro-api.coingecko.com/api/v3
```

> 💡 **Note:** No API keys required for basic usage! The free tier works great for development and
> small-scale deployments.

---

## 🛠️ Tech Stack

| Layer             | Technology                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Framework**     | [Next.js 16](https://nextjs.org/) with App Router                                                                         |
| **Language**      | [TypeScript 5](https://www.typescriptlang.org/)                                                                           |
| **Styling**       | [Tailwind CSS 4](https://tailwindcss.com/)                                                                                |
| **Data Fetching** | [SWR](https://swr.vercel.app/) with stale-while-revalidate                                                                |
| **Charts**        | [Recharts](https://recharts.org/)                                                                                         |
| **Animations**    | [Framer Motion](https://www.framer.com/motion/)                                                                           |
| **Icons**         | [Lucide React](https://lucide.dev/) + [Heroicons](https://heroicons.com/)                                                 |
| **Testing**       | [Vitest](https://vitest.dev/) + Testing Library                                                                           |
| **APIs**          | [CoinGecko](https://www.coingecko.com/) • [DeFiLlama](https://defillama.com/) • [Alternative.me](https://alternative.me/) |

---

## ⚡ Caching & Performance

Multi-layer caching strategy for optimal performance and API efficiency.

### Caching Layers

| Layer             | TTL          | Purpose                            |
| ----------------- | ------------ | ---------------------------------- |
| **Memory Cache**  | 30s-5min     | Server-side request deduplication  |
| **SWR Cache**     | Configurable | Client-side stale-while-revalidate |
| **ISR**           | 60s          | Incremental Static Regeneration    |
| **Browser Cache** | Varies       | HTTP cache headers                 |

### Cache TTL by Data Type

| Data Type       | TTL        | Reason                |
| --------------- | ---------- | --------------------- |
| Coin Prices     | 30 seconds | Real-time market data |
| Coin List       | 5 minutes  | Rarely changes        |
| Historical Data | 10 minutes | Immutable past data   |
| DeFi TVL        | 2 minutes  | Updates frequently    |
| Fear & Greed    | 5 minutes  | Daily updates         |
| Categories      | 1 hour     | Rarely changes        |
| Exchanges       | 5 minutes  | Volume updates        |

### Performance Features

- **Edge Runtime** — API routes run on the edge for low latency
- **Request Deduplication** — Multiple simultaneous requests share one API call
- **Stale-While-Revalidate** — Show cached data while fetching fresh
- **Incremental Static Regeneration** — Pages rebuild on-demand
- **Code Splitting** — Load only what's needed

---

## 📁 Project Structure

```
crypto-data-aggregator/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes (Edge Runtime)
│   │   │   ├── market/         # Market data endpoints
│   │   │   ├── defi/           # DeFi endpoints
│   │   │   ├── trending/       # Trending endpoints
│   │   │   └── sentiment/      # Sentiment endpoints
│   │   ├── coin/[coinId]/      # Coin detail pages
│   │   ├── compare/            # Coin comparison
│   │   ├── defi/               # DeFi dashboard
│   │   ├── heatmap/            # Market heatmap
│   │   ├── markets/            # Market listings
│   │   ├── portfolio/          # Portfolio tracker
│   │   ├── screener/           # Advanced screener
│   │   ├── sentiment/          # Sentiment analysis
│   │   └── watchlist/          # User watchlist
│   ├── components/             # React components
│   │   ├── portfolio/          # Portfolio components
│   │   ├── watchlist/          # Watchlist components
│   │   ├── alerts/             # Alert components
│   │   └── ...                 # Shared components
│   └── lib/                    # Utilities & data fetching
│       ├── market-data.ts      # CoinGecko/DeFiLlama API
│       ├── cache.ts            # Memory caching layer
│       ├── portfolio.ts        # Portfolio logic
│       └── alerts.ts           # Alert system
├── docs/                       # Documentation
├── public/                     # Static assets & PWA files
└── scripts/                    # Build & setup scripts
```

---

## 📚 Documentation

| Document                                   | Description                                   |
| ------------------------------------------ | --------------------------------------------- |
| [Documentation Index](docs/README.md)      | Full documentation overview                   |
| [API Reference](docs/API.md)               | Complete endpoint documentation with examples |
| [Architecture](docs/ARCHITECTURE.md)       | System design, data flow & caching strategy   |
| [Tech Stack](docs/TECH_STACK.md)           | Technologies, libraries & tools               |
| [Components](docs/COMPONENTS.md)           | UI component library & usage                  |
| [Data Sources](docs/DATA_SOURCES.md)       | External APIs & caching strategies            |
| [Development](docs/DEVELOPMENT.md)         | Local setup, debugging & workflow             |
| [Testing](docs/TESTING.md)                 | Vitest setup, mocking & coverage              |
| [Deployment](docs/DEPLOYMENT.md)           | Vercel, Railway, Docker, self-hosting         |
| [Performance](docs/PERFORMANCE.md)         | Optimization strategies & monitoring          |
| [Security](docs/SECURITY.md)               | Security practices & hardening                |
| [PWA Guide](docs/PWA.md)                   | Progressive Web App features                  |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Common issues & solutions                     |
| [Changelog](docs/CHANGELOG.md)             | Version history & upgrades                    |

---

## 🧪 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format

# Run all checks
npm run check-all
```

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m 'Add amazing feature'

# Push to branch
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📄 License

MIT License — See [LICENSE](LICENSE) for details.

---

<p align="center">
  <b>Stop paying for crypto data APIs.</b><br>
  <sub>Made with 💜 for the community</sub>
</p>

<p align="center">
  <br>
  ⭐ <b>Found this useful? Give it a star!</b> ⭐<br>
  <sub>It helps others discover this project</sub><br><br>
  <a href="https://github.com/nirholas/crypto-data-aggregator/stargazers">
    <img src="https://img.shields.io/github/stars/nirholas/crypto-data-aggregator?style=social" alt="Star on GitHub">
  </a>
</p>

<p align="center">
  <a href="https://github.com/nirholas/crypto-data-aggregator/stargazers">⭐ Star</a> •
  <a href="https://github.com/nirholas/crypto-data-aggregator/issues">🐛 Report Bug</a> •
  <a href="https://github.com/nirholas/crypto-data-aggregator/discussions">💬 Discussions</a>
</p>
