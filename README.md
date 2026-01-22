# Crypto Data Aggregator

[![Build Status](https://img.shields.io/github/actions/workflow/status/nirholas/crypto-data-aggregator/ci.yml?branch=main&style=flat-square)](https://github.com/nirholas/crypto-data-aggregator/actions)
[![Coverage](https://img.shields.io/codecov/c/github/nirholas/crypto-data-aggregator?style=flat-square)](https://codecov.io/gh/nirholas/crypto-data-aggregator)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)

Real-time cryptocurrency market data aggregator. Track 10,000+ coins, monitor DeFi protocols, manage
portfolios, and analyze market sentiment—all in one place.

![Crypto Data Aggregator Screenshot](.github/demo.svg)

---

## Quick Start

```bash
git clone https://github.com/nirholas/crypto-data-aggregator.git && cd crypto-data-aggregator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Features

| Category        | Features                                                                                        |
| --------------- | ----------------------------------------------------------------------------------------------- |
| **Market Data** | Live prices • Market cap rankings • Gainers/Losers • Trending coins • New listings • Categories |
| **DeFi**        | 200+ protocol TVL rankings • Chain breakdown • Category filters (DEX, Lending, Bridges)         |
| **Portfolio**   | Holdings tracker • P&L calculations • Cost basis • Multi-currency support                       |
| **Alerts**      | Price thresholds • Percent change alerts • Volume spikes • Fear & Greed notifications           |
| **Charts**      | Interactive price charts • OHLC candlesticks • 1D/7D/30D/1Y timeframes                          |
| **Watchlist**   | Custom lists • Import/Export • Cross-tab sync • Persistent storage                              |

---

## Environment Variables

| Variable               | Required | Default                              | Description                                  |
| ---------------------- | -------- | ------------------------------------ | -------------------------------------------- |
| \`COINGECKO_API_KEY\`  | No       | -                                    | CoinGecko Pro API key for higher rate limits |
| \`COINGECKO_BASE_URL\` | No       | \`https://api.coingecko.com/api/v3\` | CoinGecko API base URL                       |
| \`DEFILLAMA_BASE_URL\` | No       | \`https://api.llama.fi\`             | DeFiLlama API base URL                       |

Create \`.env.local\`:

\`\`\`env

# Optional: For production deployments with higher rate limits

COINGECKO_API_KEY=your_api_key COINGECKO_BASE_URL=https://pro-api.coingecko.com/api/v3 \`\`\`

---

## API Endpoints

### Market Data

| Endpoint                          | Method | Description                     |
| --------------------------------- | ------ | ------------------------------- |
| \`/api/market/coins\`             | GET    | Paginated coin list with prices |
| \`/api/market/snapshot/[coinId]\` | GET    | Detailed coin data              |
| \`/api/market/history/[coinId]\`  | GET    | Historical price data           |
| \`/api/market/ohlc/[coinId]\`     | GET    | OHLC candlestick data           |
| \`/api/market/search\`            | GET    | Search coins by name/symbol     |
| \`/api/market/categories\`        | GET    | List all categories             |
| \`/api/market/exchanges\`         | GET    | Exchange rankings               |

### DeFi & Analytics

| Endpoint           | Method | Description           |
| ------------------ | ------ | --------------------- |
| \`/api/defi\`      | GET    | Protocol TVL rankings |
| \`/api/trending\`  | GET    | Trending coins        |
| \`/api/sentiment\` | GET    | Fear & Greed index    |

### Example

\`\`\`bash

# Get top 10 coins by market cap

curl "http://localhost:3000/api/market/coins?type=top&limit=10"

# Get Bitcoin historical data (7 days)

curl "http://localhost:3000/api/market/history/bitcoin?days=7"

# Search for coins

curl "http://localhost:3000/api/market/search?q=ethereum" \`\`\`

See [docs/API.md](docs/API.md) for complete API reference.

---

## Tech Stack

| Layer             | Technology                                                                    |
| ----------------- | ----------------------------------------------------------------------------- |
| **Framework**     | [Next.js 16](https://nextjs.org/) with App Router                             |
| **Language**      | [TypeScript 5](https://www.typescriptlang.org/)                               |
| **Styling**       | [Tailwind CSS 4](https://tailwindcss.com/)                                    |
| **Data Fetching** | [SWR](https://swr.vercel.app/) with stale-while-revalidate                    |
| **Charts**        | [Recharts](https://recharts.org/)                                             |
| **Animations**    | [Framer Motion](https://www.framer.com/motion/)                               |
| **Icons**         | [Lucide React](https://lucide.dev/)                                           |
| **Testing**       | [Vitest](https://vitest.dev/) + Testing Library                               |
| **APIs**          | [CoinGecko](https://www.coingecko.com/) • [DeFiLlama](https://defillama.com/) |

---

## Documentation

- [API Reference](docs/API.md) - Complete endpoint documentation with examples
- [Architecture](docs/ARCHITECTURE.md) - System design and data flow
- [Development](docs/DEVELOPMENT.md) - Local setup, debugging, testing
- [Deployment](docs/DEPLOYMENT.md) - Vercel, Railway, Docker guides

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <a href="https://github.com/nirholas/crypto-data-aggregator/stargazers">⭐ Star this repo</a> •
  <a href="https://github.com/nirholas/crypto-data-aggregator/issues">Report Bug</a> •
  <a href="https://github.com/nirholas/crypto-data-aggregator/discussions">Discussions</a>
</p>
