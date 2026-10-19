import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, BookOpen, Download, ExternalLink, Trophy } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatIssueDate } from "@/lib/certificates";
import { loadCourseState, syncAchievements } from "@/lib/learning/progress";

export const dynamic = "force-dynamic";
export const metadata = { title: "My certificates" };

export default async function CertificatesPage() {
  const session = await auth();
  if (!session?.user.id) redirect("/login");
  const userId = session.user.id;
  await syncAchievements(userId);
  const [moduleCertificates, courseCertificates, enrollments] = await Promise.all([
    db.moduleCertificate.findMany({ where: { userId, revokedAt: null }, orderBy: [{ courseTitle: "asc" }, { moduleOrder: "asc" }], include: { module: { include: { lessons: { orderBy: { dayNumber: "asc" }, take: 1, select: { slug: true } } } } } }),
    db.certificate.findMany({ where: { userId }, include: { course: true }, orderBy: { issueDate: "desc" } }),
    db.enrollment.findMany({ where: { userId, status: { in: ["ACTIVE", "COMPLETED"] } }, select: { courseId: true } }),
  ]);
  const states = (await Promise.all(enrollments.map((e) => loadCourseState(userId, e.courseId)))).filter((s) => !!s);
  const upcoming = states.flatMap((s) => s.modules.filter((m) => !m.certificate).map((m) => ({ ...m, courseTitle: s.course.title })));

  return <div className="mx-auto max-w-5xl">
    <header><p className="eyebrow">My certificates</p><h1 className="display mt-2 text-4xl text-[#0b1c30] sm:text-5xl">Proof of what you can do.</h1><p className="mt-3 max-w-2xl leading-7 text-[#4d5768]">Every module you master earns a signed, verifiable certificate with its own QR code and link. Download it, add it to LinkedIn, or share it anywhere.</p></header>

    {moduleCertificates.length + courseCertificates.length === 0 && <div className="surface mt-8 p-6 text-[#4d5768]">You haven’t earned a certificate yet. Your first one comes when you master every stage of a level. The requirements are listed below.</div>}

    {(moduleCertificates.length > 0 || courseCertificates.length > 0) && <ul className="mt-8 grid gap-4 sm:grid-cols-2">
      {courseCertificates.map((c) => <li key={c.id} className="surface overflow-hidden"><div className="surface-dark rounded-none p-5"><Trophy className="text-[#f2b01e]" /><p className="eyebrow mt-3 !text-[#ffd36b]">Course certificate</p><h2 className="mt-1 font-display text-xl font-bold">{c.course.title}</h2></div><div className="flex flex-wrap items-center gap-2 p-4"><span className="mr-auto text-sm text-[#4d5768]">{formatIssueDate(c.issueDate)}</span><a href={`/api/certificates/${c.uniqueHash}`} className="tap inline-flex items-center gap-1.5 rounded-full border border-[#cbd5e1] px-4 text-sm font-bold"><Download size={15} />PDF</a><Link href={`/verify/${c.uniqueHash}`} className="tap inline-flex items-center gap-1.5 rounded-full bg-[#0058be] px-4 text-sm font-bold text-white">View &amp; share <ExternalLink size={14} /></Link></div></li>)}
      {moduleCertificates.map((c) => <li key={c.id} className="surface overflow-hidden"><div className="flex gap-4 border-b border-[#dfe5ee] bg-[#fff9e8] p-5"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#f2b01e] text-[#0b1c30]"><Award size={22} /></span><div className="min-w-0"><p className="eyebrow">Module {c.moduleOrder} · {c.courseTitle}</p><h2 className="mt-1 font-display text-xl font-bold text-[#0b1c30]">{c.moduleTitle}</h2><p className="mt-1 font-mono text-xs text-[#677284]">{c.credentialId}</p></div></div><div className="flex flex-wrap items-center gap-2 p-4"><span className="mr-auto text-sm text-[#4d5768]">{formatIssueDate(c.issuedAt)}</span>{c.module.lessons[0] && <Link href={`/challenge/${c.module.lessons[0].slug}`} className="tap inline-flex items-center gap-1.5 rounded-full px-3 text-sm font-bold text-[#4d5768]" title="Review the module"><BookOpen size={15} />Review</Link>}<a href={`/api/certificates/${c.credentialId}`} className="tap inline-flex items-center gap-1.5 rounded-full border border-[#cbd5e1] px-4 text-sm font-bold"><Download size={15} />PDF</a><Link href={`/verify/${c.credentialId}`} className="tap inline-flex items-center gap-1.5 rounded-full bg-[#0058be] px-4 text-sm font-bold text-white">View &amp; share <ExternalLink size={14} /></Link></div></li>)}
    </ul>}

    {upcoming.length > 0 && <section className="mt-10" aria-labelledby="upcoming"><h2 id="upcoming" className="font-display text-2xl font-bold text-[#0b1c30]">Still to earn</h2><ul className="mt-4 grid gap-4 sm:grid-cols-2">{upcoming.map((m) => <li key={m.id} className="surface p-5"><p className="eyebrow !text-[#677284]">Module {m.orderIndex} · {m.courseTitle}</p><h3 className="mt-1 font-display text-lg font-bold text-[#0b1c30]">{m.title}</h3><div className="xp-bar mt-3"><span style={{ width: `${m.progress}%` }} /></div><ul className="mt-3 grid gap-1.5 text-sm text-[#4d5768]">{m.requirements.map((r) => <li key={r.key} className="flex items-center gap-2"><span className={`size-2 rounded-full ${r.met ? "bg-[#146c43]" : "bg-[#cbd5e1]"}`} />{r.label}<span className="ml-auto text-xs">{r.done}/{r.total}</span></li>)}</ul></li>)}</ul></section>}
  </div>;
}
