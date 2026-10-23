import { Currency, PaymentProvider, TransactionStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { isTrackSlug } from "@/lib/tracks";
import { accessExpiryFrom } from "@/lib/access";
import { captureServerEvent } from "@/lib/analytics";

export type SuccessfulPayment = {
  userId: string;
  courseId: string;
  provider: PaymentProvider;
  referenceId: string;
  amount: number;
  currency: Currency;
  rawPayload: unknown;
  purchasedAt: Date;
};

export async function processSuccessfulPayment(payment: SuccessfulPayment) {
  const [user, course] = await Promise.all([
    db.user.findUnique({ where: { id: payment.userId }, select: { id: true } }),
    db.course.findUnique({ where: { id: payment.courseId }, select: { slug: true, priceNgn: true, isPublished: true } }),
  ]);
  if (!user || !course?.isPublished || !isTrackSlug(course.slug) || payment.currency !== Currency.NGN || payment.provider !== PaymentProvider.PAYSTACK) throw new Error("Payment references an invalid user or course");
  const expectedAmount = Number(course.priceNgn);
  if (Math.abs(payment.amount - expectedAmount) > 0.001) throw new Error("Payment amount does not match the course price");
  const result = await db.$transaction(async (tx) => {
    const existing = await tx.transaction.findUnique({ where: { referenceId: payment.referenceId } });
    if (!existing || existing.userId !== payment.userId || existing.courseId !== payment.courseId ||
        existing.provider !== payment.provider || existing.currency !== payment.currency ||
        Number(existing.amount) !== payment.amount) throw new Error("Payment does not match a pending order");
    if (existing.status === TransactionStatus.SUCCESS) return { created: false, enrollmentId: undefined };
    // The conditional update serialises duplicate or concurrent webhooks for the
    // same reference. Only the request that changes PENDING to SUCCESS renews access.
    const claimed = await tx.transaction.updateMany({
      where: { referenceId: payment.referenceId, status: TransactionStatus.PENDING },
      data: { status: TransactionStatus.SUCCESS, rawPayload: payment.rawPayload as object, processedAt: new Date() },
    });
    if (claimed.count !== 1) return { created: false, enrollmentId: undefined };
    const where = { userId_courseId: { userId: payment.userId, courseId: payment.courseId } };
    const current = await tx.enrollment.findUnique({ where, select: { status: true } });
    const expiresAt = accessExpiryFrom(payment.purchasedAt);
    const enrollment = current
      ? await tx.enrollment.update({ where, data: { status: current.status === "COMPLETED" ? "COMPLETED" : "ACTIVE", purchasedAt: payment.purchasedAt, expiresAt } })
      : await tx.enrollment.create({ data: { userId: payment.userId, courseId: payment.courseId, purchasedAt: payment.purchasedAt, expiresAt } });
    await tx.streak.upsert({ where: { userId: payment.userId }, update: {}, create: { userId: payment.userId } });

    return { created: true, enrollmentId: enrollment.id };
  });
  if (result.created) await captureServerEvent({ name: "payment_succeeded", distinctId: payment.userId, properties: { provider: payment.provider, currency: payment.currency, amount: payment.amount } });
  return result;
}
