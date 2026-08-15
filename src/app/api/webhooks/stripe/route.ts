import { Currency, PaymentProvider } from "@prisma/client";
import type Stripe from "stripe";
import { verifyStripeEvent } from "@/lib/payments/stripe";
import { processSuccessfulPayment } from "@/lib/payments/process";

export async function POST(request: Request) {
  const payload = await request.text();
  let event: Stripe.Event;
  try { event = verifyStripeEvent(payload, request.headers.get("stripe-signature")); }
  catch { return Response.json({ error: "Invalid signature" }, { status: 400 }); }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, courseId } = session.metadata ?? {};
    if (session.payment_status === "paid" && session.currency === "usd" && userId && courseId) await processSuccessfulPayment({ userId, courseId, provider: PaymentProvider.STRIPE, referenceId: String(session.payment_intent ?? session.id), amount: (session.amount_total ?? 0) / 100, currency: Currency.USD, rawPayload: event as unknown as object });
  }
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const { userId, courseId } = intent.metadata;
    if (intent.currency === "usd" && userId && courseId) await processSuccessfulPayment({ userId, courseId, provider: PaymentProvider.STRIPE, referenceId: intent.id, amount: intent.amount_received / 100, currency: Currency.USD, rawPayload: event as unknown as object });
  }
  return Response.json({ received: true });
}
