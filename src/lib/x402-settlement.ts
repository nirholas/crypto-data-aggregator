/**
 * x402 verify-then-settle helper.
 *
 * A payment is only accepted when the facilitator confirms /verify AND /settle.
 * Any facilitator outage, malformed reply or negative answer rejects the payment
 * (fail closed); a signature that merely looks well formed is never trusted.
 */

export interface SettlementExpectation {
  /** Minimum amount in the asset's smallest unit */
  amount: string;
  /** Required recipient address */
  payTo: string;
  /** Resource being purchased, forwarded to the facilitator */
  resource: string;
  facilitatorUrl: string;
  network?: string;
  asset?: string;
}

export interface SettlementResult {
  ok: boolean;
  reason?: string;
  payer?: string;
  amountPaid?: string;
  transactionHash?: string;
}

interface Authorization {
  from: string;
  to: string;
  amount: string;
  validAfter: number;
  validBefore: number;
}

async function postJson(url: string, body: unknown): Promise<{ status: number; data: any }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, data };
}

export async function verifyAndSettlePayment(
  paymentHeader: string,
  expected: SettlementExpectation
): Promise<SettlementResult> {
  let payload: any;
  try {
    payload = JSON.parse(Buffer.from(paymentHeader, 'base64').toString('utf-8'));
  } catch {
    return { ok: false, reason: 'Could not parse payment header' };
  }

  const auth: Authorization | undefined = payload?.payload?.authorization;
  if (payload?.x402Version !== 2) return { ok: false, reason: 'Unsupported x402 version' };
  if (payload?.scheme !== 'exact') return { ok: false, reason: 'Unsupported payment scheme' };
  if (!auth || typeof payload.payload.signature !== 'string') {
    return { ok: false, reason: 'Missing payment authorization' };
  }

  try {
    if (BigInt(auth.amount) < BigInt(expected.amount)) {
      return { ok: false, reason: 'Insufficient payment amount' };
    }
  } catch {
    return { ok: false, reason: 'Invalid payment amount' };
  }
  if (String(auth.to).toLowerCase() !== expected.payTo.toLowerCase()) {
    return { ok: false, reason: 'Incorrect payment recipient' };
  }
  const now = Math.floor(Date.now() / 1000);
  if (now < auth.validAfter) return { ok: false, reason: 'Payment not yet valid' };
  if (now > auth.validBefore) return { ok: false, reason: 'Payment expired' };

  const requirements = {
    scheme: 'exact',
    network: expected.network ?? payload.network,
    maxAmountRequired: expected.amount,
    amount: expected.amount,
    payTo: expected.payTo,
    asset: expected.asset ?? payload.payload.authorization.asset,
    resource: expected.resource,
  };
  const body = {
    x402Version: payload.x402Version,
    paymentPayload: payload,
    paymentRequirements: requirements,
    resource: expected.resource,
    expectedAmount: expected.amount,
  };
  const base = expected.facilitatorUrl.replace(/\/+$/, '');

  try {
    const verify = await postJson(`${base}/verify`, body);
    if (verify.status < 200 || verify.status >= 300 || verify.data?.isValid !== true) {
      return {
        ok: false,
        reason: verify.data?.invalidReason || 'Payment verification failed',
      };
    }

    const settle = await postJson(`${base}/settle`, body);
    if (settle.status < 200 || settle.status >= 300 || settle.data?.success !== true) {
      return {
        ok: false,
        reason: settle.data?.errorReason || 'Payment settlement failed',
      };
    }

    return {
      ok: true,
      payer: auth.from,
      amountPaid: auth.amount,
      transactionHash: settle.data.transaction ?? settle.data.transactionHash,
    };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? `Facilitator unavailable: ${error.message}` : 'Facilitator unavailable',
    };
  }
}
