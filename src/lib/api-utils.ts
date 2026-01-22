/**
 * API Response Utilities
 *
 * Helpers for efficient API responses including:
 * - ETag generation and validation
 * - Response compression hints
 * - Standardized cache headers
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Generates an ETag (entity tag) hash from response data.
 * Used for HTTP caching and conditional requests (If-None-Match).
 *
 * @param data - Any JSON-serializable data to hash
 * @returns ETag string in format '"hash"' with quotes
 *
 * @example
 * ```typescript
 * const etag = generateETag({ coins: [...] });
 * // Returns: '"1a2b3c4d"'
 * ```
 */
export function generateETag(data: unknown): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `"${Math.abs(hash).toString(36)}"`;
}

/**
 * Checks if the request's If-None-Match header matches the provided ETag.
 * Returns true if the client's cached version is still valid (304 Not Modified).
 *
 * @param request - Next.js request object
 * @param etag - Current ETag value to compare against
 * @returns True if ETags match (client cache is valid)
 *
 * @example
 * ```typescript
 * if (checkETagMatch(request, etag)) {
 *   return new NextResponse(null, { status: 304 });
 * }
 * ```
 */
export function checkETagMatch(request: NextRequest, etag: string): boolean {
  const ifNoneMatch = request.headers.get('if-none-match');
  return ifNoneMatch === etag;
}

/**
 * Standard cache control values
 */
export const CACHE_CONTROL = {
  // Real-time data (news, prices) - short cache
  realtime: 'public, s-maxage=60, stale-while-revalidate=120',
  // Standard API responses - medium cache
  standard: 'public, s-maxage=300, stale-while-revalidate=600',
  // AI-generated content - longer cache
  ai: 'public, s-maxage=600, stale-while-revalidate=1200',
  // Static content - long cache
  static: 'public, s-maxage=3600, stale-while-revalidate=7200',
  // Immutable content
  immutable: 'public, max-age=31536000, immutable',
  // No cache
  none: 'no-store, no-cache, must-revalidate',
} as const;

/**
 * Creates a standardized JSON response with proper caching headers.
 * Automatically handles ETag generation and 304 Not Modified responses.
 *
 * @template T - Type of the response data
 * @param data - The data to return as JSON
 * @param options - Response configuration options
 * @param options.status - HTTP status code (default: 200)
 * @param options.cacheControl - Cache strategy key or custom Cache-Control value
 * @param options.etag - Whether to generate and include ETag (default: true)
 * @param options.request - Original request for ETag comparison
 * @returns NextResponse with JSON body and headers
 *
 * @example
 * ```typescript
 * // Basic usage
 * return jsonResponse({ coins: [...] });
 *
 * // With options
 * return jsonResponse(data, {
 *   status: 200,
 *   cacheControl: 'realtime',
 *   etag: true,
 *   request: req
 * });
 * ```
 */
export function jsonResponse<T>(
  data: T,
  options: {
    status?: number;
    cacheControl?: keyof typeof CACHE_CONTROL | string;
    etag?: boolean;
    request?: NextRequest;
  } = {}
): NextResponse {
  const { status = 200, cacheControl = 'standard', etag = true, request } = options;

  // Generate ETag if enabled
  const etagValue = etag ? generateETag(data) : null;

  // Check for 304 Not Modified
  if (request && etagValue && checkETagMatch(request, etagValue)) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etagValue,
        'Cache-Control':
          typeof cacheControl === 'string' && cacheControl in CACHE_CONTROL
            ? CACHE_CONTROL[cacheControl as keyof typeof CACHE_CONTROL]
            : cacheControl,
      },
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control':
      typeof cacheControl === 'string' && cacheControl in CACHE_CONTROL
        ? CACHE_CONTROL[cacheControl as keyof typeof CACHE_CONTROL]
        : cacheControl,
    Vary: 'Accept-Encoding',
  };

  if (etagValue) {
    headers['ETag'] = etagValue;
  }

  return NextResponse.json(data, { status, headers });
}

/**
 * Creates a standardized error response with no caching.
 *
 * @param error - Primary error message
 * @param details - Additional context or debug information
 * @param status - HTTP status code (default: 500)
 * @returns NextResponse with error JSON body
 *
 * @example
 * ```typescript
 * return errorResponse('Coin not found', 'ID: invalid-coin', 404);
 * // Returns: { error: 'Coin not found', details: 'ID: invalid-coin', timestamp: '...' }
 * ```
 */
export function errorResponse(error: string, details?: string, status = 500): NextResponse {
  return NextResponse.json(
    {
      error,
      details,
      timestamp: new Date().toISOString(),
    },
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': CACHE_CONTROL.none,
      },
    }
  );
}

/**
 * Adds response timing metadata to API responses.
 * Useful for monitoring and debugging API performance.
 *
 * @template T - Type of the data object
 * @param data - The response data to augment
 * @param startTime - Timestamp from Date.now() at request start
 * @returns Original data with added _meta.responseTimeMs field
 *
 * @example
 * ```typescript
 * const startTime = Date.now();
 * const coins = await getTopCoins();
 * return jsonResponse(withTiming({ coins }, startTime));
 * // Response includes: { coins: [...], _meta: { responseTimeMs: 45 } }
 * ```
 */
export function withTiming<T extends Record<string, unknown>>(
  data: T,
  startTime: number
): T & { _meta: { responseTimeMs: number } } {
  return {
    ...data,
    _meta: {
      responseTimeMs: Date.now() - startTime,
    },
  };
}
