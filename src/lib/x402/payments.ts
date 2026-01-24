/**
 * x402 Payment Receipts & History
 *
 * Tracks payments, generates receipts, and provides payment history
 * for users who pay via x402 micropayments.
 */

import { CURRENT_NETWORK, USDC_ADDRESS, PAYMENT_ADDRESS } from './config';

// =============================================================================
// TYPES
// =============================================================================

export interface PaymentReceipt {
  /** Unique receipt ID */
  id: string;
  /** ISO timestamp of payment */
  timestamp: string;
  /** Amount in USDC atomic units (6 decimals) */
  amount: string;
  /** Amount formatted for display */
  amountFormatted: string;
  /** Payment currency (always USDC) */
  currency: 'USDC';
  /** Network used for payment */
  network: string;
  /** Network name for display */
  networkName: string;
  /** On-chain transaction hash (if settled) */
  transactionHash?: string;
  /** Block explorer URL */
  explorerUrl?: string;
  /** Payer wallet address */
  walletAddress: string;
  /** API resource accessed */
  resource: string;
  /** Human-readable description */
  description: string;
  /** Payment status */
  status: 'pending' | 'settled' | 'failed' | 'refunded';
  /** Settlement timestamp */
  settledAt?: string;
  /** Any error message */
  error?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

export interface PaymentHistory {
  /** Wallet address */
  walletAddress: string;
  /** Total payments made */
  totalPayments: number;
  /** Total amount spent (in USD) */
  totalSpentUsd: number;
  /** Payments in current period */
  currentPeriodPayments: number;
  /** Amount in current period */
  currentPeriodSpentUsd: number;
  /** Recent receipts */
  receipts: PaymentReceipt[];
  /** First payment date */
  firstPaymentAt?: string;
  /** Last payment date */
  lastPaymentAt?: string;
}

export interface PaymentStats {
  /** Total revenue (all time) */
  totalRevenue: number;
  /** Revenue today */
  todayRevenue: number;
  /** Revenue this week */
  weekRevenue: number;
  /** Revenue this month */
  monthRevenue: number;
  /** Total number of payments */
  totalPayments: number;
  /** Unique payers */
  uniquePayers: number;
  /** Average payment amount */
  averagePayment: number;
  /** Top endpoints by revenue */
  topEndpoints: Array<{ endpoint: string; revenue: number; count: number }>;
}

// =============================================================================
// STORAGE (In-memory for demo, use Redis/DB in production)
// =============================================================================

const receiptsStore = new Map<string, PaymentReceipt>();
const walletReceiptsIndex = new Map<string, string[]>(); // wallet -> receipt IDs

// =============================================================================
// RECEIPT GENERATION
// =============================================================================

/**
 * Generate a unique receipt ID
 */
function generateReceiptId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `rcpt_${timestamp}_${random}`;
}

/**
 * Format USDC amount for display
 */
function formatUsdcAmount(atomicAmount: string): string {
  const num = parseInt(atomicAmount, 10);
  const usd = num / 1_000_000;
  if (usd < 0.01) {
    return `$${usd.toFixed(4)}`;
  }
  return `$${usd.toFixed(2)}`;
}

/**
 * Get network display name
 */
function getNetworkName(network: string): string {
  const names: Record<string, string> = {
    'eip155:8453': 'Base',
    'eip155:84532': 'Base Sepolia',
    'eip155:1': 'Ethereum',
    'eip155:137': 'Polygon',
    'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': 'Solana',
    'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1': 'Solana Devnet',
  };
  return names[network] || network;
}

/**
 * Get block explorer URL for transaction
 */
function getExplorerUrl(network: string, txHash: string): string {
  const explorers: Record<string, string> = {
    'eip155:8453': `https://basescan.org/tx/${txHash}`,
    'eip155:84532': `https://sepolia.basescan.org/tx/${txHash}`,
    'eip155:1': `https://etherscan.io/tx/${txHash}`,
    'eip155:137': `https://polygonscan.com/tx/${txHash}`,
    'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': `https://solscan.io/tx/${txHash}`,
    'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1': `https://solscan.io/tx/${txHash}?cluster=devnet`,
  };
  return explorers[network] || '';
}

