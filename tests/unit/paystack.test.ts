import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const processSuccessfulPayment = vi.fn();
vi.mock("@/lib/payments/process", () => ({ processSuccessfulPayment: (...args: unknown[]) => processSuccessfulPayment(...args) }));

const { initializePaystack, paystackUsdEnabled, recordPaystackCharge, verifyPaystackTransaction } = await import("@/lib/payments/paystack");

describe("Paystack payments", () => {
  beforeEach(() => {
    processSuccessfulPayment.mockReset();
    vi.stubEnv("PAYSTACK_SECRET_KEY", "sk_test_secret");
    vi.stubEnv("NEXTAUTH_URL", "https://learn.example.com");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("charges USD in cents and returns learners to the verify callback", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ status: true, data: { authorization_url: "https://checkout.paystack.com/abc", reference: "ref" } }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await initializePaystack({ email: "a@b.co", amount: 29, currency: "USD", userId: "u1", courseId: "c1" });
    expect(result.authorization_url).toBe("https://checkout.paystack.com/abc");
    const body = JSON.parse((fetchMock.mock.calls[0]?.[1] as RequestInit).body as string);
    expect(body).toMatchObject({ amount: 2900, currency: "USD", metadata: { userId: "u1", courseId: "c1" }, callback_url: "https://learn.example.com/api/payments/paystack/callback" });
  });

  it("surfaces Paystack's refusal, e.g. when USD is not enabled for the business", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ status: false, message: "Currency not supported by merchant" }, { status: 403 })));
    await expect(initializePaystack({ email: "a@b.co", amount: 29, currency: "USD", userId: "u1", courseId: "c1" })).rejects.toThrow("Currency not supported by merchant");
  });

  it("verifies a returning learner's reference with Paystack", async () => {
    const charge = { status: "success", reference: "ref/1", amount: 2900, currency: "USD", metadata: { userId: "u1", courseId: "c1" } };
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ status: true, data: charge }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await verifyPaystackTransaction("ref/1")).toEqual(charge);
    expect(fetchMock.mock.calls[0]?.[0]).toBe("https://api.paystack.co/transaction/verify/ref%2F1");
    fetchMock.mockResolvedValue(Response.json({ status: false, message: "Transaction reference not found" }, { status: 400 }));
    expect(await verifyPaystackTransaction("missing")).toBeNull();
  });

  it("records successful NGN and USD charges in major units", async () => {
    expect(await recordPaystackCharge({ status: "success", reference: "n1", amount: 2_000_000, currency: "NGN", metadata: { userId: "u1", courseId: "c1" } }, {})).toBe(true);
    expect(await recordPaystackCharge({ status: "success", reference: "d1", amount: 2900, currency: "USD", metadata: JSON.stringify({ userId: "u1", courseId: "c1" }) }, {})).toBe(true);
    expect(processSuccessfulPayment.mock.calls.map(([payment]) => [payment.currency, payment.amount])).toEqual([["NGN", 20000], ["USD", 29]]);
  });

  it("ignores failed charges, other currencies and charges without course metadata", async () => {
    expect(await recordPaystackCharge({ status: "failed", reference: "f", amount: 2900, currency: "USD", metadata: { userId: "u1", courseId: "c1" } }, {})).toBe(false);
    expect(await recordPaystackCharge({ status: "success", reference: "g", amount: 2900, currency: "GHS", metadata: { userId: "u1", courseId: "c1" } }, {})).toBe(false);
    expect(await recordPaystackCharge({ status: "success", reference: "h", amount: 2900, currency: "USD", metadata: null }, {})).toBe(false);
    expect(processSuccessfulPayment).not.toHaveBeenCalled();
  });

  it("offers USD only when it is switched on", () => {
    expect(paystackUsdEnabled({ PAYSTACK_SECRET_KEY: "sk" })).toBe(false);
    expect(paystackUsdEnabled({ PAYSTACK_SECRET_KEY: "sk", PAYSTACK_USD_ENABLED: "true" })).toBe(true);
    expect(paystackUsdEnabled({ PAYSTACK_USD_ENABLED: "true" })).toBe(false);
  });
});
