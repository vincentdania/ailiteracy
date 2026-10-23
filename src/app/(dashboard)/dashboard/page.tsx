import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, CalendarClock, LockKeyhole } from "lucide-react";
import { AccessEndedNotice } from "@/components/learning/access-notice";
import { LearningSettings } from "@/components/learning/learning-settings";
import { NotificationSettings } from "@/components/dashboard/notification-settings";
import { accessStatus, daysRemaining, formatAccessDate } from "@/lib/access";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TRACKS } from "@/lib/tracks";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ payment?: string }> }) {
  const session = await auth();
  if (!session?.user.id) redirect("/login");
  const userId = session.user.id;
  const [enrollments, user] = await Promise.all([
    db.enrollment.findMany({ where: { userId, course: { slug: { in: TRACKS.map((track) => track.slug) } } }, include: { course: { select: { slug: true, title: true } } } }),
    db.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ]);
  const pending = (await searchParams).payment === "pending";
  const firstName = user?.name?.split(" ")[0] ?? "there";
  return <div className="mx-auto max-w-6xl">
    <header><p className="eyebrow">Your learning home</p><h1 className="display mt-3 text-4xl text-[#10294f] sm:text-5xl">Hello, {firstName}.</h1><p className="mt-4 max-w-2xl leading-7 text-[#4d5768]">Your tracks, lessons and certificates live here. Choose one track or build both.</p></header>
    {pending && <div role="status" className="mt-7 rounded-2xl border border-[#f6e7d8] bg-[#f6e7d8] p-5 text-sm leading-6 text-[#10294f]">Paystack is confirming your payment. Your lessons will open after its verified webhook arrives. Refresh this page shortly; if access does not appear, contact Support.</div>}
    <section className="mt-8 grid gap-6 lg:grid-cols-2" aria-label="Your tracks">{TRACKS.map((track) => {
      const enrollment = enrollments.find((item) => item.course.slug === track.slug);
      const access = enrollment ? accessStatus(enrollment) : null;
      return <article key={track.slug} className="surface p-6 sm:p-8"><p className="eyebrow">{track.audience}</p><h2 className="mt-3 font-display text-2xl font-bold leading-tight text-[#10294f]">{track.title}</h2><p className="mt-4 leading-7 text-[#4d5768]">{track.subline}</p>{access?.active ? <><p className="mt-6 flex items-center gap-2 text-sm font-bold text-[#146c43]"><CalendarClock size={17} />{daysRemaining(access.endsAt)} days remaining · until {formatAccessDate(access.endsAt)}</p><Link href={`/challenge?course=${track.slug}`} className="tap mt-5 inline-flex items-center rounded-full bg-[#10294f] px-6 py-3 font-bold text-white"><BookOpen className="mr-2" size={18} />Open lessons</Link></> : access?.kind === "expired" ? <><p className="mt-6 flex items-center gap-2 text-sm font-bold text-[#8a5300]"><LockKeyhole size={17} />Access ended {formatAccessDate(access.endsAt)}</p><Link href={`/checkout?course=${track.slug}`} className="tap mt-5 inline-flex items-center rounded-full bg-[#10294f] px-6 py-3 font-bold text-white">Renew this track <ArrowRight className="ml-2" size={17} /></Link></> : <><p className="mt-6 text-sm font-bold text-[#10294f]">₦20,000 · 3 months access</p><Link href={`/checkout?course=${track.slug}`} className="tap mt-5 inline-flex items-center rounded-full bg-[#10294f] px-6 py-3 font-bold text-white">Enrol now <ArrowRight className="ml-2" size={17} /></Link></>}</article>;
    })}</section>
    {enrollments.some((item) => !accessStatus(item).active) && <div className="mt-8 grid gap-4">{enrollments.filter((item) => !accessStatus(item).active).map((item) => { const access = accessStatus(item); return <AccessEndedNotice key={item.id} endedAt={access.endsAt} courseSlug={item.course.slug} />; })}</div>}
    <section id="settings" className="mt-10 grid scroll-mt-24 gap-5 md:grid-cols-2" aria-label="Settings"><LearningSettings name={user?.name ?? ""} /><NotificationSettings /></section>
  </div>;
}
