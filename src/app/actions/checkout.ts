"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { processSuccessfulPayment } from "@/lib/payments/process";
import { initializePaystack } from "@/lib/payments/paystack";
import { stripeClient } from "@/lib/payments/stripe";

export async function createCheckoutAction(formData: FormData) {
  const session = await auth();
  if (!session?.user.id || !session.user.email) redirect("/login?next=/checkout");
  const currency = formData.get("currency") === "USD" ? "USD" : "NGN";
  const course = await db.course.findUniqueOrThrow({ where: { slug: "21-day-ai-challenge" } });
  if (process.env.INTEGRATION_MODE === "mock" && process.env.ALLOW_MOCK_CHECKOUT === "true") {
    await processSuccessfulPayment({ userId: session.user.id, courseId: course.id, provider: currency === "USD" ? "STRIPE" : "PAYSTACK", referenceId: `mock-${randomUUID()}`, amount: Number(currency === "USD" ? course.priceUsd : course.priceNgn), currency, rawPayload: { mock: true } });
    redirect("/dashboard?checkout=success");
  }
  if (process.env.INTEGRATION_MODE === "mock") throw new Error("Checkout is not enabled");
  if (currency === "USD") {
    const checkout = await stripeClient().checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email,
      line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: Math.round(Number(course.priceUsd) * 100), product_data: { name: course.title } } }],
      metadata: { userId: session.user.id, courseId: course.id },
      payment_intent_data: { metadata: { userId: session.user.id, courseId: course.id } },
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?cancelled=1`,
    });
    if (!checkout.url) throw new Error("Stripe checkout did not return a URL");
    redirect(checkout.url);
  }
  const paystack = await initializePaystack({ email: session.user.email, amountNgn: Number(course.priceNgn), userId: session.user.id, courseId: course.id });
  redirect(paystack.data.authorization_url);
}
