import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Premium API Pricing | Crypto Data Aggregator',
  description: 'Pay-per-use crypto data API with x402 micropayments. No subscription required.',
};

const aiEndpoints = [
  {
    path: '/api/premium/ai/sentiment',
    price: 0.02,
    name: 'AI Sentiment Analysis',
    description: 'Real-time sentiment analysis of crypto news',
  },
  {
    path: '/api/premium/ai/signals',
    price: 0.05,
    name: 'Trading Signals',
    description: 'AI-generated buy/sell signals',
  },
  {
    path: '/api/premium/ai/summary',
    price: 0.01,
    name: 'Market Summary',
    description: 'AI market summary for any coin',
  },
  {
    path: '/api/premium/ai/compare',
    price: 0.03,
    name: 'Coin Comparison',
    description: 'AI comparison of cryptocurrencies',
  },
];

const whaleEndpoints = [
  {
    path: '/api/premium/whales/transactions',
    price: 0.05,
    name: 'Whale Transactions',
    description: 'Large transaction tracking ($1M+)',
  },
  {
    path: '/api/premium/whales/alerts',
    price: 0.05,
    name: 'Whale Alerts',
    description: 'Webhook alerts for whale movements',
  },
  {
    path: '/api/premium/wallets/analyze',
    price: 0.1,
    name: 'Wallet Analysis',
    description: 'Deep wallet address analysis',
  },
  {
    path: '/api/premium/smart-money',
    price: 0.05,
    name: 'Smart Money',
    description: 'Institutional movement tracking',
  },
];

const dataEndpoints = [
  {
    path: '/api/premium/screener/advanced',
    price: 0.02,
    name: 'Advanced Screener',
    description: 'Unlimited filter combinations',
  },
  {
    path: '/api/premium/history/full',
    price: 0.05,
    name: 'Full History',
    description: '5+ years historical data',
  },
  {
    path: '/api/premium/correlations',
    price: 0.03,
    name: 'Correlations',
    description: 'Cross-asset correlation matrix',
  },
  {
    path: '/api/premium/export/full',
    price: 0.15,
    name: 'Full Export',
    description: 'Complete database export',
  },
];

const passes = [
  { name: '1 Hour', price: 0.25, duration: '1 hour', savings: '~50 requests worth' },
  {
    name: '24 Hours',
    price: 2.0,
    duration: '24 hours',
    savings: '~400 requests worth',
    popular: true,
  },
  { name: '7 Days', price: 10.0, duration: '7 days', savings: '~2000 requests worth' },
];

export default function PremiumPricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium API Pricing</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Pay only for what you use. No subscription required. Start for just $0.01 with crypto
            micropayments.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/docs/api"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              View Documentation
            </Link>
            <a
              href="https://docs.x402.org"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Learn About x402
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Make Request', description: 'Call any premium endpoint' },
              { step: 2, title: 'Get Price', description: 'Receive 402 with payment details' },
              { step: 3, title: 'Pay with USDC', description: 'Use any x402 wallet or SDK' },
              { step: 4, title: 'Get Data', description: 'Receive premium data instantly' },
            ].map(({ step, title, description }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {step}
                  </span>
                </div>
                <h3 className="font-semibold mb-2 dark:text-white">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Passes */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">
            Unlimited Access Passes
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            For power users: unlimited requests for a fixed price
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {passes.map((pass) => (
              <div
                key={pass.name}
                className={`rounded-xl p-8 ${
                  pass.popular
                    ? 'bg-blue-600 text-white ring-4 ring-blue-300 dark:ring-blue-800'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {pass.popular && <div className="text-sm font-semibold mb-2">MOST POPULAR</div>}
                <h3 className={`text-2xl font-bold mb-2 ${pass.popular ? '' : 'dark:text-white'}`}>
                  {pass.name}
                </h3>
                <div className="text-4xl font-bold mb-4">${pass.price.toFixed(2)}</div>
                <p
                  className={`mb-6 ${pass.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  {pass.duration} of unlimited access
                </p>
                <ul
                  className={`space-y-3 mb-8 ${pass.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> All premium endpoints
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> No per-request fees
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> {pass.savings}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Higher rate limits
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Endpoints */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">🧠</span>
            <h2 className="text-3xl font-bold dark:text-white">AI Analysis</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {aiEndpoints.map((endpoint) => (
              <EndpointCard key={endpoint.path} {...endpoint} />
            ))}
          </div>
        </div>
      </section>

      {/* Whale Tracking */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">🐋</span>
            <h2 className="text-3xl font-bold dark:text-white">Whale Tracking</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {whaleEndpoints.map((endpoint) => (
              <EndpointCard key={endpoint.path} {...endpoint} />
            ))}
          </div>
        </div>
      </section>

      {/* Data & Analytics */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">📊</span>
            <h2 className="text-3xl font-bold dark:text-white">Data & Analytics</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {dataEndpoints.map((endpoint) => (
              <EndpointCard key={endpoint.path} {...endpoint} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Why Pay-Per-Use?</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left dark:text-white">Provider</th>
                  <th className="px-6 py-4 text-left dark:text-white">Price</th>
                  <th className="px-6 py-4 text-left dark:text-white">Model</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 font-semibold text-blue-600">Crypto Data Aggregator</td>
                  <td className="px-6 py-4 dark:text-white">From $0.01</td>
                  <td className="px-6 py-4 text-green-600 font-medium">Pay per use ✓</td>
                </tr>
                <tr className="text-gray-600 dark:text-gray-400">
                  <td className="px-6 py-4">CoinGecko Pro</td>
                  <td className="px-6 py-4">$129/month</td>
                  <td className="px-6 py-4">Subscription</td>
                </tr>
                <tr className="text-gray-600 dark:text-gray-400">
                  <td className="px-6 py-4">CoinMarketCap</td>
                  <td className="px-6 py-4">$99/month</td>
                  <td className="px-6 py-4">Subscription</td>
                </tr>
                <tr className="text-gray-600 dark:text-gray-400">
                  <td className="px-6 py-4">Messari</td>
                  <td className="px-6 py-4">$249/month</td>
                  <td className="px-6 py-4">Subscription</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
            Make 100 requests/month? Pay ~$2 instead of $129.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            No API key needed. Just make a request and pay with crypto.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/docs/api"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Read the Docs
            </Link>
            <a
              href="/api/premium"
              className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              View API Spec
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function EndpointCard({
  path,
  price,
  name,
  description,
}: {
  path: string;
  price: number;
  name: string;
  description: string;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg dark:text-white">{name}</h3>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
          ${price.toFixed(2)}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-3">{description}</p>
      <code className="text-sm bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
        GET {path}
      </code>
    </div>
  );
}
