"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { accessExpiryFrom, hasActiveAccess } from "@/lib/access";
import { db } from "@/lib/db";

export async function activateFreeEnrollmentAction() {
  if (process.env.FREE_ENROLLMENT_ENABLED !== "true") redirect("/checkout");
  const session = await auth();
  if (!session?.user.id) redirect("/login?next=/checkout");
  const course = await db.course.findUniqueOrThrow({ where: { slug: "ai-for-your-work" }, select: { id: true } });
  const where = { userId_courseId: { userId: session.user.id, courseId: course.id } };
  const current = await db.enrollment.findUnique({ where, select: { status: true, enrolledAt: true, expiresAt: true, lifetimeAccess: true } });
  // Free access also lasts one access period; activating again after it ends starts a new one.
  const renew = !current || !hasActiveAccess(current);
  await db.$transaction([
    db.enrollment.upsert({
      where,
      update: { status: current?.status === "COMPLETED" ? "COMPLETED" : "ACTIVE", ...(renew ? { expiresAt: accessExpiryFrom(new Date()) } : {}) },
      create: { userId: session.user.id, courseId: course.id, expiresAt: accessExpiryFrom(new Date()) },
    }),
    db.streak.upsert({ where: { userId: session.user.id }, update: {}, create: { userId: session.user.id } }),
  ]);
  redirect("/dashboard");
}
