/**
 * Next.js Middleware for x402 Payment Protocol
 *
 * This middleware intercepts requests to premium API routes and
 * enforces x402 payment requirements.
 *
 * Note: The actual x402 payment handling is done per-route using withX402()
 * in each API route handler. This middleware handles supplementary concerns
 * like API key authentication and rate limiting.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isPremiumRoute } from '@/lib/x402-server';
import { checkApiKey, checkRateLimit, API_TIERS, isX402Enabled } from '@/lib/x402';

export const config = {
  matcher: [
    // Match all premium API routes
    '/api/premium/:path*',
  ],
};

export async function middleware(request: NextRequest) {
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
