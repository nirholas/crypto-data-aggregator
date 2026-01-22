/**
 * Robots.txt Configuration
 * Controls search engine crawling behavior
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://crypto-data-aggregator.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // Don't crawl API routes
          '/_next/', // Don't crawl Next.js internals
          '/admin/', // Don't crawl admin (if exists)
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: '/', // Allow AI crawlers for better discoverability
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
