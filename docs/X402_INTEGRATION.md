# x402 Protocol Integration Guide

Future implementation guide for adding x402 payment protocol support to Crypto Data Aggregator.

---

## Table of Contents

- [Overview](#overview)
- [What is x402?](#what-is-x402)
- [Why x402 for Crypto Data Aggregator?](#why-x402-for-crypto-data-aggregator)
- [Protocol Specification](#protocol-specification)
- [Architecture](#architecture)
- [Implementation Guide](#implementation-guide)
- [SDK Options](#sdk-options)
- [Use Cases](#use-cases)
- [Security Considerations](#security-considerations)
- [Resources](#resources)

---

## Overview

x402 is an open payment protocol built on HTTP 402 (Payment Required) that enables micropayments for API access. It's developed by Coinbase and provides a standardized way to monetize APIs with cryptocurrency payments.

**Key Benefits:**
- 💵 No fees, 2-second settlement
- 💰 Micropayments from $0.001
- 🔓 No API keys required for clients
- ⚡ Automatic payment handling
- 🌐 Multi-chain support (EVM, Solana)

---

## What is x402?

x402 is a payment protocol that uses the HTTP 402 status code ("Payment Required") to enable direct payments for web resources. It provides:

### Core Components

| Component | Description |
|-----------|-------------|
| **Resource Server** | Your API that requires payment for access |
| **Client** | Application making paid requests |
| **Facilitator** | Service that verifies and settles payments on-chain |

### Payment Flow

```
┌──────────┐          ┌─────────────────┐          ┌─────────────┐
│  Client  │          │ Resource Server │          │ Facilitator │
└────┬─────┘          └────────┬────────┘          └──────┬──────┘
     │                         │                          │
     │  1. GET /api/premium    │                          │
     │────────────────────────>│                          │
     │                         │                          │
     │  2. 402 + PAYMENT-REQUIRED header                  │
     │<────────────────────────│                          │
     │                         │                          │
     │  3. GET /api/premium + PAYMENT-SIGNATURE header    │
     │────────────────────────>│                          │
     │                         │                          │
     │                         │  4. Verify payment       │
     │                         │─────────────────────────>│
     │                         │                          │
     │                         │  5. Verification result  │
     │                         │<─────────────────────────│
     │                         │                          │
     │  6. 200 OK + Response   │                          │
     │<────────────────────────│                          │
     │                         │                          │
     │                         │  7. Settle on-chain      │
     │                         │─────────────────────────>│
     │                         │                          │
```

### Protocol Headers

| Header | Direction | Purpose |
|--------|-----------|---------|
| `PAYMENT-REQUIRED` | Server → Client | Contains payment requirements (402 response) |
| `PAYMENT-SIGNATURE` | Client → Server | Contains signed payment authorization |
| `PAYMENT-RESPONSE` | Server → Client | Contains settlement confirmation |

---

## Why x402 for Crypto Data Aggregator?

### Monetization Opportunities

| Feature | Price Point | Use Case |
|---------|-------------|----------|
| **Premium API Access** | $0.001/request | High-frequency trading bots |
| **Real-time WebSocket** | $0.01/hour | Live price feeds |
| **Historical Data Export** | $0.10/export | Bulk data downloads |
| **Advanced Analytics** | $0.05/query | Custom screener queries |
| **Priority Rate Limits** | $1.00/day | Higher API limits |

### Benefits for Our Project

1. **No Infrastructure** - No user accounts, no payment processing
2. **Crypto-Native** - Pay with USDC on Base, Solana, etc.
3. **Micropayments** - Monetize individual API calls
4. **Open Source** - MIT licensed, maintained by Coinbase
5. **Multi-Chain** - Support multiple blockchains

---

## Protocol Specification

### Payment Requirements (Server → Client)

When a protected endpoint is accessed without payment:

```typescript
// 402 Response with PAYMENT-REQUIRED header
{
  "x402Version": 2,
  "accepts": [
    {
      "scheme": "exact",
      "network": "eip155:8453",  // Base mainnet
      "asset": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",  // USDC
      "payTo": "0xYourAddress",
      "maxAmountRequired": "1000",  // In smallest unit (0.001 USDC)
      "resource": "https://api.example.com/premium",
      "description": "Premium API access",
      "mimeType": "application/json",
      "paymentNonce": "unique-nonce-123"
    }
  ]
}
```

### Payment Payload (Client → Server)

Client creates a signed payment authorization:

```typescript
// PAYMENT-SIGNATURE header
{
  "x402Version": 2,
  "scheme": "exact",
  "network": "eip155:8453",
  "payload": {
    "signature": "0x...",  // Signed authorization
    "authorization": {
      "from": "0xClientAddress",
      "to": "0xPayToAddress",
      "asset": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      "amount": "1000",
      "nonce": "unique-nonce-123",
      "validAfter": 1737500000,
      "validBefore": 1737510000
    }
  }
}
```

### Settlement Response (Server → Client)

After successful payment:

```typescript
// PAYMENT-RESPONSE header
{
  "success": true,
  "transactionHash": "0x...",
  "network": "eip155:8453",
  "settledAt": "2026-01-22T12:00:00Z"
}
```

---

## Architecture

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Crypto Data Aggregator                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │   Free API      │    │   Premium API   │                     │
│  │   /api/market   │    │   /api/premium  │                     │
│  │   /api/trending │    │   /api/export   │                     │
│  └─────────────────┘    └────────┬────────┘                     │
│                                  │                               │
│                         ┌────────▼────────┐                     │
│                         │ x402 Middleware │                     │
│                         │ (paymentMiddleware)                   │
│                         └────────┬────────┘                     │
│                                  │                               │
│                         ┌────────▼────────┐                     │
│                         │ x402ResourceServer                    │
│                         └────────┬────────┘                     │
│                                  │                               │
└──────────────────────────────────┼───────────────────────────────┘
                                   │
                          ┌────────▼────────┐
                          │   Facilitator   │
                          │ (x402.org or    │
                          │  self-hosted)   │
                          └────────┬────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
              ┌─────▼─────┐               ┌──────▼──────┐
              │   Base    │               │   Solana    │
              │ (EVM)     │               │   (SVM)     │
              └───────────┘               └─────────────┘
```

### Route Configuration

```typescript
// Premium routes requiring payment
const premiumRoutes = {
  "GET /api/premium/coins": {
    accepts: {
      payTo: process.env.PAYMENT_ADDRESS,
      scheme: "exact",
      price: "$0.001",
      network: "eip155:8453",  // Base mainnet
    },
  },
  "GET /api/premium/export": {
    accepts: {
      payTo: process.env.PAYMENT_ADDRESS,
      scheme: "exact",
      price: "$0.10",
      network: "eip155:8453",
    },
  },
  "GET /api/premium/analytics/*": {
    accepts: {
      payTo: process.env.PAYMENT_ADDRESS,
      scheme: "exact",
      price: "$0.05",
      network: "eip155:8453",
    },
  },
};
```

---

## Implementation Guide

### Phase 1: Server Setup (Express/Next.js)

#### Option A: Express Middleware

```typescript
// src/app/api/premium/route.ts
import { paymentMiddleware } from "@x402/express";
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import { registerExactEvmScheme } from "@x402/evm/exact/server";

const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://x402.org/facilitator",
});

const server = new x402ResourceServer(facilitatorClient);
registerExactEvmScheme(server);

const routes = {
  "GET /api/premium/coins": {
    accepts: {
      payTo: process.env.PAYMENT_ADDRESS as `0x${string}`,
      scheme: "exact",
      price: "$0.001",
      network: "eip155:8453",
    },
  },
};

// Apply middleware
app.use(paymentMiddleware(routes, server));
```

#### Option B: Next.js Middleware

```typescript
// middleware.ts
import { paymentProxy } from "@x402/next";
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import { registerExactEvmScheme } from "@x402/evm/exact/server";

const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://x402.org/facilitator",
});

const server = new x402ResourceServer(facilitatorClient);
registerExactEvmScheme(server);

export const middleware = paymentProxy(
  {
    "GET /api/premium/:path*": {
      accepts: {
        payTo: process.env.PAYMENT_ADDRESS,
        scheme: "exact",
        price: "$0.001",
        network: "eip155:8453",
      },
    },
  },
  server
);

export const config = {
  matcher: "/api/premium/:path*",
};
```

### Phase 2: Client Integration

#### For API Consumers

```typescript
// Automatic payment handling with axios
import axios from "axios";
import { wrapAxiosWithPayment } from "@x402/axios";
import { x402Client } from "@x402/core/client";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.PRIVATE_KEY);

const client = new x402Client();
registerExactEvmScheme(client, { signer: account });

const axiosClient = wrapAxiosWithPayment(axios.create(), client);

// Payments happen automatically!
const response = await axiosClient.get(
  "https://crypto-aggregator.com/api/premium/coins"
);
```

### Phase 3: Premium Endpoints

```typescript
// src/app/api/premium/coins/route.ts
export async function GET(request: Request) {
  // This only runs after successful payment verification
  const coins = await getDetailedCoinData();
  
  return Response.json({
    coins,
    meta: {
      premium: true,
      dataPoints: coins.length,
      timestamp: new Date().toISOString(),
    },
  });
}
```

### Phase 4: Multi-Chain Support

```typescript
// Support both EVM (Base) and Solana
const routes = {
  "GET /api/premium/coins": {
    accepts: [
      {
        payTo: process.env.EVM_ADDRESS,
        scheme: "exact",
        price: "$0.001",
        network: "eip155:8453",  // Base
      },
      {
        payTo: process.env.SOL_ADDRESS,
        scheme: "exact",
        price: "$0.001",
        network: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",  // Solana
      },
    ],
  },
};
```

---

## SDK Options

### TypeScript/JavaScript

| Package | Purpose | Install |
|---------|---------|---------|
| `@x402/core` | Core client/server | `npm i @x402/core` |
| `@x402/express` | Express middleware | `npm i @x402/express` |
| `@x402/next` | Next.js middleware | `npm i @x402/next` |
| `@x402/hono` | Hono middleware | `npm i @x402/hono` |
| `@x402/axios` | Axios interceptor | `npm i @x402/axios` |
| `@x402/fetch` | Fetch wrapper | `npm i @x402/fetch` |
| `@x402/evm` | EVM chain support | `npm i @x402/evm` |
| `@x402/svm` | Solana support | `npm i @x402/svm` |

### Python

| Package | Purpose | Install |
|---------|---------|---------|
| `x402` | Core SDK | `pip install x402` |

### Go

| Package | Purpose | Import |
|---------|---------|--------|
| `x402` | Core SDK | `github.com/coinbase/x402/go` |
| `gin` | Gin middleware | `github.com/coinbase/x402/go/http/gin` |

### Java

| Package | Purpose |
|---------|---------|
| `x402-java` | Spring Boot integration |

---

## Use Cases

### 1. Premium Market Data API

```typescript
// $0.001 per request for detailed coin data
"GET /api/premium/coins/:id": {
  accepts: {
    price: "$0.001",
    description: "Detailed coin data with social metrics",
    outputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        price: { type: "number" },
        socialMetrics: { type: "object" },
        developerData: { type: "object" },
      },
    },
  },
}
```

### 2. Bulk Data Export

```typescript
// $0.10 per export (CSV/JSON)
"GET /api/premium/export/portfolio": {
  accepts: {
    price: "$0.10",
    description: "Export portfolio data as CSV or JSON",
  },
}
```

### 3. Real-time WebSocket Access

```typescript
// $0.01 per hour of WebSocket access
"POST /api/premium/websocket/subscribe": {
  accepts: {
    price: "$0.01",
    description: "1 hour of real-time price WebSocket access",
  },
}
```

### 4. Custom Screener Queries

```typescript
// $0.05 per complex query
"POST /api/premium/screener/query": {
  accepts: {
    price: "$0.05",
    description: "Custom screener with unlimited filters",
  },
}
```

### 5. Historical Data Access

```typescript
// $0.02 per year of historical data
"GET /api/premium/history/:coinId": {
  accepts: {
    price: "$0.02",
    description: "Full historical price data",
  },
}
```

---

## Security Considerations

### Replay Attack Prevention

x402 includes built-in replay attack prevention:

```typescript
{
  "paymentNonce": "unique-per-request",
  "validAfter": 1737500000,   // Unix timestamp
  "validBefore": 1737510000,  // 10 minute window
}
```

### Facilitator Trust Model

- **Hosted Facilitator** (`x402.org`): Managed by Coinbase, handles settlement
- **Self-Hosted**: Run your own facilitator for full control

### Amount Verification

Always verify the payment amount matches requirements:

```typescript
if (paymentPayload.amount < requirements.maxAmountRequired) {
  return { isValid: false, invalidReason: "Insufficient payment" };
}
```

---

## Environment Variables

```bash
# .env.local

# Payment receiving address (your wallet)
PAYMENT_ADDRESS=0xYourWalletAddress
EVM_ADDRESS=0xYourEVMAddress
SOL_ADDRESS=YourSolanaAddress

# Facilitator URL (use testnet for development)
FACILITATOR_URL=https://x402.org/facilitator

# For self-hosted facilitator
FACILITATOR_PRIVATE_KEY=0x...
```

---

## Testing

### Testnet Configuration

```typescript
// Use Base Sepolia for testing
const testRoutes = {
  "GET /api/premium/test": {
    accepts: {
      payTo: process.env.TEST_ADDRESS,
      scheme: "exact",
      price: "$0.001",
      network: "eip155:84532",  // Base Sepolia testnet
    },
  },
};
```

### Manual Testing

```bash
# 1. Make request without payment
curl -i https://localhost:3000/api/premium/coins
# Returns: 402 with PAYMENT-REQUIRED header

# 2. Decode requirements
# Parse the PAYMENT-REQUIRED header (base64)

# 3. Create payment with test wallet
# Use x402 client SDK
```

---

## Resources

### Official Documentation

- [x402.org](https://x402.org) - Official website
- [GitHub: coinbase/x402](https://github.com/coinbase/x402) - Source code
- [Specification v2](https://github.com/coinbase/x402/tree/main/specs/x402-specification-v2.md)

### Examples

- [Express Server](https://github.com/coinbase/x402/tree/main/examples/typescript/servers/express)
- [Next.js Integration](https://github.com/coinbase/x402/tree/main/examples/typescript/fullstack/next)
- [Custom Client](https://github.com/coinbase/x402/tree/main/examples/typescript/clients/custom)
- [MCP Server](https://github.com/coinbase/x402/tree/main/examples/typescript/clients/mcp)

### Community

- [GitHub Discussions](https://github.com/coinbase/x402/discussions)
- [Discord](https://discord.gg/coinbase)

---

## Implementation Checklist

### Phase 1: Setup
- [ ] Install x402 packages (`@x402/core`, `@x402/next`, `@x402/evm`)
- [ ] Configure facilitator client
- [ ] Set up payment receiving address
- [ ] Create environment variables

### Phase 2: Middleware
- [ ] Add x402 middleware to Next.js
- [ ] Configure protected routes
- [ ] Set pricing for each endpoint
- [ ] Test with testnet

### Phase 3: Premium Endpoints
- [ ] Create `/api/premium/` routes
- [ ] Implement premium coin data endpoint
- [ ] Implement export endpoint
- [ ] Implement analytics endpoint

### Phase 4: Documentation
- [ ] Update API documentation
- [ ] Add client integration examples
- [ ] Document pricing
- [ ] Create billing FAQ

### Phase 5: Launch
- [ ] Switch to mainnet
- [ ] Monitor payments
- [ ] Track revenue analytics
- [ ] Iterate on pricing

---

## Pricing Strategy

### Suggested Pricing

| Tier | Price | Rate Limit | Features |
|------|-------|------------|----------|
| **Free** | $0 | 50 req/min | Basic market data |
| **Pay-per-use** | $0.001/req | Unlimited | Premium endpoints |
| **Daily Pass** | $1.00/day | Unlimited | All premium features |
| **Export** | $0.10/export | N/A | CSV/JSON downloads |

### Competitive Analysis

| Provider | Price | x402 Advantage |
|----------|-------|----------------|
| CoinGecko Pro | $129/month | Pay only for what you use |
| CoinMarketCap | $99/month | No subscription needed |
| Messari | $249/month | Micropayments possible |

---

*This document will be updated as x402 implementation progresses.*
