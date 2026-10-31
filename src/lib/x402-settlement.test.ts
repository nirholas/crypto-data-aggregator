import { describe, it, expect, vi, afterEach } from 'vitest';
import { verifyAndSettlePayment } from './x402-settlement';

const PAY_TO = '0x1111111111111111111111111111111111111111';

function header(overrides: Record<string, unknown> = {}) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    x402Version: 2,
    scheme: 'exact',
    network: 'eip155:8453',
    payload: {
      signature: '0xdeadbeef',
      authorization: {
        from: '0x2222222222222222222222222222222222222222',
        to: PAY_TO,
        asset: '0x3333333333333333333333333333333333333333',
        amount: '1000',
        nonce: '0x01',
        validAfter: now - 10,
        validBefore: now + 300,
        ...overrides,
      },
    },
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

const expected = { amount: '1000', payTo: PAY_TO, resource: '/api/x', facilitatorUrl: 'https://f.example/' };

function reply(status: number, data: unknown) {
  return new Response(JSON.stringify(data), { status });
}

afterEach(() => vi.unstubAllGlobals());

describe('verifyAndSettlePayment', () => {
  it('accepts only after verify and settle both succeed', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(reply(200, { isValid: true }))
      .mockResolvedValueOnce(reply(200, { success: true, transaction: '0xabc' }));
    vi.stubGlobal('fetch', fetchMock);
    const result = await verifyAndSettlePayment(header(), expected);
    expect(result).toMatchObject({ ok: true, transactionHash: '0xabc' });
    expect(fetchMock.mock.calls.map((c) => c[0])).toEqual([
      'https://f.example/verify',
      'https://f.example/settle',
    ]);
  });

  it('rejects when the facilitator is unavailable instead of trusting the signature', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('connect refused')));
    expect((await verifyAndSettlePayment(header(), expected)).ok).toBe(false);
  });

  it('rejects a 200 verify reply that says isValid false', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply(200, { isValid: false, invalidReason: 'bad sig' })));
    expect(await verifyAndSettlePayment(header(), expected)).toMatchObject({ ok: false, reason: 'bad sig' });
  });

  it('rejects when settlement fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(reply(200, { isValid: true }))
        .mockResolvedValueOnce(reply(200, { success: false, errorReason: 'nonce used' }))
    );
    expect(await verifyAndSettlePayment(header(), expected)).toMatchObject({ ok: false, reason: 'nonce used' });
  });

  it('rejects wrong recipient and short amounts without calling the facilitator', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect((await verifyAndSettlePayment(header({ to: '0x4444444444444444444444444444444444444444' }), expected)).ok).toBe(false);
    expect((await verifyAndSettlePayment(header({ amount: '1' }), expected)).ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
