/**
 * Alert Email Integration
 * 
 * Integrates email notifications with the existing alert system.
 * Sends emails for price alerts, keyword alerts, and advanced rule triggers.
 */

import { sendPriceAlert, sendNewsAlert } from '@/lib/email';
import type { AlertNotification, PriceAlert, KeywordAlert } from '@/lib/alerts';
import type { AlertEvent, AlertRule } from '@/lib/alert-rules';

// Types for user email lookup
interface UserEmailLookup {
  getUserEmail: (userId: string) => Promise<string | null>;
}

// Default implementation (replace with actual user lookup in production)
const defaultEmailLookup: UserEmailLookup = {
  getUserEmail: async (userId: string) => {
    // In production, this would query the database for user email
    // For now, check if userId looks like an email
    if (userId.includes('@')) {
      return userId;
    }
    return null;
  },
};

/**
 * Send email notification for a price alert
 */
export async function sendPriceAlertEmail(
  alert: PriceAlert,
  notification: AlertNotification,
  emailLookup: UserEmailLookup = defaultEmailLookup
): Promise<boolean> {
  // Check if email notification is enabled for this alert
  if (!alert.notifyVia.includes('email')) {
    return false;
  }

  // Get user email
  const email = await emailLookup.getUserEmail(alert.userId);
  if (!email) {
    console.warn(`No email found for user ${alert.userId}`);
    return false;
  }

  const data = notification.data as {
    coin: string;
    symbol: string;
    price: number;
    change24h: number;
    condition: string;
    threshold: number;
  };

  // Determine alert type for email
  const alertType = (['above', 'below'].includes(data.condition) 
    ? (data.condition === 'above' ? 'price_above' : 'price_below')
    : (data.change24h >= 0 ? 'percent_change_up' : 'percent_change_down')
  ) as 'price_above' | 'price_below' | 'percent_change_up' | 'percent_change_down';

  try {
    const result = await sendPriceAlert(email, {
      symbol: `${data.coin} (${data.symbol.toUpperCase()})`,
      alertType,
      currentPrice: data.price,
      targetPrice: data.threshold,
      percentChange: data.change24h,
    });

    return result.success;
  } catch (error) {
    console.error('Failed to send price alert email:', error);
    return false;
  }
}

/**
 * Send email notification for a keyword alert
 */
export async function sendKeywordAlertEmail(
  alert: KeywordAlert,
  notification: AlertNotification,
  emailLookup: UserEmailLookup = defaultEmailLookup
): Promise<boolean> {
  // Check if email notification is enabled for this alert
  if (!alert.notifyVia.includes('email')) {
    return false;
  }

  // Get user email
  const email = await emailLookup.getUserEmail(alert.userId);
  if (!email) {
    console.warn(`No email found for user ${alert.userId}`);
    return false;
  }

  const data = notification.data as {
    keywords: string[];
    article: {
      title: string;
      link: string;
      source: string;
    };
  };

  try {
    const result = await sendNewsAlert(
      email,
      [{
        title: data.article.title,
        url: data.article.link,
        source: data.article.source,
        publishedAt: new Date().toISOString(),
      }],
      data.keywords
    );

    return result.success;
  } catch (error) {
    console.error('Failed to send keyword alert email:', error);
    return false;
  }
}

/**
 * Send email notification for an advanced alert rule event
 */
export async function sendAlertEventEmail(
  rule: AlertRule,
  event: AlertEvent,
  emailLookup: UserEmailLookup = defaultEmailLookup
): Promise<boolean> {
  // Check if email channel is enabled for this rule
  if (!rule.channels.includes('email')) {
    return false;
  }

  // Get user email
  const email = await emailLookup.getUserEmail(rule.userId);
  if (!email) {
    console.warn(`No email found for user ${rule.userId}`);
    return false;
  }

  // Route to appropriate email based on rule type
  try {
    switch (rule.condition.type) {
      case 'price_threshold':
      case 'price_change':
      case 'volume_spike':
        // Send as price alert
        const priceData = event.context as {
          coinId?: string;
          symbol?: string;
          price?: number;
          change?: number;
        };

        await sendPriceAlert(email, {
          symbol: priceData.symbol || rule.name,
          alertType: event.severity === 'critical' ? 'percent_change_down' : 'price_above',
          currentPrice: priceData.price || 0,
          targetPrice: (rule.condition as any).value,
          percentChange: priceData.change,
        });
        break;

      case 'news_keyword':
      case 'breaking_news':
        // Send as news alert
        const newsData = event.context as {
          articles?: Array<{ title: string; link?: string; source?: string }>;
          keywords?: string[];
        };

        if (newsData.articles && newsData.articles.length > 0) {
          await sendNewsAlert(
            email,
            newsData.articles.map(a => ({
              title: a.title,
              url: a.link || '#',
              source: a.source || 'Unknown',
              publishedAt: new Date().toISOString(),
            })),
            newsData.keywords
          );
        }
        break;

      default:
        // Generic alert - use price alert template
        await sendPriceAlert(email, {
          symbol: rule.name,
          alertType: 'price_above',
          currentPrice: 0,
        });
    }

    return true;
  } catch (error) {
    console.error('Failed to send alert event email:', error);
    return false;
  }
}

/**
 * Process all pending email notifications for a batch of alerts
 */
export async function processAlertEmailNotifications(
  notifications: Array<{
    type: 'price' | 'keyword' | 'rule';
    alert?: PriceAlert | KeywordAlert;
    rule?: AlertRule;
    notification?: AlertNotification;
    event?: AlertEvent;
  }>,
  emailLookup: UserEmailLookup = defaultEmailLookup
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const item of notifications) {
    let success = false;

    if (item.type === 'price' && item.alert && item.notification) {
      success = await sendPriceAlertEmail(
        item.alert as PriceAlert,
        item.notification,
        emailLookup
      );
    } else if (item.type === 'keyword' && item.alert && item.notification) {
      success = await sendKeywordAlertEmail(
        item.alert as KeywordAlert,
        item.notification,
        emailLookup
      );
    } else if (item.type === 'rule' && item.rule && item.event) {
      success = await sendAlertEventEmail(
        item.rule,
        item.event,
        emailLookup
      );
    }

    if (success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed };
}

/**
 * Create an email-enabled user lookup from a database or auth system
 */
export function createEmailLookup(
  lookupFn: (userId: string) => Promise<string | null>
): UserEmailLookup {
  return { getUserEmail: lookupFn };
}

export default {
  sendPriceAlertEmail,
  sendKeywordAlertEmail,
  sendAlertEventEmail,
  processAlertEmailNotifications,
  createEmailLookup,
};
