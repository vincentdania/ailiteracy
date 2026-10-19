"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { processSuccessfulPayment } from "@/lib/payments/process";
import { initializePaystack, paystackUsdEnabled } from "@/lib/payments/paystack";

export async function createCheckoutAction(formData: FormData) {
  const session = await auth();
  if (!session?.user.id || !session.user.email) redirect("/login?next=/checkout");
  const currency = formData.get("currency") === "USD" ? "USD" : "NGN";
  const courseSlug = (formData.get("course") as string) || "ai-for-your-work";
  const course = await db.course.findUniqueOrThrow({ where: { slug: courseSlug } });
  const amount = Number(currency === "USD" ? course.priceUsd : course.priceNgn);
  if (process.env.INTEGRATION_MODE === "mock" && process.env.ALLOW_MOCK_CHECKOUT === "true") {
    await processSuccessfulPayment({ userId: session.user.id, courseId: course.id, provider: "PAYSTACK", referenceId: `mock-${randomUUID()}`, amount, currency, rawPayload: { mock: true } });
    redirect("/dashboard?checkout=success");
  }
  if (process.env.INTEGRATION_MODE === "mock") throw new Error("Checkout is not enabled");
  if (currency === "USD" && !paystackUsdEnabled()) redirect("/checkout?payment=unavailable");
  let authorizationUrl: string;
  try {
    ({ authorization_url: authorizationUrl } = await initializePaystack({ email: session.user.email, amount, currency, userId: session.user.id, courseId: course.id }));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    redirect("/checkout?payment=unavailable");
  }
  redirect(authorizationUrl);
}
