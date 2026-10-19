import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { AcademyLockup } from "@/components/brand/hyrax-logo";
import { CertificateArtwork } from "@/components/certificates/certificate-artwork";
import { SharePanel } from "@/components/certificates/share-panel";
import { certificateTitle, credentialLabel, findCertificate } from "@/lib/certificate-records";
import { formatIssueDate, ISSUER, linkedInAddToProfileUrl, shareLinks } from "@/lib/certificates";

export const dynamic = "force-dynamic";

const HIDDEN_NAME = "Name withheld by the learner";

export async function generateMetadata({ params }: { params: Promise<{ certificateHash: string }> }): Promise<Metadata> {
  const { certificateHash } = await params;
  const record = await findCertificate(certificateHash);
  if (!record) return { title: "Certificate not found", robots: { index: false } };
  const who = record.showName ? record.learnerName : "A Hyrax learner";
  const title = `${who} completed ${certificateTitle(record)}`;
  return { title, description: `Verified Hyrax AI Academy certificate ${credentialLabel(record)}, issued ${formatIssueDate(record.issuedAt)} by ${ISSUER.name}.`, robots: { index: false, follow: false }, openGraph: { title, type: "website" }, twitter: { card: "summary_large_image", title } };
}

export default async function VerifyPage({ params }: { params: Promise<{ certificateHash: string }> }) {
  const { certificateHash } = await params;
  const [record, session] = await Promise.all([findCertificate(certificateHash), auth()]);
  if (!record) notFound();
  const isOwner = session?.user.id === record.userId;
  const displayName = record.showName || isOwner ? record.learnerName : HIDDEN_NAME;
  const name = record.kind === "module" ? `${record.moduleTitle} · ${record.courseTitle}` : record.courseTitle;
  const shareText = record.kind === "module" ? `I just earned my Hyrax AI Academy certificate for "${record.moduleTitle}" in ${record.courseTitle}.` : `I just completed ${record.courseTitle} with Hyrax AI Academy.`;

  return <main className="min-h-screen bg-[#f6f8fb]">
    <header className="no-print border-b border-[#dfe5ee] bg-white"><div className="container-shell flex h-16 items-center justify-between"><Link href="/" className="text-lg" aria-label="Hyrax AI Academy"><AcademyLockup /></Link>{isOwner ? <Link href="/certificates" className="text-sm font-bold text-[#0058be]">My certificates</Link> : <Link href="/" className="text-sm font-bold text-[#0058be]">About the course</Link>}</div></header>
    <div className="container-shell max-w-5xl py-8 sm:py-12">
      <div className={`no-print flex items-start gap-3 rounded-2xl p-4 sm:items-center ${record.revoked ? "bg-[#fdeceb] text-[#7a1b15]" : "bg-[#e6f4ec] text-[#0b3d26]"}`} role="status">
        {record.revoked ? <ShieldAlert className="shrink-0" /> : <ShieldCheck className="shrink-0 text-[#146c43]" />}
        <p className="text-sm leading-6 sm:text-base"><strong>{record.revoked ? "This certificate has been revoked." : "This certificate is genuine. It was issued by Hyrax AI Academy."}</strong> {record.revoked ? "It is no longer valid." : `We checked it against our records just now. Credential ID: ${credentialLabel(record)}.`}</p>
      </div>

      <div className="mt-6"><CertificateArtwork record={record} displayName={displayName} /></div>

      <div className="no-print mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section className="surface p-5 sm:p-7" aria-labelledby="details">
          <h1 id="details" className="font-display text-2xl font-bold text-[#0b1c30]">Certificate details</h1>
          <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[10rem_1fr]">
            {([["Learner", displayName], ["Course", record.courseTitle], ...(record.kind === "module" ? [["Module", `Module ${record.moduleOrder}: ${record.moduleTitle}`]] : []), ["Type", record.kind === "module" ? "Module certificate of completion" : "Course certificate of completion"], ["Completion date", formatIssueDate(record.issuedAt)], ["Issued by", `${ISSUER.name} (${ISSUER.academy})`], ["Signed by", `${ISSUER.signatory}, ${ISSUER.signatoryTitle}`], ["Credential ID", credentialLabel(record)], ["Verification URL", record.url]] as [string, string][]).map(([term, value]) => <div key={term} className="contents"><dt className="font-semibold text-[#677284]">{term}</dt><dd className="break-words font-medium text-[#0b1c30]">{value}</dd></div>)}
          </dl>
          <h2 className="mt-7 font-display text-lg font-bold text-[#0b1c30]">What this certificate shows</h2>
          <ul className="mt-3 grid gap-2">{record.evidence.map((line) => <li key={line} className="flex gap-2.5 text-sm leading-6 text-[#26324a]"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#146c43]" />{line}</li>)}</ul>
          <p className="mt-4 rounded-xl bg-[#f6f8fb] p-3 text-xs leading-5 text-[#4d5768]">This certificate confirms that the learner completed a Hyrax AI Academy {record.kind === "module" ? "module" : "course"}, including its quizzes, missions and assessed practical work. It is a record of learning. It is not a professional licence or an accredited qualification.</p>
        </section>
        <aside className="grid content-start gap-5">
          {isOwner ? <section className="surface p-5" aria-label="Share your certificate"><h2 className="mb-4 font-display text-lg font-bold text-[#0b1c30]">Share your certificate</h2><SharePanel id={record.id} kind={record.kind} url={record.url} pdfHref={`/api/certificates/${record.id}`} pngHref={`/api/certificates/${record.id}/png`} shareText={shareText} showName={record.showName} links={shareLinks(record.url, shareText)} linkedInAdd={linkedInAddToProfileUrl({ name, issuedAt: record.issuedAt, credentialId: credentialLabel(record), url: record.url })} /><Link href={record.reviewHref} className="tap mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0058be]"><BookOpen size={16} />{record.kind === "module" ? "Review this module" : "Review the course"}</Link></section>
            : <section className="surface-dark p-6"><p className="eyebrow !text-[#ffd36b]">{ISSUER.tagline}</p><h2 className="display mt-3 text-2xl">Learn to use AI in your own work.</h2><p className="mt-3 text-sm leading-6 text-white/75">Ten short daily lessons using free AI tools on your phone, with a certificate for each module you complete and for the full course.</p><Link href="/" className="tap mt-5 inline-flex items-center gap-2 rounded-full bg-[#f2b01e] px-5 py-3 text-sm font-bold text-[#0b1c30]">Start learning <ArrowRight size={16} /></Link></section>}
        </aside>
      </div>
    </div>
  </main>;
}
