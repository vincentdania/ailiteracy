"use server";

import { revalidatePath } from "next/cache";
import { ACCESS_ENDED_MESSAGE, hasActiveAccess } from "@/lib/access";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccessLesson, unlockedDay } from "@/lib/challenge";
import { parseQuiz, quizPassed } from "@/lib/learning/activities";
import { syncAchievements, type Celebration } from "@/lib/learning/progress";

export type QuizResult =
  | { ok: false; error: string }
  | { ok: true; score: number; total: number; best: number; passed: boolean; perQuestion: { correct: boolean; explanation: string | null }[]; celebration: Celebration };

export async function gradeQuizAction(lessonId: string, answers: number[]): Promise<QuizResult> {
  const session = await auth();
  if (!session?.user.id) return { ok: false, error: "Sign in required." };
  const userId = session.user.id;

  const lesson = await db.lesson.findUnique({ where: { id: lessonId }, include: { module: true } });
  const questions = parseQuiz(lesson?.quizJson);
  if (!lesson || !questions) return { ok: false, error: "This lesson has no knowledge check." };
  const enrollment = await db.enrollment.findUnique({ where: { userId_courseId: { userId, courseId: lesson.module.courseId } }, include: { user: { include: { profile: true } } } });
  if (!enrollment) return { ok: false, error: "Enrolment required. Enrol in the course to continue." };
  if (!hasActiveAccess(enrollment, new Date(), enrollment.user.role)) return { ok: false, error: ACCESS_ENDED_MESSAGE };
  const total = await db.lesson.count({ where: { module: { courseId: lesson.module.courseId }, isBonus: false } });
  const available = unlockedDay(enrollment.enrolledAt, new Date(), enrollment.user.profile?.timezone ?? "Africa/Lagos", enrollment.previewOverride, total);
  if (!canAccessLesson({ dayNumber: lesson.dayNumber, isBonus: lesson.isBonus, bonusUnlocked: enrollment.bonusUnlocked, unlockedDay: available })) return { ok: false, error: "This lesson is still locked." };
  if (answers.length !== questions.length || answers.some((a) => !Number.isInteger(a))) return { ok: false, error: "Answer every question first." };

  const score = questions.reduce((sum, question, i) => sum + (answers[i] === question.answer ? 1 : 0), 0);
  const passed = quizPassed(score, questions.length);
  const previous = await db.quizAttempt.findUnique({ where: { userId_lessonId: { userId, lessonId } } });
  // Keep the best score: retaking a check can only ever help.
  const best = Math.max(score, previous?.score ?? 0);
  await db.quizAttempt.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { score: best, total: questions.length, lastScore: score, attemptCount: { increment: 1 }, ...(score >= best ? { answers } : {}), ...(passed && !previous?.passedAt ? { passedAt: new Date() } : {}) },
    create: { userId, lessonId, score, total: questions.length, lastScore: score, answers, attemptCount: 1, passedAt: passed ? new Date() : null },
  });

  const celebration = await syncAchievements(userId);
  revalidatePath(`/challenge/${lesson.slug}`);
  revalidatePath("/dashboard");
  return {
    ok: true,
    score,
    total: questions.length,
    best,
    passed,
    // Explanations for missed questions arrive from the second attempt, after a first try on your own.
    perQuestion: questions.map((question, i) => ({ correct: answers[i] === question.answer, explanation: answers[i] === question.answer || (previous?.attemptCount ?? 0) >= 1 ? question.explanation : null })),
    celebration,
  };
}
