import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { CompleteButton } from "@/components/challenge/complete-button";
import { AccessEndedNotice } from "@/components/learning/access-notice";
import { accessStatus } from "@/lib/access";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isTrackSlug } from "@/lib/tracks";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function LessonPage({ params }: { params: Promise<{ course: string; slug: string }> }) {
  const { course, slug } = await params;
  if (!isTrackSlug(course)) notFound();
  const session = await auth();
  if (!session?.user.id) redirect(`/login?next=${encodeURIComponent(`/challenge/${course}/${slug}`)}`);
  const lesson = await db.lesson.findFirst({
    where: { slug, module: { course: { slug: course } } },
    select: { id: true, slug: true, dayNumber: true, title: true, summary: true, module: { select: { title: true, courseId: true, course: { select: { slug: true, title: true } } } } },
  });
  if (!lesson) notFound();
  const enrollment = await db.enrollment.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId: lesson.module.courseId } } });
  const back = `/challenge?course=${course}`;
  if (!enrollment) return <div className="mx-auto max-w-3xl"><Link href={back} className="text-sm font-bold text-[#10294f] underline">Back to tracks</Link><div className="surface mt-8 p-6 sm:p-8"><LockKeyhole className="text-[#10294f]" size={32} /><h1 className="display mt-4 text-3xl text-[#10294f]">Enrol to open this lesson.</h1><p className="mt-3 leading-7 text-[#4d5768]">Every lesson in this track requires a paid enrollment. Buy this track to get three months of access.</p><Link href={`/checkout?course=${course}`} className="tap mt-6 inline-flex rounded-full bg-[#10294f] px-6 py-3 font-bold text-white">Enrol now · ₦20,000</Link></div></div>;
  const access = accessStatus(enrollment);
  if (!access.active) return <div className="mx-auto max-w-3xl"><Link href="/dashboard" className="text-sm font-bold text-[#10294f] underline">Your dashboard</Link><div className="mt-8"><AccessEndedNotice endedAt={access.endsAt} courseSlug={course} /></div></div>;

  // Fetch the protected content only after the paid, unexpired enrollment check.
  const content = await db.lesson.findUnique({ where: { id: lesson.id }, select: { contentMarkdown: true } });
  if (!content) notFound();
  const completed = enrollment.completedDays.includes(lesson.dayNumber);
  return <article className="mx-auto max-w-3xl pb-20"><Link href={back} className="inline-flex items-center gap-2 text-sm font-bold text-[#10294f]"><ArrowLeft size={16} />All lessons</Link><header className="mt-8"><p className="eyebrow">{lesson.module.course.title} · {lesson.module.title}</p><h1 className="display mt-3 text-4xl text-[#10294f] sm:text-5xl">{lesson.title}</h1>{lesson.summary && <p className="mt-4 text-lg leading-8 text-[#4d5768]">{lesson.summary}</p>}</header><div className="lesson-prose mt-9"><ReactMarkdown remarkPlugins={[remarkGfm]}>{content.contentMarkdown}</ReactMarkdown></div><CompleteButton lessonId={lesson.id} completed={completed} /></article>;
}
