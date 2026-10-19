import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BadgeIcon } from "@/components/learning/badge-icon";
import { learnerRewards, syncAchievements } from "@/lib/learning/progress";
import { badgesFor, LEVELS, XP } from "@/lib/learning/rewards";

export const dynamic = "force-dynamic";
export const metadata = { title: "Achievements" };

const XP_RULES: [string, number][] = [
  ["Solve a mission on the first try", XP.missionFirstTry],
  ["Solve a mission on the second try", XP.missionSecondTry],
  ["Solve a mission after more tries", XP.missionLater],
  ["Solve an optional advanced mission", XP.advancedMission],
  ["Master a knowledge check (75%+)", XP.quizPassed],
  ["Full marks on a knowledge check", XP.quizPerfect],
  ["Complete a lesson", XP.lessonComplete],
  ["Pass a practical challenge (70+)", XP.practicalPassed],
  ["Pass the capstone", XP.capstonePassed],
  ["Master a module", XP.moduleMastered],
  ["Complete a course", XP.courseComplete],
];

export default async function AchievementsPage() {
  const session = await auth();
  if (!session?.user.id) redirect("/login");
  await syncAchievements(session.user.id);
  const [rewards, enrollments] = await Promise.all([learnerRewards(session.user.id), db.enrollment.findMany({ where: { userId: session.user.id }, select: { course: { select: { slug: true } } } })]);
  const badges = badgesFor(enrollments.map((e) => e.course.slug));
  const earned = new Map(rewards.badges.map((b) => [b.badgeKey, b.awardedAt]));
  const level = rewards.level;

  return <div className="mx-auto max-w-5xl">
    <header><p className="eyebrow">Achievements</p><h1 className="display mt-2 text-4xl text-[#0b1c30] sm:text-5xl">Every point is a skill.</h1><p className="mt-3 max-w-2xl leading-7 text-[#4d5768]">XP comes only from things you demonstrate: solved missions, mastered checks, real work that passes review. Time on the page earns nothing, and nothing here ever expires.</p></header>

    <section className="surface-dark mt-8 p-6 sm:p-8" aria-label="Your level">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow !text-[#ffd36b]">Level {level.level}</p><p className="display mt-1 text-4xl">{level.title}</p></div><p className="font-display text-3xl font-bold">{level.xp.toLocaleString()} <span className="text-lg text-white/60">XP</span></p></div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#f2b01e]" style={{ width: `${level.progress}%` }} /></div>
      <p className="mt-2 text-sm text-white/70">{level.nextTitle ? `${level.toNext} XP to Level ${level.level + 1}: ${level.nextTitle}` : "Top level reached."}</p>
      <ol className="mt-6 flex gap-2 overflow-x-auto pb-1">{LEVELS.map((l) => <li key={l.level} className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold ${l.level <= level.level ? "bg-white/15 text-white" : "text-white/40"}`}>{l.level} · {l.title}<span className="block font-normal opacity-70">{l.xp} XP</span></li>)}</ol>
    </section>

    <section className="mt-10" aria-labelledby="badges-heading">
      <h2 id="badges-heading" className="font-display text-2xl font-bold text-[#0b1c30]">Badges · {earned.size} of {badges.length}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{badges.map((badge) => { const at = earned.get(badge.key); return <li key={badge.key} className={`surface flex gap-4 p-4 ${at ? "" : "bg-[#fbfcfd]"}`}><span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${at ? (badge.tier === "gold" ? "bg-[#f2b01e] text-[#0b1c30]" : badge.tier === "silver" ? "bg-[#214889] text-white" : "bg-[#eaf2ff] text-[#0058be]") : "bg-[#edf1f6] text-[#97a3b6]"}`}>{at ? <BadgeIcon icon={badge.icon} size={24} /> : <LockKeyhole size={20} />}</span><div className="min-w-0"><p className="font-display font-bold text-[#0b1c30]">{badge.title}</p><p className="mt-1 text-sm leading-5 text-[#4d5768]">{at ? badge.description : badge.how}</p><p className="mt-2 text-xs font-semibold uppercase tracking-[.1em] text-[#677284]">{at ? `Earned ${at.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : `${badge.tier} badge`}</p></div></li>; })}</ul>
    </section>

    <div className="mt-10 grid gap-6 lg:grid-cols-2">
      <section className="surface p-5 sm:p-6" aria-labelledby="history-heading"><h2 id="history-heading" className="font-display text-xl font-bold text-[#0b1c30]">Recent XP</h2>{rewards.events.length ? <ul className="mt-3 divide-y divide-[#dfe5ee]">{rewards.events.map((e) => <li key={e.id} className="flex items-center justify-between gap-3 py-2.5 text-sm"><span className="text-[#26324a]">{e.label}</span><strong className="shrink-0 text-[#0058be]">+{e.xp}</strong></li>)}</ul> : <p className="mt-3 text-sm text-[#4d5768]">Solve your first mission to start earning XP.</p>}</section>
      <section className="surface p-5 sm:p-6" aria-labelledby="rules-heading"><h2 id="rules-heading" className="font-display text-xl font-bold text-[#0b1c30]">How XP works</h2><p className="mt-1 text-sm text-[#4d5768]">Each award is earned once. Replaying improves your skill and your best score, not your points.</p><ul className="mt-3 divide-y divide-[#dfe5ee]">{XP_RULES.map(([label, xp]) => <li key={label} className="flex items-center justify-between py-2 text-sm"><span>{label}</span><strong className="text-[#0b1c30]">{xp} XP</strong></li>)}</ul></section>
    </div>
  </div>;
}
