import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { AccessEndedNotice } from "@/components/learning/access-notice";
import { accessStatus, daysRemaining } from "@/lib/access";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TRACKS } from "@/lib/tracks";

export const dynamic = "force-dynamic";

export default async function LessonsPage({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const session = await auth();
  if (!session?.user.id) redirect("/login");
  const requested = (await searchParams).course;
  const enrollments = await db.enrollment.findMany({
    where: { userId: session.user.id, course: { slug: { in: TRACKS.map((track) => track.slug) } } },
    include: { course: { include: { modules: { orderBy: { orderIndex: "asc" }, include: { lessons: { orderBy: { dayNumber: "asc" }, select: { id: true, slug: true, title: true, dayNumber: true } } } } } } },
    orderBy: { purchasedAt: "desc" },
  });
  if (!enrollments.length) redirect("/dashboard");
  const enrollment = enrollments.find((item) => item.course.slug === requested) ?? enrollments[0]!;
  const access = accessStatus(enrollment);
  const lessonCount = enrollment.course.modules.reduce((count, module) => count + module.lessons.length, 0);
  return <div className="mx-auto max-w-5xl">
    <Link href="/dashboard" className="text-sm font-bold text-[#10294f] underline">Your dashboard</Link>
    <p className="eyebrow mt-7">{enrollment.course.title}</p>
    <h1 className="display mt-3 text-4xl text-[#10294f] sm:text-5xl">Your lessons</h1>
    <p className="mt-4 max-w-2xl leading-7 text-[#4d5768]">{enrollment.course.modules.length} modules · {lessonCount} guided lessons. Complete each one, including the capstone, to earn your track certificate.</p>
    {enrollments.length > 1 && <nav aria-label="Your tracks" className="mt-6 flex flex-wrap gap-2">{enrollments.map((item) => <Link key={item.id} href={`/challenge?course=${item.course.slug}`} aria-current={item.id === enrollment.id ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-bold ${item.id === enrollment.id ? "bg-[#10294f] text-white" : "border border-[#cbd5e1] text-[#10294f]"}`}>{TRACKS.find((track) => track.slug === item.course.slug)?.audience ?? item.course.title}</Link>)}</nav>}
    {!access.active ? <div className="mt-8"><AccessEndedNotice endedAt={access.endsAt} courseSlug={enrollment.course.slug} /></div> : <><p className="mt-6 text-sm font-bold text-[#146c43]">{daysRemaining(access.endsAt)} days of access remaining</p><div className="mt-8 grid gap-5">{enrollment.course.modules.map((module) => <section key={module.id} className="surface p-6" aria-labelledby={`module-${module.id}`}><h2 id={`module-${module.id}`} className="font-display text-2xl font-bold text-[#10294f]">{module.title}</h2><ul className="mt-4 divide-y divide-[#e2e8f0]">{module.lessons.map((lesson) => <li key={lesson.id}><Link href={`/challenge/${enrollment.course.slug}/${lesson.slug}`} className="flex items-center justify-between gap-4 py-3 font-semibold text-[#10294f] hover:underline"><span>{lesson.title}</span>{enrollment.completedDays.includes(lesson.dayNumber) ? <Check aria-label="Completed" className="shrink-0 text-[#146c43]" size={18} /> : <ArrowRight aria-hidden="true" className="shrink-0 text-[#8a94a6]" size={16} />}</Link></li>)}</ul></section>)}</div></>}
  </div>;
}
