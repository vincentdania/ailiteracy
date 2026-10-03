"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isCapstoneLesson } from "@/lib/challenge";
import { assessSubmission } from "@/lib/submission-assessment";

const schema = z.object({
  lessonId: z.string().min(1),
  title: z.string().min(3).max(140),
  content: z.string().min(60, "Add enough detail to show what you made and how you checked it.").max(8_000),
  artifactUrl: z.union([z.literal(""), z.string().url()]).optional(),
});

export async function submitPracticeAction(_: { ok: boolean; message: string; score?: number }, formData: FormData) {
  const session = await auth();
  if (!session?.user.id) return { ok: false, message: "Sign in required." };
  const result = schema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { ok: false, message: result.error.issues[0]?.message ?? "Check your submission." };
  const lesson = await db.lesson.findUnique({ where: { id: result.data.lessonId }, include: { module: true } });
  if (!lesson) return { ok: false, message: "Lesson not found." };
  const enrollment = await db.enrollment.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId: lesson.module.courseId } } });
  if (!enrollment) return { ok: false, message: "Enrollment required." };
  const isCapstone = isCapstoneLesson(lesson);
  const assessment = assessSubmission(result.data.content, isCapstone);
  await db.$transaction([
    db.projectSubmission.upsert({
      where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
      update: { title: result.data.title, content: result.data.content, artifactUrl: result.data.artifactUrl || null, status: "REVIEWED", score: assessment.score, aiFeedback: assessment.feedback, reviewedAt: new Date(), submittedAt: new Date() },
      create: { userId: session.user.id, lessonId: lesson.id, title: result.data.title, content: result.data.content, artifactUrl: result.data.artifactUrl || null, status: "REVIEWED", score: assessment.score, aiFeedback: assessment.feedback, reviewedAt: new Date() },
    }),
    ...(isCapstone ? [db.enrollment.update({ where: { id: enrollment.id }, data: { capstonePassed: assessment.score >= 70, assessmentScore: assessment.score } })] : []),
  ]);
  revalidatePath(`/challenge/${lesson.slug}`);
  revalidatePath("/dashboard");
  return { ok: true, message: assessment.feedback.summary, score: assessment.score };
}
