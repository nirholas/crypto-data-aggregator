# crypto-data-aggregator examples

Real-time cryptocurrency market data aggregator with DeFi analytics, portfolio tracking, watchlists, and comprehensive market insights.

## Example 1

```bash
# Clone and run in 30 seconds
git clone https://github.com/nirholas/crypto-data-aggregator.git
cd crypto-data-aggregator
npm install
npm run dev
```

## Example 2

```bash
node cli/index.js              # Latest news
node cli/index.js --bitcoin    # Bitcoin news only
node cli/index.js -s "ethereum" # Search
node cli/index.js --breaking   # Breaking news
node cli/index.js --json       # JSON output
```

## Example 3

```bash
# Claude Desktop (stdio mode)
node mcp/index.js

# ChatGPT Developer Mode (HTTP/SSE)
node mcp/index.js --http
```

## Example 4

```text
BTC > $100,000  →  "Bitcoin just broke $100K!"
ETH < $2,000    →  "Ethereum dipped below $2K"
SOL > $200      →  "Solana hit your target"
```

## Example 5

```bash
# Get top 100 coins by market cap
curl "http://localhost:3000/api/market/coins"

# Get coin details
curl "http://localhost:3000/api/market/snapshot/bitcoin"

# Get price history (7 days)
curl "http://localhost:3000/api/market/history/bitcoin?days=7"

# Search coins
curl "http://localhost:3000/api/market/search?q=ethereum"

# DeFi protocols
curl "http://localhost:3000/api/defi"

# Fear & Greed Index
curl "http://localhost:3000/api/sentiment"
```

## Example 6

```bash
# GraphQL endpoint
curl -X POST "http://localhost:3000/api/v2/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ coins(limit: 10) { id name price } }"}'

# Batch requests (up to 10 coins)
curl "http://localhost:3000/api/v2/batch?coins=bitcoin,ethereum,solana"

# Volatility metrics
curl "http://localhost:3000/api/v2/volatility/bitcoin"

# AI-powered analysis
curl -X POST "http://localhost:3000/api/premium/ai/analyze" \
  -H "Content-Type: application/json" \
  -d '{"coin": "bitcoin", "prompt": "What is the outlook?"}'
```

## Example 7

```bash
# Build and run
docker build -t crypto-data-aggregator .
docker run -p 3000:3000 crypto-data-aggregator
```

## Example 8

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```


Every snippet above is taken from the [repository documentation](https://github.com/nirholas/crypto-data-aggregator#readme).
