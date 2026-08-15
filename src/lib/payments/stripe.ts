import Stripe from "stripe";

export function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured");
  return new Stripe(key);
}

export function verifyStripeEvent(payload: string, signature: string | null) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) throw new Error("Stripe webhook is not configured");
  return stripeClient().webhooks.constructEvent(payload, signature, secret);
}
