'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PerformanceChartProps {
  /** Current total portfolio value in USD. */
  totalValue: number;
  /** Current price per coin id, used to detect when the portfolio moved. */
  prices: Record<string, number>;
  isLoading?: boolean;
}

interface Point {
  t: number;
  value: number;
}

const STORAGE_KEY = 'portfolio-value-history';
/** Keep two weeks of samples. Enough for the range buttons, small in storage. */
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;
/** Do not record a new point more than once a minute. */
const MIN_SAMPLE_GAP_MS = 60 * 1000;

const RANGES = [
  { id: '24h', label: '24H', ms: 24 * 60 * 60 * 1000 },
  { id: '7d', label: '7D', ms: 7 * 24 * 60 * 60 * 1000 },
  { id: '14d', label: '14D', ms: MAX_AGE_MS },
] as const;

type RangeId = (typeof RANGES)[number]['id'];

function readHistory(): Point[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const cutoff = Date.now() - MAX_AGE_MS;
    return parsed
      .filter(
        (point): point is Point =>
          typeof point === 'object' &&
          point !== null &&
          typeof (point as Point).t === 'number' &&
          typeof (point as Point).value === 'number'
      )
      .filter(point => point.t >= cutoff)
      .sort((a, b) => a.t - b.t);
  } catch {
    return [];
  }
}

function writeHistory(points: Point[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(points));
  } catch {
    // Storage full or blocked. The chart still works for this session.
  }
}

function formatUsd(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  });
}

/**
 * Portfolio value over time.
 *
 * There is no server-side portfolio store, so the series is sampled in the
 * browser: each time the holdings revalue, the new total is appended to a
 * capped history in localStorage. That keeps the chart honest, it only ever
 * plots values this browser actually observed, and it needs no backend.
 */
export function PerformanceChart({ totalValue, prices, isLoading = false }: PerformanceChartProps) {
  const [history, setHistory] = useState<Point[]>([]);
  const [range, setRange] = useState<RangeId>('24h');

  // Load once on mount so server and first client render agree.
  useEffect(() => {
    setHistory(readHistory());
  }, []);

  // Record a sample whenever the revalued total changes.
  const priceSignature = useMemo(
    () =>
      Object.entries(prices)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, price]) => `${id}:${price}`)
        .join('|'),
    [prices]
  );

  useEffect(() => {
    if (isLoading || !Number.isFinite(totalValue) || totalValue <= 0) return;

    setHistory(previous => {
      const last = previous[previous.length - 1];
      const now = Date.now();

      if (last && now - last.t < MIN_SAMPLE_GAP_MS) {
        // Same minute: correct the latest point rather than adding noise.
        if (last.value === totalValue) return previous;
        const updated = [...previous.slice(0, -1), { t: last.t, value: totalValue }];
        writeHistory(updated);
        return updated;
      }

      const cutoff = now - MAX_AGE_MS;
      const updated = [...previous.filter(point => point.t >= cutoff), { t: now, value: totalValue }];
      writeHistory(updated);
      return updated;
    });
  }, [totalValue, priceSignature, isLoading]);

  const activeRange = RANGES.find(r => r.id === range) ?? RANGES[0];
  const points = useMemo(() => {
    const cutoff = Date.now() - activeRange.ms;
    return history.filter(point => point.t >= cutoff);
  }, [history, activeRange]);

  const first = points[0];
  const last = points[points.length - 1];
  const change = first && last && first.value > 0 ? ((last.value - first.value) / first.value) * 100 : 0;
  const isUp = change >= 0;

  const path = useMemo(() => {
    if (points.length < 2) return '';

    const width = 100;
    const height = 40;
    const values = points.map(point => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const startT = points[0].t;
    const timeSpan = points[points.length - 1].t - startT || 1;

    return points
      .map((point, index) => {
        const x = ((point.t - startT) / timeSpan) * width;
        const y = height - ((point.value - min) / span) * height;
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }, [points]);

  if (isLoading) {
    return (
      <div className="bg-surface rounded-2xl p-6 border border-surface-border animate-pulse">
        <div className="h-4 bg-surface-alt rounded w-32 mb-4" />
        <div className="h-40 bg-surface-alt rounded" />
      </div>
    );
  }

  return (
    <section
      className="bg-surface rounded-2xl p-6 border border-surface-border"
      aria-label="Portfolio performance"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Portfolio value
          </h3>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatUsd(totalValue)}
            </span>
            {points.length >= 2 && (
              <span
                className={`inline-flex items-center gap-1 text-sm font-medium ${
                  isUp ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {isUp ? (
                  <TrendingUp className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <TrendingDown className="w-4 h-4" aria-hidden="true" />
                )}
                {isUp ? '+' : ''}
                {change.toFixed(2)}%
                <span className="sr-only"> over the selected range</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1" role="group" aria-label="Chart range">
          {RANGES.map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => setRange(option.id)}
              aria-pressed={range === option.id}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                range === option.id
                  ? 'bg-amber-500 text-black'
                  : 'bg-surface-alt text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {points.length < 2 ? (
        <div className="h-40 flex flex-col items-center justify-center text-center gap-2 rounded-xl border border-dashed border-surface-border">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Not enough history yet
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
            Your portfolio value is sampled in this browser as prices refresh. Come back after a few
            updates and the trend will appear here.
          </p>
        </div>
      ) : (
        <>
          <svg
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            className="w-full h-40"
            role="img"
            aria-label={`Portfolio value over the last ${activeRange.label}, ${
              isUp ? 'up' : 'down'
            } ${Math.abs(change).toFixed(2)} percent`}
          >
            <defs>
              <linearGradient id="portfolio-perf-fill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isUp ? 'rgb(34 197 94)' : 'rgb(239 68 68)'}
                  stopOpacity="0.28"
                />
                <stop
                  offset="100%"
                  stopColor={isUp ? 'rgb(34 197 94)' : 'rgb(239 68 68)'}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path d={`${path} L100,40 L0,40 Z`} fill="url(#portfolio-perf-fill)" />
            <path
              d={path}
              fill="none"
              stroke={isUp ? 'rgb(34 197 94)' : 'rgb(239 68 68)'}
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="flex justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{new Date(first.t).toLocaleString()}</span>
            <span>{new Date(last.t).toLocaleString()}</span>
          </div>
        </>
      )}
    </section>
  );
}

export default PerformanceChart;
