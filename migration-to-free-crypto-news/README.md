# Migration to free-crypto-news

This folder contains files to add the enhanced admin dashboard and API key management system to your
`free-crypto-news` repo.

## Files to Copy

### 1. Library Files (src/lib/)

| File            | Purpose                                                      |
| --------------- | ------------------------------------------------------------ |
| `api-keys.ts`   | API key generation, validation, rate limiting with Vercel KV |
| `redis.ts`      | Redis cache layer with fallback to memory cache              |
| `admin-auth.ts` | Secure admin authentication utilities                        |

### 2. API Routes (src/app/api/admin/)

| File             | Purpose                                                   |
| ---------------- | --------------------------------------------------------- |
| `stats/route.ts` | Aggregated API key statistics endpoint                    |
| `keys/route.ts`  | List/manage all API keys with pagination, search, filters |

### 3. Components (src/components/admin/)

| File             | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `UsageChart.tsx` | SVG charts (UsageChart, TierDistribution, Sparkline) |

### 4. Pages (src/app/)

| File                       | Purpose                        |
| -------------------------- | ------------------------------ |
| `admin/AdminDashboard.tsx` | Enhanced dashboard with 3 tabs |
| `admin/page.tsx`           | Admin page wrapper             |

## Environment Variables

Add these to your Vercel project:

```env
# Required for API key storage
KV_REST_API_URL=<from Vercel KV dashboard>
KV_REST_API_TOKEN=<from Vercel KV dashboard>

# Required for admin access
ADMIN_TOKEN=<your-secure-random-token>

# Optional for x402 payments
X402_NETWORK=eip155:8453
X402_PAYMENT_ADDRESS=<your-wallet-address>
```

## How to Copy

1. Copy the files from this folder to your free-crypto-news repo
2. Adjust import paths if needed (e.g., if you have a different structure)
3. Add the environment variables to Vercel
4. Deploy

## Key Differences from Existing free-crypto-news

Your free-crypto-news repo already has:

- Basic admin dashboard (at `src/app/[locale]/admin/`)
- x402 integration
- Premium API endpoints

This migration adds:

- **API Key Analytics tab** - See total keys, tier breakdown, usage charts
- **Manage Keys tab** - Search, filter, revoke/activate keys
- **Vercel KV storage** - Persistent API key storage (vs in-memory)
- **Rate limiting** - Per-key daily limits with webhooks
- **SVG Charts** - Visual usage analytics

## Notes

- The `[locale]` folder in free-crypto-news means you may need to adjust paths
- The existing admin uses different styling (gray-900 vs black background)
- Merge carefully to preserve any customizations you've made
