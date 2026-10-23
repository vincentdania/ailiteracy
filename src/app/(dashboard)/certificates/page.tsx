import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, ExternalLink, Trophy } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatIssueDate } from "@/lib/certificates";
import { TRACKS } from "@/lib/tracks";

export const dynamic = "force-dynamic";
export const metadata = { title: "My certificates" };

export default async function CertificatesPage() {
  const session = await auth();
  if (!session?.user.id) redirect("/login");
  const certificates = await db.certificate.findMany({
    where: { userId: session.user.id, course: { slug: { in: TRACKS.map((track) => track.slug) } } },
    include: { course: { select: { title: true } } },
    orderBy: { issueDate: "desc" },
  });
  return <div className="mx-auto max-w-5xl"><p className="eyebrow">My certificates</p><h1 className="display mt-2 text-4xl text-[#10294f] sm:text-5xl">Your completed tracks.</h1><p className="mt-3 max-w-2xl leading-7 text-[#4d5768]">Complete every lesson, including the capstone, to earn a certificate of completion for each track. Every certificate has a public verification page.</p>
    {certificates.length === 0 ? <div className="surface mt-8 p-6 text-[#4d5768]">You have no certificates yet. <Link className="font-bold text-[#214889] underline" href="/dashboard">Explore your tracks</Link>.</div> : <ul className="mt-8 grid gap-4 sm:grid-cols-2">{certificates.map((certificate) => <li key={certificate.id} className="surface overflow-hidden"><div className="surface-dark rounded-none p-5"><Trophy className="text-[#f2b01e]" /><p className="eyebrow mt-3 !text-[#ffd36b]">Certificate of completion</p><h2 className="mt-1 font-display text-xl font-bold">{certificate.course.title}</h2></div><div className="flex flex-wrap items-center gap-2 p-4"><span className="mr-auto text-sm text-[#4d5768]">{formatIssueDate(certificate.issueDate)}</span><a href={`/api/certificates/${certificate.uniqueHash}/png`} className="tap inline-flex items-center gap-1.5 rounded-full border border-[#cbd5e1] px-4 py-2 text-sm font-bold"><Download size={15} />PNG</a><a href={`/api/certificates/${certificate.uniqueHash}`} className="tap inline-flex items-center gap-1.5 rounded-full border border-[#cbd5e1] px-4 py-2 text-sm font-bold"><Download size={15} />PDF</a><Link href={`/verify/${certificate.uniqueHash}`} className="tap inline-flex items-center gap-1.5 rounded-full border border-[#cbd5e1] px-4 py-2 text-sm font-bold"><ExternalLink size={15} />Verify</Link></div></li>)}</ul>}
  </div>;
}
