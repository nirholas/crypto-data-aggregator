/**
 * x402 Access Pass System
 *
 * Implements time-based access passes for unlimited API usage.
 * Passes grant access to all premium endpoints for a duration
 * without per-request payments.
 *
 * Pass Types:
 * - hour: 1 hour unlimited access ($0.25)
 * - day: 24 hour unlimited access ($2.00)
 * - week: 7 day unlimited access ($10.00)
 */

import { CURRENT_NETWORK, PAYMENT_ADDRESS, USDC_ADDRESS } from './config';
import { createReceipt } from './payments';

// =============================================================================
// TYPES
// =============================================================================

export type PassDuration = 'hour' | 'day' | 'week';

export interface AccessPass {
  /** Unique pass ID */
  id: string;
  /** Wallet address that owns this pass */
  walletAddress: string;
  /** Pass type/duration */
  duration: PassDuration;
  /** ISO timestamp when pass starts */
  startsAt: string;
  /** ISO timestamp when pass expires */
  expiresAt: string;
  /** Amount paid (in USDC atomic units) */
  amountPaid: string;
  /** Transaction hash */
  transactionHash?: string;
  /** Network used */
  network: string;
  /** Current status */
  status: 'active' | 'expired' | 'cancelled';
  /** Number of requests made */
  requestCount: number;
  /** Last request timestamp */
  lastRequestAt?: string;
  /** Created timestamp */
  createdAt: string;
}

export interface PassConfig {
  duration: PassDuration;
  durationSeconds: number;
  priceUsd: number;
  priceUsdc: string;
  name: string;
  description: string;
  features: string[];
  rateLimit: number; // requests per minute
}

export interface PassPurchaseResult {
  success: boolean;
  pass?: AccessPass;
  receipt?: string;
  error?: string;
  paymentRequired?: {
    x402Version: number;
    accepts: Array<{
      scheme: string;
      network: string;
      asset: string;
      payTo: string;
      maxAmountRequired: string;
      resource: string;
      description: string;
    }>;
  };
}

// =============================================================================
// CONFIGURATION
// =============================================================================

export const PASS_CONFIG: Record<PassDuration, PassConfig> = {
  hour: {
    duration: 'hour',
    durationSeconds: 60 * 60, // 1 hour
    priceUsd: 0.25,
    priceUsdc: '250000', // 0.25 USDC
    name: '1 Hour Pass',
    description: 'Unlimited premium API access for 1 hour',
    features: [
      'All premium endpoints',
      'No per-request fees',
      'Standard rate limits (60/min)',
      'Perfect for quick analysis',
    ],
    rateLimit: 60,
  },
  day: {
    duration: 'day',
    durationSeconds: 24 * 60 * 60, // 24 hours
    priceUsd: 2.0,
    priceUsdc: '2000000', // 2 USDC
    name: '24 Hour Pass',
    description: 'Unlimited premium API access for 24 hours',
    features: [
      'All premium endpoints',
      'No per-request fees',
      'Higher rate limits (120/min)',
      'Priority support',
    ],
    rateLimit: 120,
  },
  week: {
    duration: 'week',
    durationSeconds: 7 * 24 * 60 * 60, // 7 days
    priceUsd: 10.0,
    priceUsdc: '10000000', // 10 USDC
    name: 'Weekly Pass',
    description: 'Unlimited premium API access for 7 days',
    features: [
      'All premium endpoints',
      'No per-request fees',
      'Highest rate limits (300/min)',
      'Priority support',
      'Webhook support',
      'Export capabilities',
    ],
    rateLimit: 300,
  },
};

// =============================================================================
// STORAGE (In-memory for demo, use Redis/DB in production)
// =============================================================================

const passStore = new Map<string, AccessPass>();
const walletPassIndex = new Map<string, string[]>(); // wallet -> pass IDs

// =============================================================================
// PASS MANAGEMENT
// =============================================================================

/**
 * Generate a unique pass ID
 */
function generatePassId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `pass_${timestamp}_${random}`;
}

/**
 * Create a new access pass
 */
export function createPass(
  walletAddress: string,
  duration: PassDuration,
  transactionHash?: string
): AccessPass {
  const config = PASS_CONFIG[duration];
  const now = new Date();
  const expiresAt = new Date(now.getTime() + config.durationSeconds * 1000);

  const pass: AccessPass = {
    id: generatePassId(),
    walletAddress: walletAddress.toLowerCase(),
    duration,
    startsAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    amountPaid: config.priceUsdc,
    transactionHash,
    network: CURRENT_NETWORK,
    status: 'active',
    requestCount: 0,
    createdAt: now.toISOString(),
  };

  // Store pass
  passStore.set(pass.id, pass);

  // Index by wallet
  const walletKey = pass.walletAddress;
  const walletPasses = walletPassIndex.get(walletKey) || [];
  walletPasses.push(pass.id);
  walletPassIndex.set(walletKey, walletPasses);

  // Create receipt
  createReceipt({
    walletAddress: pass.walletAddress,
    amount: config.priceUsdc,
    resource: `/api/premium/pass/${duration}`,
    description: config.description,
    transactionHash,
  });

  return pass;
}

/**
 * Get active pass for a wallet
 */
