"use server";

import { revalidatePath } from "next/cache";
import { ACCESS_ENDED_MESSAGE, hasActiveAccess } from "@/lib/access";
import { auth } from "@/lib/auth";
import { certificateHash } from "@/lib/certificates";
import { db } from "@/lib/db";
import { isTrackSlug } from "@/lib/tracks";

export async function completeLessonAction(lessonId: string) {
  const session = await auth();
  if (!session?.user.id) return { ok: false, message: "Sign in required." };
  const lesson = await db.lesson.findUnique({ where: { id: lessonId }, include: { module: { include: { course: true } } } });
  if (!lesson || !isTrackSlug(lesson.module.course.slug)) return { ok: false, message: "Lesson not found." };

  const result = await db.$transaction(async (tx) => {
    // Lock this one learner/track row so two tabs cannot lose a completion.
    await tx.$queryRaw`SELECT id FROM "Enrollment" WHERE "userId" = ${session.user.id} AND "courseId" = ${lesson.module.courseId} FOR UPDATE`;
    const enrollment = await tx.enrollment.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId: lesson.module.courseId } } });
    if (!enrollment) return { ok: false, message: "Enrol in this track to continue." };
    if (!hasActiveAccess(enrollment)) return { ok: false, message: ACCESS_ENDED_MESSAGE };
    if (enrollment.completedDays.includes(lesson.dayNumber)) return { ok: true, message: "Lesson already complete.", completed: enrollment.completedDays.length };

    const completedDays = [...enrollment.completedDays, lesson.dayNumber].sort((a, b) => a - b);
    const lessonCount = await tx.lesson.count({ where: { module: { courseId: lesson.module.courseId }, isBonus: false } });
    const courseComplete = completedDays.length === lessonCount;
    const now = new Date();
    await tx.enrollment.update({ where: { id: enrollment.id }, data: {
      completedDays,
      ...(courseComplete ? { status: "COMPLETED", completedAt: now } : {}),
    } });
    if (courseComplete) await tx.certificate.upsert({
      where: { userId_courseId: { userId: session.user.id, courseId: lesson.module.courseId } },
      update: {},
      create: { userId: session.user.id, courseId: lesson.module.courseId, uniqueHash: certificateHash(session.user.id, lesson.module.courseId, now) },
    });
    return { ok: true, message: courseComplete ? "Track complete. Your certificate is ready." : "Lesson complete.", completed: completedDays.length };
  });
  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath("/challenge");
    revalidatePath("/certificates");
  }
  return result;
}
