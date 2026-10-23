"use server";

import { redirect } from "next/navigation";
import { Currency, PaymentProvider, TransactionStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { initializePaystack } from "@/lib/payments/paystack";
import { isTrackSlug } from "@/lib/tracks";

export async function createCheckoutAction(formData: FormData) {
  const session = await auth();
  if (!session?.user.id || !session.user.email) redirect("/login?next=/checkout");
  const courseSlug = String(formData.get("course") ?? "");
  if (!isTrackSlug(courseSlug)) redirect("/checkout");
  const course = await db.course.findUnique({ where: { slug: courseSlug } });
  if (!course?.isPublished || !course.paystackProductCode) redirect(`/checkout?course=${courseSlug}&payment=unavailable`);
  if (process.env.INTEGRATION_MODE === "mock" || !process.env.PAYSTACK_SECRET_KEY) redirect(`/checkout?course=${courseSlug}&payment=unavailable`);
  const amount = Number(course.priceNgn);
  let authorizationUrl: string;
  try {
    const result = await initializePaystack({ email: session.user.email, amount, userId: session.user.id, courseId: course.id, productCode: course.paystackProductCode });
    authorizationUrl = result.authorization_url;
    await db.transaction.create({ data: {
      userId: session.user.id,
      courseId: course.id,
      provider: PaymentProvider.PAYSTACK,
      referenceId: result.reference,
      amount,
      currency: Currency.NGN,
      status: TransactionStatus.PENDING,
    } });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    redirect(`/checkout?course=${courseSlug}&payment=unavailable`);
  }
  redirect(authorizationUrl);
}