export function getActivePass(walletAddress: string): AccessPass | null {
  const normalizedAddress = walletAddress.toLowerCase();
  const passIds = walletPassIndex.get(normalizedAddress) || [];

  const now = new Date();

  for (const passId of passIds.reverse()) {
    // Check most recent first
    const pass = passStore.get(passId);
    if (!pass) continue;

    // Check if expired
    if (new Date(pass.expiresAt) < now) {
      if (pass.status === 'active') {
        pass.status = 'expired';
        passStore.set(passId, pass);
      }
      continue;
    }

    if (pass.status === 'active') {
      return pass;
    }
  }

  return null;
}

/**
 * Check if wallet has active pass
 */
export function hasActivePass(walletAddress: string): boolean {
  return getActivePass(walletAddress) !== null;
}

/**
 * Record a request against a pass
 */
export function recordPassRequest(passId: string): boolean {
  const pass = passStore.get(passId);
  if (!pass) return false;

  if (pass.status !== 'active') return false;

  // Check if expired
  if (new Date(pass.expiresAt) < new Date()) {
    pass.status = 'expired';
    passStore.set(passId, pass);
    return false;
  }

  pass.requestCount += 1;
  pass.lastRequestAt = new Date().toISOString();
  passStore.set(passId, pass);

  return true;
}

/**
 * Get pass by ID
 */
export function getPass(passId: string): AccessPass | null {
  return passStore.get(passId) || null;
}

/**
 * Get all passes for a wallet
 */
export function getWalletPasses(walletAddress: string): AccessPass[] {
  const normalizedAddress = walletAddress.toLowerCase();
  const passIds = walletPassIndex.get(normalizedAddress) || [];

  return passIds
    .map((id) => passStore.get(id))
    .filter((p): p is AccessPass => p !== undefined)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Get rate limit for a pass
 */
export function getPassRateLimit(pass: AccessPass): number {
  return PASS_CONFIG[pass.duration].rateLimit;
}

// =============================================================================
// PAYMENT REQUIREMENTS
// =============================================================================

/**
 * Get x402 payment requirements for a pass
 */
export function getPassPaymentRequirements(duration: PassDuration) {
  const config = PASS_CONFIG[duration];

  return {
    x402Version: 2,
    accepts: [
      {
        scheme: 'exact',
        network: CURRENT_NETWORK,
        asset: USDC_ADDRESS,
        payTo: PAYMENT_ADDRESS,
        maxAmountRequired: config.priceUsdc,
        resource: `/api/premium/pass/${duration}`,
        description: config.description,
        mimeType: 'application/json',
        maxTimeoutSeconds: 300,
      },
    ],
  };
}

/**
 * Validate pass purchase payment
 */
export function validatePassPayment(
  duration: PassDuration,
  amountPaid: string
): { valid: boolean; reason?: string } {
  const config = PASS_CONFIG[duration];
  const required = BigInt(config.priceUsdc);
  const paid = BigInt(amountPaid);

  if (paid < required) {
    return {
      valid: false,
      reason: `Insufficient payment. Required: ${config.priceUsd} USDC, Paid: ${Number(paid) / 1_000_000} USDC`,
    };
  }

  return { valid: true };
}

// =============================================================================
// PASS STATUS
// =============================================================================

/**
 * Get pass status info for display
 */
export function getPassStatus(pass: AccessPass): {
  isActive: boolean;
  remainingSeconds: number;
  remainingFormatted: string;
  progress: number;
  config: PassConfig;
} {
  const config = PASS_CONFIG[pass.duration];
  const now = new Date();
  const expiresAt = new Date(pass.expiresAt);
  const startsAt = new Date(pass.startsAt);

  const remainingSeconds = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
  const totalSeconds = config.durationSeconds;
  const elapsedSeconds = Math.floor((now.getTime() - startsAt.getTime()) / 1000);
  const progress = Math.min(100, (elapsedSeconds / totalSeconds) * 100);

  let remainingFormatted: string;
  if (remainingSeconds <= 0) {
    remainingFormatted = 'Expired';
  } else if (remainingSeconds < 60) {
    remainingFormatted = `${remainingSeconds}s`;
  } else if (remainingSeconds < 3600) {
    remainingFormatted = `${Math.floor(remainingSeconds / 60)}m`;
  } else if (remainingSeconds < 86400) {
    remainingFormatted = `${Math.floor(remainingSeconds / 3600)}h ${Math.floor((remainingSeconds % 3600) / 60)}m`;
  } else {
    remainingFormatted = `${Math.floor(remainingSeconds / 86400)}d ${Math.floor((remainingSeconds % 86400) / 3600)}h`;
  }

  return {
    isActive: pass.status === 'active' && remainingSeconds > 0,
    remainingSeconds,
    remainingFormatted,
    progress,
    config,
  };
}

/**
 * Get all pass options for display
 */
export function getPassOptions(): Array<PassConfig & { savings?: string }> {
  const hourlyRate = PASS_CONFIG.hour.priceUsd; // Base comparison
  const estimatedRequestsPerHour = 50;
  const perRequestCost = 0.02; // Average

  return Object.values(PASS_CONFIG).map((config) => {
    const hours = config.durationSeconds / 3600;
    const perRequestTotal = estimatedRequestsPerHour * hours * perRequestCost;
    const savings =
      perRequestTotal > config.priceUsd
        ? `Save up to $${(perRequestTotal - config.priceUsd).toFixed(2)}`
        : undefined;

    return { ...config, savings };
  });
}
