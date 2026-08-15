import Link from "next/link";
import { Check, LockKeyhole, Play } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canAccessLesson, unlockedDay } from "@/lib/challenge";
import { Progress } from "@/components/ui/progress";

export const dynamic = "force-dynamic";

export default async function ChallengePage() {
  const session = await auth();
  if (!session?.user.id) redirect("/login");
  const enrollment = await db.enrollment.findFirst({ where: { userId: session.user.id, status: { in: ["ACTIVE","COMPLETED"] } }, include: { user: { include: { profile: true } }, course: { include: { modules: { orderBy: { orderIndex: "asc" }, include: { lessons: { orderBy: { dayNumber: "asc" } } } } } } } });
  if (!enrollment) redirect("/checkout");
  const available = unlockedDay(enrollment.enrolledAt, new Date(), enrollment.user.profile?.timezone ?? "Africa/Lagos", enrollment.previewOverride);
  const completeCount = enrollment.completedDays.filter((day) => day <= 21).length;
  return <div className="mx-auto max-w-5xl"><p className="eyebrow">The 21-Day AI Challenge</p><div className="mt-2 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><h1 className="display text-6xl">Your curriculum.</h1><div className="w-full sm:max-w-xs"><Progress value={(completeCount/21)*100} label={`${completeCount} of 21 complete`} /></div></div><div className="mt-10 grid gap-7">{enrollment.course.modules.map((courseModule) => <section key={courseModule.id} className="overflow-hidden rounded-3xl border border-[#dce2dd] bg-white"><header className="flex items-center gap-4 border-b border-[#dce2dd] bg-[#f4f6f1] px-6 py-5"><span className="grid size-10 place-items-center rounded-xl bg-[#123c31] font-black text-[#d9f99d]">{courseModule.orderIndex}</span><div><h2 className="font-black">{courseModule.title}</h2><p className="text-sm text-[#5f6f67]">{courseModule.lessons.length} {courseModule.orderIndex === 6 ? "bonus lesson" : "practical lessons"}</p></div></header><div className="divide-y divide-[#edf0ed]">{courseModule.lessons.map((lesson) => { const accessible=canAccessLesson({dayNumber:lesson.dayNumber,isBonus:lesson.isBonus,bonusUnlocked:enrollment.bonusUnlocked,unlockedDay:available}); const complete=enrollment.completedDays.includes(lesson.dayNumber); const row=<div className={`flex items-center gap-4 px-6 py-5 ${accessible ? "hover:bg-[#fafbf8]" : "opacity-55"}`}><span className={`grid size-9 shrink-0 place-items-center rounded-full ${complete ? "bg-[#d9f99d] text-[#123c31]" : accessible ? "bg-[#e6efdf] text-[#123c31]" : "bg-[#ecefed] text-[#7e8983]"}`}>{complete ? <Check size={17} /> : accessible ? <Play size={15} fill="currentColor" /> : <LockKeyhole size={15} />}</span><div className="min-w-0 flex-1"><p className="font-bold">{lesson.isBonus ? "Bonus" : `Day ${lesson.dayNumber}`} · {lesson.title}</p><p className="truncate text-sm text-[#5f6f67]">{lesson.summary}</p></div>{lesson.isFreePreview && <span className="rounded-full bg-[#d9f99d] px-2 py-1 text-[10px] font-black uppercase text-[#123c31]">Preview</span>}</div>; return accessible ? <Link key={lesson.id} href={`/challenge/${lesson.slug}`}>{row}</Link> : <div key={lesson.id}>{row}</div>; })}</div></section>)}</div></div>;
}
