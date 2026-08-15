import type { Metadata } from "next";
import Link from "next/link";
import { Award, CheckCircle2, Download } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ certificateHash: string }> }): Promise<Metadata> {
  const { certificateHash } = await params;
  return { title: "Verify credential", description: `Verify AI Literacy credential ${certificateHash.slice(0, 12)}` };
}

export default async function VerifyPage({ params }: { params: Promise<{ certificateHash: string }> }) {
  const { certificateHash } = await params;
  const certificate = await db.certificate.findUnique({ where: { uniqueHash: certificateHash }, include: { user: true, course: true } });
  if (!certificate) notFound();
  return <main className="container-shell grid min-h-screen place-items-center py-16"><article className="w-full max-w-3xl rounded-[2rem] border border-[#dce2dd] bg-white p-7 text-center card-shadow sm:p-12"><span className="mx-auto grid size-20 place-items-center rounded-full bg-[#e7f6d4] text-[#123c31]"><Award size={38} /></span><p className="eyebrow mt-7">Authentic AI Literacy credential</p><h1 className="display mt-3 text-5xl sm:text-6xl">Completion verified.</h1><div className="mx-auto mt-8 max-w-xl rounded-2xl bg-[#f3f5ef] p-6"><CheckCircle2 className="mx-auto text-[#1d604d]" /><strong className="mt-4 block text-2xl">{certificate.user.name ?? certificate.user.email}</strong><p className="mt-2 text-[#5f6f67]">completed {certificate.course.title} on {certificate.issueDate.toLocaleDateString("en-GB", { dateStyle: "long" })}.</p></div><p className="mx-auto mt-6 max-w-xl break-all font-mono text-xs leading-5 text-[#5f6f67]">{certificate.uniqueHash}</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button asChild><a href={`/api/certificates/${certificate.uniqueHash}`}><Download className="mr-2" size={17} />Download certificate</a></Button><Button asChild variant="secondary"><Link href="/">Visit AI Literacy</Link></Button></div></article></main>;
}
