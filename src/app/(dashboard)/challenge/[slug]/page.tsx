import Image from "next/image";
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

export const dynamic = "force-dynamic";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user.id) redirect("/login");
  const { slug } = await params;
  const lesson = await db.lesson.findFirst({ where: { slug }, include: { module: { include: { course: true } } } });
  if (!lesson) notFound();
  const enrollment = await db.enrollment.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId: lesson.module.courseId } }, include: { user: { include: { profile: true } } } });
  if (!enrollment) redirect("/checkout");
  const available = unlockedDay(enrollment.enrolledAt, new Date(), enrollment.user.profile?.timezone ?? "Africa/Lagos", enrollment.previewOverride);
  const accessible = canAccessLesson({ dayNumber: lesson.dayNumber, isBonus: lesson.isBonus, bonusUnlocked: enrollment.bonusUnlocked, unlockedDay: available });
  if (!accessible) return <div className="mx-auto grid min-h-[65vh] max-w-xl place-items-center text-center"><div><span className="mx-auto grid size-16 place-items-center rounded-full bg-[#e7ece8]"><LockKeyhole /></span><h1 className="display mt-5 text-5xl">This lesson unlocks soon.</h1><p className="my-5 leading-7 text-[#5f6f67]">Daily lessons open at midnight in your local timezone. Keep your streak steady—Day {lesson.dayNumber} is worth the wait.</p><Link className="font-bold text-[#1d604d] underline" href="/challenge">Back to curriculum</Link></div></div>;

  const [plan, submission] = await Promise.all([
    db.learningPlan.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId: lesson.module.courseId } }, include: { personalizedLessons: { where: { lessonId: lesson.id }, take: 1 } } }),
    db.projectSubmission.findUnique({ where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } } }),
  ]);
  const personalized = plan?.personalizedLessons[0];
  const caseStudy = getCaseStudy(personalized?.caseStudySlug);

  return <article className="mx-auto max-w-4xl">
    <Link href="/challenge" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#5f6f67]"><ArrowLeft size={17} />All lessons</Link>
    <header className="overflow-hidden rounded-[2rem] bg-[#123c31] text-white card-shadow"><div className="grid items-center gap-6 p-7 sm:p-10 md:grid-cols-[1fr_15rem]"><div><p className="eyebrow text-[#d9f99d]">{lesson.isBonus ? "Referral bonus" : `Day ${lesson.dayNumber} of 21`}</p><h1 className="display mt-3 text-5xl sm:text-6xl">{lesson.title}</h1><p className="mt-5 flex items-center gap-2 text-sm text-white/60"><Clock3 size={16} />Learn, apply and save evidence · {Math.max(15, Math.round((enrollment.user.profile?.weeklyMinutes ?? 140) / 7))} min</p></div>{lesson.heroImage && <div className="relative hidden aspect-square overflow-hidden rounded-3xl bg-white/8 md:block"><Image src={lesson.heroImage} alt="" fill sizes="240px" className="object-cover" /></div>}</div></header>

    {personalized && <section className="mt-8 overflow-hidden rounded-[2rem] border border-[#cddfc3] bg-[#eef5e9]">
      <div className="flex items-center justify-between border-b border-[#cddfc3] px-6 py-4"><p className="flex items-center gap-2 text-sm font-black text-[#123c31]"><Sparkles size={17} />Personalized for your outcome</p><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#5f6f67]">{plan?.source === "DEEPSEEK" ? "AI-assisted plan" : "Curated plan"}</span></div>
      <div className="grid gap-5 p-6 sm:p-8 md:grid-cols-2"><div><p className="eyebrow">Why this matters to you</p><p className="mt-3 leading-7 text-[#405148]">{personalized.whyItMatters}</p></div><div><p className="eyebrow">In your context</p><p className="mt-3 leading-7 text-[#405148]">{personalized.tailoredExample}</p></div></div>
    </section>}

    <div className="mt-8 rounded-[2rem] border border-[#dce2dd] bg-white p-6 sm:p-10 card-shadow"><div className="lesson-prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.contentMarkdown}</ReactMarkdown></div></div>

    {caseStudy && <aside className="mt-8 rounded-[2rem] bg-[#182f4b] p-6 text-white sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><p className="eyebrow text-[#f4c76b]">African case study · {caseStudy.sector}</p><span className="flex items-center gap-1 text-xs font-bold text-white/60"><MapPin size={14} />{caseStudy.region}</span></div><h2 className="display mt-3 text-4xl">{caseStudy.name}</h2><p className="mt-4 leading-7 text-white/72">{caseStudy.summary}</p><div className="mt-5 rounded-2xl bg-white/8 p-5"><p className="flex items-center gap-2 font-black text-[#f4c76b]"><Lightbulb size={18} />What to notice</p><p className="mt-2 leading-7 text-white/75">{caseStudy.lesson}</p></div><a href={caseStudy.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white underline decoration-white/40 underline-offset-4">Read the original source: {caseStudy.sourceLabel} <ExternalLink size={15} /></a></aside>}

    {personalized && <section className="mt-8 rounded-[2rem] border-2 border-[#123c31] bg-[#fffdf5] p-6 sm:p-8"><p className="eyebrow">Your applied challenge</p><h2 className="display mt-2 text-4xl">Turn today’s idea into evidence.</h2><p className="mt-4 text-lg leading-8 text-[#405148]">{personalized.practiceBrief}</p><div className="mt-6"><p className="text-sm font-black uppercase tracking-wider text-[#123c31]">Definition of done</p><ul className="mt-3 grid gap-3">{personalized.successCriteria.map((criterion) => <li key={criterion} className="flex gap-3 text-sm leading-6 text-[#405148]"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#d9f99d] text-[#123c31]"><Check size={13} /></span>{criterion}</li>)}</ul></div></section>}

    <PracticeSubmission lessonId={lesson.id} lessonTitle={lesson.title} isCapstone={lesson.dayNumber === 21} initial={submission} />
    <CompleteButton lessonId={lesson.id} completed={enrollment.completedDays.includes(lesson.dayNumber)} />
  </article>;
}
