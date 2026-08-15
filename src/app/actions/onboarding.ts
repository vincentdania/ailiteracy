"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth, updateSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createOrRefreshLearningPlan } from "@/lib/personalization/plan";

const schema = z.object({
  profession: z.string().min(2).max(120),
  industry: z.string().max(120).optional(),
  primaryGoal: z.string().min(12).max(500),
  timezone: z.string().min(1).max(80),
  country: z.string().min(2).max(80),
  skillLevel: z.enum(["BEGINNER", "EXPLORER", "PRACTITIONER"]),
  weeklyMinutes: z.coerce.number().int().min(70).max(420),
  learningFormat: z.enum(["PRACTICAL", "VISUAL", "READING", "MIXED"]),
});

export async function saveOnboardingAction(formData: FormData) {
  const session = await auth();
  if (!session?.user.id) redirect("/login");
  const parsed = schema.parse(Object.fromEntries(formData));
  const preferredTools = formData.getAll("preferredTools").map(String).filter(Boolean).slice(0, 8);
  await db.userProfile.upsert({
    where: { userId: session.user.id },
    update: { ...parsed, preferredTools, onboardingDone: false },
    create: { userId: session.user.id, ...parsed, preferredTools, onboardingDone: false },
  });
  const course = await db.course.findUniqueOrThrow({ where: { slug: "21-day-ai-challenge" }, select: { id: true } });
  await createOrRefreshLearningPlan(session.user.id, course.id, { ...parsed, preferredTools });
  await db.userProfile.update({ where: { userId: session.user.id }, data: { onboardingDone: true } });
  await updateSession({ user: { onboardingDone: true } });
  if (process.env.FREE_ENROLLMENT_ENABLED === "true") {
    await db.$transaction([
      db.enrollment.upsert({ where: { userId_courseId: { userId: session.user.id, courseId: course.id } }, update: { status: "ACTIVE" }, create: { userId: session.user.id, courseId: course.id } }),
      db.streak.upsert({ where: { userId: session.user.id }, update: {}, create: { userId: session.user.id } }),
    ]);
    redirect("/dashboard");
  }
  const enrollment = await db.enrollment.findFirst({ where: { userId: session.user.id, status: { in: ["ACTIVE", "COMPLETED"] } }, select: { id: true } });
  redirect(enrollment ? "/dashboard" : "/checkout");
}
