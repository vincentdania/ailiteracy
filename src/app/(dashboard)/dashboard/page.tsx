import Link from "next/link";
import { ArrowRight, Award, BookOpen, Check, Compass, Flame, Sparkles, Target, Wrench } from "lucide-react";
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
    include: {
      course: { include: { modules: { include: { lessons: true } } } },
      user: { include: { profile: true, streak: true, certificates: true } },
    },
  });
  if (!enrollment) {
    return <div className="mx-auto max-w-4xl"><p className="eyebrow">Your learning home</p><h1 className="display mt-3 text-6xl">Ready when you are.</h1><div className="mt-8 rounded-3xl bg-white p-8 card-shadow"><h2 className="text-2xl font-black">Activate your personalized programme</h2><p className="my-4 max-w-xl leading-7 text-[#5f6f67]">Your learning plan is ready. Complete checkout to activate daily lessons, saved practice, capstone feedback and your certificate path.</p><Button asChild><Link href="/checkout">Choose your currency</Link></Button></div></div>;
  }
  const timezone = enrollment.user.profile?.timezone ?? "Africa/Lagos";
  const available = unlockedDay(enrollment.enrolledAt, new Date(), timezone, enrollment.previewOverride);
  const lessons = enrollment.course.modules.flatMap((module) => module.lessons).filter((lesson) => !lesson.isBonus).sort((a, b) => a.dayNumber - b.dayNumber);
  const nextLesson = lessons.find((lesson) => lesson.dayNumber <= available && !enrollment.completedDays.includes(lesson.dayNumber)) ?? lessons[Math.min(available - 1, lessons.length - 1)];
  const completedCount = enrollment.completedDays.filter((day) => day <= 21).length;
  const progress = (completedCount / 21) * 100;
  const profile = enrollment.user.profile;
  let plan = await db.learningPlan.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId: enrollment.courseId } } });
  if (!plan && profile) {
    plan = await createOrRefreshLearningPlan(session.user.id, enrollment.courseId, { profession: profile.profession, industry: profile.industry ?? undefined, primaryGoal: profile.primaryGoal, country: profile.country, skillLevel: profile.skillLevel, weeklyMinutes: profile.weeklyMinutes, learningFormat: profile.learningFormat, preferredTools: profile.preferredTools });
  }
  const milestones = Array.isArray(plan?.milestones) ? plan.milestones.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const value = item as Record<string, unknown>;
    return typeof value.day === "number" && typeof value.title === "string" && typeof value.outcome === "string" ? [{ day: value.day, title: value.title, outcome: value.outcome }] : [];
  }) : [];

  return <div className="mx-auto max-w-6xl">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Your learning home</p><h1 className="display mt-2 text-5xl sm:text-6xl">Welcome back, {session.user.name?.split(" ")[0] ?? "learner"}.</h1></div><div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-bold text-[#b05b20] card-shadow"><Flame fill="currentColor" size={19} />{enrollment.user.streak?.currentStreak ?? 0} day streak</div></div>
    <div className="mt-9 grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
      <section className="overflow-hidden rounded-[2rem] bg-[#123c31] text-white card-shadow"><div className="grid gap-5 p-7 sm:p-9 md:grid-cols-[1fr_auto]"><div><p className="eyebrow text-[#d9f99d]">Up next · Day {nextLesson?.dayNumber ?? 1}</p><h2 className="display mt-3 text-4xl sm:text-5xl">{nextLesson?.title ?? "Your next lesson"}</h2><p className="mt-4 max-w-xl leading-7 text-white/65">{nextLesson?.summary}</p><Button asChild size="lg" className="mt-7 bg-[#d9f99d] text-[#123c31] hover:bg-white"><Link href={`/challenge/${nextLesson?.slug ?? "day-01"}`}>Continue learning <ArrowRight className="ml-2" size={18} /></Link></Button></div><span className="hidden size-24 place-items-center rounded-[2rem] border border-white/15 bg-white/8 text-5xl font-black text-[#d9f99d] md:grid">{String(nextLesson?.dayNumber ?? 1).padStart(2, "0")}</span></div><div className="border-t border-white/10 bg-black/10 p-7 sm:px-9"><Progress value={progress} label="Challenge completion" /></div></section>
      <aside className="grid grid-cols-2 gap-4 lg:grid-cols-1"><div className="rounded-3xl bg-white p-6 card-shadow"><BookOpen className="text-[#1d604d]" /><strong className="mt-4 block text-3xl">{completedCount}/21</strong><span className="text-sm text-[#5f6f67]">lessons complete</span></div><div className="rounded-3xl bg-white p-6 card-shadow"><Target className="text-[#1d604d]" /><strong className="mt-4 block text-3xl">Day {available}</strong><span className="text-sm text-[#5f6f67]">currently unlocked</span></div></aside>
    </div>
    {plan && <section className="mt-6 overflow-hidden rounded-[2rem] border border-[#dce2dd] bg-white card-shadow"><div className="grid gap-5 bg-[#fffdf5] p-7 sm:p-9 md:grid-cols-[1fr_auto]"><div><p className="eyebrow flex items-center gap-2"><Compass size={15} />Your personalized certificate path</p><h2 className="display mt-3 text-4xl sm:text-5xl">{plan.title}</h2><p className="mt-4 max-w-3xl leading-7 text-[#5f6f67]">{plan.outcomeSummary}</p></div><span className="h-fit rounded-full bg-[#e6efdf] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#123c31]">{plan.source === "DEEPSEEK" ? "AI-assisted" : "Curated locally"}</span></div><div className="grid gap-px bg-[#dce2dd] md:grid-cols-3">{milestones.map((milestone) => <div key={milestone.day} className="bg-white p-6"><span className="text-xs font-black uppercase tracking-wider text-[#1d604d]">By Day {milestone.day}</span><h3 className="mt-2 font-black">{milestone.title}</h3><p className="mt-2 text-sm leading-6 text-[#5f6f67]">{milestone.outcome}</p></div>)}</div>{plan.recommendedTools.length > 0 && <div className="flex flex-wrap items-center gap-2 border-t border-[#dce2dd] px-7 py-5 text-sm"><Wrench size={16} className="text-[#1d604d]" /><strong className="mr-1">Suggested tools:</strong>{plan.recommendedTools.map((tool) => <span key={tool} className="rounded-full bg-[#f1f3ee] px-3 py-1 text-[#5f6f67]">{tool}</span>)}</div>}</section>}
    <section className="mt-6 grid gap-5 md:grid-cols-2">
      <div className="rounded-3xl border border-[#dce2dd] bg-white p-7"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e6efdf]"><Sparkles size={19} /></span><h2 className="text-xl font-black">Your outcome</h2></div><p className="mt-5 leading-7 text-[#5f6f67]">{enrollment.user.profile?.primaryGoal}</p></div>
      <div id="certificates" className="rounded-3xl border border-[#dce2dd] bg-white p-7"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#fff1d2]"><Award size={19} /></span><h2 className="text-xl font-black">Evidence-based certificate</h2></div>{enrollment.user.certificates[0] ? <p className="mt-5"><Link className="font-bold text-[#1d604d] underline" href={`/verify/${enrollment.user.certificates[0].uniqueHash}`}>View your verified credential</Link></p> : <ul className="mt-5 grid gap-2 text-sm text-[#5f6f67]"><li className="flex gap-2"><Check size={17} className="text-[#1d604d]" />Complete the 21 applied lessons</li><li className="flex gap-2"><Check size={17} className="text-[#1d604d]" />Submit your outcome-focused capstone</li><li className="flex gap-2"><Check size={17} className="text-[#1d604d]" />Score at least 70 on the practical rubric</li></ul>}</div>
      <div className="md:col-span-2"><NotificationSettings /></div>
    </section>
  </div>;
}