/**
 * Create a new payment receipt
 */
export function createReceipt(params: {
  walletAddress: string;
  amount: string;
  resource: string;
  description: string;
  network?: string;
  transactionHash?: string;
  metadata?: Record<string, unknown>;
}): PaymentReceipt {
  const id = generateReceiptId();
  const now = new Date().toISOString();
  const network = params.network || CURRENT_NETWORK;

  const receipt: PaymentReceipt = {
    id,
    timestamp: now,
    amount: params.amount,
    amountFormatted: formatUsdcAmount(params.amount),
    currency: 'USDC',
    network,
    networkName: getNetworkName(network),
    walletAddress: params.walletAddress.toLowerCase(),
    resource: params.resource,
    description: params.description,
    status: params.transactionHash ? 'settled' : 'pending',
    transactionHash: params.transactionHash,
    explorerUrl: params.transactionHash ? getExplorerUrl(network, params.transactionHash) : undefined,
    settledAt: params.transactionHash ? now : undefined,
    metadata: params.metadata,
  };

  // Store receipt
  receiptsStore.set(id, receipt);

  // Index by wallet
  const walletKey = receipt.walletAddress;
  const walletReceipts = walletReceiptsIndex.get(walletKey) || [];
  walletReceipts.push(id);
  walletReceiptsIndex.set(walletKey, walletReceipts);

  return receipt;
}

/**
 * Update receipt status (e.g., when settled on-chain)
 */
export function updateReceipt(
  receiptId: string,
  updates: Partial<Pick<PaymentReceipt, 'status' | 'transactionHash' | 'settledAt' | 'error'>>
): PaymentReceipt | null {
  const receipt = receiptsStore.get(receiptId);
  if (!receipt) return null;

  const updated = {
    ...receipt,
    ...updates,
  };

  // Add explorer URL if transaction hash provided
  if (updates.transactionHash && !receipt.explorerUrl) {
    updated.explorerUrl = getExplorerUrl(receipt.network, updates.transactionHash);
  }

  receiptsStore.set(receiptId, updated);
  return updated;
}

/**
 * Get a receipt by ID
 */
export function getReceipt(receiptId: string): PaymentReceipt | null {
  return receiptsStore.get(receiptId) || null;
}

// =============================================================================
// PAYMENT HISTORY
// =============================================================================

/**
 * Get payment history for a wallet
 */
export function getPaymentHistory(
  walletAddress: string,
  options: { limit?: number; offset?: number } = {}
): PaymentHistory {
  const { limit = 50, offset = 0 } = options;
  const normalizedAddress = walletAddress.toLowerCase();

  const receiptIds = walletReceiptsIndex.get(normalizedAddress) || [];
  const allReceipts = receiptIds
    .map((id) => receiptsStore.get(id))
    .filter((r): r is PaymentReceipt => r !== undefined)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Calculate totals
  let totalSpentUsd = 0;
  let currentPeriodSpentUsd = 0;
  const now = Date.now();
  const periodStart = now - 30 * 24 * 60 * 60 * 1000; // Last 30 days

  for (const receipt of allReceipts) {
    if (receipt.status === 'settled' || receipt.status === 'pending') {
      const usd = parseInt(receipt.amount, 10) / 1_000_000;
      totalSpentUsd += usd;

      if (new Date(receipt.timestamp).getTime() > periodStart) {
        currentPeriodSpentUsd += usd;
      }
    }
  }

  // Paginate
  const paginatedReceipts = allReceipts.slice(offset, offset + limit);

  return {
    walletAddress: normalizedAddress,
    totalPayments: allReceipts.length,
    totalSpentUsd,
    currentPeriodPayments: allReceipts.filter(
      (r) => new Date(r.timestamp).getTime() > periodStart
    ).length,
    currentPeriodSpentUsd,
    receipts: paginatedReceipts,
    firstPaymentAt: allReceipts.length > 0 ? allReceipts[allReceipts.length - 1].timestamp : undefined,
    lastPaymentAt: allReceipts.length > 0 ? allReceipts[0].timestamp : undefined,
  };
}

