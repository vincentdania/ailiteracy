"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccessLesson, unlockedDay } from "@/lib/challenge";
import { ADVANCED_KEY, findMission, gradeMission, parseActivities, parseQuiz, type MissionAnswer, type MissionResult } from "@/lib/learning/activities";
import { advancedUnlocked } from "@/lib/learning/mastery";
import { syncAchievements, type Celebration } from "@/lib/learning/progress";

export type MissionActionResult = { ok: false; error: string } | ({ ok: true; attempts: number; celebration: Celebration | null } & MissionResult);

function validAnswer(answer: unknown): answer is MissionAnswer {
  if (typeof answer === "string") return answer.length <= 64;
  if (Array.isArray(answer)) return answer.length <= 20 && answer.every((a) => typeof a === "string" && a.length <= 64);
  if (answer && typeof answer === "object") return Object.keys(answer).length <= 20 && Object.values(answer).every((v) => Number.isInteger(v));
  return false;
}

export async function attemptMissionAction(lessonId: string, missionKey: string, answer: unknown): Promise<MissionActionResult> {
  const session = await auth();
  if (!session?.user.id) return { ok: false, error: "Sign in required." };
  const userId = session.user.id;
  if (!validAnswer(answer)) return { ok: false, error: "That answer could not be read. Try again." };

  const lesson = await db.lesson.findUnique({ where: { id: lessonId }, include: { module: true } });
  const activities = parseActivities(lesson?.activitiesJson);
  const mission = activities ? findMission(activities, missionKey) : undefined;
  if (!lesson || !mission) return { ok: false, error: "Mission not found." };

  const enrollment = await db.enrollment.findUnique({ where: { userId_courseId: { userId, courseId: lesson.module.courseId } }, include: { user: { include: { profile: true } } } });
  if (!enrollment) return { ok: false, error: "Enrolment required. Enrol in the course to continue." };
  const total = await db.lesson.count({ where: { module: { courseId: lesson.module.courseId }, isBonus: false } });
  const available = unlockedDay(enrollment.enrolledAt, new Date(), enrollment.user.profile?.timezone ?? "Africa/Lagos", enrollment.previewOverride, total);
  if (!canAccessLesson({ dayNumber: lesson.dayNumber, isBonus: lesson.isBonus, bonusUnlocked: enrollment.bonusUnlocked, unlockedDay: available })) return { ok: false, error: "This lesson is still locked." };

  const existing = await db.activityAttempt.findUnique({ where: { userId_lessonId_activityKey: { userId, lessonId, activityKey: missionKey } } });

  if (missionKey === ADVANCED_KEY && !existing) {
    const [attempts, quizAttempt] = await Promise.all([
      db.activityAttempt.findMany({ where: { userId, lessonId } }),
      db.quizAttempt.findUnique({ where: { userId_lessonId: { userId, lessonId } } }),
    ]);
    const quiz = parseQuiz(lesson.quizJson);
    const firstTry = activities!.missions.every((m) => attempts.some((a) => a.activityKey === m.key && a.solved && a.attempts === 1));
    if (!advancedUnlocked({ quizPerfect: !!quiz && quizAttempt?.score === quiz.length, missionsFirstTry: firstTry })) return { ok: false, error: "Advanced missions open once you score full marks on this lesson's knowledge check or solve all its missions on the first try." };
  }

  // Replaying a solved mission is welcome practice, but it never changes the record.
  const attemptNumber = existing?.solved ? existing.attempts : (existing?.attempts ?? 0) + 1;
  const result = gradeMission(lessonId, mission, answer, existing?.solved ? 1 : attemptNumber);
  if (existing?.solved) return { ok: true, attempts: existing.attempts, celebration: null, ...result, hint: result.correct ? undefined : result.hint };

  await db.activityAttempt.upsert({
    where: { userId_lessonId_activityKey: { userId, lessonId, activityKey: missionKey } },
    update: { attempts: attemptNumber, lastAnswer: answer, ...(result.correct ? { solved: true, solvedAt: new Date() } : {}) },
    create: { userId, lessonId, activityKey: missionKey, attempts: attemptNumber, lastAnswer: answer, solved: result.correct, solvedAt: result.correct ? new Date() : null },
  });

  const celebration = result.correct ? await syncAchievements(userId) : null;
  revalidatePath(`/challenge/${lesson.slug}`);
  return { ok: true, attempts: attemptNumber, celebration, ...result };
}
