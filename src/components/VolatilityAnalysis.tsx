'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, Info } from 'lucide-react';
import { chartColors, colors } from '@/lib/colors';

interface CoinVolatility {
  id: string;
  name: string;
  symbol: string;
  volatility30d: number;
  volatility7d: number;
  maxDrawdown: number;
  sharpeRatio: number;
  beta: number;
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
}

interface VolatilityAnalysisProps {
  coins?: CoinVolatility[];
  isLoading?: boolean;
}

// Mock data for demonstration
const mockCoins: CoinVolatility[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    volatility30d: 42.5,
    volatility7d: 38.2,
    maxDrawdown: -18.3,
    sharpeRatio: 1.24,
    beta: 1.0,
    riskLevel: 'medium',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    volatility30d: 58.7,
    volatility7d: 52.1,
    maxDrawdown: -24.6,
    sharpeRatio: 0.98,
    beta: 1.32,
    riskLevel: 'high',
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    volatility30d: 78.3,
    volatility7d: 71.4,
    maxDrawdown: -35.2,
    sharpeRatio: 0.76,
    beta: 1.68,
    riskLevel: 'extreme',
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    volatility30d: 65.1,
    volatility7d: 58.9,
    maxDrawdown: -28.4,
    sharpeRatio: 0.54,
    beta: 1.45,
    riskLevel: 'high',
  },
  {
    id: 'ripple',
    name: 'XRP',
    symbol: 'XRP',
    volatility30d: 55.2,
    volatility7d: 48.6,
    maxDrawdown: -22.1,
    sharpeRatio: 0.82,
    beta: 1.21,
    riskLevel: 'medium',
  },
  {
    id: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'DOGE',
    volatility30d: 89.4,
    volatility7d: 82.3,
    maxDrawdown: -42.7,
    sharpeRatio: 0.31,
    beta: 1.95,
    riskLevel: 'extreme',
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    volatility30d: 62.8,
    volatility7d: 55.4,
    maxDrawdown: -26.8,
    sharpeRatio: 0.68,
    beta: 1.38,
    riskLevel: 'high',
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    volatility30d: 71.5,
    volatility7d: 64.2,
    maxDrawdown: -31.5,
    sharpeRatio: 0.72,
    beta: 1.52,
    riskLevel: 'high',
  },
];

const riskColors = {
  low: chartColors.gain,
  medium: colors.warning,
  high: chartColors.loss,
  extreme: '#FF4757',
};

const riskLabels = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
  extreme: 'Extreme Risk',
};

function VolatilityBar({ value, maxValue = 100 }: { value: number; maxValue?: number }) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const color = value < 40 ? chartColors.gain : value < 60 ? colors.warning : chartColors.loss;

  return (
    <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  tooltip,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
  tooltip?: string;
}) {
  return (
    <div className="bg-surface rounded-xl p-4 border border-surface-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-muted text-sm flex items-center gap-1">
          {title}
          {tooltip && (
            <span className="group relative cursor-help">
              <Info className="w-3 h-3" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-background text-text-primary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {tooltip}
              </span>
            </span>
          )}
        </span>
        <Icon className="w-4 h-4 text-text-muted" />
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-text-primary">{value}</span>
        {trend && trend !== 'neutral' && (
          <span className={trend === 'up' ? 'text-gain' : 'text-loss'}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </span>
        )}
      </div>
    </div>
  );
}

