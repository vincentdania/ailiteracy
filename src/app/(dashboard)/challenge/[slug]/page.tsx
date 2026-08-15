import Link from "next/link";
import { ArrowLeft, Check, Clock3, ExternalLink, Lightbulb, LockKeyhole, MapPin, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccessLesson, unlockedDay } from "@/lib/challenge";
import { getCaseStudy } from "@/lib/personalization/case-studies";
import { CompleteButton } from "@/components/challenge/complete-button";
import { PracticeSubmission } from "@/components/challenge/practice-submission";
import { LessonQuiz } from "@/components/challenge/lesson-quiz";

export const dynamic = "force-dynamic";

type QuizQuestion = { q: string; options: string[]; answer: number; explanation: string };

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  const { slug } = await params;
  const lesson = await db.lesson.findFirst({ where: { slug }, include: { module: { include: { course: true } } } });
  if (!lesson) notFound();

  // Public free preview (e.g. Day 1) for visitors who are not signed in.
  if (!session?.user.id) {
    if (!lesson.isFreePreview) redirect("/login");
    return (
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#414845]"><ArrowLeft size={17} />Back to home</Link>
        <header className="border-b border-[#e2e8f0] pb-8">
          <p className="eyebrow mt-6">Free preview · Day {String(lesson.dayNumber).padStart(2, "0")} of 21</p>
          <h1 className="display mt-3 text-5xl text-[#00261d] sm:text-6xl">{lesson.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#414845]">{lesson.summary}</p>
        </header>
        <div className="mt-8"><div className="lesson-prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.contentMarkdown}</ReactMarkdown></div></div>
        <div className="mt-10 rounded-2xl bg-[#00261d] p-6 text-white sm:p-8">
          <h2 className="display text-3xl">This is Day 1 of 21.</h2>
          <p className="mt-3 leading-7 text-white/75">Join the challenge to get the full personalised course: your own practice briefs, African case studies, weekly rhythm, and a certificate — built around your goal.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/signup" className="inline-flex items-center rounded-full bg-[#fec24a] px-6 py-3 text-sm font-bold text-[#00261d]">Join the challenge</Link>
            <Link href="/" className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white">Explore the course</Link>
          </div>
        </div>
      </article>
    );
  }

  const enrollment = await db.enrollment.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId: lesson.module.courseId } }, include: { user: { include: { profile: true } } } });
  if (!enrollment) redirect("/checkout");
  const available = unlockedDay(enrollment.enrolledAt, new Date(), enrollment.user.profile?.timezone ?? "Africa/Lagos", enrollment.previewOverride);
  const accessible = canAccessLesson({ dayNumber: lesson.dayNumber, isBonus: lesson.isBonus, bonusUnlocked: enrollment.bonusUnlocked, unlockedDay: available });
  if (!accessible) return <div className="mx-auto grid min-h-[65vh] max-w-xl place-items-center text-center"><div><span className="mx-auto grid size-16 place-items-center rounded-full bg-[#e7ece8]"><LockKeyhole /></span><h1 className="display mt-5 text-5xl">This lesson unlocks soon.</h1><p className="my-5 leading-7 text-[#5f6f67]">Daily lessons open at midnight in your local timezone. Keep your streak steady—Day {lesson.dayNumber} is worth the wait.</p><Link className="font-bold text-[#1d604d] underline" href="/challenge">Back to curriculum</Link></div></div>;

  const [plan, submission, quizAttempt] = await Promise.all([
    db.learningPlan.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId: lesson.module.courseId } }, include: { personalizedLessons: { where: { lessonId: lesson.id }, take: 1 } } }),
    db.projectSubmission.findUnique({ where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } } }),
    db.quizAttempt.findUnique({ where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } } }),
  ]);
  const personalized = plan?.personalizedLessons[0];
  const caseStudy = getCaseStudy(personalized?.caseStudySlug);
  const quiz = Array.isArray(lesson.quizJson) ? (lesson.quizJson as QuizQuestion[]) : null;

  return <article className="mx-auto max-w-3xl">
    <Link href="/challenge" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#414845]"><ArrowLeft size={17} />All lessons</Link>
    <header className="border-b border-[#e2e8f0] pb-8"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#717975]"><Clock3 size={14} />{Math.max(15, Math.round((enrollment.user.profile?.weeklyMinutes ?? 140) / 7))} min read</p><p className="eyebrow mt-6">{lesson.isBonus ? "Referral bonus" : `Day ${String(lesson.dayNumber).padStart(2, "0")} of 21`}</p><h1 className="display mt-3 text-5xl text-[#00261d] sm:text-6xl">{lesson.title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#414845]">{lesson.summary}</p></header>

    {personalized && <section className="editorial-card mt-8 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4"><p className="flex items-center gap-2 text-sm font-bold text-[#00261d]"><Sparkles size={17} />Personalised for your outcome</p><span className="rounded-full bg-[#f2f3ff] px-3 py-1 text-xs font-bold text-[#414845]">{plan?.source === "DEEPSEEK" ? "AI-assisted plan" : "Curated plan"}</span></div>
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2"><div><h2 className="font-serif text-2xl font-semibold text-[#00261d]">Why this matters to you</h2><p className="mt-3 leading-7 text-[#414845]">{personalized.whyItMatters}</p></div><div><h2 className="font-serif text-2xl font-semibold text-[#00261d]">In your context</h2><p className="mt-3 leading-7 text-[#414845]">{personalized.tailoredExample}</p></div></div>
    </section>}

    <div className="mt-8"><div className="lesson-prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.contentMarkdown}</ReactMarkdown></div></div>

    {caseStudy && <aside className="mt-8 rounded-2xl bg-[#00261d] p-6 text-white sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><p className="eyebrow eyebrow-gold">African case study · {caseStudy.sector}</p><span className="flex items-center gap-1 text-xs font-bold text-white/60"><MapPin size={14} />{caseStudy.region}</span></div><h2 className="display mt-3 text-4xl">{caseStudy.name}</h2><p className="mt-4 leading-7 text-white/75">{caseStudy.summary}</p><div className="mt-5 rounded-xl bg-white/8 p-5"><p className="flex items-center gap-2 font-bold text-[#fec24a]"><Lightbulb size={18} />What to notice</p><p className="mt-2 leading-7 text-white/75">{caseStudy.lesson}</p></div><a href={caseStudy.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white underline decoration-white/40 underline-offset-4">Read the original source: {caseStudy.sourceLabel} <ExternalLink size={15} /></a></aside>}

    {personalized && <section className="mt-10"><p className="eyebrow">Practical challenge</p><h2 className="display mt-2 text-4xl text-[#00261d]">Turn today’s idea into evidence.</h2><div className="editorial-card mt-5 p-6 sm:p-8"><p className="text-lg leading-8 text-[#414845]">{personalized.practiceBrief}</p></div><div className="mt-8"><h3 className="border-b border-[#c0c8c4] pb-3 font-serif text-2xl font-semibold text-[#00261d]">Definition of Done</h3><ul className="mt-4 grid gap-3">{personalized.successCriteria.map((criterion) => <li key={criterion} className="flex gap-3 text-sm leading-6 text-[#414845]"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded border border-[#717975]"><Check size={12} className="opacity-0" /></span>{criterion}</li>)}</ul></div></section>}

    {quiz && <LessonQuiz lessonId={lesson.id} quiz={quiz} bestScore={quizAttempt?.score ?? null} />}

    <PracticeSubmission lessonId={lesson.id} lessonTitle={lesson.title} isCapstone={lesson.dayNumber === 21} initial={submission} />
    <CompleteButton lessonId={lesson.id} completed={enrollment.completedDays.includes(lesson.dayNumber)} />
  </article>;
}
