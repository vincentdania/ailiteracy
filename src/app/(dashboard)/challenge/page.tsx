import Link from "next/link";
import { ArrowRight, Check, LockKeyhole, Play } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccessLesson, unlockedDay } from "@/lib/challenge";
import { Progress } from "@/components/ui/progress";

export const dynamic = "force-dynamic";

export default async function ChallengePage() {
  const session = await auth();
  if (!session?.user.id) redirect("/login");
  const enrollment = await db.enrollment.findFirst({ where: { userId: session.user.id, status: { in: ["ACTIVE", "COMPLETED"] } }, include: { user: { include: { profile: true } }, course: { include: { modules: { orderBy: { orderIndex: "asc" }, include: { lessons: { orderBy: { dayNumber: "asc" } } } } } } } });
  if (!enrollment) redirect("/checkout");
  const available = unlockedDay(enrollment.enrolledAt, new Date(), enrollment.user.profile?.timezone ?? "Africa/Lagos", enrollment.previewOverride);
  const completeCount = enrollment.completedDays.filter((day) => day <= 21).length;

  return <div className="mx-auto max-w-4xl">
    <header><p className="eyebrow">21-Day AI Challenge</p><h1 className="display mt-3 text-5xl text-[#00261d] sm:text-6xl">Your roadmap</h1><p className="mt-4 max-w-2xl leading-7 text-[#414845]">One lesson unlocks each day.</p><div className="mt-7 max-w-sm"><Progress value={(completeCount / 21) * 100} label={`${completeCount} of 21 complete`} /></div></header>

    <div className="relative mt-12 space-y-12 before:absolute before:bottom-10 before:left-5 before:top-5 before:w-px before:bg-[#d9dfdc] sm:before:left-6">
      {enrollment.course.modules.map((courseModule, moduleIndex) => {
        const moduleComplete = courseModule.lessons.filter((lesson) => !lesson.isBonus).every((lesson) => enrollment.completedDays.includes(lesson.dayNumber));
        const isCurrent = courseModule.lessons.some((lesson) => lesson.dayNumber === available);
        return <section key={courseModule.id} className="relative grid grid-cols-[2.5rem_1fr] gap-4 sm:grid-cols-[3rem_1fr] sm:gap-6">
          <span className={`relative z-10 grid size-10 place-items-center rounded-full border-2 text-sm font-bold sm:size-12 ${moduleComplete ? "border-[#7a958a] bg-[#7a958a] text-white" : isCurrent ? "border-[#00261d] bg-[#f8f7f1] text-[#00261d]" : "border-[#c6cfe9] bg-[#e2e7ff] text-[#8c96b3]"}`}>{moduleComplete ? <Check size={19} /> : moduleIndex + 1}</span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#717975]">Phase {moduleIndex + 1}</p>
            <h2 className={`mt-1 font-serif text-3xl font-semibold ${isCurrent || moduleComplete ? "text-[#00261d]" : "text-[#414845]"}`}>{courseModule.title}</h2>
            <div className="mt-5 grid gap-3">
              {courseModule.lessons.map((lesson) => {
                const accessible = canAccessLesson({ dayNumber: lesson.dayNumber, isBonus: lesson.isBonus, bonusUnlocked: enrollment.bonusUnlocked, unlockedDay: available });
                const complete = enrollment.completedDays.includes(lesson.dayNumber);
                const current = accessible && !complete && lesson.dayNumber <= available;
                const row = <div className={`editorial-card flex items-center gap-4 p-4 transition sm:p-5 ${accessible ? "hover:-translate-y-0.5 hover:border-[#7da798]" : "opacity-60"} ${current ? "border-[#123c31] bg-[#123c31] text-white" : ""}`}><span className={`grid size-9 shrink-0 place-items-center rounded-full ${complete ? "bg-[#ceee93] text-[#00261d]" : current ? "bg-[#ceee93] text-[#00261d]" : accessible ? "bg-[#e7ece8] text-[#00261d]" : "bg-[#eef0f4] text-[#717975]"}`}>{complete ? <Check size={16} /> : accessible ? <Play size={14} fill="currentColor" /> : <LockKeyhole size={15} />}</span><div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-wider opacity-70">{lesson.isBonus ? "Bonus lesson" : `Day ${String(lesson.dayNumber).padStart(2, "0")}`}</p><h3 className="mt-1 truncate font-serif text-xl font-semibold">{lesson.title}</h3></div>{current && <span className="hidden items-center gap-1 text-xs font-bold text-[#ceee93] sm:flex">Today <ArrowRight size={14} /></span>}{lesson.isFreePreview && !current && <span className="rounded-full bg-[#ceee93] px-2 py-1 text-[10px] font-bold uppercase text-[#00261d]">Preview</span>}</div>;
                return accessible ? <Link key={lesson.id} href={`/challenge/${lesson.slug}`}>{row}</Link> : <div key={lesson.id}>{row}</div>;
              })}
            </div>
          </div>
        </section>;
      })}
    </div>
  </div>;
}
