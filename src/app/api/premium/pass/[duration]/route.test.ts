import { describe, it, expect, vi, afterEach } from 'vitest';

const createPass = vi.fn();
vi.mock('@/lib/x402/passes', async (orig) => ({
  ...(await orig<typeof import('@/lib/x402/passes')>()),
  createPass: (...args: unknown[]) => createPass(...args),
  getActivePass: vi.fn().mockResolvedValue(null),
}));

import { NextRequest } from 'next/server';
import { PAYMENT_ADDRESS } from '@/lib/x402/config';
import { PASS_CONFIG } from '@/lib/x402/passes';
import { POST } from './route';

function paidRequest() {
  const now = Math.floor(Date.now() / 1000);
  const payment = {
    x402Version: 2,
    scheme: 'exact',
    network: 'eip155:84532',
    payload: {
      signature: '0xabc',
      authorization: {
        from: '0x2222222222222222222222222222222222222222',
        to: PAYMENT_ADDRESS,
        asset: '0x3333333333333333333333333333333333333333',
        amount: String(PASS_CONFIG.hour.priceUsdc),
        nonce: '0x01',
        validAfter: now - 10,
        validBefore: now + 300,
      },
    },
  };
  return new NextRequest('http://localhost/api/premium/pass/hour', {
    method: 'POST',
    headers: { 'X-Payment': Buffer.from(JSON.stringify(payment)).toString('base64') },
  });
}

afterEach(() => {
  createPass.mockReset();
  vi.unstubAllGlobals();
});

describe('POST /api/premium/pass/[duration]', () => {
  it('does not grant a pass when the facilitator cannot verify and settle the payment', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));
    const res = await POST(paidRequest(), { params: Promise.resolve({ duration: 'hour' }) });
    expect(res.status).toBe(402);
    expect(createPass).not.toHaveBeenCalled();
  });
});
