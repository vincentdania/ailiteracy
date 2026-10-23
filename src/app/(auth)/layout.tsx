import Link from "next/link";
import Image from "next/image";
import { AcademyLockup } from "@/components/brand/hyrax-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]"><section className="flex items-center justify-center bg-[#f6f8fb] p-5 py-12"><div className="w-full max-w-md"><Link href="/" className="mb-10 inline-block text-xl" aria-label="Hyrax AI Academy home"><AcademyLockup /></Link>{children}</div></section><aside className="relative hidden min-h-screen overflow-hidden bg-[#10294f] text-white lg:flex lg:flex-col lg:justify-end"><Image src="/images/nigerian-professionals-learning.jpg" alt="Nigerian professionals collaborating" fill sizes="55vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#10294f] via-[#10294f]/45 to-transparent" /><div className="relative max-w-2xl p-16"><p className="eyebrow eyebrow-inverse">Built for working people</p><p className="display mt-5 text-6xl">Pick your track. Put AI to work.</p><p className="mt-7 text-white/70">Build along with guided lessons and templates. Learn on your phone or laptop, with three months of access from purchase.</p><p className="mt-10 text-xs font-bold uppercase tracking-[.2em] text-white/60">HYRAX · The AI Enablement Company.</p></div></aside></main>;
}
