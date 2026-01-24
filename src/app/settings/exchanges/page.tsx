/**
 * Exchange Settings Page
 * 
 * Manage connected exchange accounts
 */

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '@/lib/auth';
import { ExchangeSettings } from '@/components/settings/ExchangeSettings';

export const metadata = {
  title: 'Exchange Settings | CryptoNews',
  description: 'Connect and manage your cryptocurrency exchange accounts for automatic portfolio sync.',
};

async function ExchangeSettingsContent() {
  const session = await getSessionFromCookie();
  
  if (!session) {
    redirect('/auth/login?redirect=/settings/exchanges');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-slate-400 mb-4">
            <a href="/settings" className="hover:text-white transition-colors">Settings</a>
            <span className="mx-2">/</span>
            <span className="text-white">Exchanges</span>
          </nav>
          <h1 className="text-3xl font-bold text-white">Exchange Connections</h1>
          <p className="text-slate-400 mt-2">
            Connect your exchange accounts to automatically sync your portfolio and track your holdings in real-time.
          </p>
        </div>

        {/* Exchange settings component */}
        <ExchangeSettings />
      </div>
    </div>
  );
}

export default function ExchangeSettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ExchangeSettingsContent />
    </Suspense>
  );
}
