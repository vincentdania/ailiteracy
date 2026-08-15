import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, BarChart3, Check, Compass, Flame, Lightbulb, Wrench } from "lucide-react";
import { redirect } from "next/navigation";
import { NotificationSettings } from "@/components/dashboard/notification-settings";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { auth } from "@/lib/auth";
import { unlockedDay } from "@/lib/challenge";
import { db } from "@/lib/db";
import { createOrRefreshLearningPlan } from "@/lib/personalization/plan";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user.id) redirect("/login");
  const enrollment = await db.enrollment.findFirst({
    where: { userId: session.user.id, status: { in: ["ACTIVE", "COMPLETED"] } },
    include: { course: { include: { modules: { include: { lessons: true } } } }, user: { include: { profile: true, streak: true, certificates: true } } },
  });
  if (!enrollment) return <div className="mx-auto max-w-4xl"><p className="eyebrow">Your learning home</p><h1 className="display mt-3 text-6xl text-[#00261d]">Ready when you are.</h1><div className="editorial-card mt-8 p-8"><h2 className="font-serif text-3xl font-semibold">Activate your personalised programme</h2><p className="my-4 max-w-xl leading-7 text-[#414845]">Your learning plan is ready. Complete checkout to activate daily lessons, saved practice, capstone feedback and your certificate path.</p><Button asChild><Link href="/checkout">Choose your currency</Link></Button></div></div>;

  const timezone = enrollment.user.profile?.timezone ?? "Africa/Lagos";
  const available = unlockedDay(enrollment.enrolledAt, new Date(), timezone, enrollment.previewOverride);
  const lessons = enrollment.course.modules.flatMap((module) => module.lessons).filter((lesson) => !lesson.isBonus).sort((a, b) => a.dayNumber - b.dayNumber);
  const nextLesson = lessons.find((lesson) => lesson.dayNumber <= available && !enrollment.completedDays.includes(lesson.dayNumber)) ?? lessons[Math.min(available - 1, lessons.length - 1)];
  const completedCount = enrollment.completedDays.filter((day) => day <= 21).length;
  const progress = (completedCount / 21) * 100;
  const profile = enrollment.user.profile;
  let plan = await db.learningPlan.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId: enrollment.courseId } } });
  if (!plan && profile) plan = await createOrRefreshLearningPlan(session.user.id, enrollment.courseId, { profession: profile.profession, industry: profile.industry ?? undefined, primaryGoal: profile.primaryGoal, country: profile.country, skillLevel: profile.skillLevel, weeklyMinutes: profile.weeklyMinutes, learningFormat: profile.learningFormat, preferredTools: profile.preferredTools });
  const milestones = Array.isArray(plan?.milestones) ? plan.milestones.flatMap((item) => { if (!item || typeof item !== "object" || Array.isArray(item)) return []; const value = item as Record<string, unknown>; return typeof value.day === "number" && typeof value.title === "string" && typeof value.outcome === "string" ? [{ day: value.day, title: value.title, outcome: value.outcome }] : []; }) : [];
  const currentModule = enrollment.course.modules.find((module) => module.lessons.some((lesson) => lesson.id === nextLesson?.id));

  return <div className="mx-auto max-w-[1180px]">
    <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-[#414845]">Welcome back</p><h1 className="display mt-3 text-5xl text-[#00261d] sm:text-6xl">Your Learning Journey</h1></div><div className="flex w-fit items-center gap-2 rounded-full border border-[#c0c8c4] bg-white px-5 py-3 font-bold"><Flame className="text-[#f0a31b]" fill="currentColor" size={19} />{enrollment.user.streak?.currentStreak ?? 0} Day Streak</div></header>

    <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_23rem]">
      <div>
        <section className="editorial-card overflow-hidden p-5 sm:p-8"><div className="grid gap-7 sm:grid-cols-[13.5rem_1fr]"><div className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image src="/images/nigerian-professionals-learning.jpg" alt="Nigerian professionals learning together" fill sizes="220px" className="object-cover" /></div><div className="flex min-w-0 flex-col"><div className="flex flex-wrap items-center gap-3 text-sm"><span className="rounded-full bg-[#e7ece8] px-3 py-1">Day {String(nextLesson?.dayNumber ?? 1).padStart(2, "0")}</span><span className="text-[#414845]">{Math.max(15, Math.round((profile?.weeklyMinutes ?? 140) / 7))} min</span></div><h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-[#00261d] sm:text-4xl">{nextLesson?.title ?? "Your next lesson"}</h2><p className="mt-3 line-clamp-2 leading-7 text-[#414845]">{nextLesson?.summary}</p><div className="mt-auto grid items-end gap-4 border-t border-[#e2e8f0] pt-5 sm:grid-cols-[1fr_auto]"><Progress value={progress} label="Progress" /><Button asChild><Link href={`/challenge/${nextLesson?.slug ?? "day-01"}`}>Resume <ArrowRight className="ml-2" size={17} /></Link></Button></div></div></div></section>

        <h2 className="mt-10 font-serif text-3xl font-semibold text-[#00261d]">Recent Insights</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2"><article className="editorial-card p-7"><span className="grid size-12 place-items-center rounded-full bg-[#fff1d2] text-[#7c5800]"><Lightbulb size={21} /></span><h3 className="mt-7 font-bold">Key Concept Mastered</h3><p className="mt-5 leading-7 text-[#414845]">You completed {completedCount} applied {completedCount === 1 ? "lesson" : "lessons"}. Revisit your strongest artefact to reinforce the decisions behind it.</p><Link href="/challenge" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#00261d]">Review lessons <ArrowRight size={15} /></Link></article><article className="editorial-card p-7"><span className="grid size-12 place-items-center rounded-full bg-[#e7f6d4] text-[#00261d]"><BarChart3 size={21} /></span><h3 className="mt-7 font-bold">Literacy Score</h3><p className="mt-5 font-serif text-6xl font-semibold text-[#00261d]">{Math.round(progress)}<span className="ml-2 text-xl font-normal text-[#131b2e]">/100</span></p><p className="mt-5 leading-7 text-[#414845]">Your score grows as you complete lessons and submit evidence of careful AI use.</p></article></div>
      </div>

      <aside className="editorial-card p-7 xl:min-h-[42rem]"><div className="flex items-center justify-between"><h2 className="font-serif text-3xl font-semibold text-[#00261d]">Roadmap</h2><Link href="/challenge" className="text-sm font-semibold">View All</Link></div><div className="relative mt-8 space-y-8 before:absolute before:bottom-2 before:left-4 before:top-3 before:w-px before:bg-[#dfe4e1]">{enrollment.course.modules.slice(0, 4).map((module, index) => { const isCurrent = module.id === currentModule?.id; const done = module.lessons.every((lesson) => lesson.isBonus || enrollment.completedDays.includes(lesson.dayNumber)); return <div key={module.id} className="relative grid grid-cols-[2rem_1fr] gap-4"><span className={`relative z-10 grid size-8 place-items-center rounded-full border ${done ? "border-[#7a958a] bg-[#7a958a] text-white" : isCurrent ? "border-2 border-[#00261d] bg-white text-[#00261d]" : "border-[#c6cfe9] bg-[#e2e7ff] text-[#9aa3bd]"}`}>{done ? <Check size={16} /> : isCurrent ? <span className="size-2 rounded-full bg-[#00261d]" /> : index + 1}</span><div className={isCurrent ? "rounded-xl bg-[#f2f3ff] p-4" : "pt-1"}><p className="text-sm text-[#717975]">Phase {index + 1}</p><h3 className="mt-1 font-bold">{module.title}</h3>{isCurrent && <><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e2e7ff]"><div className="h-full bg-[#7ed321]" style={{ width: `${progress}%` }} /></div><p className="mt-2 text-xs">{completedCount} of 21 lessons complete</p></>}</div></div>; })}</div></aside>
    </div>

    {plan && <section className="editorial-card mt-6 overflow-hidden"><div className="grid gap-5 bg-[#fffdf5] p-7 sm:p-9 md:grid-cols-[1fr_auto]"><div><p className="eyebrow flex items-center gap-2"><Compass size={15} />Your personalised certificate path</p><h2 className="display mt-3 text-4xl text-[#00261d]">{plan.title}</h2><p className="mt-4 max-w-3xl leading-7 text-[#414845]">{plan.outcomeSummary}</p></div><span className="h-fit rounded-full bg-[#e6efdf] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#123c31]">{plan.source === "DEEPSEEK" ? "AI-assisted" : "Curated locally"}</span></div><div className="grid gap-px bg-[#e2e8f0] md:grid-cols-3">{milestones.map((milestone) => <div key={milestone.day} className="bg-white p-6"><span className="text-xs font-bold uppercase tracking-wider text-[#123c31]">By Day {milestone.day}</span><h3 className="mt-2 font-bold">{milestone.title}</h3><p className="mt-2 text-sm leading-6 text-[#414845]">{milestone.outcome}</p></div>)}</div>{plan.recommendedTools.length > 0 && <div id="resources" className="flex flex-wrap items-center gap-2 border-t border-[#e2e8f0] px-7 py-5 text-sm"><Wrench size={16} /><strong>Suggested tools:</strong>{plan.recommendedTools.map((tool) => <span key={tool} className="rounded-full bg-[#f1f3ee] px-3 py-1 text-[#414845]">{tool}</span>)}</div>}</section>}

    <section className="mt-6 grid gap-5 md:grid-cols-2"><div id="certificates" className="editorial-card p-7"><div className="flex items-center gap-3"><Award size={20} /><h2 className="font-serif text-2xl font-semibold">Evidence-based certificate</h2></div>{enrollment.user.certificates[0] ? <p className="mt-5"><Link className="font-bold text-[#123c31] underline" href={`/verify/${enrollment.user.certificates[0].uniqueHash}`}>View your verified credential</Link></p> : <ul className="mt-5 grid gap-2 text-sm text-[#414845]"><li className="flex gap-2"><Check size={17} />Complete the 21 applied lessons</li><li className="flex gap-2"><Check size={17} />Submit your outcome-focused capstone</li><li className="flex gap-2"><Check size={17} />Score at least 70 on the practical rubric</li></ul>}</div><div id="settings"><NotificationSettings /></div></section>
  </div>;
}
