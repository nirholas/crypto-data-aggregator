/**
 * Watchlist Management
 *
 * Features:
 * - Track favorite coins
 * - Persist to localStorage
 * - Sync across tabs
 * - Import/Export functionality
 */

export interface WatchlistItem {
  coinId: string;
  addedAt: string;
}

export interface WatchlistExport {
  version: 1;
  exportedAt: string;
  coins: string[];
}

const STORAGE_KEY = 'crypto-watchlist';

/**
 * Maximum number of coins allowed in a watchlist.
 */
export const MAX_WATCHLIST_SIZE = 100;

/**
 * Retrieves the user's watchlist from localStorage.
 * Returns empty array on server-side or if no watchlist exists.
 *
 * @returns Array of watchlist items sorted by most recently added first
 *
 * @example
 * ```typescript
 * const watchlist = getWatchlist();
 * watchlist.forEach(item => console.log(item.coinId));
 * ```
 */
export function getWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as WatchlistItem[];
  } catch {
    return [];
  }
}

/**
 * Saves the watchlist to localStorage.
 * No-op on server-side rendering.
 *
 * @param watchlist - Complete watchlist array to save
 *
 * @example
 * ```typescript
 * const current = getWatchlist();
 * const updated = current.filter(item => item.coinId !== 'bitcoin');
 * saveWatchlist(updated);
 * ```
 */
export function saveWatchlist(watchlist: WatchlistItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  } catch (error) {
    console.error('Failed to save watchlist:', error);
  }
}

/**
 * Adds a coin to the watchlist.
 * Fails if coin already exists or watchlist is at max capacity.
 *
 * @param coinId - CoinGecko coin ID to add (e.g., 'bitcoin')
 * @returns Result object with success status and optional error message
 *
 * @example
 * ```typescript
 * const result = addToWatchlist('ethereum');
 * if (result.success) {
 *   console.log('Added!');
 * } else {
 *   console.log(result.error); // 'Already in watchlist'
 * }
 * ```
 */
export function addToWatchlist(coinId: string): { success: boolean; error?: string } {
  const watchlist = getWatchlist();

  if (watchlist.some((item) => item.coinId === coinId)) {
    return { success: false, error: 'Already in watchlist' };
  }

  if (watchlist.length >= MAX_WATCHLIST_SIZE) {
    return { success: false, error: `Watchlist is full (max ${MAX_WATCHLIST_SIZE} coins)` };
  }

  const newItem: WatchlistItem = {
    coinId,
    addedAt: new Date().toISOString(),
  };

  saveWatchlist([newItem, ...watchlist]);
  return { success: true };
}

/**
 * Removes a coin from the watchlist.
 *
 * @param coinId - CoinGecko coin ID to remove
 * @returns True if coin was removed, false if not found
 *
 * @example
 * ```typescript
 * const removed = removeFromWatchlist('bitcoin');
 * console.log(removed ? 'Removed' : 'Not in watchlist');
 * ```
 */
export function removeFromWatchlist(coinId: string): boolean {
  const watchlist = getWatchlist();
  const filtered = watchlist.filter((item) => item.coinId !== coinId);

  if (filtered.length === watchlist.length) {
    return false;
  }

  saveWatchlist(filtered);
  return true;
}

/**
 * Checks if a coin is in the watchlist.
 *
 * @param coinId - CoinGecko coin ID to check
 * @returns True if coin is in watchlist
 *
 * @example
 * ```typescript
 * if (isInWatchlist('bitcoin')) {
 *   console.log('Bitcoin is being watched');
 * }
 * ```
 */
export function isInWatchlist(coinId: string): boolean {
  const watchlist = getWatchlist();
  return watchlist.some((item) => item.coinId === coinId);
}

/**
 * Reorders the watchlist based on the provided coin ID order.
 * Only includes coins that exist in the current watchlist.
 *
 * @param coinIds - Array of coin IDs in desired order
 *
 * @example
 * ```typescript
 * // Move ethereum to first position
 * reorderWatchlist(['ethereum', 'bitcoin', 'solana']);
 * ```
 */
export function reorderWatchlist(coinIds: string[]): void {
  const watchlist = getWatchlist();
  const reordered = coinIds
    .map((id) => watchlist.find((item) => item.coinId === id))
    .filter((item): item is WatchlistItem => !!item);

  saveWatchlist(reordered);
}

/**
 * Removes all coins from the watchlist.
 *
 * @example
 * ```typescript
 * clearWatchlist();
 * console.log(getWatchlist().length); // 0
 * ```
 */
export function clearWatchlist(): void {
  saveWatchlist([]);
}

/**
 * Exports the watchlist to a JSON string for backup or sharing.
 *
 * @returns Formatted JSON string with version and coin IDs
 *
 * @example
 * ```typescript
 * const json = exportWatchlist();
 * navigator.clipboard.writeText(json);
 * // Downloads: { "version": 1, "exportedAt": "...", "coins": ["bitcoin", ...] }
 * ```
 */
export function exportWatchlist(): string {
  const watchlist = getWatchlist();
  const exportData: WatchlistExport = {
    version: 1,
    exportedAt: new Date().toISOString(),
    coins: watchlist.map((item) => item.coinId),
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * Imports a watchlist from a JSON string.
 * Merges with existing watchlist, skipping duplicates.
 *
 * @param data - JSON string from exportWatchlist()
 * @returns Result with success status, imported count, and optional error
 *
 * @example
 * ```typescript
 * const json = await file.text();
 * const result = importWatchlist(json);
 * if (result.success) {
 *   console.log(`Imported ${result.imported} coins`);
 * }
 * ```
 */
export function importWatchlist(data: string): {
  success: boolean;
  imported: number;
  error?: string;
} {
  try {
    const parsed = JSON.parse(data) as WatchlistExport;

    if (parsed.version !== 1) {
      return { success: false, imported: 0, error: 'Unsupported export version' };
    }

    if (!Array.isArray(parsed.coins)) {
      return { success: false, imported: 0, error: 'Invalid export format' };
    }

    const existingWatchlist = getWatchlist();
    const existingIds = new Set(existingWatchlist.map((item) => item.coinId));

    let imported = 0;
    const newItems: WatchlistItem[] = [];

    for (const coinId of parsed.coins) {
      if (typeof coinId !== 'string' || !coinId.trim()) continue;
      if (existingIds.has(coinId)) continue;
      if (existingWatchlist.length + newItems.length >= MAX_WATCHLIST_SIZE) break;

      newItems.push({
        coinId: coinId.trim(),
        addedAt: new Date().toISOString(),
      });
      imported++;
    }

    saveWatchlist([...existingWatchlist, ...newItems]);

    return { success: true, imported };
  } catch {
    return { success: false, imported: 0, error: 'Invalid JSON format' };
  }
}

/**
 * Exports the watchlist to CSV format.
 *
 * @returns CSV string with header row and coin data
 *
 * @example
 * ```typescript
 * const csv = exportWatchlistAsCSV();
 * downloadFile(csv, 'watchlist.csv', 'text/csv');
 * // Contents: "Coin ID,Added At\nbitcoin,2024-01-20T...\n"
 * ```
 */
export function exportWatchlistAsCSV(): string {
  const watchlist = getWatchlist();
  const header = 'Coin ID,Added At';
  const rows = watchlist.map((item) => `${item.coinId},${item.addedAt}`);
  return [header, ...rows].join('\n');
}
