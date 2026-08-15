"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function activateFreeEnrollmentAction() {
  if (process.env.FREE_ENROLLMENT_ENABLED !== "true") redirect("/checkout");
  const session = await auth();
  if (!session?.user.id) redirect("/login?next=/checkout");
  const course = await db.course.findUniqueOrThrow({ where: { slug: "21-day-ai-challenge" }, select: { id: true } });
  await db.$transaction([
    db.enrollment.upsert({
      where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
      update: { status: "ACTIVE" },
      create: { userId: session.user.id, courseId: course.id },
    }),
    db.streak.upsert({ where: { userId: session.user.id }, update: {}, create: { userId: session.user.id } }),
  ]);
  redirect("/dashboard");
}
