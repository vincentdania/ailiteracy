import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, Compass, Flag, Sparkles, Target, Trophy, Wrench } from "lucide-react";
import { redirect } from "next/navigation";
import { NotificationSettings } from "@/components/dashboard/notification-settings";
import { Button } from "@/components/ui/button";
import { BadgeIcon } from "@/components/learning/badge-icon";
import { AccessChip, AccessEndedNotice } from "@/components/learning/access-notice";
import { JourneyMap } from "@/components/learning/journey-map";
import { LearningSettings } from "@/components/learning/learning-settings";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { nextActivity } from "@/lib/learning/mastery";
import { learnerRewards, loadCourseState, syncAchievements } from "@/lib/learning/progress";
import { badgesFor } from "@/lib/learning/rewards";
import { createOrRefreshLearningPlan } from "@/lib/personalization/plan";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user.id) redirect("/login");
  const userId = session.user.id;
  const enrollment = await db.enrollment.findFirst({ where: { userId, status: { in: ["ACTIVE", "COMPLETED"] } }, orderBy: { enrolledAt: "desc" }, include: { user: { include: { profile: true } } } });
  if (!enrollment) return <div className="mx-auto max-w-3xl"><p className="eyebrow">Your learning home</p><h1 className="display mt-3 text-5xl text-[#0b1c30]">Ready when you are.</h1><div className="surface mt-8 p-8"><h2 className="font-display text-2xl font-bold">Start your first course</h2><p className="my-4 max-w-xl leading-7 text-[#4d5768]">Activate your course to unlock hands-on missions, knowledge checks, XP, badges and a verifiable certificate for every module you master.</p><Button asChild><Link href="/checkout">Get started</Link></Button></div></div>;

  // Also backfills XP, badges and certificates for progress made before gamification.
  await syncAchievements(userId);
  const [state, rewards, moduleCertificates, courseCertificates] = await Promise.all([
    loadCourseState(userId, enrollment.courseId),
    learnerRewards(userId),
    db.moduleCertificate.findMany({ where: { userId, revokedAt: null }, orderBy: { issuedAt: "desc" } }),
    db.certificate.findMany({ where: { userId }, include: { course: true } }),
  ]);
  if (!state) redirect("/checkout");

  const profile = enrollment.user.profile;
  let plan = await db.learningPlan.findUnique({ where: { userId_courseId: { userId, courseId: enrollment.courseId } } });
  if (!plan && profile) plan = await createOrRefreshLearningPlan(userId, enrollment.courseId, { profession: profile.profession, industry: profile.industry ?? undefined, primaryGoal: profile.primaryGoal, country: profile.country, skillLevel: profile.skillLevel, weeklyMinutes: profile.weeklyMinutes, learningFormat: profile.learningFormat, preferredTools: profile.preferredTools });

  const lessons = state.modules.flatMap((m) => m.lessons).filter((l) => !l.isBonus);
  const completed = lessons.filter((l) => l.completed).length;
  const missionsSolved = lessons.reduce((sum, l) => sum + l.missions.filter((m) => m.solved).length + (l.advanced?.solved ? 1 : 0), 0);
  const progress = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
  const next = nextActivity(state.modules);
  const currentModule = state.modules.find((m) => m.lessons.some((l) => l.id === next?.lesson.id)) ?? state.modules[0];
  const firstName = (enrollment.user.name ?? "").split(" ")[0] || "there";
  const allBadges = badgesFor([state.course.slug]);
  const earned = new Set(rewards.badges.map((b) => b.badgeKey));
  const level = rewards.level;
  const certificateCount = moduleCertificates.length + courseCertificates.length;
  const timeZone = profile?.timezone ?? "Africa/Lagos";

  return <div className="mx-auto max-w-[1180px]">
    <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
      <div><p className="eyebrow">Welcome back</p><h1 className="display mt-2 text-4xl text-[#0b1c30] sm:text-5xl">Hello, {firstName}.</h1><p className="mt-3 max-w-xl leading-7 text-[#4d5768]">{completed === 0 ? "Your first mission is waiting. Ten minutes from now you'll have something real to show for it." : progress === 100 ? "You've completed the course. Replay missions any time to stay sharp." : `You're ${progress}% through ${state.course.title}. Keep the momentum going.`}</p><div className="mt-3"><AccessChip access={state.access} timeZone={timeZone} /></div></div>
      <Link href="/achievements" className="surface flex min-w-[17rem] items-center gap-4 p-4 transition hover:-translate-y-0.5">
        <span className="relative grid size-16 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(#0058be ${level.progress * 3.6}deg, #e6edf6 0)` }}><span className="grid size-[3.25rem] place-items-center rounded-full bg-white font-display text-xl font-bold text-[#0b1c30]">{level.level}</span></span>
        <span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-[.12em] text-[#677284]">Level {level.level}</span><strong className="block font-display text-xl text-[#0b1c30]">{level.title}</strong><span className="text-sm text-[#4d5768]">{level.xp.toLocaleString()} XP{level.nextTitle ? ` · ${level.toNext} to ${level.nextTitle}` : ""}</span></span>
      </Link>
    </header>

    {!state.access.active ? <div className="mt-8"><AccessEndedNotice endedAt={state.access.endsAt} timeZone={timeZone} /></div> : <section className="surface-dark mt-8 overflow-hidden p-6 sm:p-8" aria-labelledby="continue-title">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="min-w-0">
          <p className="eyebrow !text-[#ffd36b]">{next ? next.label : "Course complete"}</p>
          <h2 id="continue-title" className="display mt-3 text-3xl leading-tight sm:text-4xl">{next ? next.lesson.title : "You've finished every stage."}</h2>
          <p className="mt-3 text-white/70">{next ? `${next.moduleTitle} · ${next.lesson.isBonus ? "Bonus" : `Day ${next.lesson.dayNumber}`}` : "Download your certificates and share what you've achieved."}</p>
          {currentModule && <div className="mt-6 max-w-md"><div className="flex justify-between text-xs font-bold text-white/70"><span>Level progress · {currentModule.title}</span><span>{currentModule.progress}%</span></div><div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#f2b01e] transition-all" style={{ width: `${currentModule.progress}%` }} /></div></div>}
        </div>
        {next ? (next.reason === "next" ? <Link href="/challenge" className="tap inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-4 font-bold text-white">See your journey <ArrowRight size={18} /></Link>
          : <Link href={`/challenge/${next.lesson.slug}${next.reason === "mission" ? "#practise" : next.reason === "check" ? "#challenge" : next.reason === "practical" ? "#master" : ""}`} className="tap inline-flex items-center justify-center gap-2 rounded-full bg-[#f2b01e] px-8 py-4 text-lg font-bold text-[#0b1c30] shadow-[0_10px_30px_-10px_rgba(242,176,30,.8)] transition hover:-translate-y-0.5 hover:bg-[#ffc23d]">Continue learning <ArrowRight size={20} /></Link>)
          : <Link href="/certificates" className="tap inline-flex items-center justify-center gap-2 rounded-full bg-[#f2b01e] px-8 py-4 font-bold text-[#0b1c30]">My certificates <Award size={18} /></Link>}
      </div>
    </section>}

    <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5" aria-label="Your progress">
      {([[Sparkles, "XP earned", level.xp.toLocaleString(), "#f2b01e"], [Flag, "Stages complete", `${completed}/${lessons.length}`, "#0058be"], [Target, "Missions solved", missionsSolved, "#0058be"], [Trophy, "Badges", `${earned.size}/${allBadges.length}`, "#f2b01e"], [Award, "Certificates", certificateCount, "#214889"]] as const).map(([Icon, label, value, colour]) => <div key={label} className="surface p-4"><Icon size={18} style={{ color: colour }} /><strong className="mt-3 block font-display text-2xl text-[#0b1c30]">{value}</strong><span className="text-xs font-semibold text-[#677284]">{label}</span></div>)}
    </section>

    <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_24rem]">
      <section aria-labelledby="levels-title">
        <div className="mb-4 flex items-end justify-between"><h2 id="levels-title" className="font-display text-2xl font-bold text-[#0b1c30]">Your levels</h2><Link href="/challenge" className="text-sm font-bold text-[#0058be]">Full journey</Link></div>
        <JourneyMap modules={state.modules} compact />
      </section>

      <div className="grid content-start gap-6">
        <section className="surface p-5 sm:p-6" aria-labelledby="badges-title">
          <div className="flex items-center justify-between"><h2 id="badges-title" className="font-display text-xl font-bold text-[#0b1c30]">Badges</h2><Link href="/achievements" className="text-sm font-bold text-[#0058be]">All {allBadges.length}</Link></div>
          <ul className="mt-4 grid grid-cols-4 gap-3">{[...allBadges].sort((a, b) => Number(earned.has(b.key)) - Number(earned.has(a.key))).slice(0, 8).map((badge) => { const has = earned.has(badge.key); return <li key={badge.key} title={`${badge.title}: ${has ? badge.description : badge.how}`} className="grid justify-items-center gap-1.5 text-center"><span className={`grid size-14 place-items-center rounded-2xl ${has ? (badge.tier === "gold" ? "bg-[#f2b01e] text-[#0b1c30]" : badge.tier === "silver" ? "bg-[#214889] text-white" : "bg-[#eaf2ff] text-[#0058be]") : "bg-[#edf1f6] text-[#97a3b6]"}`}><BadgeIcon icon={badge.icon} size={22} /></span><span className={`line-clamp-2 text-[11px] font-semibold leading-tight ${has ? "text-[#0b1c30]" : "text-[#97a3b6]"}`}>{badge.title}</span></li>; })}</ul>
        </section>

        <section id="certificates" className="surface scroll-mt-24 p-5 sm:p-6" aria-labelledby="certs-title">
          <div className="flex items-center justify-between"><h2 id="certs-title" className="font-display text-xl font-bold text-[#0b1c30]">My certificates</h2><Link href="/certificates" className="text-sm font-bold text-[#0058be]">Gallery</Link></div>
          {certificateCount ? <ul className="mt-4 grid gap-2">{moduleCertificates.slice(0, 3).map((c) => <li key={c.id}><Link href={`/verify/${c.credentialId}`} className="flex items-center gap-3 rounded-2xl border border-[#dfe5ee] p-3 hover:border-[#f2b01e]"><span className="grid size-10 place-items-center rounded-xl bg-[#fff4d6] text-[#8a5300]"><Award size={18} /></span><span className="min-w-0"><strong className="block truncate text-sm">{c.moduleTitle}</strong><span className="text-xs text-[#677284]">{c.credentialId}</span></span></Link></li>)}{courseCertificates.map((c) => <li key={c.id}><Link href={`/verify/${c.uniqueHash}`} className="flex items-center gap-3 rounded-2xl border border-[#dfe5ee] p-3 hover:border-[#f2b01e]"><span className="grid size-10 place-items-center rounded-xl bg-[#f2b01e] text-[#0b1c30]"><Trophy size={18} /></span><span className="min-w-0"><strong className="block truncate text-sm">{c.course.title}</strong><span className="text-xs text-[#677284]">Course certificate</span></span></Link></li>)}</ul>
            : <div className="mt-4 rounded-2xl bg-[#f6f8fb] p-4 text-sm leading-6 text-[#4d5768]"><p className="font-semibold text-[#0b1c30]">Your first certificate: {currentModule?.title}</p><ul className="mt-2 grid gap-1.5">{currentModule?.requirements.map((r) => <li key={r.key} className="flex items-center gap-2">{r.met ? <CheckCircle2 size={15} className="text-[#146c43]" /> : <span className="size-[15px] rounded-full border border-[#cbd5e1]" />}{r.label}</li>)}</ul></div>}
        </section>
      </div>
    </div>

    {plan && <section className="surface mt-8 overflow-hidden" aria-labelledby="plan-title">
      <div className="grid gap-4 p-6 sm:p-8 md:grid-cols-[1fr_auto]"><div><p className="eyebrow flex items-center gap-2"><Compass size={15} />Your personalised path</p><h2 id="plan-title" className="display mt-2 text-3xl text-[#0b1c30]">{plan.title}</h2><p className="mt-3 max-w-3xl leading-7 text-[#4d5768]">{plan.outcomeSummary}</p></div><span className="chip h-fit bg-[#eaf2ff] text-[#214889]">{plan.source === "DEEPSEEK" ? "AI-assisted" : "Curated"}</span></div>
      {plan.recommendedTools.length > 0 && <div id="resources" className="flex flex-wrap items-center gap-2 border-t border-[#dfe5ee] px-6 py-4 text-sm sm:px-8"><Wrench size={16} /><strong>Suggested tools:</strong>{plan.recommendedTools.map((tool) => <span key={tool} className="chip bg-[#edf1f6] text-[#4d5768]">{tool}</span>)}</div>}
    </section>}

    <section id="settings" className="mt-8 grid scroll-mt-24 gap-5 md:grid-cols-2" aria-label="Settings"><LearningSettings name={enrollment.user.name ?? ""} /><NotificationSettings /></section>
  </div>;
}
