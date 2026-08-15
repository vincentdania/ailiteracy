"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const schema = z.object({
  lessonId: z.string().min(1),
  title: z.string().min(3).max(140),
  content: z.string().min(80, "Add enough detail to show what you made and how you checked it.").max(8_000),
  artifactUrl: z.union([z.literal(""), z.string().url()]).optional(),
});

function assessSubmission(content: string, isCapstone: boolean) {
  const lower = content.toLowerCase();
  const evidence = /check|verif|source|evidence|test/.test(lower);
  const humanJudgment = /i changed|i chose|my decision|human|review/.test(lower);
  const outcome = /result|outcome|improv|save|measure|impact/.test(lower);
  const safeguards = /privacy|consent|bias|risk|confidential|safe/.test(lower);
  const specificity = content.trim().split(/\s+/).length >= (isCapstone ? 140 : 45);
  const checks = [evidence, humanJudgment, outcome, safeguards, specificity];
  const score = 50 + checks.filter(Boolean).length * 10;
  const nextSteps = [
    !evidence && "Add how you checked important claims, calculations or sources.",
    !humanJudgment && "Explain one decision or improvement that came from you, not the tool.",
    !outcome && "Name the result this artefact should improve and how you will measure it.",
    !safeguards && "Identify one privacy, bias or failure risk and how you will handle it.",
    !specificity && `Add a little more working detail${isCapstone ? " to make the capstone auditable" : ""}.`,
  ].filter(Boolean);
  return {
    score,
    feedback: {
      summary: score >= 80 ? "Strong evidence of applied learning." : score >= 70 ? "A useful submission with one clear improvement to make." : "The foundation is here; strengthen the evidence before treating it as complete.",
      nextSteps,
      rubric: { evidence, humanJudgment, outcome, safeguards, specificity },
      source: "curated-rubric-v1",
    },
  };
}

export async function submitPracticeAction(_: { ok: boolean; message: string; score?: number }, formData: FormData) {
  const session = await auth();
  if (!session?.user.id) return { ok: false, message: "Sign in required." };
  const result = schema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { ok: false, message: result.error.issues[0]?.message ?? "Check your submission." };
  const lesson = await db.lesson.findUnique({ where: { id: result.data.lessonId }, include: { module: true } });
  if (!lesson) return { ok: false, message: "Lesson not found." };
  const enrollment = await db.enrollment.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId: lesson.module.courseId } } });
  if (!enrollment) return { ok: false, message: "Enrollment required." };
  const assessment = assessSubmission(result.data.content, lesson.dayNumber === 21);
  await db.$transaction([
    db.projectSubmission.upsert({
      where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
      update: { title: result.data.title, content: result.data.content, artifactUrl: result.data.artifactUrl || null, status: "REVIEWED", score: assessment.score, aiFeedback: assessment.feedback, reviewedAt: new Date(), submittedAt: new Date() },
      create: { userId: session.user.id, lessonId: lesson.id, title: result.data.title, content: result.data.content, artifactUrl: result.data.artifactUrl || null, status: "REVIEWED", score: assessment.score, aiFeedback: assessment.feedback, reviewedAt: new Date() },
    }),
    ...(lesson.dayNumber === 21 ? [db.enrollment.update({ where: { id: enrollment.id }, data: { capstonePassed: assessment.score >= 70, assessmentScore: assessment.score } })] : []),
  ]);
  revalidatePath(`/challenge/${lesson.slug}`);
  revalidatePath("/dashboard");
  return { ok: true, message: assessment.feedback.summary, score: assessment.score };
}
