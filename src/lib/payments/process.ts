import { Currency, PaymentProvider, TransactionStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { captureServerEvent } from "@/lib/analytics";

export type SuccessfulPayment = {
  userId: string;
  courseId: string;
  provider: PaymentProvider;
  referenceId: string;
  amount: number;
  currency: Currency;
  rawPayload: unknown;
};

export async function processSuccessfulPayment(payment: SuccessfulPayment) {
  const [user, course] = await Promise.all([
    db.user.findUnique({ where: { id: payment.userId }, select: { id: true } }),
    db.course.findUnique({ where: { id: payment.courseId }, select: { priceNgn: true, priceUsd: true, isPublished: true } }),
  ]);
  if (!user || !course?.isPublished) throw new Error("Payment references an invalid user or course");
  const expectedAmount = Number(payment.currency === Currency.NGN ? course.priceNgn : course.priceUsd);
  if (Math.abs(payment.amount - expectedAmount) > 0.001) throw new Error("Payment amount does not match the course price");
  const result = await db.$transaction(async (tx) => {
    const existing = await tx.transaction.findUnique({ where: { referenceId: payment.referenceId } });
    if (existing?.status === TransactionStatus.SUCCESS) return { created: false, enrollmentId: undefined };
    await tx.transaction.upsert({
      where: { referenceId: payment.referenceId },
      update: { status: TransactionStatus.SUCCESS, rawPayload: payment.rawPayload as object, processedAt: new Date() },
      create: {
        userId: payment.userId,
        courseId: payment.courseId,
        provider: payment.provider,
        referenceId: payment.referenceId,
        amount: payment.amount,
        currency: payment.currency,
        status: TransactionStatus.SUCCESS,
        rawPayload: payment.rawPayload as object,
        processedAt: new Date(),
      },
    });
    const enrollment = await tx.enrollment.upsert({
      where: { userId_courseId: { userId: payment.userId, courseId: payment.courseId } },
      update: { status: "ACTIVE" },
      create: { userId: payment.userId, courseId: payment.courseId },
    });
    await tx.streak.upsert({ where: { userId: payment.userId }, update: {}, create: { userId: payment.userId } });

    const referral = await tx.referral.findUnique({ where: { referredUserId: payment.userId } });
    if (referral && !referral.rewardGranted) {
      await tx.referral.update({ where: { id: referral.id }, data: { rewardGranted: true } });
      await tx.enrollment.updateMany({
        where: { courseId: payment.courseId, userId: { in: [referral.referrerId, payment.userId] } },
        data: { bonusUnlocked: true },
      });
    }
    return { created: true, enrollmentId: enrollment.id };
  });
  if (result.created) await captureServerEvent({ name: "payment_succeeded", distinctId: payment.userId, properties: { provider: payment.provider, currency: payment.currency, amount: payment.amount } });
  return result;
}
