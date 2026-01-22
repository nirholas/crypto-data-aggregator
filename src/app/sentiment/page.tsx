import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Market Sentiment - Crypto Data Aggregator',
  description: 'AI-powered crypto market sentiment analysis. Understand the mood of the market.',
};

// Force dynamic rendering to avoid self-referential API call during build
export const dynamic = 'force-dynamic';

interface SentimentArticle {
  title: string;
  source: string;
  sentiment: string;
  confidence: number;
  reasoning: string;
  impactLevel: string;
  affectedAssets: string[];
}

interface MarketSentiment {
  overall: string;
  score: number;
  confidence: number;
  summary: string;
  keyDrivers: string[];
}

interface SentimentData {
  articles: SentimentArticle[];
  market: MarketSentiment;
}

async function getSentiment(): Promise<SentimentData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'https://crypto-data-aggregator.vercel.app'}/api/sentiment?limit=20`,
      {
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const sentimentColors: Record<string, { text: string; bg: string; border: string }> = {
  very_bullish: {
    text: 'text-neutral-900 dark:text-white',
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    border: 'border-neutral-300 dark:border-neutral-600',
  },
  bullish: {
    text: 'text-neutral-900 dark:text-white',
    bg: 'bg-neutral-50 dark:bg-neutral-900',
    border: 'border-neutral-200 dark:border-neutral-700',
  },
  neutral: {
    text: 'text-neutral-600 dark:text-neutral-400',
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    border: 'border-neutral-200 dark:border-neutral-700',
  },
  bearish: {
    text: 'text-neutral-500 dark:text-neutral-400',
    bg: 'bg-neutral-50 dark:bg-neutral-900',
    border: 'border-neutral-200 dark:border-neutral-700',
  },
  very_bearish: {
    text: 'text-neutral-500 dark:text-neutral-400',
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    border: 'border-neutral-300 dark:border-neutral-600',
  },
};

// Text labels instead of emojis for sentiment
const sentimentLabels: Record<string, string> = {
  very_bullish: 'VERY BULLISH',
  bullish: 'BULLISH',
  neutral: 'NEUTRAL',
  bearish: 'BEARISH',
  very_bearish: 'VERY BEARISH',
};

function SentimentGauge({ score }: { score: number }) {
  // Score is -100 to 100, normalize to 0-100 for display
  const normalized = (score + 100) / 2;
  const rotation = (normalized / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="relative w-48 h-24 mx-auto">
      {/* Gauge background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="w-48 h-48 rounded-full border-[16px] border-neutral-200 dark:border-neutral-700"
          style={{
            borderTopColor: '#525252',
            borderRightColor: '#a3a3a3',
            borderBottomColor: 'transparent',
            borderLeftColor: '#171717',
            transform: 'rotate(-45deg)',
          }}
        />
      </div>
      {/* Needle */}
      <div
        className="absolute bottom-0 left-1/2 w-1 h-20 bg-neutral-900 dark:bg-white origin-bottom rounded-full transition-transform duration-500"
        style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
      />
      {/* Center dot */}
      <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-neutral-900 dark:bg-white rounded-full -translate-x-1/2 translate-y-1/2" />
      {/* Score */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-2xl font-bold text-neutral-900 dark:text-white">
        {score > 0 ? '+' : ''}
        {score}
      </div>
    </div>
  );
}

export default async function SentimentPage() {
  const data = await getSentiment();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto">
        <Header />

        <main className="px-4 py-8">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <svg
                className="w-8 h-8 text-neutral-900 dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">
                Market Sentiment
              </h1>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              AI-powered analysis of crypto market mood
            </p>
          </div>

          {data ? (
            <div className="space-y-8">
              {/* Overall Sentiment Card */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center">
                    <h2 className="text-lg text-neutral-500 dark:text-neutral-400 mb-4">
                      Market Sentiment Score
                    </h2>
                    <SentimentGauge score={data.market.score} />
                    <div className="mt-12">
                      <span
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold ${sentimentColors[data.market.overall]?.bg || 'bg-neutral-100 dark:bg-neutral-800'} ${sentimentColors[data.market.overall]?.text || 'text-neutral-600 dark:text-neutral-400'}`}
                      >
                        {sentimentLabels[data.market.overall] || 'NEUTRAL'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-neutral-900 dark:text-white">
                      Summary
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                      {data.market.summary}
                    </p>

                    <h3 className="font-bold text-lg mb-3 text-neutral-900 dark:text-white">
                      Key Drivers
                    </h3>
                    <ul className="space-y-2">
                      {data.market.keyDrivers?.map((driver, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300"
                        >
                          <span className="text-neutral-900 dark:text-white">→</span>
                          {driver}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                      Confidence: {data.market.confidence}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Sentiment List */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-neutral-900 dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Article Analysis
                  </h2>
                </div>
                <div className="space-y-3">
                  {data.articles?.map((article, i) => (
                    <div
                      key={i}
                      className={`bg-white dark:bg-neutral-900 rounded-xl border p-5 ${sentimentColors[article.sentiment]?.border || 'border-neutral-200 dark:border-neutral-800'}`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-900 dark:text-white">
                            {article.title}
                          </h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {article.source}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${sentimentColors[article.sentiment]?.bg || 'bg-neutral-100 dark:bg-neutral-800'} ${sentimentColors[article.sentiment]?.text || 'text-neutral-600 dark:text-neutral-400'}`}
                          >
                            {article.sentiment.replace('_', ' ')}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${article.impactLevel === 'high' ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold' : article.impactLevel === 'medium' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}
                          >
                            {article.impactLevel} impact
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        {article.reasoning}
                      </p>
                      {article.affectedAssets?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {article.affectedAssets.map((asset) => (
                            <Link
                              key={asset}
                              href={`/search?q=${asset}`}
                              className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                            >
                              {asset}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Sentiment Analysis Unavailable
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                AI features require GROQ_API_KEY to be configured
              </p>
              <Link href="/" className="text-neutral-900 dark:text-white hover:underline">
                ← Back to latest news
              </Link>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
