import { Currency, PaymentProvider } from "@prisma/client";
import { db } from "@/lib/db";
import { processSuccessfulPayment } from "@/lib/payments/process";

export type PaystackCharge = {
  status: string;
  reference: string;
  amount: number;
  // What we asked for at initialize. `amount` also includes Paystack fees when the customer bears them.
  requested_amount?: number;
  currency: string;
  paid_at?: string | null;
  metadata?: { userId?: string; courseId?: string } | string | null;
};

function secretKey() {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Paystack is not configured");
  return secret;
}

export async function initializePaystack(input: { email: string; amount: number; userId: string; courseId: string; productCode: string }) {
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { authorization: `Bearer ${secretKey()}`, "content-type": "application/json" },
    body: JSON.stringify({
      email: input.email,
      // Paystack takes the amount in the currency's subunit: kobo for NGN, cents for USD.
      amount: Math.round(input.amount * 100),
      currency: "NGN",
      metadata: { userId: input.userId, courseId: input.courseId, productCode: input.productCode },
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

// Only the signed webhook calls this after a server-to-server verification.
// A pending order is required; charge metadata alone cannot choose an enrollment.
export async function recordPaystackCharge(charge: PaystackCharge, rawPayload: unknown) {
  if (charge.status !== "success" || charge.currency !== "NGN" || !charge.reference) return false;
  const pending = await db.transaction.findUnique({ where: { referenceId: charge.reference } });
  if (!pending || pending.provider !== PaymentProvider.PAYSTACK) return false;
  const metadata = chargeMetadata(charge.metadata);
  if ((metadata.userId && metadata.userId !== pending.userId) || (metadata.courseId && metadata.courseId !== pending.courseId)) return false;
  const paidAt = charge.paid_at ? new Date(charge.paid_at) : new Date();
  if (Number.isNaN(paidAt.getTime())) return false;
  await processSuccessfulPayment({
    userId: pending.userId,
    courseId: pending.courseId,
    provider: PaymentProvider.PAYSTACK,
    referenceId: charge.reference,
    amount: (charge.requested_amount ?? charge.amount) / 100,
    currency: Currency.NGN,
    purchasedAt: paidAt,
    rawPayload,
  });
  return true;
}