// =============================================================================
// PAYMENT ANALYTICS
// =============================================================================

/**
 * Get payment statistics (for admin dashboard)
 */
export function getPaymentStats(): PaymentStats {
  const now = Date.now();
  const dayStart = now - 24 * 60 * 60 * 1000;
  const weekStart = now - 7 * 24 * 60 * 60 * 1000;
  const monthStart = now - 30 * 24 * 60 * 60 * 1000;

  let totalRevenue = 0;
  let todayRevenue = 0;
  let weekRevenue = 0;
  let monthRevenue = 0;
  const uniqueWallets = new Set<string>();
  const endpointRevenue = new Map<string, { revenue: number; count: number }>();

  for (const receipt of receiptsStore.values()) {
    if (receipt.status !== 'settled' && receipt.status !== 'pending') continue;

    const usd = parseInt(receipt.amount, 10) / 1_000_000;
    const ts = new Date(receipt.timestamp).getTime();

    totalRevenue += usd;
    uniqueWallets.add(receipt.walletAddress);

    if (ts > dayStart) todayRevenue += usd;
    if (ts > weekStart) weekRevenue += usd;
    if (ts > monthStart) monthRevenue += usd;

    // Track by endpoint
    const endpoint = receipt.resource;
    const existing = endpointRevenue.get(endpoint) || { revenue: 0, count: 0 };
    existing.revenue += usd;
    existing.count += 1;
    endpointRevenue.set(endpoint, existing);
  }

  // Sort endpoints by revenue
  const topEndpoints = Array.from(endpointRevenue.entries())
    .map(([endpoint, data]) => ({ endpoint, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return {
    totalRevenue,
    todayRevenue,
    weekRevenue,
    monthRevenue,
    totalPayments: receiptsStore.size,
    uniquePayers: uniqueWallets.size,
    averagePayment: receiptsStore.size > 0 ? totalRevenue / receiptsStore.size : 0,
    topEndpoints,
  };
}

// =============================================================================
// RECEIPT VERIFICATION
// =============================================================================

/**
 * Verify a receipt is valid (for dispute resolution)
 */
export function verifyReceipt(receiptId: string): {
  valid: boolean;
  receipt?: PaymentReceipt;
  reason?: string;
} {
  const receipt = receiptsStore.get(receiptId);

  if (!receipt) {
    return { valid: false, reason: 'Receipt not found' };
  }

  if (receipt.status === 'refunded') {
    return { valid: false, reason: 'Payment was refunded', receipt };
  }

  if (receipt.status === 'failed') {
    return { valid: false, reason: 'Payment failed', receipt };
  }

  return { valid: true, receipt };
}

/**
 * Export receipts for a wallet (for tax/accounting)
 */
export function exportReceipts(
  walletAddress: string,
  format: 'json' | 'csv' = 'json'
): string {
  const history = getPaymentHistory(walletAddress, { limit: 10000 });

  if (format === 'csv') {
    const headers = [
      'Receipt ID',
      'Date',
      'Amount (USD)',
      'Resource',
      'Description',
      'Status',
      'Transaction Hash',
      'Network',
    ];

    const rows = history.receipts.map((r) => [
      r.id,
      r.timestamp,
      r.amountFormatted,
      r.resource,
      r.description,
      r.status,
      r.transactionHash || '',
      r.networkName,
    ]);

    return [
      headers.join(','),
      ...rows.map((row) => row.map((v) => `"${v}"`).join(',')),
    ].join('\n');
  }

  return JSON.stringify(history, null, 2);
}
