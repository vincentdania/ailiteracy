import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { loadCourseState, syncAchievements } from "@/lib/learning/progress";
import { AccessEndedNotice } from "@/components/learning/access-notice";
import { JourneyMap } from "@/components/learning/journey-map";

export const dynamic = "force-dynamic";

export default async function JourneyPage({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const session = await auth();
  if (!session?.user.id) redirect("/login");
  const { course: requestedSlug } = await searchParams;
  // Course-aware journey: default to the flagship; ?course=<slug> shows another enrolled course.
  const enrollments = await db.enrollment.findMany({ where: { userId: session.user.id, status: { in: ["ACTIVE", "COMPLETED"] } }, include: { course: { select: { id: true, slug: true, title: true } } }, orderBy: { enrolledAt: "asc" } });
  if (!enrollments.length) redirect("/checkout");
  const enrollment = enrollments.find((e) => e.course.slug === (requestedSlug || "ai-for-your-work")) ?? enrollments[0]!;
  if (requestedSlug && enrollment.course.slug !== requestedSlug) redirect(`/challenge?course=${enrollment.course.slug}`);
  await syncAchievements(session.user.id);
  const state = await loadCourseState(session.user.id, enrollment.courseId);
  if (!state) redirect("/checkout");
  const required = state.modules.flatMap((m) => m.lessons).filter((l) => !l.isBonus);
  const done = required.filter((l) => l.completed).length;
  const mastered = state.modules.filter((m) => m.certificate).length;

  return <div className="mx-auto max-w-3xl">
    <header>
      <p className="eyebrow">{state.course.title}</p>
      <h1 className="display mt-3 text-4xl text-[#0b1c30] sm:text-5xl">Your learning journey</h1>
      <p className="mt-4 max-w-2xl leading-7 text-[#4d5768]">{state.modules.length} levels, {required.length} stages. Each stage opens on its day. Clear a level by mastering every stage and passing one practical challenge, and you earn that level’s certificate.</p>
      <div className="mt-6 grid grid-cols-3 gap-3">{[["Stages complete", `${done}/${required.length}`], ["Levels mastered", `${mastered}/${state.modules.length}`], ["Unlocked today", `Day ${Math.min(state.available, required.length)}`]].map(([label, value]) => <div key={label} className="surface p-4"><strong className="block font-display text-2xl text-[#0b1c30]">{value}</strong><span className="text-xs font-semibold text-[#677284]">{label}</span></div>)}</div>
      {enrollments.length > 1 && <div className="mt-5 flex flex-wrap gap-2" aria-label="Your courses">{enrollments.map((e) => <Link key={e.id} href={`/challenge?course=${e.course.slug}`} aria-current={e.id === enrollment.id ? "page" : undefined} className={`tap inline-flex items-center rounded-full px-4 text-sm font-bold ${e.id === enrollment.id ? "bg-[#0b1c30] text-white" : "border border-[#cbd5e1] text-[#4d5768]"}`}>{e.course.title}</Link>)}</div>}
    </header>
    <div className="mt-8">{state.access.active ? <JourneyMap modules={state.modules} /> : <AccessEndedNotice endedAt={state.access.endsAt} timeZone={state.enrollment.user.profile?.timezone ?? undefined} />}</div>
  </div>;
}
