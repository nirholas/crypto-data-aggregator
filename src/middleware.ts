/**
 * Next.js Middleware for API Key Validation & x402 Payments
 *
 * This middleware:
 * 1. Enforces API key requirements on /api/v1/* routes (free tier)
 * 2. Handles x402 payment flow on /api/premium/* routes
 *
 * Note: The actual x402 payment handling is done per-route using withX402()
 * in each API route handler. This middleware handles API key validation
 * and rate limiting.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isPremiumRoute } from '@/lib/x402-server';
import { checkApiKey, checkRateLimit, API_TIERS, isX402Enabled } from '@/lib/x402';
import {
  validateApiKey,
  checkRateLimit as checkKeyRateLimit,
  extractApiKey,
  isKvConfigured,
  API_KEY_TIERS,
} from '@/lib/api-keys';

export const config = {
  matcher: [
    // Match all API routes (both free and premium)
    '/api/v1/:path*',
    '/api/premium/:path*',
  ],
};

/**
 * Handle /api/v1/* routes - require API key
 */
async function handleV1Route(request: NextRequest): Promise<NextResponse> {
  // Allow /api/v1 root (documentation endpoint)
  if (request.nextUrl.pathname === '/api/v1') {
    return NextResponse.next();
  }

  // If KV not configured, allow in development with warning
  if (!isKvConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[API Keys] KV not configured - allowing request in development');
      const response = NextResponse.next();
      response.headers.set('X-API-Warning', 'API key validation disabled in development');
      return response;
    }

    // In production without KV, still require some basic protection
    // Fall through to API key check
  }

  // Extract API key from request
  const rawKey = extractApiKey(request);

  if (!rawKey) {
    return NextResponse.json(
      {
        error: 'API key required',
        message: 'Include your API key in the X-API-Key header or api_key query parameter',
        register: '/api/register',
        docs: '/docs/api',
      },
      { status: 401 }
    );
  }

  // Validate the key
  const keyData = await validateApiKey(rawKey);

  if (!keyData) {
    return NextResponse.json(
      {
        error: 'Invalid API key',
        message: 'The provided API key is invalid or has been revoked',
        register: '/api/register',
      },
      { status: 401 }
    );
  }

  // Check rate limit
  const rateLimit = await checkKeyRateLimit(keyData);

  if (!rateLimit.allowed) {
    const tierConfig = API_KEY_TIERS[keyData.tier];
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: `You have exceeded your ${tierConfig.name} tier limit of ${tierConfig.requestsPerDay} requests/day`,
        resetAt: new Date(rateLimit.resetAt).toISOString(),
        upgrade:
          'Upgrade to Pro tier for 10,000 requests/day, or use x402 micropayments for unlimited access',
        premium: '/api/premium',
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimit.resetAt.toString(),
          'Retry-After': Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // Valid key with available rate limit - allow request
  const response = NextResponse.next();
  response.headers.set('X-API-Key-Id', keyData.id);
  response.headers.set('X-API-Tier', keyData.tier);
  response.headers.set('X-RateLimit-Limit', rateLimit.limit.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateLimit.resetAt.toString());

  return response;
}

/**
 * Handle /api/premium/* routes - API key or x402 payment
 */
async function handlePremiumRoute(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  // Only apply to premium routes
  if (!isPremiumRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for API key authentication (subscription model)
  const keyInfo = await checkApiKey(request);

  if (keyInfo) {
    // Has valid API key - check rate limits based on tier
    const tierConfig = API_TIERS[keyInfo.tier];

    if (tierConfig.requestsPerDay === -1) {
      // Unlimited (enterprise tier) - allow through
      const response = NextResponse.next();
      response.headers.set('X-API-Tier', keyInfo.tier);
      return response;
    }

    const clientId = request.headers.get('X-API-Key') || 'anonymous';
    const rateLimit = checkRateLimit(clientId, tierConfig.requestsPerDay);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `You have exceeded your ${tierConfig.name} tier limit of ${tierConfig.requestsPerDay} requests/day`,
          resetAt: new Date(rateLimit.resetAt).toISOString(),
          upgrade: 'Upgrade to Pro or Enterprise for higher limits, or use x402 micropayments',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': tierConfig.requestsPerDay.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetAt.toString(),
          },
        }
      );
    }

    // API key valid and within limits - bypass x402 payment
    const response = NextResponse.next();
    response.headers.set('X-API-Tier', keyInfo.tier);
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    return response;
  }

  // No API key - let the individual route handler deal with x402 payment
  // The withX402() wrapper in each route will handle payment verification

  // If x402 is not configured (no payment address), warn but allow in dev
  if (!isX402Enabled()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[x402] No payment address configured - allowing request in development');
      return NextResponse.next();
    }
  }

  // Allow request to proceed to route handler
  // The withX402() wrapper will handle payment verification
  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Route to appropriate handler
  if (pathname.startsWith('/api/v1')) {
    return handleV1Route(request);
  }

  if (pathname.startsWith('/api/premium')) {
    return handlePremiumRoute(request);
  }

  return NextResponse.next();
}
