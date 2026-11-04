#!/bin/bash
# Free Crypto News API - curl examples
# 
# FREE ENDPOINTS: No API key required
# PREMIUM ENDPOINTS: Require API key OR x402 payment
#
# Get your API key at: https://crypto-data-aggregator.modelcontextprotocol.name/developers

API="https://crypto-data-aggregator.modelcontextprotocol.name"

# Your API key (optional - get one at /developers for higher limits)
API_KEY="${CRYPTO_NEWS_API_KEY:-}"

echo "═══════════════════════════════════════════════════════════════"
echo "                    FREE ENDPOINTS (No Auth)                    "
echo "═══════════════════════════════════════════════════════════════"

echo -e "\n📰 Latest News"
curl -s "$API/api/news?limit=3" | jq '.articles[] | {title, source, timeAgo}'

echo -e "\n🔍 Search for 'ethereum'"
curl -s "$API/api/search?q=ethereum&limit=3" | jq '.articles[] | {title, source}'

echo -e "\n💰 DeFi News"
curl -s "$API/api/defi?limit=3" | jq '.articles[] | {title, source}'

echo -e "\n₿ Bitcoin News"
curl -s "$API/api/bitcoin?limit=3" | jq '.articles[] | {title, source}'

echo -e "\n🚨 Breaking News"
curl -s "$API/api/breaking?limit=3" | jq '.articles[] | {title, source, timeAgo}'

echo -e "\n📡 Sources"
curl -s "$API/api/sources" | jq '.sources[] | {name, status}'

echo -e "\n\n═══════════════════════════════════════════════════════════════"
echo "              PREMIUM ENDPOINTS (API Key Required)               "
echo "═══════════════════════════════════════════════════════════════"

if [ -z "$API_KEY" ]; then
  echo -e "\n⚠️  Set CRYPTO_NEWS_API_KEY to test premium endpoints"
  echo "   Get your free API key at: $API/developers"
  echo ""
  echo "   Example:"
  echo "   export CRYPTO_NEWS_API_KEY=cda_free_xxxxx"
  echo "   ./curl.sh"
else
  echo -e "\n🔐 Using API Key: ${API_KEY:0:12}..."
  
  echo -e "\n📊 Premium Coins (with API key)"
  curl -s -H "X-API-Key: $API_KEY" "$API/api/v1/coins?limit=3" | jq '.data[:3] | .[] | {id, name, current_price}'
  
  echo -e "\n📈 Historical Data (Bitcoin, 7 days)"
  curl -s -H "X-API-Key: $API_KEY" "$API/api/v1/historical/bitcoin?days=7" | jq '.meta'
  
  echo -e "\n⛽ Gas Prices"
  curl -s -H "X-API-Key: $API_KEY" "$API/api/v1/gas" | jq '.data'
  
  echo -e "\n📊 API Usage Stats"
  curl -s -H "X-API-Key: $API_KEY" "$API/api/v1/usage" | jq '.'
fi

echo -e "\n\n═══════════════════════════════════════════════════════════════"
echo "                    AUTHENTICATION METHODS                       "
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Method 1: API Key Header"
echo "  curl -H 'X-API-Key: YOUR_API_KEY' $API/api/v1/coins"
echo ""
echo "Method 2: API Key Query Parameter"
echo "  curl '$API/api/v1/coins?api_key=YOUR_API_KEY'"
echo ""
echo "Method 3: x402 Micropayment (pay-per-request)"
echo "  curl -H 'X-PAYMENT: <base64-encoded-payment>' $API/api/v1/coins"
echo ""
echo "Get your API key: $API/developers"
echo "x402 documentation: https://x402.org"
