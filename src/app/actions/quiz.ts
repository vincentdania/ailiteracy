"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type QuizQuestion = { q: string; options: string[]; answer: number; explanation: string };

export async function gradeQuizAction(formData: FormData) {
  const session = await auth();
  if (!session?.user.id) redirect("/login");

  const lessonId = String(formData.get("lessonId") ?? "");
  const lesson = await db.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson?.quizJson || !Array.isArray(lesson.quizJson)) return { ok: false as const, error: "This lesson has no quiz." };

  const questions = lesson.quizJson as QuizQuestion[];
  const answers: number[] = [];
  for (let i = 0; i < questions.length; i++) {
    const raw = formData.get(`q${i}`);
    const value = raw === null ? -1 : Number(raw);
    answers.push(Number.isInteger(value) ? value : -1);
  }

  const score = questions.reduce((sum, question, i) => sum + (answers[i] === question.answer ? 1 : 0), 0);

  await db.quizAttempt.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    update: { score, total: questions.length, answers: JSON.parse(JSON.stringify(answers)) },
    create: { userId: session.user.id, lessonId, score, total: questions.length, answers: JSON.parse(JSON.stringify(answers)) },
  });

  revalidatePath(`/challenge/${lesson.slug}`);
  return {
    ok: true as const,
    score,
    total: questions.length,
    perQuestion: questions.map((question, i) => ({
      correct: (answers[i] ?? -1) === question.answer,
      chosen: answers[i] ?? -1,
      answer: question.answer,
      explanation: question.explanation,
    })),
  };
}
