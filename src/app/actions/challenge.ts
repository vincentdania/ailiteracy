"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccessLesson, nextStreak, unlockedDay } from "@/lib/challenge";
import { certificateHash } from "@/lib/certificates";
import { cache } from "@/lib/redis";

export async function completeLessonAction(lessonId: string) {
  const session = await auth();
  if (!session?.user.id) return { ok: false, message: "Sign in required." };
  const lesson = await db.lesson.findUnique({ where: { id: lessonId }, include: { module: true } });
  if (!lesson) return { ok: false, message: "Lesson not found." };
  const enrollment = await db.enrollment.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId: lesson.module.courseId } }, include: { user: { include: { profile: true, streak: true } } } });
  if (!enrollment) return { ok: false, message: "Enrollment required." };
  const timezone = enrollment.user.profile?.timezone ?? "Africa/Lagos";
  const availableDay = unlockedDay(enrollment.enrolledAt, new Date(), timezone, enrollment.previewOverride);
  if (!canAccessLesson({ dayNumber: lesson.dayNumber, isBonus: lesson.isBonus, bonusUnlocked: enrollment.bonusUnlocked, unlockedDay: availableDay })) return { ok: false, message: "This lesson is still locked." };
  if (lesson.dayNumber === 21) {
    const capstone = await db.projectSubmission.findUnique({ where: { userId_lessonId: { userId: session.user.id, lessonId } }, select: { score: true } });
    if (!capstone?.score || capstone.score < 70) return { ok: false, message: "Submit a capstone scoring at least 70 before completing Day 21." };
  }
  if (enrollment.completedDays.includes(lesson.dayNumber)) return { ok: true, message: "Already complete.", completed: enrollment.completedDays.length };
  const completedDays = [...enrollment.completedDays, lesson.dayNumber].sort((a, b) => a - b);
  const now = new Date();
  const streak = nextStreak({ current: enrollment.user.streak?.currentStreak ?? 0, longest: enrollment.user.streak?.longestStreak ?? 0, lastActive: enrollment.user.streak?.lastActiveDate ?? null, now, timezone, freezeAvailable: enrollment.user.streak?.freezeAvailable ?? true });
  await db.$transaction(async (tx) => {
    await tx.enrollment.update({
      where: { id: enrollment.id },
      data: { completedDays, unlockedDay: Math.max(enrollment.unlockedDay, availableDay), ...(completedDays.filter((day) => day <= 21).length === 21 ? { status: "COMPLETED", completedAt: now, capstonePassed: true } : {}) },
    });
    await tx.streak.upsert({ where: { userId: session.user.id }, update: { currentStreak: streak.current, longestStreak: streak.longest, lastActiveDate: now, freezeAvailable: streak.freezeAvailable }, create: { userId: session.user.id, currentStreak: streak.current, longestStreak: streak.longest, lastActiveDate: now, freezeAvailable: streak.freezeAvailable } });
    if (completedDays.filter((day) => day <= 21).length === 21) {
      await tx.certificate.upsert({
        where: { userId_courseId: { userId: session.user.id, courseId: lesson.module.courseId } },
        update: {},
        create: { userId: session.user.id, courseId: lesson.module.courseId, uniqueHash: certificateHash(session.user.id, lesson.module.courseId, now) },
      });
    }
  });
  await cache().set(`activity:${session.user.id}:${now.toISOString().slice(0, 10)}`, "1", 60 * 60 * 48);
  revalidatePath("/dashboard");
  revalidatePath("/challenge");
  return { ok: true, message: "Lesson complete!", completed: completedDays.length, streak: streak.current };
}
