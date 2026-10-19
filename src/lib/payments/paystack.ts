import { Currency, PaymentProvider } from "@prisma/client";
import { processSuccessfulPayment } from "@/lib/payments/process";

export type PaystackCurrency = "NGN" | "USD";

export type PaystackCharge = {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  metadata?: { userId?: string; courseId?: string } | string | null;
};

// USD needs international payments and a USD settlement account approved on the Paystack dashboard.
export function paystackUsdEnabled(environment: Record<string, string | undefined> = process.env) {
  return Boolean(environment.PAYSTACK_SECRET_KEY) && environment.PAYSTACK_USD_ENABLED === "true";
}

function secretKey() {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Paystack is not configured");
  return secret;
}

export async function initializePaystack(input: { email: string; amount: number; currency: PaystackCurrency; userId: string; courseId: string }) {
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { authorization: `Bearer ${secretKey()}`, "content-type": "application/json" },
    body: JSON.stringify({
      email: input.email,
      // Paystack takes the amount in the currency's subunit: kobo for NGN, cents for USD.
      amount: Math.round(input.amount * 100),
      currency: input.currency,
      metadata: { userId: input.userId, courseId: input.courseId },
      callback_url: `${process.env.NEXTAUTH_URL}/api/payments/paystack/callback`,
    }),
  });
  const body = (await response.json().catch(() => null)) as { status?: boolean; message?: string; data?: { authorization_url: string; reference: string } } | null;
  if (!response.ok || !body?.status || !body.data?.authorization_url) throw new Error(`Unable to initialize Paystack checkout: ${body?.message ?? response.status}`);
  return body.data;
}

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { authorization: `Bearer ${secretKey()}` },
    cache: "no-store",
  });
  const body = (await response.json().catch(() => null)) as { status?: boolean; data?: PaystackCharge } | null;
  if (!response.ok || !body?.status || !body.data) return null;
  return body.data;
}

function chargeMetadata(metadata: PaystackCharge["metadata"]) {
  if (!metadata) return {};
  if (typeof metadata === "string") {
    try { return JSON.parse(metadata) as { userId?: string; courseId?: string }; }
    catch { return {}; }
  }
  return metadata;
}

// Turns a successful Paystack charge (from the webhook or a verify call) into a recorded payment and enrollment.
// Returns false when the charge is not a successful course payment.
export async function recordPaystackCharge(charge: PaystackCharge, rawPayload: unknown) {
  const { userId, courseId } = chargeMetadata(charge.metadata);
  const currency = charge.currency === "NGN" ? Currency.NGN : charge.currency === "USD" ? Currency.USD : null;
  if (charge.status !== "success" || !currency || !userId || !courseId) return false;
  await processSuccessfulPayment({ userId, courseId, provider: PaymentProvider.PAYSTACK, referenceId: charge.reference, amount: charge.amount / 100, currency, rawPayload });
  return true;
}