function RiskBadge({ level }: { level: CoinVolatility['riskLevel'] }) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${riskColors[level]}20`,
        color: riskColors[level],
      }}
    >
      {riskLabels[level]}
    </span>
  );
}

export default function VolatilityAnalysis({
  coins = mockCoins,
  isLoading = false,
}: VolatilityAnalysisProps) {
  const [sortBy, setSortBy] = useState<'volatility30d' | 'maxDrawdown' | 'sharpeRatio' | 'beta'>(
    'volatility30d'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedCoins = useMemo(() => {
    return [...coins].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [coins, sortBy, sortOrder]);

  const avgVolatility = useMemo(() => {
    return (coins.reduce((sum, c) => sum + c.volatility30d, 0) / coins.length).toFixed(1);
  }, [coins]);

  const avgDrawdown = useMemo(() => {
    return (coins.reduce((sum, c) => sum + c.maxDrawdown, 0) / coins.length).toFixed(1);
  }, [coins]);

  const avgSharpe = useMemo(() => {
    return (coins.reduce((sum, c) => sum + c.sharpeRatio, 0) / coins.length).toFixed(2);
  }, [coins]);

  const highRiskCount = useMemo(() => {
    return coins.filter((c) => c.riskLevel === 'high' || c.riskLevel === 'extreme').length;
  }, [coins]);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface rounded-2xl p-6 border border-surface-border">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-surface-hover rounded" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-surface-hover rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-surface-hover rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl p-6 border border-surface-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Volatility Analysis
          </h2>
          <p className="text-text-muted text-sm mt-1">
            Risk metrics and volatility indicators for top cryptocurrencies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-muted text-sm">Timeframe:</span>
          <select className="bg-surface-hover text-text-primary text-sm rounded-lg px-3 py-1.5 border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
            <option value="1y">1 Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Avg Volatility"
          value={`${avgVolatility}%`}
          icon={Activity}
          tooltip="Average 30-day annualized volatility"
        />
        <MetricCard
          title="Avg Max Drawdown"
          value={`${avgDrawdown}%`}
          icon={TrendingDown}
          tooltip="Average maximum peak-to-trough decline"
        />
        <MetricCard
          title="Avg Sharpe Ratio"
          value={avgSharpe}
          icon={TrendingUp}
          tooltip="Risk-adjusted return metric"
        />
        <MetricCard
          title="High Risk Assets"
          value={`${highRiskCount}/${coins.length}`}
          icon={AlertTriangle}
          tooltip="Assets with high or extreme risk levels"
        />
      </div>

      {/* Risk Distribution */}
      <div className="mb-6 p-4 bg-background rounded-xl">
        <h3 className="text-sm font-medium text-text-secondary mb-3">Risk Distribution</h3>
        <div className="flex gap-2">
          {(['low', 'medium', 'high', 'extreme'] as const).map((level) => {
            const count = coins.filter((c) => c.riskLevel === level).length;
            const percentage = (count / coins.length) * 100;
            return (
              <div
                key={level}
                className="flex-1 text-center p-2 rounded-lg"
                style={{ backgroundColor: `${riskColors[level]}15` }}
              >
                <div className="text-lg font-bold" style={{ color: riskColors[level] }}>
                  {count}
                </div>
                <div className="text-xs text-text-muted capitalize">{level}</div>
                <div
                  className="h-1 rounded-full mt-1"
                  style={{
                    backgroundColor: riskColors[level],
                    width: `${percentage}%`,
                    margin: '0 auto',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Volatility Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-border">
              <th className="text-left py-3 px-4 text-text-muted text-sm font-medium">Asset</th>
              <th
                className="text-right py-3 px-4 text-text-muted text-sm font-medium cursor-pointer hover:text-text-primary transition-colors"
                onClick={() => handleSort('volatility30d')}
              >
                <span className="flex items-center justify-end gap-1">
                  30d Vol
                  {sortBy === 'volatility30d' && (
                    <span className="text-primary">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                  )}
                </span>
              </th>
              <th className="text-right py-3 px-4 text-text-muted text-sm font-medium hidden md:table-cell">
                7d Vol
              </th>
              <th
                className="text-right py-3 px-4 text-text-muted text-sm font-medium cursor-pointer hover:text-text-primary transition-colors"
                onClick={() => handleSort('maxDrawdown')}
              >
                <span className="flex items-center justify-end gap-1">
                  Max DD
                  {sortBy === 'maxDrawdown' && (
                    <span className="text-primary">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                  )}
                </span>
              </th>
              <th
                className="text-right py-3 px-4 text-text-muted text-sm font-medium cursor-pointer hover:text-text-primary transition-colors hidden lg:table-cell"
                onClick={() => handleSort('sharpeRatio')}
              >
                <span className="flex items-center justify-end gap-1">
                  Sharpe
                  {sortBy === 'sharpeRatio' && (
                    <span className="text-primary">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                  )}
                </span>
              </th>
              <th
                className="text-right py-3 px-4 text-text-muted text-sm font-medium cursor-pointer hover:text-text-primary transition-colors hidden lg:table-cell"
                onClick={() => handleSort('beta')}
              >
                <span className="flex items-center justify-end gap-1">
                  Beta
                  {sortBy === 'beta' && (
                    <span className="text-primary">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                  )}
                </span>
              </th>
              <th className="text-right py-3 px-4 text-text-muted text-sm font-medium">Risk</th>
            </tr>
          </thead>
          <tbody>
            {sortedCoins.map((coin, index) => (
              <tr
                key={coin.id}
                className="border-b border-surface-border hover:bg-surface-hover transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-sm font-medium text-text-secondary">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">{coin.name}</div>
                      <div className="text-text-muted text-sm">{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-medium text-text-primary">
                      {coin.volatility30d.toFixed(1)}%
                    </span>
                    <div className="w-20">
                      <VolatilityBar value={coin.volatility30d} />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right text-text-secondary hidden md:table-cell">
                  {coin.volatility7d.toFixed(1)}%
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-loss font-medium">{coin.maxDrawdown.toFixed(1)}%</span>
                </td>
                <td className="py-4 px-4 text-right hidden lg:table-cell">
                  <span
                    className={
                      coin.sharpeRatio >= 1
                        ? 'text-gain'
                        : coin.sharpeRatio >= 0.5
                          ? 'text-text-secondary'
                          : 'text-loss'
                    }
                  >
                    {coin.sharpeRatio.toFixed(2)}
                  </span>
                </td>
                <td className="py-4 px-4 text-right text-text-secondary hidden lg:table-cell">
                  {coin.beta.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right">
                  <RiskBadge level={coin.riskLevel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-surface-border">
        <div className="flex flex-wrap gap-4 text-xs text-text-muted">
          <span>
            <strong>Vol:</strong> Annualized volatility
          </span>
          <span>
            <strong>Max DD:</strong> Maximum drawdown from peak
          </span>
          <span>
            <strong>Sharpe:</strong> Risk-adjusted returns (higher is better)
          </span>
          <span>
            <strong>Beta:</strong> Correlation to BTC (1.0 = same as BTC)
          </span>
        </div>
      </div>
    </div>
  );
}
